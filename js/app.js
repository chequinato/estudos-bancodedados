/* =========================================================================
   APP — roteamento, progresso, diagnóstico, oficina, flashcards e questões
   ========================================================================= */

(function () {
'use strict';

/* ----------------------------------------------------------- ARMAZENAMENTO

   O progresso mora no SQLite (js/db.js). Aqui fica só a cópia em memória,
   que é o que as telas leem a cada quadro. Toda alteração passa por
   save(), que traduz essa cópia de volta para as tabelas do banco.      */

const DAY = 86400000;
const today = () => Math.floor(Date.now() / DAY);
const BOX_WAIT = [0, 1, 3, 7, 16];   /* dias de espera por caixa */
const HIST_MAX = 240;

let store = { cards: {}, quiz: {}, of: {}, hist: [] };
let usuario = null;

function load() {
  const p = DB.carregarProgresso();
  store.cards = p.cards;
  store.quiz  = p.quiz;
  store.of    = p.of;
  store.hist  = p.hist;
}

let saveTimer = null;
function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => DB.salvarProgresso(store), 160);
}

const cardRec = id => store.cards[id] || (store.cards[id] = { b: 1, d: 0, s: 0 });

/* Junta o contexto e a resposta curta aos dados principais. */
function mergeExtras() {
  if (typeof CARDS_EXTRA === 'object') {
    CARDS.forEach(c => {
      const x = CARDS_EXTRA[c.id];
      if (x) { if (x.c) c.ctx = x.c; if (x.s) c.simple = x.s; }
    });
  }
  if (typeof QUIZ_EXTRA === 'object') {
    QUESTIONS.forEach(q => {
      const x = QUIZ_EXTRA[q.id];
      if (x) { if (x.c) q.ctx = x.c; if (x.s) q.simple = x.s; }
    });
  }
}

/* ------------------------------------------------------------ UTILITÁRIOS */

const $  = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));
const mod = id => MODULES.find(m => m.id === id);
const pad = n => String(n).padStart(2, '0');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
const plural = (n, s, p) => n + ' ' + (n === 1 ? s : p);

function shuffle(a) {
  const r = a.slice();
  for (let i = r.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const t = r[i]; r[i] = r[j]; r[j] = t;
  }
  return r;
}

function meter(pct, n, acc) {
  n = n || 12;
  const on = Math.round((pct / 100) * n);
  let h = '<div class="meter">';
  for (let i = 0; i < n; i++)
    h += `<i class="${i < on ? 'on' + (acc ? ' acc' : '') : ''}" style="--i:${i}"></i>`;
  return h + '</div>';
}

/* --------------------------------------------------------------- PROGRESSO */

function modStats(id) {
  const cs = CARDS.filter(c => c.m === id);
  const qs = QUESTIONS.filter(q => q.m === id);

  let cardPts = 0, stuck = 0, seenCards = 0;
  cs.forEach(c => {
    const r = store.cards[c.id];
    if (!r) return;
    seenCards++;
    cardPts += (r.b - 1) / 4;
    if (r.b <= 2 && r.s >= 2) stuck++;
  });

  let ans = 0, right = 0;
  qs.forEach(q => {
    const r = store.quiz[q.id];
    if (r) { ans++; if (r.last === 'r') right++; }
  });

  const cp = cs.length ? cardPts / cs.length : 0;
  const qp = qs.length ? right / qs.length : 0;
  let score;
  if (!cs.length)      score = Math.round(qp * 100);
  else if (!qs.length) score = Math.round(cp * 100);
  else                 score = Math.round((cp * 0.6 + qp * 0.4) * 100);

  return { score, ans, right, wrong: ans - right,
           acc: ans ? Math.round(right / ans * 100) : null,
           stuck, seenCards, nCards: cs.length, nQ: qs.length };
}

function ofStats() {
  let done = 0, total = 0, weak = [];
  OFICINA.forEach(c => {
    total += c.steps.length;
    const r = store.of[c.id] || {};
    Object.keys(r).forEach(k => {
      done++;
      if (r[k] < 70) weak.push({ caso: c, step: parseInt(k, 10), pct: r[k] });
    });
  });
  return { done, total, weak };
}

function globalStats() {
  const t = today();
  const due = CARDS.filter(c => { const r = store.cards[c.id]; return !r || r.d <= t; }).length;
  const mastered = CARDS.filter(c => { const r = store.cards[c.id]; return r && r.b >= 4; }).length;

  let ans = 0, right = 0;
  QUESTIONS.forEach(q => {
    const r = store.quiz[q.id];
    if (r) { ans++; if (r.last === 'r') right++; }
  });

  const recent = store.hist.slice(-20);
  const recentAcc = recent.length >= 4
    ? Math.round(recent.filter(h => h.ok).length / recent.length * 100) : null;

  const dom = Math.round(MODULES.reduce((s, m) => s + modStats(m.id).score, 0) / MODULES.length);

  /* ponto fraco: pior módulo entre os que já foram tocados */
  let weak = null;
  MODULES.forEach(m => {
    const st = modStats(m.id);
    const tocado = st.ans >= 2 || st.seenCards >= 3;
    if (!tocado) return;
    if (!weak || st.score < weak.score) weak = { m, score: st.score, st };
  });

  return { due, mastered, ans, right, dom, recentAcc,
           acc: ans ? Math.round(right / ans * 100) : null, weak };
}

/* ------------------------------------------------------------ ROTEAMENTO */

let view = 'painel';

function go(v) {
  view = v;
  $$('.view').forEach(s => s.classList.toggle('is-active', s.id === 'view-' + v));
  $$('.nav__item').forEach(b => b.setAttribute('aria-current', String(b.dataset.view === v)));
  window.scrollTo(0, 0);
  if (v === 'painel')    renderPainel();
  if (v === 'oficina')   renderOficina();
  if (v === 'cards')     renderCardFilters();
  if (v === 'quiz')      renderQuizFilters();
  if (v === 'diagramas') renderDiagramas();
  if (v === 'resumo')    renderResumo();
  if (v === 'prova')     renderProva();
  if (v === 'banco')     renderBanco();
  $('#topCtx').textContent = { painel: 'Painel', oficina: 'Oficina', cards: 'Flashcards',
    quiz: 'Questões', diagramas: 'Diagramas', resumo: 'Resumo', prova: 'Prova', banco: 'Banco' }[v];
}

$('#nav').addEventListener('click', e => {
  const b = e.target.closest('.nav__item');
  if (b) go(b.dataset.view);
});

/* ======================================================================
   DIAGNÓSTICO — o que estudar agora, a partir do rendimento
   ====================================================================== */

function diagnose() {
  const recs = [];
  const g = globalStats();
  const ofs = ofStats();

  /* 1. módulos com taxa de erro alta em questões */
  MODULES.forEach(m => {
    const st = modStats(m.id);
    if (st.ans < 2) return;
    const errRate = st.wrong / st.ans;
    if (errRate < 0.34) return;
    const r = RECOMMEND[m.id] || {};
    recs.push({
      score: 100 + st.wrong * 12 + errRate * 30,
      k: 'Ponto fraco · §' + pad(m.id),
      t: m.t,
      w: `Você errou <b>${st.wrong} de ${st.ans}</b> questões deste módulo. ` +
         (r.ref ? 'Comece pela ficha do resumo, depois refaça as questões.'
                : 'Refaça as questões deste módulo lendo a explicação de cada uma.'),
      act: r.ref ? { go: 'resumo', ref: r.ref } : { go: 'quiz', filter: 'm' + m.id },
      go: '→'
    });
  });

  /* 2. cards travados na caixa 1 ou 2 depois de duas ou mais tentativas */
  MODULES.forEach(m => {
    const st = modStats(m.id);
    if (st.stuck < 3) return;
    recs.push({
      score: 70 + st.stuck * 8,
      k: 'Travado · §' + pad(m.id),
      t: m.t,
      w: `<b>${plural(st.stuck, 'card continua preso', 'cards continuam presos')}</b> na caixa 1 ou 2 depois de várias tentativas. ` +
         'Decorar não está funcionando aqui — vale ver o assunto de outro jeito.',
      act: (RECOMMEND[m.id] || {}).diag
        ? { go: 'diagramas', diag: RECOMMEND[m.id].diag }
        : { go: 'cards', filter: 'm' + m.id },
      go: '→'
    });
  });

  /* 3. passos da oficina com nota baixa */
  ofs.weak.slice(0, 3).forEach(w => {
    recs.push({
      score: 85 + (70 - w.pct) / 2,
      k: 'Refazer · Oficina',
      t: w.caso.t + ' — passo ' + (w.step + 1),
      w: `Você fechou este passo com <b>${w.pct}%</b>. Refaça só ele: a trilha de passos ` +
         'no topo do caso deixa você pular direto.',
      act: { go: 'oficina', case: w.caso.id, step: w.step },
      go: '→'
    });
  });

  /* 4. cards vencidos */
  if (g.due >= 10) {
    recs.push({
      score: 60 + Math.min(g.due, 60) / 2,
      k: 'Revisão do dia',
      t: plural(g.due, 'card esperando', 'cards esperando'),
      w: 'A repetição espaçada só funciona se você fechar a fila do dia. ' +
         'São poucos minutos e é o que mais rende.',
      act: { go: 'cards', filter: 'due' },
      go: '→'
    });
  }

  /* 5. módulos ainda intocados — sugestão de próximo assunto */
  if (recs.length < 4) {
    const virgem = MODULES.filter(m => {
      const st = modStats(m.id);
      return st.ans === 0 && st.seenCards === 0;
    });
    if (virgem.length) {
      const m = virgem[0];
      const r = RECOMMEND[m.id] || {};
      recs.push({
        score: 40,
        k: 'Próximo assunto · §' + pad(m.id),
        t: m.t,
        w: 'Você ainda não tocou neste módulo. ' +
           (m.hot ? 'E ele é dos que mais caem.' : 'Comece pelos cards, são rápidos.'),
        act: r.of ? { go: 'oficina', case: r.of } : { go: 'cards', filter: 'm' + m.id },
        go: '→'
      });
    }
  }

  /* 6. oficina não iniciada */
  if (ofs.done === 0) {
    recs.push({
      score: 55,
      k: 'Prática guiada',
      t: 'Comece pela Locadora Rota 9',
      w: 'É o caso que percorre o processo inteiro — entidades, cardinalidade, DER, ' +
         'tabelas e normalização — em dez passos.',
      act: { go: 'oficina', case: 'of-locadora' },
      go: '→'
    });
  }

  /* 7. tudo em dia */
  if (!recs.length) {
    recs.push({
      score: 10,
      k: 'Nada urgente',
      t: 'Faça um simulado de 20 questões',
      w: 'Sem pontos fracos detectados e sem fila de revisão. Um simulado misturado ' +
         'é o jeito mais rápido de descobrir onde o modelo está frouxo.',
      act: { go: 'quiz', filter: 'sim' },
      go: '→'
    });
  }

  recs.sort((a, b) => b.score - a.score);
  return recs.slice(0, 5);
}

