/* =========================================================================
   NUCLEO DE DADOS — modulos, diagramas e fichas de referencia
   ========================================================================= */

const MODULES = [
  { id: 1,  part: 'I',   t: 'Dado, Informação e Conhecimento',        tags: 'Fundamentos' },
  { id: 2,  part: 'I',   t: 'Sistemas e Sistemas de Informação',       tags: 'Fundamentos' },
  { id: 3,  part: 'II',  t: 'Banco de Dados e SGBD',                   tags: 'Objetiva' },
  { id: 4,  part: 'II',  t: 'Tipos de Banco de Dados',                 tags: 'Objetiva' },
  { id: 5,  part: 'II',  t: 'Arquiteturas de Processamento',           tags: 'Objetiva' },
  { id: 6,  part: 'III', t: 'Visão geral da modelagem',                tags: 'Fio condutor' },
  { id: 7,  part: 'III', t: 'Entidades e Atributos',                   tags: 'Fundação' },
  { id: 8,  part: 'III', t: 'Chaves — PK, FK, composta, secundária',   tags: 'Fundação' },
  { id: 9,  part: 'III', t: 'Relacionamentos e Cardinalidade',         tags: 'Cai muito', hot: 1 },
  { id: 10, part: 'III', t: 'Grau e Auto-relacionamento',              tags: 'Pega-ratão', hot: 1 },
  { id: 11, part: 'III', t: 'Entidade Fraca e Associativa',            tags: 'Pega-ratão', hot: 1 },
  { id: 12, part: 'III', t: 'Especialização, Generalização, Agregação',tags: 'Casos especiais' },
  { id: 13, part: 'III', t: 'Integridade Referencial',                 tags: 'Regras' },
  { id: 14, part: 'IV',  t: 'Mapeamento MER → Modelo Relacional',      tags: 'O mais cobrado', hot: 1 },
  { id: 15, part: 'V',   t: 'Aspecto Temporal',                        tags: 'Regra de ouro' },
  { id: 16, part: 'V',   t: 'Normalização — 1FN, 2FN, 3FN',            tags: 'O mais cobrado', hot: 1 },
  { id: 17, part: 'VI',  t: 'Estudos de caso e leitura de DER',        tags: 'Prática', hot: 1 }
];

const PARTS = {
  'I':   'Fundamentos',
  'II':  'O mundo dos bancos de dados',
  'III': 'Modelagem conceitual (MER / DER)',
  'IV':  'Do conceitual ao lógico',
  'V':   'Temas avançados',
  'VI':  'Prática'
};

/* -------------------------------------------------------------------------
   DIAGRAMAS
   src: 'autoral' (feitos para este sistema) | 'guia' | 'aula' (do professor)
   ------------------------------------------------------------------------- */

