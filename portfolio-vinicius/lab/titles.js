/* =========================================================
   Laboratório · títulos das bibliotecas (home)
   Cada título é desenhado "na linguagem" da própria seção e reage ao cursor:
     artefatos  passes de render (wireframe, argila, normal, beauty) que abrem em leque isométrico no hover e voltam como borracha (canvas)
     objetos    letras extrudadas em 3D: hover inclina e acelera o giro, sai e volta como borracha; clique troca o acabamento (CSS 3D)
     pixel      fonte pixel 5×7; no hover um Pac-Man come os pixels e eles caem de volta quicando como borracha (canvas)
     formas     letras montadas com as peças dos componentes 2D; no hover viram outras formas numa onda de choque e voltam como borracha (canvas)
     animacoes  split text: fatias verticais que giram quando a onda passa, com aberração cromática (canvas)
     cenas      vitrine em órbita: no hover as letras flutuam com paralaxe e objetos orbitam o título; voltam como borracha (DOM)
   O texto continua no <h3> (aria-label) para leitores de tela e SEO.
   ========================================================= */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const DPR = Math.min(devicePixelRatio || 1, 2);
const C = { ink: '#f2f0eb', violet: '#7b5cff', pink: '#ff3fa4', orange: '#ff8a3d', lime: '#c6f432' };
const PAL = [C.violet, C.pink, C.orange, C.lime];
const mouse = { x: -1e4, y: -1e4 };
addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });
const lerp = (a, b, k) => a + (b - a) * k;

/* ---------- base: quebra o texto em letras (mantendo a quebra por palavra) ---------- */
function split(h) {
  const text = h.textContent.trim();
  h.setAttribute('aria-label', text);
  h.innerHTML = text.split(' ').map(w => `<span class="tt-w" aria-hidden="true">${[...w].map(c => `<span class="tt-ch">${c}</span>`).join('')}</span>`).join(' ');
  return [...h.querySelectorAll('.tt-ch')];
}
// posição de cada letra relativa ao título (a fonte, o tamanho e a quebra de linha vêm do CSS)
const layout = (h, chars) => {
  const r = h.getBoundingClientRect(), cs = getComputedStyle(h);
  const up = cs.textTransform === 'uppercase';   // desenha com o mesmo caixa do texto real
  return { r, fs: parseFloat(cs.fontSize), font: `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`,
    boxes: chars.map(c => { const b = c.getBoundingClientRect(); return { ch: up ? c.textContent.toUpperCase() : c.textContent, x: b.left - r.left, y: b.top - r.top, w: b.width, h: b.height }; }) };
};

/* ---------- títulos desenhados em canvas ---------- */
const PAD = 40;
function canvasTitle(h, chars, fx) {
  h.classList.add('is-canvas');
  const cv = document.createElement('canvas'); cv.className = 'tt-cv'; cv.setAttribute('aria-hidden', 'true'); h.append(cv);
  const st = { h, cv, ctx: cv.getContext('2d'), chars, fx, t: 0, L: null, data: {} };
  st.resize = () => {
    st.L = layout(h, chars);
    const W = st.L.r.width + PAD * 2, H = st.L.r.height + PAD * 2;
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
    cv.style.width = W + 'px'; cv.style.height = H + 'px';
    st.W = W; st.H = H; fx.init(st);
  };
  return st;
}
// máscara do texto: desenha cada letra na posição real dela e devolve os pontos de uma grade
function mask(st, step) {
  const { W, H, L } = st, o = document.createElement('canvas');
  o.width = Math.ceil(W); o.height = Math.ceil(H);
  const g = o.getContext('2d');
  g.fillStyle = '#fff'; g.font = L.font; g.textBaseline = 'middle'; g.textAlign = 'center';
  L.boxes.forEach(b => g.fillText(b.ch, PAD + b.x + b.w / 2, PAD + b.y + b.h / 2 + L.fs * .02));
  const d = g.getImageData(0, 0, o.width, o.height).data, pts = [];
  for (let y = 0; y < o.height; y += step) for (let x = 0; x < o.width; x += step) if (d[(y * o.width + x) * 4 + 3] > 140) pts.push([x, y]);
  return { pts, canvas: o };
}
// split text: duração de uma passada (s) e quanto o texto está enrolado (0 plano → 1 anel) ao longo dela
const SPLIT_T = 4.2;   // ida + volta
const ease = x => x < .5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
const splitK = q => q <= 0 || q >= 1 ? 0 : q < .1 ? ease(q / .1) : q < .9 ? 1 : ease(1 - (q - .9) / .1);
function mixHex(a, b, u) {
  const A = parseInt(a.slice(1), 16), B = parseInt(b.slice(1), 16);
  const ch = s => Math.round(((A >> s) & 255) + (((B >> s) & 255) - ((A >> s) & 255)) * u);
  return `rgb(${ch(16)},${ch(8)},${ch(0)})`;
}