let currentRecs = [];

function renderRecs() {
  currentRecs = diagnose();
  $('#recs').innerHTML = currentRecs.map((r, i) => `
    <button class="rec ${i === 0 ? 'rec--now' : ''}" data-rec="${i}" style="--i:${i}">
      <span>
        <span class="rec__k">${r.k}</span>
        <span class="rec__t">${r.t}</span>
        <span class="rec__w">${r.w}</span>
      </span>
      <span class="rec__go">${r.go}</span>
    </button>`).join('');
}

$('#recs').addEventListener('click', e => {
  const b = e.target.closest('.rec');
  if (!b) return;
  applyRec(currentRecs[parseInt(b.dataset.rec, 10)].act);
});

function applyRec(a) {
  if (!a) return;
  if (a.filter && a.go === 'cards') cardFilter = a.filter;
  if (a.filter && a.go === 'quiz')  quizFilter = a.filter;
  if (a.go === 'oficina') {
    ofCase = null;
    go('oficina');
    if (a.case) { openCase(a.case, a.step); }
    return;
  }
  go(a.go);
  if (a.ref) {
    const el = $(`.acc[data-id="${a.ref}"]`);
    if (el) { el.classList.add('open'); el.scrollIntoView({ block: 'start' }); }
  }
  if (a.diag) {
    const el = $(`.dcard[data-d="${a.diag}"]`);
    if (el) el.scrollIntoView({ block: 'start' });
  }
}

/* --------------------------------------------------------------- PAINEL */

function renderPainel() {
  const s = globalStats();
  const ofs = ofStats();

  $('#topPct').textContent = s.dom + '%';
  $('#deckSize').textContent = CARDS.length + ' cards · ' + QUESTIONS.length + ' questões · '
    + OFICINA.length + ' casos guiados · ' + DIAGRAMS.length + ' diagramas';
  $('#bandNote').textContent = s.mastered + ' na memória · oficina ' + ofs.done + '/' + ofs.total;
  $('#actReviewSub').textContent = s.due
    ? s.due + ' cards vencidos ou inéditos'
    : 'Fila vazia — escolha um módulo';
  $('#actOfSub').textContent = ofs.done
    ? ofs.done + ' de ' + ofs.total + ' passos concluídos'
    : 'Enunciado → DER → tabelas → 3FN';

  const wk = s.weak;
  $('#telemetry').innerHTML = `
    <div class="tel">
      <div class="tel__k">Domínio geral</div>
      <div class="tel__v">${s.dom}<small>%</small></div>
      ${meter(s.dom, 12, false)}
    </div>
    <div class="tel">
      <div class="tel__k">Rendimento recente</div>
      <div class="tel__v">${s.recentAcc === null ? '—' : s.recentAcc + '<small>%</small>'}</div>
      <div class="tel__sub">${s.recentAcc === null
        ? 'responda 4 questões' : 'últimas ' + Math.min(store.hist.length, 20) + ' respostas'}</div>
    </div>
    <div class="tel ${s.due ? 'tel--sig' : ''}">
      <div class="tel__k">Revisar hoje</div>
      <div class="tel__v">${s.due}</div>
      <div class="tel__sub">${s.due ? 'cards na fila' : 'fila vazia'}</div>
    </div>
    <div class="tel">
      <div class="tel__k">Ponto fraco</div>
      <div class="tel__v">${wk ? '<em>§' + pad(wk.m.id) + '</em> ' + wk.score + '<small>%</small>' : '—'}</div>
      <div class="tel__sub">${wk ? wk.m.t.slice(0, 28) : 'ainda sem dados'}</div>
    </div>`;

  renderRecs();

  let h = '', part = '';
  MODULES.forEach(m => {
    if (m.part !== part) {
      part = m.part;
      h += `<div class="partline">Parte ${m.part} — ${PARTS[m.part]}</div>`;
    }
    const st = modStats(m.id);
    const detail = st.ans
      ? `${st.right}/${st.ans} em questões`
      : `${st.nCards} cards · ${st.nQ} questões`;
    h += `<button class="mod" data-mod="${m.id}">
      <span class="mod__no">${pad(m.id)}</span>
      <span>
        <span class="mod__t">${m.t}</span>
        <span class="mod__tags">${m.hot ? '<span class="hot">' + m.tags + '</span> · ' : ''}${detail}</span>
        <span class="mod__line"><i style="width:${st.score}%"></i></span>
      </span>
      <span class="mod__pct ${st.score >= 60 ? 'high' : ''}">${st.score}%</span>
    </button>`;
  });
  $('#modlist').innerHTML = h;
}

$('#modlist').addEventListener('click', e => {
  const b = e.target.closest('.mod');
  if (!b) return;
  cardFilter = 'm' + b.dataset.mod;
  go('cards');
});

$('#goReview').addEventListener('click', () => { cardFilter = 'due'; go('cards'); });
$('#goOficina').addEventListener('click', () => { ofCase = null; go('oficina'); });

$('#resetBtn').addEventListener('click', () => {
  if (!confirm('Apagar todo o seu progresso do banco? As linhas de card_estado, ' +
               'questao_estado, oficina_passo e evento deste usuário serão excluídas.')) return;
  DB.zerarProgresso();
  store = { cards: {}, quiz: {}, of: {}, hist: [] };
  renderPainel();
});

$('#sairBtn').addEventListener('click', () => {
  DB.persistir(true);
  BDPortaria.sair();
});

/* ======================================================================
   OFICINA
   ====================================================================== */

let ofCase = null, ofStep = 0, ofSel = null, ofChecked = false, ofShown = false, ofLastPct = 0;

function ofRec(id) { return store.of[id] || (store.of[id] = {}); }

function renderOficina() { return ofCase === null ? renderOfList() : renderOfStep(); }

function renderOfList() {
  const t = OFICINA.map((c, i) => {
    const r = store.of[c.id] || {};
    const done = Object.keys(r).length;
    const pct = Math.round(done / c.steps.length * 100);
    const scores = Object.keys(r).map(k => r[k]);
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
    return `<button class="ofcase" data-case="${c.id}" style="--i:${i}">
      <span class="ofcase__no">${pad(c.n)}</span>
      <span>
        <span class="ofcase__t">${c.t}</span>
        <span class="ofcase__s">${c.nivel} · ${c.steps.length} passos · ${c.tags}</span>
      </span>
      <span class="ofcase__right">
        <span class="ofcase__pct ${pct ? 'on' : ''}">${pct}<small>%</small></span>
        <span class="ofcase__sub">${avg === null ? 'não iniciado' : avg + '% de acerto'}</span>
      </span>
    </button>`;
  }).join('');

  $('#ofRoot').innerHTML = `
    <div class="masthead">
      <div class="masthead__kicker"><b>Oficina</b> <span>o processo completo, passo a passo</span></div>
      <h1 class="masthead__title" style="font-size:clamp(38px,11vw,72px)">Do enunciado<em>até a 3FN.</em></h1>
      <p class="masthead__lead">Cada caso percorre o caminho inteiro: achar as entidades, classificar os atributos, definir as cardinalidades, varrer os casos especiais, desenhar o DER, mapear para tabelas e normalizar. Um passo por vez, conferindo antes de seguir.</p>
    </div>

    <div class="band">
      <div class="band-head"><span class="idx">§ 00</span><span class="name">O caminho</span></div>
      <div class="ofpath">
        <span>Enunciado</span><i>→</i><span>Entidades</span><i>→</i><span>Atributos</span><i>→</i>
        <span>Cardinalidade</span><i>→</i><span>Casos especiais</span><i>→</i><span>DER</span><i>→</i>
        <span>Modelo Relacional</span><i>→</i><span class="hot">1FN · 2FN · 3FN</span>
      </div>
    </div>

    <div class="section">
      <div class="section__head">
        <span class="idx">§ 01</span>
        <h2 class="section__t">Casos</h2>
        <span class="section__meta">${OFICINA.length} casos · ${ofStats().total} passos</span>
      </div>
      <div class="oflist">${t}</div>
    </div>

    <div class="foot"><span>Faça cada passo no papel antes de conferir. É aí que fixa.</span></div>`;
}

function openCase(id, step) {
  ofCase = id;
  ofStep = 0;
  const c = OFICINA.find(x => x.id === id);
  if (typeof step === 'number') {
    ofStep = step;
  } else {
    const r = store.of[id];
    if (r) for (let i = 0; i < c.steps.length; i++) { if (r[i] === undefined) { ofStep = i; break; } }
  }
  resetStepState();
  renderOfStep();
  window.scrollTo(0, 0);
}

function resetStepState() { ofSel = null; ofChecked = false; ofShown = false; }

