// NECRÓPOLIS 2 — caso-12 · bordas de tinta interativas
// As bordas da coluna preta são desenhadas ao vivo num canvas fixo, como tinta líquida:
// · ondulam sozinhas (soma de senos que andam com o tempo, presa à posição na página);
// · cada ponto da borda é uma mola ligada aos vizinhos, então impulsos viram ondas que correm;
// · o cursor (ou o dedo) do lado branco atrai a tinta, que se estica até ele e volta balançando;
// · movimento rápido perto da borda empurra ondas; clique perto da borda solta um tranco e gotas.
// Sem o canvas (ou com movimento reduzido) fica a borda recortada estática do CSS.
(() => {
  const canvas = document.querySelector('[data-ink]');
  const inkBody = document.querySelector('.ink-body');
  const hero = document.querySelector('.hero');
  if (!canvas || !inkBody || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  document.documentElement.classList.add('ink-live');

  const STEP = 6;          // espaçamento vertical entre pontos da borda (px)
  const INSET = 64;        // quanto a tinta desenhada entra na coluna
  const REACH = 240;       // distância horizontal em que o cursor influencia a borda
  const PULL = 150;        // quanto a tinta se estica até o cursor
  const COLOR = '#070707';

  let W = 0;
  let H = 0;
  let dpr = 1;
  let N = 0;
  const sides = { left: null, right: null };
  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth;
    H = window.innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    N = Math.ceil(H / STEP) + 3;
    ['left', 'right'].forEach((k) => { sides[k] = { off: new Float32Array(N), vel: new Float32Array(N) }; });
  };
  resize();
  window.addEventListener('resize', resize);

  // ruído determinístico por posição na página, para a borda não "escorregar" ao rolar
  const hash = (n) => { const s = Math.sin(n * 127.1) * 43758.5453; return s - Math.floor(s); };
  const base = (yPage, t, seed) => {
    const y = yPage + seed;
    let v = 34
      + 16 * Math.sin(y * 0.012 + t * 0.55)
      + 10 * Math.sin(y * 0.034 - t * 0.85)
      + 6 * Math.sin(y * 0.09 + t * 1.6)
      + 3 * Math.sin(y * 0.27 - t * 2.4);
    // espinhos/tentáculos fixos de vez em quando
    const cell = Math.floor(y / 38);
    const h = hash(cell);
    if (h > 0.8) {
      const local = (y / 38) - cell;
      v += (h - 0.8) * 300 * Math.sin(local * Math.PI) * (0.75 + 0.25 * Math.sin(t * 1.3 + cell));
    }
    // farpas de pincel seco: serrilhado fixo na página
    const k = Math.floor(yPage / STEP);
    v += (hash(k + seed) - 0.5) * 22 + (hash(k * 0.37 + seed) > 0.8 ? 18 : 0);
    return v;
  };

  /* ---------- cursor / dedo ---------- */
  const ptr = { x: -9999, y: -9999, vx: 0, vy: 0, t: 0 };
  window.addEventListener('pointermove', (e) => {
    const now = performance.now();
    const dt = Math.max((now - ptr.t) / 1000, 0.008);
    if (ptr.t) { ptr.vx = (e.clientX - ptr.x) / dt; ptr.vy = (e.clientY - ptr.y) / dt; }
    ptr.x = e.clientX; ptr.y = e.clientY; ptr.t = now;
  }, { passive: true });
  window.addEventListener('pointerleave', () => { ptr.x = -9999; });

  /* ---------- gotas ---------- */
  const drops = [];
  const splash = (x, y, dir, count) => {
    for (let i = 0; i < count; i += 1) {
      drops.push({
        x, y,
        vx: dir * (120 + Math.random() * 420),
        vy: -160 - Math.random() * 320,
        r: 2 + Math.random() * 7,
        life: 0, max: 1.6 + Math.random() * 1.4, landed: false,
      });
    }
  };
  window.addEventListener('pointerdown', (e) => {
    if (e.target.closest('a, button, input')) return;
    const r = inkBody.getBoundingClientRect();
    if (e.clientY < r.top || e.clientY > r.bottom) return;
    const nearLeft = Math.abs(e.clientX - r.left) < REACH + 80;
    const nearRight = Math.abs(e.clientX - r.right) < REACH + 80;
    if (!nearLeft && !nearRight) return;
    const key = nearLeft ? 'left' : 'right';
    const i = Math.round((e.clientY + STEP) / STEP);
    for (let k = -6; k <= 6; k += 1) {
      const j = i + k;
      if (j >= 0 && j < N) sides[key].vel[j] += 900 * Math.exp(-(k * k) / 10);
    }
    splash(nearLeft ? r.left - 20 : r.right + 20, e.clientY, nearLeft ? -1 : 1, 14);
  });

  /* ---------- física da borda ---------- */
  const simulate = (side, edgeX, outward, rect, t, dt) => {
    const { off, vel } = side;
    const fresh = performance.now() - ptr.t < 140;
    for (let i = 0; i < N; i += 1) {
      const y = i * STEP - STEP;
      let target = base(y + window.scrollY, t, outward > 0 ? 913 : 0);
      // atração do cursor: só quando ele está do lado de fora (no branco), perto da borda
      const dx = (ptr.x - edgeX) * outward;
      if (dx > -40 && dx < REACH) {
        const near = 1 - Math.max(dx, 0) / REACH;
        const dy = y - ptr.y;
        const g = Math.exp(-(dy * dy) / (2 * 80 * 80));
        target += PULL * near * near * g + Math.max(dx, 0) * 0.55 * g * near;
        // movimento rápido empurra a borda e gera ondas
        if (fresh) vel[i] += (Math.abs(ptr.vy) * 0.08 + Math.abs(ptr.vx) * 0.12) * g * near * dt * 60;
      }
      // mola até o alvo + acoplamento com os vizinhos (ondas) + atrito
      const lap = (i > 0 ? off[i - 1] : off[i]) + (i < N - 1 ? off[i + 1] : off[i]) - 2 * off[i];
      vel[i] += ((target - off[i]) * 14 + lap * 40) * dt;
      vel[i] *= 1 - Math.min(5.5 * dt, 0.9);
    }
    for (let i = 0; i < N; i += 1) off[i] += vel[i] * dt;
  };

  const drawSide = (side, edgeX, outward, top, bottom) => {
    const { off } = side;
    const inner = edgeX - outward * INSET;
    const i0 = Math.max(0, Math.floor((top + STEP) / STEP));
    const i1 = Math.min(N - 1, Math.ceil((bottom + STEP) / STEP));
    if (i1 <= i0) return;
    ctx.beginPath();
    ctx.moveTo(inner, i0 * STEP - STEP);
    let px = edgeX + outward * off[i0];
    let py = i0 * STEP - STEP;
    ctx.lineTo(px, py);
    for (let i = i0 + 1; i <= i1; i += 1) {
      const x = edgeX + outward * off[i];
      const y = i * STEP - STEP;
      ctx.lineTo(x, y);
      px = x; py = y;
    }
    ctx.lineTo(px, py);
    ctx.lineTo(inner, py);
    ctx.closePath();
    ctx.fill();
  };

  let last = performance.now();
  const frame = (now) => {
    const dt = Math.min((now - last) / 1000, 1 / 30);
    last = now;
    if (!document.hidden) {
      const t = now / 1000;
      const r = inkBody.getBoundingClientRect();
      simulate(sides.left, r.left, -1, r, t, dt);
      simulate(sides.right, r.right, 1, r, t, dt);

      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      ctx.fillStyle = COLOR;
      // não desenha por cima da arte do topo: a borda só começa onde o hero termina
      const heroBottom = hero ? hero.getBoundingClientRect().bottom - 4 : r.top;
      const top = Math.max(r.top, heroBottom, -STEP);
      const bottom = Math.min(r.bottom, H + STEP);
      if (bottom > top) {
        drawSide(sides.left, r.left, -1, top, bottom);
        drawSide(sides.right, r.right, 1, top, bottom);
      }

      // gotas voando, caindo e secando
      for (let i = drops.length - 1; i >= 0; i -= 1) {
        const d = drops[i];
        d.life += dt;
        if (d.life > d.max) { drops.splice(i, 1); continue; }
        if (!d.landed) {
          d.vy += 1400 * dt;
          d.x += d.vx * dt;
          d.y += d.vy * dt;
          d.vx *= 1 - 1.5 * dt;
          if (d.vy > 0 && d.life > 0.35 + d.r * 0.04) d.landed = true;
        }
        ctx.globalAlpha = Math.min(1, (d.max - d.life) * 2);
        ctx.beginPath();
        if (d.landed) ctx.ellipse(d.x, d.y, d.r * 1.5, d.r * 1.1, 0, 0, Math.PI * 2);
        else ctx.ellipse(d.x, d.y, d.r, d.r * (1 + Math.min(Math.abs(d.vy) / 900, 1.2)), Math.atan2(d.vy, d.vx) - Math.PI / 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
})();