const FX = {
  // split text (referência: CC Split do After Effects) — só no hover: um anel atravessa o título da esquerda pra direita;
  // as fatias dentro dele são esticadas num círculo (topo e base viram arcos que se fecham nas laterais), o resto fica plano.
  // Rastro ciano tracejado com brilho atrás, franja vermelha na frente e azul atrás, núcleo branco.
  split: {
    init(st) {
      const m = mask(st, 2).canvas;
      const tint = col => { const c = document.createElement('canvas'); c.width = m.width; c.height = m.height;
        const g = c.getContext('2d'); g.drawImage(m, 0, 0); g.globalCompositeOperation = 'source-in'; g.fillStyle = col; g.fillRect(0, 0, c.width, c.height); return c; };
      const bx = st.L.boxes, x0 = PAD + Math.min(...bx.map(b => b.x)), x1 = PAD + Math.max(...bx.map(b => b.x + b.w));
      const glow = document.createElement('canvas'); glow.width = st.cv.width; glow.height = st.cv.height;
      Object.assign(st.data, { white: tint('#f6f4f0'), cyan: tint('#2fffd8'), red: tint('#ff2f55'), blue: tint('#5866ff'), x0, x1, glow, gctx: glow.getContext('2d') });
      st.data.t0 ??= -99;
      const n = Math.ceil(st.W / 2) + 1;                                                 // uma mola de altura por fatia (efeito borracha)
      Object.assign(st.data, { sh: new Float32Array(n).fill(1), vh: new Float32Array(n), last: st.t });
      if (!st.data.hooked) { st.data.hooked = true;
        st.h.addEventListener('pointerenter', () => { st.data.t0 = st.t; }); }   // toda vez que o mouse entra no título, o corte recomeça do zero
    },
    draw(st) {
      const { ctx, data: d, W, H } = st;
      const p = (st.t - d.t0) / SPLIT_T, dt = Math.min(.05, Math.max(0, st.t - d.last)); d.last = st.t;
      if (reduce || ((p < 0 || p >= 1) && !d.moving)) { ctx.drawImage(d.white, 0, 0); return; }   // parado: texto inteiro
      const fs = st.L.fs, cy = H / 2, SW = 2, TH = 1.75;                                 // TH: até onde a fatia gira (rad) — passa de 90° e volta
      const geo = q => {
        const k = splitK(q) > .004 ? splitK(q) : 0;
        const qq = Math.min(1, Math.max(0, q)), dir = qq < .5 ? 1 : -1;                // ida (esq → dir) e volta (dir → esq)
        const cx = lerp(d.x0 + (d.x1 - d.x0) * .1, d.x1 - (d.x1 - d.x0) * .1, ease(qq < .5 ? qq * 2 : 2 - qq * 2));
        const R = fs * .78 * k, Z = fs * 1.25 * k, S = lerp(1, 1.85, k);                // raio do anel, meia largura da zona, altura máxima
        const out = [];
        for (let x = 0; x < W; x += SW) {
          const dd = x + SW / 2 - cx;
          if (!k || Math.abs(dd) >= Z) {                                                 // fora do anel: plano, altura vem da mola
            const s = d.sh[x / SW];
            out.push({ sx: x, dx: x, dw: SW, dh: H * s, dy: cy - H * s / 2, z: 0 }); continue; }
          const th = dd / Z * TH, c = Math.cos(th), sy = Math.max(.03, S * Math.abs(c));
          const dw = Math.max(.8, SW * Math.abs(R * c * TH / Z) + .3);                   // fatias finas nas bordas = tracejado
          out.push({ sx: x, dx: cx + R * Math.sin(th) - dw / 2, dw, dh: H * sy, dy: cy - H * sy / 2, z: k * dir, back: c < 0, sy });
        }
        return out;
      };
      const paint = (g, src, list, off = 0, alpha = 1, ring = false) => { for (const f of list) {
        if (ring && !f.z) continue;   // z: força do anel com o sentido do movimento (franja vermelha sempre na frente)
        g.globalAlpha = alpha * (f.back ? .6 : 1);
        g.drawImage(src, f.sx, 0, SW, H, f.dx + off * f.z, f.dy, f.dw, f.dh); } };
      const now = geo(p);
      // borracha: dentro do anel a fatia segue o anel; ao sair, a altura volta pra 1 numa mola pouco amortecida (passa do ponto e balança)
      let moving = false;
      now.forEach((f, i) => {
        if (f.z) { d.sh[i] = f.sy; d.vh[i] = 0; moving = true; return; }
        const a = 260 * (1 - d.sh[i]) - 7 * d.vh[i];
        d.vh[i] += a * dt; d.sh[i] += d.vh[i] * dt;
        if (Math.abs(1 - d.sh[i]) > .002 || Math.abs(d.vh[i]) > .02) moving = true; else { d.sh[i] = 1; d.vh[i] = 0; }
      });
      d.moving = moving;
      // brilho ciano: o anel atual + rastro (posições de instantes anteriores, ficando pra trás)
      const g = d.gctx; g.setTransform(DPR, 0, 0, DPR, 0, 0); g.globalCompositeOperation = 'source-over'; g.clearRect(0, 0, W, H);
      g.globalCompositeOperation = 'lighter';
      for (let i = 6; i >= 1; i--) { const e = geo(p - i * .022); paint(g, d.cyan, e, 0, .32 * (1 - i / 7), true); }
      paint(g, d.cyan, now, 0, 1, true);
      ctx.globalCompositeOperation = 'lighter';
      ctx.filter = `blur(${Math.max(3, Math.round(fs * .12))}px)`; ctx.drawImage(d.glow, 0, 0, W, H); ctx.filter = 'none';
      ctx.globalAlpha = .8; ctx.drawImage(d.glow, 0, 0, W, H);
      const ab = fs * .06;                                                               // aberração cromática só no anel
      paint(ctx, d.red, now, ab, .9, true); paint(ctx, d.blue, now, -ab, .55, true);
      ctx.globalCompositeOperation = 'source-over';
      paint(ctx, d.white, now, 0, 1);
      ctx.globalAlpha = 1;
    }
  },
  // artefatos 3D — passes de render + scanner: em repouso só o passe escolhido (Beauty = cor final no degradê do site);
  // hover: o título se separa nos passes de um render (wireframe, argila, normal map, beauty) abertos em leque isométrico,
  // cada um com o nome em mono, e uma linha de scanner percorre o passe da frente (acima dela vira malha); ao sair, as camadas se juntam numa mola de borracha. Clique: troca o passe em repouso
  artefatos: {
    init(st) {
      const d = st.data, m = mask(st, 2).canvas, fs = st.L.fs, W = m.width, H = m.height;
      const cnv = () => { const c = document.createElement('canvas'); c.width = W; c.height = H; return c; };
      const clip = (paint) => { const c = cnv(), g = c.getContext('2d'); paint(g); g.globalCompositeOperation = 'destination-in'; g.drawImage(m, 0, 0); return c; };
      const lin = (g, x0, y0, x1, y1, stops) => { const gr = g.createLinearGradient(x0, y0, x1, y1); stops.forEach(([o, c]) => gr.addColorStop(o, c)); return gr; };
      // borda da letra (máscara deslocada em 8 direções menos o miolo)
      const edge = (col, w) => { const c = cnv(), g = c.getContext('2d');
        for (let k = 0; k < 8; k++) { const a = k * Math.PI / 4; g.drawImage(m, Math.cos(a) * w, Math.sin(a) * w); }
        g.globalCompositeOperation = 'destination-out'; g.drawImage(m, 0, 0);
        g.globalCompositeOperation = 'source-in'; g.fillStyle = col; g.fillRect(0, 0, W, H); return c; };
      const noise = a => { const c = cnv(), g = c.getContext('2d'), id = g.createImageData(W, H);
        for (let i = 0; i < id.data.length; i += 4) { const v = Math.random() * 255; id.data[i] = id.data[i + 1] = id.data[i + 2] = v; id.data[i + 3] = a; }
        g.putImageData(id, 0, 0); return c; };
      // wireframe: malha triangulada lima dentro da letra + aresta
      const s = Math.max(4, fs * .11);
      const wire = clip(g => { g.strokeStyle = 'rgba(198, 244, 50, .55)'; g.lineWidth = 1; g.beginPath();
        for (let y = 0; y < H; y += s) { g.moveTo(0, y); g.lineTo(W, y); }
        for (let x = -H; x < W; x += s) { g.moveTo(x, 0); g.lineTo(x + H, H); }
        g.stroke(); });
      wire.getContext('2d').drawImage(edge('#c6f432', Math.max(1, fs * .018)), 0, 0);
      // argila: bege fosco com luz de cima e grão
      const clay = clip(g => { g.fillStyle = lin(g, 0, PAD, 0, H - PAD, [[0, '#f1e6da'], [.6, '#d6c1ab'], [1, '#a88d76']]); g.fillRect(0, 0, W, H);
        g.globalAlpha = .5; g.drawImage(noise(40), 0, 0); });
      // normal map: azul-lilás de base com as cores típicas puxando nas bordas
      const normal = clip(g => { g.fillStyle = lin(g, 0, 0, W, 0, [[0, '#6f7dff'], [.5, '#8c84ff'], [1, '#c48cff']]); g.fillRect(0, 0, W, H);
        g.globalCompositeOperation = 'overlay'; g.fillStyle = lin(g, 0, PAD, 0, H - PAD, [[0, '#7fffb0'], [.5, '#8080ff'], [1, '#ff7fd0']]); g.fillRect(0, 0, W, H); });
      // beauty: cor final no degradê do site, faixa de brilho em cima e contorno escuro
      const beauty = clip(g => { g.fillStyle = lin(g, PAD, 0, W - PAD, 0, [[0, '#7b5cff'], [.5, '#ff3fa4'], [1, '#ff8a3d']]); g.fillRect(0, 0, W, H);
        g.fillStyle = lin(g, 0, PAD, 0, H - PAD, [[0, 'rgba(255,255,255,.35)'], [.45, 'rgba(255,255,255,0)'], [1, 'rgba(0,0,0,.18)']]); g.fillRect(0, 0, W, H); });
      Object.assign(d, { passes: { wire, clay, normal, beauty } });
      d.order ??= ['wire', 'clay', 'normal', 'beauty'];                     // de trás pra frente; o último é o que aparece em repouso
      d.k ??= 0; d.vk ??= 0; d.last = st.t; d.over ??= false;
      d.scan ??= -9;                                                          // início da passada do scanner
      d.tmp = document.createElement('canvas'); d.tmp.width = W; d.tmp.height = H;
      if (!d.hooked) { d.hooked = true;
        st.h.style.cursor = 'pointer';
        st.h.addEventListener('pointerenter', () => { d.over = true; d.scan = st.t; });
        st.h.addEventListener('pointerleave', () => { d.over = false; });
        st.h.addEventListener('click', () => {                                // Beauty → Argila → Wireframe
          const next = { beauty: 'clay', clay: 'wire', wire: 'beauty' }[d.order[3]] || 'beauty';
          d.order = ['wire', 'clay', 'normal', 'beauty'].filter(n => n !== next).concat(next); d.vk += 4; }); }
    },
    draw(st) {
      const { ctx, data: d, W, H } = st, fs = st.L.fs;
      const dt = Math.min(.05, Math.max(0, st.t - d.last)); d.last = st.t;
      const goal = d.over ? 1 : 0;
      if (reduce) d.k = goal; else { d.vk += (70 * (goal - d.k) - 6.5 * d.vk) * dt; d.k += d.vk * dt; }   // borracha
      const k = d.k, cx = W / 2, cy = H / 2;
      const NAMES = { wire: 'WIREFRAME', clay: 'ARGILA', normal: 'NORMAL', beauty: 'BEAUTY' };
      d.order.forEach((name, j) => {
        const n = 3 - j;                                                      // 0 = frente
        if (Math.abs(k) < .002 && n) return;                                  // repouso: só o passe da frente
        const ox = (1.5 - n) * fs * .22 * k, oy = (n - 1.5) * fs * .16 * k;
        ctx.save();
        ctx.translate(cx + ox, cy + oy); ctx.transform(1, 0, -.32 * k, 1 - .1 * k, 0, 0); ctx.translate(-cx, -cy);   // plano isométrico
        ctx.globalAlpha = n ? Math.min(1, Math.max(0, k * 1.4)) * (1 - n * .1) : 1;
        // scanner (só no passe da frente): uma linha lima desce e sobe; acima dela o passe vira malha wireframe
        const sp = (st.t - d.scan) / 1.6, scanning = !n && sp >= 0 && sp < 1 && !reduce && name !== 'wire';
        let src = d.passes[name], ly = 0;
        if (scanning) {
          ly = PAD + (H - PAD * 2) * (sp < .5 ? ease(sp * 2) : ease(2 - sp * 2));
          const g = d.tmp.getContext("2d"), tw = d.tmp.width, th = d.tmp.height, sy = Math.round(ly);   // máscaras estão em px CSS
          g.setTransform(1, 0, 0, 1, 0, 0); g.clearRect(0, 0, tw, th);
          g.drawImage(d.passes.wire, 0, 0, tw, sy, 0, 0, tw, sy);              // acima da linha: malha
          g.drawImage(src, 0, sy, tw, th - sy, 0, sy, tw, th - sy);           // abaixo: o passe
          src = d.tmp;
        }
        ctx.drawImage(src, 0, 0, W, H);
        if (scanning) {
          const gl = ctx.createLinearGradient(0, ly - fs * .12, 0, ly + fs * .12);
          gl.addColorStop(0, 'rgba(198,244,50,0)'); gl.addColorStop(.5, 'rgba(198,244,50,.55)'); gl.addColorStop(1, 'rgba(198,244,50,0)');
          ctx.fillStyle = gl; ctx.fillRect(PAD - fs * .2, ly - fs * .12, W - PAD * 2 + fs * .4, fs * .24);
          ctx.fillStyle = '#c6f432'; ctx.fillRect(PAD - fs * .2, ly - .75, W - PAD * 2 + fs * .4, 1.5);
        }
        if (k > .05) {                                                        // moldura e nome do passe
          ctx.globalAlpha = Math.min(1, k) * .7;
          ctx.strokeStyle = 'rgba(242, 240, 235, .22)'; ctx.lineWidth = 1;
          ctx.strokeRect(PAD - fs * .12, PAD - fs * .1, W - PAD * 2 + fs * .24, H - PAD * 2 + fs * .2);
          ctx.fillStyle = name === 'wire' ? '#c6f432' : 'rgba(242, 240, 235, .75)';
          ctx.font = `500 ${Math.max(8, Math.round(fs * .13))}px "JetBrains Mono", monospace`; ctx.textBaseline = 'bottom';
          ctx.fillText(NAMES[name], PAD - fs * .12, PAD - fs * .14);
        }
        ctx.restore();
      });
    }
  }
};
/* ---------- pixel art: título numa fonte pixel 5×7 desenhada pixel a pixel, com sombra como os sprites
   no hover: um Pac-Man atravessa (a partir do lado onde o cursor entrou) e come os pixels; atrás dele cada pixel
   cai de cima, quica como borracha e volta pro lugar com as cores das paletas até assentar ---------- */
