/* =========================================================
   Laboratório · catálogo das bibliotecas (Modelos & Formas)
   home: true → aparece na seção da página inicial (3 por biblioteca).
   AJUSTE nomes, descrições e cores à vontade; cada biblioteca tem sua página em /biblioteca.
   ========================================================= */

export const LIBRARIES = {
  models: {
    num: '01', title: 'Artefatos 3D', page: 'artefatos-3d.html', unit: 'modelos',
    desc: 'Modelos GLB com texturas e materiais reais — alguns animados. Passe o mouse para inclinar; clique para ver em Argila ou Wireframe.'
  },
  objects: {
    num: '02', title: 'Objetos 3D', page: 'objetos-3d.html', unit: 'itens',
    desc: 'Formas e materiais em tempo real. Passe o mouse para inclinar e acelerar o giro; clique para trocar o acabamento.',
    sections: [['3d', 'Formas'], ['materials', 'Materiais & texturas']]
  },
  pixel: {
    num: '03', title: 'Pixel art', page: 'pixel-art.html', unit: 'sprites',
    desc: 'Sprites com contorno e brilho que se montam pixel a pixel, ondulam, fogem do cursor e explodem no hover. Clique para trocar a paleta.'
  },
  vector: {
    num: '04', title: 'Formas 2D', page: 'formas-2d.html', unit: 'formas',
    desc: 'Composições geométricas que se desmontam e viram outra forma — sozinhas e no hover. Clique para trocar a paleta.'
  },
  artifacts: {
    num: '06', title: 'Cenas interativas', page: 'cenas-interativas.html', unit: 'cenas',
    desc: 'Composições completas em movimento que reagem ao cursor — só os objetos, direto no cartão.'
  },
  anims: {
    num: '05', title: 'Animações', page: 'animacoes.html', unit: 'animações',
    desc: 'Doze animações geométricas do Uiverse — neon, wireframes e ondas. Passe o mouse para acelerar; clique para trocar a velocidade.'
  }
};

/* rótulo de cada tipo de cartão (chip) e o que o clique troca */
export const TYPES = {
  models:    { label: 'Modelo GLB', modes: ['Original', 'Argila', 'Wireframe'] },
  '3d':      { label: 'Forma', modes: ['Brilho', 'Metal', 'Wireframe'] },
  materials: { label: 'Material', modes: ['Esfera', 'Nó', 'Cubo'] },
  pixel:     { label: 'Pixel art', modes: ['Original', 'Neon', 'Mono'] },
  vector:    { label: 'Formas 2D', modes: ['Memphis', 'Bauhaus', 'Neon'] },
  artifacts: { label: 'Cena', modes: [] },
  anims:     { label: 'Uiverse', modes: ['1×', '2×', '0,5×'] }
};

