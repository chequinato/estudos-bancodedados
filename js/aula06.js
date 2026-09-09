/* =========================================================================
   AULA 06 — os três estudos de caso do professor

   EC1  Distribuidora de filmes (Cinema)  — feito em sala em 09/09
   EC2  Gerência Acadêmica (UNITESTE)     — ainda não feito
   EC3  Grupo de Pesquisa sobre Vírus     — ainda não feito

   Os três saem do mesmo livro (Machado & Abreu, "Projeto de Banco de
   Dados — uma visão prática") e cada um carrega uma armadilha diferente:

     Cinema        — o mesmo enunciado admite mais de um modelo correto
     Universidade  — regras de negócio que o modelo não consegue guardar
     Vírus         — auto-relacionamento N:N, o mais difícil de enxergar

   O caso do cinema termina com 1FN, 2FN e 3FN, que ficaram de fora da
   aula. Os outros dois entram inteiros.
   ========================================================================= */

OFICINA.push(

/* ═══════════════════════════════════════════ CASO 9 — CINEMA (EC1) ══ */
{
  id: 'of-cinema',
  n: 9,
  t: 'Distribuidora de filmes',
  nivel: 'Aula 06 · EC1 — feito em sala',
  tags: 'MER · DER · MR · 1FN · 2FN · 3FN',
  intro: 'O exercício da aula de ontem, do começo ao fim — incluindo as formas normais, que ficaram para depois. É o caso mais interessante da matéria por um motivo específico: o professor e o autor do livro chegaram a modelos diferentes, os dois defensáveis. No passo 6 você compara os dois e descobre onde está a escolha.',
  enunciado: `
    <p>Uma <strong>empresa de distribuição de filmes</strong> quer controlar seus cinemas e a
    exibição dos filmes. Das reuniões com os usuários saíram estas regras:</p>
    <ul>
      <li>A distribuidora possui <strong>vários cinemas</strong> em diversas localidades.</li>
      <li>Cada cinema tem identificação única, nome fantasia, <strong>endereço completo</strong>
      (rua, avenida, bairro, município, estado) e capacidade de lotação.</li>
      <li>Os filmes podem ser <strong>dos mais variados tipos e gêneros</strong>.</li>
      <li>Cada filme é registrado com título original e, <strong>se for estrangeiro</strong>, também
      o título em português; além de gênero, duração, impropriedade, país de origem, informações
      sobre os atores do elenco e o seu diretor. <strong>Existe um único diretor para cada
      filme.</strong></li>
      <li>Alguns cinemas apresentam <strong>mais de um filme em cartaz</strong>, em sessões
      alternadas entre um filme e outro.</li>
      <li>As sessões têm horário que varia conforme a duração do filme, com cerca de 15 minutos de
      intervalo entre elas.</li>
      <li>Os atores de um filme podem atuar em diversos filmes, e <strong>o diretor de um filme
      pode também ser ator</strong> nesse ou em outro filme. Um ator tem número de identificação,
      nome, nacionalidade e idade.</li>
      <li>As sessões devem ter o <strong>público registrado diariamente</strong>, para permitir a
      totalização dos telespectadores quando o filme sair de cartaz ou a qualquer instante.</li>
    </ul>
    <p><b>Consultas que o sistema precisa responder:</b> apuração de público por município, por
    cinema e por sessão; dado um ator, quais cinemas exibem filmes em que ele atua; em quais
    cinemas está sendo exibido determinado gênero; em quais cinemas há filmes nacionais.</p>`,
  steps: [
    {
      k: 'pick',
      t: 'Passo 1 — Entidades',
      q: 'Marque o que deve virar <strong>entidade</strong>. Duas armadilhas moram aqui: uma coisa que parece atributo e é entidade, e outra que parece entidade e é atributo.',
      items: [
        { t: 'CINEMA', ok: 1, why: 'Identificação própria, atributos próprios, várias ocorrências. Entidade fundamental.' },
        { t: 'FILME',  ok: 1, why: 'Entidade fundamental do enunciado inteiro.' },
        { t: 'ATOR',   ok: 1, why: 'Tem identificador, nome, nacionalidade e idade. Entidade fundamental.' },
        { t: 'SESSÃO', ok: 1, why: 'É a exibição de um filme num cinema em determinado horário. Tem atributo próprio (horário) e é onde o público é registrado. Repare que ela só existe se existirem o cinema e o filme — foi o desenho de entidade fraca que o professor usou em sala.' },
        { t: 'DIRETOR', ok: 1, why: 'É entidade, mas com uma ressalva que o enunciado planta de propósito: "o diretor de um filme pode também ser ator". Ou seja, diretor é um ATOR que dirige — uma especialização, não uma entidade solta com nomes repetidos.' },
        { t: 'ENDEREÇO', ok: 0, why: 'Atributo composto de CINEMA: rua, avenida, bairro, município, estado. No relacional ele se achata em colunas.' },
        { t: 'GÊNERO',  ok: 0, why: 'Atributo multivalorado de FILME — "os mais variados tipos e gêneros". Elipse dupla no DER, tabela própria só no mapeamento.' },
        { t: 'HORÁRIO', ok: 0, why: 'Atributo de SESSÃO.' },
        { t: 'PÚBLICO', ok: 0, why: 'É o número de telespectadores registrado na sessão do dia. Atributo, não entidade.' },
        { t: 'MUNICÍPIO', ok: 0, why: 'Parte do endereço composto. Vira coluna, apesar de o enunciado pedir "apuração de público por município" — a consulta agrupa por essa coluna, não exige uma tabela.' }
      ]
    },
    {
      k: 'assign',
      t: 'Passo 2 — Atributos',
      q: 'Classifique cada atributo. O gênero e o título em português são os dois que decidem o modelo inteiro.',
      opts: ['Simples', 'Composto', 'Multivalorado', 'Identificador', 'Só na especialização'],
      rows: [
        { t: 'CINEMA · id_cinema',          a: 3, why: 'Identificação única, dita pelo enunciado. Vira PK.' },
        { t: 'CINEMA · endereço',           a: 1, why: 'Composto: rua, avenida, bairro, município, estado. Uma elipse com elipses penduradas.' },
        { t: 'CINEMA · capacidade_lotação', a: 0, why: 'Um número só. Atributo simples.' },
        { t: 'FILME · gênero',              a: 2, why: 'Multivalorado — "os mais variados tipos e gêneros". Um filme pode ser comédia e romance ao mesmo tempo. Elipse dupla.' },
        { t: 'FILME · título_original',     a: 3, why: 'É o identificador natural do filme. O professor preferiu criar um id_filme artificial; o autor do livro usou o próprio título como PK. As duas escolhas aparecem nos gabaritos.' },
        { t: 'FILME · título_português',    a: 4, why: 'Só existe "se for filme estrangeiro". Atributo que não vale para todas as ocorrências é o sinal clássico de especialização: nasce a entidade ESTRANGEIRO.' },
        { t: 'FILME · duração',             a: 0, why: 'Simples. É ela que faz o horário da sessão variar, mas isso é regra de negócio, não estrutura.' },
        { t: 'ATOR · idade',                a: 0, why: 'Simples — e, a rigor, um dado que envelhece sozinho. Guardar data de nascimento seria melhor, mas o enunciado pediu idade.' },
        { t: 'SESSÃO · público',            a: 0, why: 'Simples, e registrado "diariamente": o mesmo horário em dias diferentes tem públicos diferentes. Guarde essa observação para o passo 7.' }
      ]
    },
    {
      k: 'assign',
      t: 'Passo 3 — Relacionamentos e cardinalidade',
      q: 'Aqui está o coração do exercício. Três destes cinco você acerta de olhos fechados; os outros dois são exatamente onde o professor e o autor discordaram.',
      opts: ['1 : 1', '1 : N', 'N : N'],
      rows: [
        { t: 'DIRETOR — dirige — FILME', a: 1, why: 'O enunciado é explícito: "existirá um único diretor para cada filme". Um diretor dirige vários filmes, cada filme tem um diretor. A FK id_diretor desce para FILME.' },
        { t: 'ATOR — atua em — FILME',   a: 2, why: 'Um filme tem vários atores, um ator faz vários filmes. N:N clássico — nasce a tabela ELENCO, com PK composta pelas duas chaves.' },
        { t: 'CINEMA — exibe — FILME',   a: 2, why: 'O mesmo cinema exibe vários filmes ("mais de um filme em cartaz") e o mesmo filme passa em vários cinemas. É N:N — e é a sessão que materializa esse cruzamento.' },
        { t: 'CINEMA — tem — SESSÃO',    a: 1, why: 'Um cinema tem muitas sessões; cada sessão pertence a um cinema. Este é o desenho que o professor usou em sala: quebrar o N:N em duas pernas 1:N, com SESSÃO no meio.' },
        { t: 'SESSÃO — exibe — FILME',   a: 1, why: 'A outra perna: cada sessão passa um filme, e o mesmo filme é passado em muitas sessões. Junte as duas pernas e você tem o N:N do item anterior — são o mesmo fato, desenhado de dois jeitos.' }
      ]
    },
    {
      k: 'pick',
      t: 'Passo 4 — Casos especiais',
      q: 'A varredura. Quais destas estruturas o enunciado esconde?',
      items: [
        { t: 'Atributo multivalorado', ok: 1, why: 'O gênero do filme. No DER do professor ele aparece em elipse dupla; no do autor, marcado com asterisco.' },
        { t: 'Atributo composto',      ok: 1, why: 'O endereço completo do cinema.' },
        { t: 'Especialização',         ok: 1, why: 'Duas: ESTRANGEIRO como especialização de FILME (só ele tem título em português) e DIRETOR como especialização de ATOR.' },
        { t: 'Relacionamento N:N',     ok: 1, why: 'ATOR–FILME e CINEMA–FILME. Cada um vai gerar tabela no mapeamento.' },
        { t: 'Aspecto temporal',       ok: 1, why: 'O mais fácil de perder. "O público deve ser registrado diariamente": sem a DATA na chave, a sessão das 20h guardaria um número só e o histórico se perderia. É a data que transforma um registro em série.' },
        { t: 'Entidade fraca',         ok: 1, why: 'SESSÃO, no desenho da sala — retângulo duplo. Ela não tem identificador próprio: só é identificada pela combinação de cinema, filme, data e horário.' },
        { t: 'Auto-relacionamento',    ok: 0, why: 'Não há. A tentação é achar que "diretor pode ser ator" cria um losango de ATOR para ATOR, mas isso é especialização, não relacionamento da entidade consigo mesma.' },
        { t: 'Agregação',              ok: 0, why: 'Nenhum relacionamento aqui precisa participar de outro relacionamento.' }
      ]
    },
    {
      k: 'reveal',
      t: 'Passo 5 — O DER da sala',
      q: 'Desenhe o seu antes de olhar. Depois compare com o quadro de ontem: cinco retângulos, um deles duplo, dois triângulos e o gênero em elipse dupla.',
      img: 'aula06-cinema-der-sala.png',
      check: [
        'CINEMA, FILME, ATOR e DIRETOR em retângulos simples',
        'SESSÃO em retângulo DUPLO — entidade fraca',
        'Endereço_Completo como elipse com cinco elipses penduradas',
        'Gênero em elipse DUPLA no FILME',
        'Triângulo entre FILME e ESTRANGEIRO, com Título_português pendurado no ESTRANGEIRO',
        'Triângulo entre ATOR e DIRETOR — o diretor é um ator',
        'CINEMA 1 —Tem— N SESSÃO e SESSÃO N —Exibe— 1 FILME',
        'DIRETOR 1 —Dirige— N FILME e ATOR N —Atuam— N FILME'
      ],
      model: `<p>Este é o quadro da aula. Repare no que ele resolve de forma elegante:
      <strong>SESSÃO como entidade fraca</strong> quebra o N:N entre cinema e filme em duas pernas
      1:N, e é nela que o horário e o número de telespectadores ficam guardados.</p>
      <p>E repare no que ele deixa em aberto: <strong>onde entra a data?</strong> O enunciado pede
      registro diário, mas no desenho só existe <code>NR_Telespectadores</code>. Sem a data, a sessão
      das 20h de sexta e a das 20h de sábado são a mesma linha. Esse é o buraco que o passo 7 fecha —
      e é exatamente o tipo de detalhe que a prova cobra.</p>`
    },
    {
      k: 'assign',
      t: 'Passo 6 — Duas leituras do mesmo enunciado',
      q: 'O autor do livro chegou a um DER diferente do da sala, e nenhum dos dois está errado. Para cada decisão, diga <strong>de quem é</strong>. Saber que existe escolha vale mais do que decorar um gabarito.',
      opts: ['Só no da sala', 'Só no do autor', 'Nos dois'],
      rows: [
        { t: 'SESSÃO existe como entidade própria, entre CINEMA e FILME',
          a: 0, why: 'Só na sala. O autor eliminou a sessão e ligou CINEMA N —EXIBIR— N FILME direto, pendurando data, horário, intervalo e público_registrado no próprio losango. Os dois guardam a mesma informação; muda o desenho.' },
        { t: 'ATOR e DIRETOR são a mesma coisa, com o diretor especializado',
          a: 2, why: 'Nos dois, com nomes diferentes. A sala fez um triângulo de ATOR para DIRETOR; o autor criou uma entidade única chamada ATOR_DIRETOR. É a mesma leitura da frase "o diretor pode também ser ator".' },
        { t: 'ESTRANGEIRO é especialização de FILME',
          a: 2, why: 'Nos dois, idêntico. Quando um atributo só vale para parte das ocorrências, nasce especialização — e aqui os dois gabaritos concordam sem hesitar.' },
        { t: 'O gênero é multivalorado',
          a: 2, why: 'Nos dois. A sala usou elipse dupla; o autor marcou TIPO * e GENERO * com asterisco. Notação diferente, mesmo conceito.' },
        { t: 'A DATA aparece explicitamente no modelo',
          a: 1, why: 'Só no do autor, e é a vantagem real do modelo dele: DATA está pendurada no losango EXIBIR, junto com PUBLIC_REGISTRADO. O desenho da sala esqueceu esse ponto — e é por isso que, no passo 7, a data entra na chave da SESSÃO.' },
        { t: 'O título original serve de chave primária do filme',
          a: 1, why: 'Só no do autor, que usou TITULO_ORIGINAL como PK. A sala criou ID_FILME artificial. Chave artificial é mais segura: dois filmes diferentes podem ter o mesmo título original, e refilmagem existe.' }
      ]
    },
    {
      k: 'reveal',
      t: 'Passo 7 — Escreva o Modelo Relacional',
      q: 'Agora escreva as tabelas, com PK sublinhada e FK marcada. Depois compare — e leia a nota sobre a chave da SESSÃO, que é o que faltava no desenho.',
      img: 'aula06-cinema-der-autor.png',
      check: [
        'Endereço composto achatado em colunas de CINEMA',
        'GENERO_FILME em tabela própria, com PK composta',
        'FILME_ESTRANGEIRO com id_filme como PK e FK ao mesmo tempo',
        'DIRETOR referenciando ATOR, e não uma tabela de nomes repetidos',
        'ELENCO com PK composta pelas duas chaves',
        'SESSAO com DATA dentro da chave primária'
      ],
      model: `<div class="pre">CINEMA (<u>ID_CINEMA</u>, FANTASIA, CAPACIDADE_LOTACAO,
        TIPO_LOG, LOGRADOURO, BAIRRO, MUNICIPIO, UF)

FILME (<u>ID_FILME</u>, TITULO_ORIGINAL, DURACAO, IMPROPRIEDADE,
       PAIS_ORIGEM, ID_DIRETOR fk)

GENERO_FILME (<u>ID_FILME</u> fk, <u>GENERO</u>)

FILME_ESTRANGEIRO (<u>ID_FILME</u> pk/fk, TITULO_PORTUGUES)

ATOR (<u>ID_ATOR</u>, NOME, NACIONALIDADE, IDADE)

DIRETOR (<u>ID_ATOR</u> pk/fk)

ELENCO (<u>ID_FILME</u> fk, <u>ID_ATOR</u> fk)

SESSAO (<u>ID_CINEMA</u> fk, <u>ID_FILME</u> fk, <u>DATA</u>, <u>HORARIO</u>,
        NR_TELESPECTADORES)</div>
      <p><b class="tag">A chave da SESSÃO</b> Este é o ponto do exercício. O enunciado pede o público
      <strong>registrado diariamente</strong>. Se a chave fosse só <code>(ID_CINEMA, HORARIO)</code>,
      a sessão das 20h teria um número só para sempre e a apuração histórica seria impossível. Com
      <code>DATA</code> dentro da chave, cada dia é uma linha e a totalização vira um <code>SUM</code>
      agrupado. É a regra de ouro do aspecto temporal: <em>quando o enunciado disser "por dia",
      "histórico" ou "ao longo do tempo", a data entra na chave</em>.</p>
      <p><b class="tag">Sobre DIRETOR(ID_ATOR)</b> A tabela parece vazia e é isso mesmo: ela só marca
      <em>quais atores também dirigem</em>. Especialização sem atributo próprio vira exatamente isso —
      uma tabela de uma coluna, que é PK e FK ao mesmo tempo.</p>`
    },
    {
      k: 'pick',
      t: 'Passo 8 — 1FN: o que se repete dentro da linha',
      q: `Este é o boletim que a distribuidora usa hoje, numa planilha, <strong>não
      normalizado</strong>:
      <div class="pre">BOLETIM_SESSAO
  id_cinema · fantasia · municipio · uf · capacidade
  data · horario
  id_filme · titulo_original · duracao · pais_origem
  <b>generos</b>  →  "Ação, Ficção, Aventura"
  id_diretor · nome_diretor
  <b>elenco</b>   →  "K. Reeves; L. Fishburne; C. Moss"
  publico</div>
      Marque o que viola a <strong>Primeira Forma Normal</strong>.`,
      items: [
        { t: 'A coluna generos guarda vários gêneros na mesma célula',
          ok: 1, why: 'Violação clássica: grupo repetitivo. Um campo deve guardar um valor atômico. Sai da tabela e vira GENERO_FILME(id_filme, genero), com PK composta.' },
        { t: 'A coluna elenco guarda vários atores na mesma célula',
          ok: 1, why: 'Mesmo problema. Vira ELENCO(id_filme, id_ator). Note que sem isso a consulta "quais cinemas passam filmes da Julia Roberts" exigiria vasculhar texto — e ela é justamente uma das que o enunciado pede.' },
        { t: 'A tabela não tem chave primária definida',
          ok: 1, why: '1FN exige chave. Aqui ela é composta: (id_cinema, id_filme, data, horario) — é o que identifica uma sessão específica de um dia específico.' },
        { t: 'A coluna fantasia se repete em várias linhas',
          ok: 0, why: 'Repetição entre linhas não é problema de 1FN — é de 2FN, e você resolve no próximo passo. A 1FN só olha para dentro da linha.' },
        { t: 'nome_diretor depende de id_diretor',
          ok: 0, why: 'Isso é dependência transitiva, assunto da 3FN. Uma forma normal de cada vez, na ordem.' },
        { t: 'O endereço está separado em municipio e uf',
          ok: 0, why: 'Ao contrário: separar o composto em colunas atômicas é exatamente o que a 1FN pede. Se houvesse uma única coluna "endereço completo" com tudo junto, aí sim seria violação.' }
      ]
    },
    {
      k: 'assign',
      t: 'Passo 9 — 2FN: dependência da chave inteira',
      q: `Depois da 1FN sobrou <code>SESSAO(<u>id_cinema, id_filme, data, horario</u>, fantasia,
      municipio, uf, capacidade, titulo_original, duracao, pais_origem, id_diretor, nome_diretor,
      publico)</code>. A chave é composta, então a 2FN se aplica. Para cada coluna, diga
      <strong>de que parte da chave ela realmente depende</strong>.`,
      opts: ['Só de id_cinema', 'Só de id_filme', 'Da chave inteira'],
      rows: [
        { t: 'fantasia',        a: 0, why: 'O nome do cinema não muda conforme o filme nem conforme o dia. Dependência parcial — sai para CINEMA.' },
        { t: 'municipio · uf',  a: 0, why: 'Endereço é do cinema. Vão junto para CINEMA.' },
        { t: 'capacidade',      a: 0, why: 'A lotação é da sala, não da sessão. Vai para CINEMA.' },
        { t: 'titulo_original', a: 1, why: 'Depende só do filme. Sai para FILME.' },
        { t: 'duracao',         a: 1, why: 'Depende só do filme — mesmo sendo ela que faz o horário variar. Sai para FILME.' },
        { t: 'pais_origem',     a: 1, why: 'Do filme. Vai para FILME — e é a coluna que responde "em quais cinemas há filmes nacionais".' },
        { t: 'id_diretor',      a: 1, why: 'Do filme: um único diretor por filme. Vai para FILME.' },
        { t: 'publico',         a: 2, why: 'Esta é a única que depende da chave inteira. O público é daquele filme, naquele cinema, naquele dia, naquele horário. Trocar qualquer parte da chave muda o número — por isso ela fica.' }
      ]
    },
    {
      k: 'reveal',
      t: 'Passo 10 — 3FN e o modelo final',
      q: 'Falta uma dependência transitiva. Encontre-a, elimine, e escreva o conjunto final de tabelas. Depois confira.',
      check: [
        'A dependência transitiva encontrada é nome_diretor → id_diretor → id_filme',
        'DIRETOR virou tabela própria, ligada a ATOR',
        'CINEMA, FILME, SESSAO, GENERO_FILME, ELENCO e FILME_ESTRANGEIRO separados',
        'A DATA continua dentro da chave de SESSAO',
        'Nenhuma coluna guarda algo que já pode ser deduzido de outra tabela'
      ],
      model: `<p><b class="tag">A transitiva</b> Dentro de FILME, <code>nome_diretor</code> não
      depende do filme: depende de <code>id_diretor</code>, que por sua vez depende do filme.
      Chave → coluna → outra coluna é o desenho de uma dependência transitiva, e a 3FN corta o elo do
      meio. Se o diretor trocar de nome, você não quer atualizar oitenta linhas de FILME.</p>
      <div class="pre">CINEMA (<u>ID_CINEMA</u>, FANTASIA, CAPACIDADE_LOTACAO,
        TIPO_LOG, LOGRADOURO, BAIRRO, MUNICIPIO, UF)

FILME (<u>ID_FILME</u>, TITULO_ORIGINAL, DURACAO, IMPROPRIEDADE,
       PAIS_ORIGEM, ID_DIRETOR fk)

GENERO_FILME (<u>ID_FILME</u> fk, <u>GENERO</u>)

FILME_ESTRANGEIRO (<u>ID_FILME</u> pk/fk, TITULO_PORTUGUES)

ATOR (<u>ID_ATOR</u>, NOME, NACIONALIDADE, IDADE)

DIRETOR (<u>ID_ATOR</u> pk/fk)

ELENCO (<u>ID_FILME</u> fk, <u>ID_ATOR</u> fk)

SESSAO (<u>ID_CINEMA</u> fk, <u>ID_FILME</u> fk, <u>DATA</u>, <u>HORARIO</u>,
        NR_TELESPECTADORES)</div>
      <p><b class="tag">Prova real</b> Um modelo normalizado se testa pelas consultas que o enunciado
      pediu. <em>Público por município</em>: junte SESSAO com CINEMA e agrupe por município.
      <em>Cinemas onde passa filme com a Julia Roberts</em>: ATOR → ELENCO → FILME → SESSAO → CINEMA,
      quatro junções, todas por chave. <em>Cinemas com filme nacional</em>: filtre
      <code>pais_origem</code> em FILME. Todas respondem sem ler texto solto e sem varrer célula com
      vírgula dentro. É esse o ganho da normalização — não a elegância, a consulta.</p>`
    }
  ]
},

/* ═════════════════════════════════════ CASO 10 — UNIVERSIDADE (EC2) ══ */
{
  id: 'of-universidade',
  n: 10,
  t: 'Gerência Acadêmica UNITESTE',
  nivel: 'Aula 06 · EC2 — ainda não feito em sala',
  tags: 'MER · DER · MR · auto-relacionamento',
  intro: 'O enunciado mais longo dos três e o mais cheio de números: mínimo de dez alunos, máximo de cinquenta, no máximo três matérias por professor, no máximo três pré-requisitos. Quase nenhum desses números vira estrutura no modelo — entender por quê é metade do exercício. A outra metade é o pré-requisito, que é auto-relacionamento.',
  enunciado: `
    <p>A <strong>Gerência Acadêmica</strong> da universidade UNITESTE quer automatizar o controle
    centralizado de alunos, cursos, disciplinas, turmas, professores e histórico escolar.</p>
    <ul>
      <li>Alunos são admitidos por <strong>vestibular ou transferência</strong>, e um aluno só pode
      estar ligado a <strong>um curso</strong> num dado instante. Ao ingressar preenchem ficha
      cadastral com número de matrícula pré-impresso, nome e endereço.</li>
      <li>Cada disciplina precisa de <strong>no mínimo 10 e no máximo 50 alunos</strong>.</li>
      <li>Os cursos são compostos por disciplinas, que podem ser <strong>obrigatórias ou optativas,
      dependendo do curso</strong> a que pertencem.</li>
      <li>Cada disciplina está sob a responsabilidade de <strong>um departamento</strong> e é
      codificada segundo padrão do conselho.</li>
      <li>Professores podem ser cadastrados <strong>sem estar lecionando</strong>. Cada professor
      ministra no máximo <strong>3 matérias</strong>, precisa estar <strong>habilitado pelo
      CFE</strong> para ministrar, está vinculado a um departamento e tem código próprio.</li>
      <li>O <strong>histórico escolar</strong> é o conjunto de todas as disciplinas cursadas pelo
      aluno em toda a sua vida acadêmica, com a <strong>nota final e a data</strong> em que cada uma
      foi cursada.</li>
      <li>Os departamentos respondem pelos cursos de sua área: definem número de créditos para
      conclusão, total de horas do curso e total de horas nas disciplinas obrigatórias.</li>
      <li>Cada disciplina pode ter <strong>no máximo 3 e no mínimo 0 pré-requisitos</strong>.</li>
      <li>Um aluno pode não estar matriculado em nada num semestre (trancamento), pode se matricular
      em no máximo 7 disciplinas por período e <strong>repetir a mesma disciplina até 3
      vezes</strong>.</li>
    </ul>
    <p><b>Atributos dados pelo enunciado:</b> Professor (código, nome, inscrição CFE); Departamento
    (código, nome); Curso (código, nome); Disciplina (código, nome, descrição curricular).</p>`,
  steps: [
    {
      k: 'pick',
      t: 'Passo 1 — Entidades',
      q: 'Marque as entidades. O enunciado entrega quatro de bandeja no final; falta enxergar as que ele não lista.',
      items: [
        { t: 'ALUNO',        ok: 1, why: 'Matrícula, nome, endereço, tipo de admissão. Entidade fundamental.' },
        { t: 'CURSO',        ok: 1, why: 'Código, nome, total de horas, créditos. Listado no enunciado.' },
        { t: 'DISCIPLINA',   ok: 1, why: 'Código, nome, descrição curricular. Listado no enunciado.' },
        { t: 'PROFESSOR',    ok: 1, why: 'Código, nome, inscrição CFE. Listado no enunciado.' },
        { t: 'DEPARTAMENTO', ok: 1, why: 'Código e nome. É ele que responde pelos cursos, pelas disciplinas e pelos professores — três relacionamentos diferentes saem daqui.' },
        { t: 'HISTÓRICO',    ok: 1, why: 'Não está na lista de atributos, mas é entidade: guarda nota e data de cada disciplina cursada. É o cruzamento aluno × disciplina com atributos próprios — o desenho clássico de entidade associativa.' },
        { t: 'PROFESSOR_HABILITADO', ok: 1, why: 'Especialização de PROFESSOR. "O professor deve estar habilitado pelo CFE para ministrar" — só o subconjunto habilitado pode ser ligado a disciplina. É assim que o gabarito resolve.' },
        { t: 'NOTA',         ok: 0, why: 'Atributo do histórico.' },
        { t: 'VESTIBULAR',   ok: 0, why: 'É um valor do atributo tipo_admissao (vestibular ou transferência), não uma entidade.' },
        { t: 'SEMESTRE',     ok: 0, why: 'Aparece nas regras de trancamento e matrícula, mas o enunciado não pede nenhum dado sobre o semestre em si. Se pedisse controle de período letivo, aí sim.' },
        { t: 'PRÉ-REQUISITO', ok: 0, why: 'É um relacionamento de DISCIPLINA com ela mesma, não uma entidade nova. Este é o ponto do exercício.' }
      ]
    },
    {
      k: 'assign',
      t: 'Passo 2 — Relacionamentos e cardinalidade',
      q: 'Defina a cardinalidade de cada ligação. Preste atenção especial nas três últimas linhas.',
      opts: ['1 : 1', '1 : N', 'N : N'],
      rows: [
        { t: 'DEPARTAMENTO — responde por — CURSO',
          a: 1, why: 'Um departamento tem vários cursos; cada curso pertence a um. FK cod_depto em CURSO.' },
        { t: 'DEPARTAMENTO — é responsável por — DISCIPLINA',
          a: 1, why: '"Cada disciplina está sob a responsabilidade de um departamento". FK cod_depto em DISCIPLINA.' },
        { t: 'DEPARTAMENTO — lota — PROFESSOR',
          a: 1, why: '"Cada professor está vinculado a um departamento". FK cod_depto em PROFESSOR.' },
        { t: 'ALUNO — está matriculado em — CURSO',
          a: 1, why: '"Um aluno só pode estar ligado a um curso, em um dado instante". FK cod_curso em ALUNO. Note o "em um dado instante": o modelo guarda o curso atual, não o histórico de trocas.' },
        { t: 'CURSO — é composto por — DISCIPLINA',
          a: 2, why: 'N:N, e com atributo: a mesma disciplina é obrigatória num curso e optativa em outro. Nasce COMPOR(cod_curso, cod_disc, tipo_disciplina) — o tipo não cabe nem no curso nem na disciplina, só no cruzamento.' },
        { t: 'ALUNO — cursou — DISCIPLINA (histórico)',
          a: 2, why: 'N:N com nota e data. E como o aluno pode repetir a mesma disciplina até três vezes, a data precisa entrar na chave: HISTORICO(nr_matricula, cod_disc, data) — senão a segunda tentativa sobrescreveria a primeira.' },
        { t: 'PROFESSOR_HABILITADO — ministra — DISCIPLINA',
          a: 1, why: 'Um professor habilitado ministra até três disciplinas; cada disciplina tem um professor responsável. FK cod_prof em DISCIPLINA. O limite de três é regra de negócio, não estrutura.' },
        { t: 'DISCIPLINA — é pré-requisito de — DISCIPLINA',
          a: 2, why: 'Auto-relacionamento, e N:N: uma disciplina pode ter até três pré-requisitos, e a mesma disciplina pode ser pré-requisito de várias outras. O gabarito simplificou para uma coluna PRE_REQUISITO dentro de DISCIPLINA — o que só comporta um. Para os três que o enunciado permite, o correto é a tabela PRE_REQUISITO(cod_disc, cod_disc_exigida).' }
      ]
    },
    {
      k: 'pick',
      t: 'Passo 3 — O que o modelo não guarda',
      q: 'O enunciado está cheio de números. Marque as regras que <strong>não viram estrutura</strong> no modelo — as que ficam para a aplicação ou para uma restrição no banco.',
      items: [
        { t: 'Mínimo de 10 e máximo de 50 alunos por disciplina',
          ok: 1, why: 'Restrição de quantidade. Nenhum desenho de DER expressa isso: é validação da aplicação ou uma trigger. Cardinalidade diz "vários", não "entre 10 e 50".' },
        { t: 'Máximo de 3 matérias por professor',
          ok: 1, why: 'Também restrição de quantidade sobre um 1:N que já está no modelo.' },
        { t: 'Máximo de 7 disciplinas por período',
          ok: 1, why: 'Idem — e note que o modelo nem guarda período letivo, então não teria nem onde contar.' },
        { t: 'A universidade comporta 5000 alunos e oferece 10 cursos',
          ok: 1, why: 'Isso é dimensionamento, não regra. Serve para o DBA estimar tamanho de tabela e planejar índices; não muda uma linha do DER.' },
        { t: 'Um aluno está ligado a um único curso',
          ok: 0, why: 'Esta vira estrutura: é a cardinalidade 1:N entre CURSO e ALUNO, materializada na FK.' },
        { t: 'A disciplina é obrigatória ou optativa dependendo do curso',
          ok: 0, why: 'Vira estrutura, e importante: é o atributo tipo_disciplina na tabela COMPOR. Se fosse coluna de DISCIPLINA, a mesma matéria não poderia ser obrigatória num curso e optativa em outro.' },
        { t: 'O professor precisa ser habilitado pelo CFE para ministrar',
          ok: 0, why: 'Vira estrutura como especialização: só quem está em PROFESSOR_HABILITADO pode ser referenciado por DISCIPLINA. Aqui a regra virou desenho.' },
        { t: 'O aluno pode repetir a mesma disciplina até 3 vezes',
          ok: 0, why: 'O limite de três é regra de aplicação, mas a possibilidade de repetir vira estrutura: obriga a data a entrar na chave do histórico. Meia regra vira modelo — e é a metade que costuma ser esquecida.' }
      ]
    },
    {
      k: 'reveal',
      t: 'Passo 4 — Desenhe o DER',
      q: 'Cinco retângulos principais, um losango que sai e volta para DISCIPLINA, dois triângulos e três losangos ligando ao departamento. Desenhe antes de abrir.',
      img: 'aula06-universidade-der.png',
      check: [
        'ALUNO, CURSO, DISCIPLINA, PROFESSOR e DEPARTAMENTO em retângulos',
        'Losango de pré-requisito saindo de DISCIPLINA e voltando para ela',
        'Triângulo de PROFESSOR para PROFESSOR_HABILITADO',
        'Triângulo de DISCIPLINA para DISCIPLINA_OBRIGATORIA',
        'DEPARTAMENTO ligado a CURSO, DISCIPLINA e PROFESSOR — três losangos distintos',
        'HISTORICO entre ALUNO e DISCIPLINA, com nota e data',
        'Losango COMPOR entre CURSO e DISCIPLINA, com tipo_disciplina pendurado nele'
      ],
      model: `<p>O diagrama do gabarito é denso — vale ampliar e ler por partes. Procure primeiro o
      <strong>losango que volta</strong>: é o pré-requisito, e é a estrutura que mais aparece em prova
      logo depois da cardinalidade. Depois procure os <strong>dois triângulos</strong>: o professor
      habilitado e a disciplina obrigatória. Só então olhe o resto.</p>`
    },
    {
      k: 'reveal',
      t: 'Passo 5 — Modelo Relacional',
      q: 'Escreva as tabelas com PK e FK. Confira depois — e leia a observação sobre o pré-requisito, onde o gabarito tomou um atalho.',
      check: [
        'PROFESSOR_HABILITADO com cod_prof como PK e FK',
        'DISCIPLINA apontando para departamento e para professor habilitado',
        'COMPOR com PK composta e o tipo_disciplina dentro',
        'HISTORICO com a data dentro da chave',
        'Pré-requisito resolvido como tabela própria, não como coluna'
      ],
      model: `<div class="pre">DEPARTAMENTO (<u>COD_DEPTO</u>, NOME_DEPTO)

CURSO (<u>COD_CURSO</u>, NOME, NR_CREDITOS, NR_TOTAL_HORAS,
       NR_HORAS_OBRIGATORIAS, COD_DEPTO fk)

PROFESSOR (<u>COD_PROF</u>, NOME, COD_DEPTO fk)

PROFESSOR_HABILITADO (<u>COD_PROF</u> pk/fk, INSCRICAO_CFE)

DISCIPLINA (<u>COD_DISC</u>, NOME_DISC, DESC_CURRICULAR, QTD_HORAS,
            COD_DEPTO fk, COD_PROF fk)

DISCIPLINA_OBRIGATORIA (<u>COD_DISC</u> pk/fk, HORA_OBRIGATORIA)

PRE_REQUISITO (<u>COD_DISC</u> fk, <u>COD_DISC_EXIGIDA</u> fk)

COMPOR (<u>COD_CURSO</u> fk, <u>COD_DISC</u> fk, TIPO_DISCIPLINA)

ALUNO (<u>NR_MATRICULA</u>, NOME, ENDERECO, TIPO_ADMISSAO, COD_CURSO fk)

HISTORICO (<u>NR_MATRICULA</u> fk, <u>COD_DISC</u> fk, <u>DATA_CURSADA</u>, NOTA)</div>
      <p><b class="tag">Onde o gabarito simplificou</b> A resolução do professor resolve o
      pré-requisito com uma coluna <code>PRE_REQUISITO</code> dentro de DISCIPLINA, apontando para
      <code>COD_DISC</code>. Funciona para <strong>um</strong> pré-requisito. Como o enunciado permite
      até três, isso é um multivalorado disfarçado — e multivalorado vira tabela. A versão acima
      resolve com <code>PRE_REQUISITO(cod_disc, cod_disc_exigida)</code>, que aceita quantos forem e
      ainda deixa trivial a consulta "quais matérias exigem Cálculo I".</p>
      <p><b class="tag">A data no histórico</b> Sem <code>DATA_CURSADA</code> na chave, o aluno que
      repete a disciplina sobrescreve a nota anterior — e o histórico escolar deixa de ser histórico.
      É o mesmo raciocínio da sessão de cinema: <em>repetição ao longo do tempo pede data na
      chave</em>.</p>`
    }
  ]
},

/* ═══════════════════════════════════════════ CASO 11 — VÍRUS (EC3) ══ */
{
  id: 'of-virus',
  n: 11,
  t: 'Grupo de Pesquisa sobre Vírus',
  nivel: 'Aula 06 · EC3 — ainda não feito em sala',
  tags: 'MER · DER · MR · auto-relacionamento N:N',
  intro: 'O menor enunciado dos três e o mais difícil. A dificuldade está numa frase só: "cada publicação contém uma lista de referências a outras publicações". Isso é uma entidade se relacionando com ela mesma em N:N — a estrutura que mais confunde, porque não existe um segundo retângulo para desenhar.',
  enunciado: `
    <p>Um grupo de pesquisa médica de um grande hospital quer manter um banco de dados sobre
    <strong>todas as publicações relativas a certos tipos de vírus</strong>.</p>
    <ul>
      <li>De cada <strong>vírus</strong> registra-se o nome científico e um texto livre com a
      descrição científica.</li>
      <li>Cada <strong>publicação</strong> é impressa numa edição particular do jornal científico do
      hospital, identificada pelo <strong>nome do jornal, número do volume e número da
      edição</strong>.</li>
      <li>Uma publicação pode ter <strong>um ou mais autores</strong> e ser referente a <strong>um ou
      mais tipos de virose</strong>.</li>
      <li>Guarda-se também o <strong>resumo (abstract)</strong>, o nome do autor ou autores e o nome
      da <strong>instituição</strong> à qual a pesquisa está associada, caso ela seja de fora do grupo
      de pesquisas.</li>
      <li>Cada publicação contém uma <strong>lista de referências a outras publicações</strong>, e
      essa informação é registrada na base.</li>
      <li>As publicações <strong>editadas pelo próprio grupo</strong> guardam, além do normal, dados
      do contrato de pesquisa: número do contrato, valor, data de início e término.</li>
    </ul>
    <p><b>Consultas pedidas:</b> entrar uma nova publicação com todas as informações; listar os
    detalhes de todas as publicações relativas a um vírus específico; listar as publicações de um
    autor; listar as publicações associadas a um contrato de pesquisa.</p>`,
  steps: [
    {
      k: 'pick',
      t: 'Passo 1 — Entidades',
      q: 'Marque as entidades. São seis, e uma delas quase todo mundo esquece porque aparece numa oração subordinada.',
      items: [
        { t: 'PUBLICACAO', ok: 1, why: 'Entidade central: tudo no enunciado gira em torno dela.' },
        { t: 'VIRUS',      ok: 1, why: 'Nome científico e texto livre. Entidade fundamental.' },
        { t: 'AUTOR',      ok: 1, why: '"Uma publicação pode ter um ou mais autores". Entidade, e o relacionamento é N:N.' },
        { t: 'INSTITUTO',  ok: 1, why: 'A que quase sempre escapa. Aparece só em "o nome da instituição à qual a pesquisa está associada, caso esta seja de fora do grupo". É entidade, e o "caso" indica participação opcional.' },
        { t: 'CONTRATO',   ok: 1, why: 'Número, valor, data de início e término. Atributos próprios são o sinal de entidade.' },
        { t: 'PUBLICACAO_GRUPO_PESQUISA', ok: 1, why: 'Especialização de PUBLICACAO. Só as editadas pelo grupo têm contrato — atributo que não vale para todas as ocorrências pede especialização.' },
        { t: 'ABSTRACT',   ok: 0, why: 'Atributo de PUBLICACAO. É texto, e texto longo não deixa de ser atributo.' },
        { t: 'JORNAL',     ok: 0, why: 'Pegadinha defensável. No gabarito, nome_jornal, nr_volume e nr_edicao formam a chave composta de PUBLICACAO. Se o enunciado pedisse dados sobre o jornal em si — periodicidade, ISSN, editor — aí ele viraria entidade.' },
        { t: 'REFERENCIA', ok: 0, why: 'É o relacionamento de PUBLICACAO com ela mesma, não uma entidade. Vai virar tabela no mapeamento, mas por ser N:N, não por ser entidade.' }
      ]
    },
    {
      k: 'assign',
      t: 'Passo 2 — Cardinalidades',
      q: 'A última linha é o exercício inteiro. Chegue nela com calma.',
      opts: ['1 : 1', '1 : N', 'N : N'],
      rows: [
        { t: 'AUTOR — escreve — PUBLICACAO',
          a: 2, why: '"Uma publicação pode ter um ou mais autores", e um autor publica várias vezes. N:N — nasce ESCREVER(id_autor, nr_edicao).' },
        { t: 'PUBLICACAO — trata de — VIRUS',
          a: 2, why: '"Ser referente a um ou mais tipos de virose", e o mesmo vírus aparece em muitas publicações. N:N nos dois sentidos. Guarde este item: ele reaparece no passo 4.' },
        { t: 'INSTITUTO — produz — PUBLICACAO',
          a: 1, why: 'Um instituto produz várias publicações; cada publicação vem de um instituto — e só quando a pesquisa é de fora do grupo, o que torna a participação opcional.' },
        { t: 'CONTRATO — financia — PUBLICACAO_GRUPO_PESQUISA',
          a: 1, why: 'No gabarito está 1:1, mas o enunciado pede "listar as publicações associadas a um contrato de pesquisa" — no plural. Um contrato que rende várias publicações é 1:N, e é a leitura que atende à consulta pedida.' },
        { t: 'PUBLICACAO — referencia — PUBLICACAO',
          a: 2, why: 'Auto-relacionamento N:N. Uma publicação cita várias outras e é citada por várias. Grau 1, cardinalidade N:N — a combinação mais difícil de enxergar, porque só existe um retângulo no desenho.' }
      ]
    },
    {
      k: 'pick',
      t: 'Passo 3 — Por que o auto-relacionamento N:N vira tabela',
      q: 'Você já sabe que N:N sempre gera tabela. Marque o que é <strong>verdade</strong> sobre a tabela que nasce de <code>PUBLICACAO — referencia — PUBLICACAO</code>.',
      items: [
        { t: 'A tabela tem duas colunas, e as duas apontam para PUBLICACAO',
          ok: 1, why: 'Exatamente. REFERENCIA(nr_edicao, nr_edicao_citada) — as duas FKs saem da mesma tabela. É o que faz o caso parecer estranho, e é só isso.' },
        { t: 'As duas colunas precisam de nomes diferentes',
          ok: 1, why: 'Obrigatório: duas colunas com o mesmo nome não coexistem. Os papéis viram os nomes — quem cita e quem é citada.' },
        { t: 'A PK é composta pelas duas colunas',
          ok: 1, why: 'É o par que identifica a citação. Como bônus, isso impede automaticamente que a mesma referência seja registrada duas vezes.' },
        { t: 'A ordem das duas colunas importa',
          ok: 1, why: 'Muito. (A, B) significa "A cita B", que é diferente de "B cita A". Num auto-relacionamento N:N o par é ordenado — ao contrário de um relacionamento simétrico como "é irmão de".' },
        { t: 'É preciso criar uma segunda tabela PUBLICACAO para o outro lado',
          ok: 0, why: 'Não. Uma tabela só, referenciada duas vezes. A duplicação aparece na consulta, com dois apelidos: <code>FROM publicacao p JOIN referencia r ON … JOIN publicacao citada ON …</code>.' },
        { t: 'Só funciona se a publicação citada já existir na base',
          ok: 0, why: 'Isso é integridade referencial, não estrutura — e é uma decisão sua. Se quiser registrar citação a artigo de fora, a FK precisa aceitar nulo ou o artigo precisa ser cadastrado antes.' }
      ]
    },
    {
      k: 'reveal',
      t: 'Passo 4 — DER e Modelo Relacional',
      q: 'Desenhe o DER e escreva as tabelas. Depois confira — e leia a nota, porque o gabarito tem um ponto discutível que vale mais que o próprio gabarito.',
      img: 'aula06-virus-der.png',
      check: [
        'PUBLICACAO ao centro, com nome_jornal, nr_volume, nr_edicao e abstract',
        'Losango REFERENCIA saindo e voltando para PUBLICACAO, com N nas duas pontas',
        'Triângulo de PUBLICACAO para PUBLICACAO_GRUPO_PESQ',
        'CONTRATO ligado apenas à especialização, nunca à publicação comum',
        'ESCREVER entre AUTOR e PUBLICACAO, N:N',
        'INSTITUTO ligado a PUBLICACAO com participação opcional'
      ],
      model: `<div class="pre">PUBLICACAO (<u>NOME_JORNAL</u>, <u>NR_VOLUME</u>, <u>NR_EDICAO</u>,
            ABSTRACT, NOME_INSTITUTO fk)

INSTITUTO (<u>NOME_INSTITUTO</u>)

AUTOR (<u>ID_AUTOR</u>, NOME)

ESCREVER (<u>ID_AUTOR</u> fk, <u>NR_EDICAO</u> fk)

VIRUS (<u>NOME_CIENTIFICO</u>, TEXTO_LIVRE)

PUBLICACAO_VIRUS (<u>NR_EDICAO</u> fk, <u>NOME_CIENTIFICO</u> fk)

REFERENCIA (<u>NR_EDICAO</u> fk, <u>NR_EDICAO_CITADA</u> fk)

CONTRATO (<u>NR_CONTRATO</u>, VALOR, DATA_INICIO, DATA_TERMINO)

PUBLICACAO_GRUPO_PESQ (<u>NR_EDICAO</u> pk/fk, NR_CONTRATO fk)</div>
      <p><b class="tag">Onde o gabarito escorrega</b> A resolução do professor traz
      <code>VIRUS(NOME_CIENTIFICO, TEXTO_LIVRE, NR_EDICAO)</code> — com a edição dentro do vírus, o
      que é 1:N: cada vírus pertenceria a uma única publicação. Mas o enunciado diz que uma publicação
      pode tratar de <strong>um ou mais</strong> vírus, e o mesmo vírus obviamente aparece em várias
      publicações. Isso é N:N, e N:N pede tabela própria — a <code>PUBLICACAO_VIRUS</code> acima.</p>
      <p>Repare como o erro se denuncia sozinho pela consulta: o enunciado pede "listar todas as
      publicações relativas a um vírus específico". Com o vírus carregando uma única edição, essa
      lista tem no máximo um item. Sempre que uma consulta pedida pelo enunciado ficar impossível,
      o modelo está errado — e não a consulta.</p>
      <p><b class="tag">Vale como hábito de prova</b> Antes de entregar qualquer modelo, releia as
      consultas que o enunciado pediu e tente respondê-las de cabeça, tabela por tabela. É o teste
      mais rápido que existe, e pega quase tudo.</p>`
    }
  ]
}

);

