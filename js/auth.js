/* =========================================================================
   PORTARIA — carrega o banco, identifica quem chegou e solta o aplicativo

   Esta camada roda antes de tudo. Ela liga o SQLite, procura uma sessao
   guardada e, se nao achar, desenha a folha de entrada. So depois de
   autenticar e que o aplicativo recebe o progresso e comeca.
   ========================================================================= */

(function () {
'use strict';

const $ = s => document.querySelector(s);

const porta   = $('#porta');
const armacao = $('.frame');

let modo = 'entrar';   /* entrar | criar */
let recado = null;     /* mensagem de erro ou aviso da ultima tentativa */

/* ------------------------------------------------------------- DESENHO */

function desenhar(estado) {
  const contas = (estado === 'pronto') ? DB.listarUsuarios() : [];
  const primeiraVez = contas.length === 0;
  if (primeiraVez && modo === 'entrar') modo = 'criar';

  const carregando = estado !== 'pronto';

  porta.innerHTML = `
    <div class="porta__marca porta__marca--tl"></div>
    <div class="porta__marca porta__marca--tr"></div>
    <div class="porta__marca porta__marca--bl"></div>
    <div class="porta__marca porta__marca--br"></div>

    <div class="porta__grade">

      <div class="porta__esq">
        <div class="porta__kicker">Centro Universitário Padre Anchieta <b>·</b> Banco de Dados I</div>
        <h1 class="porta__t">Estudar<em>na mão.</em></h1>
        <p class="porta__lead">Flashcards com repetição espaçada, questões comentadas e uma
        oficina que vai do enunciado até a 3FN. O que você responde fica gravado num banco
        SQLite dentro deste computador — e volta exatamente de onde parou.</p>

        <div class="porta__zona">
          <div class="porta__zonaline">
            <span class="porta__zk">Motor</span>
            <span class="porta__zv">SQLite <b>·</b> WebAssembly</span>
          </div>
          <div class="porta__zonaline">
            <span class="porta__zk">Arquivo</span>
            <span class="porta__zv">${carregando ? 'abrindo…' : 'progresso.db <b>·</b> ' + kb(DB.tamanho())}</span>
          </div>
          <div class="porta__zonaline">
            <span class="porta__zk">Contas neste PC</span>
            <span class="porta__zv">${carregando ? '—' : String(contas.length).padStart(2, '0')}</span>
          </div>
          <div class="porta__zonaline">
            <span class="porta__zk">Estado</span>
            <span class="porta__zv">
              <i class="porta__led ${carregando ? '' : 'on'}"></i>
              ${carregando ? 'carregando o motor' : 'pronto'}
            </span>
          </div>
        </div>
      </div>

      <div class="porta__dir">
        ${carregando ? porteiroCarregando(estado) : porteiroForm(contas, primeiraVez)}
      </div>

    </div>`;

  if (!carregando) ligarForm(contas);
}

function kb(n) {
  if (!n) return '0 KB';
  return n < 1048576 ? Math.round(n / 1024) + ' KB' : (n / 1048576).toFixed(1) + ' MB';
}

function porteiroCarregando(estado) {
  const falhou = estado === 'falhou';
  return `
    <div class="porta__cabeca">
      <span class="porta__idx">§ 00</span>
      <span class="porta__nm">${falhou ? 'Falha ao abrir o banco' : 'Abrindo o banco'}</span>
    </div>
    <div class="porta__espera">
      ${falhou
        ? `<p>O motor do SQLite não carregou. Isso costuma acontecer quando a página é aberta
           com dois cliques direto do arquivo — alguns navegadores bloqueiam WebAssembly em
           <code>file://</code>.</p>
           <p class="porta__dica">Abra uma janela de comando na pasta do projeto e rode
           <code>python -m http.server 8899</code>, depois acesse
           <code>http://127.0.0.1:8899</code>.</p>`
        : `<div class="porta__barra"><i></i></div>
           <p>Carregando o motor relacional e lendo o arquivo de progresso.</p>`}
    </div>`;
}

function porteiroForm(contas, primeiraVez) {
  const criando = modo === 'criar';
  const sugestoes = contas.map(c =>
    `<button type="button" class="porta__conta" data-login="${c.login}">
       <span class="porta__contan">${c.nome}</span>
       <span class="porta__contas">${c.ultimo_acesso ? 'último acesso ' + dataCurta(c.ultimo_acesso) : 'nunca entrou'}</span>
     </button>`).join('');

  return `
    <div class="porta__cabeca">
      <span class="porta__idx">§ ${criando ? '02' : '01'}</span>
      <span class="porta__nm">${criando ? (primeiraVez ? 'Primeiro acesso' : 'Criar outro usuário') : 'Entrar'}</span>
    </div>

    ${(!criando && contas.length) ? `<div class="porta__contas-lista">${sugestoes}</div>` : ''}

    ${(criando && primeiraVez) ? `
      <p class="porta__nota">Ainda não existe nenhum usuário neste computador. Escolha um nome e
      uma senha: eles ficam gravados só aqui, na tabela <code>usuario</code> do arquivo
      <code>progresso.db</code>.</p>` : ''}

    <form class="porta__form" id="portaForm" autocomplete="off">
      <label class="campo">
        <span class="campo__k">Usuário</span>
        <input class="campo__i" type="text" id="fLogin" name="login" spellcheck="false"
               autocapitalize="none" autocomplete="username" placeholder="miguel">
      </label>

      ${criando ? `
      <label class="campo">
        <span class="campo__k">Como quer ser chamado</span>
        <input class="campo__i" type="text" id="fNome" name="nome" placeholder="Miguel">
      </label>` : ''}

      <label class="campo">
        <span class="campo__k">Senha</span>
        <input class="campo__i" type="password" id="fSenha" name="senha"
               autocomplete="${criando ? 'new-password' : 'current-password'}" placeholder="••••••">
      </label>

      ${criando ? `
      <label class="campo">
        <span class="campo__k">Repita a senha</span>
        <input class="campo__i" type="password" id="fSenha2" name="senha2" placeholder="••••••">
      </label>` : ''}

      <label class="marca">
        <input type="checkbox" id="fLembrar" checked>
        <span class="marca__q"></span>
        <span class="marca__t">Continuar conectado neste computador</span>
      </label>

      ${recado ? `<div class="porta__erro">${recado}</div>` : ''}

      <button class="porta__btn" type="submit" id="fEnviar">
        ${criando ? 'Criar usuário e entrar' : 'Entrar'}
        <i>→</i>
      </button>
    </form>

    <button class="porta__troca" id="portaTroca">
      ${criando
        ? (contas.length ? 'Já tenho usuário — entrar' : '')
        : 'Criar outro usuário neste computador'}
    </button>

    <p class="porta__aviso">
      A senha nunca é gravada. O que fica na tabela é o resultado de vinte mil rodadas de
      SHA-256 sobre a senha somada a um <i>salt</i> aleatório. Isso protege o arquivo de quem
      o abrir com um editor — não substitui a senha do Windows.
    </p>`;
}

function dataCurta(iso) {
  const d = new Date(iso);
  if (isNaN(d)) return '—';
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' }) +
         ' às ' + d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
}

/* ---------------------------------------------------------- COMPORTAMENTO */

function ligarForm(contas) {
  const troca = $('#portaTroca');
  if (troca) troca.addEventListener('click', () => {
    modo = (modo === 'criar') ? 'entrar' : 'criar';
    recado = null;
    desenhar('pronto');
    const f = $('#fLogin');
    if (f) f.focus();
  });

  document.querySelectorAll('.porta__conta').forEach(b => {
    b.addEventListener('click', () => {
      $('#fLogin').value = b.dataset.login;
      $('#fSenha').focus();
    });
  });

  $('#portaForm').addEventListener('submit', e => {
    e.preventDefault();
    const btn = $('#fEnviar');
    btn.disabled = true;
    btn.textContent = 'Conferindo…';

    /* A derivacao da senha e proposital e deliberadamente lenta. Um quadro
       de espera antes dela deixa o botao mudar de estado na tela.        */
    setTimeout(() => {
      const login = $('#fLogin').value;
      const senha = $('#fSenha').value;
      const lembrar = $('#fLembrar').checked;
      let r;

      if (modo === 'criar') {
        if (senha !== $('#fSenha2').value) {
          recado = 'As duas senhas não são iguais.';
          desenhar('pronto');
          return;
        }
        r = DB.criarUsuario(login, $('#fNome').value, senha);
      } else {
        r = DB.autenticar(login, senha);
      }

      if (r.erro) {
        recado = r.erro;
        desenhar('pronto');
        const s = $('#fSenha');
        if (s) s.focus();
        return;
      }

      if (lembrar) DB.lembrar(r.usuario.login);
      else DB.esquecer();

      abrir(r.usuario, DB.importarLocalStorage());
    }, 30);
  });

  const foco = $('#fLogin');
  if (foco) {
    if (contas.length === 1 && modo === 'entrar') {
      foco.value = contas[0].login;
      const s = $('#fSenha');
      if (s) s.focus();
    } else {
      foco.focus();
    }
  }
}

/* Solta o aplicativo. A folha de entrada sai de cena com um corte, nao
   com um esmaecimento — o mesmo gesto mecanico do resto do sistema.    */
function abrir(usuario, importados) {
  porta.classList.add('is-saindo');
  armacao.hidden = false;
  setTimeout(() => {
    porta.hidden = true;
    porta.classList.remove('is-saindo');
  }, 320);
  BDApp.iniciar(usuario, importados);
}

/* --------------------------------------------------------------- SAIDA */

window.BDPortaria = {
  sair: function () {
    DB.sair();
    armacao.hidden = true;
    porta.hidden = false;
    modo = 'entrar';
    recado = null;
    desenhar('pronto');
    window.scrollTo(0, 0);
  }
};

/* -------------------------------------------------------------- ARRANQUE */

armacao.hidden = true;
porta.hidden = false;
desenhar('carregando');

DB.boot()
  .then(() => {
    const u = DB.retomarSessao();
    if (u) { abrir(u, DB.importarLocalStorage()); return; }
    desenhar('pronto');
  })
  .catch(err => {
    console.error('Falha ao abrir o banco:', err);
    desenhar('falhou');
  });

})();
