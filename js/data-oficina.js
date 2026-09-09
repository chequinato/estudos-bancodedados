/* =========================================================================
   OFICINA — casos guiados: enunciado → MER → DER → MR → Formas Normais

   Tipos de passo
   pick    escolha múltipla de itens · items[{t, ok, why}]
   assign  uma decisão por linha    · opts[] + rows[{t, a, why}]
   reveal  faça no papel e confira  · model (HTML) + check[] + img/svg
   ========================================================================= */

const OFICINA = [

/* ═══════════════════════════════════════════════════ CASO 1 — LOCADORA ══ */
{
  id: 'of-locadora',
  n: 1,
  t: 'Locadora Rota 9',
  nivel: 'Completo — do enunciado à 3FN',
  tags: 'MER · DER · MR · FN',
  intro: 'O caso de treino mais completo. Você vai percorrer os sete passos do roteiro, montar o Modelo Relacional e ainda normalizar uma tabela de faturamento. Faça cada passo no papel antes de conferir.',
  enunciado: `
    <p>A <strong>Locadora Rota 9</strong> aluga veículos e quer informatizar o controle.</p>
    <p>Cada <strong>cliente</strong> é identificado por CPF e tem nome, endereço (rua, número, cidade)
    e pode cadastrar <strong>vários telefones</strong>.</p>
    <p>Cada <strong>veículo</strong> tem placa, modelo, ano e valor da diária, e pertence a uma
    <strong>categoria</strong> (código, descrição, valor base). Uma categoria agrupa vários veículos.</p>
    <p>Um cliente faz várias <strong>locações</strong>. Cada locação registra data de retirada,
    data de devolução prevista e envolve <strong>um único veículo</strong>.</p>
    <p>Os <strong>funcionários</strong> (matrícula, nome, cargo) atendem as locações — cada locação é
    atendida por um funcionário. Entre os funcionários há os <strong>vendedores</strong>, que possuem
    meta mensal e percentual de comissão. Um funcionário pode ser <strong>supervisionado</strong> por
    outro funcionário.</p>`,
  steps: [
    {
      k: 'pick',
      t: 'Passo 1 — Entidades',
      q: 'Marque os substantivos do enunciado que devem virar <strong>entidades</strong>. Cuidado: nem todo substantivo é entidade.',
      items: [
        { t: 'CLIENTE',      ok: 1, why: 'Tem existência própria, atributos e várias ocorrências.' },
        { t: 'VEICULO',      ok: 1, why: 'Placa, modelo, ano, diária — entidade fundamental.' },
        { t: 'CATEGORIA',    ok: 1, why: 'Tem código, descrição e valor base próprios, e agrupa vários veículos.' },
        { t: 'LOCACAO',      ok: 1, why: 'Tem atributos próprios (datas) e liga cliente, veículo e funcionário.' },
        { t: 'FUNCIONARIO',  ok: 1, why: 'Matrícula, nome, cargo — entidade fundamental.' },
        { t: 'VENDEDOR',     ok: 1, why: 'É uma especialização de FUNCIONARIO, com meta e comissão próprias. Continua sendo uma entidade no DER.' },
        { t: 'TELEFONE',     ok: 0, why: 'É um atributo multivalorado do cliente. Só vira tabela no mapeamento — no MER continua sendo atributo (elipse dupla).' },
        { t: 'ENDERECO',     ok: 0, why: 'É um atributo composto (rua, número, cidade), não uma entidade.' },
        { t: 'PLACA',        ok: 0, why: 'É o atributo identificador de VEICULO.' },
        { t: 'SUPERVISAO',   ok: 0, why: 'É um relacionamento (auto-relacionamento de FUNCIONARIO), não uma entidade.' }
      ]
    },
    {
      k: 'assign',
      t: 'Passo 2 — Atributos',
      q: 'Classifique cada atributo do enunciado.',
      opts: ['Simples', 'Composto', 'Multivalorado', 'Identificador'],
      rows: [
        { t: 'CLIENTE · CPF',            a: 3, why: 'Identifica unicamente o cliente — vira PK e aparece sublinhado no DER.' },
        { t: 'CLIENTE · endereço',       a: 1, why: 'Um único valor dividido em partes: rua, número, cidade. No relacional "achata-se" em colunas.' },
        { t: 'CLIENTE · telefone',       a: 2, why: 'Vários valores do mesmo tipo. Elipse dupla no DER, tabela nova no relacional.' },
        { t: 'VEICULO · modelo',         a: 0, why: 'Um valor só, sem subdivisão.' },
        { t: 'VEICULO · placa',          a: 3, why: 'É o identificador natural do veículo.' },
        { t: 'LOCACAO · data_retirada',  a: 0, why: 'Atributo simples da própria locação.' },
        { t: 'VENDEDOR · meta_mensal',   a: 0, why: 'Atributo simples — mas só existe na especialização, não em todo funcionário.' }
      ]
    },
    {
      k: 'assign',
      t: 'Passo 3 — Relacionamentos e cardinalidade',
      q: 'Para cada relacionamento, escolha a cardinalidade correta segundo o enunciado.',
      opts: ['1 : 1', '1 : N', 'N : N'],
      rows: [
        { t: 'CATEGORIA — agrupa — VEICULO',        a: 1, why: 'Uma categoria tem vários veículos; cada veículo pertence a uma só. A FK cod_categoria desce para VEICULO.' },
        { t: 'CLIENTE — faz — LOCACAO',             a: 1, why: 'Um cliente faz várias locações; cada locação é de um cliente. FK cpf em LOCACAO.' },
        { t: 'VEICULO — é alugado em — LOCACAO',    a: 1, why: 'O enunciado diz "um único veículo" por locação, mas o mesmo veículo é alugado muitas vezes ao longo do tempo. FK placa em LOCACAO.' },
        { t: 'FUNCIONARIO — atende — LOCACAO',      a: 1, why: 'Cada locação tem um funcionário; um funcionário atende várias. FK matricula em LOCACAO.' },
        { t: 'FUNCIONARIO — supervisiona — FUNCIONARIO', a: 1, why: 'Auto-relacionamento 1:N — um supervisor tem vários supervisionados, cada um tem um supervisor. Grau 1, cardinalidade 1:N.' }
      ]
    },
    {
      k: 'pick',
      t: 'Passo 4 — Casos especiais',
      q: 'Quais estruturas especiais aparecem neste enunciado? Esta varredura é o que separa nota 6 de nota 10.',
      items: [
        { t: 'Atributo multivalorado', ok: 1, why: 'O telefone do cliente. Elipse dupla no DER.' },
        { t: 'Especialização',         ok: 1, why: 'VENDEDOR é um FUNCIONARIO com atributos próprios. Triângulo no DER.' },
        { t: 'Auto-relacionamento',    ok: 1, why: 'A supervisão entre funcionários. Grau 1.' },
        { t: 'Atributo composto',      ok: 1, why: 'O endereço do cliente (rua, número, cidade).' },
        { t: 'Entidade fraca',         ok: 0, why: 'Não há nenhuma entidade que dependa de outra para ser identificada. LOCACAO tem identificador próprio.' },
        { t: 'Relacionamento N:N',     ok: 0, why: 'Todos os relacionamentos aqui são 1:N. Se uma locação pudesse ter vários veículos, aí sim.' },
        { t: 'Agregação',              ok: 0, why: 'Nenhum relacionamento precisa participar de outro relacionamento.' },
        { t: 'Relacionamento ternário',ok: 0, why: 'LOCACAO liga três entidades, mas como entidade própria com três relacionamentos binários — não como um único losango de grau 3.' }
      ]
    },
    {
      k: 'reveal',
      t: 'Passo 5 — Desenhe o DER',
      q: 'Agora desenhe no papel. Cinco retângulos, os losangos entre eles, as elipses dos atributos, o triângulo da especialização e o losango que volta para FUNCIONARIO. Só depois confira.',
      svg: 'derLocadora',
      check: [
        'CLIENTE, VEICULO, CATEGORIA, LOCACAO e FUNCIONARIO em retângulos',
        'CPF, PLACA, COD_CAT, NR_LOCACAO e MATRICULA sublinhados',
        'TELEFONE em elipse dupla no CLIENTE',
        'Triângulo entre FUNCIONARIO e VENDEDOR',
        'Losango SUPERVISIONA saindo e voltando para FUNCIONARIO, com 1 e N nas pontas',
        'Todas as cardinalidades escritas nas pontas dos losangos'
      ],
      model: '<p>Se algum item da lista acima ficou de fora, refaça o desenho antes de seguir — o passo 6 depende dele estar certo.</p>'
    },
    {
      k: 'assign',
      t: 'Passo 6 — Mapeamento para o Modelo Relacional',
      q: 'Aplique as regras: para cada item, diga o que acontece no relacional.',
      opts: ['Vira coluna na própria tabela', 'Vira FK no lado N', 'Vira tabela nova', 'Some (é derivado)'],
      rows: [
        { t: 'O atributo modelo de VEICULO',            a: 0, why: 'Atributo simples vira coluna. Nada de especial.' },
        { t: 'O relacionamento CATEGORIA 1—N VEICULO',  a: 1, why: 'Relacionamento 1:N não gera tabela: a chave do lado 1 desce como FK para o lado N. VEICULO recebe cod_cat.' },
        { t: 'O telefone multivalorado do CLIENTE',     a: 2, why: 'Multivalorado sempre vira tabela: CLIENTE_FONE(cpf, fone), com PK composta.' },
        { t: 'A especialização VENDEDOR',               a: 2, why: 'Forma 1: tabela do geral (FUNCIONARIO) + tabela da especialização VENDEDOR(matricula PK/FK, meta, comissao).' },
        { t: 'O endereço composto do CLIENTE',          a: 0, why: 'Composto "achata-se": rua, numero e cidade viram três colunas de CLIENTE.' },
        { t: 'O auto-relacionamento de supervisão',     a: 1, why: 'É um 1:N normal — a FK cod_supervisor entra em FUNCIONARIO apontando para a própria tabela.' }
      ]
    },
    {
      k: 'reveal',
      t: 'Passo 7 — Escreva o Modelo Relacional',
      q: 'Escreva todas as relações com PK e FK marcadas. Depois confira com o gabarito.',
      model: `<div class="pre">CLIENTE(CPF pk, NOME, RUA, NUMERO, CIDADE)
CLIENTE_FONE(CPF pk/fk, FONE pk)
CATEGORIA(COD_CAT pk, DESCRICAO, VALOR_BASE)
VEICULO(PLACA pk, MODELO, ANO, DIARIA, COD_CAT fk)
FUNCIONARIO(MATRICULA pk, NOME, CARGO, COD_SUPERVISOR fk → FUNCIONARIO)
VENDEDOR(MATRICULA pk/fk → FUNCIONARIO, META_MENSAL, COMISSAO)
LOCACAO(NR_LOCACAO pk, DATA_RETIRADA, DATA_DEVOLUCAO,
        CPF fk, PLACA fk, MATRICULA fk)</div>
        <p>Repare em três coisas: <code>CLIENTE_FONE</code> tem PK composta; <code>VENDEDOR.MATRICULA</code>
        é PK e FK ao mesmo tempo; e <code>COD_SUPERVISOR</code> aponta para a própria tabela
        <code>FUNCIONARIO</code> — a assinatura do auto-relacionamento.</p>`,
      check: [
        'Sete relações no total',
        'Nenhuma tabela criada para os relacionamentos 1:N',
        'CLIENTE_FONE com PK composta (CPF, FONE)',
        'VENDEDOR com MATRICULA como PK e FK ao mesmo tempo',
        'COD_SUPERVISOR referenciando a própria tabela FUNCIONARIO',
        'LOCACAO com as três FKs: CPF, PLACA e MATRICULA'
      ]
    },
    {
      k: 'pick',
      t: 'Passo 8 — Normalizar o relatório de faturamento',
      q: `A locadora emite este relatório, e alguém quer guardá-lo como uma tabela só:
          <div class="pre">FATURA(NR_FAT, DATA, CPF_CLI, NOME_CLI, CIDADE_CLI,
       ITEM, PLACA, MODELO, DIARIAS, VL_DIARIA, SUBTOTAL, TOTAL_FAT)</div>
          Quais problemas essa tabela tem?`,
      items: [
        { t: 'Grupo de repetição (os itens da fatura)',        ok: 1, why: 'Cada fatura tem vários itens. Isso viola a 1FN — os itens saem para ITENS_FATURA.' },
        { t: 'MODELO não depende da chave inteira',            ok: 1, why: 'Com a chave composta NR_FAT + ITEM, o modelo depende só da placa. Violação de 2FN.' },
        { t: 'NOME_CLI e CIDADE_CLI dependem de CPF_CLI',      ok: 1, why: 'Não-chave dependendo de outro não-chave: dependência transitiva. Violação de 3FN.' },
        { t: 'SUBTOTAL e TOTAL_FAT são calculados',            ok: 1, why: 'SUBTOTAL = DIARIAS × VL_DIARIA e TOTAL_FAT é a soma dos itens. Derivados armazenados saem na 3FN.' },
        { t: 'Falta uma chave primária',                       ok: 0, why: 'A chave existe e é composta: NR_FAT + ITEM. O problema não é ausência de chave.' },
        { t: 'DATA deveria virar uma entidade',                ok: 0, why: 'Data é um atributo simples da fatura. Só viraria entidade se precisássemos guardar histórico de mudanças dela.' }
      ]
    },
    {
      k: 'assign',
      t: 'Passo 9 — Qual forma normal resolve cada problema?',
      q: 'Ligue cada problema à forma normal que o corrige. A ordem importa: sempre 1 → 2 → 3.',
      opts: ['1FN', '2FN', '3FN'],
      rows: [
        { t: 'Os itens se repetem dentro da fatura',   a: 0, why: '1FN trata grupos de repetição. Separa-se ITENS_FATURA.' },
        { t: 'MODELO depende só de PLACA',             a: 1, why: '2FN: dependência parcial da chave composta NR_FAT + ITEM. VEICULO ganha tabela própria.' },
        { t: 'NOME_CLI depende de CPF_CLI',            a: 2, why: '3FN: dependência transitiva entre não-chaves. CLIENTE ganha tabela própria.' },
        { t: 'SUBTOTAL é calculável',                  a: 2, why: '3FN também manda fora os atributos derivados.' },
        { t: 'TOTAL_FAT é a soma dos itens',           a: 2, why: '3FN, mesmo motivo. Guardar totais é fonte clássica de inconsistência.' }
      ]
    },
    {
      k: 'reveal',
      t: 'Passo 10 — Escreva a 3FN',
      q: 'Escreva as tabelas finais, já normalizadas, com PK e FK. Este é o formato que a prova pede.',
      model: `<div class="pre">FATURA(NR_FAT pk, DATA, CPF_CLI fk)
ITENS_FATURA(NR_FAT pk/fk, ITEM pk, PLACA fk, DIARIAS, VL_DIARIA)
CLIENTE(CPF pk, NOME, CIDADE)
VEICULO(PLACA pk, MODELO)</div>
        <p>Quatro tabelas, um assunto em cada. <code>SUBTOTAL</code> e <code>TOTAL_FAT</code> não
        aparecem em lugar nenhum — são calculados na hora da consulta. E note que
        <code>VL_DIARIA</code> <em>ficou</em> em ITENS_FATURA de propósito: é o valor
        cobrado <strong>naquela</strong> locação, que pode diferir da diária atual do veículo.</p>`,
      check: [
        'Quatro tabelas: FATURA, ITENS_FATURA, CLIENTE, VEICULO',
        'ITENS_FATURA com PK composta NR_FAT + ITEM',
        'Nenhum campo calculado sobrou',
        'CLIENTE e VEICULO separados como assuntos próprios',
        'VL_DIARIA mantido no item, por ser o valor histórico daquela fatura'
      ]
    }
  ]
},

/* ═══════════════════════════════════════════ CASO 2 — ENGENHO ABC ══════ */
{
  id: 'of-engenho',
  n: 2,
  t: 'Engenho ABC',
  nivel: 'Da aula — enunciado em texto',
  tags: 'MER · DER · MR',
  intro: 'Exercício real do professor, com o DER original como gabarito. Traz especialização, atributo multivalorado e atributos pendurados no losango — três coisas de uma vez.',
  enunciado: `
    <p>Empresa de projetos civis dividida em <strong>departamentos</strong> (nr, descrição, localização).</p>
    <p><strong>Funcionários</strong> (CPF, nome, endereço, cargo, salário) são ligados a um departamento
    por um <strong>contrato</strong>, que tem data e número de dias.</p>
    <p>Entre os funcionários há <strong>engenheiros</strong>, com atributos extras: CREA e especialidade.</p>
    <p>Engenheiros <strong>gerenciam projetos</strong> a partir de uma data.</p>
    <p><strong>Projetos</strong> (código, título, descrição, localização geográfica, prazo, custo,
    complexidade) são <strong>solicitados por clientes</strong> (código, nome, endereço, fones).</p>`,
  steps: [
    {
      k: 'pick',
      t: 'Passo 1 — Entidades',
      q: 'Marque as entidades deste enunciado.',
      items: [
        { t: 'DEPARTAMENTO', ok: 1, why: 'Nr, descrição e localização próprios.' },
        { t: 'FUNCIONARIO',  ok: 1, why: 'Entidade fundamental do caso.' },
        { t: 'ENGENHEIRO',   ok: 1, why: 'Especialização de FUNCIONARIO, com CREA e especialidade.' },
        { t: 'PROJETO',      ok: 1, why: 'Sete atributos próprios.' },
        { t: 'CLIENTE',      ok: 1, why: 'Código, nome, endereço e fones.' },
        { t: 'CONTRATO',     ok: 0, why: 'É um relacionamento entre DEPARTAMENTO e FUNCIONARIO — um losango com os atributos DATA e NR_DIAS pendurados.' },
        { t: 'GERENCIAR',    ok: 0, why: 'Também é relacionamento, entre ENGENHEIRO e PROJETO, com o atributo DATA.' },
        { t: 'FONE',         ok: 0, why: 'Atributo multivalorado do cliente — elipse dupla.' }
      ]
    },
    {
      k: 'assign',
      t: 'Passo 2 — De quem é cada atributo?',
      q: 'Alguns atributos não pertencem a nenhuma entidade: pertencem ao relacionamento. Decida.',
      opts: ['Da entidade', 'Do relacionamento'],
      rows: [
        { t: 'SALARIO',            a: 0, why: 'É característica do funcionário.' },
        { t: 'DATA (do contrato)', a: 1, why: 'A data em que o funcionário foi contratado para aquele departamento — pertence ao losango CONTRATO.' },
        { t: 'NR_DIAS',            a: 1, why: 'Duração do contrato. Também é do relacionamento.' },
        { t: 'CREA',               a: 0, why: 'Característica do engenheiro.' },
        { t: 'DATA (do gerenciar)',a: 1, why: 'A data em que o engenheiro assumiu aquele projeto — pertence ao losango GERENCIAR.' },
        { t: 'COMPLEXIDADE',       a: 0, why: 'Característica do projeto.' }
      ]
    },
    {
      k: 'assign',
      t: 'Passo 3 — Cardinalidades',
      q: 'Segundo a resolução do professor, qual a cardinalidade de cada relacionamento?',
      opts: ['1 : 1', '1 : N', 'N : N'],
      rows: [
        { t: 'DEPARTAMENTO — CONTRATO — FUNCIONARIO', a: 1, why: 'Um departamento tem vários funcionários contratados; cada funcionário está ligado a um departamento.' },
        { t: 'CLIENTE — SOLICITAR — PROJETO',         a: 1, why: 'Um cliente solicita vários projetos; cada projeto é de um cliente. FK cod_cli em PROJETO.' },
        { t: 'ENGENHEIRO — GERENCIAR — PROJETO',      a: 1, why: 'Atenção: o professor tratou como N:1 (projeto N — 1 engenheiro), ou seja, ENGENHEIRO 1 — N PROJETO. Siga a resolução dele mesmo que você imaginasse N:N.' }
      ]
    },
    {
      k: 'reveal',
      t: 'Passo 4 — Confira com o DER do professor',
      q: 'Desenhe seu DER e compare com o original da aula.',
      img: 'caso3-engenho-abc-der.png',
      check: [
        'Triângulo entre FUNCIONARIO e ENGENHEIRO',
        'FONE em elipse dupla no CLIENTE',
        'DATA e NR_DIAS pendurados no losango CONTRATO',
        'DATA pendurada no losango GERENCIAR',
        'COD_DEPTO, CPF, COD_CLI e COD_PROJ sublinhados',
        'Cardinalidades 1 e N escritas nas pontas'
      ],
      model: '<p>Existe uma segunda versão deste mesmo exercício, de outra turma, em que <code>GERENCIA</code> recebeu <code>DATA_CONTRATACAO</code> e <code>QTDE_DIAS</code>. A estrutura é idêntica — o nome e os atributos do losango são escolha de quem modela. Veja as duas na aba <strong>DER</strong>.</p>'
    },
    {
      k: 'reveal',
      t: 'Passo 5 — Modelo Relacional',
      q: 'Escreva as relações finais. Preste atenção nas duas tabelas que nascem de estruturas especiais.',
      model: `<div class="pre">DEPARTAMENTO(COD_DEPTO pk, DESCRICAO, LOCALIZACAO)
FUNCIONARIO(CPF pk, NOME, ENDERECO, CARGO, SALARIO)
ENGENHEIRO(CPF pk/fk → FUNCIONARIO, CREA, ESPECIALIDADE)
CLIENTE(COD_CLI pk, NOME, ENDERECO)
CLIENTE_FONE(COD_CLI pk/fk, FONE pk)
PROJETO(COD_PROJ pk, TITULO, DESCRICAO, LOC_GEO,
        PRAZO_ENTREGA, CUSTO, COMPLEXIDADE, COD_CLI fk)
CONTRATO(COD_DEPTO fk, CPF fk, DATA, NR_DIAS)
GERENCIAR(COD_PROJ fk, CPF fk, DATA)</div>
        <p>As duas tabelas que nascem de estruturas especiais são <code>ENGENHEIRO</code>
        (especialização, com CPF herdado) e <code>CLIENTE_FONE</code> (multivalorado).
        <code>CONTRATO</code> e <code>GERENCIAR</code> existem porque carregam atributos próprios
        do relacionamento.</p>`,
      check: [
        'Oito relações',
        'ENGENHEIRO com CPF como PK e FK',
        'CLIENTE_FONE separado do CLIENTE',
        'PROJETO com COD_CLI como FK',
        'CONTRATO e GERENCIAR guardando os atributos dos relacionamentos'
      ]
    }
  ]
},

/* ═════════════════════════════════ CASO 3 — ENGENHARIA REVERSA ═════════ */
{
  id: 'of-reverso',
  n: 3,
  t: 'Empregado / Projeto',
  nivel: 'Da aula — engenharia reversa',
  tags: 'Tabelas → DER',
  intro: 'Aqui o caminho é o inverso: o enunciado já dá as tabelas e você reconstrói o diagrama. Metade dos exercícios da disciplina é assim.',
  enunciado: `
    <div class="pre">Empregado(Ident, Nome, Salario, Endereco, Sexo, DataNasc, DepNum, SuperIdent)
Departamento(Num, Nome, IdentGer)
Projeto(Num, Nome, Local, DepNum)
TrabalhaNo(IdentEmp, ProjNum, Horas)
Dependente(Nome, Sexo, DataNasc, Parentesco, IdentEmp)
DepLoc(DepNum, Local)</div>
    <p>Monte o DER a partir deste esquema, com as cardinalidades.</p>`,
  steps: [
    {
      k: 'assign',
      t: 'Passo 1 — Leia as pistas',
      q: 'Cada tabela deixa uma pista sobre a estrutura do DER. Qual pista é esta?',
      opts: ['Entidade normal', 'Entidade fraca', 'N:N resolvido', 'Auto-relacionamento', 'Multivalorado'],
      rows: [
        { t: 'Empregado · a coluna SuperIdent',   a: 3, why: 'FK apontando para a própria tabela Empregado. É a assinatura do auto-relacionamento de supervisão.' },
        { t: 'TrabalhaNo(IdentEmp, ProjNum, Horas)', a: 2, why: 'Tabela intermediária com duas FKs formando a PK, mais um atributo próprio. É um N:N resolvido — associativa atributiva.' },
        { t: 'Dependente(Nome, ..., IdentEmp)',   a: 1, why: 'Não se identifica sozinha: dois empregados podem ter um dependente "Pedro". A PK inclui IdentEmp. Retângulo duplo.' },
        { t: 'DepLoc(DepNum, Local)',             a: 4, why: 'Um departamento em vários locais — é o atributo multivalorado Local, já mapeado como tabela.' },
        { t: 'Projeto(Num, Nome, Local, DepNum)', a: 0, why: 'Entidade normal, com uma FK simples ligando ao departamento.' }
      ]
    },
    {
      k: 'assign',
      t: 'Passo 2 — Cardinalidades',
      q: 'Reconstrua as cardinalidades a partir de onde estão as FKs.',
      opts: ['1 : 1', '1 : N', 'N : N'],
      rows: [
        { t: 'Empregado — trabalha — Departamento', a: 1, why: 'N:1 — a FK DepNum está em Empregado, logo vários empregados por departamento.' },
        { t: 'Empregado — possui — Dependente',     a: 1, why: 'Um empregado tem vários dependentes.' },
        { t: 'Empregado — TrabalhaNo — Projeto',    a: 2, why: 'Tabela intermediária = N:N, com HORAS como atributo do relacionamento.' },
        { t: 'Empregado — supervisiona — Empregado',a: 1, why: 'Um supervisor tem vários supervisionados. Grau 1, cardinalidade 1:N.' },
        { t: 'Empregado — gerencia — Departamento', a: 0, why: '1:1 — a coluna IdentGer em Departamento aponta para um único gerente por departamento.' },
        { t: 'Departamento — tem — Projeto',        a: 1, why: 'A FK DepNum está em Projeto: um departamento, vários projetos.' }
      ]
    },
    {
      k: 'pick',
      t: 'Passo 3 — As sacadas do exercício',
      q: 'O que a correção procura neste diagrama?',
      items: [
        { t: 'DEPENDENTE em retângulo duplo',           ok: 1, why: 'Entidade fraca — a marca mais visível do exercício.' },
        { t: 'Losango voltando ao próprio EMPREGADO',   ok: 1, why: 'Auto-relacionamento vindo de SuperIdent.' },
        { t: 'TRABALHANO como N:N carregando HORAS',    ok: 1, why: 'O atributo pertence ao relacionamento, não às entidades.' },
        { t: 'GERENCIAR como 1:1',                      ok: 1, why: 'Vem de IdentGer — um gerente por departamento.' },
        { t: 'Os nomes exatos dos losangos',            ok: 0, why: 'O nome é escolha de quem modela. Uma turma escreveu POSSUIR, outra TEM — as duas foram aceitas.' },
        { t: 'A posição dos retângulos no papel',       ok: 0, why: 'Layout não é conteúdo. O que conta é a estrutura.' }
      ]
    },
    {
      k: 'reveal',
      t: 'Passo 4 — Confira com o DER do professor',
      q: 'Compare o seu desenho com o original.',
      img: 'caso2-empregado-projeto-der.png',
      check: [
        'DEPENDENTE em retângulo duplo',
        'SUPERIDENT como losango voltando a EMPREGADO',
        'TRABALHANO em N:N com HORAS pendurado',
        'Dois losangos distintos entre EMPREGADO e DEPARTAMENTO: trabalhar (N:1) e gerenciar (1:1)',
        'IDENT e NUM sublinhados',
        'DEPLOC ligado a DEPARTAMENTO'
      ],
      model: '<p>Existe uma versão de outra turma com nomes diferentes nos losangos. Ela está na aba <strong>DER</strong> — vale comparar as duas para ver o que muda e o que não muda.</p>'
    }
  ]
},

/* ══════════════════════════════ CASO 4 — FORMAS NORMAIS DO PROFESSOR ═══ */
{
  id: 'of-pedido',
  n: 4,
  t: 'Pedido de Compra',
  nivel: 'Da aula — normalização passo a passo',
  tags: '1FN · 2FN · 3FN',
  intro: 'A resolução que o professor fez em aula, refeita por você, uma forma normal de cada vez. É o exercício que mais cai.',
  enunciado: `
    <p>Um pedido de compra interno chega assim, tudo numa tabela só:</p>
    <div class="pre">PEDIDOCOMPRA(NR_PEDIDO, DATA, DEPTO_ORIGEM, DEPTO_DESTINO,
             FUNC_SOL, FUNC_RESP, ITEM, MATERIAL, QUANTIDADE, QTD_TOTAL)</div>
    <p>Os itens do pedido 01 são: 01 LÁPIS 10 · 02 CANETA 05 · 03 BORRACHA 02 ·
    04 APONTADOR 01 · 05 MÍDIA DVD 10.</p>
    <p>Normalize até a 3FN.</p>`,
  steps: [
    {
      k: 'pick',
      t: 'Passo 1 — 1FN: ache o grupo de repetição',
      q: 'Quais colunas se repetem a cada item do mesmo pedido? São elas que saem na 1FN.',
      items: [
        { t: 'ITEM',        ok: 1, why: 'Muda a cada linha do mesmo pedido — faz parte do grupo de repetição.' },
        { t: 'MATERIAL',    ok: 1, why: 'Cada item tem um material diferente.' },
        { t: 'QUANTIDADE',  ok: 1, why: 'Cada item tem sua quantidade.' },
        { t: 'NR_PEDIDO',   ok: 0, why: 'É o identificador do pedido — fica na tabela PEDIDO e se repete na tabela dos itens como parte da chave.' },
        { t: 'DATA',        ok: 0, why: 'É do pedido inteiro, não de cada item.' },
        { t: 'FUNC_SOL',    ok: 0, why: 'Quem solicitou é do pedido, não do item.' },
        { t: 'QTD_TOTAL',   ok: 0, why: 'É do pedido. Ele tem outro problema — mas só será resolvido na 3FN.' }
      ]
    },
    {
      k: 'reveal',
      t: 'Passo 2 — Escreva a 1FN',
      q: 'Escreva as duas tabelas resultantes, com as chaves.',
      model: `<div class="pre">PEDIDO(NR_PEDIDO pk, DATA, DEPTO_ORIGEM, DEPTO_DESTINO,
       FUNC_SOL, FUNC_RESP, QTD_TOTAL)
ITENS_PEDIDO(NR_PEDIDO pk/fk, ITEM pk, MATERIAL, QUANTIDADE)</div>
        <p>A chave de <code>ITENS_PEDIDO</code> é <strong>composta</strong>: o mesmo <code>NR_PEDIDO</code>
        tem vários itens, então só a combinação <code>NR_PEDIDO + ITEM</code> identifica uma linha.
        Guarde isso — é ela que a 2FN vai analisar.</p>`,
      check: [
        'Duas tabelas: PEDIDO e ITENS_PEDIDO',
        'ITENS_PEDIDO com chave composta NR_PEDIDO + ITEM',
        'QTD_TOTAL ainda está lá (sai só na 3FN)',
        'DEPTO e FUNC ainda estão como texto no PEDIDO (saem só na 3FN)'
      ]
    },
    {
      k: 'assign',
      t: 'Passo 3 — 2FN: cada atributo depende da chave inteira?',
      q: 'A chave de ITENS_PEDIDO é <code>NR_PEDIDO + ITEM</code>. Para cada atributo, responda.',
      opts: ['Depende da chave inteira — fica', 'Depende só de parte — sai'],
      rows: [
        { t: 'QUANTIDADE', a: 0, why: 'A quantidade é daquele item daquele pedido: depende dos dois. Fica.' },
        { t: 'MATERIAL',   a: 1, why: 'O nome do material não depende do pedido nem do número do item — depende do próprio material. Sai para uma tabela própria, e cria-se COD_MATERIAL.' }
      ]
    },
    {
      k: 'reveal',
      t: 'Passo 4 — Escreva a 2FN',
      q: 'Escreva as três tabelas.',
      model: `<div class="pre">PEDIDO(NR_PEDIDO pk, DATA, DEPTO_ORIGEM, DEPTO_DESTINO,
       FUNC_SOL, FUNC_RESP, QTD_TOTAL)
ITENS_PEDIDO(NR_PEDIDO pk/fk, ITEM pk, COD_MATERIAL fk, QUANTIDADE)
MATERIAL(COD_MATERIAL pk, MATERIAL)</div>
        <p>Note que foi preciso <strong>criar</strong> um <code>COD_MATERIAL</code>: o enunciado não
        dava um código, e o nome do material seria uma PK ruim (pode repetir, pode mudar).</p>`,
      check: [
        'Três tabelas',
        'COD_MATERIAL criado do zero',
        'ITENS_PEDIDO agora referencia MATERIAL por FK',
        'QUANTIDADE permaneceu em ITENS_PEDIDO'
      ]
    },
    {
      k: 'pick',
      t: 'Passo 5 — 3FN: o que ainda está errado?',
      q: 'Olhe a tabela PEDIDO. O que a 3FN vai atacar?',
      items: [
        { t: 'DEPTO_ORIGEM e DEPTO_DESTINO são assunto próprio', ok: 1, why: 'Departamento tem descrição e existência própria. Vira tabela DEPARTAMENTO, e o PEDIDO guarda dois códigos como FK.' },
        { t: 'FUNC_SOL e FUNC_RESP são assunto próprio',          ok: 1, why: 'Mesmo raciocínio: FUNCIONARIO vira tabela, e o PEDIDO guarda dois códigos como FK.' },
        { t: 'QTD_TOTAL é calculado',                             ok: 1, why: 'É a soma das quantidades dos itens. Se armazenado, pode divergir da soma real. Sai.' },
        { t: 'DATA é calculada',                                  ok: 0, why: 'Data é um dado real do pedido, não derivado de nada.' },
        { t: 'NR_PEDIDO deveria ser composto',                    ok: 0, why: 'NR_PEDIDO sozinho identifica o pedido. A chave composta é só a de ITENS_PEDIDO.' }
      ]
    },
    {
      k: 'reveal',
      t: 'Passo 6 — Escreva a 3FN final',
      q: 'Escreva as cinco tabelas finais. Esta é a resposta que o professor cobra.',
      img: 'conceito-formas-normais.png',
      model: `<div class="pre">PEDIDO(NR_PEDIDO pk, DATA,
       COD_DEPTO_ORIGEM fk, COD_DEPTO_DESTINO fk,
       COD_FUNC_SOL fk, COD_FUNC_RESP fk)
ITENS_PEDIDO(NR_PEDIDO pk/fk, ITEM pk, COD_MATERIAL fk, QUANTIDADE)
MATERIAL(COD_MATERIAL pk, MATERIAL)
DEPARTAMENTO(COD_DEPTO pk, DESCRICAO)
FUNCIONARIO(COD_FUNC pk, NOME)</div>
        <p>Repare no detalhe que costuma escapar: <code>DEPARTAMENTO</code> é referenciado
        <strong>duas vezes</strong> pela mesma tabela (origem e destino), e <code>FUNCIONARIO</code>
        também (solicitante e responsável). Duas FKs para a mesma tabela é perfeitamente normal.</p>`,
      check: [
        'Cinco tabelas',
        'QTD_TOTAL não existe mais em lugar nenhum',
        'DEPARTAMENTO referenciado duas vezes pelo PEDIDO',
        'FUNCIONARIO referenciado duas vezes pelo PEDIDO',
        'ITENS_PEDIDO manteve a chave composta'
      ]
    },
    {
      k: 'reveal',
      t: 'Passo 7 — Refaça sozinho, com outro enunciado',
      q: 'Agora sem apoio. Normalize até a 3FN o <strong>Controle de Estoque</strong>: uma folha com NR_CONTROLE, DATA, o funcionário repositor, os itens (código da peça, descrição, quantidade, tipo de movimentação, setor) e o funcionário responsável.',
      model: `<div class="pre">CONTROLE(NR_CONTROLE pk, DATA,
         COD_FUNC_REPOSITOR fk, COD_FUNC_RESP fk)
ITENS_CONTROLE(NR_CONTROLE pk/fk, ITEM pk, COD_PECA fk,
               QTDE, TIPO_MOVIMENTACAO, COD_SETOR fk)
PECA(COD_PECA pk, DESCRICAO)
FUNCIONARIO(COD_FUNC pk, NOME)
SETOR(COD_SETOR pk, DESCRICAO)</div>
        <p>É o mesmo esqueleto do Pedido de Compra. Se você chegou aqui sozinho, esse assunto está resolvido.</p>`,
      check: [
        'Cinco tabelas',
        'ITENS_CONTROLE com chave composta',
        'DESCRICAO da peça separada em PECA',
        'SETOR como tabela própria',
        'Dois funcionários referenciados pelo CONTROLE'
      ]
    }
  ]
},

/* ══════════════════════════════════════════════ CASO 5 — AGENDA MÉDICA ══ */
{
  id: 'of-agenda',
  n: 5,
  t: 'Agenda Médica',
  nivel: 'Completo — com aspecto temporal',
  tags: 'N:N · histórico · DATA na chave',
  intro: 'O caso que mostra por que a DATA entra na chave. Aqui o sistema precisa do histórico, e é isso que transforma um relacionamento simples em N:N identificado por data e hora.',
  enunciado: `
    <p>Uma clínica quer informatizar a agenda.</p>
    <p>Cada <strong>médico</strong> tem CRM, nome e atua em <strong>uma ou mais especialidades</strong>
    (código, descrição). Uma mesma especialidade é exercida por vários médicos.</p>
    <p>Cada <strong>paciente</strong> tem código, nome, data de nascimento e pertence a um
    <strong>convênio</strong> (código, nome, percentual de cobertura).</p>
    <p>Uma <strong>consulta</strong> acontece em uma data e hora, entre um médico e um paciente,
    em uma <strong>sala</strong> (número, andar).</p>
    <p class="serif-note">A clínica exige o <strong>histórico completo</strong>: o mesmo paciente pode
    consultar o mesmo médico quantas vezes for preciso, e todas precisam ficar registradas.</p>`,
  steps: [
    {
      k: 'pick',
      t: 'Passo 1 — Entidades',
      q: 'Marque as entidades. Duas armadilhas aqui: algo que parece atributo é entidade, e algo que parece entidade é relacionamento.',
      items: [
        { t: 'MEDICO',        ok: 1, why: 'CRM e nome próprios, várias ocorrências.' },
        { t: 'ESPECIALIDADE', ok: 1, why: 'A armadilha nº 1. Parece atributo do médico, mas tem código e descrição próprios e várias ocorrências — e um médico tem várias. É entidade.' },
        { t: 'PACIENTE',      ok: 1, why: 'Entidade fundamental.' },
        { t: 'CONVENIO',      ok: 1, why: 'Código, nome e percentual próprios. Vários pacientes usam o mesmo convênio.' },
        { t: 'SALA',          ok: 1, why: 'Número e andar próprios.' },
        { t: 'CONSULTA',      ok: 1, why: 'Tem atributos próprios (data, hora) e liga médico a paciente. Como precisa guardar histórico, ela ganha existência própria no modelo.' },
        { t: 'DATA',          ok: 0, why: 'A armadilha nº 2. É atributo da consulta — só que um atributo especial: vai entrar na identificação. Isso não a torna entidade.' },
        { t: 'CRM',           ok: 0, why: 'É o identificador do médico.' }
      ]
    },
    {
      k: 'assign',
      t: 'Passo 2 — Cardinalidades',
      q: 'Lembre que o enunciado exige histórico. Isso muda algumas respostas.',
      opts: ['1 : 1', '1 : N', 'N : N'],
      rows: [
        { t: 'MEDICO — atua em — ESPECIALIDADE', a: 2, why: 'Um médico tem várias especialidades e uma especialidade tem vários médicos. N:N puro — gera a tabela MEDICO_ESPECIALIDADE.' },
        { t: 'CONVENIO — cobre — PACIENTE',      a: 1, why: 'Um convênio cobre vários pacientes; cada paciente tem um. FK cod_convenio em PACIENTE.' },
        { t: 'MEDICO — atende — PACIENTE',       a: 2, why: 'Sem histórico seria 1:N. Com histórico vira N:N: o mesmo médico atende vários pacientes e o mesmo paciente volta a vários médicos, várias vezes.' },
        { t: 'SALA — abriga — CONSULTA',         a: 1, why: 'Uma sala abriga várias consultas ao longo do dia; cada consulta ocorre em uma sala. FK nr_sala em CONSULTA.' }
      ]
    },
    {
      k: 'pick',
      t: 'Passo 3 — Por que a DATA entra na chave',
      q: 'A clínica quer registrar que o paciente 42 consultou a médica de CRM 1234 em 03/03 e de novo em 17/04. Por que <code>(CRM, COD_PAC)</code> não basta como chave?',
      items: [
        { t: 'Porque o mesmo par pode se relacionar mais de uma vez', ok: 1, why: 'Exatamente. Duas consultas do mesmo par gerariam duas linhas idênticas — e uma PK não admite duplicata.' },
        { t: 'Porque a DATA diferencia as ocorrências',               ok: 1, why: 'É o papel dela: separar uma consulta da outra. Por isso ela vira identificadora.' },
        { t: 'Porque guardar histórico é o que provoca essa mudança', ok: 1, why: 'Se só interessasse a última consulta, a data seria um atributo comum. É o histórico que a promove a chave.' },
        { t: 'Porque CRM não é uma boa chave primária',               ok: 0, why: 'CRM é único e imutável — é uma boa PK para MEDICO. O problema não é ele.' },
        { t: 'Porque o SGBD exige chaves compostas em N:N',           ok: 0, why: 'O SGBD não exige nada disso. A chave composta vem da regra de negócio, não do banco.' },
        { t: 'Porque a data ocupa menos espaço que um código',        ok: 0, why: 'Espaço não tem nada a ver com a escolha da chave. O critério é identificar unicamente.' }
      ]
    },
    {
      k: 'assign',
      t: 'Passo 4 — De quem é cada atributo?',
      q: 'Decida onde cada atributo mora. É o passo que mais gera desconto na correção.',
      opts: ['Da entidade', 'Do relacionamento'],
      rows: [
        { t: 'PERC_COBERTURA', a: 0, why: 'É característica do convênio, igual para todos os pacientes dele.' },
        { t: 'DATA da consulta', a: 1, why: 'Não é do médico nem do paciente: é daquele encontro específico. Pertence ao relacionamento — e ainda por cima identifica.' },
        { t: 'HORA da consulta', a: 1, why: 'Mesma coisa. Junto com a data, separa duas consultas do mesmo par no mesmo dia.' },
        { t: 'ANDAR', a: 0, why: 'É característica da sala.' },
        { t: 'DATA_NASC', a: 0, why: 'É característica do paciente.' }
      ]
    },
    {
      k: 'reveal',
      t: 'Passo 5 — Desenhe o DER',
      q: 'Desenhe: cinco retângulos, o losango N:N entre MEDICO e ESPECIALIDADE, e CONSULTA ligando MEDICO e PACIENTE com DATA e HORA sublinhadas no losango.',
      model: `<p>Duas formas corretas de desenhar a consulta:</p>
        <ul>
          <li><strong>Como losango com atributos</strong> — <code>MEDICO N — CONSULTA — N PACIENTE</code>,
          com DATA e HORA pendurados e sublinhados. É a leitura mais fiel ao MER.</li>
          <li><strong>Como entidade associativa</strong> — um retângulo CONSULTA entre os dois,
          com dois relacionamentos 1:N. É o que acontece de fato no mapeamento.</li>
        </ul>
        <p>As duas chegam ao mesmo Modelo Relacional. Se o professor não pedir uma delas
        explicitamente, escolha a primeira e mencione a segunda embaixo do desenho.</p>`,
      check: [
        'MEDICO, ESPECIALIDADE, PACIENTE, CONVENIO e SALA em retângulos',
        'CRM, COD_ESP, COD_PAC, COD_CONV e NR_SALA sublinhados',
        'Losango N:N entre MEDICO e ESPECIALIDADE, sem atributos',
        'CONSULTA como N:N entre MEDICO e PACIENTE, com DATA e HORA',
        'DATA e HORA sublinhadas — elas fazem parte da identificação',
        'SALA ligada à consulta com cardinalidade 1:N'
      ]
    },
    {
      k: 'reveal',
      t: 'Passo 6 — Modelo Relacional',
      q: 'Escreva as relações. Preste atenção na chave de CONSULTA — ela tem quatro colunas.',
      model: `<div class="pre">MEDICO(CRM pk, NOME)
ESPECIALIDADE(COD_ESP pk, DESCRICAO)
MEDICO_ESPECIALIDADE(CRM pk/fk, COD_ESP pk/fk)
CONVENIO(COD_CONV pk, NOME, PERC_COBERTURA)
PACIENTE(COD_PAC pk, NOME, DATA_NASC, COD_CONV fk)
SALA(NR_SALA pk, ANDAR)
CONSULTA(CRM pk/fk, COD_PAC pk/fk, DATA pk, HORA pk, NR_SALA fk)</div>
        <p>Repare que <code>CONSULTA</code> tem uma PK de <strong>quatro</strong> colunas: as duas
        chaves das entidades mais data e hora. É o aspecto temporal materializado — sem data e hora
        ali, a clínica não conseguiria registrar a segunda consulta do mesmo par.</p>
        <p>E note que <code>MEDICO_ESPECIALIDADE</code> é uma associativa <em>pura</em>: só junta as
        duas chaves, sem atributos próprios. Já <code>CONSULTA</code> é associativa
        <em>atributiva</em> — carrega dados do próprio encontro.</p>`,
      check: [
        'Sete relações',
        'MEDICO_ESPECIALIDADE nasceu do N:N e só tem as duas chaves',
        'CONSULTA com PK de quatro colunas: CRM, COD_PAC, DATA e HORA',
        'PACIENTE com COD_CONV como FK',
        'NR_SALA em CONSULTA é FK, mas fica fora da PK'
      ]
    },
    {
      k: 'assign',
      t: 'Passo 7 — E se não houvesse histórico?',
      q: 'A clínica muda de ideia: só interessa a <strong>última</strong> consulta de cada paciente. O que acontece com o modelo?',
      opts: ['Não muda', 'Vira 1:N', 'A DATA sai da chave', 'A tabela desaparece'],
      rows: [
        { t: 'A cardinalidade MEDICO — PACIENTE',   a: 1, why: 'Sem histórico, cada paciente tem uma consulta atual só: volta a ser 1:N, com FK no lado do paciente.' },
        { t: 'A DATA no relacionamento',            a: 2, why: 'Sem várias ocorrências para diferenciar, a data volta a ser um atributo comum — sai da chave.' },
        { t: 'A tabela MEDICO_ESPECIALIDADE',       a: 0, why: 'Nada muda. Esse N:N não tem nada a ver com tempo: um médico simplesmente tem várias especialidades.' }
      ]
    }
  ]
},

/* ═══════════════════════════════════════════════ CASO 6 — BIBLIOTECA ════ */
{
  id: 'of-biblioteca',
  n: 6,
  t: 'Biblioteca universitária',
  nivel: 'Completo — entidade fraca e N:N',
  tags: 'Fraca · N:N · multivalorado',
  intro: 'O caso da entidade fraca. Aqui existe algo que só é identificável dentro de outra coisa — e reconhecer isso muda a chave primária inteira.',
  enunciado: `
    <p>A biblioteca controla o acervo e os empréstimos.</p>
    <p>Cada <strong>livro</strong> tem número de tombo, título, ano e editora, e pode ter
    <strong>vários autores</strong>. Um mesmo autor escreve vários livros.</p>
    <p>De cada livro a biblioteca possui vários <strong>exemplares</strong>, numerados
    <strong>1, 2, 3… dentro daquele livro</strong>. Cada exemplar tem um estado de conservação.
    O exemplar número 2 do livro 500 é diferente do exemplar número 2 do livro 700.</p>
    <p>Cada <strong>usuário</strong> tem matrícula, nome e vários telefones.</p>
    <p>Um usuário pega <strong>exemplares</strong> emprestados, registrando data de retirada e data
    de devolução. O mesmo usuário pode pegar o mesmo exemplar em épocas diferentes.</p>`,
  steps: [
    {
      k: 'assign',
      t: 'Passo 1 — Classifique cada estrutura',
      q: 'Antes de desenhar, identifique o que é cada coisa. Este é o passo 6 do roteiro feito primeiro, de propósito.',
      opts: ['Entidade normal', 'Entidade fraca', 'Multivalorado', 'N:N'],
      rows: [
        { t: 'LIVRO',                    a: 0, why: 'Tombo próprio, existência própria.' },
        { t: 'EXEMPLAR',                 a: 1, why: 'O número 2 só significa alguma coisa dentro do livro 500. Sozinho não identifica — é entidade fraca, e a PK será (tombo, nr_exemplar).' },
        { t: 'AUTOR e LIVRO',            a: 3, why: 'Vários autores por livro, vários livros por autor. Gera tabela associativa.' },
        { t: 'TELEFONE do usuário',      a: 2, why: 'Vários valores do mesmo tipo. Elipse dupla no DER, tabela no relacional.' },
        { t: 'USUARIO e EXEMPLAR',       a: 3, why: 'O empréstimo é N:N — e como o mesmo par se repete no tempo, a data vai entrar na chave.' },
        { t: 'USUARIO',                  a: 0, why: 'Matrícula própria, existência própria.' }
      ]
    },
    {
      k: 'pick',
      t: 'Passo 2 — Por que EXEMPLAR é entidade fraca?',
      q: 'Marque as afirmações verdadeiras sobre a entidade fraca deste caso.',
      items: [
        { t: 'O número do exemplar se repete entre livros diferentes', ok: 1, why: 'Existe exemplar 2 do livro 500 e exemplar 2 do livro 700. O número sozinho não identifica nada.' },
        { t: 'A PK precisa incluir o tombo do livro',                  ok: 1, why: 'É a regra: a fraca recebe a PK da forte como parte da própria PK. Fica (NO_TOMBO, NR_EXEMPLAR).' },
        { t: 'No DER ela aparece em retângulo duplo',                  ok: 1, why: 'É a notação da entidade fraca.' },
        { t: 'O relacionamento que a liga ao livro é o identificador', ok: 1, why: 'Chama-se relacionamento identificador justamente porque é ele que permite identificá-la.' },
        { t: 'Ela não pode ter atributos próprios',                    ok: 0, why: 'Pode, sim. Aqui ela tem ESTADO_CONSERVACAO. O que ela não tem é identificação própria.' },
        { t: 'Ela não gera tabela no modelo relacional',               ok: 0, why: 'Gera, sim — com PK composta. Quem não gera tabela é o relacionamento 1:N comum.' },
        { t: 'É a mesma coisa que uma entidade associativa',           ok: 0, why: 'Parecem no desenho, mas a motivação é outra: a fraca vem de dependência de existência, a associativa vem de resolver um N:N.' }
      ]
    },
    {
      k: 'assign',
      t: 'Passo 3 — Cardinalidades',
      q: 'Defina cada uma. Uma delas depende do histórico.',
      opts: ['1 : 1', '1 : N', 'N : N'],
      rows: [
        { t: 'LIVRO — possui — EXEMPLAR',        a: 1, why: 'Um livro tem vários exemplares; cada exemplar é de um livro. É o relacionamento identificador da fraca.' },
        { t: 'AUTOR — escreve — LIVRO',          a: 2, why: 'N:N clássico. Gera LIVRO_AUTOR com as duas chaves.' },
        { t: 'USUARIO — pega emprestado — EXEMPLAR', a: 2, why: 'N:N, e com histórico: o mesmo usuário pode pegar o mesmo exemplar de novo. A data de retirada entra na chave.' }
      ]
    },
    {
      k: 'assign',
      t: 'Passo 4 — Onde a chave transposta entra na PK?',
      q: 'A mesma operação — levar a chave de uma tabela para outra — tem duas consequências diferentes. Decida cada caso.',
      opts: ['Só FK, fora da PK', 'FK e parte da PK'],
      rows: [
        { t: 'NO_TOMBO dentro de EXEMPLAR',      a: 1, why: 'Entidade fraca: a chave transposta compõe a PK. Sem ela, o exemplar 2 seria ambíguo.' },
        { t: 'COD_EDITORA dentro de LIVRO',      a: 0, why: 'Relacionamento 1:N comum: a FK desce e fica fora da PK. O tombo sozinho já identifica o livro.' },
        { t: 'MATRICULA dentro de EMPRESTIMO',   a: 1, why: 'Tabela associativa de um N:N: as duas chaves compõem a PK, junto com a data.' },
        { t: 'MATRICULA dentro de USUARIO_FONE', a: 1, why: 'Multivalorado: a PK é (MATRICULA, FONE). A matrícula sozinha não identifica o telefone.' }
      ]
    },
    {
      k: 'reveal',
      t: 'Passo 5 — Desenhe o DER',
      q: 'Desenhe. O retângulo duplo e a elipse dupla precisam aparecer.',
      check: [
        'EXEMPLAR em retângulo duplo, ligado a LIVRO',
        'TELEFONE em elipse dupla no USUARIO',
        'Losango N:N entre AUTOR e LIVRO',
        'Losango N:N entre USUARIO e EXEMPLAR, com DATA_RETIRADA sublinhada',
        'NO_TOMBO, MATRICULA e COD_AUTOR sublinhados',
        'NR_EXEMPLAR sublinhado com traço tracejado ou marcado como chave parcial'
      ],
      model: `<p>Detalhe de notação que vale ponto: no exemplar, o <code>NR_EXEMPLAR</code> costuma ser
        desenhado com <strong>sublinhado tracejado</strong>, para indicar que ele é uma chave
        <em>parcial</em> — só identifica em conjunto com a chave da entidade forte. Se o professor não
        cobrar essa notação, sublinhe normal e explique embaixo.</p>`
    },
    {
      k: 'reveal',
      t: 'Passo 6 — Modelo Relacional',
      q: 'Escreva as seis relações com todas as chaves marcadas.',
      model: `<div class="pre">LIVRO(NO_TOMBO pk, TITULO, ANO, EDITORA)
AUTOR(COD_AUTOR pk, NOME)
LIVRO_AUTOR(NO_TOMBO pk/fk, COD_AUTOR pk/fk)
EXEMPLAR(NO_TOMBO pk/fk, NR_EXEMPLAR pk, ESTADO_CONSERVACAO)
USUARIO(MATRICULA pk, NOME)
USUARIO_FONE(MATRICULA pk/fk, FONE pk)
EMPRESTIMO(MATRICULA pk/fk, NO_TOMBO pk/fk, NR_EXEMPLAR pk/fk,
           DATA_RETIRADA pk, DATA_DEVOLUCAO)</div>
        <p>Olhe a chave de <code>EMPRESTIMO</code>: <strong>quatro colunas</strong>. Ela precisa das
        <em>duas</em> colunas do exemplar (porque o exemplar é fraco e sua PK já é composta), mais a
        matrícula, mais a data. É o efeito dominó de uma entidade fraca participando de um N:N com
        histórico — e é exatamente o tipo de detalhe que a correção procura.</p>
        <p><code>DATA_DEVOLUCAO</code> fica <strong>fora</strong> da chave: ela é preenchida depois,
        pode ser nula, e não ajuda a identificar o empréstimo.</p>`,
      check: [
        'Seis relações',
        'EXEMPLAR com PK composta (NO_TOMBO, NR_EXEMPLAR)',
        'LIVRO_AUTOR só com as duas chaves',
        'USUARIO_FONE separado do USUARIO',
        'EMPRESTIMO com PK de quatro colunas',
        'DATA_DEVOLUCAO fora da chave'
      ]
    }
  ]
},

/* ════════════════════════════════════════════════ CASO 7 — CASAMENTO ════ */
{
  id: 'of-casamento',
  n: 7,
  t: 'Casamento',
  nivel: 'Da aula — papéis da mesma entidade',
  tags: 'Auto-relacionamento · hipóteses',
  intro: 'O exercício em que a mesma entidade participa de um relacionamento em dois papéis diferentes. E o único em que duas turmas chegaram a cardinalidades diferentes — as duas aceitas.',
  enunciado: `
    <div class="pre">Pessoa(PessID, PessNome, NascLocID, DataNasc,
       FalecLocID, DataFalec, ProfID, Sexo)
Local(LocID, Cidade, País)
Profissão(ProfID, ProfName)
Casamento(casamID, MaridoPessoaID, EsposaPessoaID, DataCasamento)</div>
    <p>Desenhe o DER com as cardinalidades, <strong>adicionando as hipóteses que julgar
    necessárias</strong>.</p>`,
  steps: [
    {
      k: 'assign',
      t: 'Passo 1 — Leia as pistas do esquema',
      q: 'Cada coluna estranha do esquema conta uma história. Qual?',
      opts: ['Atributo comum', 'FK para outra tabela', 'Duas FKs para a mesma tabela', 'Chave primária'],
      rows: [
        { t: 'Pessoa.NascLocID',                              a: 1, why: 'FK apontando para Local — representa o relacionamento NASCIMENTO.' },
        { t: 'Pessoa.NascLocID e Pessoa.FalecLocID juntas',   a: 2, why: 'Duas FKs da mesma tabela para Local. São dois relacionamentos distintos: nascimento e falecimento.' },
        { t: 'Casamento.MaridoPessoaID e EsposaPessoaID',     a: 2, why: 'Duas FKs para Pessoa. É a assinatura dos dois papéis — e o que torna isso um auto-relacionamento via CASAMENTO.' },
        { t: 'Pessoa.DataNasc',                               a: 0, why: 'Atributo simples da pessoa.' },
        { t: 'Local.LocID',                                   a: 3, why: 'Identificador da tabela Local.' }
      ]
    },
    {
      k: 'pick',
      t: 'Passo 2 — Os dois papéis',
      q: 'PESSOA se liga a CASAMENTO por <strong>dois</strong> losangos. O que é verdade sobre isso?',
      items: [
        { t: 'Há um único retângulo PESSOA no desenho',        ok: 1, why: 'Um só. Desenhar dois retângulos PESSOA seria duplicar a entidade.' },
        { t: 'Os dois losangos se chamam MARIDO e ESPOSA',     ok: 1, why: 'São os rótulos de papel — eles explicitam qual função a pessoa cumpre naquele relacionamento.' },
        { t: 'É um caso de auto-relacionamento',               ok: 1, why: 'A entidade PESSOA se relaciona consigo mesma, mediada pela entidade CASAMENTO.' },
        { t: 'Deveríamos criar as entidades MARIDO e ESPOSA',  ok: 0, why: 'Não. Marido e esposa <em>são</em> pessoas — criar entidades separadas duplicaria tudo, do mesmo jeito que criar "Supervisor" separado de "Funcionário".' },
        { t: 'CASAMENTO é uma entidade fraca',                 ok: 0, why: 'Ela tem identificador próprio, o casamID. Não depende de outra para ser identificada.' },
        { t: 'É um relacionamento ternário',                   ok: 0, why: 'Ternário exige três entidades diferentes. Aqui há duas — PESSOA e CASAMENTO — em dois relacionamentos binários.' }
      ]
    },
    {
      k: 'assign',
      t: 'Passo 3 — Cardinalidades',
      q: 'O enunciado manda adotar hipóteses. Escolha a leitura <strong>mais defensável no mundo real</strong> para cada relacionamento.',
      opts: ['1 : 1', 'N : 1', 'N : N'],
      rows: [
        { t: 'PESSOA — NASCIMENTO — LOCAL',   a: 1, why: 'Um mesmo local é o nascimento de várias pessoas. Lado PESSOA é N, lado LOCAL é 1. A turma que respondeu 1:1 também foi aceita, mas esta leitura é mais fiel.' },
        { t: 'PESSOA — FALECIMENTO — LOCAL',  a: 1, why: 'Mesmo raciocínio do nascimento.' },
        { t: 'PESSOA — TEM — PROFISSÃO',      a: 1, why: 'Várias pessoas exercem a mesma profissão. O esquema confirma: ProfID é uma FK simples dentro de Pessoa.' },
        { t: 'PESSOA — MARIDO — CASAMENTO',   a: 1, why: 'Cada casamento tem um marido; uma pessoa pode aparecer como marido em vários casamentos ao longo da vida. N pessoas para 1 casamento em cada registro.' }
      ]
    },
    {
      k: 'pick',
      t: 'Passo 4 — O que salva a questão na prova',
      q: 'Duas turmas entregaram cardinalidades diferentes e as duas foram aceitas. O que fez a diferença?',
      items: [
        { t: 'Escrever a hipótese adotada embaixo do desenho',  ok: 1, why: 'É isso. O enunciado pede hipóteses; declará-las é parte da resposta, não um extra.' },
        { t: 'Ser coerente com a hipótese ao longo do modelo',  ok: 1, why: 'Se você assumiu N:1 no nascimento, o mapeamento tem que refletir isso. Incoerência é o que derruba.' },
        { t: 'Acertar a estrutura: dois papéis, um retângulo',  ok: 1, why: 'A estrutura não é negociável, só as cardinalidades é que dependiam da hipótese.' },
        { t: 'Usar exatamente os nomes do professor nos losangos', ok: 0, why: 'O nome do losango é escolha de quem modela. Nunca foi critério de correção neste exercício.' },
        { t: 'Desenhar tudo com régua',                         ok: 0, why: 'Capricho ajuda a ler, mas não é conteúdo.' }
      ]
    },
    {
      k: 'reveal',
      t: 'Passo 5 — Confira com o DER do professor',
      q: 'Compare o seu desenho com a resolução original.',
      img: 'caso1-casamento-der.png',
      check: [
        'Um único retângulo PESSOA',
        'Dois losangos entre PESSOA e CASAMENTO: MARIDO e ESPOSA',
        'Dois losangos entre PESSOA e LOCAL: NASCIMENTO e FALECIMENTO',
        'Losango entre PESSOA e PROFISSÃO',
        'CASAM_ID, PESS_ID, LOC_ID e PROF_ID sublinhados',
        'A hipótese adotada escrita embaixo do desenho'
      ],
      model: `<p>Esta é a versão com cardinalidades <strong>1:1</strong>. Existe outra, de outra turma,
        com <strong>N:1</strong> — as duas estão na aba <strong>DER</strong>. Abra as duas lado a
        lado: é o melhor jeito de entender que, quando o enunciado pede hipóteses, a resposta certa é
        a que está <em>declarada e coerente</em>, não a que está numa tabela de gabarito.</p>`
    },
    {
      k: 'reveal',
      t: 'Passo 6 — Modelo Relacional',
      q: 'Escreva as relações. Aqui o mapeamento é quase direto, já que o esquema veio pronto.',
      model: `<div class="pre">LOCAL(LOC_ID pk, CIDADE, PAIS)
PROFISSAO(PROF_ID pk, PROF_NAME)
PESSOA(PESS_ID pk, PESS_NOME, SEXO, DATA_NASC, DATA_FALEC,
       NASC_LOC_ID fk → LOCAL,
       FALEC_LOC_ID fk → LOCAL,
       PROF_ID fk → PROFISSAO)
CASAMENTO(CASAM_ID pk, DATA_CASAMENTO,
          MARIDO_PESSOA_ID fk → PESSOA,
          ESPOSA_PESSOA_ID fk → PESSOA)</div>
        <p>Duas coisas que valem ponto: <code>PESSOA</code> referencia <code>LOCAL</code>
        <strong>duas vezes</strong>, e <code>CASAMENTO</code> referencia <code>PESSOA</code>
        <strong>duas vezes</strong>. Duas FKs para a mesma tabela é normal — o que muda é o
        <em>papel</em> de cada uma, e é por isso que os nomes das colunas precisam ser diferentes.</p>`,
      check: [
        'Quatro relações',
        'PESSOA com duas FKs para LOCAL, com nomes diferentes',
        'CASAMENTO com duas FKs para PESSOA, com nomes diferentes',
        'Nenhuma tabela extra criada — todos os relacionamentos são N:1'
      ]
    }
  ]
},

/* ═══════════════════════════════════════════════ CASO 8 — NOTA FISCAL ═══ */
{
  id: 'of-notafiscal',
  n: 8,
  t: 'Nota Fiscal',
  nivel: 'Da aula — normalização sozinho',
  tags: '1FN · 2FN · 3FN',
  intro: 'O exercício de normalização da aula, com menos apoio que o Pedido de Compra. Se você resolver este sem consultar, o assunto está fechado.',
  enunciado: `
    <p>Uma nota fiscal de venda tem, num documento só:</p>
    <div class="pre">NOTA(NR_NOTA, DATA, HORA,
     CNPJ_DEST, NOME_DEST, ENDERECO_DEST, CIDADE_DEST, UF_DEST,
     PLACA_TRANSP, NOME_TRANSP,
     ITEM, COD_PROD, DESCRICAO, UNID, QUANT, VL_UNIT, VL_TOTAL_ITEM,
     BASE_CALCULO, VALOR_TOTAL_NOTA)</div>
    <p>Cada nota tem vários itens. Normalize até a 3FN.</p>`,
  steps: [
    {
      k: 'pick',
      t: 'Passo 1 — 1FN: o grupo de repetição',
      q: 'Quais colunas mudam a cada item da mesma nota?',
      items: [
        { t: 'ITEM',            ok: 1, why: 'É o número sequencial do item — muda a cada linha.' },
        { t: 'COD_PROD',        ok: 1, why: 'Cada item tem um produto diferente.' },
        { t: 'DESCRICAO',       ok: 1, why: 'Vem junto com o produto. Sai agora e será separada de novo na 2FN.' },
        { t: 'UNID',            ok: 1, why: 'Unidade de medida do produto — acompanha o item.' },
        { t: 'QUANT',           ok: 1, why: 'Quantidade daquele item.' },
        { t: 'VL_UNIT',         ok: 1, why: 'Valor unitário cobrado naquele item.' },
        { t: 'VL_TOTAL_ITEM',   ok: 1, why: 'É por item — e ainda por cima é calculado. Sai agora e some na 3FN.' },
        { t: 'NR_NOTA',         ok: 0, why: 'Identifica a nota. Fica na tabela NOTA e reaparece na tabela dos itens como parte da chave.' },
        { t: 'CNPJ_DEST',       ok: 0, why: 'O destinatário é da nota inteira, não de cada item.' },
        { t: 'VALOR_TOTAL_NOTA',ok: 0, why: 'É da nota. Tem outro problema — é calculado — mas isso só é resolvido na 3FN.' }
      ]
    },
    {
      k: 'reveal',
      t: 'Passo 2 — Escreva a 1FN',
      q: 'Duas tabelas. Marque a chave composta.',
      model: `<div class="pre">NOTA(NR_NOTA pk, DATA, HORA,
     CNPJ_DEST, NOME_DEST, ENDERECO_DEST, CIDADE_DEST, UF_DEST,
     PLACA_TRANSP, NOME_TRANSP,
     BASE_CALCULO, VALOR_TOTAL_NOTA)
ITENS_NOTA(NR_NOTA pk/fk, ITEM pk, COD_PROD, DESCRICAO, UNID,
           QUANT, VL_UNIT, VL_TOTAL_ITEM)</div>
        <p>Nada mais foi tocado. A 1FN só desmembra o grupo de repetição — a bagunça restante é
        problema da 2FN e da 3FN.</p>`,
      check: [
        'Duas tabelas',
        'ITENS_NOTA com chave composta NR_NOTA + ITEM',
        'Todos os dados do destinatário ainda em NOTA',
        'Os calculados ainda presentes'
      ]
    },
    {
      k: 'assign',
      t: 'Passo 3 — 2FN: dependência da chave inteira',
      q: 'A chave de ITENS_NOTA é <code>NR_NOTA + ITEM</code>. Cada atributo depende dos dois?',
      opts: ['Depende dos dois — fica', 'Depende só de parte — sai'],
      rows: [
        { t: 'QUANT',          a: 0, why: 'A quantidade é daquele item daquela nota. Depende dos dois.' },
        { t: 'VL_UNIT',        a: 0, why: 'É o valor cobrado naquela venda. Pode ser diferente do preço atual do produto — por isso fica no item.' },
        { t: 'DESCRICAO',      a: 1, why: 'A descrição depende do produto, não da nota nem do número do item. Sai para PRODUTO.' },
        { t: 'UNID',           a: 1, why: 'Mesma coisa: a unidade é característica do produto. Sai junto com a descrição.' },
        { t: 'COD_PROD',       a: 0, why: 'Fica — mas vira FK. É ele que liga o item ao produto que saiu.' }
      ]
    },
    {
      k: 'reveal',
      t: 'Passo 4 — Escreva a 2FN',
      q: 'Três tabelas agora.',
      model: `<div class="pre">NOTA(NR_NOTA pk, DATA, HORA,
     CNPJ_DEST, NOME_DEST, ENDERECO_DEST, CIDADE_DEST, UF_DEST,
     PLACA_TRANSP, NOME_TRANSP,
     BASE_CALCULO, VALOR_TOTAL_NOTA)
ITENS_NOTA(NR_NOTA pk/fk, ITEM pk, COD_PROD fk, QUANT, VL_UNIT,
           VL_TOTAL_ITEM)
PRODUTO(COD_PROD pk, DESCRICAO, UNID)</div>
        <p>A tabela NOTA continua intocada — a 2FN só olha tabelas com <strong>chave composta</strong>,
        e a chave de NOTA é simples. Toda aquela bagunça de destinatário e transportador é assunto da
        3FN.</p>`,
      check: [
        'Três tabelas',
        'PRODUTO com DESCRICAO e UNID',
        'ITENS_NOTA com COD_PROD como FK',
        'NOTA ainda sem mudanças'
      ]
    },
    {
      k: 'pick',
      t: 'Passo 5 — 3FN: o que ainda está errado',
      q: 'Agora olhe a tabela NOTA e o que sobrou em ITENS_NOTA. O que a 3FN ataca?',
      items: [
        { t: 'NOME_DEST, ENDERECO_DEST, CIDADE_DEST e UF_DEST dependem de CNPJ_DEST', ok: 1, why: 'Dependência transitiva: não-chave dependendo de outro não-chave. O destinatário é assunto próprio e vira tabela.' },
        { t: 'NOME_TRANSP depende de PLACA_TRANSP',                                   ok: 1, why: 'Mesmo caso. TRANSPORTADOR vira tabela e a nota guarda só a placa como FK.' },
        { t: 'VL_TOTAL_ITEM é calculado',                                             ok: 1, why: 'É QUANT × VL_UNIT. Derivado armazenado sai.' },
        { t: 'VALOR_TOTAL_NOTA é calculado',                                          ok: 1, why: 'É a soma dos totais dos itens. Sai também.' },
        { t: 'BASE_CALCULO é calculado',                                              ok: 1, why: 'Deriva dos valores dos itens e da regra de imposto. Sai.' },
        { t: 'HORA deveria virar entidade',                                           ok: 0, why: 'É atributo simples da nota. Só viraria entidade se precisássemos de histórico de mudanças dela.' },
        { t: 'ITEM deveria sair da chave',                                            ok: 0, why: 'Ele é essencial: sem ele, os vários itens da mesma nota colidiriam.' }
      ]
    },
    {
      k: 'reveal',
      t: 'Passo 6 — Escreva a 3FN final',
      q: 'Cinco tabelas. Esta é a resposta que a prova cobra.',
      model: `<div class="pre">NOTA(NR_NOTA pk, DATA, HORA,
     CNPJ_DEST fk → DESTINATARIO,
     PLACA_TRANSP fk → TRANSPORTADOR)
ITENS_NOTA(NR_NOTA pk/fk, ITEM pk, COD_PROD fk, QUANT, VL_UNIT)
PRODUTO(COD_PROD pk, DESCRICAO, UNID)
DESTINATARIO(CNPJ pk, NOME, ENDERECO, CIDADE, UF)
TRANSPORTADOR(PLACA pk, NOME)</div>
        <p>Compare com o Pedido de Compra: é o <strong>mesmo esqueleto</strong>. Um documento, os
        itens dele, e uma tabela para cada assunto que aparecia repetido. Todos os campos calculados
        — <code>VL_TOTAL_ITEM</code>, <code>VALOR_TOTAL_NOTA</code>, <code>BASE_CALCULO</code> —
        desapareceram: eles são recalculados na hora de emitir a nota.</p>
        <p class="serif-note">Se você reconheceu esse esqueleto sozinho, normalização deixou de ser
        um problema para você.</p>`,
      check: [
        'Cinco tabelas',
        'Nenhum campo calculado sobrou',
        'DESTINATARIO com CNPJ como PK',
        'TRANSPORTADOR com PLACA como PK',
        'ITENS_NOTA manteve QUANT e VL_UNIT',
        'NOTA ficou com apenas cinco colunas'
      ]
    }
  ]
}

];