/* -------------------------------------------------------------------------
   DIAGRAMAS DA AULA 06
   ------------------------------------------------------------------------- */

DIAGRAMS.push(
  {
    id: 'a6-cinema-sala', src: 'aula', m: 17,
    t: 'Cinema — o DER feito em sala',
    img: 'aula06-cinema-der-sala.png',
    cap: 'O quadro da aula de 09/09, resolvendo o Estudo de Caso 1. Traz num diagrama só quatro das estruturas mais cobradas: <strong>entidade fraca</strong>, <strong>atributo composto</strong>, <strong>atributo multivalorado</strong> e <strong>duas especializações</strong>.',
    look: [
      { g: '▣', t: 'SESSÃO em retângulo duplo: entidade fraca. Ela não se identifica sozinha — depende do cinema e do filme.' },
      { g: '◎', t: 'Genero em elipse dupla no FILME: multivalorado. Um filme pode ser ação e ficção ao mesmo tempo.' },
      { g: '△', t: 'Dois triângulos. FILME → ESTRANGEIRO (só ele tem título em português) e ATOR → DIRETOR (o diretor é um ator que dirige).' },
      { g: '⬡', t: 'Endereço_Completo com cinco elipses penduradas: atributo composto, que se achata em colunas no relacional.' },
      { g: '!', t: 'O que falta: a DATA. O enunciado pede público registrado diariamente, e sem data na chave a sessão das 20h guarda um número só. É o que a Oficina corrige no passo 7.' }
    ]
  },
  {
    id: 'a6-cinema-autor', src: 'guia', m: 17,
    t: 'Cinema — a resolução do autor do livro',
    img: 'aula06-cinema-der-autor.png',
    cap: 'O mesmo enunciado, resolvido por Machado & Abreu. Chega a um diagrama <strong>diferente</strong> e igualmente correto — a prova de que modelagem tem escolha, não só gabarito.',
    look: [
      { g: '◇', t: 'Sem SESSÃO: CINEMA N —EXIBIR— N FILME direto, com data, horário, intervalo e público pendurados no losango. O N:N guarda o que a entidade fraca guardava.' },
      { g: '▭', t: 'ATOR_DIRETOR como entidade única em vez de dois retângulos com triângulo. Mesma leitura da frase "o diretor pode ser ator", desenho diferente.' },
      { g: '*', t: 'TIPO * e GENERO * com asterisco: é outra notação para multivalorado. A elipse dupla da sala diz a mesma coisa.' },
      { g: '△', t: 'ESTRANGEIRO aparece igual nos dois. Quando o atributo só vale para parte das ocorrências, não há discussão: é especialização.' },
      { g: '✓', t: 'A vantagem deste: DATA está no modelo desde o começo. A vantagem do outro: a sessão vira entidade, e o horário tem onde morar.' }
    ]
  },
  {
    id: 'a6-universidade', src: 'guia', m: 17,
    t: 'Gerência Acadêmica — DER da UNITESTE',
    img: 'aula06-universidade-der.png',
    cap: 'O Estudo de Caso 2, denso de propósito. Vale ampliar e ler por partes: primeiro o losango que volta, depois os triângulos, e só então o resto.',
    look: [
      { g: '↺', t: 'O losango de pré-requisito sai de DISCIPLINA e volta para ela. Auto-relacionamento — e N:N, porque o enunciado permite até três pré-requisitos.' },
      { g: '△', t: 'PROFESSOR → PROFESSOR_HABILITADO. Só o subconjunto habilitado pelo CFE pode ser ligado a uma disciplina: a regra virou estrutura.' },
      { g: '△', t: 'DISCIPLINA → DISCIPLINA_OBRIGATORIA, que carrega a carga horária obrigatória.' },
      { g: '◇', t: 'DEPARTAMENTO aparece três vezes: responde por cursos, por disciplinas e lota professores. Três losangos distintos, não um.' },
      { g: '▭', t: 'COMPOR liga curso e disciplina carregando tipo_disciplina. É ele que permite a mesma matéria ser obrigatória num curso e optativa em outro.' }
    ]
  },
  {
    id: 'a6-virus', src: 'guia', m: 17,
    t: 'Grupo de Pesquisa — auto-relacionamento N:N',
    img: 'aula06-virus-der.png',
    cap: 'O Estudo de Caso 3. O diagrama mais instrutivo da aula por um motivo: ele mostra o <strong>auto-relacionamento N:N</strong>, a estrutura que mais trava aluno em prova.',
    look: [
      { g: '↺', t: 'O losango REFERENCIA sai de PUBLICACAO e volta, com N nas duas pontas. Uma publicação cita várias e é citada por várias.' },
      { g: '≠', t: 'No relacional isso vira uma tabela de duas colunas, ambas apontando para PUBLICACAO — e com nomes diferentes, porque os papéis são diferentes: quem cita e quem é citada.' },
      { g: '△', t: 'PUBLICACAO_GRUPO_PESQ pendurada num triângulo. O CONTRATO liga só nela, nunca na publicação comum.' },
      { g: '⌗', t: 'A chave de PUBLICACAO é tripla: nome_jornal + volume + edição. Chave composta natural, sem id artificial.' },
      { g: '!', t: 'Discutível no gabarito: VIRUS carrega NR_EDICAO, o que faria cada vírus pertencer a uma única publicação. O enunciado pede N:N — e a consulta "listar publicações de um vírus" denuncia o problema.' }
    ]
  }
);