const FONT5 = {
  P: ['####.', '#...#', '#...#', '####.', '#....', '#....', '#....'], I: ['###', '.#.', '.#.', '.#.', '.#.', '.#.', '###'],
  X: ['#...#', '#...#', '.#.#.', '..#..', '.#.#.', '#...#', '#...#'], E: ['#####', '#....', '#....', '####.', '#....', '#....', '#####'],
  L: ['#....', '#....', '#....', '#....', '#....', '#....', '#####'], A: ['.###.', '#...#', '#...#', '#####', '#...#', '#...#', '#...#'],
  R: ['####.', '#...#', '#...#', '####.', '#.#..', '#..#.', '#...#'], T: ['#####', '..#..', '..#..', '..#..', '..#..', '..#..', '..#..'],
  ' ': ['..', '..', '..', '..', '..', '..', '..'],
};
const PAC = {   // boca aberta / fechada (13×13)
  open: ['....yyyyy....', '..yyyyyyyyy..', '.yyyyyyyyyyy.', '.yyyyykyyyy..', 'yyyyyyyyyy...', 'yyyyyyyy.....', 'yyyyyy.......',
         'yyyyyyyy.....', 'yyyyyyyyyy...', '.yyyyyyyyyy..', '.yyyyyyyyyyy.', '..yyyyyyyyy..', '....yyyyy....'],
  shut: ['....yyyyy....', '..yyyyyyyyy..', '.yyyyyyyyyyy.', '.yyyyykyyyyy.', 'yyyyyyyyyyyyy', 'yyyyyyyyyyyyy', 'yyyyyyyyyyyyy',
         'yyyyyyyyyyyyy', 'yyyyyyyyyyyyy', '.yyyyyyyyyyy.', '.yyyyyyyyyyy.', '..yyyyyyyyy..', '....yyyyy....'],
};
const PIXPAL = ['#3fd6ff', '#ff3fa4', '#c6f432', '#ffd23f', '#8c5bff'];
function pixelTitle(h) {
  const text = h.textContent.trim().toUpperCase();
  h.setAttribute('aria-label', h.textContent.trim());
  h.innerHTML = `<span class="tt-ghost" aria-hidden="true"></span>`;
  const ghost = h.firstChild, cv = document.createElement('canvas'), ctx = cv.getContext('2d');
  cv.className = 'tt-cv'; cv.setAttribute('aria-hidden', 'true'); h.append(cv);
  // pixels da palavra em células
  const px = []; let X = 0;
  for (const ch of text) { const g = FONT5[ch] || FONT5[' '];
    g.forEach((row, y) => [...row].forEach((v, x) => { if (v === '#') px.push({ x: X + x, y, eat: Infinity, back: Infinity, oy: 0, vy: 0, c: 0, fall: false }); }));
    X += g[0].length + 1; }
  const CW = X - 1;
  let c = 1, W = 0, H = 0, last = 0, live = false, pac = null;
  const fit = () => {
    const fs = parseFloat(getComputedStyle(h).fontSize), avail = h.parentElement.clientWidth || 1e4;
    c = Math.max(2, Math.floor(Math.min(fs * .82 / 7, avail * .98 / CW)));      // célula inteira = pixels nítidos
    ghost.style.cssText = `width:${CW * c}px;height:${7 * c}px;vertical-align:top`;
    W = CW * c + PAD * 2; H = 7 * c + PAD * 2;
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR); cv.style.width = W + 'px'; cv.style.height = H + 'px';
  };
  fit(); addEventListener('resize', fit);
  h.addEventListener('pointerenter', e => {                                           // toda vez que o cursor entra, o Pac-Man passa de novo
    if (reduce) return;
    const r = cv.getBoundingClientRect(), dir = e.clientX - r.left < W / 2 ? 1 : -1;
    const ps = c * 9 / 13, pw = 13 * ps, speed = c * 26;                              // Pac-Man um pouco maior que a letra
    const x0 = dir > 0 ? PAD - pw : PAD + CW * c + pw;
    pac = { t0: last, dir, ps, pw, speed, x0 };
    for (const q of px) { const cxp = PAD + (q.x + .5) * c;
      q.eat = last + (cxp - x0) * dir / speed - .02; q.back = q.eat + .3 + Math.random() * .35; q.fall = false; q.oy = q.vy = 0; }
    live = true;
  });
  const sq = (x, y, s, col) => { ctx.fillStyle = col; ctx.fillRect(Math.round(x), Math.round(y), s, s); };
  return { draw(t) {
    const dt = Math.min(.05, Math.max(0, t - last)); last = t;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.clearRect(0, 0, W, H);
    let moving = false; const sh = Math.max(1, Math.round(c * .22)), s = c - 1;
    // física: comido some; ao voltar, cai de cima numa mola de borracha (quica e assenta)
    for (const q of px) {
      q.hide = false; q.dy = 0; q.col = C.ink;
      if (!live || q.eat === Infinity) continue;
      if (t < q.eat) { moving = true; continue; }
      if (t < q.back) { q.hide = true; moving = true; continue; }
      if (!q.fall) { q.fall = true; q.oy = -c * (3 + Math.random() * 5); q.vy = 0; q.c = Math.random() * PIXPAL.length | 0; }
      q.vy += (-170 * q.oy - 7 * q.vy) * dt; q.oy += q.vy * dt;
      const e = Math.min(1, Math.abs(q.oy) / (c * 2.5) + Math.abs(q.vy) / (c * 30));
      if (e > .01) moving = true; else { q.oy = 0; q.vy = 0; }
      q.dy = q.oy; if (e > .02) q.col = e > .3 ? PIXPAL[q.c] : mixHex(C.ink, PIXPAL[q.c], e / .3);
    }
    // sombra (como o contorno dos sprites) e depois o pixel
    for (const q of px) if (!q.hide) sq(PAD + q.x * c + sh, PAD + q.y * c + q.dy + sh, s, 'rgba(123, 92, 255, .55)');
    for (const q of px) if (!q.hide) sq(PAD + q.x * c, PAD + q.y * c + q.dy, s, q.col);
    // Pac-Man
    if (live && pac) {
      const pxx = pac.x0 + pac.dir * pac.speed * (t - pac.t0);
      const out = pac.dir > 0 ? pxx - pac.pw / 2 > W : pxx + pac.pw / 2 < 0;
      if (!out) { moving = true;
        const map = Math.floor((t - pac.t0) * 12) % 2 ? PAC.shut : PAC.open, ps = pac.ps, top = PAD + 3.5 * c - 6.5 * ps;
        map.forEach((row, y) => [...row].forEach((v, x) => { if (v === '.') return;
          const xx = pac.dir > 0 ? x : 12 - x;                                         // vira pro lado em que anda
          ctx.fillStyle = v === 'k' ? '#1a1a1a' : '#ffd23f';
          ctx.fillRect(pxx - pac.pw / 2 + xx * ps, top + y * ps, Math.ceil(ps), Math.ceil(ps)); })); }
    }
    if (live && !moving) { live = false; pac = null; for (const q of px) { q.eat = q.back = Infinity; q.fall = false; q.oy = q.vy = 0; } }
  } };
}
/* ---------- formas 2D: letras montadas com as peças dos componentes 2D (barras, discos, meias-luas, anéis, triângulos)
   no hover: onda de choque a partir do cursor, cada peça é arremessada, gira e vira outra forma colorida,
   e volta pro lugar numa mola de borracha até remontar a palavra ---------- */
