/* =========================================================
   Órbita · recria em HTML/CSS 3D o vídeo da seção "Vamos conversar":
   o retrato no centro, três anéis de painéis holográficos girando em volta (os de trás
   passam atrás dele), halos de neon com luz correndo, chuva de números em pixel (atrás e, leve,
   por cima do personagem) e pixels flutuando.
   Monta dentro de qualquer [data-orbita]. A cena fica fixa; o hover acelera os anéis.
   ========================================================= */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const BASE = new URL('./', import.meta.url).href;
const TILT = -14;   // câmera um pouco acima: os anéis aparecem como elipses

const RINGS = [   // y e r em cqw (largura do cartão); w/h = tamanho dos painéis
  { y: 10, r: 33, n: 8, w: 13, h: 8.5, spd: .32 },
  { y: 31, r: 41, n: 9, w: 19, h: 12.5, spd: .24 },
  { y: 57, r: 47, n: 11, w: 21, h: 13, spd: .19 }
];
const HALOS = [{ y: 36, r: 45, c: '#2eff8c' }, { y: 50, r: 50, c: '#4fd8ff' }, { y: 63, r: 56, c: '#7b5cff' }];

/* ---------- conteúdo dos painéis ---------- */
const bar = '<div class="orb__bar"><i></i><i></i><i></i></div>';
const code = () => `<div class="orb__code">${Array.from({ length: 6 }, (_, i) =>
  `<span style="width:${30 + ((i * 37) % 60)}%;color:${['#7fd6ff', '#ff7ad9', '#5dff9e', '#ffd25f'][i % 4]};margin-left:${(i % 3) * 8}%"></span>`).join('')}</div>`;
const PANELS = {
  rosto: () => `${bar}<img class="orb__img" src="${BASE}retrato-rosto.webp" alt="" draggable="false">`,
  olhos: () => `${bar}<img class="orb__img" src="${BASE}retrato-olhos.webp" alt="" draggable="false">`,
  codigo: () => bar + code(),
  grafico: () => `${bar}<div class="orb__chart">${[55, 80, 40, 95, 70, 100, 60].map((v, i) => `<b style="--v:${v};--i:${i}"></b>`).join('')}</div>`,
  cubo: () => `${bar}<div class="orb__cube"><svg viewBox="0 0 100 100"><path d="M50 8 88 28v44L50 92 12 72V28Z"/><path d="M12 28 50 48 88 28M50 48v44" fill="none"/><path d="M31 38 50 48 69 38 50 28Z" fill="none" opacity=".6"/></svg></div>`,
  aa: () => `${bar}<div class="orb__aa"><strong>Aa</strong><div>${['#7b5cff', '#ff3fa4', '#ff8a3d', '#c6f432', '#4fd8ff'].map(c => `<i style="background:${c}"></i>`).join('')}</div></div>`,
  terminal: () => `${bar}<div class="orb__term">${'$ npm run dev\n> ready 0.4s\n01101 ✓ build\n> deploy ↗'}</div>`
};
const ORDER = ['codigo', 'grafico', 'cubo', 'rosto', 'terminal', 'aa', 'codigo', 'olhos', 'cubo', 'grafico', 'terminal', 'codigo'];

function build(root) {
  root.innerHTML = `<div class="orb">
    <canvas class="orb__rain"></canvas>
    <div class="orb__scene"><div class="orb__world">
      ${HALOS.map(h => `<div class="orb__ring" style="top:${h.y}cqw"><div class="orb__halo" style="--r:${h.r}cqw;--c:${h.c}"></div></div>`).join('')}
      <img class="orb__face" src="${BASE}retrato.webp" alt="" draggable="false">
      ${RINGS.map((g, k) => `<div class="orb__ring" data-ring="${k}" style="top:${g.y}cqw">${Array.from({ length: g.n }, (_, i) => {
        const type = ORDER[(i + k * 3) % ORDER.length];
        return `<div class="orb__panel${type === 'cubo' || type === 'terminal' ? ' orb__panel--green' : ''}" style="--a:${(360 / g.n) * i}deg;--r:${g.r}cqw;--w:${g.w}cqw;--h:${g.h}cqw">${PANELS[type]()}</div>`;
      }).join('')}</div>`).join('')}
    </div></div>
    <canvas class="orb__rain orb__rain--front"></canvas>
    <canvas class="orb__px"></canvas>
    <i class="orb__scan"></i>
  </div>`;
  return {
    world: root.querySelector('.orb__world'), face: root.querySelector('.orb__face'),
    rings: [...root.querySelectorAll('[data-ring]')], halos: [...root.querySelectorAll('.orb__halo')],
    rain: root.querySelector('.orb__rain'), front: root.querySelector('.orb__rain--front'), px: root.querySelector('.orb__px')
  };
}

/* ---------- chuva de números em pixel (fonte 3×5) — atrás da cena e, mais leve, por cima do personagem ---------- */
const DIGITS = ['111101101101111', '010110010010111', '111001111100111', '111001111001111', '101101111001001',
                '111100111001111', '111100111101111', '111001010010010', '111101111101111', '111101111001111'];
