# Banco de Dados I — sistema de estudo

Site estático para estudar a disciplina de Banco de Dados I: flashcards com
repetição espaçada, questões comentadas, uma oficina guiada que vai do
enunciado até a 3FN, e os diagramas das aulas com anotações.

O progresso fica guardado num **banco SQLite de verdade**, que roda dentro do
navegador. Você entra com usuário e senha e volta de onde parou.

## Como abrir

**Com servidor local** — é assim que deve ser aberto:

```bash
python -m http.server 8899
```

Depois acesse `http://127.0.0.1:8899`.

Dois cliques no `index.html` também costuma funcionar, mas alguns navegadores
bloqueiam WebAssembly em `file://` — e sem WebAssembly o banco não abre. Se a
tela de entrada disser que o motor não carregou, use o servidor.

## Publicar no GitHub Pages

O repositório é `https://github.com/chequinato/estudos-bancodedados`. Para
publicar uma alteração:

```bash
git add -A && git commit -m "descrição" && git push
```

No repositório: **Settings → Pages → Source: Deploy from a branch → main /
(root)**. O arquivo `.nojekyll` já está aqui para o GitHub não processar nada.

## O login e o banco de dados

O GitHub Pages serve arquivos estáticos — não existe servidor para rodar MySQL
ou Postgres. A solução aqui é o **SQLite compilado para WebAssembly** (sql.js):
o mesmo motor relacional que a disciplina descreve, executando dentro da aba. O
arquivo `progresso.db` fica guardado no **IndexedDB** do computador e é
recarregado a cada visita.

Consequência prática: é SQL de verdade. `CREATE TABLE`, `PRIMARY KEY`,
`FOREIGN KEY`, `JOIN`, `GROUP BY`. A tela **Banco** deixa você consultar esse
esquema com as suas próprias respostas dentro dele.

### O esquema

| Tabela | O que guarda | Chave |
| --- | --- | --- |
| `usuario` | login, nome, hash da senha e salt | `id_usuario` |
| `modulo` | catálogo dos 17 assuntos da disciplina | `id_modulo` |
| `card_estado` | caixa e data de revisão de cada flashcard | composta: usuário + card |
| `questao_estado` | acertos e erros por questão | composta: usuário + questão |
| `oficina_passo` | melhor nota de cada passo de cada caso | tripla: usuário + caso + passo |
| `prova_tentativa` | um simulado inteiro, com a nota final | `id_tentativa` |
| `prova_resposta` | cada questão respondida dentro de uma tentativa | composta: tentativa + questão |
| `evento` | log de respostas, uma linha por resposta | `id_evento` |
| `preferencia` | ajustes por usuário, em chave/valor | composta: usuário + chave |

O esquema está em 3FN e serve de exemplo de estudo: chave primária em toda
tabela, chave composta onde é o par que identifica a linha, chave estrangeira
declarada, e nenhuma coluna que possa ser deduzida de outra.

### Sobre a senha

A senha **nunca é gravada**. O que fica na tabela é o resultado de vinte mil
rodadas de SHA-256 sobre a senha somada a um *salt* aleatório, implementadas em
JavaScript puro para funcionar tanto em `https` quanto em `file://`.

Isso protege o arquivo de quem o abrir com um editor. Não substitui a senha do
Windows: quem tem acesso ao computador tem acesso ao navegador. O login existe
para separar o progresso e permitir mais de um usuário, não para guardar
segredo.

O botão **Baixar progresso.db** exporta o arquivo, que abre no DB Browser for
SQLite, no DBeaver ou no `sqlite3`. Serve de backup e de material de prática.

## Estrutura

```
index.html              estrutura da página e as sete telas
css/style.css           sistema visual completo
js/data-core.js         módulos, diagramas e fichas de referência
js/data-cards.js        flashcards das aulas 01 a 05
js/data-quiz.js         questões das aulas 01 a 05
js/extra-cards.js       contexto e resposta curta dos flashcards
js/extra-quiz.js        cenário e explicação simples das questões
js/data-oficina.js      8 casos guiados, do enunciado à 3FN
js/aula06.js            os 3 estudos de caso da aula 06 e seus diagramas
js/aula06-estudo.js     flashcards e questões conceituais da matéria
js/prova.js             questões no formato da prova do professor
js/prova-svg.js         os DERs dessas questões, em SVG
js/diagrams.js          diagramas autorais em SVG
js/db.js                o banco SQLite: esquema, login e persistência
js/app.js               roteamento, progresso e os motores de estudo
js/auth.js              a folha de entrada
assets/img/             DERs das aulas e figuras do guia
assets/vendor/          sql.js — SQLite compilado para WebAssembly
sw.js                   cache para uso offline
```