function renderOfStep() {
  const c = OFICINA.find(x => x.id === ofCase);

  if (ofStep >= c.steps.length) {
    const r = ofRec(c.id);
    const sc = Object.keys(r).map(k => r[k]);
    const avg = sc.length ? Math.round(sc.reduce((a, b) => a + b, 0) / sc.length) : 0;
    $('#ofRoot').innerHTML = `
      <div class="ofbar"><button class="ofback" id="ofBack">← Casos</button>
        <span class="ofbar__t">${c.t}</span></div>
      <div class="result">
        <div class="tel__k" style="color:var(--ink-25)">Caso concluído</div>
        <div class="result__big">${avg}<small>%</small></div>
        <div class="result__msg">Você percorreu os ${c.steps.length} passos de <strong>${c.t}</strong>.
        ${avg >= 85 ? 'Esse processo está dominado — refaça daqui a uma semana só para não enferrujar.'
          : avg >= 60 ? 'Bom caminho. Refaça o caso do zero em dois dias, sem olhar as conferências.'
          : 'Vale refazer agora, devagar, lendo o porquê de cada erro.'}</div>
        <div class="btnrow btnrow--split">
          <button class="btn btn--solid" id="ofRedo">Refazer este caso</button>
          <button class="btn" id="ofOther">Escolher outro caso</button>
        </div>
      </div>`;
    $('#ofBack').addEventListener('click', backToList);
    $('#ofOther').addEventListener('click', backToList);
    $('#ofRedo').addEventListener('click', () => {
      delete store.of[c.id]; save(); ofStep = 0; resetStepState(); renderOfStep(); window.scrollTo(0, 0);
    });
    return;
  }

  const st = c.steps[ofStep];
  const r  = store.of[c.id] || {};
  const track = c.steps.map((s, i) =>
    `<button class="ofdot ${i === ofStep ? 'now' : ''} ${r[i] !== undefined ? 'done' : ''}"
       data-step="${i}" title="${esc(s.t)}">${i + 1}</button>`).join('');

  let body = '';
  if (st.k === 'pick')   body = ofPickHtml(st);
  if (st.k === 'assign') body = ofAssignHtml(st);
  if (st.k === 'reveal') body = ofRevealHtml(st);

  $('#ofRoot').innerHTML = `
    <div class="ofbar">
      <button class="ofback" id="ofBack">← Casos</button>
      <span class="ofbar__t">${c.t}</span>
      <span class="ofbar__n">${ofStep + 1} / ${c.steps.length}</span>
    </div>
    <details class="ofenun" ${ofStep === 0 ? 'open' : ''}>
      <summary><span>Enunciado</span><span>${c.nivel}</span></summary>
      <div class="ofenun__b prose">${c.enunciado}</div>
    </details>
    <div class="oftrack">${track}</div>
    <div class="ofstep">
      <div class="ofstep__k"><span>Passo ${ofStep + 1}</span> ${st.t.replace(/^Passo \d+ — /, '')}</div>
      <div class="ofstep__q">${st.q}</div>
      ${body}
    </div>`;

  $('#ofBack').addEventListener('click', backToList);
  $$('.ofdot').forEach(d => d.addEventListener('click', () => {
    ofStep = parseInt(d.dataset.step, 10); resetStepState(); renderOfStep(); window.scrollTo(0, 0);
  }));

  if (st.k === 'pick')   wirePick(st);
  if (st.k === 'assign') wireAssign(st);
  if (st.k === 'reveal') wireReveal(st);
}

function backToList() { ofCase = null; renderOficina(); window.scrollTo(0, 0); }

function ofPickHtml(st) {
  if (ofSel === null) ofSel = {};
  const items = st.items.map((it, i) => {
    const on = !!ofSel[i];
    let cls = on ? 'on' : '';
    if (ofChecked) {
      if (it.ok && on)       cls = 'ok';
      else if (it.ok && !on) cls = 'miss';
      else if (!it.ok && on) cls = 'bad';
      else                   cls = 'off';
    }
    return `<button class="ofitem ${cls}" data-i="${i}" ${ofChecked ? 'disabled' : ''} style="--i:${i}">
        <span class="ofitem__box">${ofChecked ? (it.ok ? '✓' : (on ? '✕' : '')) : (on ? '■' : '')}</span>
        <span class="ofitem__t">${it.t}</span>
        ${ofChecked ? `<span class="ofitem__w">${it.why}</span>` : ''}
      </button>`;
  }).join('');
  return `<div class="ofitems">${items}</div>${ofFootHtml('Conferir seleção')}`;
}

function wirePick(st) {
  $$('.ofitem').forEach(b => b.addEventListener('click', () => {
    ofSel[b.dataset.i] = !ofSel[b.dataset.i];
    renderOfStep();
  }));
  wireFoot(() => {
    let ok = 0;
    st.items.forEach((it, i) => { if (!!ofSel[i] === !!it.ok) ok++; });
    return Math.round(ok / st.items.length * 100);
  });
}

function ofAssignHtml(st) {
  if (ofSel === null) ofSel = {};
  const rows = st.rows.map((row, i) => {
    const chosen = ofSel[i];
    const right = ofChecked && chosen === row.a;
    const opts = st.opts.map((o, j) => {
      let cls = chosen === j ? 'on' : '';
      if (ofChecked) cls = (j === row.a) ? 'ok' : (chosen === j ? 'bad' : 'off');
      return `<button class="ofopt ${cls}" data-r="${i}" data-o="${j}" ${ofChecked ? 'disabled' : ''}>${o}</button>`;
    }).join('');
    return `<div class="ofrow ${ofChecked ? (right ? 'is-ok' : 'is-bad') : ''}" style="--i:${i}">
        <div class="ofrow__t">${row.t}</div>
        <div class="ofrow__o">${opts}</div>
        ${ofChecked ? `<div class="ofrow__w"><b>${right ? 'Certo' : 'Resposta: ' + st.opts[row.a]}</b>${row.why}</div>` : ''}
      </div>`;
  }).join('');
  return `<div class="ofrows">${rows}</div>${ofFootHtml('Conferir respostas')}`;
}

function wireAssign(st) {
  $$('.ofopt').forEach(b => b.addEventListener('click', () => {
    ofSel[b.dataset.r] = parseInt(b.dataset.o, 10);
    renderOfStep();
  }));
  wireFoot(() => {
    let ok = 0;
    st.rows.forEach((row, i) => { if (ofSel[i] === row.a) ok++; });
    return Math.round(ok / st.rows.length * 100);
  }, () => Object.keys(ofSel).length >= st.rows.length);
}

function ofRevealHtml(st) {
  if (!ofShown) {
    return `<div class="ofpaper">
        <div class="ofpaper__k">Faça no papel primeiro</div>
        <p>Este passo não tem alternativa para clicar. Escreva ou desenhe a sua resposta e só então
        abra o gabarito — conferir antes de tentar não fixa nada.</p>
      </div>
      <div class="btnrow"><button class="btn btn--solid btn--wide" id="ofShow">Já fiz — mostrar gabarito</button></div>`;
  }
  const fig = st.svg ? `<div class="dframe dframe--svg" style="margin-bottom:20px">${SVGS[st.svg]()}</div>`
    : st.img ? `<div class="dframe" data-img="${st.img}" style="margin-bottom:20px">
                  <img src="assets/img/${st.img}" alt="Gabarito" loading="lazy">
                  <span class="dframe__zoom">Ampliar</span></div>` : '';
  const check = (st.check || []).map((c, i) =>
    `<li style="--i:${i}"><span class="g">□</span><span>${c}</span></li>`).join('');
  return `${fig}
    <div class="ofmodel prose">${st.model || ''}</div>
    ${check ? `<div class="dlook"><div class="dlook__t">Confira item por item</div><ul>${check}</ul></div>` : ''}
    <div class="ofrate">
      <button class="rate rate--bad"  data-v="40"><span>Refazer</span>errei o essencial</button>
      <button class="rate rate--mid"  data-v="70"><span>Faltou algo</span>estava quase</button>
      <button class="rate rate--good" data-v="100"><span>Acertei</span>bateu com o gabarito</button>
    </div>`;
}

function wireReveal(st) {
  const b = $('#ofShow');
  if (b) { b.addEventListener('click', () => { ofShown = true; renderOfStep(); }); return; }
  const f = $('.dframe[data-img]');
  if (f) f.addEventListener('click', () => openLb(f.dataset.img, st.t));
  $$('.ofrate .rate').forEach(r => r.addEventListener('click', () => {
    saveStep(parseInt(r.dataset.v, 10));
    nextStep();
  }));
}

function ofFootHtml(label) {
  if (!ofChecked)
    return `<div class="btnrow"><button class="btn btn--solid btn--wide" id="ofCheck">${label}</button></div>`;
  const pct = ofLastPct;
  return `<div class="ofresult ${pct === 100 ? 'is-ok' : pct >= 60 ? 'is-mid' : 'is-bad'}">
      <span class="ofresult__n">${pct}%</span>
      <span>${pct === 100 ? 'Passo perfeito.' : pct >= 60 ? 'Quase. Leia os porquês antes de seguir.'
        : 'Vale reler o resumo deste assunto — os porquês estão logo acima.'}</span>
    </div>
    <div class="btnrow btnrow--split">
      <button class="btn" id="ofRetry">Tentar de novo</button>
      <button class="btn btn--solid" id="ofNext">Próximo passo →</button>
    </div>`;
}

function wireFoot(scoreFn, guardFn) {
  const chk = $('#ofCheck');
  if (chk) {
    chk.addEventListener('click', () => {
      if (guardFn && !guardFn()) { alert('Responda todas as linhas antes de conferir.'); return; }
      ofLastPct = scoreFn();
      ofChecked = true;
      saveStep(ofLastPct);
      renderOfStep();
    });
    return;
  }
  const rt = $('#ofRetry');
  if (rt) rt.addEventListener('click', () => { resetStepState(); renderOfStep(); });
  const nx = $('#ofNext');
  if (nx) nx.addEventListener('click', nextStep);
}

function saveStep(pct) {
  const r = ofRec(ofCase);
  r[ofStep] = Math.max(r[ofStep] || 0, pct);
  save();
  DB.registrarEvento('oficina', ofCase + '#' + (ofStep + 1), null, pct >= 70);
}

