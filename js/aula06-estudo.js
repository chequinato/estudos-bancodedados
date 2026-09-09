/* =========================================================================
   ESTUDO DA MATÉRIA — flashcards e questões conceituais

   Estes não são cards "do exercício do cinema". Cada um pega o CONCEITO
   que o exercício ensinou e o solta num contexto novo — uma clínica, uma
   transportadora, uma escola de música — porque a prova nunca vai repetir
   o enunciado que você já viu.

   Todo item traz:
     ctx     a situação concreta, mostrada ANTES da pergunta, para você
             ter em que se apoiar em vez de responder no vácuo
     simple  a resposta em uma frase, antes da explicação longa

   IDs começam com k (cards) e w (questões) para nunca colidir com os
   arquivos anteriores.
   ========================================================================= */

CARDS.push(

/* ── 7. Entidades e Atributos ───────────────────────────────────────── */
{ id:'k0701', m:7, q:'Qual é o teste prático para decidir se algo é <strong>entidade</strong> ou <strong>atributo</strong>?', hint:'Três perguntas seguidas',
  a:`<p>Pergunte, nesta ordem:</p>
     <ol><li><strong>Tem atributos próprios?</strong> Se você consegue descrever a coisa com mais de um dado, é entidade.</li>
     <li><strong>Existe sozinha?</strong> Se faz sentido cadastrar sem estar pendurada em outra coisa, é entidade.</li>
     <li><strong>Tem várias ocorrências que você precisa distinguir?</strong> Se sim, é entidade.</li></ol>
     <p>Uma resposta "não" em qualquer das três já empurra para atributo.</p>` },
{ id:'k0702', m:7, q:'O que caracteriza um atributo <strong>composto</strong>, e o que acontece com ele no modelo relacional?',
  a:`<p>É um atributo que <strong>se subdivide em partes com significado próprio</strong>: endereço vira rua, número, bairro, cidade, UF.</p>
     <p>No DER: uma elipse com elipses penduradas. No relacional: ele <strong>se achata</strong> — cada parte vira uma coluna, e o atributo-pai desaparece.</p>` },
{ id:'k0703', m:7, q:'Como você reconhece um atributo <strong>multivalorado</strong> num enunciado escrito em português?', hint:'Procure o plural',
  a:`<p>Pelo plural e pelas expressões de variedade: "<em>vários</em> telefones", "os mais <em>variados</em> gêneros", "<em>uma ou mais</em> especialidades", "<em>lista de</em> e-mails".</p>
     <p>No DER vira <strong>elipse dupla</strong>. No relacional vira sempre <strong>tabela nova</strong>, com PK composta pela chave da entidade mais o próprio valor.</p>` },
{ id:'k0704', m:7, q:'Por que um atributo multivalorado <strong>não pode</strong> ficar como coluna com valores separados por vírgula?',
  a:`<p>Porque quebra a <strong>1FN</strong>: o campo deixa de ser atômico.</p>
     <p>Consequência prática, que é o que importa: você perde a consulta. "Quais filmes são de ficção" vira busca por pedaço de texto, não aceita índice, e erra em "ficção científica" contra "ficção".</p>` },
{ id:'k0705', m:7, q:'O que é um atributo <strong>derivado</strong>, e por que ele normalmente não é guardado?',
  a:`<p>É o que pode ser <strong>calculado a partir de outro dado</strong>: idade a partir da data de nascimento, total do pedido a partir dos itens.</p>
     <p>Guardar um derivado cria duas fontes de verdade que podem discordar. No DER ele aparece em elipse tracejada; no relacional, normalmente vira <code>VIEW</code> ou cálculo na consulta.</p>` },

/* ── 8. Chaves ──────────────────────────────────────────────────────── */
{ id:'k0801', m:8, q:'Diferença entre chave <strong>candidata</strong>, <strong>primária</strong> e <strong>secundária</strong>.',
  a:`<p><strong>Candidata</strong>: qualquer atributo (ou conjunto) que identifica unicamente a linha. Uma tabela pode ter várias.</p>
     <p><strong>Primária</strong>: a candidata que você <em>escolheu</em> para identificar oficialmente. Só uma, nunca nula.</p>
     <p><strong>Secundária</strong> (ou alternativa): as candidatas que sobraram. Continuam únicas, mas não identificam.</p>
     <p>Num cliente com CPF e e-mail únicos: as duas são candidatas; você elege o CPF como primária, e o e-mail fica secundária.</p>` },
{ id:'k0802', m:8, q:'Quando usar chave <strong>natural</strong> e quando usar chave <strong>artificial</strong>?', hint:'Pergunte se o valor pode mudar',
  a:`<p><strong>Natural</strong> é um dado do mundo real (CPF, placa, ISBN). <strong>Artificial</strong> é um número que você inventa (id sequencial).</p>
     <p>Prefira artificial quando o valor natural <em>pode mudar</em> (nome, e-mail), <em>pode se repetir</em> (título de filme, com refilmagens) ou <em>é grande</em> — porque a chave vai ser copiada como FK em toda tabela filha.</p>` },
{ id:'k0803', m:8, q:'O que exatamente significa uma <strong>chave composta</strong>, e quando ela é obrigatória?',
  a:`<p>É a chave formada por <strong>duas ou mais colunas</strong>, porque nenhuma sozinha identifica a linha.</p>
     <p>Ela é obrigatória em três situações: tabela que nasceu de um <strong>N:N</strong>; tabela que nasceu de um <strong>multivalorado</strong>; e entidade <strong>fraca</strong>, que herda a chave do dono.</p>` },
{ id:'k0804', m:8, q:'Uma FK pode fazer parte da PK? Em que casos?',
  a:`<p>Pode, e é comum. Acontece sempre que a identidade da linha <strong>depende</strong> do que ela referencia:</p>
     <ul><li>Tabela de N:N — as duas FKs formam a PK.</li>
     <li>Entidade fraca — a FK do dono entra na PK, junto com o discriminador.</li>
     <li>Especialização — a FK do geral <em>é</em> a PK da especialização.</li></ul>
     <p>Num 1:N comum acontece o contrário: a FK entra na tabela e <strong>fica fora</strong> da chave.</p>` },
{ id:'k0805', m:8, q:'Por que a chave primária não aceita valor nulo?',
  a:`<p>Porque nulo significa "desconhecido", e não dá para identificar uma linha por um valor desconhecido — nem comparar dois nulos entre si (em SQL, <code>NULL = NULL</code> não é verdadeiro).</p>
     <p>Numa chave composta, a regra vale para <strong>todas</strong> as colunas: nenhuma parte pode ser nula.</p>` },

/* ── 9. Relacionamentos e Cardinalidade ─────────────────────────────── */
{ id:'k0901', m:9, q:'Qual é o método para descobrir a cardinalidade sem chutar?', hint:'Duas perguntas, uma para cada lado',
  a:`<p>Faça <strong>duas perguntas separadas</strong>, uma de cada ponta, sempre no singular contra o plural:</p>
     <p>"Um A se relaciona com <em>quantos</em> B?" e depois "Um B se relaciona com <em>quantos</em> A?"</p>
     <p>Duas respostas "um" → 1:1. Uma "um" e uma "vários" → 1:N. Duas "vários" → N:N. O erro clássico é responder só de um lado e assumir o outro.</p>` },
{ id:'k0902', m:9, q:'Diferença entre <strong>cardinalidade máxima</strong> e <strong>participação</strong> (obrigatória ou opcional).',
  a:`<p><strong>Cardinalidade</strong> responde "quantos": 1 ou N.</p>
     <p><strong>Participação</strong> responde "precisa ter": obrigatória (total) ou opcional (parcial).</p>
     <p>Todo pedido precisa de um cliente — participação total. Nem todo cliente tem pedido — participação parcial. Na notação (mín, máx) isso vira (1,1) contra (0,N).</p>` },
{ id:'k0903', m:9, q:'Onde ficam os atributos de um <strong>relacionamento</strong>, e como saber que um atributo é do relacionamento e não da entidade?',
  a:`<p>O teste: pergunte se o valor <strong>muda quando o par muda</strong>.</p>
     <p>A nota do aluno não é do aluno nem da disciplina — ela só existe no cruzamento dos dois. Logo, é atributo do relacionamento, e vai para a tabela que nasce dele.</p>
     <p>Se o valor é o mesmo para todos os pares, ele pertence a uma das entidades.</p>` },
{ id:'k0904', m:9, q:'Por que um relacionamento <strong>N:N</strong> obrigatoriamente vira tabela?',
  a:`<p>Porque não existe onde pôr a FK. Se você tentar colocá-la de um lado, cada linha só comporta um valor — e você precisa de vários.</p>
     <p>A tabela intermediária resolve: uma linha por par, PK composta pelas duas chaves, mais os atributos do relacionamento.</p>` },
{ id:'k0905', m:9, q:'Num relacionamento <strong>1:1</strong>, de que lado vai a chave estrangeira?',
  a:`<p>Do lado de <strong>participação total</strong> — o lado que obrigatoriamente participa.</p>
     <p>Todo funcionário tem crachá, mas nem todo crachá está emitido: a FK vai para CRACHA. Assim você evita uma coluna cheia de nulos do outro lado.</p>
     <p>Se os dois lados forem obrigatórios, considere fundir as duas entidades numa só.</p>` },

/* ── 10. Grau e Auto-relacionamento ─────────────────────────────────── */
{ id:'k1001', m:10, q:'O que é o <strong>grau</strong> de um relacionamento, e por que ele é independente da cardinalidade?',
  a:`<p>Grau é <strong>quantas entidades</strong> o relacionamento liga: 1 (auto), 2 (binário), 3 (ternário).</p>
     <p>Cardinalidade é <strong>quantas ocorrências</strong> de cada lado. São eixos diferentes: existe auto-relacionamento 1:N (supervisão) e auto-relacionamento N:N (pré-requisito, citação).</p>
     <p>A pergunta de prova costuma misturar os dois de propósito.</p>` },
{ id:'k1002', m:10, q:'Como se mapeia um auto-relacionamento <strong>1:N</strong> para o modelo relacional?',
  a:`<p>A FK entra <strong>na própria tabela</strong>, apontando para a PK dela mesma, e com nome de papel.</p>
     <p><code>FUNCIONARIO(matricula pk, nome, cod_supervisor fk → FUNCIONARIO)</code></p>
     <p>Uma tabela só. O supervisor de topo fica com a FK nula.</p>` },
{ id:'k1003', m:10, q:'Como se mapeia um auto-relacionamento <strong>N:N</strong>?', hint:'Vale a regra geral do N:N',
  a:`<p>Vira tabela, como todo N:N — só que as <strong>duas FKs apontam para a mesma tabela</strong> e precisam de nomes diferentes, porque representam papéis diferentes.</p>
     <p><code>PRE_REQUISITO(cod_disc fk, cod_disc_exigida fk)</code>, com PK composta.</p>
     <p>Na consulta, a tabela de origem entra duas vezes com apelidos distintos.</p>` },
{ id:'k1004', m:10, q:'Num auto-relacionamento, por que a <strong>ordem</strong> das duas colunas importa?',
  a:`<p>Porque o par é <strong>ordenado</strong> quando o relacionamento tem direção. "A cita B" não é o mesmo que "B cita A"; "A supervisiona B" não é o mesmo que o inverso.</p>
     <p>Em relacionamento simétrico ("é irmão de", "faz par com") a ordem não importa, mas aí o modelo costuma gravar os dois sentidos ou impor uma convenção.</p>` },

/* ── 11. Entidade Fraca e Associativa ───────────────────────────────── */
{ id:'k1101', m:11, q:'O que define uma <strong>entidade fraca</strong>?', hint:'Não é sobre importância',
  a:`<p>Ela <strong>não tem identificador próprio</strong>: só é identificada pela combinação da chave da entidade dona com um atributo discriminador seu.</p>
     <p>No DER: retângulo duplo, ligado por losango duplo. No relacional: a chave do dono <strong>entra na PK</strong> — e é isso que a distingue de um 1:N comum, onde a FK fica fora da chave.</p>
     <p>Fraca não quer dizer sem importância. Quer dizer sem identidade própria.</p>` },
{ id:'k1102', m:11, q:'O que é uma <strong>entidade associativa</strong>, e quando ela aparece?',
  a:`<p>É um relacionamento <strong>N:N que ganhou atributos próprios</strong> e passa a ser desenhado como entidade — normalmente porque precisa se relacionar com uma terceira entidade.</p>
     <p>MATRÍCULA entre aluno e disciplina, com nota e data; se ela também precisar apontar para o professor que avaliou, tem que virar entidade.</p>` },
{ id:'k1103', m:11, q:'Como distinguir uma entidade <strong>fraca</strong> de uma entidade normal ligada por 1:N?',
  a:`<p>Uma pergunta: <strong>o registro faz sentido sozinho?</strong></p>
     <p>Um item de nota fiscal sem a nota não existe — fraca. Um pedido sem cliente é um pedido órfão, mas continua sendo um pedido identificável — normal.</p>
     <p>No relacional a diferença é visível: fraca coloca a chave do dono <em>dentro</em> da PK; normal deixa a FK <em>fora</em>.</p>` },

/* ── 12. Especialização e Generalização ─────────────────────────────── */
{ id:'k1201', m:12, q:'Qual é o sinal, num enunciado, de que existe <strong>especialização</strong>?', hint:'Procure a palavra "se"',
  a:`<p>Um atributo que <strong>só vale para parte das ocorrências</strong>, geralmente anunciado por "se", "caso" ou "alguns":</p>
     <p><em>"…e <strong>se</strong> for estrangeiro, também o título em português"</em> · <em>"entre os funcionários, os vendedores possuem meta"</em> · <em>"as publicações editadas pelo grupo guardam dados do contrato"</em>.</p>
     <p>Se você tentar pôr esse atributo na entidade geral, ele fica nulo na maioria das linhas — e é esse o sintoma.</p>` },
{ id:'k1202', m:12, q:'Diferença entre <strong>especialização</strong> e <strong>generalização</strong>.',
  a:`<p>São a mesma estrutura, montada em direções opostas.</p>
     <p><strong>Especialização</strong> é de cima para baixo: você tem FUNCIONARIO e percebe que alguns são VENDEDOR.</p>
     <p><strong>Generalização</strong> é de baixo para cima: você tem CARRO e MOTO e percebe que ambos são VEICULO.</p>
     <p>O DER resultante é idêntico — muda só como você chegou nele.</p>` },
{ id:'k1203', m:12, q:'Quais são as duas formas de mapear uma especialização para tabelas, e quando usar cada uma?',
  a:`<p><strong>Forma 1 — tabelas separadas:</strong> uma para o geral e uma por especialização, ligadas pela mesma chave. Use quando as especializações têm muitos atributos próprios. É a forma que a disciplina cobra.</p>
     <p><strong>Forma 2 — tabela única:</strong> tudo numa tabela só, com colunas nulas onde não se aplica, mais uma coluna de tipo. Use quando há poucos atributos diferentes e as consultas quase sempre pegam tudo junto.</p>` },
{ id:'k1204', m:12, q:'Como fica a tabela de uma especialização que <strong>não tem atributo próprio</strong>?',
  a:`<p>Vira uma tabela de <strong>uma coluna só</strong>, que é PK e FK ao mesmo tempo. Ela existe para marcar <em>quem pertence ao subconjunto</em>.</p>
     <p><code>DIRETOR(id_ator pk/fk → ATOR)</code> — parece vazia, e é isso mesmo: a informação é a própria existência da linha.</p>` },
{ id:'k1205', m:12, q:'O que é <strong>agregação</strong>, e como ela difere de entidade associativa?',
  a:`<p>Agregação é tratar um <strong>relacionamento inteiro como se fosse uma entidade</strong>, para que ele possa participar de outro relacionamento.</p>
     <p>Na prática, resolve-se do mesmo jeito que a entidade associativa: o relacionamento vira tabela com chave própria, e a terceira entidade aponta para ela. A diferença é mais de notação do que de resultado.</p>` },

/* ── 13. Integridade Referencial ────────────────────────────────────── */
{ id:'k1301', m:13, q:'O que a <strong>integridade referencial</strong> garante, exatamente?',
  a:`<p>Que <strong>toda FK aponta para uma PK que existe</strong> — ou é nula.</p>
     <p>Sem ela o banco aceita um pedido com cliente 999 que nunca foi cadastrado. Com ela, o próprio SGBD recusa a operação: a regra fica no banco, não na aplicação, e vale para todos os sistemas que usem aquele banco.</p>` },
{ id:'k1302', m:13, q:'Cite as três integridades básicas do modelo relacional.',
  a:`<ul><li><strong>De entidade</strong> — a PK não pode ser nula nem repetida.</li>
     <li><strong>Referencial</strong> — a FK aponta para PK existente, ou é nula.</li>
     <li><strong>De domínio</strong> — o valor respeita o tipo e a faixa da coluna (uma nota entre 0 e 10, uma UF com duas letras).</li></ul>` },
{ id:'k1303', m:13, q:'O que acontece ao apagar uma linha que outras referenciam? Quais são as opções?',
  a:`<ul><li><strong>RESTRICT / NO ACTION</strong> — recusa a exclusão. É o padrão mais seguro.</li>
     <li><strong>CASCADE</strong> — apaga junto as linhas filhas. Correto para entidade fraca (apagar a nota apaga os itens), perigoso no resto.</li>
     <li><strong>SET NULL</strong> — deixa a FK nula. Só serve se a coluna aceitar nulo.</li></ul>
     <p>A escolha vem do significado do relacionamento, não do gosto.</p>` },

/* ── 14. Mapeamento MER → Relacional ────────────────────────────────── */
{ id:'k1401', m:14, q:'Recite as regras de mapeamento na ordem em que se aplicam.', hint:'Cinco regras, sempre nessa sequência',
  a:`<ol><li>Cada <strong>entidade</strong> vira uma tabela; a PK vira a chave.</li>
     <li>Atributo <strong>composto</strong> se achata em colunas.</li>
     <li>Atributo <strong>multivalorado</strong> vira tabela nova, com PK composta.</li>
     <li><strong>1:N</strong> — a chave do lado 1 desce como FK no lado N (fora da PK).</li>
     <li><strong>N:N</strong> — nasce tabela, com as duas chaves formando a PK, mais os atributos do relacionamento.</li></ol>
     <p>E os dois casos especiais: <strong>1:1</strong> põe a FK no lado de participação total; <strong>fraca</strong> põe a chave do dono dentro da PK.</p>` },
{ id:'k1402', m:14, q:'Quais estruturas <strong>sempre</strong> geram uma tabela nova no mapeamento?', hint:'São três',
  a:`<p><strong>N:N</strong>, <strong>atributo multivalorado</strong> e <strong>especialização</strong> (na forma de tabelas separadas).</p>
     <p>O 1:N nunca gera — ele só desloca uma chave. Essa distinção é a que mais cai em questão objetiva.</p>` },
{ id:'k1403', m:14, q:'Por que a FK de um 1:N fica <strong>fora</strong> da PK, mas a de uma entidade fraca fica <strong>dentro</strong>?',
  a:`<p>Porque a pergunta é sempre: <em>essa coluna ajuda a identificar a linha?</em></p>
     <p>Num 1:N o lado N já tem identidade própria — o veículo é identificado pela placa, não pela categoria. A FK é informação, não identidade.</p>
     <p>Na fraca não existe identidade sem o dono: o item 3 só é "item 3" dentro da nota 5. Aí a chave do dono é parte da identidade.</p>` },
{ id:'k1404', m:14, q:'Como se mapeia um relacionamento <strong>ternário</strong> (grau 3)?',
  a:`<p>Vira uma tabela com as <strong>três</strong> chaves estrangeiras, e a PK é normalmente a combinação das três — mais os atributos próprios do relacionamento.</p>
     <p>Antes de aceitar um ternário, verifique se ele não é na verdade uma entidade com três relacionamentos binários. Costuma ser, e costuma ficar mais claro assim.</p>` },

/* ── 15. Aspecto Temporal ───────────────────────────────────────────── */
{ id:'k1501', m:15, q:'Qual é a regra de ouro do <strong>aspecto temporal</strong>?', hint:'É sobre a chave',
  a:`<p>Quando o enunciado disser <strong>"por dia", "histórico", "ao longo do tempo", "mantém registro de"</strong> ou <strong>"pode repetir"</strong>, a <strong>data entra na chave primária</strong>.</p>
     <p>Sem isso, cada novo valor sobrescreve o anterior e o histórico não existe — o banco passa a guardar só a última foto.</p>` },
{ id:'k1502', m:15, q:'Como o aspecto temporal <strong>reescreve</strong> um modelo já pronto?',
  a:`<p>De três maneiras, todas as três em promoção:</p>
     <ul><li><strong>Atributo vira entidade</strong> — "preço" vira HISTORICO_PRECO(produto, data_inicio, preço).</li>
     <li><strong>1:N vira N:N</strong> — "o funcionário pertence a um setor" vira "pertenceu a vários setores ao longo do tempo".</li>
     <li><strong>A chave cresce</strong> — a data entra e a tabela passa a aceitar repetição.</li></ul>` },
{ id:'k1503', m:15, q:'Por que "um aluno está ligado a um curso" pode ser 1:N e N:N ao mesmo tempo?',
  a:`<p>Depende do recorte temporal, e o enunciado costuma dizer isso numa expressão pequena.</p>
     <p>"Um aluno só pode estar ligado a um curso <strong>em um dado instante</strong>" é 1:N — guarda o estado atual.</p>
     <p>Se o enunciado pedisse o histórico de cursos do aluno, seria N:N com data. A frase "em um dado instante" é o que decide.</p>` },
{ id:'k1504', m:15, q:'Qual é o custo de guardar histórico, e quando não vale a pena?',
  a:`<p>Custa <strong>tamanho</strong> (uma linha por período em vez de uma por entidade) e <strong>complexidade de consulta</strong>: perguntar "qual o valor hoje" deixa de ser um <code>SELECT</code> direto e vira uma busca pelo registro vigente.</p>
     <p>Não vale quando ninguém nunca vai perguntar sobre o passado. Vale sempre que houver auditoria, cálculo retroativo ou relatório comparativo.</p>` },

/* ── 16. Normalização ───────────────────────────────────────────────── */
{ id:'k1601', m:16, q:'Enuncie as três formas normais como <strong>três perguntas</strong>.',
  a:`<ol><li><strong>1FN</strong> — algum campo guarda mais de um valor, ou existe grupo que se repete dentro da linha?</li>
     <li><strong>2FN</strong> — a chave é composta e alguma coluna depende de <em>só uma parte</em> dela?</li>
     <li><strong>3FN</strong> — alguma coluna depende de <em>outra coluna não-chave</em> em vez de depender da chave?</li></ol>
     <p>Responder "não" às três é estar na 3FN.</p>` },
{ id:'k1602', m:16, q:'Por que a <strong>2FN</strong> só faz sentido quando a chave é composta?',
  a:`<p>Porque a 2FN proíbe <strong>dependência parcial</strong> — depender de parte da chave. Se a chave tem uma coluna só, não existe "parte dela".</p>
     <p>Consequência: toda tabela em 1FN com chave simples já está automaticamente em 2FN. É por isso que a 2FN aparece justamente nas tabelas nascidas de N:N.</p>` },
{ id:'k1603', m:16, q:'O que é uma <strong>dependência transitiva</strong>? Dê o desenho dela.',
  a:`<p>É quando uma coluna depende da chave <em>por intermédio</em> de outra coluna não-chave:</p>
     <p><code>chave → coluna_A → coluna_B</code></p>
     <p>Em <code>PEDIDO(nr, cod_cliente, nome_cliente)</code>, o nome depende do código, que depende do pedido. A 3FN corta o elo do meio: o nome vai para a tabela CLIENTE.</p>` },
{ id:'k1604', m:16, q:'Quais problemas concretos a normalização evita?', hint:'Três anomalias',
  a:`<ul><li><strong>Anomalia de atualização</strong> — trocar o nome do cliente exige alterar oitenta linhas, e uma fica para trás.</li>
     <li><strong>Anomalia de inserção</strong> — não dá para cadastrar um produto novo sem ter uma venda dele.</li>
     <li><strong>Anomalia de exclusão</strong> — apagar a última venda apaga junto o único registro daquele produto.</li></ul>
     <p>Normalizar é eliminar essas três, não deixar o desenho bonito.</p>` },
{ id:'k1605', m:16, q:'Existe caso em que <strong>desnormalizar</strong> é a decisão certa?',
  a:`<p>Existe, e é decisão consciente, não descuido. Em relatório e BI, repetir o nome do cliente numa tabela de fatos evita junções caríssimas em milhões de linhas.</p>
     <p>A regra profissional: <strong>normalize primeiro, desnormalize depois com motivo medido</strong>. Em prova de modelagem, entregue normalizado.</p>` },
{ id:'k1606', m:16, q:'Qual é a ordem correta de aplicar as formas normais, e por que ela importa?',
  a:`<p>Sempre <strong>1FN → 2FN → 3FN</strong>, nessa ordem, sem pular.</p>
     <p>Cada uma pressupõe a anterior: não dá para analisar dependência parcial numa tabela que ainda tem campo com três valores dentro, porque a chave nem está definida direito. Pular etapa é a causa mais comum de normalização errada.</p>` },

/* ── 17. Leitura de DER e prática ───────────────────────────────────── */
{ id:'k1701', m:17, q:'Qual é o roteiro para atacar um enunciado de modelagem do zero?', hint:'Sete passos',
  a:`<ol><li>Sublinhe <strong>substantivos</strong> (candidatos a entidade) e <strong>verbos</strong> (candidatos a relacionamento).</li>
     <li>Elimine os substantivos que são atributo.</li>
     <li>Ache o identificador de cada entidade.</li>
     <li>Defina cardinalidade com as duas perguntas.</li>
     <li>Pergunte de quem é cada atributo — entidade ou relacionamento.</li>
     <li>Varra os <strong>casos especiais</strong>: multivalorado, composto, especialização, fraca, auto-relacionamento, temporal.</li>
     <li>Desenhe, mapeie e normalize.</li></ol>` },
{ id:'k1702', m:17, q:'Qual é o teste final antes de entregar um modelo?', hint:'Volte ao enunciado',
  a:`<p>Releia as <strong>consultas que o enunciado pediu</strong> e responda cada uma de cabeça, dizendo por quais tabelas você passaria.</p>
     <p>Se alguma ficar impossível ou exigir ler texto solto, o modelo está errado — não a consulta. É o teste mais rápido que existe e pega quase todo erro estrutural.</p>` },
{ id:'k1703', m:17, q:'Dois modelos diferentes para o mesmo enunciado podem estar os dois certos?',
  a:`<p>Podem, e é comum. O caso do cinema é o exemplo: o professor usou SESSÃO como entidade fraca entre cinema e filme; o autor do livro ligou os dois num N:N direto com os atributos no losango. <strong>Os dois guardam a mesma informação.</strong></p>
     <p>O que <em>não</em> é opinião: cardinalidade que contraria o enunciado, multivalorado virando coluna com vírgula, e consulta pedida que o modelo não responde.</p>` },
{ id:'k1704', m:17, q:'Ao ler um DER pronto, em que ordem olhar para entender rápido?',
  a:`<ol><li><strong>Retângulos duplos</strong> — entidades fracas, que denunciam dependência de identidade.</li>
     <li><strong>Losangos que voltam</strong> — auto-relacionamentos.</li>
     <li><strong>Triângulos</strong> — especializações.</li>
     <li><strong>Elipses duplas</strong> — multivalorados, que vão virar tabela.</li>
     <li>Só então as <strong>cardinalidades</strong>, uma a uma.</li></ol>
     <p>Os quatro primeiros são poucos e mudam o modelo inteiro; deixá-los por último é o jeito de perder tempo.</p>` },
{ id:'k1705', m:17, q:'O que é <strong>engenharia reversa</strong> de um relatório ou planilha?',
  a:`<p>É partir de um documento pronto — nota fiscal, boletim, planilha — e recuperar o modelo por trás dele.</p>
     <p>O método: cada <strong>bloco que se repete</strong> no documento é uma entidade ou um N:N; cada <strong>campo que se repete igual</strong> em várias linhas é candidato a sair para outra tabela; e o que varia linha a linha fica onde está.</p>` }

);