## As oito telas

| Tela | Para quê |
| --- | --- |
| **Painel** | Indicadores de rendimento e a seção **O que estudar agora**, que lê seus erros e aponta o próximo passo |
| **Prova** | Simulado no formato do professor: cenário, modelo para analisar, quatro itens numerados e alternativas que os combinam |
| **Oficina** | 11 casos, o processo inteiro passo a passo: entidades → atributos → cardinalidade → casos especiais → DER → Modelo Relacional → 1FN/2FN/3FN |
| **Cards** | Repetição espaçada em 5 caixas, para memorizar listas e definições |
| **Questões** | Múltipla escolha com explicação em toda resposta, filtros por módulo e "só as que errei" |
| **DER** | Diagramas do professor e autorais, com uma lista do que olhar em cada um |
| **Resumo** | Fichas de consulta: símbolos, regras de mapeamento, formas normais, engenharia reversa |
| **Banco** | O esquema onde o seu progresso está guardado, com console de SQL e consultas prontas |

## Os casos da Oficina

Os oito primeiros vêm das aulas 01 a 05. Os três últimos são os estudos de caso
da **aula 06**, todos do livro de Machado & Abreu:

| Caso | Origem | O que ele treina |
| --- | --- | --- |
| **Distribuidora de filmes** | EC1, feito em sala | Entidade fraca, duas especializações, multivalorado, aspecto temporal — e as formas normais, que ficaram de fora da aula |
| **Gerência Acadêmica UNITESTE** | EC2 | Auto-relacionamento, N:N com atributo, e a diferença entre regra de negócio e estrutura |
| **Grupo de Pesquisa sobre Vírus** | EC3 | Auto-relacionamento N:N — a estrutura mais difícil de enxergar |

O caso do cinema compara lado a lado o DER feito em sala e o do autor do livro,
que chegaram a modelos diferentes e igualmente corretos.

## Como o progresso é guardado

Cada card guarda a caixa (1 a 5) e a data em que volta a aparecer; cada questão
guarda acertos, erros e o último resultado; cada passo da oficina guarda a
melhor nota. Além disso, **toda resposta vira uma linha na tabela `evento`**,
que nunca é reescrita — é dela que saem o rendimento por dia e as consultas da
tela Banco.

O botão **Zerar progresso**, no rodapé do Painel, apaga os dados do usuário
atual sem tocar nos outros.

## Atalhos de teclado

| Tecla | Onde | O que faz |
| --- | --- | --- |
| `Espaço` | Cards | Revela a resposta |
| `1` `2` `3` | Cards | Errei · Quase · Sabia |
| `A` `B` `C` `D` | Questões | Escolhe a alternativa |
| `Enter` | Questões | Próxima questão |
| `Ctrl` + `Enter` | Banco | Executa a consulta |
| `Esc` | Lightbox | Fecha a imagem ampliada |

## Adicionar conteúdo

Os arquivos em `js/data-*.js` e `js/aula06*.js` são listas de objetos
JavaScript comentadas. Para acrescentar um flashcard, uma questão ou um caso na
oficina, basta copiar um item existente e editar — nenhuma outra mudança é
necessária. Os identificadores usam prefixos distintos (`c`/`q` para o material
das aulas 01–05, `k`/`w` para o conceitual) justamente para nunca colidirem.

## Créditos

O conteúdo vem do guia de estudos da disciplina e do material das aulas 01 a
06, do Centro Universitário Padre Anchieta. Os diagramas em
`assets/img/caso*.png` e `assets/img/aula06-*.png` são as resoluções originais
do professor e do livro-texto (Machado F., Abreu M., *Projeto de Banco de
Dados — uma visão prática*, Érica, 2007).