function nextStep() { ofStep++; resetStepState(); renderOfStep(); window.scrollTo(0, 0); }

$('#ofRoot').addEventListener('click', e => {
  const c = e.target.closest('.ofcase');
  if (c) openCase(c.dataset.case);
});

/* ======================================================================
   FILTROS — chips fixos + seletor de módulo
   ====================================================================== */

function filtersHtml(chips, current, counts) {
  let h = chips.map(c =>
    `<button class="chip" data-f="${c.f}" aria-pressed="${current === c.f}">${c.t}<b>${counts[c.f]}</b></button>`
  ).join('');
  const inMod = current.charAt(0) === 'm';
  h += `<select class="msel" id="${chips.sel || 'modSel'}">
      <option value="">${inMod ? 'Módulo §' + pad(parseInt(current.slice(1), 10)) : 'Por módulo…'}</option>`;
  MODULES.forEach(m => {
    h += `<option value="m${m.id}" ${current === 'm' + m.id ? 'selected' : ''}>§${pad(m.id)} · ${m.t}</option>`;
  });
  return h + '</select>';
}

/* ======================================================================
   FLASHCARDS
   ====================================================================== */

let cardFilter = 'due';
let queue = [], qi = 0, revealed = false;
let sess = { right: 0, mid: 0, wrong: 0 };

function cardPool(f) {
  const t = today();
  if (f === 'all')  return CARDS.slice();
  if (f === 'due')  return CARDS.filter(c => { const r = store.cards[c.id]; return !r || r.d <= t; });
  if (f === 'hard') return CARDS.filter(c => { const r = store.cards[c.id]; return r && r.b <= 2 && r.s > 0; });
  if (f.charAt(0) === 'm') return CARDS.filter(c => c.m === parseInt(f.slice(1), 10));
  return CARDS.slice();
}

function renderCardFilters() {
  const counts = { due: cardPool('due').length, all: CARDS.length, hard: cardPool('hard').length };
  $('#cardChips').innerHTML = filtersHtml(
    [{ f: 'due', t: 'Hoje' }, { f: 'all', t: 'Tudo' }, { f: 'hard', t: 'Difíceis' }],
    cardFilter, counts);
  buildQueue();
}

$('#cardChips').addEventListener('click', e => {
  const c = e.target.closest('.chip');
  if (!c) return;
  cardFilter = c.dataset.f;
  renderCardFilters();
});
$('#cardChips').addEventListener('change', e => {
  if (e.target.tagName !== 'SELECT' || !e.target.value) return;
  cardFilter = e.target.value;
  renderCardFilters();
});

function buildQueue() {
  queue = shuffle(cardPool(cardFilter)).map(c => c.id);
  qi = 0; revealed = false;
  sess = { right: 0, mid: 0, wrong: 0 };
  drawCard();
}

function drawCard() {
  const stage = $('#cardStage'), strip = $('#cardProg');

  if (qi >= queue.length) {
    const done = sess.right + sess.mid + sess.wrong;
    stage.innerHTML = done
      ? `<div class="result">
           <div class="tel__k" style="color:var(--ink-25)">Sessão concluída</div>
           <div class="result__big">${done}<small>cards</small></div>
           <div class="result__msg"><strong>${sess.right}</strong> você sabia ·
             <strong>${sess.mid}</strong> quase · <strong>${sess.wrong}</strong> errou.
             Os que errou voltaram para a caixa 1; os que acertou só reaparecem daqui a alguns dias.</div>
           <div class="btnrow btnrow--split">
             <button class="btn btn--solid" id="againBtn">Rodar de novo</button>
             <button class="btn" id="toQuiz">Ir para questões</button>
           </div>
         </div>`
      : `<div class="empty">Nada para revisar neste filtro</div>
         <div class="btnrow"><button class="btn btn--wide" id="againBtn">Ver todos os cards</button></div>`;
    strip.innerHTML = '';
    $('#cardHint').textContent = '';
    const ag = $('#againBtn');
    if (ag) ag.addEventListener('click', () => { if (!done) cardFilter = 'all'; renderCardFilters(); });
    const tq = $('#toQuiz');
    if (tq) tq.addEventListener('click', () => go('quiz'));
    return;
  }

  const c = CARDS.find(x => x.id === queue[qi]);
  const r = cardRec(c.id), m = mod(c.m);
  let boxes = '';
  for (let i = 1; i <= 5; i++) boxes += `<i class="${i <= r.b ? 'on' : ''}"></i>`;

  stage.innerHTML = `
    <article class="fcard" id="fcard">
      <div class="fcard__strip">
        <span class="ix">§${pad(m.id)}</span>
        <span class="nm">${m.t}</span>
        <span class="box">${boxes}</span>
      </div>
      ${c.ctx ? `<div class="fcard__ctx">${c.ctx}</div>` : ''}
      <div class="fcard__body">
        <div class="fcard__q">${c.q}</div>
        ${(!revealed && c.hint) ? `<div class="fcard__hint">Pista · ${c.hint}</div>` : ''}
        ${revealed && c.simple ? `<div class="fcard__simple"><span>Em uma frase</span>${c.simple}</div>` : ''}
        ${revealed ? `<div class="fcard__a">${c.a}</div>` : ''}
      </div>
      ${revealed
        ? `<div class="fcard__foot">
             <button class="rate rate--bad"  data-r="0"><span>Errei</span>volta à caixa 1</button>
             <button class="rate rate--mid"  data-r="1"><span>Quase</span>mantém</button>
             <button class="rate rate--good" data-r="2"><span>Sabia</span>sobe de caixa</button>
           </div>`
        : `<button class="flipbtn" id="flipBtn">Revelar resposta</button>`}
    </article>`;

  let s = '';
  for (let i = 0; i < queue.length; i++)
    s += `<i class="${i < qi ? 'done' : (i === qi ? 'now' : '')}"></i>`;
  strip.innerHTML = s;

  $('#cardHint').textContent = (revealed
    ? 'Deslize ou use 1 errei · 2 quase · 3 sabia'
    : 'Toque no card ou aperte espaço para revelar') + '   —   ' + (qi + 1) + ' de ' + queue.length;

  const fb = $('#flipBtn');
  if (fb) fb.addEventListener('click', flip);
  $$('.rate', stage).forEach(b => b.addEventListener('click', () => rate(parseInt(b.dataset.r, 10))));
  if (!revealed) $('.fcard__body', stage).addEventListener('click', flip);
  attachSwipe($('#fcard'));
}

function flip() { revealed = true; drawCard(); }

function rate(v) {
  const c = CARDS.find(x => x.id === queue[qi]);
  const r = cardRec(c.id);
  r.s++;
  if (v === 0) { r.b = 1;                    sess.wrong++; }
  if (v === 1) {                             sess.mid++;   }
  if (v === 2) { r.b = Math.min(5, r.b + 1); sess.right++; }
  r.d = today() + BOX_WAIT[r.b - 1];
  save();
  DB.registrarEvento('card', c.id, c.m, v === 2);

  const el = $('#fcard');
  if (el) el.classList.add(v === 0 ? 'out-l' : 'out-r');
  const back = (v === 0) ? queue[qi] : null;

  setTimeout(() => {
    qi++;
    if (back) queue.push(back);
    revealed = false;
    drawCard();
  }, 200);
}

function attachSwipe(el) {
  if (!el) return;
  let x0 = null, y0 = null;
  el.addEventListener('touchstart', e => {
    x0 = e.touches[0].clientX; y0 = e.touches[0].clientY;
  }, { passive: true });
  el.addEventListener('touchend', e => {
    if (x0 === null) return;
    const dx = e.changedTouches[0].clientX - x0;
    const dy = e.changedTouches[0].clientY - y0;
    x0 = null;
    if (Math.abs(dx) < 60 || Math.abs(dy) > Math.abs(dx)) return;
    if (!revealed) { flip(); return; }
    rate(dx < 0 ? 0 : 2);
  }, { passive: true });
}

/* ======================================================================
   QUESTÕES
   ====================================================================== */

let quizFilter = 'sim';
let qsess = null;

function quizPool(f) {
  if (f === 'sim')   return shuffle(QUESTIONS).slice(0, 20);
  if (f === 'wrong') return QUESTIONS.filter(q => { const r = store.quiz[q.id]; return r && r.last === 'w'; });
  if (f === 'new')   return QUESTIONS.filter(q => !store.quiz[q.id]);
  if (f === 'fig')   return QUESTIONS.filter(q => !!q.img);
  if (f.charAt(0) === 'm') return QUESTIONS.filter(q => q.m === parseInt(f.slice(1), 10));
  return QUESTIONS.slice();
}

function renderQuizFilters() {
  const counts = { sim: 20, wrong: quizPool('wrong').length,
                   new: quizPool('new').length, fig: quizPool('fig').length };
  $('#quizChips').innerHTML = filtersHtml(
    [{ f: 'sim', t: 'Simulado' }, { f: 'wrong', t: 'Errei' },
     { f: 'new', t: 'Inéditas' }, { f: 'fig', t: 'Com diagrama' }],
    quizFilter, counts);
  startQuiz();
}

$('#quizChips').addEventListener('click', e => {
  const c = e.target.closest('.chip');
  if (!c) return;
  quizFilter = c.dataset.f;
  renderQuizFilters();
});
$('#quizChips').addEventListener('change', e => {
  if (e.target.tagName !== 'SELECT' || !e.target.value) return;
  quizFilter = e.target.value;
  renderQuizFilters();
});

function startQuiz() {
  qsess = { ids: shuffle(quizPool(quizFilter)).map(q => q.id), i: 0, log: [], picked: null };
  drawQuiz();
}

