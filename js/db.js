/* =========================================================================
   BANCO DE DADOS DO PROGRESSO — SQLite de verdade, dentro do navegador

   O GitHub Pages serve arquivos estaticos: nao existe servidor para rodar
   MySQL ou Postgres. A solucao aqui e o SQLite compilado para WebAssembly
   (sql.js): o mesmo motor relacional que roda em celulares e navegadores,
   so que executando dentro da aba. O arquivo .db inteiro fica guardado no
   IndexedDB deste computador e volta a ser lido a cada visita.

   Consequencia pratica: e SQL de verdade. CREATE TABLE, PRIMARY KEY,
   FOREIGN KEY, JOIN, GROUP BY. A tela "Banco" deixa voce consultar este
   esquema com as suas proprias respostas dentro dele.
   ========================================================================= */

const DB = (function () {
'use strict';

/* --------------------------------------------------------------- SHA-256
   Implementacao propria, em JavaScript puro, para o hash da senha.
   Por que nao usar o crypto.subtle do navegador: ele so existe em
   contexto seguro (https ou localhost). Se voce abrir o index.html com
   dois cliques, o endereco vira file:// e o crypto.subtle some. Com esta
   implementacao o login funciona igual nos dois casos, e a conta criada
   offline continua valendo depois no GitHub Pages.                       */

const K256 = [
  0x428a2f98,0x71374491,0xb5c0fbcf,0xe9b5dba5,0x3956c25b,0x59f111f1,0x923f82a4,0xab1c5ed5,
  0xd807aa98,0x12835b01,0x243185be,0x550c7dc3,0x72be5d74,0x80deb1fe,0x9bdc06a7,0xc19bf174,
  0xe49b69c1,0xefbe4786,0x0fc19dc6,0x240ca1cc,0x2de92c6f,0x4a7484aa,0x5cb0a9dc,0x76f988da,
  0x983e5152,0xa831c66d,0xb00327c8,0xbf597fc7,0xc6e00bf3,0xd5a79147,0x06ca6351,0x14292967,
  0x27b70a85,0x2e1b2138,0x4d2c6dfc,0x53380d13,0x650a7354,0x766a0abb,0x81c2c92e,0x92722c85,
  0xa2bfe8a1,0xa81a664b,0xc24b8b70,0xc76c51a3,0xd192e819,0xd6990624,0xf40e3585,0x106aa070,
  0x19a4c116,0x1e376c08,0x2748774c,0x34b0bcb5,0x391c0cb3,0x4ed8aa4a,0x5b9cca4f,0x682e6ff3,
  0x748f82ee,0x78a5636f,0x84c87814,0x8cc70208,0x90befffa,0xa4506ceb,0xbef9a3f7,0xc67178f2
];

function sha256Bytes(bytes) {
  const h = [0x6a09e667,0xbb67ae85,0x3c6ef372,0xa54ff53a,0x510e527f,0x9b05688c,0x1f83d9ab,0x5be0cd19];
  const len = bytes.length;
  const bitLen = len * 8;
  const buf = new Uint8Array((((len + 8) >> 6) + 1) << 6);
  buf.set(bytes);
  buf[len] = 0x80;
  const dv = new DataView(buf.buffer);
  dv.setUint32(buf.length - 4, bitLen >>> 0, false);
  dv.setUint32(buf.length - 8, Math.floor(bitLen / 4294967296), false);

  const w = new Uint32Array(64);
  for (let i = 0; i < buf.length; i += 64) {
    for (let t = 0; t < 16; t++) w[t] = dv.getUint32(i + t * 4, false);
    for (let t = 16; t < 64; t++) {
      const a = w[t - 15], b = w[t - 2];
      const s0 = ((a >>> 7) | (a << 25)) ^ ((a >>> 18) | (a << 14)) ^ (a >>> 3);
      const s1 = ((b >>> 17) | (b << 15)) ^ ((b >>> 19) | (b << 13)) ^ (b >>> 10);
      w[t] = (w[t - 16] + s0 + w[t - 7] + s1) >>> 0;
    }
    let a = h[0], b = h[1], c = h[2], d = h[3], e = h[4], f = h[5], g = h[6], hh = h[7];
    for (let t = 0; t < 64; t++) {
      const S1 = ((e >>> 6) | (e << 26)) ^ ((e >>> 11) | (e << 21)) ^ ((e >>> 25) | (e << 7));
      const ch = (e & f) ^ (~e & g);
      const t1 = (hh + S1 + ch + K256[t] + w[t]) >>> 0;
      const S0 = ((a >>> 2) | (a << 30)) ^ ((a >>> 13) | (a << 19)) ^ ((a >>> 22) | (a << 10));
      const maj = (a & b) ^ (a & c) ^ (b & c);
      const t2 = (S0 + maj) >>> 0;
      hh = g; g = f; f = e; e = (d + t1) >>> 0;
      d = c; c = b; b = a; a = (t1 + t2) >>> 0;
    }
    h[0] = (h[0] + a) >>> 0; h[1] = (h[1] + b) >>> 0; h[2] = (h[2] + c) >>> 0; h[3] = (h[3] + d) >>> 0;
    h[4] = (h[4] + e) >>> 0; h[5] = (h[5] + f) >>> 0; h[6] = (h[6] + g) >>> 0; h[7] = (h[7] + hh) >>> 0;
  }
  const out = new Uint8Array(32);
  const ov = new DataView(out.buffer);
  for (let i = 0; i < 8; i++) ov.setUint32(i * 4, h[i], false);
  return out;
}

const enc = s => new TextEncoder().encode(s);
const hex = b => Array.prototype.map.call(b, x => x.toString(16).padStart(2, '0')).join('');

/* Derivacao com repeticao: encarece a tentativa de forca bruta sem
   depender de biblioteca nenhuma. Vinte mil voltas custam pouco mais de
   um piscar de olhos aqui e deixam um ataque de dicionario local caro.  */
const VOLTAS = 20000;

function derivar(senha, salt) {
  let x = sha256Bytes(enc(salt + ' ' + senha));
  const marca = new Uint8Array(36);
  const mv = new DataView(marca.buffer);
  for (let i = 1; i < VOLTAS; i++) {
    marca.set(x);
    mv.setUint32(32, i, false);
    x = sha256Bytes(marca);
  }
  return hex(x);
}

function novoSalt() {
  const b = new Uint8Array(16);
  if (self.crypto && self.crypto.getRandomValues) self.crypto.getRandomValues(b);
  else for (let i = 0; i < b.length; i++) b[i] = Math.floor(Math.random() * 256);
  return hex(b);
}

/* --------------------------------------------------------- ARMAZENAMENTO
   O arquivo .db e um blob binario. O IndexedDB e o unico armazenamento do
   navegador que guarda binario grande sem ter que virar texto base64.    */

const IDB_NOME  = 'bd-estudo';
const IDB_STORE = 'arquivos';
const IDB_CHAVE = 'progresso.db';

function abrirIDB() {
  return new Promise((ok, erro) => {
    const req = indexedDB.open(IDB_NOME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(IDB_STORE)) req.result.createObjectStore(IDB_STORE);
    };
    req.onsuccess = () => ok(req.result);
    req.onerror   = () => erro(req.error);
  });
}

function lerArquivo() {
  return abrirIDB().then(bd => new Promise((ok, erro) => {
    const t = bd.transaction(IDB_STORE, 'readonly').objectStore(IDB_STORE).get(IDB_CHAVE);
    t.onsuccess = () => ok(t.result || null);
    t.onerror   = () => erro(t.error);
  })).catch(() => null);
}

function gravarArquivo(bytes) {
  return abrirIDB().then(bd => new Promise((ok, erro) => {
    const t = bd.transaction(IDB_STORE, 'readwrite');
    t.objectStore(IDB_STORE).put(bytes, IDB_CHAVE);
    t.oncomplete = () => ok(true);
    t.onerror    = () => erro(t.error);
  })).catch(() => false);
}

/* ------------------------------------------------------------------ DDL
   Esquema normalizado ate a 3FN, escrito do jeito que a disciplina pede:
   chave primaria em toda tabela, chave composta onde e o par que
   identifica a linha, chave estrangeira declarada, e nenhuma coluna que
   possa ser deduzida de outra.                                          */

const DDL = [
'/* Quem estuda. Uma linha por login. */',
'CREATE TABLE IF NOT EXISTS usuario (',
'  id_usuario    INTEGER PRIMARY KEY AUTOINCREMENT,',
'  login         TEXT    NOT NULL UNIQUE,',
'  nome          TEXT    NOT NULL,',
'  hash_senha    TEXT    NOT NULL,',
'  salt          TEXT    NOT NULL,',
'  criado_em     TEXT    NOT NULL,',
'  ultimo_acesso TEXT',
');',
'',
'/* Estado de cada flashcard na repeticao espacada.',
'   A chave e o PAR usuario+card: o mesmo card esta numa caixa diferente',
'   para cada pessoa, entao nenhum dos dois sozinho identifica a linha. */',
'CREATE TABLE IF NOT EXISTS card_estado (',
'  id_usuario      INTEGER NOT NULL,',
'  id_card         TEXT    NOT NULL,',
'  caixa           INTEGER NOT NULL DEFAULT 1,',
'  proxima_revisao INTEGER NOT NULL DEFAULT 0,',
'  tentativas      INTEGER NOT NULL DEFAULT 0,',
'  PRIMARY KEY (id_usuario, id_card),',
'  FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)',
');',
'',
'/* Desempenho acumulado por questao. */',
'CREATE TABLE IF NOT EXISTS questao_estado (',
'  id_usuario       INTEGER NOT NULL,',
'  id_questao       TEXT    NOT NULL,',
'  acertos          INTEGER NOT NULL DEFAULT 0,',
'  erros            INTEGER NOT NULL DEFAULT 0,',
'  ultimo_resultado TEXT,',
'  PRIMARY KEY (id_usuario, id_questao),',
'  FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)',
');',
'',
'/* Melhor nota de cada passo de cada caso da Oficina.',
'   Chave tripla: o passo so existe dentro de um caso, e a nota so existe',
'   dentro de um usuario. */',
'CREATE TABLE IF NOT EXISTS oficina_passo (',
'  id_usuario  INTEGER NOT NULL,',
'  id_caso     TEXT    NOT NULL,',
'  nr_passo    INTEGER NOT NULL,',
'  melhor_nota INTEGER NOT NULL,',
'  PRIMARY KEY (id_usuario, id_caso, nr_passo),',
'  FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)',
');',
'',
'/* Log de respostas. Tabela de fato: uma linha por evento, nunca alterada.',
'   E dela que saem o rendimento por dia e a sequencia de estudo. */',
'CREATE TABLE IF NOT EXISTS evento (',
'  id_evento  INTEGER PRIMARY KEY AUTOINCREMENT,',
'  id_usuario INTEGER NOT NULL,',
'  momento    TEXT    NOT NULL,',
'  dia        TEXT    NOT NULL,',
'  tipo       TEXT    NOT NULL,',
'  referencia TEXT,',
'  id_modulo  INTEGER,',
'  acertou    INTEGER,',
'  FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)',
');',
'',
'/* Uma linha por simulado iniciado, no formato da prova do professor.',
'   Guarda a tentativa inteira, nao a resposta solta — e por isso que da',
'   para perguntar "minha nota esta subindo?" em vez de so "acertei?". */',
'CREATE TABLE IF NOT EXISTS prova_tentativa (',
'  id_tentativa INTEGER PRIMARY KEY AUTOINCREMENT,',
'  id_usuario   INTEGER NOT NULL,',
'  iniciada_em  TEXT    NOT NULL,',
'  concluida_em TEXT,',
'  pontos       REAL,',
'  total        REAL,',
'  FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)',
');',
'',
'/* Cada questao respondida dentro de uma tentativa. A chave e o par',
'   tentativa+questao: a mesma questao aparece em varios simulados. */',
'CREATE TABLE IF NOT EXISTS prova_resposta (',
'  id_tentativa INTEGER NOT NULL,',
'  id_questao   TEXT    NOT NULL,',
'  escolha      INTEGER,',
'  acertou      INTEGER NOT NULL DEFAULT 0,',
'  itens_certos INTEGER,',
'  itens_total  INTEGER,',
'  PRIMARY KEY (id_tentativa, id_questao),',
'  FOREIGN KEY (id_tentativa) REFERENCES prova_tentativa (id_tentativa)',
');',
'',
'/* Os 17 modulos da disciplina. Tabela de dominio: nao guarda progresso,',
'   guarda o catalogo. Existe para que as consultas da tela "Banco" possam',
'   fazer JOIN e mostrar o nome do assunto em vez do numero cru. */',
'CREATE TABLE IF NOT EXISTS modulo (',
'  id_modulo INTEGER PRIMARY KEY,',
'  parte     TEXT NOT NULL,',
'  nome      TEXT NOT NULL,',
'  etiqueta  TEXT,',
'  cai_muito INTEGER NOT NULL DEFAULT 0',
');',
'',
'/* Preferencias por usuario, no formato chave/valor. */',
'CREATE TABLE IF NOT EXISTS preferencia (',
'  id_usuario INTEGER NOT NULL,',
'  chave      TEXT    NOT NULL,',
'  valor      TEXT,',
'  PRIMARY KEY (id_usuario, chave),',
'  FOREIGN KEY (id_usuario) REFERENCES usuario (id_usuario)',
');',
'',
'CREATE INDEX IF NOT EXISTS ix_evento_dia    ON evento (id_usuario, dia);',
'CREATE INDEX IF NOT EXISTS ix_evento_modulo ON evento (id_usuario, id_modulo);',
'CREATE INDEX IF NOT EXISTS ix_card_revisao  ON card_estado (id_usuario, proxima_revisao);'
].join('\n');

/* --------------------------------------------------------------- ESTADO */

let SQL = null;      /* modulo sql.js carregado                          */
let db  = null;      /* conexao aberta                                   */
let atual = null;    /* usuario logado                                   */
let gravando = null; /* temporizador da gravacao no IndexedDB            */

const agora = () => new Date().toISOString();
const hoje  = () => new Date().toISOString().slice(0, 10);

/* ------------------------------------------------------------- ARRANQUE */

function boot() {
  if (db) return Promise.resolve(true);
  return initSqlJs({ locateFile: f => 'assets/vendor/' + f })
    .then(mod => { SQL = mod; return lerArquivo(); })
    .then(bytes => {
      db = bytes ? new SQL.Database(new Uint8Array(bytes)) : new SQL.Database();
      db.run('PRAGMA foreign_keys = ON;');
      db.run(DDL);
      return true;
    });
}

/* Persiste o arquivo inteiro. Escrever duzentos kilobytes no IndexedDB a
   cada clique seria desperdicio, entao ha um respiro de 700ms.          */
function persistir(imediato) {
  if (!db) return Promise.resolve();
  clearTimeout(gravando);
  const grava = () => { try { gravarArquivo(db.export()); } catch (e) {} };
  if (imediato) { grava(); return Promise.resolve(); }
  gravando = setTimeout(grava, 700);
  return Promise.resolve();
}

/* -------------------------------------------------------------- CONSULTA */

function linhas(sql, params) {
  const st = db.prepare(sql);
  if (params) st.bind(params);
  const out = [];
  while (st.step()) out.push(st.getAsObject());
  st.free();
  return out;
}

function uma(sql, params) {
  const r = linhas(sql, params);
  return r.length ? r[0] : null;
}

/* Consulta livre da tela "Banco": devolve colunas e valores separados,
   que e o formato que a tabela daquela tela espera.                     */
function consultar(sql) {
  const res = db.exec(sql);
  if (!res.length) return { columns: [], values: [], vazio: true };
  return { columns: res[0].columns, values: res[0].values, vazio: false };
}

/* ----------------------------------------------------------------- LOGIN */

function listarUsuarios() {
  return linhas('SELECT id_usuario, login, nome, ultimo_acesso FROM usuario ORDER BY login');
}

function criarUsuario(login, nome, senha) {
  login = String(login || '').trim().toLowerCase();
  nome  = String(nome || '').trim() || login;
  if (!/^[a-z0-9._-]{3,24}$/.test(login))
    return { erro: 'O usuário aceita de 3 a 24 caracteres: letras, números, ponto, hífen e sublinhado.' };
  if (String(senha || '').length < 4)
    return { erro: 'A senha precisa de pelo menos 4 caracteres.' };
  if (uma('SELECT 1 AS x FROM usuario WHERE login = ?', [login]))
    return { erro: 'Já existe um usuário com esse nome neste computador.' };

  const salt = novoSalt();
  db.run('INSERT INTO usuario (login, nome, hash_senha, salt, criado_em) VALUES (?,?,?,?,?)',
         [login, nome, derivar(senha, salt), salt, agora()]);
  persistir(true);
  return autenticar(login, senha);
}

function autenticar(login, senha) {
  login = String(login || '').trim().toLowerCase();
  const u = uma('SELECT * FROM usuario WHERE login = ?', [login]);
  if (!u) return { erro: 'Usuário não encontrado neste computador.' };
  if (derivar(senha, u.salt) !== u.hash_senha) return { erro: 'Senha incorreta.' };

  db.run('UPDATE usuario SET ultimo_acesso = ? WHERE id_usuario = ?', [agora(), u.id_usuario]);
  atual = { id: u.id_usuario, login: u.login, nome: u.nome, criado_em: u.criado_em };
  persistir(true);
  return { usuario: atual };
}

/* "Continuar conectado" guarda apenas o nome do login. A senha nao e
   gravada em lugar nenhum — nem em texto, nem cifrada.                  */
function lembrar(login) {
  try { localStorage.setItem('bd.sessao', login); } catch (e) {}
}

function esquecer() {
  try { localStorage.removeItem('bd.sessao'); } catch (e) {}
}

function retomarSessao() {
  let login = null;
  try { login = localStorage.getItem('bd.sessao'); } catch (e) {}
  if (!login) return null;
  const u = uma('SELECT * FROM usuario WHERE login = ?', [login]);
  if (!u) return null;
  db.run('UPDATE usuario SET ultimo_acesso = ? WHERE id_usuario = ?', [agora(), u.id_usuario]);
  atual = { id: u.id_usuario, login: u.login, nome: u.nome, criado_em: u.criado_em };
  persistir();
  return atual;
}

function sair() {
  persistir(true);
  atual = null;
  esquecer();
}

const usuarioAtual = () => atual;

/* ------------------------------------------------------------- PROGRESSO
   O aplicativo trabalha com um objeto em memoria; o banco e a fonte da
   verdade entre uma visita e outra. Aqui ficam as duas traducoes.       */

function carregarProgresso() {
  const p = { cards: {}, quiz: {}, of: {}, hist: [] };
  if (!atual) return p;

  linhas('SELECT id_card, caixa, proxima_revisao, tentativas FROM card_estado WHERE id_usuario = ?', [atual.id])
    .forEach(r => { p.cards[r.id_card] = { b: r.caixa, d: r.proxima_revisao, s: r.tentativas }; });

  linhas('SELECT id_questao, acertos, erros, ultimo_resultado FROM questao_estado WHERE id_usuario = ?', [atual.id])
    .forEach(r => { p.quiz[r.id_questao] = { r: r.acertos, w: r.erros, last: r.ultimo_resultado }; });

  linhas('SELECT id_caso, nr_passo, melhor_nota FROM oficina_passo WHERE id_usuario = ?', [atual.id])
    .forEach(r => { (p.of[r.id_caso] || (p.of[r.id_caso] = {}))[r.nr_passo] = r.melhor_nota; });

  linhas('SELECT dia, id_modulo, acertou FROM evento WHERE id_usuario = ? AND tipo = ' +
         "'questao' ORDER BY id_evento DESC LIMIT 240", [atual.id])
    .reverse()
    .forEach(r => p.hist.push({ d: Math.floor(Date.parse(r.dia) / 86400000), m: r.id_modulo, ok: r.acertou }));

  return p;
}

function salvarProgresso(store) {
  if (!atual || !db) return;
  const u = atual.id;
  db.run('BEGIN');
  try {
    Object.keys(store.cards).forEach(id => {
      const c = store.cards[id];
      db.run('INSERT INTO card_estado (id_usuario, id_card, caixa, proxima_revisao, tentativas) ' +
             'VALUES (?,?,?,?,?) ON CONFLICT (id_usuario, id_card) DO UPDATE SET ' +
             'caixa = excluded.caixa, proxima_revisao = excluded.proxima_revisao, ' +
             'tentativas = excluded.tentativas',
             [u, id, c.b, c.d, c.s]);
    });
    Object.keys(store.quiz).forEach(id => {
      const q = store.quiz[id];
      db.run('INSERT INTO questao_estado (id_usuario, id_questao, acertos, erros, ultimo_resultado) ' +
             'VALUES (?,?,?,?,?) ON CONFLICT (id_usuario, id_questao) DO UPDATE SET ' +
             'acertos = excluded.acertos, erros = excluded.erros, ' +
             'ultimo_resultado = excluded.ultimo_resultado',
             [u, id, q.r, q.w, q.last]);
    });
    Object.keys(store.of).forEach(caso => {
      const passos = store.of[caso];
      Object.keys(passos).forEach(nr => {
        db.run('INSERT INTO oficina_passo (id_usuario, id_caso, nr_passo, melhor_nota) ' +
               'VALUES (?,?,?,?) ON CONFLICT (id_usuario, id_caso, nr_passo) DO UPDATE SET ' +
               'melhor_nota = MAX(melhor_nota, excluded.melhor_nota)',
               [u, caso, parseInt(nr, 10), passos[nr]]);
      });
    });
    db.run('COMMIT');
  } catch (e) {
    try { db.run('ROLLBACK'); } catch (e2) {}
  }
  persistir();
}

/* O catalogo de modulos vive no JavaScript (data-core.js) porque e dele
   que as telas leem. Aqui ele e espelhado para dentro do banco, de modo
   que uma consulta possa juntar o desempenho ao nome do assunto.        */
function sincronizarModulos(modulos, partes) {
  if (!db) return;
  db.run('BEGIN');
  try {
    modulos.forEach(m => {
      db.run('INSERT INTO modulo (id_modulo, parte, nome, etiqueta, cai_muito) VALUES (?,?,?,?,?) ' +
             'ON CONFLICT (id_modulo) DO UPDATE SET parte = excluded.parte, nome = excluded.nome, ' +
             'etiqueta = excluded.etiqueta, cai_muito = excluded.cai_muito',
             [m.id, (partes && partes[m.part]) ? m.part + ' — ' + partes[m.part] : m.part,
              m.t, m.tags || null, m.hot ? 1 : 0]);
    });
    db.run('COMMIT');
  } catch (e) {
    try { db.run('ROLLBACK'); } catch (e2) {}
  }
  persistir();
}

/* O log de eventos nao e reescrito: cada resposta entra uma vez e fica. */
function registrarEvento(tipo, referencia, idModulo, acertou) {
  if (!atual || !db) return;
  db.run('INSERT INTO evento (id_usuario, momento, dia, tipo, referencia, id_modulo, acertou) ' +
         'VALUES (?,?,?,?,?,?,?)',
         [atual.id, agora(), hoje(), tipo, referencia || null,
          idModulo == null ? null : idModulo,
          acertou == null ? null : (acertou ? 1 : 0)]);
  persistir();
}

/* ----------------------------------------------------------------- PROVA */

function abrirTentativa() {
  if (!atual || !db) return null;
  db.run('INSERT INTO prova_tentativa (id_usuario, iniciada_em) VALUES (?,?)', [atual.id, agora()]);
  const r = uma('SELECT last_insert_rowid() AS id');
  persistir();
  return r ? r.id : null;
}

function gravarRespostaProva(idTentativa, idQuestao, escolha, acertou, itensCertos, itensTotal) {
  if (!atual || !db || !idTentativa) return;
  db.run('INSERT INTO prova_resposta (id_tentativa, id_questao, escolha, acertou, itens_certos, itens_total) ' +
         'VALUES (?,?,?,?,?,?) ON CONFLICT (id_tentativa, id_questao) DO UPDATE SET ' +
         'escolha = excluded.escolha, acertou = excluded.acertou, ' +
         'itens_certos = excluded.itens_certos, itens_total = excluded.itens_total',
         [idTentativa, idQuestao, escolha, acertou ? 1 : 0, itensCertos, itensTotal]);
  persistir();
}

function fecharTentativa(idTentativa, pontos, total) {
  if (!atual || !db || !idTentativa) return;
  db.run('UPDATE prova_tentativa SET concluida_em = ?, pontos = ?, total = ? WHERE id_tentativa = ?',
         [agora(), pontos, total, idTentativa]);
  persistir(true);
}

/* Só as tentativas que o usuário levou até o fim entram no histórico —
   simulado abandonado no meio não é nota. */
function historicoProvas(limite) {
  if (!atual || !db) return [];
  return linhas('SELECT id_tentativa, concluida_em, pontos, total FROM prova_tentativa ' +
                'WHERE id_usuario = ? AND concluida_em IS NOT NULL ' +
                'ORDER BY id_tentativa DESC LIMIT ?', [atual.id, limite || 10]);
}

function zerarProgresso() {
  if (!atual || !db) return;
  const u = atual.id;
  db.run('BEGIN');
  try {
    db.run('DELETE FROM prova_resposta WHERE id_tentativa IN ' +
           '(SELECT id_tentativa FROM prova_tentativa WHERE id_usuario = ?)', [u]);
    ['prova_tentativa', 'card_estado', 'questao_estado', 'oficina_passo', 'evento']
      .forEach(t => db.run('DELETE FROM ' + t + ' WHERE id_usuario = ?', [u]));
    db.run('COMMIT');
  } catch (e) {
    try { db.run('ROLLBACK'); } catch (e2) {}
  }
  persistir(true);
}

/* -------------------------------------------------------------- MIGRACAO
   Quem ja estudou antes de o login existir tem progresso em localStorage.
   Na primeira entrada esse progresso e transferido para o banco, uma vez
   so, e a marca fica gravada em preferencia para nao repetir.           */

function importarLocalStorage() {
  if (!atual) return 0;
  if (uma('SELECT 1 AS x FROM preferencia WHERE id_usuario = ? AND chave = ?',
          [atual.id, 'importou_localstorage'])) return 0;

  let bruto = null;
  try { bruto = localStorage.getItem('bd.progress.v3') || localStorage.getItem('bd.progress.v2'); } catch (e) {}

  let n = 0;
  if (bruto) {
    try {
      const p = JSON.parse(bruto);
      const store = { cards: p.cards || {}, quiz: p.quiz || {}, of: p.of || {} };
      n = Object.keys(store.cards).length + Object.keys(store.quiz).length;
      salvarProgresso(store);
      (p.hist || []).forEach(h => {
        const dia = new Date(h.d * 86400000).toISOString().slice(0, 10);
        db.run('INSERT INTO evento (id_usuario, momento, dia, tipo, referencia, id_modulo, acertou) ' +
               "VALUES (?,?,?,'questao',NULL,?,?)",
               [atual.id, dia + 'T12:00:00.000Z', dia, h.m, h.ok ? 1 : 0]);
      });
    } catch (e) {}
  }
  db.run('INSERT OR REPLACE INTO preferencia (id_usuario, chave, valor) VALUES (?,?,?)',
         [atual.id, 'importou_localstorage', agora()]);
  persistir(true);
  return n;
}

/* ------------------------------------------------------------ EXPORTACAO
   O arquivo .db baixado abre no DB Browser for SQLite, no DBeaver ou no
   proprio sqlite3 da linha de comando. Serve de backup e de material de
   aula: e um banco relacional pequeno e real para praticar consultas.   */

function baixarArquivo() {
  const bytes = db.export();
  const url = URL.createObjectURL(new Blob([bytes], { type: 'application/x-sqlite3' }));
  const a = document.createElement('a');
  a.href = url;
  a.download = 'progresso-bd-' + hoje() + '.db';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 4000);
}

function tamanho() {
  try { return db.export().length; } catch (e) { return 0; }
}

return {
  boot, DDL,
  listarUsuarios, criarUsuario, autenticar, retomarSessao, lembrar, esquecer, sair, usuarioAtual,
  carregarProgresso, salvarProgresso, registrarEvento, zerarProgresso, sincronizarModulos,
  abrirTentativa, gravarRespostaProva, fecharTentativa, historicoProvas,
  importarLocalStorage, consultar, linhas, uma, baixarArquivo, tamanho, persistir
};

})();
