// NECRÓPOLIS 2 — caso-12
// 1. imagens reais: troca a composição em CSS pelo arquivo de assets/fotos/ quando ele existe
// 2. entrada dos blocos ao rolar
// 3. carrossel de criaturas (pontinhos + troca automática)
// 4. habilidades humanas (ícones trocam nome e texto)
// 5. "ver imagem maior" e trailer em um visualizador
// 6. fumaça interativa (canvas): sobe do hero, escorre das bordas da tinta, reage ao cursor

document.documentElement.classList.add('js');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- 1. imagens reais ---------- */
document.querySelectorAll('[data-photo]').forEach((el) => {
  const img = new Image();
  img.onload = () => {
    el.style.backgroundImage = `url("${el.dataset.photo}")`;
    el.classList.add('is-loaded');
  };
  img.src = el.dataset.photo;
});

/* ---------- 2. entrada ao rolar ---------- */
const reveals = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !reduceMotion) {
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-in');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('is-in'));
}

/* ---------- 3. carrossel de criaturas ---------- */
const slider = document.querySelector('[data-slider]');
const dots = [...document.querySelectorAll('[data-dot]')];
if (slider && dots.length) {
  const slides = [...slider.querySelectorAll('.beast')];
  let current = 0;
  const show = (i) => {
    current = (i + slides.length) % slides.length;
    slides.forEach((s, k) => s.classList.toggle('is-on', k === current));
    dots.forEach((d, k) => d.classList.toggle('is-on', k === current));
  };
  dots.forEach((d) => d.addEventListener('click', () => show(Number(d.dataset.dot))));
  if (!reduceMotion) setInterval(() => { if (!document.hidden) show(current + 1); }, 4500);
}

/* ---------- 4. habilidades ---------- */
const skillName = document.querySelector('[data-skill-name]');
const skillText = document.querySelector('[data-skill-text]');
const skillBtns = document.querySelectorAll('[data-skill]');
skillBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    skillBtns.forEach((b) => b.classList.toggle('is-on', b === btn));
    skillName.textContent = btn.dataset.skill;
    skillText.textContent = btn.dataset.text;
  });
});

/* ---------- 5. visualizador ---------- */
const lb = document.querySelector('[data-lightbox]');
const frame = document.querySelector('[data-lb-frame]');
const open = (node) => {
  frame.replaceChildren(node);
  lb.hidden = false;
};
const close = () => { lb.hidden = true; frame.replaceChildren(); };
document.querySelectorAll('[data-zoom]').forEach((btn) => {
  btn.addEventListener('click', () => {
    const src = btn.closest('.block').querySelector('.beast.is-on, .beast');
    open(src.cloneNode(true));
  });
});
const trailer = document.querySelector('[data-trailer]');
if (trailer) {
  trailer.addEventListener('click', () => {
    const msg = document.createElement('p');
    msg.className = 'h2';
    msg.style.textAlign = 'center';
    msg.textContent = 'Trailer em breve — 12 de dezembro';
    open(msg);
  });
}
document.querySelector('[data-lb-close]').addEventListener('click', close);
lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !lb.hidden) close(); });