function drawQuiz() {
  const st = $('#quizStage');

  if (!qsess.ids.length) { st.innerHTML = `<div class="empty">Nenhuma questão neste filtro</div>`; return; }

  if (qsess.i >= qsess.ids.length) {
    const n = qsess.log.length, ok = qsess.log.filter(l => l.ok).length;
    const pct = Math.round(ok / n * 100);
    const msg = pct >= 85 ? 'Está pronto nesse assunto. Passe para o próximo.'
              : pct >= 65 ? 'Boa base. Reveja os erros abaixo e refaça em dois dias.'
              : pct >= 40 ? 'Metade do caminho. Volte aos flashcards deste módulo antes de repetir.'
              :             'Ainda cru. Leia o resumo do assunto e faça os cards antes de tentar de novo.';
    const rows = qsess.log.map((l, i) => {
      const q = QUESTIONS.find(x => x.id === l.id);
      return `<div class="result__row ${l.ok ? '' : 'bad'}" style="--i:${i}">
                <span class="mk ${l.ok ? 'y' : 'n'}">${l.ok ? '✓' : '✕'}</span>
                <span>${q.q}</span></div>`;
    }).join('');
    st.innerHTML = `<div class="result">
        <div class="tel__k" style="color:var(--ink-25)">Resultado</div>
        <div class="result__big">${pct}<small>%</small></div>
        <div class="result__msg">${ok} de ${n} corretas. ${msg}</div>
        <div class="btnrow btnrow--split">
          <button class="btn btn--solid" id="qAgain">Refazer</button>
          <button class="btn" id="qWrong">Só as que errei</button>
          <button class="btn" id="qPainel">Ver o que estudar</button>
        </div>
        <div class="result__list">${rows}</div>
      </div>`;
    $('#qAgain').addEventListener('click', startQuiz);
    $('#qWrong').addEventListener('click', () => { quizFilter = 'wrong'; renderQuizFilters(); });
    $('#qPainel').addEventListener('click', () => go('painel'));
    return;
  }

  const q = QUESTIONS.find(x => x.id === qsess.ids[qsess.i]);
  const m = mod(q.m), done = qsess.picked !== null;
  const ok = qsess.log.filter(l => l.ok).length;

  const opts = q.o.map((o, i) => {
    let cls = '';
    if (done) cls = (i === q.c) ? 'is-right' : (i === qsess.picked ? 'is-wrong' : 'dim');
    return `<button class="opt ${cls}" data-i="${i}" ${done ? 'disabled' : ''} style="--i:${i}">
              <span class="opt__k">${'ABCD'.charAt(i)}</span><span>${o}</span></button>`;
  }).join('');

  const acertou = qsess.picked === q.c;

  st.innerHTML = `
    <div class="quiz__head">
      <span>§${pad(m.id)}</span><span>${m.t}</span>
      <span class="quiz__score">${qsess.i + 1}<b>/</b>${qsess.ids.length} · acertos <b>${ok}</b></span>
    </div>
    ${q.ctx ? `<div class="quiz__ctx"><b>Situação</b>${q.ctx}</div>` : ''}
    <h2 class="quiz__q">${q.q}</h2>
    ${q.img ? `<div class="quiz__fig" data-img="${q.img}"><img src="assets/img/${q.img}" alt="Diagrama da questão" loading="lazy"><span class="dframe__zoom">Ampliar</span></div>` : ''}
    <div class="opts">${opts}</div>
    ${done ? `<div class="explain">
                <div class="explain__v ${acertou ? 'y' : 'n'}">${acertou ? 'Você acertou' : 'Resposta certa: ' + 'ABCD'.charAt(q.c)}</div>
                ${q.simple ? `<div class="explain__s">${q.simple}</div>` : ''}
                <div class="explain__d">${q.e}</div>
              </div>
              <div class="btnrow"><button class="btn btn--solid btn--wide" id="qNext">
                ${qsess.i + 1 >= qsess.ids.length ? 'Ver resultado' : 'Próxima questão →'}</button></div>` : ''}`;

  $$('.opt', st).forEach(b => b.addEventListener('click', () => pick(parseInt(b.dataset.i, 10))));
  const nx = $('#qNext');
  if (nx) nx.addEventListener('click', () => { qsess.i++; qsess.picked = null; drawQuiz(); window.scrollTo(0, 0); });
  const fig = $('.quiz__fig', st);
  if (fig) fig.addEventListener('click', () => openLb(fig.dataset.img, q.q));
}

function pick(i) {
  if (qsess.picked !== null) return;
  const q = QUESTIONS.find(x => x.id === qsess.ids[qsess.i]);
  const ok = i === q.c;
  qsess.picked = i;
  qsess.log.push({ id: q.id, ok: ok });

  const r = store.quiz[q.id] || (store.quiz[q.id] = { r: 0, w: 0, last: null });
  if (ok) r.r++; else r.w++;
  r.last = ok ? 'r' : 'w';

  store.hist.push({ d: today(), m: q.m, ok: ok ? 1 : 0 });
  if (store.hist.length > HIST_MAX) store.hist = store.hist.slice(-HIST_MAX);

  save();
  DB.registrarEvento('questao', q.id, q.m, ok);
  drawQuiz();
}

/* ======================================================================
   DIAGRAMAS
   ====================================================================== */

let dFilter = 'todos';

function renderDiagramas() {
  const counts = {
    todos:   DIAGRAMS.length,
    aula:    DIAGRAMS.filter(d => d.src === 'aula').length,
    guia:    DIAGRAMS.filter(d => d.src === 'guia').length,
    autoral: DIAGRAMS.filter(d => d.src === 'autoral').length
  };
  const labels = { todos: 'Todos', aula: 'Das aulas', guia: 'Do guia', autoral: 'Autorais' };
  $('#dChips').innerHTML = ['todos', 'aula', 'guia', 'autoral'].map(k =>
    `<button class="chip" data-f="${k}" aria-pressed="${dFilter === k}">${labels[k]}<b>${counts[k]}</b></button>`).join('');

  const list = DIAGRAMS.filter(d => dFilter === 'todos' || d.src === dFilter);
  const srcLabel = { aula: 'Diagrama da aula', guia: 'Figura do guia', autoral: 'Feito para este sistema' };

  $('#dList').innerHTML = list.map((d, i) => {
    const m = mod(d.m);
    const frame = d.svg
      ? `<div class="dframe dframe--svg">${SVGS[d.svg]()}</div>`
      : `<div class="dframe" data-img="${d.img}" data-t="${esc(d.t)}">
           <img src="assets/img/${d.img}" alt="${esc(d.t)}" loading="lazy">
           <span class="dframe__zoom">Ampliar</span></div>`;
    return `<article class="dcard" data-d="${d.id}">
      <div class="dcard__head">
        <span class="idx">FIG ${pad(i + 1)}</span>
        <h3 class="dcard__t">${d.t}</h3>
        <span class="dcard__src">${srcLabel[d.src]}</span>
      </div>
      ${frame}
      <p class="dcap">${d.cap}</p>
      <div class="dlook">
        <div class="dlook__t">O que olhar · §${pad(m.id)} ${m.t}</div>
        <ul>${d.look.map((l, j) => `<li style="--i:${j}"><span class="g">${l.g}</span><span>${l.t}</span></li>`).join('')}</ul>
      </div>
    </article>`;
  }).join('');
}

$('#dChips').addEventListener('click', e => {
  const c = e.target.closest('.chip');
  if (!c) return;
  dFilter = c.dataset.f;
  renderDiagramas();
});

$('#dList').addEventListener('click', e => {
  const f = e.target.closest('.dframe[data-img]');
  if (f) openLb(f.dataset.img, f.dataset.t);
});

/* ------------------------------------------------------------- LIGHTBOX */

let lbScale = 1;

function openLb(img, title) {
  lbScale = 1;
  $('#lbTitle').textContent = (title || '').replace(/<[^>]+>/g, '');
  $('#lbStage').innerHTML = `<img id="lbImg" src="assets/img/${img}" alt="" style="width:100%">`;
  $('#lightbox').classList.add('on');
  document.body.style.overflow = 'hidden';
}
function closeLb() {
  $('#lightbox').classList.remove('on');
  $('#lbStage').innerHTML = '';
  document.body.style.overflow = '';
}
function zoom(d) {
  lbScale = Math.min(5, Math.max(1, lbScale + d));
  const im = $('#lbImg');
  if (im) im.style.width = (lbScale * 100) + '%';
}

$('#lbClose').addEventListener('click', closeLb);
$('#lbIn').addEventListener('click', () => zoom(0.6));
$('#lbOut').addEventListener('click', () => zoom(-0.6));
$('#lbStage').addEventListener('click', e => { if (e.target.id !== 'lbImg') closeLb(); });

/* ======================================================================
   RESUMO
   ====================================================================== */

function renderResumo() {
  $('#refList').innerHTML = REFERENCE.map((r, i) => `
    <div class="acc" data-id="${r.id}">
      <button class="acc__h">
        <span class="acc__no">${pad(i + 1)}</span>
        <span class="acc__t">${r.t}</span>
        <span class="acc__x">+</span>
      </button>
      <div class="acc__b"><div class="prose">${r.html}</div></div>
    </div>`).join('');
}

$('#refList').addEventListener('click', e => {
  const h = e.target.closest('.acc__h');
  if (h) h.parentElement.classList.toggle('open');
});

/* ======================================================================
   TEMA E TECLADO
   ====================================================================== */

$('#themeBtn').addEventListener('click', () => {
  const nx = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', nx);
  try { localStorage.setItem('bd.theme', nx); } catch (e) {}
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', nx === 'dark' ? '#121211' : '#F2F0EA');
});