const DIAGRAMS = [
  /* ---------- autorais ---------- */
  {
    id: 'd-locadora', src: 'autoral', m: 17,
    t: 'Locadora Rota 9 — DER do caso da Oficina',
    svg: 'derLocadora',
    cap: 'O gabarito do caso guiado da <strong>Oficina</strong>. Reúne os quatro casos especiais mais cobrados num enunciado só: multivalorado, especialização, auto-relacionamento e composto.',
    look: [
      { g: '◎', t: 'TELEFONE em elipse dupla no CLIENTE — vira a tabela CLIENTE_FONE.' },
      { g: '△', t: 'Triângulo entre FUNCIONARIO e VENDEDOR — especialização com MATRICULA herdada.' },
      { g: '↺', t: 'O losango SUP sai e volta para FUNCIONARIO — auto-relacionamento de supervisão, grau 1 e cardinalidade 1:N.' },
      { g: '→', t: 'Todos os demais relacionamentos são 1:N, então nenhuma tabela extra nasce deles.' }
    ]
  },
  {
    id: 'd-mapa', src: 'autoral', m: 17,
    t: 'Mapa da matéria — como tudo se conecta',
    svg: 'mapa',
    cap: 'A disciplina inteira em uma página. Os <strong>fundamentos</strong> motivam a existência do banco; a <strong>modelagem conceitual</strong> é o coração; tudo desemboca no <strong>mapeamento</strong> e na <strong>normalização</strong>. Use este mapa para saber o que revisar antes do quê.',
    look: [
      { g: '→', t: 'Chaves (PK/FK) alimentam relacionamentos, mapeamento, integridade e normalização. É o pré-requisito de quase tudo.' },
      { g: '→', t: 'Cardinalidade decide o mapeamento: ela define onde vai a FK e se nasce uma tabela.' },
      { g: '→', t: 'Aspecto temporal entra de lado: ele reescreve o modelo (atributo vira entidade, 1:N vira N:N).' },
      { g: '→', t: 'A prática de diagramas é onde tudo se junta — por isso é o último passo da revisão.' }
    ]
  },
  {
    id: 'd-roteiro', src: 'autoral', m: 17,
    t: 'Roteiro de 7 passos para resolver qualquer MER',
    svg: 'roteiro',
    cap: 'A sequência de perguntas é sempre a mesma, seja o enunciado um texto, uma planilha ou um conjunto de tabelas. Decore o roteiro e você nunca trava na frente de um exercício em branco.',
    look: [
      { g: '1', t: 'Substantivos do enunciado são candidatos a entidade; verbos são candidatos a relacionamento.' },
      { g: '5', t: 'O passo mais esquecido: perguntar se o atributo pertence à entidade ou ao relacionamento.' },
      { g: '6', t: 'A varredura dos casos especiais é o que separa nota 6 de nota 10.' }
    ]
  },
  {
    id: 'd-fk', src: 'autoral', m: 14,
    t: 'Árvore de decisão — onde vai a FK? Nasce tabela?',
    svg: 'arvorefk',
    cap: 'A regra que mais cai na prova, em forma de decisão. Toda vez que olhar um relacionamento no DER, percorra esta árvore: ela responde <strong>se cria tabela</strong> e <strong>de que lado fica a chave</strong>.',
    look: [
      { g: '◇', t: '1:N nunca gera tabela — a chave do lado 1 desce como FK para o lado N, e fica fora da PK.' },
      { g: '◇', t: 'N:N sempre gera tabela: as duas PKs juntas formam a chave, mais os atributos do relacionamento.' },
      { g: '◇', t: '1:1 é o único que exige pensar: a chave vai para o lado de participação total.' },
      { g: '▣', t: 'Entidade fraca é a exceção do 1:N — ali a chave transposta entra na PK.' }
    ]
  },
  {
    id: 'd-fn', src: 'autoral', m: 16,
    t: 'As três perguntas das formas normais',
    svg: 'formasnormais',
    cap: 'Normalizar é responder três perguntas, sempre nesta ordem. Se você souber a pergunta de cada forma normal, resolve qualquer tabela bagunçada — nota fiscal, pedido, controle de estoque.',
    look: [
      { g: '1', t: '1FN pergunta pela repetição: existe grupo que se repete dentro da linha? Separe em outra tabela.' },
      { g: '2', t: '2FN só faz sentido com chave composta. Todo não-chave depende da chave inteira?' },
      { g: '3', t: '3FN pergunta por não-chave que depende de outro não-chave — e manda fora todo campo calculado.' },
      { g: '!', t: 'Nunca pule etapas. A ordem 1 → 2 → 3 faz parte da resposta.' }
    ]
  },
  {
    id: 'd-reverso', src: 'autoral', m: 17,
    t: 'Engenharia reversa — lendo tabelas de volta para o DER',
    svg: 'reverso',
    cap: 'Metade dos exercícios da disciplina dá as tabelas prontas e pede o DER. Este é o dicionário de tradução: cada pista no esquema aponta para uma estrutura do diagrama.',
    look: [
      { g: '▣', t: 'Tabela vira entidade; coluna vira atributo; o identificador vira o atributo sublinhado.' },
      { g: '↺', t: 'FK que aponta para a própria tabela é a assinatura do auto-relacionamento.' },
      { g: '◈', t: 'Tabela intermediária com duas FKs formando a PK é quase sempre um N:N resolvido.' },
      { g: '▤', t: 'Tabela cuja PK começa com a PK de outra é entidade fraca.' }
    ]
  },
  {
    id: 'd-chaves', src: 'autoral', m: 8,
    t: 'Anatomia das chaves em um esquema real',
    svg: 'chaves',
    cap: 'PK, FK e chave composta no mesmo desenho. Repare em <code>NR_PEDIDO</code>: ele é PK dentro de <code>PEDIDO</code> e, ao mesmo tempo, PK e FK dentro de <code>ITENS_PEDIDO</code> — é assim que um atributo acumula dois papéis.',
    look: [
      { g: 'PK', t: 'Responde "quem sou eu?". Único, exclusivo e imutável.' },
      { g: 'FK', t: 'Responde "quem eu referencio?". Aponta para a PK de outra tabela.' },
      { g: '++', t: 'Chave composta: nenhum atributo sozinho identifica a linha — só a combinação.' }
    ]
  },

  /* ---------- figuras do guia ---------- */
  {
    id: 'g-pipeline', src: 'guia', m: 6,
    t: 'As 4 etapas da modelagem',
    img: 'conceito-pipeline-modelagem.png',
    cap: 'Do enunciado até o banco rodando: <strong>MER → DER → Modelo Relacional → Modelo Físico</strong>. É o fio condutor da disciplina inteira.',
    look: [
      { g: '→', t: 'MER é conceitual e universal — não depende de SGBD nenhum.' },
      { g: '→', t: 'DER é só o desenho do MER, com os símbolos padrão.' },
      { g: '→', t: 'No relacional os losangos somem: viram FK ou tabelas.' },
      { g: '→', t: 'O físico é o único que fala de VARCHAR, índice e CREATE TABLE.' }
    ]
  },
  {
    id: 'g-simbolos', src: 'guia', m: 6,
    t: 'Legenda dos símbolos do DER',
    img: 'conceito-simbolos-der.png',
    cap: 'A tabela que você precisa saber de cor. Todo DER da disciplina usa só estes símbolos.',
    look: [
      { g: '▭', t: 'Retângulo = entidade. Retângulo duplo = entidade fraca.' },
      { g: '◇', t: 'Losango = relacionamento (sempre um verbo).' },
      { g: '◯', t: 'Elipse = atributo. Sublinhada = chave. Dupla = multivalorado.' },
      { g: '△', t: 'Triângulo = especialização / generalização.' }
    ]
  },
  {
    id: 'g-cardinalidades', src: 'guia', m: 9,
    t: 'As três cardinalidades',
    img: 'conceito-cardinalidades.png',
    cap: '1:1, 1:N e N:N com um exemplo de cada. A cardinalidade é o que decide como o relacionamento vira tabela — errar aqui quebra o modelo relacional inteiro.',
    look: [
      { g: '1:1', t: 'Desconfie: será que não deveriam ser uma entidade só? E amanhã não vira 1:N?' },
      { g: '1:N', t: 'O caso mais comum. O lado 1 tem os dados básicos; a FK desce para o lado N.' },
      { g: 'N:N', t: 'Não se implementa direto no relacional — vira dois 1:N com uma associativa no meio.' }
    ]
  },
  {
    id: 'g-especiais', src: 'guia', m: 12,
    t: 'Os quatro casos especiais',
    img: 'conceito-casos-especiais.png',
    cap: 'Entidade fraca, auto-relacionamento, especialização e atributo multivalorado — exatamente o que a correção procura em um DER.',
    look: [
      { g: '▤', t: 'Entidade fraca: PK composta que inclui a chave da entidade forte.' },
      { g: '↺', t: 'Auto-relacionamento: uma entidade só, com rótulos de papel nas pontas.' },
      { g: '△', t: 'Especialização: relação "é-um", com herança da chave.' },
      { g: '◎', t: 'Multivalorado: elipse dupla no DER, tabela nova no relacional.' }
    ]
  },
  {
    id: 'g-mapeamento', src: 'guia', m: 14,
    t: 'Mapeamento de 1:N e N:N para tabelas',
    img: 'conceito-mapeamento.png',
    cap: 'A regra que mais cai: no <strong>1:N</strong> a FK desce para o lado N e não gera tabela; no <strong>N:N</strong> nasce uma tabela associativa com as duas chaves.',
    look: [
      { g: '→', t: 'No 1:N a chave transposta é só FK — ela fica fora da PK do lado N.' },
      { g: '→', t: 'No N:N as duas PKs juntas formam a chave da associativa.' },
      { g: '→', t: 'Atributos do relacionamento (horas, nota, preço) moram na associativa.' }
    ]
  },
  {
    id: 'g-temporal', src: 'guia', m: 15,
    t: 'Aspecto temporal — as duas transformações',
    img: 'conceito-aspecto-temporal.png',
    cap: 'Guardar histórico reescreve o modelo: um <strong>atributo</strong> com histórico vira <strong>entidade</strong>; um <strong>relacionamento</strong> com histórico vira <strong>N:N com DATA</strong>.',
    look: [
      { g: '→', t: 'Regra de ouro: ATUAL = como está agora. TEMPORAL = agora + como esteve.' },
      { g: '→', t: 'A DATA vira identificadora quando o mesmo par pode se relacionar mais de uma vez.' },
      { g: '→', t: 'Histórico faz o banco crescer: planeje arquivamento ou guarde só estatísticas.' }
    ]
  },
  {
    id: 'g-formasnormais', src: 'guia', m: 16,
    t: 'Normalização passo a passo — Pedido de Compra',
    img: 'conceito-formas-normais.png',
    cap: 'Da tabela única até a 3FN, com o que ainda está errado em cada etapa em destaque. A cada forma normal, um assunto novo ganha sua própria tabela.',
    look: [
      { g: '1', t: '1FN tira o grupo de repetição: os itens saem para ITENS_PEDIDO.' },
      { g: '2', t: '2FN olha a chave NR_PEDIDO + ITEM: MATERIAL não depende dos dois, então sai.' },
      { g: '3', t: '3FN separa DEPTO e FUNC (não-chave → não-chave) e apaga QTD_TOTAL, que é calculado.' }
    ]
  },

  /* ---------- diagramas do professor ---------- */
  {
    id: 'a-caso1', src: 'aula', m: 17,
    t: 'Caso 1 — Casamento (versão 1:1)',
    img: 'caso1-casamento-der.png',
    cap: 'Engenharia reversa de 4 tabelas: <code>Pessoa</code>, <code>Local</code>, <code>Profissão</code>, <code>Casamento</code>. PESSOA se liga a CASAMENTO por <strong>dois losangos</strong> — MARIDO e ESPOSA — porque participa em dois papéis diferentes.',
    look: [
      { g: '↺', t: 'Dois papéis da mesma entidade: é um auto-relacionamento via CASAMENTO.' },
      { g: '◯', t: 'CASAM_ID, PESS_ID, LOC_ID e PROF_ID aparecem sublinhados — são as PKs.' },
      { g: '→', t: 'As FKs NascLocID, FalecLocID e ProfID dentro de PESSOA representam os relacionamentos com LOCAL e PROFISSÃO.' },
      { g: '!', t: 'Aqui as cardinalidades saíram 1:1. Compare com a versão seguinte.' }
    ]
  },
  {
    id: 'a-caso1b', src: 'aula', m: 17,
    t: 'Caso 1 — Casamento (versão N:1)',
    img: 'caso1-casamento-der-variacao.png',
    cap: 'O <strong>mesmo exercício</strong>, resolvido por outra turma com cardinalidades N:1. Comparar as duas versões é o ponto mais importante deste caso.',
    look: [
      { g: '!', t: 'As duas estão certas dentro das hipóteses adotadas — o enunciado manda adicionar hipóteses.' },
      { g: '★', t: 'A leitura mais defensável é N:1: um mesmo local é nascimento de várias pessoas.' },
      { g: '★', t: 'Se cair na prova, escreva a hipótese embaixo do desenho. Isso é o que salva a questão.' }
    ]
  },
  {
    id: 'a-caso2', src: 'aula', m: 17,
    t: 'Caso 2 — Empregado / Projeto',
    img: 'caso2-empregado-projeto-der.png',
    cap: 'Engenharia reversa de 6 tabelas. É o diagrama que reúne os três casos especiais mais cobrados de uma vez só.',
    look: [
      { g: '▤', t: 'DEPENDENTE em retângulo duplo — entidade fraca, depende de EMPREGADO.' },
      { g: '↺', t: 'SUPERIDENT é um losango que volta ao próprio EMPREGADO — auto-relacionamento 1:N.' },
      { g: '◈', t: 'TRABALHANO é N:N e carrega HORAS: atributo do relacionamento, não das entidades.' },
      { g: '1:1', t: 'GERENCIAR (Empregado ↔ Departamento) é 1:1 — vem do IdentGer.' }
    ]
  },
  {
    id: 'a-caso2b', src: 'aula', m: 17,
    t: 'Caso 2 — Empregado / Projeto (outra turma)',
    img: 'caso2-empregado-projeto-der-variacao.png',
    cap: 'Mesma modelagem com outros nomes de losango: <code>TEM</code> no lugar de <code>POSSUIR</code>, <code>TRABALHA</code> no lugar de <code>TRABALHAR</code>. A lição é sobre o que muda e o que não muda.',
    look: [
      { g: '★', t: 'O nome do losango é escolha de quem modela — a correção não cobra o nome.' },
      { g: '★', t: 'O que não pode mudar: cardinalidades, entidade fraca, auto-relacionamento e o N:N com atributo.' }
    ]
  },
  {
    id: 'a-caso3', src: 'aula', m: 17,
    t: 'Caso 3 — Engenho ABC',
    img: 'caso3-engenho-abc-der.png',
    cap: 'MER a partir de um enunciado em texto. Traz especialização, atributo multivalorado e atributos pendurados no losango — três coisas no mesmo desenho.',
    look: [
      { g: '△', t: 'Triângulo entre FUNCIONARIO e ENGENHEIRO: especialização com herança de CPF.' },
      { g: '◎', t: 'FONE em elipse dupla no CLIENTE: multivalorado, vira CLIENTE_FONE no relacional.' },
      { g: '◇', t: 'DATA e NR_DIAS penduram no losango CONTRATO — pertencem ao relacionamento.' },
      { g: '!', t: 'O professor tratou GERENCIAR como N:1 (Engenheiro 1 — N Projeto). Siga a resolução dele.' }
    ]
  },
  {
    id: 'a-caso3b', src: 'aula', m: 17,
    t: 'Caso 3 — Engenho ABC (outra turma)',
    img: 'caso3-engenho-abc-der-variacao.png',
    cap: 'Aqui <code>GERENCIA</code> recebeu <code>DATA_CONTRATACAO</code> e <code>QTDE_DIAS</code>. A estrutura — especialização, multivalorado, cardinalidades — é idêntica à versão anterior.',
    look: [
      { g: '★', t: 'Compare os atributos dos losangos entre as duas versões: é a única diferença real.' },
      { g: '⚠', t: 'Atenção ao nome do arquivo original: na Aula 04, o arquivo "DER CASAMENTO - CCO 1-2" contém o diagrama do Engenho ABC, não o do Casamento.' }
    ]
  },
  {
    id: 'a-caso4', src: 'aula', m: 17,
    t: 'Caso 4 — Planilha de Pedidos',
    img: 'caso4-pedidos-der.png',
    cap: 'DER gerado a partir de uma planilha. É o caso que amarra <strong>modelagem</strong> com <strong>normalização</strong>: os campos calculados ficaram no diagrama e sairiam na 3FN.',
    look: [
      { g: '→', t: 'CLIENTE 1 — FAZER — N PEDIDO 1 — POSSUI — N ITENS_PEDIDO.' },
      { g: '★', t: 'Macete: se a chave de uma tabela aparece em outra, virou FK e criou um relacionamento.' },
      { g: '3FN', t: 'SUB_TOTAL (= QTD × VL_PROD) e TOTAL_PED são calculados — candidatos a sumir na normalização.' }
    ]
  },
  {
    id: 'a-caso5', src: 'aula', m: 17,
    t: 'Caso 5 — Atendimento técnico',
    img: 'caso5-atendimento-tecnico-der.png',
    cap: 'O diagrama mais completo da disciplina, feito a partir de uma ficha de manutenção técnica. Vale como <strong>revisão geral</strong>: quase todos os conceitos aparecem de uma vez.',
    look: [
      { g: '▣', t: 'Entidades: FUNCIONARIO, EMPRESA, SERVICO, ATENDIMENTO, CLIENTE, SOLUCAO, FUNCIONARIO_CLI, SITUACAO_SERV.' },
      { g: '◈', t: 'Dois N:N no mesmo diagrama: SERV_PRESTADO e SOL_PRESTADA, ambos saindo de ATENDIMENTO.' },
      { g: '◎', t: 'TELEFONE* no CLIENTE é multivalorado.' },
      { g: '★', t: 'Melhor exercício-síntese: refaça o MER do zero a partir do formulário e compare com esta imagem.' }
    ]
  }
];