/* ---------- 01 · artefatos 3D: modelos GLB (arquivos em lab/models; escala e centro são ajustados no carregamento) ---------- */
export const MODELS = [
  { name: 'Borboleta', desc: 'As asas batem juntas e o corpo fica parado — o hover acelera o bater.', color: '#7fd3ff', home: true,
    file: 'models/borboleta.glb', size: '665 KB', tilt: [-.35, .4, 0], motion: 'flap', spin: false, still: true },
  { name: 'Lata de refrigerante', desc: 'Chacoalha, pula e gira — o hover faz pular mais alto.', color: '#ff4d4d', home: true,
    motion: 'shake', file: 'models/lata.glb', size: '88 KB', tilt: [.15, 0, .12] },
  { name: 'Óculos de sol', desc: 'As hastes dobram e abrem; com o mouse em cima ficam abertas.', color: '#ffb35c',
    motion: 'hinge', file: 'models/oculos.glb', size: '77 KB', tilt: [.1, -.5, 0], credit: 'Eric Chadwick · CC-BY 4.0 · Khronos glTF Sample Assets' },
  { name: 'Luminária iridescente', desc: 'A película furta-cor muda de tom; o hover acelera.', color: '#c9a7ff',
    motion: 'shimmer', file: 'models/luminaria-iridescente.glb', size: '208 KB', home: true, credit: 'Eric Chadwick · CC-BY 4.0 · Khronos glTF Sample Assets' },
  { name: 'Vaso com flores', desc: 'As flores balançam ao vento dentro do vaso de vidro.', color: '#9fe7ff',
    motion: 'sway', file: 'models/vaso-flores.glb', size: '224 KB', credit: 'Eric Chadwick, Rico Cilliers · CC0 · Khronos glTF Sample Assets' },
  { name: 'Cadeira de veludo', desc: 'Balança sobre a base, como uma cadeira de balanço.', color: '#ff7ab6',
    motion: 'rock', file: 'models/cadeira-veludo.glb', size: '759 KB', tilt: [.1, -.6, 0], credit: 'Eric Chadwick · CC0 · Khronos glTF Sample Assets' },
  { name: 'Raposa', desc: 'Anda sozinha; com o mouse em cima, sai correndo.', color: '#ff8a3d',
    motion: 'fox', file: 'models/raposa.glb', size: '72 KB', tilt: [0, .7, 0], anim: 'Walk', credit: 'PixelMannen, tomkranis · CC-BY 4.0 / CC0 · Khronos glTF Sample Assets' },
  { name: 'Carrinho de brinquedo', desc: 'Anda para frente e para trás com a suspensão quicando.', color: '#ff5f5f',
    motion: 'drive', file: 'models/carrinho.glb', size: '993 KB', tilt: [.15, -.7, 0], credit: 'Eric Chadwick, Guido Odendahl · CC0 · Khronos glTF Sample Assets' },
  { name: 'Prato com azeitonas', desc: 'A tampa de vidro gira; o hover acelera o giro.', color: '#8fd16a',
    file: 'models/prato-azeitonas.glb', size: '502 KB', tilt: [.45, 0, 0], credit: 'Eric Chadwick · CC-BY 4.0 · Khronos glTF Sample Assets' },
  { name: 'Relógio cronógrafo', desc: 'Ponteiros em movimento; o hover acelera o tempo.', color: '#d8dde3',
    file: 'models/relogio.glb', size: '1,5 MB', tilt: [.2, 0, 0], credit: 'Eric Chadwick · CC-BY 4.0 · Khronos glTF Sample Assets' },
  { name: 'Tênis', desc: 'Dá passos rolando do calcanhar à ponta.', color: '#7cff5a',
    motion: 'step', file: 'models/tenis.glb', size: '544 KB', tilt: [.1, -.8, 0], credit: 'Shopify · CC-BY 4.0 · Khronos glTF Sample Assets' },
  { name: 'Abacate', desc: 'Quica amassando e esticando.', color: '#a6d65a',
    motion: 'bounce', file: 'models/abacate.glb', size: '58 KB', tilt: [0, -.4, .3], credit: 'Microsoft · CC0 · Khronos glTF Sample Assets' }
];

/* ---------- 06 · cenas interativas (web component em lab/artefatos; tag = nome do elemento) ---------- */
export const ARTIFACTS = [
  { name: 'Vitrine em movimento', desc: 'Celular com loja, cartões flutuantes, boné, tênis, polo e bola orbitando — só os objetos, sem cenário.', color: '#f2c46b', home: true,
    src: 'artefatos/vitrine-objetos.js', tag: 'vitrine-objetos', tags: 'Three.js · GLB · web component' }
];

