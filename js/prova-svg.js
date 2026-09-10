/* =========================================================================
   DIAGRAMAS DAS QUESTÕES DE PROVA

   Os DERs que o professor descreve no enunciado, redesenhados em SVG para
   caber na tela e herdar o tema. Notação da disciplina: retângulo é
   entidade, retângulo duplo é entidade fraca, losango é relacionamento,
   elipse é atributo, elipse sublinhada é identificador, triângulo é
   especialização.

   Estes desenhos reproduzem o modelo COMO O PERSONAGEM DESENHOU —
   inclusive os erros, que são o ponto da questão.

   Cada função recebe `rev` (revelado). Enquanto ela for falsa, o desenho
   sai limpo, sem nenhuma pista: apontar o erro em vermelho antes de a
   pessoa responder entregaria a questão e a tornaria inútil. Só depois
   da correção é que a marcação aparece, e aí ela vira leitura guiada.
   ========================================================================= */

Object.assign(SVGS, {

/* ------------------------------------------------- 1 — SUPERMERCADO ---- */
provaSupermercado: (rev) => `
<svg viewBox="0 0 760 300" xmlns="http://www.w3.org/2000/svg" role="img"
     aria-label="DER com FORNECEDOR e PRODUTO ligados por um relacionamento N para N chamado FORNECE">
  ${SVG_DEFS('psup')}

  <!-- atributos do fornecedor -->
  <ellipse class="bx" cx="72" cy="52" rx="60" ry="16"/>
  <text class="m" x="72" y="56" text-anchor="middle" text-decoration="underline">COD_FOR</text>
  <ellipse class="bx" cx="72" cy="248" rx="66" ry="16"/>
  <text class="m" x="72" y="252" text-anchor="middle">RAZAO_SOCIAL</text>
  <line class="ln" x1="92" y1="68" x2="128" y2="128"/>
  <line class="ln" x1="92" y1="232" x2="128" y2="172"/>

  <!-- FORNECEDOR -->
  <rect class="bx" x="128" y="128" width="128" height="44"/>
  <text class="t" x="192" y="156" text-anchor="middle">FORNECEDOR</text>

  <!-- losango FORNECE -->
  <line class="ln" x1="256" y1="150" x2="318" y2="150"/>
  <text class="n" x="278" y="142" text-anchor="middle">N</text>
  <path class="bx" d="M380 118 L442 150 L380 182 L318 150 Z"/>
  <text class="tt" x="380" y="154" text-anchor="middle">FORNECE</text>
  <line class="ln" x1="442" y1="150" x2="504" y2="150"/>
  <text class="n" x="482" y="142" text-anchor="middle">N</text>

  <!-- atributos do relacionamento -->
  <ellipse class="bx" cx="330" cy="46" rx="34" ry="16"/>
  <text class="m" x="330" y="50" text-anchor="middle">QTD</text>
  <ellipse class="bx" cx="430" cy="46" rx="38" ry="16"/>
  <text class="m" x="430" y="50" text-anchor="middle" text-decoration="underline">DATA</text>
  <line class="ln" x1="350" y1="60" x2="372" y2="118"/>
  <line class="ln" x1="420" y1="60" x2="392" y2="118"/>

  <!-- PRODUTO -->
  <rect class="bx" x="504" y="128" width="112" height="44"/>
  <text class="t" x="560" y="156" text-anchor="middle">PRODUTO</text>

  <!-- atributos do produto -->
  <ellipse class="bx" cx="676" cy="52" rx="62" ry="16"/>
  <text class="m" x="676" y="56" text-anchor="middle" text-decoration="underline">COD_PROD</text>
  <ellipse class="bx" cx="686" cy="150" rx="58" ry="16"/>
  <text class="m" x="686" y="154" text-anchor="middle">DESCRICAO</text>
  <line class="ln" x1="616" y1="140" x2="628" y2="66"/>
  <line class="ln" x1="616" y1="150" x2="628" y2="150"/>

  <!-- O atributo que está no lugar errado. Sai neutro antes de responder;
       só depois da correção é que ganha o vermelho e a legenda. -->
  <ellipse class="${rev ? 'bx-a' : 'bx'}" cx="676" cy="248" rx="66" ry="16"/>
  <text class="${rev ? 'ma' : 'm'}" x="676" y="252" text-anchor="middle">PRECO_CUSTO</text>
  <line class="${rev ? 'ln-a' : 'ln'}" x1="616" y1="162" x2="620" y2="238"/>
  ${rev ? `<text class="ka" x="300" y="230">deveria estar aqui, no losango</text>
           <path class="ln-a" d="M300 226 C 340 200, 360 190, 380 186"/>` : ''}
</svg>`,

/* ------------------------------------------------------- 4 — BANCO ---- */
provaBanco: () => `
<svg viewBox="0 0 620 470" xmlns="http://www.w3.org/2000/svg" role="img"
     aria-label="DER de banco, agência, conta e cliente, com conta especializada em corrente e poupança">
  ${SVG_DEFS('pbanco')}

  <rect class="bx" x="40" y="20" width="112" height="40"/>
  <text class="t" x="96" y="45" text-anchor="middle">BANCO</text>
  <text class="k" x="164" y="34">NR_BANCO</text>
  <text class="k" x="164" y="48">NOME_BANCO</text>

  <line class="ln" x1="96" y1="60" x2="96" y2="86"/>
  <text class="n" x="82" y="80" text-anchor="end">1</text>
  <path class="bx" d="M96 86 L146 110 L96 134 L46 110 Z"/>
  <text class="tt" x="96" y="114" text-anchor="middle">POSSUI</text>
  <line class="ln" x1="96" y1="134" x2="96" y2="160"/>
  <text class="n" x="82" y="156" text-anchor="end">N</text>

  <rect class="bx" x="40" y="160" width="112" height="40"/>
  <text class="t" x="96" y="185" text-anchor="middle">AGENCIA</text>
  <text class="k" x="164" y="174">NR_AGENCIA</text>
  <text class="k" x="164" y="188">DESC_AGENCIA</text>

  <line class="ln" x1="96" y1="200" x2="96" y2="226"/>
  <text class="n" x="82" y="220" text-anchor="end">1</text>
  <path class="bx" d="M96 226 L146 250 L96 274 L46 250 Z"/>
  <text class="tt" x="96" y="254" text-anchor="middle">POSSUI</text>
  <line class="ln" x1="96" y1="274" x2="96" y2="300"/>
  <text class="n" x="82" y="296" text-anchor="end">N</text>

  <rect class="bx" x="40" y="300" width="112" height="40"/>
  <text class="t" x="96" y="325" text-anchor="middle">CONTA</text>
  <text class="k" x="164" y="322">NR_CONTA</text>

  <!-- pertence -> cliente -->
  <line class="ln" x1="152" y1="320" x2="266" y2="320"/>
  <text class="n" x="176" y="312">N</text>
  <path class="bx" d="M328 288 L390 320 L328 352 L266 320 Z"/>
  <text class="tt" x="328" y="324" text-anchor="middle">PERTENCE</text>
  <line class="ln" x1="390" y1="320" x2="460" y2="320"/>
  <text class="n" x="440" y="312">1</text>

  <rect class="bx" x="460" y="300" width="112" height="40"/>
  <text class="t" x="516" y="325" text-anchor="middle">CLIENTE</text>
  <text class="k" x="470" y="364">CPF</text>
  <text class="k" x="510" y="364">NOME</text>

  <!-- especializacao -->
  <line class="ln" x1="96" y1="340" x2="96" y2="366"/>
  <path class="bx" d="M96 366 L120 402 L72 402 Z"/>
  <line class="ln" x1="96" y1="402" x2="96" y2="416"/>
  <line class="ln" x1="40" y1="416" x2="200" y2="416"/>
  <line class="ln" x1="40" y1="416" x2="40" y2="430"/>
  <line class="ln" x1="200" y1="416" x2="200" y2="430"/>

  <rect class="bx" x="-8" y="430" width="96" height="34"/>
  <text class="tt" x="40" y="451" text-anchor="middle">CORRENTE</text>
  <rect class="bx" x="152" y="430" width="96" height="34"/>
  <text class="tt" x="200" y="451" text-anchor="middle">POUPANCA</text>
  <text class="k" x="256" y="444">LIMITE_CREDITO</text>
  <text class="k" x="256" y="458">DATA_BASE</text>
</svg>`,

/* ---------------------------------------------------------- 5 — RH ---- */
provaRH: (rev) => `
<svg viewBox="0 0 640 330" xmlns="http://www.w3.org/2000/svg" role="img"
     aria-label="DER de funcionário, dependente como entidade fraca e convênio médico">
  ${SVG_DEFS('prh')}

  <rect class="bx" x="40" y="30" width="130" height="44"/>
  <text class="t" x="105" y="58" text-anchor="middle">FUNCIONARIO</text>
  <text class="k" x="46" y="20">COD_FUNC</text>
  <text class="k" x="118" y="20">NOME</text>

  <line class="ln" x1="170" y1="52" x2="240" y2="52"/>
  <text class="n" x="196" y="44">1</text>
  <path class="bx" d="M300 20 L360 52 L300 84 L240 52 Z"/>
  <text class="tt" x="300" y="56" text-anchor="middle">POSSUI</text>
  <line class="ln" x1="360" y1="52" x2="430" y2="52"/>
  <text class="n" x="408" y="44">N</text>

  <!-- entidade fraca: retangulo duplo -->
  <rect class="bx" x="430" y="30" width="140" height="44"/>
  <rect class="bx" x="435" y="35" width="130" height="34" fill="none"/>
  <text class="t" x="500" y="58" text-anchor="middle">DEPENDENTE</text>
  <text class="k" x="436" y="20">NOME</text>
  <text class="k" x="486" y="20">DATA_NASCIMENTO</text>

  <!-- convenio -->
  <rect class="bx" x="230" y="240" width="180" height="44"/>
  <text class="t" x="320" y="268" text-anchor="middle">CONVENIO_MEDICO</text>
  <text class="k" x="236" y="302">COD_CONVENIO</text>
  <text class="k" x="322" y="302">NOME_CONVENIO</text>
  <text class="k" x="412" y="302">VALOR</text>

  <!-- Ligação funcionário–convênio. O 1:1 é o erro da questão: fica
       neutro até a correção, e só então recebe o vermelho e a nota. -->
  <line class="${rev ? 'ln-a' : 'ln'}" x1="105" y1="74" x2="105" y2="200"/>
  <line class="${rev ? 'ln-a' : 'ln'}" x1="105" y1="200" x2="230" y2="255"/>
  <text class="${rev ? 'ma' : 'n'}" x="92" y="120" text-anchor="end">1</text>
  <text class="${rev ? 'ma' : 'n'}" x="196" y="228">1</text>
  ${rev ? `<text class="ka" x="16" y="172">1:1 não cabe:</text>
           <text class="ka" x="16" y="184">são 2 convênios</text>
           <text class="ka" x="16" y="196">para todos</text>` : ''}

  <!-- ligacao dependente - convenio -->
  <line class="ln" x1="500" y1="74" x2="500" y2="200"/>
  <line class="ln" x1="500" y1="200" x2="410" y2="255"/>
  <text class="k" x="508" y="140">também usa</text>
  <text class="k" x="508" y="152">o convênio</text>
</svg>`

});