/* -------------------------------------------------------------------------
   FICHAS DE REFERENCIA
   ------------------------------------------------------------------------- */

const REFERENCE = [
  {
    id: 'r-simbolos', t: 'Símbolos do DER',
    html: `
      <div class="tblwrap"><table class="tbl">
        <tr><th>Símbolo</th><th>Significado</th></tr>
        <tr><td>Retângulo</td><td>Entidade</td></tr>
        <tr><td>Retângulo duplo</td><td>Entidade fraca</td></tr>
        <tr><td>Losango</td><td>Relacionamento (sempre um verbo)</td></tr>
        <tr><td>Elipse</td><td>Atributo</td></tr>
        <tr><td>Elipse sublinhada</td><td>Atributo-chave (PK)</td></tr>
        <tr><td>Elipse dupla</td><td>Atributo multivalorado</td></tr>
        <tr><td>Triângulo</td><td>Especialização / generalização</td></tr>
        <tr><td><code>1</code>, <code>N</code></td><td>Cardinalidades</td></tr>
        <tr><td>Linha</td><td>Associação entre elementos</td></tr>
      </table></div>
      <div class="callout"><b class="tag">Macete</b>
        No enunciado, <strong>substantivo</strong> costuma ser entidade e <strong>verbo</strong> costuma ser relacionamento. É a primeira varredura que você faz em qualquer exercício.
      </div>`
  },
  {
    id: 'r-mapeamento', t: 'Regras de mapeamento MER → Relacional',
    html: `
      <div class="tblwrap"><table class="tbl">
        <tr><th>No MER</th><th>No Modelo Relacional</th></tr>
        <tr><td>Entidade</td><td>Tabela</td></tr>
        <tr><td>Atributo</td><td>Coluna</td></tr>
        <tr><td>Identificador</td><td>PK</td></tr>
        <tr><td>Relacionamento 1:N</td><td>FK no lado <strong>N</strong> — não gera tabela</td></tr>
        <tr><td>Relacionamento N:N</td><td><strong>Nova tabela</strong> com as duas PKs + atributos do relacionamento</td></tr>
        <tr><td>Relacionamento 1:1</td><td>FK no lado com <strong>participação total</strong></td></tr>
        <tr><td>Atributo multivalorado</td><td><strong>Nova tabela</strong> + PK da entidade</td></tr>
        <tr><td>Entidade fraca</td><td>Tabela com a <strong>PK da forte compondo a PK</strong></td></tr>
        <tr><td>Especialização</td><td>Tabela do geral + uma tabela por especialização</td></tr>
        <tr><td>Agregação</td><td>Segue as regras normais de entidade/relacionamento</td></tr>
      </table></div>
      <h4>Especialização — as duas formas</h4>
      <p><strong>Forma 1</strong> (sempre válida): uma tabela para o nível mais alto com os atributos comuns, mais uma tabela por especialização com os atributos próprios e a PK do nível alto.</p>
      <div class="pre">Contas(numero, saldo)
Contas_corrente(numero, limite)
Contas_poupanca(numero, data_base)</div>
      <p><strong>Forma 2</strong> (só se for <strong>mutuamente exclusiva e total</strong>): tabelas apenas para os níveis mais baixos, já com os atributos herdados.</p>
      <div class="pre">Contas_corrente(numero, saldo, limite)
Contas_poupanca(numero, saldo, data_base)</div>
      <div class="callout"><b class="tag">A pegadinha</b>
        No 1:N comum, a chave transposta é <strong>só FK</strong> e fica fora da PK. Na entidade fraca, a chave transposta <strong>entra na PK</strong>. Mesma operação, consequências diferentes.
      </div>`
  },
  {
    id: 'r-fn', t: 'Formas Normais — o roteiro completo',
    html: `
      <div class="pre">1FN → REPETIÇÃO           tirar grupos de repetição
2FN → CHAVE COMPOSTA      depender da chave inteira
3FN → NÃO-CHAVE → NÃO-CHAVE  e fora com os calculados</div>
      <h4>A frase que mais vale</h4>
      <p><strong>1FN tira repetição. 2FN olha a chave composta. 3FN olha dependência entre atributos que não são chave.</strong></p>
      <h4>Exemplo do professor — Pedido de Compra</h4>
      <p>Tabela inicial, tudo misturado:</p>
      <div class="pre">PEDIDOCOMPRA(NR_PEDIDO, DATA, DEPTO_ORIGEM, DEPTO_DESTINO,
             FUNC_SOL, FUNC_RESP, ITEM, MATERIAL, QUANTIDADE, QTD_TOTAL)</div>
      <p><strong>1FN</strong> — tirar o grupo de repetição (os itens):</p>
      <div class="pre">PEDIDO(NR_PEDIDO, DATA, DEPTO_ORIGEM, DEPTO_DESTINO, FUNC_SOL, FUNC_RESP, QTD_TOTAL)
ITENS_PEDIDO(NR_PEDIDO, ITEM, MATERIAL, QUANTIDADE)</div>
      <p><strong>2FN</strong> — chave composta <code>NR_PEDIDO + ITEM</code>. <code>QUANTIDADE</code> depende dos dois e fica. <code>MATERIAL</code> não depende da chave inteira e sai:</p>
      <div class="pre">PEDIDO(NR_PEDIDO, DATA, DEPTO_ORIGEM, DEPTO_DESTINO, FUNC_SOL, FUNC_RESP, QTD_TOTAL)
ITENS_PEDIDO(NR_PEDIDO, ITEM, COD_MATERIAL, QUANTIDADE)
MATERIAL(COD_MATERIAL, MATERIAL)</div>
      <p><strong>3FN</strong> — DEPTO e FUNC são assuntos próprios; <code>QTD_TOTAL</code> é calculável e sai:</p>
      <div class="pre">PEDIDO(NR_PEDIDO pk, DATA, COD_DEPTO_ORIGEM fk, COD_DEPTO_DESTINO fk,
       COD_FUNC_SOL fk, COD_FUNC_RESP fk)
ITENS_PEDIDO(NR_PEDIDO pk/fk, ITEM pk, COD_MATERIAL fk, QUANTIDADE)
MATERIAL(COD_MATERIAL pk, MATERIAL)
DEPARTAMENTO(COD_DEPTO pk, DESCRICAO)
FUNCIONARIO(COD_FUNC pk, NOME)</div>
      <div class="callout"><b class="tag">Erros clássicos</b>
        Achar que a 1FN elimina toda redundância (ela só trata <strong>grupos de repetição</strong>) · aplicar 2FN em tabela sem chave composta · manter um total calculado · pular a ordem 1 → 2 → 3.
      </div>`
  },
  {
    id: 'r-temporal', t: 'Aspecto temporal — tabela de transformações',
    html: `
      <div class="callout"><b class="tag">Regra de ouro</b>
        <strong>ATUAL</strong> representa como está agora. <strong>TEMPORAL</strong> representa como está agora <em>e</em> como esteve no passado.
      </div>
      <div class="tblwrap"><table class="tbl">
        <tr><th>Situação</th><th>Modelagem</th></tr>
        <tr><td>Só o valor atual de um atributo</td><td>Atributo normal</td></tr>
        <tr><td>Histórico de um atributo</td><td>Vira uma <strong>nova entidade</strong> (com DATA)</td></tr>
        <tr><td>Histórico de relacionamento 1:1</td><td>Vira <strong>N:N</strong></td></tr>
        <tr><td>Histórico de relacionamento 1:N</td><td>Vira <strong>N:N</strong></td></tr>
        <tr><td>Relacionamento pode ocorrer várias vezes</td><td><strong>DATA</strong> diferencia as ocorrências e vira identificadora</td></tr>
        <tr><td>Dados antigos não precisam ficar no BD</td><td>Planejar <strong>arquivamento</strong></td></tr>
        <tr><td>Só interessam resultados antigos</td><td>Guardar <strong>estatísticas</strong> compiladas</td></tr>
      </table></div>
      <h4>Por que a DATA vira identificadora</h4>
      <p>Se João foi alocado à Mesa 10 duas vezes — em 01/02/2023 e em 10/05/2025 — o par "João + Mesa 10" não distingue as duas ocorrências. A DATA entra no relacionamento justamente para diferenciá-las.</p>
      <div class="pre">CREATE TABLE historico_salario (
    cod_emp INTEGER REFERENCES empregado,
    data    DATE,
    valor   NUMERIC(10,2),
    PRIMARY KEY (cod_emp, data)
);</div>`
  },
  {
    id: 'r-reverso', t: 'Engenharia reversa — lendo tabelas',
    html: `
      <div class="tblwrap"><table class="tbl">
        <tr><th>No esquema</th><th>No DER</th></tr>
        <tr><td>Tabela</td><td>Entidade</td></tr>
        <tr><td>Coluna</td><td>Atributo</td></tr>
        <tr><td>FK</td><td>Possível relacionamento</td></tr>
        <tr><td>Tabela intermediária (duas FKs na PK)</td><td>Geralmente um <strong>N:N</strong> resolvido</td></tr>
        <tr><td>Tabela cuja PK começa com a PK de outra</td><td>Possível <strong>entidade fraca</strong></td></tr>
        <tr><td>FK apontando para a própria tabela</td><td>Possível <strong>auto-relacionamento</strong></td></tr>
        <tr><td>Coluna repetida em várias linhas do mesmo pai</td><td>Possível <strong>multivalorado</strong></td></tr>
      </table></div>
      <h4>Roteiro de 7 passos</h4>
      <ul>
        <li>Ler o enunciado e marcar os <strong>substantivos</strong>.</li>
        <li>Levantar os <strong>atributos</strong> de cada entidade.</li>
        <li>Identificar os <strong>relacionamentos</strong> (verbos).</li>
        <li>Definir a <strong>cardinalidade</strong> de cada um.</li>
        <li>Verificar se algum atributo pertence ao <strong>relacionamento</strong>.</li>
        <li>Procurar os <strong>casos especiais</strong>: auto-relacionamento, fraca, multivalorado, especialização, agregação, N:N.</li>
        <li>Aplicar as regras de <strong>mapeamento</strong>.</li>
      </ul>`
  },
  {
    id: 'r-arquiteturas', t: 'Arquiteturas de processamento',
    html: `
      <div class="tblwrap"><table class="tbl">
        <tr><th>Arquitetura</th><th>Onde fica o quê</th><th>Problema / ganho</th></tr>
        <tr><td>Centralizado</td><td>Uma máquina faz tudo (mainframe)</td><td>Custo altíssimo de hardware</td></tr>
        <tr><td>Cliente/Servidor (2 camadas)</td><td>Cliente: apresentação + regra de negócio · Servidor: banco</td><td>Atualizar o aplicativo em cada estação</td></tr>
        <tr><td>3 camadas</td><td>Apresentação no cliente · Regra no servidor de aplicação · Dados no banco</td><td>Atualiza-se em um ponto só</td></tr>
        <tr><td>4 camadas</td><td>Browser · Servidor web · Regra · Banco</td><td>Nada é instalado máquina a máquina</td></tr>
        <tr><td>Distribuído</td><td>Uma tarefa se estende por várias máquinas em rede</td><td>Exige software de gerência de rede</td></tr>
      </table></div>
      <div class="callout"><b class="tag">O que a prova cobra</b>
        O <strong>problema</strong> de cada uma. Centralizado = custo de hardware. 2 camadas = atualizar o cliente em cada estação. E lembre: em 3+ camadas é preciso cuidar de <strong>desempenho e dimensionamento</strong> dos servidores.
      </div>`
  },
  {
    id: 'r-sgbd', t: 'SGBD — características e utilitários',
    html: `
      <h4>As 6 características</h4>
      <ul>
        <li><strong>Controle de redundância</strong> — minimizar repetição para dar estabilidade ao modelo.</li>
        <li><strong>Compartilhamento de dados</strong> — vários usuários de forma simultânea e segura.</li>
        <li><strong>Controle de acesso</strong> — quem pode fazer o quê.</li>
        <li><strong>Esquematização</strong> — os relacionamentos ficam guardados no próprio banco.</li>
        <li><strong>Backup</strong> — rotinas específicas de cópia.</li>
        <li><strong>Segurança</strong> — o fator que mais diferencia um banco de outro.</li>
      </ul>
      <h4>Os 4 utilitários do DBA</h4>
      <ul>
        <li><strong>Rotinas de carga</strong> — criam a versão inicial do banco a partir de arquivos.</li>
        <li><strong>Descarregamento / recarregamento</strong> — backup e restauração.</li>
        <li><strong>Reorganização</strong> — rearranja os dados, em geral por desempenho.</li>
        <li><strong>Rotinas estatísticas</strong> — tamanho de arquivos, distribuição de valores, desempenho.</li>
      </ul>
      <div class="callout"><b class="tag">Diferença que cai</b>
        O <strong>banco</strong> é o conjunto de dados. O <strong>SGBD</strong> é o software que gerencia esse conjunto. MySQL e Oracle são SGBDs, não bancos de dados.
      </div>`
  },
  {
    id: 'r-ordem', t: 'Ordem de revisão antes da prova',
    html: `
      <ul>
        <li>Fundamentos rápidos — dado/informação e SI. Leitura leve.</li>
        <li>SGBD, tipos de BD e arquiteturas — listas e diferenças, cai em objetiva.</li>
        <li>Entidades, atributos e chaves — a fundação, precisa estar sólida.</li>
        <li>Relacionamentos, cardinalidade, grau e auto-relacionamento.</li>
        <li>Entidade fraca, associativa, especialização e integridade referencial.</li>
        <li>Mapeamento MER → Relacional, até as regras virarem automáticas.</li>
        <li>Refazer os 5 estudos de caso sem olhar a resolução, e só depois comparar.</li>
        <li>Aspecto temporal — a regra de ouro e a tabela de transformações.</li>
        <li>Normalização — refazer Pedido de Compra, depois Nota Fiscal e Controle de Estoque.</li>
        <li>Simulado final: um enunciado novo, do zero, MER → DER → Relacional.</li>
      </ul>
      <div class="callout"><b class="tag">Onde treinar mais</b>
        Mapeamento MER → Relacional · Normalização 1FN/2FN/3FN · os 5 diagramas completos. E cuidado com os dois pares que confundem: <strong>cardinalidade × grau</strong> e <strong>entidade fraca × associativa</strong>.
      </div>`
  }
];
