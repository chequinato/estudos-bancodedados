/* =========================================================================
   DIAGRAMAS AUTORAIS — SVG inline, herdam o tema via CSS custom properties
   ========================================================================= */

const SVG_DEFS = (id) => `
  <defs>
    <marker id="a-${id}" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,1 L9,5 L0,9" fill="none" stroke="var(--ink)" stroke-width="1.4"/>
    </marker>
    <marker id="b-${id}" viewBox="0 0 10 10" refX="9" refY="5"
            markerWidth="6" markerHeight="6" orient="auto-start-reverse">
      <path d="M0,1 L9,5 L0,9" fill="none" stroke="var(--signal)" stroke-width="1.4"/>
    </marker>
  </defs>
  <style>
    .bx { fill: var(--paper); stroke: var(--ink); stroke-width: 1.2; }
    .bx-a { fill: var(--paper); stroke: var(--signal); stroke-width: 1.6; }
    .bx-s { fill: none; stroke: var(--rule); stroke-width: 1; }
    .ln { stroke: var(--ink); stroke-width: 1.2; fill: none; }
    .ln-a { stroke: var(--signal); stroke-width: 1.4; fill: none; }
    .ln-d { stroke: var(--rule); stroke-width: 1; fill: none; stroke-dasharray: 3 3; }
    .k { font-family: var(--mono); font-size: 7.5px; letter-spacing: .09em;
         fill: var(--ink-45); text-transform: uppercase; }
    .ka { font-family: var(--mono); font-size: 7.5px; letter-spacing: .09em; fill: var(--signal); }
    .t { font-family: var(--display); font-size: 12px; font-weight: 700;
         letter-spacing: -.02em; fill: var(--ink); }
    .tt { font-family: var(--display); font-size: 10px; font-weight: 600; fill: var(--ink); }
    .s { font-family: var(--display); font-size: 9px; fill: var(--ink-70); }
    .m { font-family: var(--mono); font-size: 9px; fill: var(--ink); letter-spacing: -.01em; }
    .ma { font-family: var(--mono); font-size: 9px; fill: var(--signal); font-weight: 600; }
    .n { font-family: var(--mono); font-size: 15px; font-weight: 700; fill: var(--signal); }
  </style>`;