function rainLayer(cv, { density = 1, alpha = 1 } = {}) {
  const ctx = cv.getContext('2d'); let cols = [], W = 0, H = 0, px = 2, ch = 12;
  const size = () => {
    const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
    W = r.width; H = r.height; cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0);
    px = Math.max(1, Math.round(W / 320 * 2) / 2); ch = px * 6;
    cols = [];
    for (let x = 0; x < W; x += px * 4) if (Math.random() < density) cols.push({
      x, y: Math.random() * H, v: (24 + Math.random() * 46) * (W / 600), len: 6 + (Math.random() * 14 | 0),
      d: Array.from({ length: 24 }, () => Math.random() * 10 | 0)
    });
  };
  const glyph = (n, x, y) => { const g = DIGITS[n]; for (let i = 0; i < 15; i++) if (g[i] === '1') ctx.fillRect(x + (i % 3) * px, y + (i / 3 | 0) * px, px, px); };
  size();
  return { size, draw(dt) {
    ctx.clearRect(0, 0, W, H);
    for (const c of cols) {
      c.y += c.v * dt; if (c.y - c.len * ch > H) { c.y = -Math.random() * H * .3; c.len = 6 + (Math.random() * 14 | 0); }
      if (Math.random() < .08) c.d[(Math.random() * c.d.length) | 0] = Math.random() * 10 | 0;   // dígitos trocando
      const head = Math.floor(c.y / ch);
      for (let k = 0; k < c.len; k++) {
        const row = head - k, y = row * ch; if (y < -ch || y > H) continue;
        ctx.globalAlpha = alpha * (k === 0 ? 1 : (1 - k / c.len) * .75);
        ctx.fillStyle = k === 0 ? '#e9fff1' : k < 3 ? '#7dffb6' : '#2eff8c';
        glyph(c.d[((row % 24) + 24) % 24], c.x, y);
      }
    }
    ctx.globalAlpha = 1;
  } };
}
function pixelLayer(cv) {
  const ctx = cv.getContext('2d'); let W = 0, H = 0, p = [];
  const size = () => {
    const r = cv.getBoundingClientRect(), d = Math.min(devicePixelRatio || 1, 2);
    W = r.width; H = r.height; cv.width = W * d; cv.height = H * d; ctx.setTransform(d, 0, 0, d, 0, 0);
    p = Array.from({ length: 34 }, () => ({ x: Math.random() * W, y: Math.random() * H, s: 1.5 + Math.random() * W / 160, v: 6 + Math.random() * 18, ph: Math.random() * 6, c: Math.random() < .6 ? '#2eff8c' : '#4fd8ff' }));
  };
  size();
  return { size, draw(dt, t) {
    ctx.clearRect(0, 0, W, H);
    p.forEach(q => {
      q.y -= q.v * dt; q.x += Math.sin(t + q.ph) * dt * 6; if (q.y < -10) { q.y = H + 10; q.x = Math.random() * W; }
      ctx.globalAlpha = .45 + .45 * Math.sin(t * 3 + q.ph); ctx.fillStyle = q.c; ctx.shadowColor = q.c; ctx.shadowBlur = q.s * 2;
      ctx.fillRect(q.x, q.y, q.s, q.s);
    });
    ctx.globalAlpha = 1; ctx.shadowBlur = 0;
  } };
}

/* ---------- monta e anima ---------- */
document.querySelectorAll('[data-orbita]').forEach(root => {
  const el = build(root), rain = rainLayer(el.rain, { density: .5, alpha: .7 }), front = rainLayer(el.front, { density: .1, alpha: .45 }), px = pixelLayer(el.px);
  const panels = el.rings.map(r => [...r.querySelectorAll('.orb__panel')].map(p => ({ p, a: parseFloat(p.style.getPropertyValue('--a')) * Math.PI / 180, back: null })));
  const ang = RINGS.map((_, k) => k * .7);
  let boost = 0, boostT = 0, on = false, prev = 0, t = 0;
  // cena fixa (sem inclinar com o cursor): o carrossel gira sempre no mesmo sentido, sem ondular sobre o personagem
  el.world.style.transform = `rotateX(${TILT}deg)`;
  el.face.style.transform = `rotateX(${-TILT}deg)`;
  root.addEventListener('pointerenter', () => { boostT = 1; });
  root.addEventListener('pointerleave', () => { boostT = 0; });
  const frame = now => {
    const dt = Math.min((now - (prev || now)) / 1000, .05); prev = now; t += dt;
    boost += (boostT - boost) * .05;
    el.rings.forEach((r, k) => {
      ang[k] += dt * RINGS[k].spd * (1 + boost * 1.6) * (reduce ? 0 : 1); r.style.transform = `rotateY(${ang[k]}rad)`;
      for (const o of panels[k]) {   // profundidade: atrás = apagado e desfocado; de costas = só o vidro
        const z = Math.cos(ang[k] + o.a), back = z < -.05;
        o.p.style.opacity = (.42 + .58 * (z * .5 + .5)).toFixed(3);
        o.p.style.filter = z < 0 ? `blur(${(-z * .9).toFixed(2)}px) brightness(${(.75 + .25 * (1 + z)).toFixed(2)})` : '';
        if (back !== o.back) { o.back = back; o.p.classList.toggle('is-back', back); }
      }
    });
    el.halos.forEach((h, k) => h.style.setProperty('--spin', `${(t * (40 + k * 18) * (k % 2 ? -1 : 1)) % 360}deg`));
    rain.draw(dt); front.draw(dt); px.draw(dt, t);
  };
  const loop = now => { if (!on) return; frame(now); requestAnimationFrame(loop); };
  new IntersectionObserver(([e]) => {
    const was = on; on = e.isIntersecting && !reduce;
    if (on && !was) { prev = 0; requestAnimationFrame(loop); }
  }, { rootMargin: '200px' }).observe(root);
  new ResizeObserver(() => { rain.size(); front.size(); px.size(); }).observe(root);
  frame(performance.now());   // primeiro quadro já posicionado (e único, se o usuário preferir menos movimento)
});