/* ---------- 01 · formas 3D (geo recebe THREE e os addons) ---------- */
export const SHAPES3D = [
  { name: 'Nó toroidal', desc: 'Curva que dá voltas por dentro de um toro.', color: '#c6f432',
    geo: T => new T.TorusKnotGeometry(.6, .2, 220, 32) },
  { name: 'Icosaedro', desc: '20 faces planas: o low-poly clássico.', color: '#7b5cff', flat: true,
    geo: T => new T.IcosahedronGeometry(.95, 0) },
  { name: 'Blob orgânico', desc: 'Esfera deformada por ondas em tempo real.', color: '#ff3fa4', home: true, blob: true },
  { name: 'Toro', desc: 'Revolução de um círculo: reflexos contínuos.', color: '#00c2ff',
    geo: T => new T.TorusGeometry(.66, .28, 48, 128) },
  { name: 'Cristal', desc: 'Octaedro facetado, silhueta afiada.', color: '#f2f0eb', home: true, start: 2, flat: true,
    geo: T => new T.OctahedronGeometry(.98, 0) },
  { name: 'Cubo arredondado', desc: 'Bordas chanfradas que pegam luz.', color: '#ff8a3d', home: true, start: 1,
    geo: (T, A) => new A.RoundedBoxGeometry(1.1, 1.1, 1.1, 6, .18) },
  { name: 'Dodecaedro', desc: '12 pentágonos: o sólido de Platão do cosmos.', color: '#ffcc00', flat: true,
    geo: T => new T.DodecahedronGeometry(.92, 0) },
  { name: 'Tetraedro', desc: 'O sólido mais simples: 4 triângulos.', color: '#ff5f1f', flat: true,
    geo: T => new T.TetrahedronGeometry(1.05, 0) },
  { name: 'Cápsula', desc: 'Cilindro com tampas esféricas — forma de pílula.', color: '#3dd6a0',
    geo: T => new T.CapsuleGeometry(.42, .8, 12, 32) },
  { name: 'Cone', desc: 'Base circular afinando até um ponto.', color: '#6a4cff',
    geo: T => new T.ConeGeometry(.72, 1.4, 64) },
  { name: 'Vaso', desc: 'Perfil girado em torno do eixo (lathe).', color: '#e7dcc1',
    geo: T => new T.LatheGeometry([[0, -.8], [.55, -.8], [.62, -.5], [.4, .1], [.28, .5], [.4, .8], [.36, .82]].map(([x, y]) => new T.Vector2(x, y)), 64) },
  { name: 'Nó estrela', desc: 'Nó toroidal (3, 7): uma estrela trançada.', color: '#ff3b4e',
    geo: T => new T.TorusKnotGeometry(.55, .12, 320, 24, 3, 7) }
];

/* ---------- 04 · materiais & texturas (mat recebe THREE e as texturas procedurais) ---------- */
export const MATERIALS = [
  { name: 'Vidro', desc: 'Transparente, reflexo limpo nas bordas.', color: '#9fe7ff',
    mat: T => new T.MeshPhysicalMaterial({ color: '#cfefff', roughness: 0, metalness: 0, transparent: true, opacity: .32, clearcoat: 1, envMapIntensity: 2.4, side: T.DoubleSide }) },
  { name: 'Holográfico', desc: 'Película iridescente que muda de cor com o ângulo.', color: '#c9a7ff',
    mat: T => new T.MeshPhysicalMaterial({ color: '#e8e8f0', metalness: .65, roughness: .12, iridescence: 1, iridescenceIOR: 1.8, iridescenceThicknessRange: [120, 900], envMapIntensity: 1.6 }) },
  { name: 'Ouro', desc: 'Metal amarelo, polido.', color: '#e7b84a',
    mat: T => new T.MeshStandardMaterial({ color: '#e7b84a', metalness: 1, roughness: .2, envMapIntensity: 1.5 }) },
  { name: 'Cromo', desc: 'Espelho perfeito do ambiente.', color: '#dfe3e8',
    mat: T => new T.MeshStandardMaterial({ color: '#e9ecef', metalness: 1, roughness: .04, envMapIntensity: 1.6 }) },
  { name: 'Cobre escovado', desc: 'Metal quente com brilho difuso.', color: '#c56a3a',
    mat: T => new T.MeshStandardMaterial({ color: '#c56a3a', metalness: 1, roughness: .45, envMapIntensity: 1.3 }) },
  { name: 'Cerâmica', desc: 'Branco esmaltado, verniz por cima.', color: '#f2efe8',
    mat: T => new T.MeshPhysicalMaterial({ color: '#f2efe8', roughness: .4, clearcoat: .8, clearcoatRoughness: .1 }) },
  { name: 'Borracha fosca', desc: 'Sem reflexo, absorve a luz.', color: '#6b6b70',
    mat: T => new T.MeshStandardMaterial({ color: '#2a2a2e', roughness: 1, metalness: 0, envMapIntensity: .4 }) },
  { name: 'Neon', desc: 'Emite a própria luz.', color: '#39ff88',
    mat: T => new T.MeshStandardMaterial({ color: '#0b2416', emissive: '#39ff88', emissiveIntensity: 2.2, roughness: .5 }) },
  { name: 'Veludo', desc: 'Brilho de fibra (sheen) nas bordas.', color: '#ff3fa4',
    mat: T => new T.MeshPhysicalMaterial({ color: '#4a0f2c', roughness: .85, sheen: 1, sheenRoughness: .35, sheenColor: '#ff7ac2' }) },
  { name: 'Laca vermelha', desc: 'Cor profunda sob camada de verniz.', color: '#e0243e',
    mat: T => new T.MeshPhysicalMaterial({ color: '#b5102a', roughness: .45, clearcoat: 1, clearcoatRoughness: .03 }) },
  { name: 'Madeira', desc: 'Veios procedurais, sem imagem baixada.', color: '#b97a45',
    mat: (T, tex) => new T.MeshStandardMaterial({ map: tex.wood(), roughness: .62, metalness: 0 }) },
  { name: 'Mármore', desc: 'Pedra clara com veios, polida.', color: '#e9e6df',
    mat: (T, tex) => new T.MeshPhysicalMaterial({ map: tex.marble(), roughness: .18, clearcoat: .6 }) }
];