document.addEventListener('keydown', e => {
  /* Com a portaria aberta o aplicativo está fora de cena, mas este ouvinte
     continua no document. Sem esta linha, digitar uma senha que contenha
     1, 2 ou 3 avaliaria cards invisíveis por trás da folha de entrada. */
  if (!$('#porta').hidden) return;
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
  if ($('#lightbox').classList.contains('on')) {
    if (e.key === 'Escape') closeLb();
    if (e.key === '+' || e.key === '=') zoom(0.6);
    if (e.key === '-') zoom(-0.6);
    return;
  }
  if (e.target.tagName === 'SELECT') return;
  if (view === 'cards') {
    if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      if (!revealed && qi < queue.length) flip();
      return;
    }
    if (revealed && '123'.indexOf(e.key) >= 0) { e.preventDefault(); rate(parseInt(e.key, 10) - 1); }
    return;
  }
  if (view === 'quiz' && qsess) {
    const k = 'abcd'.indexOf(e.key.toLowerCase());
    if (k >= 0 && qsess.picked === null) { e.preventDefault(); pick(k); return; }
    if ((e.key === 'Enter' || e.key === ' ') && qsess.picked !== null) {
      e.preventDefault(); qsess.i++; qsess.picked = null; drawQuiz(); window.scrollTo(0, 0);
    }
  }
});

/* ======================================================================
   PROVA — simulado no formato do professor

   Cenário, artefato, quatro itens numerados e alternativas que combinam
   os itens. A correção mostra o veredito de CADA item, porque neste
   formato se perde a questão inteira por causa de um único item mal
   lido — e saber qual deles derrubou você é o que ensina.
   ====================================================================== */

let pvSess = null;   /* { ids, i, escolha, log, tentativa } */

function pvPool(quantas) {
  /* As do professor vêm primeiro e sempre; as autorais completam o
     simulado, embaralhadas, para a repetição não ficar previsível. */
  const prof = PROVA.filter(q => q.origem === 'professor');
  const meus = shuffle(PROVA.filter(q => q.origem !== 'professor'));
  return prof.concat(meus).slice(0, quantas);
}

function renderProva() {
  return pvSess ? drawProva() : renderProvaCapa();
}

function renderProvaCapa() {
  const hist = DB.historicoProvas(8);
  const melhor = hist.reduce((m, h) => Math.max(m, h.pontos || 0), 0);
  const ultima = hist.length ? hist[0] : null;
  const nProf = PROVA.filter(q => q.origem === 'professor').length;

  const linhas = hist.map((h, i) => {
    const d = new Date(h.concluida_em);
    const pct = h.total ? Math.round(h.pontos / h.total * 100) : 0;
    return `<div class="pvhist__l" style="--i:${i}">
        <span class="pvhist__d">${isNaN(d) ? '—' : d.toLocaleDateString('pt-BR') + ' · ' +
          d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
        <span class="pvhist__b"><i style="width:${pct}%"></i></span>
        <span class="pvhist__n ${pct >= 60 ? 'ok' : ''}">${(h.pontos || 0).toString().replace('.', ',')}<small>/${h.total}</small></span>
      </div>`;
  }).join('');

  $('#provaRoot').innerHTML = `
    <div class="masthead">
      <div class="masthead__kicker"><b>Prova</b> <span>simulado no formato do professor</span></div>
      <h1 class="masthead__title" style="font-size:clamp(34px,10vw,64px)">Quatro itens<em>uma escolha.</em></h1>
      <p class="masthead__lead">O formato da prova não é múltipla escolha comum: cada questão traz um
      cenário, um modelo para analisar e <strong>quatro afirmações numeradas</strong>. As alternativas
      combinam os itens — "I e III", "II e IV" —, então basta ler mal <em>um</em> deles para perder os
      2 pontos inteiros. Aqui a correção mostra o veredito de cada item separadamente.</p>
    </div>

    <div class="band">
      <div class="band-sweep"></div>
      <div class="band-head">
        <span class="idx">§ 00</span>
        <span class="name">Seu desempenho</span>
        <span class="note">${PROVA.length} questões no banco · ${nProf} são do professor</span>
      </div>
      <div class="band-grid">
        <div class="tel">
          <div class="tel__k">Melhor nota</div>
          <div class="tel__v">${melhor ? melhor.toString().replace('.', ',') : '—'}<small>${melhor ? '/10' : ''}</small></div>
          ${melhor ? meter(melhor * 10, 10, false) : '<div class="tel__sub">sem simulado ainda</div>'}
        </div>
        <div class="tel">
          <div class="tel__k">Última</div>
          <div class="tel__v">${ultima ? (ultima.pontos || 0).toString().replace('.', ',') + '<small>/10</small>' : '—'}</div>
          <div class="tel__sub">${ultima ? new Date(ultima.concluida_em).toLocaleDateString('pt-BR') : 'nunca fez'}</div>
        </div>
        <div class="tel">
          <div class="tel__k">Simulados feitos</div>
          <div class="tel__v">${pad(hist.length)}</div>
          <div class="tel__sub">${hist.length >= 3 ? 'já dá para ver tendência' : 'faça pelo menos três'}</div>
        </div>
        <div class="tel ${melhor >= 6 ? '' : 'tel--sig'}">
          <div class="tel__k">Para passar</div>
          <div class="tel__v">6<small>,0</small></div>
          <div class="tel__sub">${melhor >= 6 ? 'você já bateu' : 'ainda não bateu'}</div>
        </div>
      </div>
      <div class="band-act">
        <button class="act act--primary" id="pvStart5">
          <div class="act__k">Do jeito da prova</div>
          <div class="act__t">Simulado de 5 questões</div>
          <div class="act__s">2 pontos cada · vale 10 · sem consulta</div>
        </button>
        <button class="act" id="pvStartAll">
          <div class="act__k">Treino longo</div>
          <div class="act__t">Todas as ${PROVA.length} questões</div>
          <div class="act__s">para varrer o formato inteiro</div>
        </button>
      </div>
    </div>

    ${hist.length ? `
    <div class="section">
      <div class="section__head">
        <span class="idx">§ 01</span>
        <h2 class="section__t">Histórico</h2>
        <span class="section__meta">últimos ${hist.length}</span>
      </div>
      <div class="pvhist">${linhas}</div>
    </div>` : ''}

    <div class="section">
      <div class="section__head">
        <span class="idx">§ ${hist.length ? '02' : '01'}</span>
        <h2 class="section__t">Como se resolve esse formato</h2>
      </div>
      <div class="prose" style="padding-top:18px">
        <p class="serif-note" style="margin-bottom:18px">Julgue os quatro itens antes de olhar as
        alternativas. Quem lê as alternativas primeiro procura a que parece familiar, e é assim que
        se erra.</p>
        <p><strong>1. Marque cada item como V ou F, um de cada vez.</strong> Não tente adivinhar a
        combinação. Dois itens que você tenha certeza já costumam eliminar três alternativas.</p>
        <p><strong>2. Repare no recorte.</strong> Itens que começam com "analisando somente…" mandam
        ignorar o resto do enunciado — é comum um item dizer que o modelo está errado e outro dizer
        que a transformação está certa, e os dois estarem corretos.</p>
        <p><strong>3. Desconfie de absolutos.</strong> "Sempre", "obrigatoriamente", "sem nenhuma
        consequência" e "não pode" costumam marcar o item falso, porque em modelagem quase tudo é
        troca.</p>
        <p><strong>4. Item meio certo é item errado.</strong> Uma afirmação que acerta a cardinalidade
        e erra a consequência é falsa inteira.</p>
        <p><strong>5. Leia as chaves antes do texto.</strong> FK fora da chave é 1:N; duas FKs
        formando a chave é N:N; chave do dono dentro da chave é entidade fraca. Metade dos itens se
        responde só com isso.</p>
      </div>
    </div>

    <div class="foot"><span>As cinco do professor entram em todo simulado; as demais são autorais, no mesmo formato</span></div>`;

  $('#pvStart5').addEventListener('click', () => iniciarProva(5));
  $('#pvStartAll').addEventListener('click', () => iniciarProva(PROVA.length));
}

function iniciarProva(quantas) {
  pvSess = {
    ids: pvPool(quantas).map(q => q.id),
    i: 0,
    escolha: null,
    log: [],
    tentativa: DB.abrirTentativa()
  };
  drawProva();
  window.scrollTo(0, 0);
}