const SVGS = {

/* ---------------------------------------------------------------- MAPA -- */
mapa: () => `
<svg viewBox="0 0 440 560" xmlns="http://www.w3.org/2000/svg" role="img"
     aria-label="Mapa de como os assuntos da disciplina se conectam">
  ${SVG_DEFS('mapa')}

  <rect class="bx" x="20" y="12" width="400" height="42"/>
  <text class="k" x="30" y="27">Parte I</text>
  <text class="t" x="30" y="44">FUNDAMENTOS</text>
  <text class="s" x="220" y="44">dado → informação · sistema e SI</text>
  <line class="ln" x1="220" y1="54" x2="220" y2="72" marker-end="url(#a-mapa)"/>
  <text class="k" x="228" y="68">motivam</text>

  <rect class="bx" x="20" y="76" width="240" height="42"/>
  <text class="k" x="30" y="91">Parte II</text>
  <text class="t" x="30" y="108">BANCO DE DADOS &amp; SGBD</text>
  <rect class="bx-s" x="272" y="76" width="148" height="42"/>
  <text class="k" x="282" y="91">contexto</text>
  <text class="tt" x="282" y="106">Tipos de BD</text>
  <text class="tt" x="282" y="116">Arquiteturas</text>
  <line class="ln-d" x1="260" y1="97" x2="272" y2="97"/>
  <line class="ln" x1="140" y1="118" x2="140" y2="136" marker-end="url(#a-mapa)"/>

  <rect class="bx-a" x="20" y="140" width="400" height="146"/>
  <text class="ka" x="30" y="156">Parte III — o coração da disciplina</text>
  <text class="t" x="30" y="173">MODELAGEM CONCEITUAL (MER / DER)</text>
  <line class="ln-d" x1="30" y1="181" x2="410" y2="181"/>
  <text class="m" x="34" y="196">Entidades &amp; Atributos</text>
  <text class="ma" x="34" y="211">Chaves — PK / FK / composta</text>
  <text class="m" x="34" y="226">Relacionamentos &amp; Cardinalidade</text>
  <text class="m" x="34" y="241">Grau &amp; Auto-relacionamento</text>
  <text class="m" x="34" y="256">Entidade fraca &amp; Associativa</text>
  <text class="m" x="34" y="271">Especialização · Agregação · Integridade</text>
  <text class="k" x="252" y="211">pré-requisito</text>
  <text class="k" x="252" y="221">de quase tudo</text>
  <path class="ln-a" d="M244 208 L330 208" marker-end="url(#b-mapa)"/>

  <path class="ln" d="M120 286 L120 306 L120 320" marker-end="url(#a-mapa)"/>
  <path class="ln" d="M320 286 L320 306 L320 320" marker-end="url(#a-mapa)"/>

  <rect class="bx" x="20" y="324" width="180" height="56"/>
  <text class="k" x="30" y="339">Parte V</text>
  <text class="tt" x="30" y="353">ASPECTO TEMPORAL</text>
  <text class="s" x="30" y="366">atributo → entidade</text>
  <text class="s" x="30" y="376">1:1 e 1:N → N:N + DATA</text>

  <rect class="bx" x="240" y="324" width="180" height="56"/>
  <text class="k" x="250" y="339">Parte IV</text>
  <text class="tt" x="250" y="353">MAPEAMENTO</text>
  <text class="s" x="250" y="366">o DER vira tabelas</text>
  <text class="s" x="250" y="376">PK · FK · associativas</text>

  <path class="ln" d="M200 352 L240 352" marker-end="url(#a-mapa)"/>
  <text class="k" x="204" y="347">reescreve</text>

  <line class="ln" x1="330" y1="380" x2="330" y2="400" marker-end="url(#a-mapa)"/>

  <rect class="bx-a" x="20" y="404" width="400" height="44"/>
  <text class="ka" x="30" y="419">Parte V — organiza as tabelas geradas</text>
  <text class="t" x="30" y="438">NORMALIZAÇÃO  1FN → 2FN → 3FN</text>

  <line class="ln" x1="220" y1="448" x2="220" y2="466" marker-end="url(#a-mapa)"/>

  <rect class="bx" x="20" y="470" width="400" height="44"/>
  <text class="k" x="30" y="485">Parte VI — junta tudo</text>
  <text class="t" x="30" y="504">PRÁTICA DE DIAGRAMAS</text>

  <text class="k" x="20" y="536">Revise nesta ordem. Nunca comece pelos casos sem ter chaves e cardinalidade sólidas.</text>
</svg>`,

/* ------------------------------------------------------------- ROTEIRO -- */
roteiro: () => `
<svg viewBox="0 0 440 470" xmlns="http://www.w3.org/2000/svg" role="img"
     aria-label="Roteiro de sete passos para resolver um exercicio de MER">
  ${SVG_DEFS('rot')}
  <line class="ln-d" x1="40" y1="20" x2="40" y2="410"/>

  <circle cx="40" cy="34" r="13" class="bx"/>
  <text class="n" x="40" y="40" text-anchor="middle" font-size="12">1</text>
  <text class="tt" x="66" y="30">Ler o enunciado</text>
  <text class="s" x="66" y="43">Marque os substantivos — são candidatos a entidade.</text>

  <circle cx="40" cy="88" r="13" class="bx"/>
  <text class="n" x="40" y="94" text-anchor="middle" font-size="12">2</text>
  <text class="tt" x="66" y="84">Levantar atributos</text>
  <text class="s" x="66" y="97">Características de cada entidade. Marque o identificador.</text>

  <circle cx="40" cy="142" r="13" class="bx"/>
  <text class="n" x="40" y="148" text-anchor="middle" font-size="12">3</text>
  <text class="tt" x="66" y="138">Identificar relacionamentos</text>
  <text class="s" x="66" y="151">Os verbos do enunciado. Cada um vira um losango.</text>

  <circle cx="40" cy="196" r="13" class="bx"/>
  <text class="n" x="40" y="202" text-anchor="middle" font-size="12">4</text>
  <text class="tt" x="66" y="192">Definir a cardinalidade</text>
  <text class="s" x="66" y="205">Quantos de cada lado? 1:1 · 1:N · N:N</text>

  <circle cx="40" cy="250" r="13" class="bx-a"/>
  <text class="n" x="40" y="256" text-anchor="middle" font-size="12">5</text>
  <text class="tt" x="66" y="246">Atributos do relacionamento</text>
  <text class="s" x="66" y="259">O passo mais esquecido. Horas, nota, preço, data —</text>
  <text class="s" x="66" y="270">pertencem ao losango, não às entidades.</text>

  <circle cx="40" cy="312" r="13" class="bx-a"/>
  <text class="n" x="40" y="318" text-anchor="middle" font-size="12">6</text>
  <text class="tt" x="66" y="308">Varrer os casos especiais</text>
  <text class="ma" x="66" y="321">auto-relacionamento · entidade fraca · multivalorado</text>
  <text class="ma" x="66" y="332">especialização · agregação · N:N</text>

  <circle cx="40" cy="374" r="13" class="bx"/>
  <text class="n" x="40" y="380" text-anchor="middle" font-size="12">7</text>
  <text class="tt" x="66" y="370">Transformar em Modelo Relacional</text>
  <text class="s" x="66" y="383">Aplicar as regras de mapeamento. Só agora nascem as tabelas.</text>

  <rect class="bx-s" x="20" y="412" width="400" height="44"/>
  <text class="k" x="30" y="428">Vale para qualquer enunciado</text>
  <text class="s" x="30" y="444">Texto corrido, planilha ou conjunto de tabelas — a sequência não muda.</text>
</svg>`,

/* ------------------------------------------------------------ ARVORE FK -- */
arvorefk: () => `
<svg viewBox="0 0 440 520" xmlns="http://www.w3.org/2000/svg" role="img"
     aria-label="Arvore de decisao para o mapeamento de relacionamentos">
  ${SVG_DEFS('afk')}

  <rect class="bx-a" x="110" y="12" width="220" height="34"/>
  <text class="t" x="220" y="34" text-anchor="middle">Qual a cardinalidade?</text>

  <path class="ln" d="M220 46 L220 60"/>
  <path class="ln" d="M70 60 L370 60"/>
  <path class="ln" d="M70 60 L70 78" marker-end="url(#a-afk)"/>
  <path class="ln" d="M220 60 L220 78" marker-end="url(#a-afk)"/>
  <path class="ln" d="M370 60 L370 78" marker-end="url(#a-afk)"/>

  <rect class="bx" x="20" y="82" width="100" height="28"/>
  <text class="t" x="70" y="101" text-anchor="middle">1 : N</text>
  <rect class="bx" x="170" y="82" width="100" height="28"/>
  <text class="t" x="220" y="101" text-anchor="middle">N : N</text>
  <rect class="bx" x="320" y="82" width="100" height="28"/>
  <text class="t" x="370" y="101" text-anchor="middle">1 : 1</text>

  <line class="ln" x1="70" y1="110" x2="70" y2="128" marker-end="url(#a-afk)"/>
  <line class="ln" x1="220" y1="110" x2="220" y2="128" marker-end="url(#a-afk)"/>
  <line class="ln" x1="370" y1="110" x2="370" y2="128" marker-end="url(#a-afk)"/>

  <rect class="bx-s" x="20" y="132" width="100" height="64"/>
  <text class="ka" x="30" y="147">não gera tabela</text>
  <text class="s" x="30" y="162">A chave do lado 1</text>
  <text class="s" x="30" y="173">desce como FK</text>
  <text class="s" x="30" y="184">para o lado N.</text>

  <rect class="bx-s" x="170" y="132" width="100" height="64"/>
  <text class="ka" x="180" y="147">gera tabela</text>
  <text class="s" x="180" y="162">As duas PKs</text>
  <text class="s" x="180" y="173">formam a chave</text>
  <text class="s" x="180" y="184">da associativa.</text>

  <rect class="bx-s" x="320" y="132" width="100" height="64"/>
  <text class="ka" x="330" y="147">pense antes</text>
  <text class="s" x="330" y="162">A chave vai para</text>
  <text class="s" x="330" y="173">o lado com</text>
  <text class="s" x="330" y="184">participação total.</text>

  <line class="ln-d" x1="20" y1="214" x2="420" y2="214"/>
  <text class="k" x="20" y="232">A pergunta seguinte, e a que mais derruba gente</text>

  <rect class="bx-a" x="20" y="242" width="400" height="34"/>
  <text class="t" x="220" y="264" text-anchor="middle">A chave transposta entra na PK?</text>

  <path class="ln" d="M220 276 L220 288"/>
  <path class="ln" d="M120 288 L320 288"/>
  <path class="ln" d="M120 288 L120 304" marker-end="url(#a-afk)"/>
  <path class="ln" d="M320 288 L320 304" marker-end="url(#a-afk)"/>

  <rect class="bx" x="20" y="308" width="190" height="76"/>
  <text class="k" x="30" y="323">1:N comum</text>
  <text class="tt" x="30" y="339">NÃO — só FK</text>
  <text class="s" x="30" y="354">A FK fica fora da PK.</text>
  <text class="m" x="30" y="372">CIDADE(cod, nome, cod_pais)</text>

  <rect class="bx" x="230" y="308" width="190" height="76"/>
  <text class="ka" x="240" y="323">entidade fraca</text>
  <text class="tt" x="240" y="339">SIM — compõe a PK</text>
  <text class="s" x="240" y="354">Vira chave composta.</text>
  <text class="m" x="240" y="372">REPARO(chassi, data, tipo)</text>

  <rect class="bx-s" x="20" y="400" width="400" height="100"/>
  <text class="k" x="30" y="418">Os outros dois casos que geram tabela</text>
  <text class="ma" x="30" y="438">◎  atributo multivalorado</text>
  <text class="s" x="30" y="451">Tabela nova com o atributo + a PK da entidade.</text>
  <text class="m" x="30" y="464">CLIENTE_FONE(cod_cli, fone)</text>
  <text class="ma" x="30" y="483">△  especialização</text>
  <text class="s" x="30" y="495">Tabela do geral + uma por especialização (PK herdada = PK/FK).</text>
</svg>`,

/* --------------------------------------------------------- FORMAS NORM -- */
formasnormais: () => `
<svg viewBox="0 0 440 430" xmlns="http://www.w3.org/2000/svg" role="img"
     aria-label="As tres perguntas das formas normais">
  ${SVG_DEFS('fn')}

  <rect class="bx" x="20" y="12" width="400" height="88"/>
  <text class="n" x="34" y="42">1</text>
  <text class="ka" x="60" y="30">1FN — repetição</text>
  <text class="t" x="60" y="48">Existe grupo que se repete na linha?</text>
  <line class="ln-d" x1="60" y1="58" x2="410" y2="58"/>
  <text class="s" x="60" y="73">Se sim, separe o grupo numa tabela nova.</text>
  <text class="m" x="60" y="90">PEDIDO(...)  +  ITENS_PEDIDO(nr_pedido, item, ...)</text>

  <line class="ln" x1="220" y1="100" x2="220" y2="118" marker-end="url(#a-fn)"/>

  <rect class="bx" x="20" y="122" width="400" height="88"/>
  <text class="n" x="34" y="152">2</text>
  <text class="ka" x="60" y="140">2FN — chave composta</text>
  <text class="t" x="60" y="158">Todo não-chave depende da chave inteira?</text>
  <line class="ln-d" x1="60" y1="168" x2="410" y2="168"/>
  <text class="s" x="60" y="183">Só se aplica se a chave for composta. Dependência parcial sai.</text>
  <text class="m" x="60" y="200">MATERIAL não depende de NR_PEDIDO+ITEM → sai</text>

  <line class="ln" x1="220" y1="210" x2="220" y2="228" marker-end="url(#a-fn)"/>

  <rect class="bx" x="20" y="232" width="400" height="100"/>
  <text class="n" x="34" y="262">3</text>
  <text class="ka" x="60" y="250">3FN — não-chave → não-chave</text>
  <text class="t" x="60" y="268">Um não-chave depende de outro não-chave?</text>
  <line class="ln-d" x1="60" y1="278" x2="410" y2="278"/>
  <text class="s" x="60" y="293">Se sim, separe. E remova todo atributo calculado.</text>
  <text class="m" x="60" y="310">DEPTO e FUNC viram tabelas · QTD_TOTAL é apagado</text>
  <text class="s" x="60" y="325">Dependência transitiva.</text>

  <rect class="bx-a" x="20" y="348" width="400" height="66"/>
  <text class="ka" x="30" y="366">A frase que mais vale</text>
  <text class="tt" x="30" y="384">1FN tira repetição. 2FN olha a chave composta.</text>
  <text class="tt" x="30" y="398">3FN olha dependência entre atributos que não são chave.</text>
  <text class="k" x="30" y="410">Nunca pule a ordem. Ela faz parte da resposta.</text>
</svg>`,

/* -------------------------------------------------------------- REVERSO -- */
reverso: () => `
<svg viewBox="0 0 440 440" xmlns="http://www.w3.org/2000/svg" role="img"
     aria-label="Dicionario de traducao entre esquema de tabelas e simbolos do DER">
  ${SVG_DEFS('rev')}

  <text class="k" x="20" y="18">No esquema de tabelas</text>
  <text class="k" x="250" y="18">No DER</text>
  <line class="ln" x1="20" y1="26" x2="420" y2="26"/>

  <text class="m" x="20" y="48">TABELA</text>
  <path class="ln" d="M205 44 L242 44" marker-end="url(#a-rev)"/>
  <rect class="bx" x="250" y="36" width="46" height="16"/>
  <text class="tt" x="304" y="48">entidade</text>
  <line class="ln-d" x1="20" y1="60" x2="420" y2="60"/>

  <text class="m" x="20" y="82">COLUNA</text>
  <path class="ln" d="M205 78 L242 78" marker-end="url(#a-rev)"/>
  <ellipse class="bx" cx="273" cy="78" rx="23" ry="9"/>
  <text class="tt" x="304" y="82">atributo</text>
  <line class="ln-d" x1="20" y1="94" x2="420" y2="94"/>

  <text class="m" x="20" y="116">PK sublinhada</text>
  <path class="ln" d="M205 112 L242 112" marker-end="url(#a-rev)"/>
  <ellipse class="bx" cx="273" cy="112" rx="23" ry="9"/>
  <line class="ln" x1="262" y1="118" x2="284" y2="118"/>
  <text class="tt" x="304" y="116">atributo-chave</text>
  <line class="ln-d" x1="20" y1="128" x2="420" y2="128"/>

  <text class="m" x="20" y="150">FK simples</text>
  <path class="ln" d="M205 146 L242 146" marker-end="url(#a-rev)"/>
  <path class="bx" d="M273 136 L296 146 L273 156 L250 146 Z"/>
  <text class="tt" x="304" y="150">relacionamento</text>
  <line class="ln-d" x1="20" y1="162" x2="420" y2="162"/>

  <rect class="bx-a" x="14" y="172" width="412" height="76"/>
  <text class="ka" x="24" y="190">As três pistas que valem nota</text>
  <text class="m" x="24" y="210">FK → própria tabela</text>
  <path class="ln-a" d="M205 206 L242 206" marker-end="url(#b-rev)"/>
  <text class="tt" x="250" y="210">AUTO-RELACIONAMENTO</text>
  <text class="m" x="24" y="228">2 FKs formando a PK</text>
  <path class="ln-a" d="M205 224 L242 224" marker-end="url(#b-rev)"/>
  <text class="tt" x="250" y="228">N:N RESOLVIDO</text>
  <text class="m" x="24" y="243">PK começa com PK de outra</text>
  <path class="ln-a" d="M205 239 L242 239" marker-end="url(#b-rev)"/>
  <text class="tt" x="250" y="243">ENTIDADE FRACA</text>

  <text class="k" x="20" y="272">Exemplo — o esquema do caso Empregado / Projeto</text>
  <rect class="bx-s" x="20" y="280" width="400" height="118"/>
  <text class="m" x="30" y="298">Empregado(Ident, ..., DepNum, SuperIdent)</text>
  <text class="ma" x="266" y="298">↺ auto-rel.</text>
  <text class="m" x="30" y="318">Departamento(Num, Nome, IdentGer)</text>
  <text class="ma" x="266" y="318">1:1 gerência</text>
  <text class="m" x="30" y="338">TrabalhaNo(IdentEmp, ProjNum, Horas)</text>
  <text class="ma" x="266" y="338">◈ N:N + atributo</text>
  <text class="m" x="30" y="358">Dependente(Nome, ..., IdentEmp)</text>
  <text class="ma" x="266" y="358">▤ fraca</text>
  <text class="m" x="30" y="378">DepLoc(DepNum, Local)</text>
  <text class="ma" x="266" y="378">◎ multivalorado</text>

  <text class="k" x="20" y="422">Leia o esquema linha a linha e anote a pista de cada uma antes de desenhar.</text>
</svg>`,

/* ------------------------------------------------------- DER DA LOCADORA -- */
derLocadora: () => `
<svg viewBox="0 0 440 500" xmlns="http://www.w3.org/2000/svg" role="img"
     aria-label="DER da Locadora Rota 9">
  ${SVG_DEFS('loc')}
  <style>
    .e  { fill: var(--paper); stroke: var(--ink); stroke-width: 1.3; }
    .en { font-family: var(--display); font-size: 11px; font-weight: 700; fill: var(--ink); }
    .pk { font-family: var(--mono); font-size: 8px; fill: var(--ink-70); }
    .di { fill: var(--paper); stroke: var(--ink); stroke-width: 1.2; }
    .dn { font-family: var(--mono); font-size: 7.5px; fill: var(--ink); letter-spacing: .04em; }
    .cd { font-family: var(--mono); font-size: 8.5px; font-weight: 600; fill: var(--signal); }
  </style>

  <!-- TELEFONE multivalorado -->
  <ellipse class="e" cx="62" cy="14" rx="42" ry="12"/>
  <ellipse class="e" cx="62" cy="14" rx="37" ry="8.5"/>
  <text class="dn" x="62" y="17" text-anchor="middle">TELEFONE</text>
  <line class="ln" x1="62" y1="26" x2="62" y2="34"/>

  <!-- CLIENTE -->
  <rect class="e" x="20" y="34" width="118" height="34"/>
  <text class="en" x="79" y="50" text-anchor="middle">CLIENTE</text>
  <text class="pk" x="79" y="62" text-anchor="middle" text-decoration="underline">CPF</text>

  <!-- VEICULO -->
  <rect class="e" x="302" y="34" width="118" height="34"/>
  <text class="en" x="361" y="50" text-anchor="middle">VEICULO</text>
  <text class="pk" x="361" y="62" text-anchor="middle" text-decoration="underline">PLACA</text>

  <!-- FAZ -->
  <line class="ln" x1="79" y1="68" x2="140" y2="97"/>
  <path class="di" d="M140 97 L166 110 L140 123 L114 110 Z"/>
  <text class="dn" x="140" y="113" text-anchor="middle">FAZ</text>
  <line class="ln" x1="140" y1="123" x2="180" y2="150"/>
  <text class="cd" x="95" y="80">1</text>
  <text class="cd" x="160" y="140">N</text>

  <!-- ALUGA -->
  <line class="ln" x1="318" y1="68" x2="300" y2="97"/>
  <path class="di" d="M300 97 L326 110 L300 123 L274 110 Z"/>
  <text class="dn" x="300" y="113" text-anchor="middle">ALUGA</text>
  <line class="ln" x1="300" y1="123" x2="266" y2="150"/>
  <text class="cd" x="316" y="82">1</text>
  <text class="cd" x="278" y="142">N</text>

  <!-- LOCACAO -->
  <rect class="e" x="161" y="150" width="118" height="34"/>
  <text class="en" x="220" y="166" text-anchor="middle">LOCACAO</text>
  <text class="pk" x="220" y="178" text-anchor="middle" text-decoration="underline">NR_LOCACAO</text>

  <!-- PERTENCE (veiculo → categoria) -->
  <line class="ln" x1="400" y1="68" x2="400" y2="167"/>
  <path class="di" d="M400 167 L426 180 L400 193 L374 180 Z"/>
  <text class="dn" x="400" y="183" text-anchor="middle">TEM</text>
  <line class="ln" x1="400" y1="193" x2="400" y2="300"/>
  <text class="cd" x="405" y="86">N</text>
  <text class="cd" x="405" y="292">1</text>

  <!-- CATEGORIA -->
  <rect class="e" x="280" y="300" width="140" height="34"/>
  <text class="en" x="350" y="316" text-anchor="middle">CATEGORIA</text>
  <text class="pk" x="350" y="328" text-anchor="middle" text-decoration="underline">COD_CAT</text>

  <!-- ATENDE -->
  <line class="ln" x1="250" y1="184" x2="240" y2="219"/>
  <path class="di" d="M240 219 L266 232 L240 245 L214 232 Z"/>
  <text class="dn" x="240" y="235" text-anchor="middle">ATENDE</text>
  <line class="ln" x1="214" y1="232" x2="170" y2="266"/>
  <text class="cd" x="252" y="200">N</text>
  <text class="cd" x="182" y="258">1</text>

  <!-- SUPERVISIONA (auto-relacionamento) -->
  <path class="di" d="M32 271 L54 283 L32 295 L10 283 Z"/>
  <text class="dn" x="32" y="286" text-anchor="middle">SUP</text>
  <line class="ln" x1="54" y1="283" x2="70" y2="283"/>
  <path class="ln" d="M32 271 L32 252 L129 252 L129 266"/>
  <text class="cd" x="60" y="278">N</text>
  <text class="cd" x="120" y="263">1</text>

  <!-- FUNCIONARIO -->
  <rect class="e" x="70" y="266" width="118" height="34"/>
  <text class="en" x="129" y="282" text-anchor="middle">FUNCIONARIO</text>
  <text class="pk" x="129" y="294" text-anchor="middle" text-decoration="underline">MATRICULA</text>

  <!-- Especializacao -->
  <line class="ln" x1="129" y1="300" x2="129" y2="322"/>
  <path class="di" d="M129 322 L153 356 L105 356 Z"/>
  <line class="ln" x1="129" y1="356" x2="129" y2="386"/>

  <!-- VENDEDOR -->
  <rect class="e" x="70" y="386" width="118" height="34"/>
  <text class="en" x="129" y="402" text-anchor="middle">VENDEDOR</text>
  <text class="pk" x="129" y="414" text-anchor="middle">META · COMISSAO</text>

  <!-- legenda -->
  <line class="ln-d" x1="20" y1="444" x2="420" y2="444"/>
  <text class="k" x="20" y="460">Atributos comuns omitidos — só os identificadores e o multivalorado</text>
  <text class="ka" x="20" y="476">◎ TELEFONE multivalorado   △ especialização   SUP auto-relacionamento</text>
  <text class="k" x="20" y="492">Confira o seu desenho contra este, item por item.</text>
</svg>`,

/* --------------------------------------------------------------- CHAVES -- */
chaves: () => `
<svg viewBox="0 0 440 420" xmlns="http://www.w3.org/2000/svg" role="img"
     aria-label="Anatomia das chaves primaria estrangeira e composta">
  ${SVG_DEFS('ch')}

  <rect class="bx" x="20" y="20" width="170" height="72"/>
  <text class="k" x="30" y="36">tabela</text>
  <text class="t" x="30" y="52">CLIENTE</text>
  <line class="ln-d" x1="30" y1="60" x2="180" y2="60"/>
  <text class="ma" x="30" y="76">COD_CLI</text>
  <text class="k" x="90" y="76">pk</text>
  <text class="m" x="30" y="88">NOME</text>

  <path class="ln-a" d="M190 74 L246 74" marker-end="url(#b-ch)"/>
  <text class="k" x="196" y="68">referencia</text>

  <rect class="bx" x="250" y="20" width="170" height="86"/>
  <text class="k" x="260" y="36">tabela</text>
  <text class="t" x="260" y="52">PEDIDO</text>
  <line class="ln-d" x1="260" y1="60" x2="410" y2="60"/>
  <text class="ma" x="260" y="76">NR_PEDIDO</text>
  <text class="k" x="330" y="76">pk</text>
  <text class="m" x="260" y="88">DATA_PED</text>
  <text class="ma" x="260" y="100">COD_CLI</text>
  <text class="k" x="330" y="100">fk</text>

  <path class="ln-a" d="M335 106 L335 150" marker-end="url(#b-ch)"/>
  <text class="k" x="342" y="130">vira parte</text>
  <text class="k" x="342" y="140">da PK abaixo</text>

  <rect class="bx-a" x="20" y="154" width="400" height="96"/>
  <text class="ka" x="30" y="170">chave composta</text>
  <text class="t" x="30" y="188">ITENS_PEDIDO</text>
  <line class="ln-d" x1="30" y1="196" x2="410" y2="196"/>
  <text class="ma" x="30" y="212">NR_PEDIDO</text>
  <text class="k" x="110" y="212">pk + fk</text>
  <text class="ma" x="30" y="226">ITEM</text>
  <text class="k" x="110" y="226">pk</text>
  <text class="m" x="30" y="240">COD_PROD · QUANTIDADE</text>
  <path class="ln-a" d="M22 205 L22 229"/>
  <text class="ka" x="200" y="216">juntos identificam a linha</text>
  <text class="s" x="200" y="230">nenhum dos dois sozinho basta</text>

  <line class="ln-d" x1="20" y1="268" x2="420" y2="268"/>

  <text class="k" x="20" y="288">O que cada chave responde</text>
  <rect class="bx-s" x="20" y="296" width="126" height="60"/>
  <text class="tt" x="30" y="314">PK</text>
  <text class="s" x="30" y="330">"quem sou eu?"</text>
  <text class="s" x="30" y="344">único · exclusivo</text>
  <text class="s" x="30" y="354">· imutável</text>

  <rect class="bx-s" x="157" y="296" width="126" height="60"/>
  <text class="tt" x="167" y="314">FK</text>
  <text class="s" x="167" y="330">"quem eu</text>
  <text class="s" x="167" y="340">referencio?"</text>
  <text class="s" x="167" y="354">liga as tabelas</text>

  <rect class="bx-s" x="294" y="296" width="126" height="60"/>
  <text class="tt" x="304" y="314">SECUNDÁRIA</text>
  <text class="s" x="304" y="330">busca e ordenação</text>
  <text class="s" x="304" y="344">não identifica</text>
  <text class="s" x="304" y="354">unicamente</text>

  <text class="k" x="20" y="382">Um mesmo atributo pode ser PK e FK ao mesmo tempo — como NR_PEDIDO acima.</text>
  <text class="k" x="20" y="398">Isso acontece em entidades fracas e em tabelas associativas.</text>
</svg>`

};
