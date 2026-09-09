/* =========================================================================
   APP — roteamento, progresso, oficina, flashcards e questões
   ========================================================================= */

(function () {
'use strict';

/* ----------------------------------------------------------- ARMAZENAMENTO */

const KEY = 'bd.progress.v2';
const DAY = 86400000;
const today = () => Math.floor(Date.now() / DAY);
const BOX_WAIT = [0, 1, 3, 7, 16];   /* dias de espera por caixa */

let store = { cards: {}, quiz: {}, of: {} };

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const p = JSON.parse(raw);
      store.cards = p.cards || {};
      store.quiz  = p.quiz  || {};
      store.of    = p.of    || {};
    }
  } catch (e) { /* primeira visita ou storage bloqueado */ }
}

let saveTimer = null;
function save() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try { localStorage.setItem(KEY, JSON.stringify(store)); } catch (e) {}
  }, 120);
}

const cardRec = id => store.cards[id] || (store.cards[id] = { b: 1, d: 0, s: 0 });

/* ------------------------------------------------------------ UTILITÁRIOS */

const $  = (s, r) => (r || document).querySelector(s);
const $$ = (s, r) => Array.prototype.slice.call((r || document).querySelectorAll(s));
const mod = id => MODULES.find(m => m.id === id);
const pad = n => String(n).padStart(2, '0');
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');

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

function moduleScore(id) {
  const cs = CARDS.filter(c => c.m === id);
  const qs = QUESTIONS.filter(q => q.m === id);
  let card = 0;
  cs.forEach(c => { const r = store.cards[c.id]; if (r) card += (r.b - 1) / 4; });
  let quiz = 0;
  qs.forEach(q => { const r = store.quiz[q.id]; if (r && r.last === 'r') quiz += 1; });
  const cp = cs.length ? card / cs.length : 0;
  const qp = qs.length ? quiz / qs.length : 0;
  if (!cs.length) return Math.round(qp * 100);
  if (!qs.length) return Math.round(cp * 100);
  return Math.round((cp * 0.6 + qp * 0.4) * 100);
}

function ofTotalSteps() { return OFICINA.reduce((s, c) => s + c.steps.length, 0); }
function ofDoneSteps() {
  let n = 0;
  OFICINA.forEach(c => { const r = store.of[c.id]; if (r) n += Object.keys(r).length; });
  return n;
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
  const dom = Math.round(MODULES.reduce((s, m) => s + moduleScore(m.id), 0) / MODULES.length);
  return { due, mastered, ans, right, dom, acc: ans ? Math.round(right / ans * 100) : 0 };
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
  if (v === 'cards')     renderCardChips();
  if (v === 'quiz')      renderQuizChips();
  if (v === 'diagramas') renderDiagramas();
  if (v === 'resumo')    renderResumo();
  $('#topCtx').textContent = { painel: 'Painel', oficina: 'Oficina', cards: 'Flashcards',
    quiz: 'Questões', diagramas: 'Diagramas', resumo: 'Resumo' }[v];
}

$('#nav').addEventListener('click', e => {
  const b = e.target.closest('.nav__item');
  if (b) go(b.dataset.view);
});

/* --------------------------------------------------------------- PAINEL */