function drawProva() {
  const raiz = $('#provaRoot');

  /* ---------------------------------------------------- resultado final */
  if (pvSess.i >= pvSess.ids.length) {
    const total = pvSess.log.reduce((s, l) => s + l.vale, 0);
    const pontos = pvSess.log.reduce((s, l) => s + (l.ok ? l.vale : 0), 0);
    const pct = Math.round(pontos / total * 100);
    DB.fecharTentativa(pvSess.tentativa, pontos, total);

    const msg = pct >= 85 ? 'Está pronto para esse formato. Refaça daqui a alguns dias só para não enferrujar.'
              : pct >= 60 ? 'Passaria. Leia os itens que errou — a diferença para o 10 costuma estar num item só por questão.'
              : pct >= 40 ? 'Metade do caminho. Volte à Oficina e aos flashcards do assunto que mais derrubou você.'
              :             'Ainda cru neste formato. Refaça devagar, lendo o veredito de cada item antes de seguir.';

    const linhas = pvSess.log.map((l, i) => {
      const q = PROVA.find(x => x.id === l.id);
      return `<div class="result__row ${l.ok ? '' : 'bad'}" style="--i:${i}">
          <span class="mk ${l.ok ? 'y' : 'n'}">${l.ok ? '✓' : '✕'}</span>
          <span>${q.t}${l.ok ? '' : ` — você marcou <b>${q.alts[l.escolha]}</b>, era <b>${q.alts[q.c]}</b>`}</span>
        </div>`;
    }).join('');

    /* De que assunto vieram os erros — é o que diz para onde voltar. */
    const porMod = {};
    pvSess.log.filter(l => !l.ok).forEach(l => {
      const q = PROVA.find(x => x.id === l.id);
      porMod[q.m] = (porMod[q.m] || 0) + 1;
    });
    const fracos = Object.keys(porMod)
      .sort((a, b) => porMod[b] - porMod[a])
      .map(id => `<button class="pvfraco" data-mod="${id}">§${pad(id)} ${mod(parseInt(id, 10)).t}<i>→</i></button>`)
      .join('');

    raiz.innerHTML = `
      <div class="result">
        <div class="tel__k" style="color:var(--ink-25)">Simulado concluído</div>
        <div class="result__big">${pontos.toString().replace('.', ',')}<small>/${total}</small></div>
        <div class="result__msg">${msg}</div>
        <div class="btnrow btnrow--split">
          <button class="btn btn--solid" id="pvAgain">Novo simulado</button>
          <button class="btn" id="pvBack">Voltar ao começo</button>
        </div>
        ${fracos ? `<div class="pvfracos"><div class="tel__k" style="margin-bottom:10px">
          Onde você perdeu ponto</div>${fracos}</div>` : ''}
        <div class="result__list">${linhas}</div>
      </div>`;

    $('#pvAgain').addEventListener('click', () => iniciarProva(pvSess.ids.length));
    $('#pvBack').addEventListener('click', () => { pvSess = null; renderProva(); window.scrollTo(0, 0); });
    $$('.pvfraco').forEach(b => b.addEventListener('click', () => {
      cardFilter = 'm' + b.dataset.mod;
      pvSess = null;
      go('cards');
    }));
    return;
  }

  /* ------------------------------------------------------------ questão */
  const q = PROVA.find(x => x.id === pvSess.ids[pvSess.i]);
  const m = mod(q.m);
  const respondida = pvSess.escolha !== null;
  const acertou = respondida && pvSess.escolha === q.c;
  const pontosAte = pvSess.log.reduce((s, l) => s + (l.ok ? l.vale : 0), 0);

  const romano = ['I', 'II', 'III', 'IV', 'V', 'VI'];

  const itens = q.itens.map((it, i) => `
    <div class="pvitem ${respondida ? (it.ok ? 'is-v' : 'is-f') : ''}" style="--i:${i}">
      <span class="pvitem__n">${romano[i]}</span>
      <div class="pvitem__c">
        <div class="pvitem__t">${it.t}</div>
        ${respondida ? `<div class="pvitem__v">${it.ok ? 'Verdadeiro' : 'Falso'}</div>
                        <div class="pvitem__w">${it.why}</div>` : ''}
      </div>
    </div>`).join('');

  const alts = q.alts.map((a, i) => {
    let cls = '';
    if (respondida) cls = (i === q.c) ? 'is-right' : (i === pvSess.escolha ? 'is-wrong' : 'dim');
    return `<button class="opt ${cls}" data-i="${i}" ${respondida ? 'disabled' : ''} style="--i:${i}">
        <span class="opt__k">${'ABCDE'.charAt(i)}</span><span>${a}</span></button>`;
  }).join('');

  const artefato = [
    /* O desenho só aponta o erro depois que a pessoa respondeu — antes
       disso ele sai limpo, senão a questão se entrega sozinha. */
    q.svg ? `<div class="pvart">
        <div class="pvart__k">${q.artefatoTitulo || 'Diagrama'}${
          respondida ? ' <span class="pvart__rev">erro marcado em vermelho</span>' : ''}</div>
        <div class="dframe dframe--svg">${SVGS[q.svg](respondida)}</div>
      </div>` : '',
    q.tabela ? `<div class="pvart">
        <div class="pvart__k">${q.tabelaTitulo || 'Dados'}</div>
        <div class="tabwrap"><table class="tab tab--dados">
          <thead><tr>${q.tabela.cab.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead>
          <tbody>${q.tabela.linhas.map((l, i) => `<tr style="--i:${i}">${
            l.map(v => `<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody>
        </table></div>
      </div>` : '',
    q.mr ? `<div class="pvart">
        <div class="pvart__k">${q.mrTitulo || 'Modelo Relacional'}</div>
        <div class="pre">${q.mr}</div>
      </div>` : ''
  ].join('');

  raiz.innerHTML = `
    <div class="pvbar">
      <button class="ofback" id="pvSair">← Sair</button>
      <span class="pvbar__t">${q.origem === 'professor' ? 'Questão do professor' : 'Questão de treino'}</span>
      <span class="pvbar__n">${pvSess.i + 1} / ${pvSess.ids.length} · ${String(pontosAte).replace('.', ',')} pt</span>
    </div>

    <div class="pvtrack">${pvSess.ids.map((id, i) => {
      const l = pvSess.log.find(x => x.id === id);
      return `<i class="${i === pvSess.i ? 'now' : ''} ${l ? (l.ok ? 'ok' : 'bad') : ''}"></i>`;
    }).join('')}</div>

    <div class="pvhead">
      <span class="idx">Pergunta ${pvSess.i + 1} · ${q.pontos} pontos</span>
      <h2 class="pvhead__t">${q.t}</h2>
      <span class="pvhead__m">§${pad(m.id)} ${m.t}</span>
    </div>

    <div class="pvcen prose">${q.cenario}</div>

    ${artefato}

    <div class="pvitens__k">Itens a serem analisados</div>
    <div class="pvitens">${itens}</div>

    <div class="pvalts__k">Está correta apenas a alternativa:</div>
    <div class="opts">${alts}</div>

    ${respondida ? `
      <div class="explain">
        <div class="explain__v ${acertou ? 'y' : 'n'}">${acertou
          ? 'Você acertou — ' + q.pontos + ' pontos'
          : 'Resposta certa: ' + q.alts[q.c]}</div>
        ${q.problema ? `<div class="pvprob">${q.problema}</div>` : ''}
        <div class="explain__d">${q.fecho}</div>
      </div>
      <div class="btnrow"><button class="btn btn--solid btn--wide" id="pvNext">
        ${pvSess.i + 1 >= pvSess.ids.length ? 'Ver resultado' : 'Próxima questão →'}</button></div>` : ''}`;

  $('#pvSair').addEventListener('click', () => {
    if (pvSess.log.length && !confirm('Sair do simulado? A tentativa não será contada.')) return;
    pvSess = null; renderProva(); window.scrollTo(0, 0);
  });
  $$('.opt', raiz).forEach(b => b.addEventListener('click', () => pvPick(parseInt(b.dataset.i, 10))));
  const nx = $('#pvNext');
  if (nx) nx.addEventListener('click', () => {
    pvSess.i++; pvSess.escolha = null; drawProva(); window.scrollTo(0, 0);
  });
}

function pvPick(i) {
  if (pvSess.escolha !== null) return;
  const q = PROVA.find(x => x.id === pvSess.ids[pvSess.i]);
  const ok = i === q.c;
  pvSess.escolha = i;
  pvSess.log.push({ id: q.id, ok: ok, vale: q.pontos, escolha: i });

  DB.gravarRespostaProva(pvSess.tentativa, q.id, i, ok, ok ? q.itens.length : null, q.itens.length);
  DB.registrarEvento('prova', q.id, q.m, ok);

  /* Alimenta o diagnóstico do Painel junto com as questões comuns. */
  store.hist.push({ d: today(), m: q.m, ok: ok ? 1 : 0 });
  if (store.hist.length > HIST_MAX) store.hist = store.hist.slice(-HIST_MAX);

  drawProva();
}

/* ======================================================================
   BANCO — o esquema onde o seu progresso está guardado, aberto para
   consulta. É a única tela que não ensina a matéria pelo conteúdo, e sim
   pelo próprio funcionamento: um banco relacional pequeno, real, com os
   seus dados dentro, para praticar SELECT sem precisar instalar nada.
   ====================================================================== */

/* Consultas prontas. Cada uma existe para mostrar um recurso diferente
   da linguagem, na ordem em que a disciplina os apresenta.             */
const CONSULTAS = [
  {
    id: 'sq-modulo',
    t: 'Rendimento por módulo',
    k: 'JOIN + GROUP BY',
    d: 'Junta o log de respostas ao catálogo de módulos e agrupa. É a consulta que alimenta o Painel.',
    sql:
`SELECT  m.id_modulo                                   AS mod,
        m.nome                                        AS assunto,
        COUNT(*)                                      AS respondidas,
        SUM(e.acertou)                                AS acertos,
        ROUND(100.0 * SUM(e.acertou) / COUNT(*), 1)   AS pct
FROM        evento e
INNER JOIN  modulo m ON m.id_modulo = e.id_modulo
WHERE   e.tipo = 'questao'
GROUP BY    m.id_modulo, m.nome
ORDER BY    pct ASC;`
  },
  {
    id: 'sq-dia',
    t: 'Quanto você estudou por dia',
    k: 'GROUP BY em data',
    d: 'Uma linha por dia, contando respostas e acertos. Mostra a regularidade — que rende mais que maratona.',
    sql:
`SELECT  dia,
        COUNT(*)                                     AS respostas,
        SUM(acertou)                                 AS acertos,
        ROUND(100.0 * SUM(acertou) / COUNT(*), 1)    AS pct
FROM    evento
WHERE   acertou IS NOT NULL
GROUP BY dia
ORDER BY dia DESC
LIMIT 30;`
  },
  {
    id: 'sq-caixas',
    t: 'Cards em cada caixa',
    k: 'GROUP BY + COUNT',
    d: 'A distribuição da repetição espaçada. Caixa 1 é o que você ainda erra; caixa 5 é o que já está na memória.',
    sql:
`SELECT  caixa,
        COUNT(*)        AS cards,
        SUM(tentativas) AS tentativas_somadas
FROM    card_estado
GROUP BY caixa
ORDER BY caixa;`
  },
  {
    id: 'sq-teimosos',
    t: 'Os cards que teimam em não entrar',
    k: 'WHERE com duas condições',
    d: 'Caixa baixa depois de várias tentativas. Decorar não está funcionando neles — troque de método.',
    sql:
`SELECT  id_card,
        caixa,
        tentativas
FROM    card_estado
WHERE   caixa <= 2
  AND   tentativas >= 3
ORDER BY tentativas DESC, id_card;`
  },
  {
    id: 'sq-oficina',
    t: 'Oficina: melhor nota por caso',
    k: 'AVG, MIN, MAX',
    d: 'As funções de agregação em cima da tabela de chave tripla. Note o passo de pior nota em cada caso.',
    sql:
`SELECT  id_caso,
        COUNT(*)              AS passos_feitos,
        ROUND(AVG(melhor_nota), 1) AS media,
        MIN(melhor_nota)      AS pior_passo,
        MAX(melhor_nota)      AS melhor_passo
FROM    oficina_passo
GROUP BY id_caso
ORDER BY media ASC;`
  },
  {
    id: 'sq-nunca',
    t: 'Módulos em que você nunca respondeu nada',
    k: 'LEFT JOIN + IS NULL',
    d: 'O jeito clássico de perguntar "o que existe de um lado e não existe do outro". Cai em prova.',
    sql:
`SELECT  m.id_modulo AS mod,
        m.nome      AS assunto,
        m.etiqueta
FROM        modulo m
LEFT JOIN   evento e ON e.id_modulo = m.id_modulo AND e.tipo = 'questao'
WHERE       e.id_evento IS NULL
ORDER BY    m.id_modulo;`
  },
  {
    id: 'sq-ultimas',
    t: 'Suas últimas 25 respostas',
    k: 'ORDER BY + LIMIT',
    d: 'O log cru, do mais recente para o mais antigo. Cada linha é um evento que nunca é reescrito.',
    sql:
`SELECT  substr(momento, 12, 5) AS hora,
        dia,
        tipo,
        referencia,
        CASE acertou WHEN 1 THEN 'acertou'
                     WHEN 0 THEN 'errou'
                     ELSE '—' END AS resultado
FROM    evento
ORDER BY id_evento DESC
LIMIT 25;`
  }
];

let sqlAtual = CONSULTAS[0].sql;
let sqlErro = null;

function renderBanco() {
  const u = DB.usuarioAtual() || { nome: '—', login: '—', criado_em: null };
  const conta = n => { try { return DB.uma('SELECT COUNT(*) AS n FROM ' + n).n; } catch (e) { return 0; } };
  const nEventos = conta('evento');
  const nCards   = conta('card_estado');
  const nQuest   = conta('questao_estado');
  const nPassos  = conta('oficina_passo');

  const dias = DB.linhas('SELECT COUNT(DISTINCT dia) AS n FROM evento');
  const nDias = dias.length ? dias[0].n : 0;
  const bytes = DB.tamanho();

  $('#bancoRoot').innerHTML = `
    <div class="masthead">
      <div class="masthead__kicker"><b>Banco</b> <span>o seu progresso, em SQL</span></div>
      <h1 class="masthead__title" style="font-size:clamp(34px,10vw,64px)">Consulte<em>a si mesmo.</em></h1>
      <p class="masthead__lead">Tudo o que você responde nesta página é gravado num banco SQLite que
      roda dentro do navegador — o mesmo motor relacional que a disciplina descreve, compilado para
      WebAssembly. Aqui está o esquema inteiro, aberto, com os seus dados dentro. Rode as consultas,
      mude as consultas, quebre as consultas.</p>
    </div>

    <div class="band">
      <div class="band-sweep"></div>
      <div class="band-head">
        <span class="idx">§ 00</span>
        <span class="name">Estado do arquivo</span>
        <span class="note">progresso.db · IndexedDB deste computador</span>
      </div>
      <div class="band-grid">
        <div class="tel">
          <div class="tel__k">Linhas em evento</div>
          <div class="tel__v">${nEventos}</div>
          <div class="tel__sub">${nDias ? 'em ' + plural(nDias, 'dia distinto', 'dias distintos') : 'nenhum dia ainda'}</div>
        </div>
        <div class="tel">
          <div class="tel__k">Estado guardado</div>
          <div class="tel__v">${nCards + nQuest + nPassos}</div>
          <div class="tel__sub">${nCards} cards · ${nQuest} questões · ${nPassos} passos</div>
        </div>
        <div class="tel">
          <div class="tel__k">Tamanho</div>
          <div class="tel__v">${bytes < 1048576 ? Math.round(bytes / 1024) : (bytes / 1048576).toFixed(1)}<small>${bytes < 1048576 ? 'KB' : 'MB'}</small></div>
          <div class="tel__sub">7 tabelas · 3 índices</div>
        </div>
        <div class="tel">
          <div class="tel__k">Usuário</div>
          <div class="tel__v" style="font-size:clamp(20px,4vw,30px)">${esc(u.nome)}</div>
          <div class="tel__sub">${u.criado_em ? 'desde ' + new Date(u.criado_em).toLocaleDateString('pt-BR') : '—'}</div>
        </div>
      </div>
    </div>

    <div class="section">
      <div class="section__head">
        <span class="idx">§ 01</span>
        <h2 class="section__t">Consultas prontas</h2>
        <span class="section__meta">clique para carregar no console</span>
      </div>
      <div class="sqlist">
        ${CONSULTAS.map((c, i) => `
          <button class="sqitem" data-sq="${c.id}" style="--i:${i}">
            <span class="sqitem__k">${c.k}</span>
            <span class="sqitem__t">${c.t}</span>
            <span class="sqitem__d">${c.d}</span>
          </button>`).join('')}
      </div>
    </div>

    <div class="section">
      <div class="section__head">
        <span class="idx">§ 02</span>
        <h2 class="section__t">Console</h2>
        <span class="section__meta">somente leitura</span>
      </div>
      <div class="console">
        <textarea class="console__in" id="sqlIn" spellcheck="false" rows="10">${esc(sqlAtual)}</textarea>
        <div class="console__bar">
          <button class="btn btn--solid" id="sqlRun">Executar <i>⏎</i></button>
          <span class="console__hint">Ctrl + Enter</span>
        </div>
        <div id="sqlOut"></div>
      </div>
    </div>

    <div class="section">
      <div class="section__head">
        <span class="idx">§ 03</span>
        <h2 class="section__t">O esquema</h2>
        <span class="section__meta">o DDL exato que criou este banco</span>
      </div>
      <p class="serif-note" style="padding-top:16px">Leia como exercício: toda tabela tem chave
      primária; onde é o par que identifica a linha, a chave é composta; nenhuma coluna guarda o que
      já pode ser deduzido de outra. É a 3FN aplicada a um caso pequeno e verdadeiro.</p>
      <div class="pre pre--ddl">${esc(DB.DDL)}</div>
    </div>

    <div class="foot">
      <span>O arquivo abre no DB Browser for SQLite, no DBeaver ou no sqlite3</span>
      <button id="sqlBaixar">Baixar progresso.db</button>
    </div>`;

  $$('.sqitem').forEach(b => b.addEventListener('click', () => {
    const c = CONSULTAS.find(x => x.id === b.dataset.sq);
    sqlAtual = c.sql;
    sqlErro = null;
    $('#sqlIn').value = c.sql;
    rodarSql();
    $('#sqlOut').scrollIntoView({ block: 'nearest' });
  }));

  $('#sqlRun').addEventListener('click', rodarSql);
  $('#sqlBaixar').addEventListener('click', () => DB.baixarArquivo());
  $('#sqlIn').addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') { e.preventDefault(); rodarSql(); }
  });

  rodarSql();
}