/* ---------- 02 · pixel art (mapa de caracteres → cores; '.' = vazio; contorno e brilho são automáticos) ---------- */
export const PIXELS = [
  // ---- games ----
  { name: 'Pac-Man', desc: 'Games · boca aberta atrás das pastilhas.', color: '#ffd23f',
    pal: { y: '#ffd23f', k: '#1a1a1a', w: '#ffe9b0' },
    map: ['....yyyyy....', '..yyyyyyyyy..', '.yyyyyyyyyyy.', '.yyyyykyyyy..', 'yyyyyyyyyy...', 'yyyyyyyy.....', 'yyyyyy...w..w',
          'yyyyyyyy.....', 'yyyyyyyyyy...', '.yyyyyyyyyy..', '.yyyyyyyyyyy.', '..yyyyyyyyy..', '....yyyyy....'] },
  { name: 'Botões △○×□', desc: 'Games · os quatro botões do controle.', color: '#5aa8ff',
    pal: { g: '#3fd28a', p: '#ff7ad9', r: '#ff4b5c', b: '#5aa8ff' },
    map: ['......g......', '.....g.g.....', '....g...g....', '....ggggg....', 'ppppp....rrr.', 'p...p...r...r', 'p...p...r...r',
          'p...p...r...r', 'ppppp....rrr.', '....b...b....', '.....b.b.....', '......b......', '.....b.b.....', '....b...b....'] },
  { name: 'Invasor', desc: 'Clássico dos fliperamas.', color: '#7cff5a',
    pal: { g: '#7cff5a' },
    map: ['..g.....g..', '...g...g...', '..ggggggg..', '.gg.ggg.gg.', 'ggggggggggg', 'g.ggggggg.g', 'g.g.....g.g', '...gg.gg...'] },
  { name: 'Pokébola', desc: 'Games · metade vermelha, metade branca, botão no meio.', color: '#ef3b3b', home: true,
    pal: { r: '#ef3b3b', h: '#ff9a9a', k: '#1d1f26', w: '#f2f0eb' },
    map: ['....rrrrr....', '..rrrrrrrrr..', '.rrhhrrrrrrr.', '.rhrrrrrrrrr.', 'rrrrrrrrrrrrr', 'rrrrkkkkkrrrr', 'kkkkkwwwkkkkk',
          'wwwwkkkkkwwww', 'wwwwwwwwwwwww', '.wwwwwwwwwww.', '.wwwwwwwwwww.', '..wwwwwwwww..', '....wwwww....'] },
  // ---- nostalgia ----
  { name: 'Fita cassete', desc: 'Nostalgia · lado A, rebobinada na caneta.', color: '#ff8a3d',
    pal: { g: '#c9ccd4', o: '#ff8a3d', k: '#1d1f26', w: '#f2f0eb' },
    map: ['.gggggggggggggg.', 'gggggggggggggggg', 'ggoooooooooooogg', 'ggoooooooooooogg', 'ggkkkkkkkkkkkkgg', 'ggkwwkkkkkkwwkgg',
          'ggkwwkkkkkkwwkgg', 'ggkkkkkkkkkkkkgg', 'gggggggggggggggg', '..gggggggggggg..'] },
  { name: 'Disquete', desc: 'Nostalgia · 1,44 MB de pura esperança.', color: '#2a5bd7',
    pal: { b: '#2a5bd7', s: '#cfd6e0', k: '#1d1f26', w: '#f2f0eb', l: '#9aa4b5' },
    map: ['bbbbbbbbbbb.', 'bbbsssssbbbb', 'bbbsskssbbbb', 'bbbsskssbbbb', 'bbbsssssbbbb', 'bbbbbbbbbbbb',
          'bwwwwwwwwwwb', 'bwllllllllwb', 'bwwwwwwwwwwb', 'bwlllllllwwb', 'bwwwwwwwwwwb', 'bbbbbbbbbbbb'] },
  { name: 'Cata-vento', desc: 'Quatro pás, quatro cores.', color: '#f4a62a',
    pal: { y: '#f6c33b', r: '#ef4b3b', b: '#2a8de0', g: '#2ea65a' },
    map: ['......rr....', '......rrr...', 'yyy...rrrr..', 'yyyy..rrrr..', 'yyyyy.rrr...', 'yyyyyyrr....',
          '....ggbbbbbb', '...ggg.bbbbb', '..gggg..bbbb', '..gggg...bbb', '...ggg......', '....gg......'] },
  // ---- música ----
  { name: 'Vinil', desc: 'Música · sulcos, selo e o furo no meio.', color: '#ff3b5c',
    pal: { k: '#2a2a33', g: '#6b6f80', r: '#ff3b5c' },
    map: ['....kkkkk....', '..kkkkkkkkk..', '.kkgkkkkkgkk.', '.kgkkkkkkkgk.', 'kkkkkrrrkkkkk', 'kkkkrrrrrkkkk', 'kgkkrr.rrkkgk',
          'kkkkrrrrrkkkk', 'kkkkkrrrkkkkk', '.kgkkkkkkkgk.', '.kkgkkkkkgkk.', '..kkkkkkkkk..', '....kkkkk....'] },
  { name: 'Boombox', desc: 'Música · dois alto-falantes e um toca-fitas.', color: '#c6f432',
    pal: { g: '#c9ccd4', k: '#1d1f26', c: '#8c5bff', y: '#c6f432', a: '#3b3f4a', w: '#ff3fa4', h: '#8a8f9c' },
    map: ['....hhhhhhhh....', '....h......h....', 'gggggggggggggggg', 'ggkkgyyyyyygkkgg', 'gkcckaaaaaakcckg', 'gkcckaaaaaakcckg',
          'ggkkggwgwgwgkkgg', 'gggggggggggggggg'] },
  // ---- cinema ----
  { name: 'Chuva digital', desc: 'Cinema · o código caindo, estilo Matrix.', color: '#3cff6e',
    pal: { g: '#1f7a3a', l: '#3cff6e', w: '#d9ffe0' },
    map: ['g...l.g....', 'l...g.l..g.', 'g.g.l.w..l.', 'w.l.g....g.', '..g.l..g.w.', '..w.g..l...', '....w..g.g.',
          '.g.....l.l.', '.l..g..g.g.', '.g..l..w.l.', '.w..g....w.', '....l......', '....w......'] },
  { name: 'Sabre de luz', desc: 'Cinema · lâmina acesa, cabo metálico.', color: '#3fd6ff',
    pal: { b: '#3fd6ff', w: '#eaffff', s: '#d7dee8', h: '#9aa4b5', k: '#2b2f38', r: '#ff3b3b' },
    map: ['............bb', '...........bwb', '..........bwb.', '.........bwb..', '........bwb...', '.......bwb....', '......bwb.....',
          '.....bwb......', '....sss.......', '...hkh........', '..hkhr........', '.hkh..........', 'hkh...........', 'hh............'] },
  { name: 'Super-Homem', desc: 'Cinema · o escudo com o S.', color: '#e8232f', home: true,
    pal: { r: '#e8232f', y: '#ffd23f' },
    map: ['..rrrrrrrrrrr..', '.ryyyyyyyyyyyr.', 'ryyrrrrrrrrrryr', 'ryrryyyyyyyyyyr', '.rrryyyyyyyyyr.', '.ryrrrrrrrrryr.', '..ryyyyyyyrrr..',
          '..ryyyyyyyyrr..', '...rrrrrrrrr...', '....ryyyyyr....', '.....ryyyr.....', '......ryr......', '.......r.......'] },
  // ---- marcas / pop ----
  { name: 'Tijolo LEGO', desc: 'Pop · 2×4, oito pinos.', color: '#e8423c',
    pal: { r: '#e8423c', w: '#ff9a8a', d: '#a8241e' },
    map: ['.wr..wr..wr..wr.', '.rr..rr..rr..rr.', 'rrrrrrrrrrrrrrrr', 'rwwrrrrrrrrrrrrr', 'rrrrrrrrrrrrrrrr', 'rrrrrrrrrrrrrrrr',
          'rrrrrrrrrrrrrrrr', 'dddddddddddddddd'] },
  { name: 'Swoosh', desc: 'Pop · o traço mais famoso dos tênis.', color: '#f2f0eb',
    pal: { w: '#f2f0eb' },
    map: ['...............w', '.............ww.', '..........wwww..', '.w.....wwwww....', 'ww..wwwwww......', 'wwwwwwww........', '.wwww...........'] },
  { name: 'TikTok', desc: 'Pop · a nota com o deslocamento ciano e vermelho.', color: '#25f4ee', home: true,
    pal: { c: '#25f4ee', r: '#fe2c55', w: '#f2f0eb' },
    map: ['....cc.......', '....cww......', '....cwwwc....', '....cwwwww...', '....cwwrwww..', '....cwwr.rwr.', '....cwwr...r.',
          '..cccwwr.....', '.ccwwwwr.....', 'ccwwrwwr.....', 'cwwrrwwr.....', '.wwrcwwr.....', '..wwwwwr.....', '...wwwrr.....', '....rrr......'] },
];