function renderPainel() {
  const s = globalStats();
  const ofD = ofDoneSteps(), ofT = ofTotalSteps();
  $('#topPct').textContent = s.dom + '%';
  $('#deckSize').textContent = CARDS.length + ' cards · ' + QUESTIONS.length + ' questões · '
    + OFICINA.length + ' casos guiados · ' + DIAGRAMS.length + ' diagramas';
  $('#bandNote').textContent = s.ans
    ? 'Acerto em questões · ' + s.acc + '% em ' + s.ans + ' respondidas'
    : 'Nenhuma questão respondida ainda';
  $('#actReviewSub').textContent = s.due
    ? s.due + ' cards vencidos ou inéditos'
    : 'Tudo em dia — role para escolher um módulo';
  $('#actOfSub').textContent = ofD
    ? ofD + ' de ' + ofT + ' passos concluídos'
    : 'Enunciado → DER → tabelas → 3FN';

  $('#telemetry').innerHTML = `
    <div class="tel">
      <div class="tel__k">Domínio geral</div>
      <div class="tel__v">${s.dom}<small>%</small></div>
      ${meter(s.dom, 12, true)}
    </div>
    <div class="tel">
      <div class="tel__k">Cards na memória</div>
      <div class="tel__v">${s.mastered}<small>/${CARDS.length}</small></div>
      <div class="tel__sub">caixa 4 ou 5</div>
    </div>
    <div class="tel ${s.due ? 'tel--sig' : ''}">
      <div class="tel__k">Revisar hoje</div>
      <div class="tel__v">${s.due}</div>
      <div class="tel__sub">${s.due ? 'aguardando' : 'em dia'}</div>
    </div>
    <div class="tel">
      <div class="tel__k">Oficina</div>
      <div class="tel__v">${ofD}<small>/${ofT}</small></div>
      <div class="tel__sub">passos concluídos</div>
    </div>`;

  let h = '', part = '';
  MODULES.forEach(m => {
    if (m.part !== part) {
      part = m.part;
      h += `<div class="partline">Parte ${m.part} — ${PARTS[m.part]}</div>`;
    }
    const p = moduleScore(m.id);
    const nc = CARDS.filter(c => c.m === m.id).length;
    const nq = QUESTIONS.filter(q => q.m === m.id).length;
    h += `<button class="mod" data-mod="${m.id}">
      <span class="mod__no">${pad(m.id)}</span>
      <span>
        <span class="mod__t">${m.t}</span>
        <span class="mod__tags"><span class="${m.hot ? 'hot' : ''}">${m.tags}</span> · ${nc} cards · ${nq} questões</span>
      </span>
      <span class="mod__right">
        <span class="mod__pct">${p}%</span>
        <span class="mod__bar">${Array.from({ length: 6 }, (_, i) =>
          `<i class="${i < Math.round(p / 100 * 6) ? 'on' : ''}"></i>`).join('')}</span>
      </span>
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
  if (!confirm('Zerar todo o progresso salvo neste aparelho?')) return;
  store = { cards: {}, quiz: {}, of: {} };
  try { localStorage.removeItem(KEY); } catch (e) {}
  renderPainel();
});

/* ======================================================================
   OFICINA — processo guiado
   ====================================================================== */

let ofCase = null;   /* id do caso aberto, ou null para a lista */
let ofStep = 0;
let ofSel  = null;   /* seleção do passo atual */
let ofChecked = false;
let ofShown = false; /* passos do tipo reveal */

function ofRec(id) { return store.of[id] || (store.of[id] = {}); }

function renderOficina() {
  if (ofCase === null) return renderOfList();
  return renderOfStep();
}

function renderOfList() {
  const t = OFICINA.map((c, i) => {
    const r = store.of[c.id] || {};
    const done = Object.keys(r).length;
    const pct = Math.round(done / c.steps.length * 100);
    const scores = Object.keys(r).map(k => r[k]);
    const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : null;
    return `<button class="ofcase" data-case="${c.id}" style="--i:${i}">
      <div class="ofcase__no">${pad(c.n)}</div>
      <div class="ofcase__main">
        <div class="ofcase__t">${c.t}</div>
        <div class="ofcase__s">${c.nivel} · ${c.steps.length} passos</div>
        <div class="ofcase__tags">${c.tags}</div>
      </div>
      <div class="ofcase__right">
        <div class="ofcase__pct">${pct}<small>%</small></div>
        <div class="ofcase__sub">${avg === null ? 'não iniciado' : avg + '% de acerto'}</div>
      </div>
    </button>`;
  }).join('');

  $('#ofRoot').innerHTML = `
    <div class="masthead">
      <div class="masthead__kicker"><b>Oficina</b> <span>o processo completo, passo a passo</span></div>
      <h1 class="masthead__title" style="font-size:clamp(38px,11vw,72px)">Do enunciado<em>até a 3FN.</em></h1>
      <p class="masthead__lead">Cada caso percorre o caminho inteiro: achar as entidades, classificar os atributos, definir as cardinalidades, varrer os casos especiais, desenhar o DER, mapear para tabelas e normalizar. Um passo por vez, conferindo antes de seguir.</p>
    </div>

    <div class="band">
      <div class="band-head">
        <span class="idx">§ 00</span>
        <span class="name">O caminho</span>
      </div>
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
        <span class="section__meta">Comece pelo 01</span>
      </div>
      <div class="oflist">${t}</div>
    </div>

    <div class="foot"><span>Faça cada passo no papel antes de conferir. É aí que fixa.</span></div>`;
}

function openCase(id) {
  ofCase = id; ofStep = 0;
  const r = store.of[id];
  if (r) {
    const c = OFICINA.find(x => x.id === id);
    /* retoma no primeiro passo ainda não concluído */
    for (let i = 0; i < c.steps.length; i++) { if (r[i] === undefined) { ofStep = i; break; } }
  }
  resetStepState();
  renderOfStep();
  window.scrollTo(0, 0);
}

function resetStepState() { ofSel = null; ofChecked = false; ofShown = false; }

function renderOfStep() {
  const c = OFICINA.find(x => x.id === ofCase);

  /* tela de encerramento */
  if (ofStep >= c.steps.length) {
    const r = ofRec(c.id);
    const sc = Object.keys(r).map(k => r[k]);
    const avg = sc.length ? Math.round(sc.reduce((a, b) => a + b, 0) / sc.length) : 0;
    $('#ofRoot').innerHTML = `
      <div class="ofbar">
        <button class="ofback" id="ofBack">← Casos</button>
        <span class="ofbar__t">${c.t}</span>
      </div>
      <div class="result">
        <div class="tel__k">Caso concluído</div>
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
    $('#ofBack').addEventListener('click', () => { ofCase = null; renderOficina(); });
    $('#ofOther').addEventListener('click', () => { ofCase = null; renderOficina(); });
    $('#ofRedo').addEventListener('click', () => {
      delete store.of[c.id]; save(); ofStep = 0; resetStepState(); renderOfStep(); window.scrollTo(0, 0);
    });
    renderPainel();
    return;
  }

  const st = c.steps[ofStep];
  const r  = store.of[c.id] || {};

  /* trilha de passos */
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
      <summary><span class="idx">Enunciado</span><span>${c.nivel}</span></summary>
      <div class="ofenun__b prose">${c.enunciado}</div>
    </details>

    <div class="oftrack">${track}</div>

    <div class="ofstep">
      <div class="ofstep__k"><span class="idx">Passo ${ofStep + 1}</span> ${st.t.replace(/^Passo \d+ — /, '')}</div>
      <div class="ofstep__q">${st.q}</div>
      ${body}
    </div>`;

  $('#ofBack').addEventListener('click', () => { ofCase = null; renderOficina(); });
  $$('.ofdot').forEach(d => d.addEventListener('click', () => {
    ofStep = parseInt(d.dataset.step, 10); resetStepState(); renderOfStep(); window.scrollTo(0, 0);
  }));

  if (st.k === 'pick')   wirePick(st);
  if (st.k === 'assign') wireAssign(st);
  if (st.k === 'reveal') wireReveal(st);
}

/* ---------- pick ---------- */

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
    const i = b.dataset.i;
    ofSel[i] = !ofSel[i];
    renderOfStep();
  }));
  wireFoot(() => {
    let ok = 0;
    st.items.forEach((it, i) => { if (!!ofSel[i] === !!it.ok) ok++; });
    return Math.round(ok / st.items.length * 100);
  });
}

/* ---------- assign ---------- */

function ofAssignHtml(st) {
  if (ofSel === null) ofSel = {};
  const rows = st.rows.map((row, i) => {
    const chosen = ofSel[i];
    const right = ofChecked && chosen === row.a;
    const opts = st.opts.map((o, j) => {
      let cls = chosen === j ? 'on' : '';
      if (ofChecked) {
        if (j === row.a) cls = 'ok';
        else if (chosen === j) cls = 'bad';
        else cls = 'off';
      }
      return `<button class="ofopt ${cls}" data-r="${i}" data-o="${j}" ${ofChecked ? 'disabled' : ''}>${o}</button>`;
    }).join('');
    return `<div class="ofrow ${ofChecked ? (right ? 'is-ok' : 'is-bad') : ''}" style="--i:${i}">
        <div class="ofrow__t">${row.t}</div>
        <div class="ofrow__o">${opts}</div>
        ${ofChecked ? `<div class="ofrow__w"><b>${right ? 'Certo' : 'Resposta: ' + st.opts[row.a]}</b> ${row.why}</div>` : ''}
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

/* ---------- reveal ---------- */

function ofRevealHtml(st) {
  if (!ofShown) {
    return `<div class="ofpaper">
        <div class="ofpaper__k">Faça no papel primeiro</div>
        <p>Este passo não tem alternativa para clicar. Escreva ou desenhe a sua resposta e só então
        abra o gabarito — conferir antes de tentar não fixa nada.</p>
      </div>
      <div class="btnrow"><button class="btn btn--solid btn--wide" id="ofShow">Já fiz — mostrar gabarito</button></div>`;
  }
  const fig = st.svg ? `<div class="dframe dframe--svg" style="margin-bottom:18px">${SVGS[st.svg]()}</div>`
    : st.img ? `<div class="dframe" data-img="${st.img}" style="margin-bottom:18px">
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

/* ---------- rodapé comum dos passos ---------- */

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

let ofLastPct = 0;

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
}

function nextStep() { ofStep++; resetStepState(); renderOfStep(); window.scrollTo(0, 0); }

$('#ofRoot').addEventListener('click', e => {
  const c = e.target.closest('.ofcase');
  if (c) openCase(c.dataset.case);
});

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

function renderCardChips() {
  const nDue = cardPool('due').length, nHard = cardPool('hard').length;
  let h = `<button class="chip" data-f="due"  aria-pressed="${cardFilter === 'due'}">Hoje <b>${nDue}</b></button>
           <button class="chip" data-f="all"  aria-pressed="${cardFilter === 'all'}">Tudo <b>${CARDS.length}</b></button>
           <button class="chip" data-f="hard" aria-pressed="${cardFilter === 'hard'}">Difíceis <b>${nHard}</b></button>`;
  MODULES.forEach(m => {
    const n = CARDS.filter(c => c.m === m.id).length;
    h += `<button class="chip" data-f="m${m.id}" aria-pressed="${cardFilter === 'm' + m.id}">§${pad(m.id)} <b>${n}</b></button>`;
  });
  $('#cardChips').innerHTML = h;
  buildQueue();
}

$('#cardChips').addEventListener('click', e => {
  const c = e.target.closest('.chip');
  if (!c) return;
  cardFilter = c.dataset.f;
  renderCardChips();
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
           <div class="tel__k">Sessão concluída</div>
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
    if (ag) ag.addEventListener('click', () => { if (!done) cardFilter = 'all'; renderCardChips(); });
    const tq = $('#toQuiz');
    if (tq) tq.addEventListener('click', () => go('quiz'));
    renderPainel();
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
      <div class="fcard__body">
        <div class="fcard__q">${c.q}</div>
        ${(!revealed && c.hint) ? `<div class="fcard__hint">Pista · ${c.hint}</div>` : ''}
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

function renderQuizChips() {
  let h = `<button class="chip" data-f="sim"   aria-pressed="${quizFilter === 'sim'}">Simulado <b>20</b></button>
           <button class="chip" data-f="wrong" aria-pressed="${quizFilter === 'wrong'}">Errei <b>${quizPool('wrong').length}</b></button>
           <button class="chip" data-f="new"   aria-pressed="${quizFilter === 'new'}">Inéditas <b>${quizPool('new').length}</b></button>
           <button class="chip" data-f="fig"   aria-pressed="${quizFilter === 'fig'}">Com diagrama <b>${quizPool('fig').length}</b></button>`;
  MODULES.forEach(m => {
    const n = QUESTIONS.filter(q => q.m === m.id).length;
    h += `<button class="chip" data-f="m${m.id}" aria-pressed="${quizFilter === 'm' + m.id}">§${pad(m.id)} <b>${n}</b></button>`;
  });
  $('#quizChips').innerHTML = h;
  startQuiz();
}

$('#quizChips').addEventListener('click', e => {
  const c = e.target.closest('.chip');
  if (!c) return;
  quizFilter = c.dataset.f;
  renderQuizChips();
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
      return `<div class="result__row" style="--i:${i}">
                <span class="mk ${l.ok ? 'y' : 'n'}">${l.ok ? '✓' : '✕'}</span>
                <span>${q.q}</span></div>`;
    }).join('');
    st.innerHTML = `<div class="result">
        <div class="tel__k">Resultado</div>
        <div class="result__big">${pct}<small>%</small></div>
        <div class="result__msg">${ok} de ${n} corretas. ${msg}</div>
        <div class="btnrow btnrow--split">
          <button class="btn btn--solid" id="qAgain">Refazer</button>
          <button class="btn" id="qWrong">Só as que errei</button>
        </div>
        <div class="result__list">${rows}</div>
      </div>`;
    $('#qAgain').addEventListener('click', startQuiz);
    $('#qWrong').addEventListener('click', () => { quizFilter = 'wrong'; renderQuizChips(); });
    renderPainel();
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

  st.innerHTML = `
    <div class="quiz__head">
      <span class="ix">§${pad(m.id)}</span><span>${m.t}</span>
      <span class="quiz__score">${qsess.i + 1}<b>/</b>${qsess.ids.length} · acertos <b>${ok}</b></span>
    </div>
    <h2 class="quiz__q">${q.q}</h2>
    ${q.img ? `<div class="quiz__fig" data-img="${q.img}"><img src="assets/img/${q.img}" alt="Diagrama da questão" loading="lazy"><span class="dframe__zoom">Ampliar</span></div>` : ''}
    <div class="opts">${opts}</div>
    ${done ? `<div class="explain"><b class="tag">${qsess.picked === q.c ? 'Correto' : 'Resposta certa: ' + 'ABCD'.charAt(q.c)}</b>${q.e}</div>
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
  save();
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
    `<button class="chip" data-f="${k}" aria-pressed="${dFilter === k}">${labels[k]} <b>${counts[k]}</b></button>`).join('');

  const list = DIAGRAMS.filter(d => dFilter === 'todos' || d.src === dFilter);
  const srcLabel = { aula: 'Diagrama da aula', guia: 'Figura do guia', autoral: 'Feito para este sistema' };

  $('#dList').innerHTML = list.map((d, i) => {
    const m = mod(d.m);
    const frame = d.svg
      ? `<div class="dframe dframe--svg">${SVGS[d.svg]()}</div>`
      : `<div class="dframe" data-img="${d.img}" data-t="${esc(d.t)}">
           <img src="assets/img/${d.img}" alt="${esc(d.t)}" loading="lazy">
           <span class="dframe__zoom">Ampliar</span></div>`;
    return `<article class="dcard">
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
  if (meta) meta.setAttribute('content', nx === 'dark' ? '#101010' : '#E8E4D9');
});

document.addEventListener('keydown', e => {
  if ($('#lightbox').classList.contains('on')) {
    if (e.key === 'Escape') closeLb();
    if (e.key === '+' || e.key === '=') zoom(0.6);
    if (e.key === '-') zoom(-0.6);
    return;
  }
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

/* ---------------------------------------------------------------- BOOT */

load();
renderPainel();

/* Offline: só faz sentido quando servido por http/https (GitHub Pages ou
   servidor local). Aberto direto do disco, o navegador recusa o registro. */
if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
}

})();