const V2 = { k: C.ink, a: '#8c5bff', b: '#c9b3ff' };          // paleta dos cartões de formas 2D (tinta, destaque, terceira)
const T2 = 2.2;                                                // espessura do traço, em unidades (letra = 10 de altura)
const pc = (cx, cy, col, path, stroke = false) => ({ cx, cy, col, path, stroke });
const rect = (x, y, w, h, col) => pc(x + w / 2, y + h / 2, col, g => g.rect(x, y, w, h));
const poly = (pts, col, stroke = false) => pc(pts.reduce((s, p) => s + p[0], 0) / pts.length, pts.reduce((s, p) => s + p[1], 0) / pts.length, col,
  g => { g.moveTo(...pts[0]); pts.slice(1).forEach(p => g.lineTo(...p)); g.closePath(); }, stroke);
const arc = (cx, cy, r, a0, a1, col, stroke = true, ccw = false, c = [cx, cy]) => pc(c[0], c[1], col,
  g => { if (!stroke) g.moveTo(cx + r * Math.cos(a0), cy + r * Math.sin(a0)); g.arc(cx, cy, r, a0, a1, ccw); if (!stroke) g.closePath(); }, stroke);
const PI = Math.PI;
const GLYPHS = {
  F: [6.2, [rect(0, 0, T2, 10, V2.k), rect(T2, 0, 4, T2, V2.a), poly([[T2, 3.9], [5.8, 5.1], [T2, 6.3]], V2.b)]],
  O: [10, [arc(5, 5, 3.9, 0, PI * 2, V2.k), arc(5, 5, 1.3, 0, PI * 2, V2.a, false)]],
  R: [7.4, [rect(0, 0, T2, 10, V2.k), arc(T2, 2.9, 2.9, -PI / 2, PI / 2, V2.a, false, false, [3.4, 2.9]), poly([[2.6, 5.8], [4.9, 5.8], [7.4, 10], [5.1, 10]], V2.k)]],
  M: [10.4, [rect(0, 0, T2, 10, V2.k), rect(8.2, 0, T2, 10, V2.k), poly([[T2, 0], [8.2, 0], [5.2, 6.2]], V2.b)]],
  A: [9.4, [poly([[4.7, 1.2], [8.3, 8.9], [1.1, 8.9]], V2.k, true), arc(4.7, 6.3, 1.05, 0, PI * 2, V2.a, false)]],
  S: [7, [arc(3.5, 2.9, 1.8, -.15, PI / 2, V2.k, true, true), arc(3.5, 7.1, 1.8, -PI / 2, PI + .15, V2.a)]],
  '2': [7.2, [arc(3.6, 3.1, 2, PI, .55, V2.k), poly([[4.4, 4.2], [6, 5.6], [2.7, 7.8], [.1, 7.8]], V2.b), rect(0, 7.8, 7.2, T2, V2.a)]],
  D: [7.6, [rect(0, 0, T2, 10, V2.k), arc(T2, 5, 3.9, -PI / 2, PI / 2, V2.b, true, false, [4.4, 5])]],
  ' ': [2.4, []],
};
function formas2d(h) {
  const text = h.textContent.trim().toUpperCase(), GAP = 1.3;
  h.setAttribute('aria-label', h.textContent.trim());
  h.innerHTML = `<span class="tt-ghost" aria-hidden="true"></span>`;
  const ghost = h.firstChild, cv = document.createElement('canvas'), ctx = cv.getContext('2d');
  cv.className = 'tt-cv'; cv.setAttribute('aria-hidden', 'true'); h.append(cv);
  // monta as peças da palavra em unidades
  const parts = []; let X = 0;
  for (const ch of text) { const [w, ps] = GLYPHS[ch] || GLYPHS[' ']; ps.forEach(p => parts.push({ ...p, x0: X, ox: 0, oy: 0, vx: 0, vy: 0, a: 0, va: 0, kick: Infinity, k: 0, c: 0 })); X += w + GAP; }
  const UW = X - GAP;
  let u = 1, W = 0, H = 0, last = 0, live = false;
  const fit = () => {
    const fs = parseFloat(getComputedStyle(h).fontSize), avail = h.parentElement.clientWidth || 1e4;
    u = Math.min(fs * .082, avail * .98 / UW);
    ghost.style.cssText = `width:${UW * u}px;height:${10 * u}px;vertical-align:top`;
    W = UW * u + PAD * 2; H = 10 * u + PAD * 2;
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR); cv.style.width = W + 'px'; cv.style.height = H + 'px';
  };
  fit(); addEventListener('resize', fit);
  h.addEventListener('pointerenter', e => {                     // toda vez que o cursor entra, uma nova onda a partir dele
    if (reduce) return;
    const r = cv.getBoundingClientRect(), ex = e.clientX - r.left, ey = e.clientY - r.top;
    for (const q of parts) { const px = PAD + (q.x0 + q.cx) * u, py = PAD + q.cy * u;
      q.kick = last + Math.hypot(px - ex, (py - ey) * .5) / (u * 110); q.ex = ex; q.ey = ey; }
    live = true;
  });
  const shape = (g, k, s) => { g.beginPath();
    if (k === 1) g.arc(0, 0, s * .6, 0, PI * 2);
    else if (k === 2) { g.moveTo(0, -s * .7); g.lineTo(s * .62, s * .5); g.lineTo(-s * .62, s * .5); g.closePath(); }
    else { g.moveTo(0, -s * .72); g.lineTo(s * .5, 0); g.lineTo(0, s * .72); g.lineTo(-s * .5, 0); g.closePath(); } };
  return { draw(t) {
    const dt = Math.min(.05, Math.max(0, t - last)); last = t;
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0); ctx.clearRect(0, 0, W, H);
    let moving = false;
    for (const q of parts) {
      if (live && t >= q.kick) {                                // a onda chegou: arremessa, gira e troca de forma/cor
        q.kick = Infinity;
        const px = PAD + (q.x0 + q.cx) * u, py = PAD + q.cy * u;
        let dx = px - q.ex, dy = py - q.ey; const L = Math.hypot(dx, dy) || 1; dx /= L; dy /= L;
        const v = u * (38 + Math.random() * 34);
        q.vx += (dx + (Math.random() - .5) * .8) * v; q.vy += (dy - .35 + (Math.random() - .5) * .8) * v;
        q.va += (Math.random() < .5 ? -1 : 1) * (6 + Math.random() * 7);
        q.k = 1 + (Math.random() * 3 | 0); q.c = Math.random() * 4 | 0;
      }
      // borracha: mola pouco amortecida (passa do ponto e balança)
      q.vx += (-90 * q.ox - 6.5 * q.vx) * dt; q.vy += (-90 * q.oy - 6.5 * q.vy) * dt; q.va += (-70 * q.a - 6 * q.va) * dt;
      q.ox += q.vx * dt; q.oy += q.vy * dt; q.a += q.va * dt;
      const e = Math.min(1, Math.hypot(q.ox, q.oy) / (u * 4) + Math.hypot(q.vx, q.vy) / (u * 55));
      if (q.kick !== Infinity || e > .01 || Math.abs(q.a) > .01) moving = true;
      ctx.save(); ctx.translate(PAD + (q.x0 + q.cx) * u + q.ox, PAD + q.cy * u + q.oy); ctx.rotate(q.a);
      const fly = Math.min(1, Math.max(0, (e - .08) / .25));    // 0 = peça da letra, 1 = forma em voo
      if (fly < 1) {                                             // a peça original (encolhe enquanto vira outra forma)
        ctx.save(); ctx.scale(u * (1 - fly * .6), u * (1 - fly * .6)); ctx.translate(-q.cx, -q.cy); ctx.globalAlpha = 1 - fly;
        ctx.beginPath(); q.path(ctx);
        if (q.stroke) { ctx.lineWidth = T2; ctx.lineCap = 'butt'; ctx.lineJoin = 'miter'; ctx.strokeStyle = q.col; ctx.stroke(); } else { ctx.fillStyle = q.col; ctx.fill(); }
        ctx.restore();
      }
      if (fly > 0) { ctx.globalAlpha = fly; shape(ctx, q.k, u * (2.2 + e * 1.4)); ctx.fillStyle = PAL[q.c]; ctx.fill(); }
      ctx.restore();
    }
    if (!moving && live) { live = false; for (const q of parts) q.ox = q.oy = q.vx = q.vy = q.a = q.va = 0; }
  } };
}
/* ---------- objetos 3D: como os cartões da seção — letras extrudadas em 3D (camadas em profundidade)
   hover: a palavra inclina na direção do cursor e as letras giram acelerando; ao sair, desaceleram e voltam
   de frente numa mola de borracha. Clique: troca o acabamento (Brilho → Metal → Wireframe) ---------- */