/* O console é de leitura. Deixar um DELETE passar aqui seria uma forma
   criativa de perder o progresso no meio da revisão.                    */
const PROIBIDO = /\b(insert|update|delete|drop|alter|create|replace|attach|detach|vacuum|pragma|begin|commit|rollback)\b/i;

function rodarSql() {
  const campo = $('#sqlIn');
  if (!campo) return;
  sqlAtual = campo.value;
  const alvo = $('#sqlOut');

  if (PROIBIDO.test(sqlAtual)) {
    alvo.innerHTML = `<div class="console__erro">
      <b>Recusado</b>Este console só executa consultas de leitura. Para escrever no banco,
      baixe o arquivo e abra num cliente SQLite.</div>`;
    return;
  }

  let r;
  try {
    r = DB.consultar(sqlAtual);
  } catch (e) {
    alvo.innerHTML = `<div class="console__erro"><b>Erro de SQL</b>${esc(e.message || String(e))}</div>`;
    return;
  }

  if (r.vazio || !r.values.length) {
    alvo.innerHTML = `<div class="console__vazio">A consulta rodou e não devolveu nenhuma linha.
      ${nadaAinda() ? 'Ainda não há dados: responda alguns cards ou questões e volte aqui.' : ''}</div>`;
    return;
  }

  const cab = r.columns.map(c => `<th>${esc(c)}</th>`).join('');
  const corpo = r.values.map((linha, i) =>
    `<tr style="--i:${Math.min(i, 24)}">${linha.map(v =>
      `<td>${v === null ? '<i class="nulo">NULL</i>' : esc(v)}</td>`).join('')}</tr>`).join('');

  alvo.innerHTML = `
    <div class="console__meta">${plural(r.values.length, 'linha', 'linhas')} ·
      ${plural(r.columns.length, 'coluna', 'colunas')}</div>
    <div class="tabwrap"><table class="tab"><thead><tr>${cab}</tr></thead><tbody>${corpo}</tbody></table></div>`;
}

function nadaAinda() {
  try { return DB.uma('SELECT COUNT(*) AS n FROM evento').n === 0; } catch (e) { return true; }
}

/* ---------------------------------------------------------------- BOOT

   O aplicativo não arranca sozinho: quem manda é a portaria (js/auth.js),
   depois de abrir o banco e identificar quem chegou.                     */

function iniciar(u, importados) {
  usuario = u;
  mergeExtras();
  DB.sincronizarModulos(MODULES, PARTS);
  load();

  $('#quemSou').textContent = u.nome;
  go('painel');

  if (importados) {
    setTimeout(() => alert('Bem-vindo, ' + u.nome + '.\n\n' + importados +
      ' registros de progresso que estavam guardados neste navegador foram importados ' +
      'para o seu usuário no banco.'), 400);
  }

  if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }
}

/* Fechar a aba no meio de uma sessão não pode custar as últimas respostas. */
window.addEventListener('beforeunload', () => {
  clearTimeout(saveTimer);
  DB.salvarProgresso(store);
  DB.persistir(true);
});

window.BDApp = { iniciar: iniciar };

})();