/* =========================================================================
   CONTEXTO E RESPOSTA CURTA DOS CARDS ACIMA
   ========================================================================= */

Object.assign(CARDS_EXTRA, {

k0701: { c: 'Um enunciado de clínica cita "paciente", "consulta", "sintoma", "CRM" e "convênio". Você tem cinco minutos para decidir o que vira retângulo.',
         s: 'Tem atributos próprios, existe sozinha e tem várias ocorrências a distinguir? Então é entidade.' },
k0702: { c: 'O cadastro pede "endereço completo". Na tela é um campo só; no banco você precisa filtrar por cidade.',
         s: 'Composto é o atributo que se divide em partes com significado — e no relacional cada parte vira coluna.' },
k0703: { c: 'O enunciado diz que o médico "possui uma ou mais especialidades". Você está com a caneta na mão decidindo o desenho.',
         s: 'Plural e expressões de variedade denunciam multivalorado — elipse dupla, e tabela nova no relacional.' },
k0704: { c: 'Alguém sugere resolver as especialidades com uma coluna de texto: "Cardiologia, Clínica Geral".',
         s: 'Quebra a 1FN e, pior, mata a consulta: buscar por especialidade vira caça a pedaço de texto.' },
k0705: { c: 'O sistema guarda a idade do paciente. Um ano depois, todo mundo continua com a mesma idade cadastrada.',
         s: 'Derivado é o que se calcula a partir de outro dado — guardar cria duas verdades que discordam.' },

k0801: { c: 'A tabela de clientes tem CPF único e e-mail único. Só uma das duas vai ser a chave primária.',
         s: 'Candidata é quem poderia; primária é a eleita; secundária são as candidatas que sobraram.' },
k0802: { c: 'Você vai criar a tabela de filmes e precisa decidir entre usar o título original ou um id numérico.',
         s: 'Use artificial quando o valor natural pode mudar, pode repetir ou é grande demais para viajar como FK.' },
k0803: { c: 'Você acabou de criar a tabela que nasceu de um N:N e está decidindo qual coluna é a chave.',
         s: 'Chave composta é obrigatória em N:N, em multivalorado e em entidade fraca.' },
k0804: { c: 'Numa revisão de modelo, alguém pergunta por que a mesma coluna aparece sublinhada e marcada como FK.',
         s: 'Quando a identidade da linha depende do que ela referencia, a FK entra na PK.' },
k0805: { c: 'Um colega quer cadastrar um cliente sem CPF "por enquanto", deixando a chave em branco.',
         s: 'Nulo significa desconhecido, e não se identifica uma linha por um valor desconhecido.' },

k0901: { c: 'Você está diante da linha "o cliente faz pedidos" e precisa escrever 1 ou N nas duas pontas.',
         s: 'Pergunte uma vez de cada lado, no singular contra o plural — e responda as duas antes de decidir.' },
k0902: { c: 'O modelo diz CLIENTE 1:N PEDIDO. O chefe pergunta se é possível cadastrar cliente sem nenhum pedido.',
         s: 'Cardinalidade diz quantos; participação diz se é obrigatório ter.' },
k0903: { c: 'Aluno, disciplina e a nota. Você olha para os três e não sabe em qual retângulo pendurar a nota.',
         s: 'Se o valor muda quando o par muda, ele é do relacionamento — não das entidades.' },
k0904: { c: 'Você tenta colocar a FK do filme dentro da tabela de atores e percebe que só cabe um filme por ator.',
         s: 'Não existe onde pôr a FK num N:N — por isso ele sempre vira tabela.' },
k0905: { c: 'FUNCIONARIO e CRACHA, um para um. As duas tabelas estão prontas e falta decidir onde vai a chave.',
         s: 'A FK vai para o lado que obrigatoriamente participa, para não gerar coluna cheia de nulos.' },

k1001: { c: 'A prova mostra um losango saindo de DISCIPLINA e voltando nela, com N nas duas pontas, e pergunta o grau.',
         s: 'Grau conta entidades ligadas; cardinalidade conta ocorrências. São eixos independentes.' },
k1002: { c: 'Cada funcionário tem um supervisor, que também é funcionário. Você precisa escrever a tabela.',
         s: 'A FK entra na própria tabela, apontando para a PK dela mesma, com nome de papel.' },
k1003: { c: 'Uma disciplina pode ter até três pré-requisitos, e ser pré-requisito de várias outras.',
         s: 'Vira tabela como todo N:N — só que as duas FKs apontam para a mesma tabela, com nomes diferentes.' },
k1004: { c: 'Na tabela de citações existe a linha (12, 7). Alguém pergunta se ela também significa que 7 cita 12.',
         s: 'Se o relacionamento tem direção, o par é ordenado: (A,B) não é (B,A).' },
k1101: { c: 'Item de nota fiscal: o item 3 da nota 5 e o item 3 da nota 9 são coisas diferentes.',
         s: 'Fraca é a entidade sem identificador próprio — a chave do dono entra na PK dela.' },
k1102: { c: 'A matrícula tem nota e data, e agora precisa registrar também qual professor avaliou.',
         s: 'É o N:N que ganhou atributos e vira entidade para poder se relacionar com uma terceira.' },
k1103: { c: 'Duas tabelas parecidas no diagrama: uma é entidade fraca, a outra é só um 1:N comum.',
         s: 'Pergunte se o registro faz sentido sozinho — e olhe se a chave do dono entrou ou não na PK.' },

k1201: { c: 'O enunciado diz: "cada filme tem título original e, se for estrangeiro, também o título em português".',
         s: 'Atributo que só vale para parte das ocorrências pede especialização — o "se" é a pista.' },
k1202: { c: 'Uma equipe partiu de FUNCIONARIO e achou VENDEDOR; outra partiu de CARRO e MOTO e achou VEICULO.',
         s: 'Mesma estrutura, direções opostas: especialização desce, generalização sobe.' },
k1203: { c: 'Chegou a hora de escrever as tabelas da especialização e existem dois caminhos no material.',
         s: 'Tabelas separadas quando há muitos atributos próprios; tabela única quando há poucos.' },
k1204: { c: 'Você escreve DIRETOR(ID_ATOR) e para, achando que esqueceu de escrever o resto.',
         s: 'Especialização sem atributo próprio vira tabela de uma coluna — a informação é a linha existir.' },
k1205: { c: 'O relacionamento "aluno cursa disciplina" precisa, ele próprio, apontar para uma avaliação.',
         s: 'Agregação é tratar um relacionamento inteiro como entidade para que ele participe de outro.' },

k1301: { c: 'Um pedido é gravado com cod_cliente 999. Não existe cliente 999 no cadastro.',
         s: 'A regra garante que toda FK aponte para uma PK existente — ou seja nula.' },
k1302: { c: 'Questão objetiva pede as integridades básicas e três das quatro alternativas parecem certas.',
         s: 'Entidade (PK não nula nem repetida), referencial (FK válida) e domínio (tipo e faixa).' },
k1303: { c: 'Alguém tenta excluir um cliente que tem trinta pedidos lançados.',
         s: 'RESTRICT recusa, CASCADE apaga junto, SET NULL desliga — e o significado do relacionamento decide.' },

k1401: { c: 'Você tem o DER pronto e uma folha em branco para escrever as tabelas. É a hora mais mecânica da prova.',
         s: 'Entidade vira tabela, composto achata, multivalorado vira tabela, 1:N desce FK, N:N vira tabela.' },
k1402: { c: 'A questão pergunta quantas tabelas o modelo terá, e você precisa contar sem desenhar.',
         s: 'N:N, multivalorado e especialização sempre geram tabela; 1:N nunca gera.' },
k1403: { c: 'Duas FKs no seu modelo: uma está sublinhada, a outra não, e você precisa justificar a diferença.',
         s: 'A pergunta é se a coluna ajuda a identificar a linha — no 1:N não ajuda, na fraca ajuda.' },
k1404: { c: 'Um losango liga MEDICO, PACIENTE e SALA ao mesmo tempo.',
         s: 'Vira tabela com as três FKs, PK composta pelas três — mas antes verifique se não é uma entidade.' },

k1501: { c: 'O enunciado pede que o público das sessões seja registrado diariamente. Sua chave hoje é (cinema, horário).',
         s: 'Quando o enunciado fala em dia, histórico ou repetição, a data entra na chave.' },
k1502: { c: 'O modelo estava pronto e aprovado. Aí o cliente pede o histórico de preços dos últimos três anos.',
         s: 'O tempo promove atributo a entidade, 1:N a N:N, e faz a chave crescer.' },
k1503: { c: 'Duas turmas leram o mesmo enunciado de universidade e entregaram cardinalidades diferentes.',
         s: 'A expressão "em um dado instante" é o que decide entre guardar o estado atual e guardar o histórico.' },
k1504: { c: 'Você propõe guardar histórico de tudo. O DBA pergunta quem vai consultar isso e com que frequência.',
         s: 'Custa tamanho e complexidade de consulta — só vale onde alguém realmente vai perguntar sobre o passado.' },

k1601: { c: 'Uma planilha bagunçada na sua frente e a instrução "normalize até a 3FN". Você precisa de um roteiro.',
         s: 'Repete dentro da linha? Depende de parte da chave? Depende de outra coluna não-chave?' },
k1602: { c: 'Você olha uma tabela com chave simples e fica procurando dependência parcial nela.',
         s: 'Sem chave composta não existe "parte da chave" — logo, 1FN com chave simples já está em 2FN.' },
k1603: { c: 'Em PEDIDO você vê nr_pedido, cod_cliente e nome_cliente lado a lado.',
         s: 'Chave → coluna → outra coluna: a 3FN corta o elo do meio e manda a ponta para outra tabela.' },
k1604: { c: 'O chefe pergunta por que gastar tempo normalizando se a planilha atual "funciona".',
         s: 'Para eliminar as anomalias de atualização, inserção e exclusão — não pela estética.' },
k1605: { c: 'Um relatório com dez milhões de linhas leva quatro minutos por causa de cinco junções.',
         s: 'Vale desnormalizar com motivo medido — depois de normalizar, nunca no lugar de normalizar.' },
k1606: { c: 'Você tenta identificar dependência parcial numa tabela que ainda tem um campo com três valores dentro.',
         s: 'A ordem 1FN → 2FN → 3FN não é decorativa: cada forma pressupõe a anterior resolvida.' },

k1701: { c: 'Enunciado de duas páginas, folha em branco, e a sensação de não saber por onde começar.',
         s: 'Substantivos e verbos, elimine atributos, identificadores, cardinalidade, de quem é cada atributo, casos especiais, desenhe.' },
k1702: { c: 'Faltam dez minutos de prova e o modelo está pronto. Sobra tempo para uma conferência só.',
         s: 'Releia as consultas pedidas e responda cada uma pelas suas tabelas — se alguma não fecha, o modelo está errado.' },
k1703: { c: 'Você compara sua resolução com a do colega. São diferentes, e nenhum dos dois achou erro no outro.',
         s: 'Modelagem tem escolha — mas cardinalidade contrariando o enunciado e consulta impossível não são escolha.' },
k1704: { c: 'A questão mostra um DER cheio e pergunta uma coisa só. Você tem dois minutos.',
         s: 'Retângulos duplos, losangos que voltam, triângulos, elipses duplas — e só então as cardinalidades.' },
k1705: { c: 'O professor entrega uma nota fiscal impressa e pede o modelo que a produziu.',
         s: 'Bloco que se repete vira entidade ou N:N; campo que se repete igual sai para outra tabela.' }

});