const O3_FIN = ['brilho', 'metal', 'wire'], O3_N = 9;
function objetos(h, chars) {
  h.classList.add('tt-o3', 'o3--brilho');
  const stage = document.createElement('span'); stage.className = 'o3-stage'; stage.setAttribute('aria-hidden', 'true');
  [...h.childNodes].forEach(n => stage.append(n)); h.append(stage);
  chars.forEach(c => { const ch = c.textContent;
    c.innerHTML = Array.from({ length: O3_N }, (_, i) => `<span class="o3-l" style="--i:${i}">${ch}</span>`).join(''); });
  const L = chars.map((c, i) => ({ c, i, a: 0, w: 0, at: 0 }));
  const aim = () => L.forEach(o => { o.at = Math.ceil((o.a + o.w * .35) / 360) * 360; });   // próxima volta de frente, à frente do giro
  let over = false, overT = 0, fin = 0, tx = 0, ty = 0, vx = 0, vy = 0, last = 0;
  h.addEventListener('pointerenter', () => { over = true; overT = last; });
  h.addEventListener('pointerleave', () => { over = false; aim(); });
  h.addEventListener('click', () => {                                     // troca o acabamento com um "pulo" no giro
    h.classList.remove('o3--' + O3_FIN[fin]); fin = (fin + 1) % O3_FIN.length; h.classList.add('o3--' + O3_FIN[fin]);
    if (!reduce) { L.forEach(o => { o.w += 520 + o.i * 25; }); if (!over) aim(); }
  });
  return { draw(t) {
    const dt = Math.min(.05, Math.max(0, t - last)); last = t;
    if (reduce) return;
    // inclinação da palavra na direção do cursor (mola)
    const r = h.getBoundingClientRect();
    const gx = over ? ((mouse.y - r.top) / r.height - .5) * -26 : 0, gy = over ? ((mouse.x - r.left) / r.width - .5) * 34 : 0;
    vx += (110 * (gx - tx) - 11 * vx) * dt; vy += (110 * (gy - ty) - 11 * vy) * dt; tx += vx * dt; ty += vy * dt;
    stage.style.transform = `rotateX(${tx.toFixed(2)}deg) rotateY(${ty.toFixed(2)}deg)`;
    for (const o of L) {
      if (over) {                                                          // gira e acelera (onda: cada letra entra um pouco depois)
        const k = Math.min(1, Math.max(0, (t - overT) * 1.6 - o.i * .07));
        o.w += ((180 + 420 * k * k) - o.w) * Math.min(1, dt * 2.4) * (k > 0 ? 1 : 0);
      } else {                                                             // borracha: volta de frente (múltiplo de 360°) e balança
        o.w += (-90 * (o.a - o.at) - 6 * o.w) * dt;
        if (Math.abs(o.a - o.at) < .2 && Math.abs(o.w) < 2) { o.a = o.at = 0; o.w = 0; }
      }
      o.a += o.w * dt;
      o.c.style.transform = `rotateY(${o.a.toFixed(2)}deg)`;
    }
  } };
}

