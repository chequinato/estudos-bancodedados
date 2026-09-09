# Banco de Dados I — sistema de estudo

Site estático para estudar a disciplina de Banco de Dados I: flashcards com
repetição espaçada, questões comentadas, uma oficina guiada que vai do
enunciado até a 3FN, e os diagramas das aulas com anotações.

Sem build, sem dependências. É HTML, CSS e JavaScript puro — abre direto no
navegador e funciona offline depois da primeira visita.

## Como abrir

**Do jeito mais simples:** dê dois cliques em `index.html`.

**Com servidor local** (necessário para o modo offline funcionar):

```bash
python -m http.server 8899
```

Depois acesse `http://127.0.0.1:8899`.

## Publicar no GitHub Pages

```bash
git init
git add -A
git commit -m "Sistema de estudo de Banco de Dados I"
git branch -M main
git remote add origin https://github.com/SEU-USUARIO/estudo-bd.git
git push -u origin main
```

No repositório: **Settings → Pages → Source: Deploy from a branch → main / (root)**.
O arquivo `.nojekyll` já está aqui para o GitHub não processar nada.

## Estrutura

```
index.html            estrutura da página e as seis telas
css/style.css         sistema visual completo
js/data-core.js       módulos, diagramas e fichas de referência
js/data-cards.js      166 flashcards
js/data-quiz.js       105 questões com explicação
js/extra-cards.js     contexto e resposta curta dos flashcards
js/extra-quiz.js      cenário e explicação simples das questões
js/data-oficina.js    8 casos guiados, do enunciado à 3FN
js/diagrams.js        7 diagramas autorais em SVG
js/app.js             roteamento, progresso e os motores de estudo
assets/img/           DERs das aulas e figuras do guia
sw.js                 cache para uso offline
```

## As seis telas

| Tela | Para quê |
| --- | --- |
| **Painel** | Indicadores de rendimento e a seção **O que estudar agora**, que lê seus erros e aponta o próximo passo |
| **Oficina** | 8 casos, o processo inteiro passo a passo: entidades → atributos → cardinalidade → casos especiais → DER → Modelo Relacional → 1FN/2FN/3FN |
| **Cards** | Repetição espaçada em 5 caixas, para memorizar listas e definições |
| **Questões** | Múltipla escolha com explicação em toda resposta, filtros por módulo e "só as que errei" |
| **DER** | Diagramas do professor e autorais, com uma lista do que olhar em cada um |
| **Resumo** | Fichas de consulta: símbolos, regras de mapeamento, formas normais, engenharia reversa |

## Como o progresso é guardado

Tudo fica em `localStorage`, neste aparelho e neste navegador — nada vai para
servidor nenhum. Cada card guarda a caixa (1 a 5) e a data em que volta a
aparecer; cada questão guarda o último resultado; cada passo da oficina guarda
a melhor nota. O botão **Zerar progresso**, no rodapé do Painel, apaga tudo.

## Atalhos de teclado

| Tecla | Onde | O que faz |
| --- | --- | --- |
| `Espaço` | Cards | Revela a resposta |
| `1` `2` `3` | Cards | Errei · Quase · Sabia |
| `A` `B` `C` `D` | Questões | Escolhe a alternativa |
| `Enter` | Questões | Próxima questão |
| `Esc` | Lightbox | Fecha a imagem ampliada |

No celular, deslizar o card para a esquerda marca *errei* e para a direita
marca *sabia*.

## Adicionar conteúdo

Os arquivos em `js/data-*.js` são listas de objetos JavaScript comentadas.
Para acrescentar um flashcard, uma questão ou um caso na oficina, basta
copiar um item existente e editar — nenhuma outra mudança é necessária.

## Créditos

O conteúdo vem do guia de estudos da disciplina e do material das aulas 01 a
05. Os diagramas em `assets/img/caso*.png` são as resoluções originais do
professor.