/* =========================================================================
   QUESTÕES CONCEITUAIS
   ========================================================================= */

QUESTIONS.push(

/* ── 7 ── */
{ id:'w0701', m:7, q:'Uma clínica registra, para cada médico, "uma ou mais especialidades". Como isso deve aparecer no DER?',
  o:['Como atributo simples de MEDICO','Como atributo multivalorado de MEDICO','Como entidade fraca ligada a MEDICO','Como atributo composto de MEDICO'],
  c:1, e:'"Uma ou mais" é a marca do <strong>multivalorado</strong>: elipse dupla no DER. No mapeamento vira MEDICO_ESPECIALIDADE(crm, especialidade), com PK composta. Não é composto porque as especialidades não são <em>partes</em> de um valor único — são valores diferentes do mesmo tipo.' },
{ id:'w0702', m:7, q:'"Cada apartamento tem um endereço com rua, número, bloco e CEP." Que tipo de atributo é o endereço?',
  o:['Multivalorado','Derivado','Composto','Identificador'],
  c:2, e:'<strong>Composto</strong>: um único endereço subdividido em partes com significado próprio. No relacional ele se achata em quatro colunas e o atributo-pai some. A diferença para o multivalorado é que ali há vários valores; aqui há um só, repartido.' },
{ id:'w0703', m:7, q:'O sistema guarda "idade do aluno" como coluna. Qual é o problema técnico disso?',
  o:['Idade não pode ser número inteiro','É atributo derivado: envelhece sozinho e cria duas verdades','Viola a 2FN','Impede a criação de chave primária'],
  c:1, e:'Idade é <strong>derivada</strong> da data de nascimento. Guardada, ela fica desatualizada no dia seguinte ao aniversário, e o banco passa a ter duas respostas para a mesma pergunta. O certo é guardar a data e calcular a idade na consulta.' },

/* ── 8 ── */
{ id:'w0801', m:8, q:'Numa tabela nascida de um relacionamento N:N entre PRODUTO e FORNECEDOR, qual é a chave primária?',
  o:['O código do produto','O código do fornecedor','A combinação dos dois códigos','Um id sequencial obrigatoriamente'],
  c:2, e:'É o <strong>par</strong> que identifica a linha: o mesmo produto aparece com vários fornecedores e o mesmo fornecedor com vários produtos. PK composta pelas duas FKs. Um id sequencial é permitido como alternativa prática, mas a chave conceitualmente correta é o par.' },
{ id:'w0802', m:8, q:'Uma tabela tem CPF e e-mail, ambos únicos e não nulos. O CPF foi eleito chave primária. O que é o e-mail?',
  o:['Chave estrangeira','Chave candidata que virou secundária','Chave composta','Atributo comum, sem status de chave'],
  c:1, e:'Os dois eram <strong>candidatos</strong>. Eleito o CPF como primária, o e-mail permanece candidato não eleito — a chave <strong>secundária</strong> (ou alternativa). Ele continua com restrição de unicidade, mas não identifica oficialmente a linha.' },
{ id:'w0803', m:8, q:'Em qual destas situações a chave estrangeira faz parte da chave primária?',
  o:['Num 1:N comum, no lado N','Numa entidade fraca','Sempre que existir FK','Nunca — FK e PK são conceitos separados'],
  c:1, e:'Na <strong>entidade fraca</strong>, a chave do dono entra na PK porque sem ela a linha não se identifica. Num 1:N comum a FK entra na tabela mas fica <em>fora</em> da chave — o lado N já tem identidade própria. Essa é a distinção mais cobrada entre os dois casos.' },

/* ── 9 ── */
{ id:'w0901', m:9, q:'"Um autor pode escrever vários livros e um livro pode ter vários autores." Quantas tabelas nascem desse trecho?',
  o:['Uma','Duas','Três','Quatro'],
  c:2, e:'<strong>Três</strong>: AUTOR, LIVRO e a tabela do N:N — AUTORIA(id_autor, id_livro). Quem responde "duas" esqueceu que N:N não tem onde guardar a FK; quem responde "quatro" está criando tabela para relacionamento que não existe.' },
{ id:'w0902', m:9, q:'Numa locadora, LOCACAO registra data e valor. Um cliente faz várias locações; cada locação é de um cliente. Onde fica a FK?',
  o:['Em CLIENTE, apontando para LOCACAO','Em LOCACAO, apontando para CLIENTE','Numa terceira tabela','Nos dois lados, para garantir integridade'],
  c:1, e:'Regra do 1:N: a chave do <strong>lado 1</strong> desce como FK para o <strong>lado N</strong>. LOCACAO recebe o CPF do cliente. Se a FK fosse em CLIENTE, cada cliente comportaria uma única locação. E FK dos dois lados criaria redundância com risco de contradição.' },
{ id:'w0903', m:9, q:'O que a notação (0,N) numa das pontas de um relacionamento indica?',
  o:['Que o relacionamento é opcional e comporta muitas ocorrências','Que a cardinalidade é sempre zero','Que o relacionamento é N:N','Que a entidade não tem chave primária'],
  c:0, e:'O par é <strong>(mínimo, máximo)</strong>. O zero indica <strong>participação opcional</strong> — a entidade pode existir sem participar. O N indica que, participando, pode ser muitas vezes. Um cliente que ainda não comprou nada é exatamente o caso (0,N).' },
{ id:'w0904', m:9, q:'A "nota" de um aluno numa disciplina deve ser atributo de quê?',
  o:['ALUNO','DISCIPLINA','Do relacionamento entre os dois','De uma entidade nova chamada NOTA'],
  c:2, e:'Teste da pergunta: <em>o valor muda quando o par muda?</em> Muda — o mesmo aluno tem notas diferentes em disciplinas diferentes. Logo é atributo do <strong>relacionamento</strong>, e vai para a tabela que nasce dele: HISTORICO(matricula, cod_disc, data, nota).' },

/* ── 10 ── */
{ id:'w1001', m:10, q:'Um losango sai de FUNCIONARIO e volta para FUNCIONARIO, com 1 numa ponta e N na outra. Qual é o grau e a cardinalidade?',
  o:['Grau 2, cardinalidade 1:N','Grau 1, cardinalidade 1:N','Grau 1, cardinalidade N:N','Grau 3, cardinalidade 1:N'],
  c:1, e:'<strong>Grau 1</strong> porque liga uma entidade só (auto-relacionamento); <strong>1:N</strong> porque um supervisor tem vários supervisionados e cada um tem um supervisor. Grau e cardinalidade são eixos independentes — a questão mistura os dois de propósito.' },
{ id:'w1002', m:10, q:'Como se mapeia o auto-relacionamento 1:N de supervisão entre funcionários?',
  o:['Cria-se a tabela SUPERVISAO com duas FKs','A FK cod_supervisor entra na própria tabela FUNCIONARIO','Cria-se uma segunda tabela FUNCIONARIO_SUPERVISOR','Não é possível mapear auto-relacionamento'],
  c:1, e:'É um <strong>1:N como qualquer outro</strong> — e 1:N nunca gera tabela. A FK entra na própria FUNCIONARIO apontando para a PK dela mesma, com nome de papel. Tabela intermediária só seria necessária se a supervisão fosse N:N.' },
{ id:'w1003', m:10, q:'Numa tabela PRE_REQUISITO(cod_disc, cod_disc_exigida), por que as duas colunas têm nomes diferentes se apontam para a mesma tabela?',
  o:['Por convenção estética','Porque duas colunas de mesmo nome não podem coexistir, e os papéis são diferentes','Porque uma é PK e a outra é FK','Porque o SGBD não permite duas FKs para a mesma tabela'],
  c:1, e:'Duas razões, e as duas valem. Tecnicamente, colunas homônimas não coexistem na mesma tabela. Conceitualmente, elas representam <strong>papéis diferentes</strong>: quem exige e quem é exigida. É o que dá direção ao par — (A,B) não é (B,A).' },

/* ── 11 ── */
{ id:'w1101', m:11, q:'ITEM_NOTA é identificado pelo número da nota mais o número sequencial do item. Que estrutura é essa?',
  o:['Entidade associativa','Entidade fraca','Especialização','Agregação'],
  c:1, e:'<strong>Entidade fraca</strong>: ela não tem identificador próprio. O item 3 só é "item 3" dentro de uma nota específica. Por isso a chave da nota entra na PK do item — retângulo duplo no DER, chave composta no relacional.' },
{ id:'w1102', m:11, q:'Qual é a diferença prática entre uma entidade fraca e uma entidade ligada por 1:N comum?',
  o:['A fraca tem menos atributos','Na fraca, a chave do dono entra na PK; no 1:N comum, a FK fica fora da PK','A fraca não pode ter chave estrangeira','Não há diferença no modelo relacional'],
  c:1, e:'A diferença aparece exatamente na <strong>chave</strong>. Na fraca, a chave transposta é parte da identidade e entra na PK. No 1:N comum ela é apenas informação e fica de fora. "Fraca" não tem relação com quantidade de atributos nem com importância.' },
{ id:'w1103', m:11, q:'Um N:N entre ALUNO e DISCIPLINA ganhou nota, data e agora precisa apontar para o PROFESSOR que avaliou. O que aconteceu?',
  o:['O relacionamento virou entidade associativa','O relacionamento virou 1:N','O modelo ficou inválido','Nasceu um relacionamento ternário obrigatório'],
  c:0, e:'Quando um relacionamento N:N com atributos precisa participar de <strong>outro</strong> relacionamento, ele é promovido a <strong>entidade associativa</strong>. Passa a ter chave própria e pode ser referenciado como qualquer entidade. É o mesmo mecanismo que se chama agregação em outra notação.' },

/* ── 12 ── */
{ id:'w1201', m:12, q:'"Cada publicação tem abstract e autores; as editadas pelo grupo guardam ainda número, valor e datas do contrato." Que estrutura o trecho pede?',
  o:['Atributo multivalorado','Especialização de PUBLICACAO','Entidade fraca','Relacionamento ternário'],
  c:1, e:'Atributos que só valem para <strong>parte</strong> das ocorrências pedem <strong>especialização</strong>. Se contrato, valor e datas ficassem na PUBLICACAO geral, seriam nulos em todas as publicações externas. Nasce PUBLICACAO_GRUPO_PESQUISA, e o CONTRATO liga só nela.' },
{ id:'w1202', m:12, q:'Como fica no relacional uma especialização que não tem nenhum atributo próprio?',
  o:['Ela é descartada — não vira tabela','Vira tabela de uma coluna, que é PK e FK ao mesmo tempo','Vira coluna booleana na tabela geral, obrigatoriamente','Vira tabela com todas as colunas da entidade geral copiadas'],
  c:1, e:'Vira uma tabela de <strong>uma coluna só</strong> — <code>DIRETOR(id_ator)</code> — que é PK e FK simultaneamente. A informação é a <em>existência</em> da linha: quem está lá pertence ao subconjunto. Uma coluna booleana na tabela geral é alternativa válida na forma de tabela única, mas não é a forma que a disciplina cobra.' },
{ id:'w1203', m:12, q:'Partindo de CARRO e MOTO e percebendo que ambos são VEICULO, você fez:',
  o:['Especialização','Generalização','Agregação','Normalização'],
  c:1, e:'<strong>Generalização</strong> é o movimento de baixo para cima: dos casos concretos para a categoria comum. Especialização é o inverso — partir de VEICULO e descobrir os subtipos. O DER final é idêntico; muda só o caminho percorrido.' },

/* ── 13 ── */
{ id:'w1301', m:13, q:'O que a integridade referencial impede que aconteça?',
  o:['Que duas linhas tenham a mesma chave primária','Que uma FK aponte para uma PK que não existe','Que um campo receba texto onde se espera número','Que a tabela fique sem chave primária'],
  c:1, e:'Cada integridade cuida de uma coisa. <strong>Referencial</strong> garante que a FK aponte para PK existente (ou seja nula). PK duplicada é integridade <strong>de entidade</strong>; tipo errado é integridade <strong>de domínio</strong>.' },
{ id:'w1302', m:13, q:'Numa nota fiscal e seus itens, qual regra de exclusão faz mais sentido para a FK dos itens?',
  o:['RESTRICT — impedir que a nota seja apagada','CASCADE — apagar os itens junto com a nota','SET NULL — deixar os itens sem nota','SET DEFAULT — apontar para uma nota padrão'],
  c:1, e:'Item de nota é <strong>entidade fraca</strong>: sem a nota ele não existe. <strong>CASCADE</strong> é a escolha coerente. SET NULL seria absurdo (item órfão não significa nada) e RESTRICT deixaria notas impossíveis de apagar. A regra sai do significado do relacionamento.' },

/* ── 14 ── */
{ id:'w1401', m:14, q:'Um modelo tem 4 entidades, 3 relacionamentos 1:N, 1 relacionamento N:N e 1 atributo multivalorado. Quantas tabelas terá o modelo relacional?',
  o:['4','5','6','8'],
  c:2, e:'<strong>6</strong>: as 4 entidades, mais 1 do N:N, mais 1 do multivalorado. Os três 1:N <strong>não</strong> geram tabela — apenas deslocam a chave do lado 1 para o lado N. Este é o cálculo mais cobrado do módulo.' },
{ id:'w1402', m:14, q:'No mapeamento de um relacionamento 1:1 entre FUNCIONARIO (todos têm crachá) e CRACHA (alguns não foram emitidos), onde vai a FK?',
  o:['Em FUNCIONARIO','Em CRACHA','Em qualquer um dos dois, é indiferente','Numa tabela intermediária'],
  c:0, e:'A FK vai para o lado de <strong>participação total</strong> — aquele que sempre participa. Todo funcionário tem crachá, então a coluna <code>nr_cracha</code> em FUNCIONARIO nunca fica nula. Se a FK fosse em CRACHA, os crachás ainda não emitidos ficariam com a coluna vazia. A regra em uma frase: <em>ponha a FK onde ela não vai ser nula</em>.' },
{ id:'w1403', m:14, q:'O que acontece com um atributo composto durante o mapeamento?',
  o:['Vira uma tabela nova','Cada parte vira uma coluna e o atributo-pai desaparece','É mantido como um campo de texto único','Vira chave composta da tabela'],
  c:1, e:'Ele <strong>se achata</strong>: endereço vira rua, numero, bairro, cidade e uf como colunas independentes, e o nome "endereço" some do modelo relacional. Quem vira tabela é o <strong>multivalorado</strong> — a confusão entre os dois é o erro clássico aqui.' },

/* ── 15 ── */
{ id:'w1501', m:15, q:'"O público de cada sessão deve ser registrado diariamente." Qual é a consequência para a chave de SESSAO?',
  o:['Nenhuma — basta uma coluna publico','A data precisa entrar na chave primária','A sessão vira entidade fraca','O público vira atributo derivado'],
  c:1, e:'Sem a <strong>data na chave</strong>, a sessão das 20h teria uma única linha e cada novo dia sobrescreveria o anterior. A totalização histórica que o enunciado pede ficaria impossível. É a regra de ouro do aspecto temporal: enunciado que fala em dia ou histórico manda a data para dentro da chave.' },
{ id:'w1502', m:15, q:'O enunciado diz que "um aluno só pode estar ligado a um curso em um dado instante". O que essa expressão determina?',
  o:['Que o relacionamento é N:N com data','Que o relacionamento é 1:N e guarda apenas o estado atual','Que o aluno é entidade fraca do curso','Que o curso é atributo multivalorado do aluno'],
  c:1, e:'"Em um dado instante" diz que o modelo guarda a <strong>foto atual</strong>, não o histórico — logo, 1:N com FK em ALUNO. Se o enunciado pedisse o histórico de cursos, viraria N:N com data na chave. Uma expressão de quatro palavras decide a estrutura.' },
{ id:'w1503', m:15, q:'O sistema precisa passar a guardar o histórico de preços dos produtos. O que acontece com o atributo preco?',
  o:['Continua coluna de PRODUTO, com um gatilho de auditoria','Vira entidade própria, com data na chave','Vira atributo derivado','Vira atributo multivalorado simples'],
  c:1, e:'O tempo <strong>promove atributo a entidade</strong>: nasce HISTORICO_PRECO(id_produto, data_inicio, valor). Sem isso, cada reajuste apaga o preço anterior. Gatilho de auditoria guarda log, mas não torna o histórico consultável pelo modelo — que é o que o requisito pede.' },

/* ── 16 ── */
{ id:'w1601', m:16, q:'A coluna "telefones" guarda "11 98888-1111 / 11 3222-4444". Qual forma normal está violada?',
  o:['1FN','2FN','3FN','Nenhuma — é uma coluna de texto válida'],
  c:0, e:'<strong>1FN</strong>: o campo não é atômico. O prejuízo é concreto — buscar por um telefone vira busca por pedaço de texto, sem índice e com falso positivo. A correção é CLIENTE_FONE(cpf, fone), com PK composta.' },
{ id:'w1602', m:16, q:'Em ITEM_PEDIDO(<u>nr_pedido, cod_produto</u>, quantidade, nome_produto), qual é o problema?',
  o:['Violação de 1FN','Violação de 2FN: nome_produto depende só de cod_produto','Violação de 3FN: nome_produto depende de quantidade','Nenhum problema'],
  c:1, e:'A chave é composta e <code>nome_produto</code> depende <strong>só de cod_produto</strong> — metade da chave. Isso é <strong>dependência parcial</strong>, que é exatamente o que a 2FN proíbe. O nome vai para a tabela PRODUTO; a quantidade fica, porque depende do par inteiro.' },
{ id:'w1603', m:16, q:'Em PEDIDO(<u>nr_pedido</u>, cod_cliente, nome_cliente, cidade_cliente), qual é a violação?',
  o:['1FN, por ter colunas demais','2FN, por dependência parcial','3FN, por dependência transitiva','Nenhuma — a chave é simples'],
  c:2, e:'A chave é simples, então não há como violar a 2FN. Mas <code>nome_cliente</code> e <code>cidade_cliente</code> dependem de <code>cod_cliente</code>, que depende do pedido: <strong>chave → coluna → coluna</strong>. Dependência transitiva, proibida na <strong>3FN</strong>. As duas saem para CLIENTE.' },
{ id:'w1604', m:16, q:'Uma tabela em 1FN com chave primária simples está automaticamente em qual forma normal?',
  o:['1FN apenas','2FN','3FN','Nenhuma conclusão é possível'],
  c:1, e:'Está em <strong>2FN</strong> automaticamente: a 2FN proíbe depender de <em>parte</em> da chave, e chave de uma coluna só não tem partes. Mas cuidado — ela ainda pode violar a <strong>3FN</strong> por dependência transitiva, como no caso do nome do cliente dentro do pedido.' },
{ id:'w1605', m:16, q:'Qual destes é um problema real que a normalização resolve?',
  o:['Deixar o diagrama mais bonito','Reduzir o número de tabelas do sistema','Evitar que a mudança de um dado precise ser repetida em muitas linhas','Acelerar todas as consultas do sistema'],
  c:2, e:'É a <strong>anomalia de atualização</strong>: com o nome do cliente repetido em oitenta pedidos, trocar o nome exige oitenta alterações e uma sempre fica para trás. Note que normalizar <em>aumenta</em> o número de tabelas e pode <em>desacelerar</em> consultas que passam a exigir junções — o ganho é consistência, não velocidade.' },

/* ── 17 ── */
{ id:'w1701', m:17, q:'Você terminou o modelo e sobraram cinco minutos de prova. Qual é a conferência mais eficiente?',
  o:['Redesenhar o DER com régua','Reler as consultas pedidas e responder cada uma pelas suas tabelas','Contar se o número de tabelas bate com o de entidades','Verificar a ortografia dos nomes das colunas'],
  c:1, e:'As <strong>consultas pedidas</strong> são o requisito real. Se alguma delas não puder ser respondida pelas suas tabelas, ou exigir vasculhar texto solto, o modelo tem defeito estrutural. É o teste mais rápido e o que mais pega erro grave.' },
{ id:'w1702', m:17, q:'Dois alunos entregaram modelos diferentes para o mesmo enunciado e nenhum tem erro de cardinalidade. Isso é possível?',
  o:['Não — todo enunciado tem um único modelo correto','Sim — decisões como criar entidade intermediária ou usar N:N direto são escolhas legítimas','Sim, mas apenas se um deles estiver desnormalizado','Não — significa que o enunciado está mal escrito'],
  c:1, e:'Modelagem admite escolha. No caso do cinema, a sala usou SESSÃO como entidade fraca e o autor ligou CINEMA N:N FILME com os atributos no losango — os dois guardam a mesma informação. O que <em>não</em> é escolha: cardinalidade contra o enunciado, multivalorado virando coluna com vírgula, e consulta pedida que o modelo não responde.' },
{ id:'w1703', m:17, q:'Ao receber um DER pronto numa questão, o que compensa procurar primeiro?',
  o:['As cardinalidades, uma por uma','Retângulos duplos, losangos que voltam, triângulos e elipses duplas','Os nomes dos atributos','A quantidade total de entidades'],
  c:1, e:'Esses quatro símbolos são <strong>poucos e decisivos</strong>: entidade fraca, auto-relacionamento, especialização e multivalorado mudam o modelo relacional inteiro. As cardinalidades são muitas e você confere depois, guiado pelo que já entendeu da estrutura.' },
{ id:'w1704', m:17, q:'Um enunciado diz que a universidade "comporta 5000 alunos e oferece 10 cursos". Como isso entra no modelo?',
  o:['Como restrição de cardinalidade no DER','Como atributo de uma entidade UNIVERSIDADE','Não entra: é dimensionamento, não regra estrutural','Como chave composta de CURSO'],
  c:2, e:'É <strong>dimensionamento</strong> — serve ao DBA para estimar tamanho de tabela, planejar índices e storage. Não muda uma linha do DER. Enunciados longos costumam misturar de propósito o que vira estrutura, o que vira validação da aplicação e o que é só contexto.' },
{ id:'w1705', m:17, q:'Numa nota fiscal impressa, o cabeçalho aparece uma vez e o bloco de itens se repete. O que isso indica sobre o modelo por trás?',
  o:['Que existe uma tabela só, com colunas repetidas','Que o cabeçalho é uma entidade e os itens são uma entidade fraca ligada a ela','Que os itens são atributo multivalorado do cabeçalho','Que a nota é uma entidade associativa'],
  c:1, e:'Na engenharia reversa, <strong>bloco que se repete dentro do documento</strong> denuncia uma entidade filha. Os itens têm atributos próprios (produto, quantidade, valor) e não se identificam sem a nota — entidade <strong>fraca</strong>, com a chave da nota dentro da PK. Multivalorado seria o caso se o bloco tivesse um único campo.' }

);