/* ---------- cenas interativas: "vitrine em órbita" — como a cena da seção (celular, cartões, bola orbitando)
   hover: as letras se soltam em profundidade e flutuam com paralaxe do cursor; bola, cartão, celular, estrela e anel
   orbitam o título numa elipse 3D (passam na frente e atrás das letras); ao sair, tudo volta numa mola de borracha ---------- */
const ORBS = ['ball', 'card', 'phone', 'star', 'ring', 'card'];
function cenas(h, chars) {
  h.classList.add('tt-scene');
  const box = document.createElement('span'); box.className = 'sc-box'; box.setAttribute('aria-hidden', 'true');
  box.innerHTML = ORBS.map(o => `<span class="sc-o sc-${o}"></span>`).join(''); h.append(box);
  const orbs = [...box.children].map((el, i) => ({ el, a0: i / ORBS.length * Math.PI * 2, sp: .9 + (i % 3) * .18 }));
  const L = chars.map((c, i) => ({ c, i, z: .35 + ((i * 7) % 10) / 15, ph: i * 1.7 }));
  let over = false, k = 0, vk = 0, last = 0, rot = 0;
  h.addEventListener('pointerenter', () => { over = true; });
  h.addEventListener('pointerleave', () => { over = false; });
  return { draw(t) {
    const dt = Math.min(.05, Math.max(0, t - last)); last = t;
    if (reduce) return;
    vk += (70 * ((over ? 1 : 0) - k) - 6.5 * vk) * dt; k += vk * dt;          // borracha
    if (Math.abs(k) < .001 && Math.abs(vk) < .001 && !over) {
      if (k !== 0) { k = 0; L.forEach(o => { o.c.style.transform = ''; }); orbs.forEach(o => { o.el.style.opacity = 0; }); }
      return;
    }
    const r = h.getBoundingClientRect(), fs = parseFloat(getComputedStyle(h).fontSize);
    const px = Math.max(-1, Math.min(1, (mouse.x - (r.left + r.width / 2)) / (r.width / 2)));
    const py = Math.max(-1, Math.min(1, (mouse.y - (r.top + r.height / 2)) / (r.height / 2)));
    // letras: sobem, flutuam (cada uma no seu ritmo) e se deslocam conforme a profundidade
    for (const o of L) {
      const bob = Math.sin(t * 2.1 + o.ph) * fs * .07, x = -px * fs * .22 * o.z * k, y = (-py * fs * .14 * o.z - fs * .06 + bob) * k;
      o.c.style.transform = `translate(${x.toFixed(2)}px, ${y.toFixed(2)}px) rotate(${(Math.sin(t * 1.3 + o.ph) * 4 * k).toFixed(2)}deg) scale(${(1 + .07 * o.z * k).toFixed(3)})`;
    }
    // objetos: elipse 3D em volta do título, inclinada pelo cursor; atrás das letras quando estão "longe"
    rot += dt * (1 + Math.abs(px) * 1.2);
    box.style.fontSize = (fs * .3).toFixed(1) + 'px';
    const cx = r.width / 2, cy = r.height / 2, rx = r.width * .56, ry = r.height * .62;
    for (const o of orbs) {
      const a = o.a0 + rot * o.sp, depth = Math.sin(a), s = (.55 + .45 * (depth + 1) / 2) * Math.max(0, k);
      const x = cx + Math.cos(a) * rx * Math.max(.2, k) + px * fs * .3 * depth, y = cy + depth * ry * .35 * k - Math.cos(a) * py * fs * .12 + Math.sin(t * 2 + o.a0) * fs * .05;
      o.el.style.transform = `translate(-50%, -50%) translate(${x.toFixed(1)}px, ${y.toFixed(1)}px) rotate(${(a * 40 % 360).toFixed(1)}deg) scale(${s.toFixed(3)})`;
      o.el.style.zIndex = depth > 0 ? 2 : 0;
      o.el.style.opacity = Math.min(1, Math.max(0, k * 1.5)) * (.55 + .45 * (depth + 1) / 2);
    }
  } };
}