/* ---------- 6. fumaça interativa ---------- */
// partículas de fumaça num canvas fixo, entre o fundo e o conteúdo:
// · névoa vermelha subindo da base do hero (como o brilho vermelho da referência)
// · fumaça preta escapando das bordas da coluna de tinta para o branco, e cinza por dentro
// · o cursor (ou o dedo) empurra a fumaça e solta mais; clique solta uma rajada vermelha
// a fumaça acompanha a rolagem, então parece presa à página.
const smoke = document.querySelector('[data-smoke]');
if (smoke && !reduceMotion) {
  const ctx = smoke.getContext('2d');
  const SCALE = 0.5;               // resolução reduzida: fumaça é borrada de qualquer jeito
  const MAX = 460;
  const hero = document.querySelector('.hero');
  const inkBody = document.querySelector('.ink-body');
  let W = 0;
  let H = 0;
  const resize = () => {
    W = Math.ceil(innerWidth * SCALE);
    H = Math.ceil(innerHeight * SCALE);
    smoke.width = W;
    smoke.height = H;
  };
  resize();
  addEventListener('resize', resize);

  // sprite de nuvem: vários círculos macios sobrepostos dão textura irregular
  const sprite = (r, g, b, a) => {
    const s = document.createElement('canvas');
    s.width = s.height = 128;
    const c = s.getContext('2d');
    for (let i = 0; i < 16; i += 1) {
      const x = 64 + (Math.random() - 0.5) * 56;
      const y = 64 + (Math.random() - 0.5) * 56;
      const rad = 18 + Math.random() * 34;
      const gr = c.createRadialGradient(x, y, 0, x, y, rad);
      gr.addColorStop(0, `rgba(${r},${g},${b},${a})`);
      gr.addColorStop(1, `rgba(${r},${g},${b},0)`);
      c.fillStyle = gr;
      c.beginPath();
      c.arc(x, y, rad, 0, Math.PI * 2);
      c.fill();
    }
    return s;
  };
  const KINDS = {
    red:  { img: sprite(150, 14, 20, 0.3), blend: 'screen',      alpha: 0.42 },
    grey: { img: sprite(150, 150, 150, 0.3), blend: 'source-over', alpha: 0.32 },
    dark: { img: sprite(12, 10, 10, 0.4),   blend: 'source-over', alpha: 0.6 },
  };

  const parts = [];
  const rnd = (a, b) => a + Math.random() * (b - a);
  const spawn = (x, y, kind, vx, vy, size, life) => {
    if (parts.length >= MAX) return;
    parts.push({ x, y, vx, vy, kind, size, grow: rnd(10, 30), life, age: 0, rot: rnd(0, 6.28), spin: rnd(-0.3, 0.3) });
  };

  // cursor / dedo
  const ptr = { x: -999, y: -999, vx: 0, vy: 0, t: 0 };
  const kindAt = (x, y) => {
    const hr = hero.getBoundingClientRect();
    if (y < hr.bottom - hr.height * 0.25) return 'red';
    const ir = inkBody.getBoundingClientRect();
    return x > ir.left && x < ir.right ? 'grey' : 'dark';
  };
  addEventListener('pointermove', (e) => {
    const now = performance.now();
    const dt = Math.max((now - ptr.t) / 1000, 0.008);
    const dx = e.clientX - ptr.x;
    const dy = e.clientY - ptr.y;
    if (ptr.t && Math.abs(dx) < 300 && Math.abs(dy) < 300) {
      ptr.vx = dx / dt;
      ptr.vy = dy / dt;
      const n = Math.min(4, Math.hypot(dx, dy) / 14);
      const kind = kindAt(e.clientX, e.clientY);
      for (let i = 0; i < n; i += 1) {
        spawn(e.clientX - dx * (i / n), e.clientY - dy * (i / n), kind, ptr.vx * 0.12 + rnd(-15, 15), ptr.vy * 0.12 + rnd(-15, 15), rnd(50, 110), rnd(1.8, 3.2));
      }
    }
    ptr.x = e.clientX;
    ptr.y = e.clientY;
    ptr.t = now;
  }, { passive: true });
  addEventListener('pointerdown', (e) => {
    if (e.target.closest('a, button, input')) return;
    for (let i = 0; i < 36; i += 1) {
      const ang = rnd(0, Math.PI * 2);
      const sp = rnd(60, 280);
      spawn(e.clientX, e.clientY, 'red', Math.cos(ang) * sp, Math.sin(ang) * sp - 40, rnd(60, 140), rnd(1.6, 3.4));
    }
  });

  // a fumaça anda junto com a página
  let lastScroll = scrollY;
  addEventListener('scroll', () => {
    const d = lastScroll - scrollY;
    lastScroll = scrollY;
    for (const p of parts) p.y += d;
  }, { passive: true });

  // emissores contínuos
  const acc = { hero: 0, edge: 0 };
  const emit = (dt) => {
    const hr = hero.getBoundingClientRect();
    if (hr.bottom > 0) {
      acc.hero += dt * 9;
      while (acc.hero > 1) {
        acc.hero -= 1;
        spawn(rnd(hr.left, hr.right), hr.bottom - rnd(0, hr.height * 0.3), 'red', rnd(-12, 12), rnd(-45, -15), rnd(160, 300), rnd(4, 7));
      }
    }
    const ir = inkBody.getBoundingClientRect();
    const top = Math.max(ir.top, 0);
    const bottom = Math.min(ir.bottom, innerHeight);
    if (bottom > top) {
      acc.edge += dt * 12;
      while (acc.edge > 1) {
        acc.edge -= 1;
        const left = Math.random() < 0.5;
        const y = rnd(top, bottom);
        const x = left ? ir.left + rnd(-10, 20) : ir.right - rnd(-10, 20);
        const out = left ? -1 : 1;
        if (Math.random() < 0.6) spawn(x, y, 'dark', out * rnd(6, 26), rnd(-22, -4), rnd(70, 150), rnd(5, 8));
        else spawn(x - out * rnd(20, 60), y, 'grey', -out * rnd(4, 16), rnd(-20, -6), rnd(90, 170), rnd(4, 7));
      }
    }
  };

  let last = performance.now();
  const frame = (now) => {
    const dt = Math.min((now - last) / 1000, 0.05);
    last = now;
    if (!document.hidden) {
      emit(dt);
      const t = now / 1000;
      const recent = now - ptr.t < 120;
      for (let i = parts.length - 1; i >= 0; i -= 1) {
        const p = parts[i];
        p.age += dt;
        if (p.age >= p.life || p.y < -300 || p.y > innerHeight + 300) { parts.splice(i, 1); continue; }
        // vento ondulado + empuxo para cima + atrito
        p.vx += (Math.sin(p.y * 0.006 + t * 0.7) * 14 + Math.cos(p.x * 0.004 - t * 0.5) * 9) * dt;
        p.vy += -10 * dt;
        p.vx *= 1 - 0.7 * dt;
        p.vy *= 1 - 0.7 * dt;
        // o cursor arrasta a fumaça por perto
        if (recent) {
          const dx = p.x - ptr.x;
          const dy = p.y - ptr.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 160 * 160) {
            const f = 1 - Math.sqrt(d2) / 160;
            p.vx += ptr.vx * f * 2.2 * dt;
            p.vy += ptr.vy * f * 2.2 * dt;
          }
        }
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        p.size += p.grow * dt;
        p.rot += p.spin * dt;
      }

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, W, H);
      for (const p of parts) {
        const k = KINDS[p.kind];
        const life = p.age / p.life;
        const fade = Math.min(life / 0.15, 1) * (1 - life);
        ctx.globalAlpha = k.alpha * fade;
        ctx.globalCompositeOperation = k.blend;
        const sc = (p.size / 128) * SCALE;
        const cos = Math.cos(p.rot) * sc;
        const sin = Math.sin(p.rot) * sc;
        ctx.setTransform(cos, sin, -sin, cos, p.x * SCALE, p.y * SCALE);
        ctx.drawImage(k.img, -64, -64);
      }
    }
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}