/* =========================================================================
   CENÁRIO E EXPLICAÇÃO SIMPLES DAS QUESTÕES ACIMA
   ========================================================================= */

Object.assign(QUIZ_EXTRA, {

w0701: { c: 'Você está modelando a clínica. O Dr. Almeida é cardiologista e clínico geral; a Dra. Souza é só pediatra.',
         s: '"Uma ou mais" é multivalorado: elipse dupla agora, tabela nova no mapeamento.' },
w0702: { c: 'A imobiliária quer filtrar apartamentos por bairro. Hoje o endereço é um campo de texto só.',
         s: 'Um valor só, dividido em partes — composto, e no relacional cada parte vira coluna.' },
w0703: { c: 'O sistema foi entregue em março com a idade de cada aluno gravada. Em novembro os números não batem mais.',
         s: 'Idade se calcula da data de nascimento — guardar cria uma verdade que envelhece.' },

w0801: { c: 'A tabela liga produtos a fornecedores. O parafuso vem de três fornecedores; um deles vende dez produtos.',
         s: 'Num N:N quem identifica é o par — os dois códigos juntos.' },
w0802: { c: 'O cadastro exige CPF e e-mail, os dois únicos. Só um deles pode ir sublinhado no modelo.',
         s: 'Os dois eram candidatos; a que não foi eleita fica como chave secundária.' },
w0803: { c: 'Você está sublinhando as chaves e encontra uma coluna que é FK. Precisa decidir se ela entra na PK.',
         s: 'Entra quando a identidade da linha depende do dono — ou seja, na entidade fraca.' },

w0901: { c: 'O enunciado da editora tem uma frase só sobre autores e livros, e a questão pergunta o total de tabelas.',
         s: 'Duas entidades mais a tabela do N:N: três.' },
w0902: { c: 'As duas tabelas já estão desenhadas. Falta uma seta, e ela só pode ir para um lado.',
         s: 'No 1:N a chave do lado 1 desce para o lado N.' },
w0903: { c: 'O diagrama traz (0,N) do lado do cliente. Existe cliente cadastrado que nunca comprou nada.',
         s: 'O par é (mínimo, máximo): zero quer dizer que participar é opcional.' },
w0904: { c: 'Aluno, disciplina e a nota. Pendurar a nota no aluno faria dele um aluno de nota única.',
         s: 'Se o valor muda quando o par muda, o atributo é do relacionamento.' },

w1001: { c: 'A prova mostra o losango de supervisão e pergunta duas coisas na mesma alternativa.',
         s: 'Uma entidade só ligada, então grau 1 — e as pontas dizem 1:N.' },
w1002: { c: 'Você vai escrever a tabela FUNCIONARIO e precisa decidir se cria uma segunda tabela para a supervisão.',
         s: 'É um 1:N como qualquer outro, e 1:N nunca gera tabela.' },
w1003: { c: 'Você escreve PRE_REQUISITO e percebe que ia chamar as duas colunas de cod_disc.',
         s: 'Nomes diferentes porque os papéis são diferentes — e porque colunas homônimas não coexistem.' },

w1101: { c: 'Duas notas fiscais na mesa. As duas têm um "item 3", e são produtos completamente diferentes.',
         s: 'Sem identificador próprio, identificada pela chave do dono mais um sequencial: entidade fraca.' },
w1102: { c: 'Duas tabelas com FK. Numa a coluna está sublinhada, na outra não, e você precisa explicar por quê.',
         s: 'Na fraca a chave do dono entra na PK; no 1:N comum fica de fora.' },
w1103: { c: 'O sistema de notas já funcionava. Agora pediram para registrar qual professor lançou cada nota.',
         s: 'Relacionamento que precisa participar de outro relacionamento vira entidade.' },

w1201: { c: 'Metade das publicações tem contrato de pesquisa; a outra metade deixaria essas colunas nulas.',
         s: 'Atributo que só vale para parte das ocorrências pede especialização.' },
w1202: { c: 'Você escreve DIRETOR(ID_ATOR) e a linha parece incompleta.',
         s: 'Tabela de uma coluna, PK e FK ao mesmo tempo — a informação é a linha existir.' },
w1203: { c: 'A equipe começou modelando carros e motos separados, e depois juntou o que era comum.',
         s: 'De baixo para cima é generalização; de cima para baixo é especialização.' },

w1301: { c: 'O sistema gravou um pedido para o cliente 999. Ninguém sabe quem é o cliente 999.',
         s: 'Integridade referencial é a que exige que a FK aponte para uma PK que existe.' },
w1302: { c: 'A nota fiscal 4021 foi cancelada. Restam sete itens apontando para ela.',
         s: 'Item de nota não existe sem a nota — CASCADE é a regra coerente aqui.' },

w1401: { c: 'A questão dá o resumo do modelo e pede o número de tabelas, sem desenhar nada.',
         s: 'Some entidades, N:N e multivalorados. Os 1:N não contam.' },
w1402: { c: 'Todo funcionário recebe crachá; existem crachás em branco no estoque, ainda não atribuídos.',
         s: 'A FK vai para o lado que sempre participa, para não sobrar coluna nula.' },
w1403: { c: 'Endereço e telefone estão lado a lado no DER. Um vira colunas, o outro vira tabela.',
         s: 'Composto se achata em colunas; multivalorado é que vira tabela.' },

w1501: { c: 'A sessão das 20h de sexta teve 180 pessoas; a de sábado, 240. Só existe uma coluna publico.',
         s: 'Sem data na chave, o registro de sábado apaga o de sexta.' },
w1502: { c: 'Duas turmas leram a mesma frase do enunciado e desenharam cardinalidades diferentes.',
         s: '"Em um dado instante" pede o estado atual — 1:N, sem histórico.' },
w1503: { c: 'O produto custava 40 reais em janeiro e 52 em agosto. O relatório do semestre precisa dos dois.',
         s: 'O tempo promove o atributo a entidade, com data na chave.' },

w1601: { c: 'A busca por "3222-4444" não encontra o cliente, embora o número esteja lá no meio do campo.',
         s: 'Campo com mais de um valor dentro quebra a 1FN — e quebra a consulta junto.' },
w1602: { c: 'A tabela de itens repete o nome do produto em todas as linhas em que ele aparece.',
         s: 'Depender de metade da chave composta é dependência parcial: 2FN.' },
w1603: { c: 'O cliente mudou de cidade. São quarenta pedidos dele com a cidade antiga gravada.',
         s: 'Chave → coluna → coluna é dependência transitiva: 3FN.' },
w1604: { c: 'Você está conferindo uma tabela de chave simples e fica procurando dependência parcial nela.',
         s: 'Chave de uma coluna não tem partes — logo, 2FN de graça. A 3FN ainda precisa ser checada.' },
w1605: { c: 'Depois de normalizar, o sistema tem o dobro de tabelas e uma consulta ficou mais lenta.',
         s: 'O ganho é consistência: um dado, um lugar, uma alteração.' },

w1701: { c: 'Modelo pronto, cinco minutos no relógio, e uma folha inteira para reler ou não.',
         s: 'Responda as consultas pedidas pelas suas tabelas — se alguma não fecha, o modelo tem defeito.' },
w1702: { c: 'Você compara sua resolução com a do colega. São diferentes e o professor deu nota cheia nas duas.',
         s: 'Há escolha legítima em modelagem — mas nem tudo é escolha.' },
w1703: { c: 'A questão mostra um DER com vinte elementos e faz uma pergunta só. O relógio anda.',
         s: 'Os quatro símbolos raros mudam o modelo inteiro; as cardinalidades você confere depois.' },
w1704: { c: 'O enunciado da universidade traz números por toda parte: 5000 alunos, 10 cursos, 280 disciplinas.',
         s: 'Isso é dimensionamento para o DBA — não muda uma linha do DER.' },
w1705: { c: 'O professor entrega uma nota fiscal impressa e pede o modelo que produziu aquele papel.',
         s: 'Bloco que se repete no documento denuncia entidade filha — aqui, fraca.' }

});