/* ---------- 03 · formas 2D: composições Memphis/neon que se transformam (modelo "grade de ícones" do vídeo)
   Cada svg(uid) usa peças .p com --tb = transform do estado B (e --ta = estado A, opcional; --d = atraso).
   Cores por classe (k = tinta, a = destaque, b = terceira; ks/as = só contorno) vêm da paleta do cartão.
   #s-uid = listras do destaque, #g-uid = degradê tinta → terceira (definidos no lab.js). ---------- */
const P = (tb, d = 0, ta = '', extra = '') => `style="--tb:${tb};--d:${d}s${ta ? `;--ta:${ta}` : ''}${extra ? ';' + extra : ''}"`;
const grid = (n, f) => Array.from({ length: n * n }, (_, k) => f(k % n, Math.floor(k / n))).join('');
export const VECTORS = [
  { name: 'Grade de pontos', desc: 'A malha gira 45° e os pontos de destaque incham.', color: '#7b3ff2', home: true,
    svg: () => `<g class="p" ${P('rotate(45deg) scale(.82)')}>${grid(5, (i, j) => (i + j) % 2
      ? `<circle class="p a" cx="${14 + i * 18}" cy="${14 + j * 18}" r="3.4" ${P('scale(2)', (i + j) * .03)}/>`
      : `<circle class="k" cx="${14 + i * 18}" cy="${14 + j * 18}" r="3.4"/>`)}</g>` },
  { name: 'Zigue-zague', desc: 'As duas linhas se cruzam e trocam de lugar.', color: '#7b3ff2', home: true,
    svg: () => `<polyline class="p as" points="6,48 20,34 34,48 48,34 62,48 76,34 90,48" ${P('translate(10px,-14px)', .05, 'translate(-8px,16px)')}/>
      <polyline class="p ks" points="6,48 20,34 34,48 48,34 62,48 76,34 90,48" ${P('translate(-6px,16px)')}/>` },
  { name: 'Círculo listrado', desc: 'O círculo listrado desliza para trás do sólido.', color: '#7b3ff2', home: true,
    svg: u => `<circle class="p k" cx="42" cy="56" r="30" ${P('translate(16px,-14px) scale(.88)', .08)}/>
      <circle class="p" cx="60" cy="40" r="28" fill="url(#s-${u})" ${P('translate(-20px,20px) rotate(90deg)')}/>` },
  { name: 'Meia-lua e barras', desc: 'A meia-lua vira e as barras sobem e descem.', color: '#7b3ff2',
    svg: () => `<path class="p a" d="M50 12A38 38 0 0 0 50 88Z" ${P('translateX(24px) rotate(180deg)')}/>` +
      [.35, .8, .5, 1, .3].map((h, i) => `<rect class="p k" x="${56 + i * 7}" y="12" width="3.2" height="76" ${P(`scaleY(${h})`, .05 * i)}/>`).join('') },
  { name: 'Losango duplo', desc: 'O contorno pula para o outro lado e o sólido gira.', color: '#7b3ff2',
    svg: () => `<rect class="p k" x="28" y="28" width="40" height="40" ${P('rotate(135deg) scale(.82)', 0, 'rotate(45deg)')}/>
      <rect class="p as" x="28" y="28" width="40" height="40" ${P('translate(-10px,-9px) rotate(-45deg)', .08, 'translate(10px,9px) rotate(45deg)')}/>` },
  { name: 'X listrado', desc: 'O X vira cruz e a sombra listrada troca de lado.', color: '#7b3ff2',
    svg: u => `<path class="p" fill="url(#s-${u})" d="M20 30 30 20 50 40 70 20 80 30 60 50 80 70 70 80 50 60 30 80 20 70 40 50Z" ${P('translate(10px,10px) rotate(-45deg)', .06, 'translate(-10px,-10px)')}/>
      <path class="p k" d="M20 30 30 20 50 40 70 20 80 30 60 50 80 70 70 80 50 60 30 80 20 70 40 50Z" ${P('rotate(45deg) scale(.9)')}/>` },
  { name: 'Pilha de triângulos', desc: 'Cada triângulo vira de ponta-cabeça em cascata.', color: '#7b3ff2',
    svg: () => [8, 30, 52, 74].map((y, i) => `<path class="p ${i % 2 ? 'ks' : 'k'}" d="M50 ${y}l11 18H39Z" ${P(`translateX(${i % 2 ? 12 : -12}px) rotate(180deg)`, i * .08)}/>`).join('') },
  { name: 'Setas em marcha', desc: 'As setas avançam uma atrás da outra.', color: '#7b3ff2',
    svg: () => [16, 38, 60].map((x, i) => `<g class="p" ${P('translateX(14px)', i * .09)}><path class="ks" d="M${x + 3} 33l16 17-16 17" style="stroke-width:10"/><path class="as" d="M${x} 30l16 17-16 17" style="stroke-width:10"/><circle class="k" cx="${x + 4}" cy="47" r="2"/></g>`).join('') },
  { name: 'Onda', desc: 'As ondas invertem a fase e trocam de camada.', color: '#7b3ff2',
    svg: () => `<path class="p as" d="M8 54q10.5-16 21 0t21 0 21 0 21 0" ${P('translateY(-8px) scaleY(-1)', .05, 'translate(3px,6px)', 'stroke-width:13')}/>
      <path class="p ks" d="M8 50q10.5-16 21 0t21 0 21 0 21 0" ${P('translateY(8px) scaleY(-1)', 0, '', 'stroke-width:9')}/>` },
  { name: 'Estrela fluida', desc: 'A estrela gira, o núcleo acende e as gotas se espalham.', color: '#ff4d6d',
    svg: u => `<circle class="p a glow" cx="50" cy="50" r="11" ${P('scale(1.9)')}/>
      <path class="p" fill="url(#g-${u})" d="M50 4C52 38 62 48 96 50 62 52 52 62 50 96 48 62 38 52 4 50 38 48 48 38 50 4Z" ${P('rotate(45deg) scale(.78)', .04)}/>` +
      [[50, 20, '0,-12px'], [80, 50, '12px,0'], [50, 80, '0,12px'], [20, 50, '-12px,0']].map(([x, y, t], i) =>
        `<circle class="p a" cx="${x}" cy="${y}" r="3" ${P(`translate(${t}) scale(1.5)`, .05 * i)}/>`).join('') },
  { name: 'X fluido', desc: 'As hastes giram até virar cruz e o centro aparece.', color: '#ff4d6d',
    svg: u => `<rect class="p" x="12" y="41" width="76" height="18" rx="9" fill="url(#g-${u})" ${P('rotate(0deg)', 0, 'rotate(45deg)')}/>
      <rect class="p" x="12" y="41" width="76" height="18" rx="9" fill="url(#g-${u})" ${P('rotate(90deg)', .06, 'rotate(-45deg)')}/>
      <rect class="p a" x="43" y="43" width="14" height="14" ${P('rotate(45deg) scale(1)', .12, 'rotate(45deg) scale(0)')}/>` },
  { name: 'Olho', desc: 'Pisca sozinho e a pupila segue o cursor.', color: '#ff4d6d',
    svg: () => `<g class="p" ${P('scaleY(.1)')}><path class="as" d="M6 50Q50 8 94 50 50 92 6 50Z" style="stroke-width:5"/>
      <g style="transform:translate(var(--ex,0px),var(--ey,0px));transition:transform .25s"><circle class="k" cx="50" cy="50" r="13"/><circle class="a" cx="45" cy="45" r="3.5"/></g></g>` }
];