/* ---------- monta tudo ---------- */
const items = [];
(async () => {
  try { await document.fonts.ready; } catch {}
  document.querySelectorAll('.tt[data-fx]').forEach(h => {
    const fx = h.dataset.fx;
    const chars = split(h);
    if (fx === 'pixel') return items.push({ h, ...pixelTitle(h) });
    if (fx === 'formas') return items.push({ h, ...formas2d(h) });
    if (fx === 'objetos') return items.push({ h, ...objetos(h, chars) });
    if (fx === 'cenas') return items.push({ h, ...cenas(h, chars) });
    const fxName = fx === 'animacoes' ? 'split' : fx;   // animações usa o split text
    if (FX[fxName]) { const st = canvasTitle(h, chars, FX[fxName]); st.resize(); items.push({ h, st }); let w0 = h.offsetWidth, h0 = h.offsetHeight;
      new ResizeObserver(() => { if (h.offsetWidth === w0 && h.offsetHeight === h0) return; w0 = h.offsetWidth; h0 = h.offsetHeight; st.resize(); }).observe(h); }   // só refaz se o tamanho mudou de verdade
  });
  const vis = new Set();
  const io = new IntersectionObserver(es => es.forEach(e => e.isIntersecting ? vis.add(e.target) : vis.delete(e.target)), { rootMargin: '100px' });
  items.forEach(it => io.observe(it.h));
  let prev = 0;
  const loop = now => {
    requestAnimationFrame(loop);
    const dt = Math.min((now - (prev || now)) / 1000, .05); prev = now;
    for (const it of items) {
      if (!vis.has(it.h)) continue;
      if (it.st) {
        const st = it.st; st.t += dt;
        st.ctx.setTransform(DPR, 0, 0, DPR, 0, 0); st.ctx.clearRect(0, 0, st.W, st.H);
        st.fx.draw(st);
      } else it.draw(now / 1000);
    }
  };
  requestAnimationFrame(loop);
})();
