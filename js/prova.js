/* =========================================================================
   PROVA — questões no formato do professor

   O formato não é múltipla escolha comum. Cada questão traz:

     1. um cenário, com nome de pessoa e empresa
     2. um artefato para analisar — DER, tabelas do Modelo Relacional,
        ou uma tabela com dados dentro
     3. quatro afirmações numeradas I, II, III e IV
     4. alternativas que COMBINAM os itens ("I e III", "II e IV",
        "Todos os itens estão incorretos"…)

   Vale 2 pontos por questão, 10 na prova inteira.

   Por que a correção aqui mostra o veredito de CADA item, e não só o da
   alternativa: neste formato você perde a questão inteira por causa de um
   único item mal lido. Saber qual dos quatro derrubou você é a única
   informação que ensina alguma coisa.

   Origem:
     'professor' — as cinco que ele deixou para treinar
     'autoral'   — escritas no mesmo formato, para ter simulado novo
   ========================================================================= */

const PROVA = [

/* ══════════════════════════════════════════ 1 — SUPERMERCADO (professor) ══ */
{
  id: 'p01',
  origem: 'professor',
  m: 14,
  pontos: 2,
  t: 'Bom Preço Supermercados',
  cenario: `
    <p><strong>SANDRA DE CASTRO</strong> é analista de banco de dados da empresa
    <strong>BOM PREÇO SUPERMERCADOS LTDA</strong>. Sandra está desenhando o Modelo Entidade
    Relacionamento do seguinte cenário:</p>
    <p>O supermercado trabalha com produtos do varejo (sabonete, pasta dental, bebidas, produtos de
    padaria etc.), e <strong>a grande maioria dos produtos possui mais de um fornecedor</strong>. Os
    fornecimentos desses produtos possuem uma determinada <strong>data</strong>, na qual o
    supermercado precisa de uma determinada <strong>quantidade</strong>.</p>
    <p><strong>Não há como fazer o pedido do mesmo produto para o mesmo fornecedor na mesma
    data</strong>, pois os fornecedores só recebem o pedido uma vez por dia. Como o contrato de
    entrega é de aproximadamente 2 horas após o pedido, o comprador é obrigado a fazer o pedido do
    mesmo produto no dia seguinte.</p>
    <p><strong>O preço de custo do produto é passado no dia do fornecimento</strong>, pois há vários
    fatores que fazem os produtos mudarem de preço a cada fornecimento.</p>`,
  svg: 'provaSupermercado',
  artefatoTitulo: 'O DER que Sandra desenhou',
  mr: `FORNECEDOR (<u>COD_FOR</u>, RAZAO_SOCIAL)
PRODUTO    (<u>COD_PROD</u>, DESCRICAO, PRECO_CUSTO)
FORNECE    (<u>COD_FOR</u>, <u>COD_PROD</u>, <u>DATA</u>, QTD)`,
  mrTitulo: 'O Modelo Relacional que Sandra criou',
  itens: [
    { t: 'No desenho do DER, todas as entidades com seus devidos atributos e relacionamento estão corretas de acordo com o cenário.',
      ok: 0,
      why: 'O erro está em <code>PRECO_CUSTO</code> pendurado na entidade PRODUTO. O cenário diz que o preço "é passado no dia do fornecimento" e "muda a cada fornecimento" — ou seja, ele depende do par fornecedor+produto+data, e não do produto sozinho. Atributo cujo valor muda conforme o par pertence ao <strong>relacionamento</strong>, nunca à entidade.' },
    { t: 'Analisando somente o DER e o MR, a transformação do DER para o MR está correta.',
      ok: 1,
      why: 'Repare no recorte do item: ele pede para ignorar o cenário e comparar apenas desenho com tabelas. E aí a transformação está impecável — N:N virou tabela, as duas chaves formam a PK junto com a DATA, QTD entrou como atributo do relacionamento, e PRECO_CUSTO seguiu para PRODUTO exatamente como estava desenhado. O modelo está errado, mas a <em>tradução</em> está certa.' },
    { t: 'A cardinalidade entre FORNECEDOR e PRODUTO deveria ser 1:N, pois o fornecedor fornece o produto uma única vez em uma determinada data.',
      ok: 0,
      why: 'Confusão clássica entre cardinalidade e restrição de unicidade. O cenário diz que a maioria dos produtos tem <strong>mais de um fornecedor</strong>, e um fornecedor entrega vários produtos: isso é N:N e ponto. A regra "uma vez por dia" não muda a cardinalidade — ela é atendida pela DATA fazer parte da chave primária de FORNECE.' },
    { t: 'Deveria haver um atributo PRECO na entidade associativa FORNECE do DER para cumprir o cenário.',
      ok: 1,
      why: 'É a correção do erro do item I. Com o preço em FORNECE, cada fornecimento guarda o seu, e o histórico de preços existe. Com o preço em PRODUTO, o valor novo apaga o anterior.' }
  ],
  alts: ['I e III', 'I, II e III', 'II e IV', 'III e IV', 'II, III e IV'],
  c: 2,
  fecho: `<p>Esta questão é um exercício de <strong>leitura do recorte</strong>. Os itens I e II falam
  do mesmo DER e chegam a vereditos opostos — e os dois estão certos, porque perguntam coisas
  diferentes: I pergunta se o modelo <em>atende ao cenário</em> (não atende), II pergunta se as
  tabelas <em>correspondem ao desenho</em> (correspondem).</p>
  <p>Sempre que um item começar com "analisando somente…", ele está mandando você fechar os olhos
  para o resto.</p>`
},

/* ═══════════════════════════════════ 2 — PEDIDOS E ITENS (professor) ══ */
{
  id: 'p02',
  origem: 'professor',
  m: 14,
  pontos: 2,
  t: 'Cliente, Pedido e Item',
  cenario: `<p>Temos as seguintes tabelas, criadas a partir de um Modelo Relacional. Analise as
    chaves e os relacionamentos que elas implicam.</p>`,
  mr: `CLIENTE     (<u>COD_CLIENTE</u>, NOME, CPF, RG, COD_CIDADE)
CIDADE      (<u>COD_CIDADE</u>, DESCRICAO)
PRODUTO     (<u>COD_PROD</u>, DESCRICAO, VALOR, UNIDADE)
PEDIDO      (<u>COD_PEDIDO</u>, DATA_PEDIDO, COD_CLIENTE)
ITEM_PEDIDO (<u>COD_PEDIDO</u>, <u>COD_PROD</u>, VALOR, QUANTIDADE, SUB_TOTAL)`,
  mrTitulo: 'As tabelas do Modelo Relacional',
  itens: [
    { t: 'Entre as tabelas CLIENTE e CIDADE há um relacionamento de cardinalidade 1:1.',
      ok: 0,
      why: '<code>COD_CIDADE</code> está em CLIENTE como FK e <strong>fora</strong> da chave primária. Isso é a assinatura de um <strong>1:N</strong>: cada cliente mora em uma cidade, e cada cidade tem muitos clientes. Para ser 1:1, a FK teria de ser única — e nada aqui garante isso.' },
    { t: 'Entre PEDIDO e ITEM_PEDIDO há cardinalidade 1:N, podendo um pedido ter vários produtos, inclusive produtos repetidos por pedido.',
      ok: 0,
      why: 'A primeira metade é verdadeira, a segunda derruba o item. A PK de ITEM_PEDIDO é o par <code>(COD_PEDIDO, COD_PROD)</code>, e chave primária não aceita duplicata: <strong>o mesmo produto não pode aparecer duas vezes no mesmo pedido</strong>. Para permitir repetição seria preciso um NR_ITEM na chave. Item meio certo é item errado.' },
    { t: 'Na tabela PRODUTO, quando o valor é atualizado o valor anterior é perdido. Para corrigir, deve-se colocar um atributo DATA na tabela produto.',
      ok: 1,
      why: 'O diagnóstico está certo: <code>VALOR</code> é uma coluna só, e o UPDATE apaga o preço antigo — o pedido de seis meses atrás passa a "custar" o preço de hoje. A correção é o aspecto temporal, com a data entrando na <strong>chave</strong> para permitir uma linha por período. <em>Atenção:</em> uma coluna DATA solta, fora da chave, não resolveria nada — continuaria havendo uma linha por produto.' },
    { t: 'Entre CLIENTE e PEDIDO há cardinalidade 1:1, tendo um cliente um único pedido.',
      ok: 0,
      why: 'Mesmo raciocínio do item I: <code>COD_CLIENTE</code> está em PEDIDO, fora da PK. Um cliente faz <strong>vários</strong> pedidos. Se fosse 1:1, o supermercado perderia o cliente na segunda compra.' }
  ],
  alts: ['I e III', 'I, II, III e IV', 'II e IV', 'Somente I', 'III e IV'],
  c: 4,
  problema: `<p><b class="tag">Atenção nesta questão</b> Pela análise item a item, <strong>apenas o
  item III se sustenta</strong> — I, II e IV são todos falsos. Mas não existe alternativa "Somente
  III" entre as cinco oferecidas.</p>
  <p>A alternativa marcada aqui como correta ("III e IV") é a única que contém o item verdadeiro,
  e é provavelmente a esperada no gabarito — mas ela carrega o item IV, que afirma um 1:1 que as
  tabelas contradizem. <strong>Vale perguntar ao professor.</strong> Se a prova trouxer uma questão
  assim, escolha a alternativa que contém o item que você tem certeza que é verdadeiro e descarte
  as que contêm itens claramente falsos — foi o que sobrou aqui.</p>`,
  fecho: `<p>O que essa questão realmente treina é <strong>ler chave primária</strong>. Três dos
  quatro itens se resolvem olhando o que está sublinhado:</p>
  <p>FK <em>fora</em> da PK → 1:N. FK <em>dentro</em> da PK → entidade fraca ou tabela de N:N. Duas
  FKs formando a PK → N:N, e nenhum par se repete.</p>`
},

/* ══════════════════════════════════ 3 — TABELA DE CLIENTES (professor) ══ */
{
  id: 'p03',
  origem: 'professor',
  m: 16,
  pontos: 2,
  t: 'A tabela CLIENTES',
  cenario: `<p>Baseado no quadro abaixo, temos o esquema com os seguintes dados. Analise em que
    forma normal a tabela se encontra.</p>`,
  tabela: {
    cab: ['CPF', 'NOME', 'ENDERECO', 'CIDADE', 'UF', 'TELEFONES'],
    linhas: [
      ['111.111.111-11', 'ANA', 'RUA MACIEIRA, 100', 'JUNDIAI', 'SP', '(11)1111-1111, (11)1111-1112'],
      ['222.222.222-22', 'PEDRO', 'AVENIDA DAS FLORES, 10', 'SÃO PAULO', 'SP', '(11)2222-2222, (11)2222-0222'],
      ['333.333.333-33', 'CRISTINA', 'RUA SÃO CAETANO, 43', 'CAMPINAS', 'SP', '(11)3333-3333'],
      ['444.444.444-44', 'MARIO', 'AVENIDA FIGUEIRA SOUZA, 4', 'JUNDIAI', 'SP', '(11)98888-8888, (11)4444-4444'],
      ['555.555.555-55', 'MARIA', 'TRAVESSA IPANEMA, 222', 'RIO DE JANEIRO', 'RJ', '(21)5555-5555']
    ]
  },
  tabelaTitulo: 'CLIENTES',
  itens: [
    { t: 'Podemos considerar que a tabela CLIENTES está na 1FN.',
      ok: 0,
      why: 'A coluna <code>TELEFONES</code> guarda dois números na mesma célula, separados por vírgula. Campo não atômico é a definição de violação da <strong>1FN</strong>. Basta olhar a linha da ANA para reprovar a tabela.' },
    { t: 'Podemos considerar que a tabela CLIENTES está na 2FN.',
      ok: 0,
      why: 'As formas normais são degraus, e não se pula degrau: nada pode estar na 2FN sem antes estar na 1FN. Como a 1FN já falhou no telefone, a 2FN falha por consequência.' },
    { t: 'Podemos considerar que a tabela CLIENTES está na 3FN.',
      ok: 0,
      why: 'Falha pelo mesmo motivo em cadeia — e falharia de novo por conta própria: <code>UF</code> depende de <code>CIDADE</code>, que não é chave. Chave → CIDADE → UF é uma <strong>dependência transitiva</strong>, exatamente o que a 3FN proíbe.' },
    { t: 'O campo CPF NÃO DEVERIA ser a chave primária da tabela, pois é um dado que não pode representar a tabela CLIENTES.',
      ok: 0,
      why: 'O CPF é único, obrigatório e não muda: é uma <strong>chave natural legítima</strong>, e serve bem de PK. Há bons argumentos para preferir uma chave artificial — o CPF é grande para viajar como FK, e há discussão sobre guardar dado pessoal como identificador —, mas isso é preferência de projeto, não impedimento. O item afirma que "não pode", e pode.' }
  ],
  alts: ['Somente III', 'II e IV', 'Todos os itens estão incorretos', 'Somente II', 'Somente I'],
  c: 2,
  fecho: `<p>Questão de "pega tudo": a tabela não está em nenhuma forma normal, e o único item que
  parecia salvar-se (o do CPF) também é falso.</p>
  <p>Como ficaria depois de normalizar até a 3FN:</p>
  <div class="pre">CLIENTE  (<u>CPF</u>, NOME, ENDERECO, COD_CIDADE fk)
CIDADE   (<u>COD_CIDADE</u>, NOME_CIDADE, UF)
TELEFONE (<u>CPF</u> fk, <u>NUMERO</u>)</div>
  <p>O telefone saiu para uma tabela (1FN), e a cidade saiu levando a UF junto (3FN). Repare que
  JUNDIAI aparecia duas vezes na tabela original — se alguém corrigisse a grafia em uma linha só,
  o banco passaria a ter duas cidades diferentes com o mesmo nome.</p>`
},

/* ═══════════════════════════════════════ 4 — BANCO E CONTAS (professor) ══ */
{
  id: 'p04',
  origem: 'professor',
  m: 14,
  pontos: 2,
  t: 'Fundos Valor Certo S/A',
  cenario: `
    <p><strong>VIVIANA RODRIGUES</strong> é DBA da empresa <strong>FUNDOS DE INVESTIMENTOS
    MONETÁRIOS VALOR CERTO S/A</strong>, um banco que vai expandir suas unidades para a América do
    Sul e está implantando um novo sistema.</p>
    <p>O banco terá <strong>várias agências</strong>, e cada agência tem suas <strong>diversas
    contas</strong>. Inicialmente serão oferecidas <strong>conta corrente e conta poupança</strong>,
    mas outros tipos poderão surgir no futuro. <strong>Um cliente pode ter diversas contas</strong>,
    inclusive mais de uma conta corrente ou mais de uma poupança.</p>`,
  svg: 'provaBanco',
  artefatoTitulo: 'O MER que Viviana desenhou',
  mr: `BANCO    (<u>NR_BANCO</u>, NOME_BANCO)
AGENCIA  (<u>NR_AGENCIA</u>, DESC_AGENCIA, NR_BANCO)
CONTA    (<u>NR_CONTA</u>, NR_AGENCIA, CPF)
CLIENTE  (<u>CPF</u>, NOME, NR_CONTA)
CORRENTE (<u>NR_CONTA</u>, LIMITE_CREDITO)
POUPANCA (<u>NR_CONTA</u>, DATA_BASE)`,
  mrTitulo: 'A transformação para o Modelo Relacional',
  itens: [
    { t: 'As tabelas BANCO, AGENCIA e CONTA estão corretas (transformação do DER em MR).',
      ok: 1,
      why: 'As três seguem a regra do 1:N à risca. <code>NR_BANCO</code> desceu para AGENCIA, <code>NR_AGENCIA</code> desceu para CONTA, e <code>CPF</code> desceu para CONTA — porque é a conta que pertence a um cliente, e um cliente tem várias contas. Todas as FKs no lado N, todas fora da PK.' },
    { t: 'As tabelas CLIENTE, CORRENTE e POUPANCA estão corretas (transformação do DER em MR).',
      ok: 0,
      why: 'CORRENTE e POUPANCA estão certas — especialização vira tabela com a chave do geral como PK e FK. Quem derruba o item é <strong>CLIENTE, com <code>NR_CONTA</code> dentro</strong>. Essa coluna não deveria existir: o vínculo já está em CONTA.CPF, e repetido aqui ele limita o cliente a uma única conta, contrariando o cenário. Basta uma tabela errada para o item cair.' },
    { t: 'Analisando somente a tabela CLIENTE do Modelo Relacional, podemos afirmar que um cliente possui uma única conta.',
      ok: 1,
      why: 'Verdadeiro — e é a consequência do erro do item II. Uma coluna comporta um valor por linha; com <code>NR_CONTA</code> em CLIENTE, cada cliente cabe uma conta só. O item não pergunta se está certo, pergunta o que a tabela <em>diz</em>. E ela diz isso.' },
    { t: 'A tabela BANCO também poderia ser: BANCO (NR_BANCO, NOME_BANCO, NR_AGENCIA).',
      ok: 0,
      why: 'Isso inverteria o relacionamento. Pôr <code>NR_AGENCIA</code> em BANCO é colocar a FK no lado <strong>1</strong>, e cada banco passaria a ter uma agência só — justamente o oposto do cenário. No 1:N a chave sempre desce do lado 1 para o lado N, nunca sobe.' }
  ],
  alts: ['I e II', 'I, II, III e IV', 'III e IV', 'I e III', 'II, III e IV'],
  c: 3,
  fecho: `<p>Os itens II e III são <strong>o mesmo defeito visto de dois ângulos</strong>: II diz que
  a tabela está errada (está), III diz o que ela significa como foi escrita (um cliente, uma conta).
  Os dois podem ser verdadeiros ao mesmo tempo porque um julga o modelo e o outro apenas o lê.</p>
  <p>O jeito rápido de resolver questões assim é percorrer cada FK perguntando <em>de que lado ela
  está?</em> Aqui, três estão certas e uma está sobrando.</p>`
},

/* ══════════════════════════════════════ 5 — RH E DEPENDENTES (professor) ══ */
{
  id: 'p05',
  origem: 'professor',
  m: 11,
  pontos: 2,
  t: 'Corp Sales Big Equipments',
  cenario: `
    <p><strong>JOHNNY RIBEIRO</strong> é analista de banco de dados da <strong>CORP SALES BIG
    EQUIPMENTS LTDA</strong> e está modelando um sistema de Recursos Humanos.</p>
    <p>É preciso cadastrar <strong>funcionários</strong> (código e nome) e seus
    <strong>dependentes</strong> (nome do dependente e data de nascimento). Os dependentes podem ser
    somente esposo ou esposa e filhos.</p>
    <p>Tanto o funcionário quanto os dependentes podem precisar estar cadastrados para ter o
    <strong>convênio médico</strong>. A empresa mantém <strong>2 empresas que prestam esse
    serviço</strong>, e há diferença no valor do convênio, por ter mais ou menos cobertura.</p>`,
  svg: 'provaRH',
  artefatoTitulo: 'O DER que Johnny desenhou',
  mr: `FUNCIONARIO     (<u>COD_FUNC</u>, NOME)
DEPENDENTE      (<u>COD_FUNC</u>, <u>NOME</u>, DATA_NASCIMENTO)
CONVENIO_MEDICO (<u>COD_CONVENIO</u>, NOME_CONVENIO, VALOR)`,
  mrTitulo: 'O Modelo Relacional que Johnny criou',
  itens: [
    { t: 'No desenho do DER, todas as entidades com seus devidos atributos e relacionamento estão corretas de acordo com o cenário.',
      ok: 0,
      why: 'O relacionamento entre FUNCIONARIO e CONVENIO_MEDICO está desenhado como <strong>1:1</strong>, e não pode ser: existem apenas 2 convênios para todos os funcionários, então é <strong>N:1</strong> (muitos funcionários para um convênio). Além disso, a ligação do DEPENDENTE com o convênio não aparece no Modelo Relacional.' },
    { t: 'Analisando somente as entidades e tabelas FUNCIONARIO e DEPENDENTE, o DER e o MR estão de acordo com o cenário.',
      ok: 1,
      why: 'Recortando só essas duas, está tudo certo. FUNCIONARIO tem código e nome, como o cenário pediu. DEPENDENTE é <strong>entidade fraca</strong>, desenhada em retângulo duplo, e o mapeamento trouxe <code>COD_FUNC</code> para <strong>dentro</strong> da chave, junto com o nome — que é como uma fraca se resolve. A restrição "só esposo, esposa e filhos" é regra de negócio, e não muda a estrutura.' },
    { t: 'O atributo VALOR na tabela CONVENIO_MEDICO está incorreto, pois deveria estar em FUNCIONARIO, por ser o valor cobrado do funcionário.',
      ok: 0,
      why: 'Ao contrário: o cenário diz que <strong>o valor é do convênio</strong> — "há diferença no valor do convênio, por ter mais ou menos cobertura". Ele depende do plano, não da pessoa. Mover para FUNCIONARIO repetiria o mesmo valor em centenas de linhas, e mudar o preço do plano viraria uma atualização em massa: exatamente a anomalia que a 3FN evita.' },
    { t: 'A entidade DEPENDENTE é considerada fraca, pois sem FUNCIONARIO não há como ter dependentes.',
      ok: 1,
      why: 'É a definição. O dependente não tem identificador próprio: "João, filho" só é identificável dentro de um funcionário específico. Por isso o retângulo duplo no DER e a chave do funcionário dentro da PK no relacional.' }
  ],
  alts: ['Somente IV', 'II e IV', 'I e III', 'I, II e III', 'III e IV'],
  c: 1,
  fecho: `<p>O item III é a armadilha da questão, e ela funciona porque a frase soa razoável — o
  funcionário paga mesmo o convênio. Mas <strong>quem paga não é dono do dado</strong>: o valor
  descreve o plano, e o plano é o mesmo para todo mundo que o assina.</p>
  <p>Teste que resolve esse tipo de item em cinco segundos: <em>se eu apagar todos os funcionários,
  esse dado ainda existe?</em> O valor do convênio continua existindo. Logo, ele é do convênio.</p>`
},

/* ═════════════════════════════════════════════ 6 — BIBLIOTECA (autoral) ══ */
{
  id: 'p06',
  origem: 'autoral',
  m: 14,
  pontos: 2,
  t: 'Biblioteca Municipal',
  cenario: `
    <p><strong>RENATO ALVES</strong> está modelando o sistema da <strong>BIBLIOTECA MUNICIPAL DE
    VÁRZEA ALTA</strong>.</p>
    <p>Cada <strong>leitor</strong> tem matrícula, nome e e-mail. Cada <strong>exemplar</strong> tem
    um número de tombo e pertence a um <strong>título</strong> (ISBN, nome da obra, autor). O mesmo
    título pode ter <strong>vários exemplares</strong> na estante.</p>
    <p>Um leitor pega exemplares <strong>emprestados várias vezes ao longo do tempo</strong>,
    inclusive o mesmo exemplar em datas diferentes. De cada empréstimo registra-se a
    <strong>data de retirada</strong> e a <strong>data de devolução</strong>.</p>`,
  mr: `LEITOR     (<u>MATRICULA</u>, NOME, EMAIL)
TITULO     (<u>ISBN</u>, NOME_OBRA, AUTOR)
EXEMPLAR   (<u>TOMBO</u>, ISBN, ESTADO)
EMPRESTIMO (<u>MATRICULA</u>, <u>TOMBO</u>, DATA_RETIRADA, DATA_DEVOLUCAO)`,
  mrTitulo: 'O Modelo Relacional proposto por Renato',
  itens: [
    { t: 'A tabela EXEMPLAR está correta: um título tem vários exemplares e cada exemplar pertence a um título.',
      ok: 1,
      why: 'Relacionamento 1:N resolvido do jeito certo — <code>ISBN</code> desceu do lado 1 (TITULO) para o lado N (EXEMPLAR) e ficou fora da PK, porque o tombo já identifica o exemplar sozinho.' },
    { t: 'A tabela EMPRESTIMO atende ao cenário, permitindo que o mesmo leitor pegue o mesmo exemplar em datas diferentes.',
      ok: 0,
      why: 'Não atende. A PK é o par <code>(MATRICULA, TOMBO)</code>, então esse par só pode existir uma vez: na segunda vez que o leitor pegar o mesmo livro, o empréstimo anterior seria sobrescrito. Como o cenário fala em "várias vezes ao longo do tempo", a <strong>DATA_RETIRADA precisa entrar na chave</strong>.' },
    { t: 'O atributo DATA_DEVOLUCAO deveria estar na tabela EXEMPLAR, pois é o exemplar que é devolvido.',
      ok: 0,
      why: 'O que é devolvido é o exemplar, mas a <em>data</em> pertence ao empréstimo: o mesmo exemplar tem uma data de devolução diferente a cada vez que sai. Valor que muda conforme o par fica no relacionamento. Em EXEMPLAR, só caberia a última — e o histórico morreria.' },
    { t: 'Se a biblioteca passasse a registrar apenas o empréstimo mais recente de cada leitor para cada exemplar, a tabela EMPRESTIMO como está seria suficiente.',
      ok: 1,
      why: 'Verdadeiro, e é o outro lado do item II. A chave <code>(MATRICULA, TOMBO)</code> guarda exatamente uma linha por par — que é o suficiente se o requisito for só "o último". O modelo não está errado no vácuo: <strong>ele está errado para o cenário descrito</strong>.' }
  ],
  alts: ['I e II', 'I e IV', 'II e III', 'I, II e IV', 'Somente I'],
  c: 1,
  fecho: `<p>Os itens II e IV testam a mesma chave por ângulos opostos, e é por isso que valem a
  questão: um requisito diferente torna o mesmo modelo certo ou errado.</p>
  <p>Guarde o gatilho: <strong>"várias vezes", "ao longo do tempo", "histórico" e "pode repetir"
  mandam a data para dentro da chave</strong>.</p>`
},

/* ══════════════════════════════════════════════ 7 — CLÍNICA (autoral) ══ */
{
  id: 'p07',
  origem: 'autoral',
  m: 16,
  pontos: 2,
  t: 'Clínica São Judas',
  cenario: `<p><strong>PATRÍCIA LEMOS</strong> recebeu a planilha que a <strong>CLÍNICA SÃO
    JUDAS</strong> usa hoje para controlar consultas, e precisa normalizá-la até a 3FN.</p>`,
  tabela: {
    cab: ['CRM', 'MEDICO', 'ESPECIALIDADES', 'CPF_PAC', 'PACIENTE', 'CONVENIO', 'VALOR_CONV', 'DATA'],
    linhas: [
      ['12345', 'DR. SOUZA', 'CARDIOLOGIA, CLÍNICA GERAL', '111.111.111-11', 'ANA', 'SAÚDE MAIS', '180,00', '02/09/2026'],
      ['12345', 'DR. SOUZA', 'CARDIOLOGIA, CLÍNICA GERAL', '222.222.222-22', 'PEDRO', 'VIDA PLENA', '240,00', '02/09/2026'],
      ['67890', 'DRA. LIMA', 'PEDIATRIA', '333.333.333-33', 'CRISTINA', 'SAÚDE MAIS', '180,00', '03/09/2026'],
      ['67890', 'DRA. LIMA', 'PEDIATRIA', '111.111.111-11', 'ANA', 'SAÚDE MAIS', '180,00', '05/09/2026']
    ]
  },
  tabelaTitulo: 'CONSULTAS',
  itens: [
    { t: 'A tabela viola a 1FN por causa da coluna ESPECIALIDADES.',
      ok: 1,
      why: 'Duas especialidades na mesma célula, separadas por vírgula. Campo não atômico viola a 1FN, e o preço é prático: buscar "quem é cardiologista" vira caça a pedaço de texto, sem índice e com risco de confundir CARDIOLOGIA com CARDIOLOGIA PEDIÁTRICA.' },
    { t: 'Considerando a chave (CRM, CPF_PAC, DATA), o nome do médico caracteriza uma dependência parcial, violando a 2FN.',
      ok: 1,
      why: '<code>MEDICO</code> depende só do <code>CRM</code> — uma parte da chave composta, não a chave inteira. É a definição de dependência parcial, e por isso o nome sai para uma tabela MEDICO. O mesmo vale para PACIENTE, que depende só do CPF.' },
    { t: 'VALOR_CONV depende do CONVENIO, e não da chave, caracterizando dependência transitiva e violação da 3FN.',
      ok: 1,
      why: 'Exato: chave → CONVENIO → VALOR_CONV. Repare no efeito na planilha — SAÚDE MAIS aparece três vezes com 180,00, e um reajuste exigiria três alterações, com uma delas fatalmente esquecida.' },
    { t: 'Como a tabela viola a 1FN, não faz sentido analisar 2FN e 3FN antes de corrigi-la.',
      ok: 1,
      why: 'Verdadeiro, e é a ordem que a disciplina cobra: as formas normais são degraus e cada uma pressupõe a anterior. Analisar dependência parcial numa tabela cuja chave ainda nem está bem definida é o caminho mais rápido para normalizar errado. Note que isso <em>não</em> invalida os itens II e III — eles descrevem corretamente os problemas que você vai encontrar assim que a 1FN estiver aplicada.' }
  ],
  alts: ['I e II', 'I, II e III', 'II, III e IV', 'I, II, III e IV', 'Somente I'],
  c: 3,
  fecho: `<p>Quatro itens verdadeiros — a questão pune quem procura pegadinha onde não há. O modelo
  ao fim da normalização:</p>
  <div class="pre">MEDICO         (<u>CRM</u>, NOME)
ESPECIALIDADE  (<u>CRM</u> fk, <u>ESPECIALIDADE</u>)
CONVENIO       (<u>COD_CONV</u>, NOME_CONV, VALOR)
PACIENTE       (<u>CPF</u>, NOME, COD_CONV fk)
CONSULTA       (<u>CRM</u> fk, <u>CPF</u> fk, <u>DATA</u>)</div>
  <p>Note que a ANA aparece duas vezes na planilha, com dois médicos e datas diferentes — é o que
  obriga a DATA a entrar na chave de CONSULTA.</p>`
},

/* ═══════════════════════════════════════ 8 — TRANSPORTADORA (autoral) ══ */
{
  id: 'p08',
  origem: 'autoral',
  m: 10,
  pontos: 2,
  t: 'Transportadora Rota Norte',
  cenario: `
    <p><strong>CARLOS MENDES</strong> modela o sistema da <strong>TRANSPORTADORA ROTA
    NORTE</strong>.</p>
    <p>Cada <strong>motorista</strong> tem matrícula e nome, e <strong>pode ser supervisionado por
    outro motorista</strong> mais experiente. Um supervisor acompanha vários motoristas; cada
    motorista tem no máximo um supervisor.</p>
    <p>As <strong>rotas</strong> têm código e descrição. Um motorista <strong>percorre várias rotas
    e a mesma rota é percorrida por vários motoristas</strong>, em datas diferentes. De cada viagem
    registra-se a data e a quilometragem rodada.</p>`,
  mr: `MOTORISTA (<u>MATRICULA</u>, NOME, MAT_SUPERVISOR)
ROTA      (<u>COD_ROTA</u>, DESCRICAO)
VIAGEM    (<u>MATRICULA</u>, <u>COD_ROTA</u>, <u>DATA</u>, KM_RODADO)`,
  mrTitulo: 'O Modelo Relacional de Carlos',
  itens: [
    { t: 'A supervisão entre motoristas é um auto-relacionamento de grau 1 e cardinalidade 1:N.',
      ok: 1,
      why: 'Grau 1 porque liga uma entidade só a ela mesma; 1:N porque um supervisor tem vários supervisionados e cada motorista tem no máximo um supervisor. Grau e cardinalidade são eixos independentes, e a questão testa se você não confunde os dois.' },
    { t: 'Por ser um auto-relacionamento, a supervisão obrigatoriamente gera uma tabela própria.',
      ok: 0,
      why: 'Falso, e é o erro mais comum com auto-relacionamento. Quem manda é a <strong>cardinalidade</strong>, não o grau: sendo 1:N, a FK entra na própria tabela — <code>MAT_SUPERVISOR</code> apontando para MOTORISTA. Tabela só nasceria se a supervisão fosse N:N.' },
    { t: 'A tabela VIAGEM está correta e permite que o mesmo motorista percorra a mesma rota em datas diferentes.',
      ok: 1,
      why: 'Correta. A PK tripla <code>(MATRICULA, COD_ROTA, DATA)</code> resolve o N:N entre motorista e rota e ainda acomoda a repetição ao longo do tempo — cada dia é uma linha nova.' },
    { t: 'O atributo MAT_SUPERVISOR deve fazer parte da chave primária de MOTORISTA.',
      ok: 0,
      why: 'Não. A matrícula já identifica o motorista sozinha; o supervisor é informação, não identidade. FK entra na PK apenas em entidade fraca, em tabela de N:N e em especialização. Além disso, o motorista de topo não tem supervisor — e PK não aceita nulo.' }
  ],
  alts: ['I e III', 'II e IV', 'I, II e III', 'III e IV', 'Somente I'],
  c: 0,
  fecho: `<p>A questão inteira gira em torno de uma frase: <strong>o grau não decide o mapeamento, a
  cardinalidade decide</strong>. Auto-relacionamento 1:N vira coluna na própria tabela;
  auto-relacionamento N:N vira tabela com duas FKs para a mesma origem, e nomes diferentes.</p>`
},

/* ═══════════════════════════════════════════ 9 — ESCOLA (autoral) ══ */
{
  id: 'p09',
  origem: 'autoral',
  m: 11,
  pontos: 2,
  t: 'Escola de Música Clave',
  cenario: `
    <p><strong>BEATRIZ NUNES</strong> modela a <strong>ESCOLA DE MÚSICA CLAVE</strong>.</p>
    <p>Cada <strong>curso</strong> tem código e nome. Um curso é dividido em <strong>módulos</strong>,
    numerados de 1 em diante <strong>dentro de cada curso</strong> — existe o módulo 1 de Violão e o
    módulo 1 de Piano, e são coisas diferentes. Cada módulo tem um título e uma carga horária.</p>
    <p>Os <strong>professores</strong> têm código e nome. Alguns professores são também
    <strong>coordenadores</strong>, e só esses têm gratificação de coordenação.</p>`,
  mr: `CURSO        (<u>COD_CURSO</u>, NOME)
MODULO       (<u>COD_CURSO</u>, <u>NR_MODULO</u>, TITULO, CARGA_HORARIA)
PROFESSOR    (<u>COD_PROF</u>, NOME)
COORDENADOR  (<u>COD_PROF</u>, GRATIFICACAO)`,
  mrTitulo: 'O Modelo Relacional de Beatriz',
  itens: [
    { t: 'MODULO é uma entidade fraca, e por isso a chave do curso entra na sua chave primária.',
      ok: 1,
      why: 'É o caso-escola da entidade fraca: o módulo não se identifica sozinho — "módulo 1" só faz sentido dentro de um curso. A PK composta <code>(COD_CURSO, NR_MODULO)</code> é a tradução exata do retângulo duplo do DER.' },
    { t: 'COORDENADOR é uma especialização de PROFESSOR, e COD_PROF é ao mesmo tempo chave primária e chave estrangeira dessa tabela.',
      ok: 1,
      why: 'Correto nas duas partes. Só alguns professores coordenam e só eles têm gratificação — atributo que vale para parte das ocorrências pede especialização. E a tabela da especialização reaproveita a chave do geral, que vira PK e FK ao mesmo tempo.' },
    { t: 'Se a numeração dos módulos fosse única em toda a escola, MODULO deixaria de ser entidade fraca.',
      ok: 1,
      why: 'Verdadeiro, e é o teste que separa fraca de 1:N comum. Com numeração global, <code>NR_MODULO</code> identificaria o módulo sozinho, o curso viraria uma FK fora da chave e a entidade passaria a ser normal. <strong>O que decide não é a importância, é a identidade.</strong>' },
    { t: 'A tabela COORDENADOR poderia ser eliminada colocando a gratificação em PROFESSOR, sem nenhuma consequência.',
      ok: 0,
      why: '"Sem nenhuma consequência" derruba o item. É uma alternativa válida — a forma de tabela única —, mas tem preço: a coluna fica <strong>nula na maioria das linhas</strong> e some a informação de quem é coordenador (a menos que se acrescente uma coluna de tipo). Trocar uma forma por outra é decisão de projeto, não operação neutra.' }
  ],
  alts: ['I e II', 'I, II e III', 'II, III e IV', 'I e IV', 'Todos os itens estão corretos'],
  c: 1,
  fecho: `<p>Cuidado com itens que trazem absolutos: <strong>"sem nenhuma consequência", "sempre",
  "obrigatoriamente", "nunca"</strong>. Em modelagem quase tudo é troca, e um item que nega a troca
  costuma ser o falso da questão.</p>`
},

/* ══════════════════════════════════════════════ 10 — HOTEL (autoral) ══ */
{
  id: 'p10',
  origem: 'autoral',
  m: 15,
  pontos: 2,
  t: 'Pousada Alto da Serra',
  cenario: `
    <p><strong>DIEGO FARIAS</strong> modela a <strong>POUSADA ALTO DA SERRA</strong>.</p>
    <p>Cada <strong>quarto</strong> tem número, tipo (standard, luxo) e uma <strong>diária</strong>.
    A diária <strong>muda ao longo do ano</strong>: alta temporada, baixa temporada e feriados têm
    preços diferentes, e a pousada precisa saber por quanto o quarto foi vendido em cada
    <strong>hospedagem passada</strong>, para conferir o faturamento.</p>
    <p>Cada <strong>hóspede</strong> tem CPF e nome, e pode se hospedar <strong>várias vezes</strong>,
    inclusive no mesmo quarto.</p>`,
  mr: `QUARTO    (<u>NR_QUARTO</u>, TIPO, VALOR_DIARIA)
HOSPEDE   (<u>CPF</u>, NOME)
HOSPEDAGEM (<u>CPF</u>, <u>NR_QUARTO</u>, DATA_ENTRADA, DATA_SAIDA)`,
  mrTitulo: 'O Modelo Relacional de Diego',
  itens: [
    { t: 'A tabela QUARTO, como está, não permite saber por quanto o quarto foi vendido numa hospedagem do ano passado.',
      ok: 1,
      why: 'Verdadeiro. <code>VALOR_DIARIA</code> é uma coluna única: o valor de hoje sobrescreveu o de ontem. Uma consulta de faturamento do ano passado devolveria o preço atual multiplicado pelas diárias — número errado, e com cara de certo.' },
    { t: 'Basta acrescentar uma coluna DATA em QUARTO para resolver o histórico de preços.',
      ok: 0,
      why: 'Não basta. A chave continua sendo <code>NR_QUARTO</code>, então continua havendo <strong>uma linha por quarto</strong>: a DATA só diria desde quando vale o preço atual. Para ter histórico, ou a data entra na chave — <code>HISTORICO_DIARIA(NR_QUARTO, DATA_INICIO, VALOR)</code> —, ou o valor praticado é gravado na própria hospedagem.' },
    { t: 'A tabela HOSPEDAGEM não atende ao cenário, pois impede que o mesmo hóspede volte ao mesmo quarto.',
      ok: 1,
      why: 'A PK é o par <code>(CPF, NR_QUARTO)</code>, e par não se repete. Como o cenário diz que o hóspede pode voltar "inclusive no mesmo quarto", a <code>DATA_ENTRADA</code> precisa entrar na chave.' },
    { t: 'Gravar o valor cobrado dentro da HOSPEDAGEM seria redundância desnecessária, já que o valor já está em QUARTO.',
      ok: 0,
      why: 'Falso — e essa é a distinção fina da questão. O valor em QUARTO é <em>o preço de tabela hoje</em>; o valor em HOSPEDAGEM é <em>o preço efetivamente cobrado naquela estadia</em>. São fatos diferentes, e por isso não é redundância: é justamente o que preserva o faturamento histórico quando a tabela de preços mudar.' }
  ],
  alts: ['I e III', 'I, II e III', 'II e IV', 'III e IV', 'I, III e IV'],
  c: 0,
  fecho: `<p>Esta questão junta os dois temas que mais caem juntos: <strong>aspecto temporal</strong>
  e <strong>o que é redundância de verdade</strong>.</p>
  <p>Nem todo dado repetido é redundante. Repetir o <em>mesmo fato</em> em dois lugares é redundância
  (e dá anomalia de atualização). Guardar o <em>valor histórico</em> ao lado do valor vigente são
  dois fatos distintos — e apagar um deles é perder informação, não economizar espaço.</p>`
}

];