/* ---------- 05 · animações: elementos do Uiverse (github.com/uiverse-io/galaxy · MIT), arquivos em lab/uiverse ---------- */
export const ANIMATIONS = [
  { name: 'Estrela neon', desc: 'Camadas de estrela em neon violeta que pulsam.', color: '#7b5cff', home: true, src: 'uiverse/estrela-neon.html', credit: 'VashonG · MIT · Uiverse.io (github.com/uiverse-io/galaxy)' },
  { name: 'Hélice neon', desc: 'Pás de neon girando como um cata-vento.', color: '#7b5cff', home: true, src: 'uiverse/helice.html', fit: 2, credit: 'NlghtM4re · MIT · Uiverse.io (github.com/uiverse-io/galaxy)' },
  { name: 'Olho rosa', desc: 'Uma bolha rosa com um olho, cercada de bolhinhas.', color: '#ff3fa4', home: true, src: 'uiverse/olho.html', fit: .5, credit: 'StealthWorm · MIT · Uiverse.io (github.com/uiverse-io/galaxy)' },
  { name: 'Anéis de cor', desc: 'Anéis coloridos e bolhas de luz que giram.', color: '#ff3fa4', src: 'uiverse/aneis.html', credit: 'Dennyhml · MIT · Uiverse.io (github.com/uiverse-io/galaxy)' },
  { name: 'Radar', desc: 'Anéis tracejados que giram em sentidos opostos.', color: '#7b5cff', src: 'uiverse/radar.html', credit: 'Nawsome · MIT · Uiverse.io (github.com/uiverse-io/galaxy)' },
  { name: 'Arco arco-íris', desc: 'Arcos em degradê que giram um dentro do outro.', color: '#ff8a3d', src: 'uiverse/arco.html', credit: 'Nawsome · MIT · Uiverse.io (github.com/uiverse-io/galaxy)' },
  { name: 'Ondulação', desc: 'Pontos em espiral que pulsam como uma gota na água.', color: '#7b5cff', src: 'uiverse/ondulacao.html', credit: 'Pradeepsaranbishnoi · MIT · Uiverse.io (github.com/uiverse-io/galaxy)' },
  { name: 'Poliedro', desc: 'Um sólido de faces translúcidas que gira e muda de cor.', color: '#ff3fa4', src: 'uiverse/poliedro.html', fit: .42, credit: 'MrLegendGaming · MIT · Uiverse.io (github.com/uiverse-io/galaxy)' },
  { name: 'Cubo de vidro', desc: 'Cubo brilhante que gira no próprio eixo.', color: '#7b5cff', src: 'uiverse/cubo-vidro.html', credit: 'JkHuger · MIT · Uiverse.io (github.com/uiverse-io/galaxy)' },
  { name: 'Cubo de arame', desc: 'Um cubo em wireframe com um núcleo que gira por dentro.', color: '#c6f432', src: 'uiverse/cubo-arame.html', credit: 'Nawsome · MIT · Uiverse.io (github.com/uiverse-io/galaxy)' },
  { name: 'Barras de som', desc: 'Barrinhas de neon que sobem e descem como um equalizador.', color: '#7b5cff', src: 'uiverse/barras.html', fit: .85, credit: 'NlghtM4re · MIT · Uiverse.io (github.com/uiverse-io/galaxy)' },
  { name: 'Pontos em onda', desc: 'Uma grade de pontos que ondula em violeta.', color: '#7b5cff', src: 'uiverse/pontos.html', credit: 'Z4drus · MIT · Uiverse.io (github.com/uiverse-io/galaxy)' }
];

export const DATA = { models: MODELS, '3d': SHAPES3D, materials: MATERIALS, pixel: PIXELS, vector: VECTORS, artifacts: ARTIFACTS, anims: ANIMATIONS };
