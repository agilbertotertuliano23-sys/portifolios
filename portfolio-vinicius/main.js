/* =========================================================
   VINICIUS — Portfólio · interações
   GSAP + ScrollTrigger + Lenis
   ========================================================= */
(() => {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  gsap.registerPlugin(ScrollTrigger);

  /* ---------- helpers de split ---------- */
  function splitChars(el) {
    const text = el.textContent;
    el.textContent = '';
    [...text].forEach(ch => {
      const s = document.createElement('span');
      s.className = 'char';
      s.textContent = ch === ' ' ? ' ' : ch;
      el.appendChild(s);
    });
    return $$('.char', el);
  }
  function wrapInner(el) {
    const s = document.createElement('span');
    s.className = 'char';
    while (el.firstChild) s.appendChild(el.firstChild);
    el.appendChild(s);
    return s;
  }
  function splitWords(el) {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words.map(w => `<span class="w">${w}</span>`).join(' ');
    return $$('.w', el);
  }

  /* ---------- texto que rola nos botões ---------- */
  // botões: monta a estrutura do modelo (ícone lima com seta de pontos + texto); --c = coluna do ponto (onda da esquerda p/ direita)
  const DOTS = [[1.61, 1.61], [5.74, 1.61], [5.74, 5.56], [9.86, 5.56], [9.86, 9.5], [13.98, 9.5], [5.74, 13.44], [9.86, 13.44], [1.61, 17.39], [5.74, 17.39]];
  const dotsSVG = `<svg viewBox="0 0 16 19" aria-hidden="true">${DOTS.map(([x, y]) => `<circle cx="${x}" cy="${y}" r="1.5" style="--c:${Math.round((x - 1.61) / 4.12)}"/>`).join('')}</svg>`;
  $$('.btn').forEach(b => {
    const label = b.textContent.trim();
    b.innerHTML = `<span class="btn__ico" aria-hidden="true">${dotsSVG}</span><span class="btn__txt">${label}</span>`;
  });
  $$('.btn__txt, .pill').forEach(el => {
    const label = el.textContent.trim();
    el.innerHTML = `<span class="roll"><span>${label}</span><span aria-hidden="true">${label}</span></span>`;
  });

  /* ---------- marquees infinitos (duplica a trilha) ---------- */
  $$('.marquee').forEach(m => {
    const clone = m.firstElementChild.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    m.appendChild(clone);
  });

  /* ---------- logos das ferramentas em pixel art viva (modelo "pixel pinwheel"): cada símbolo SVG vira um sprite
     18×18 com contorno escuro e brilho; os pixels montam ao aparecer, ondulam, piscam, fogem do cursor e explodem no hover ---------- */
  (() => {
    const svgs = $$('.tool svg');                     // depois do clone do marquee: pega as duas trilhas
    if (!svgs.length) return;
    const G = 18, dpr = Math.min(devicePixelRatio || 1, 2);
    const mouse = { x: -1e4, y: -1e4 };
    addEventListener('pointermove', e => { mouse.x = e.clientX; mouse.y = e.clientY; }, { passive: true });

    // Figma em versão sólida (o SVG da marca é só contorno), pintado por peça com as cores oficiais
    const FIGMA = 'M8 0h4v8H8a4 4 0 0 1 0-8zM12 0h4a4 4 0 0 1 0 8h-4zM8 8h4v8H8a4 4 0 0 1 0-8zM20 12a4 4 0 1 1-8 0 4 4 0 0 1 8 0zM8 16h4v4a4 4 0 1 1-4-4z';
    const figmaAt = (x, y) => y < 6 ? (x < 9 ? '#f24e1e' : '#ff7262') : y < 12 ? (x < 9 ? '#a259ff' : '#1abcfe') : '#0acf83';
    const shade = (hex, t) => {                      // t < 0 escurece, t > 0 clareia
      const n = parseInt(hex.slice(1), 16);
      return `rgb(${[n >> 16, n >> 8 & 255, n & 255].map(v => Math.round(t < 0 ? v * (1 + t) : v + (255 - v) * t)).join(',')})`;
    };
    // máscara a partir do path SVG (G×G)
    const fromPath = d => {
      const o = document.createElement('canvas'); o.width = o.height = G;
      const g = o.getContext('2d');
      g.scale(G / 24, G / 24); g.fill(new Path2D(d));
      const a = g.getImageData(0, 0, G, G).data;
      return { g: G, on: (x, y) => x >= 0 && y >= 0 && x < G && y < G && a[(y * G + x) * 4 + 3] > 100 };
    };
    // máscara a partir de uma lista de pixels "x,y"
    const grid = (g, fill) => {
      const set = new Set(); fill((x, y) => set.add(x + ',' + y));
      return { g, on: (x, y) => set.has(x + ',' + y) };
    };
    const line = (put, x0, y0, x1, y1) => {           // Bresenham: traço de 1 pixel
      x0 = Math.round(x0); y0 = Math.round(y0); x1 = Math.round(x1); y1 = Math.round(y1);
      const dx = Math.abs(x1 - x0), dy = -Math.abs(y1 - y0), sx = x0 < x1 ? 1 : -1, sy = y0 < y1 ? 1 : -1;
      for (let e = dx + dy; ; ) {
        put(x0, y0);
        if (x0 === x1 && y0 === y1) break;
        const e2 = 2 * e;
        if (e2 >= dy) { e += dy; x0 += sx; }
        if (e2 <= dx) { e += dx; y0 += sy; }
      }
    };
    // sprites desenhados à mão para os logos que não sobrevivem à grade pequena
    const CUSTOM = {
      // GSAP: selo verde arredondado com um "G" vazado
      'tool--gsap': () => grid(16, put => {
        const cut = new Set(['0,0', '1,0', '0,1', '15,0', '14,0', '15,1', '0,15', '1,15', '0,14', '15,15', '14,15', '15,14']);
        const hole = new Set();
        const h = (x0, x1, y0, y1) => { for (let y = y0; y <= y1; y++) for (let x = x0; x <= x1; x++) hole.add(x + ',' + y); };
        h(5, 11, 3, 4); h(3, 4, 5, 10); h(5, 11, 11, 12); h(11, 12, 8, 10); h(8, 12, 7, 8); h(4, 4, 4, 4); h(4, 4, 11, 11);
        for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++) if (!cut.has(x + ',' + y) && !hole.has(x + ',' + y)) put(x, y);
      }),
      // three.js: triângulo em wireframe, subdividido em 9 triângulos (versão legível do logo)
      'tool--three': () => grid(20, put => {
        const A = [0, 0], B = [5, 19], C = [19, 6];
        const at = (P, Q, t) => [P[0] + (Q[0] - P[0]) * t, P[1] + (Q[1] - P[1]) * t];
        const seg = (P, Q) => line(put, P[0], P[1], Q[0], Q[1]);
        seg(A, B); seg(B, C); seg(C, A);
        for (const t of [1 / 3, 2 / 3]) {
          seg(at(A, B, t), at(A, C, t));                // paralelas a BC
          seg(at(B, A, t), at(B, C, t));                // paralelas a AC
          seg(at(C, A, t), at(C, B, t));                // paralelas a AB
        }
      }),
      // Next.js: círculo com o "N" vazado em traços de 2 pixels
      'tool--next': () => grid(16, put => {
        const hole = new Set();
        const h = (x, y) => hole.add(x + ',' + y);
        for (let y = 4; y <= 11; y++) { h(4, y); h(5, y); }                     // haste esquerda
        for (let y = 4; y <= 12; y++) { const x = Math.round(5 + (y - 4) * .78); h(x, y); h(x + 1, y); }  // diagonal
        for (let y = 4; y <= 8; y++) { h(10, y); h(11, y); }                    // haste direita (curta, como no logo)
        for (let y = 0; y < 16; y++) for (let x = 0; x < 16; x++)
          if (Math.hypot(x - 7.5, y - 7.5) <= 7.7 && !hole.has(x + ',' + y)) put(x, y);
      })
    };
    const sprite = ({ g: G, on, flat }, colorAt) => {
      const px = [];
      for (let y = 0; y < G; y++) for (let x = 0; x < G; x++) {
        if (!on(x, y)) continue;
        const base = colorAt(x, y);
        const col = flat ? shade(base, -(y / G) * .3)                              // traço fino: sem contorno, só degradê
                  : !on(x + 1, y) || !on(x, y + 1) ? shade(base, -.55)          // borda de baixo/direita: contorno escuro
                  : !on(x - 1, y) || !on(x, y - 1) ? shade(base, .3)            // borda de cima/esquerda: brilho
                  : shade(base, -(y / G) * .2);                                  // miolo: escurece de cima para baixo
        px.push({ x, y, col, ox: reduce ? 0 : (Math.random() - .5) * G * 1.6, oy: reduce ? 0 : (Math.random() - .5) * G * 1.6, vx: 0, vy: 0, sp: 0 });
      }
      return px;
    };

    const items = svgs.map(svg => {
      const tool = svg.closest('.tool');
      const logo = getComputedStyle(tool).getPropertyValue('--logo').trim();
      const fig = tool.classList.contains('tool--figma');
      const base = /^#[0-9a-f]{6}$/i.test(logo) && !/^#f{6}$/i.test(logo) ? logo : '#f2f0eb';
      const custom = Object.keys(CUSTOM).find(k => tool.classList.contains(k));
      const mask = custom ? { ...CUSTOM[custom](), flat: custom === 'tool--three' } : fromPath(fig ? FIGMA : $$('path', svg).map(p => p.getAttribute('d')).join(' '));
      const box = document.createElement('span'), cv = document.createElement('canvas');
      box.className = 'pxl'; box.append(cv); svg.replaceWith(box);
      const it = { box, cv, ctx: cv.getContext('2d'), g: mask.g, P: sprite(mask, fig ? figmaAt : () => base), burst: 0, S: 0 };
      tool.addEventListener('pointerenter', () => { if (!reduce) it.burst = 1; });
      return it;
    });

    const size = () => items.forEach(it => {        // canvas = 2× a caixa, para os pixels poderem sair dela
      it.S = it.box.clientWidth;
      it.cv.width = it.cv.height = Math.round(it.S * 2 * dpr);
    });

    let t = 0;
    const draw = it => {
      const { ctx, S, g: G } = it;
      if (!S) return;
      const c = S / G, off = S / 2;
      const r = it.cv.getBoundingClientRect(), k = S * 2 / (r.width || 1);
      const mx = (mouse.x - r.left) * k - off, my = (mouse.y - r.top) * k - off, R = S * .5;
      const burst = it.burst; it.burst *= .9;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0); ctx.clearRect(0, 0, S * 2, S * 2);
      ctx.lineWidth = .6; ctx.strokeStyle = 'rgba(0, 0, 0, .35)';
      for (const p of it.P) {
        let tx = 0, ty = reduce ? 0 : Math.sin(t * 3 + p.x * .55 + p.y * .25) * .18;           // onda suave
        if (burst > .02) {                                                                    // explosão a partir do centro
          const dx = p.x - G / 2 + .5, dy = p.y - G / 2 + .5, dd = Math.hypot(dx, dy) || 1;
          tx += dx / dd * burst * G * .45; ty += dy / dd * burst * G * .45;
        }
        if (!reduce) {
          const ex = (p.x + .5 + p.ox) * c - mx, ey = (p.y + .5 + p.oy) * c - my, de = Math.hypot(ex, ey) || 1;
          if (de < R) { const f = (1 - de / R) * .9; p.vx += ex / de * f; p.vy += ey / de * f; }  // cursor empurra
          p.vx = (p.vx + (tx - p.ox) * .12) * .78; p.vy = (p.vy + (ty - p.oy) * .12) * .78;
          p.ox += p.vx; p.oy += p.vy;
          if (Math.random() < .002) p.sp = 1;                                                 // brilho aleatório
        }
        const X = off + (p.x + p.ox) * c, Y = off + (p.y + p.oy) * c;
        ctx.fillStyle = p.col; ctx.fillRect(X, Y, c, c);
        if (p.sp > .02) { ctx.fillStyle = `rgba(255, 255, 255, ${p.sp * .8})`; ctx.fillRect(X, Y, c, c); p.sp *= .9; }
        if (c > 2.5) ctx.strokeRect(X + .3, Y + .3, c - .6, c - .6);                          // linha da grade, como no sprite
      }
    };

    size();
    if (reduce) { items.forEach(draw); return; }
    let raf = 0;
    const frame = () => { raf = requestAnimationFrame(frame); t += 1 / 60; items.forEach(draw); };
    new IntersectionObserver(([e]) => { cancelAnimationFrame(raf); if (e.isIntersecting) frame(); }).observe($('.logos'));
    let rz; addEventListener('resize', () => { clearTimeout(rz); rz = setTimeout(size, 200); });
    document.fonts?.ready.then(size);
  })();

  /* ---------- cards de serviço (iframes 3D): o render de cada cena só roda enquanto o card está na tela ---------- */
  const svFrames = $$('.sv-card__stage iframe');
  if (svFrames.length) {
    const io = new IntersectionObserver(es => es.forEach(e => {
      e.target.contentWindow?.postMessage({ el3d: e.isIntersecting ? 'play' : 'pause' }, '*');
    }), { rootMargin: '120px 0px' });
    svFrames.forEach(f => { io.observe(f); f.addEventListener('load', () => { io.unobserve(f); io.observe(f); }); });   // reavalia ao terminar de carregar
  }

  /* ---------- notebook do personagem: só digita código (independente das pastas de projetos) ---------- */
  const desk = $('.desk');
  if (desk) {
    const codeEl = $('[data-typing]', desk);
    const names = ['Aurora Studio', 'Verde Vivo', 'Nébula AI', 'Solar Co.'];
    const esc = t => t.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const tokens = name => [
      [['const ', 'k'], ['site = '], ['criar', 'f'], ['({']],
      [['  cliente: '], [`"${name}"`, 's'], [',']],
      [['  motion: '], ['true', 'k'], [',']],
      [['  nota: '], ['"awards"', 's']],
      [['});']],
      [['deploy', 'f'], ['(site) ✓']]
    ];
    const render = (lines, n) => {                    // monta o HTML com os n primeiros caracteres
      let out = '';
      for (const line of lines) {
        for (const [txt, cls] of line) {
          if (n <= 0) break;
          const part = esc(txt.slice(0, n)); n -= txt.length;
          out += cls ? `<span class="${cls}">${part}</span>` : part;
        }
        if (n <= 0) break;
        out += '\n';
      }
      codeEl.innerHTML = out + '<span class="caret"></span>';
    };
    const full = lines => lines.flat().reduce((t, [x]) => t + x.length, 0) + lines.length;

    if (reduce) {
      const l = tokens(names[0]); render(l, full(l));
    } else {
      let visible = false, wake = null;
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible && wake) { wake(); wake = null; } }).observe(desk);
      const sleep = ms => new Promise(r => setTimeout(r, ms));
      const whenVisible = () => visible ? Promise.resolve() : new Promise(r => { wake = r; });
      (async () => {
        for (let i = 0; ; i = (i + 1) % names.length) {
          await whenVisible();
          const lines = tokens(names[i]), total = full(lines);
          for (let n = 0; n <= total; n += 2) { render(lines, n); await sleep(28); }
          await sleep(2200);                          // código pronto na tela antes do próximo
        }
      })();
    }
  }

  /* ---------- relógio local ---------- */
  const clock = $('[data-clock]');
  if (clock) {
    const fmt = new Intl.DateTimeFormat('pt-BR', { hour: '2-digit', minute: '2-digit', timeZone: 'America/Sao_Paulo' });
    const tick = () => { clock.textContent = fmt.format(new Date()); };
    tick();
    setInterval(tick, 10000);
  }

  /* ---------- copiar e-mail ---------- */
  $$('[data-copy]').forEach(btn => {
    const state = $('.copy__state', btn);
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy);
        state.textContent = 'Copiado!';
      } catch {
        window.location.href = 'mailto:' + btn.dataset.copy;
      }
      setTimeout(() => { state.textContent = 'Copiar'; }, 1800);
    });
  });

  /* ---------- formulário → abre o e-mail já preenchido ---------- */
  const form = $('[data-form]');
  if (form) {
    form.addEventListener('submit', e => {
      e.preventDefault();
      const d = new FormData(form);
      const subject = encodeURIComponent(`Projeto — ${d.get('nome')}`);
      const body = encodeURIComponent(`${d.get('msg') || ''}\n\n${d.get('nome')} · ${d.get('email')}`);
      window.location.href = `mailto:agilbertotertuliano23@gmail.com?subject=${subject}&body=${body}`;
    });
  }

  /* ---------- vídeo da hero ("BEM VINDO"): só decodifica enquanto a hero está na tela ---------- */
  const heroVid = $('.hero__strip--video video');
  if (heroVid) {
    if (reduce) heroVid.pause();
    else new IntersectionObserver(([e]) => { e.isIntersecting ? heroVid.play().catch(() => {}) : heroVid.pause(); }).observe(heroVid);
  }

  /* ---------- movimento reduzido: mostra tudo e para aqui ---------- */
  if (reduce) {
    $('.loader').remove();
    $('.intro')?.remove();
    $$('[data-to]').forEach(el => { el.textContent = el.dataset.to + (el.dataset.suffix || ''); });
    return;
  }

  /* ---------- smooth scroll ---------- */
  const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add(t => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
  lenis.stop();

  $$('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const id = a.getAttribute('href');
      if (id === '#') { e.preventDefault(); return; }
      const target = id === '#top' ? 0 : $(id);
      if (target === null) return;
      e.preventDefault();
      lenis.scrollTo(target, { duration: 1.6 });
    });
  });

  /* ---------- estados iniciais ---------- */
  document.body.classList.add('is-loading');
  const heroChars = $$('.hero__word .split').flatMap(splitChars);
  if (heroChars.length) gsap.set(heroChars, { yPercent: 110 });   // (a hero atual não tem o nome em letras)
  gsap.set('.hero__strip', { clipPath: 'inset(50% 0% 50% 0%)' });   // faixa começa fechada numa linha
  gsap.set('.reveal-up', { y: 30, opacity: 0 });
  gsap.set('.nav', { yPercent: -160 });

  /* ---------- intro entre o preloader e a hero ----------
     1) o símbolo se monta (peças chegando de lados diferentes, com mola)  2) três pares de legendas, esquerda e direita
     3) o nome "vinicius." cresce ao lado do símbolo  4) o conjunto voa e encolhe até a logo do menu (posição medida na hora),
     o menu desce junto e o fundo escuro some revelando a hero. Clicar pula para o fim. */
  function introTL() {
    const intro = $('.intro'), tl = gsap.timeline();
    if (!intro) return tl;
    // só na primeira visita: ao recarregar ou voltar das bibliotecas fica só o preloader (o menu apenas desce)
    let seen = false; try { seen = localStorage.getItem('vn-intro') === '1'; } catch {}
    if (seen) { intro.remove(); return tl.to('.nav', { yPercent: 0, duration: 1, ease: 'expo.out' }, '+=.3'); }
    const brand = $('.intro__brand', intro), name = $('.logo-name', intro), caps = $$('.intro__cap', intro);
    const navLogo = $('.nav__logo'); let target = { x: 0, y: 0 };
    gsap.set(name, { width: 0, opacity: 0 });
    gsap.set(caps, { opacity: 0 });
    tl.from($('.lp1', intro), { x: -26, y: -18, rotate: -70, opacity: 0, duration: .9, ease: 'back.out(2.2)' })
      .from($('.lp2', intro), { x: 26, y: -18, rotate: 70, opacity: 0, duration: .9, ease: 'back.out(2.2)' }, '<.1')
      .from($('.lp3', intro), { scale: 0, transformOrigin: '50% 50%', duration: .8, ease: 'elastic.out(1, .45)' }, '<.3');
    for (let i = 0; i < caps.length; i += 2) {                          // pares: esquerda + direita
      const L = caps[i], R = caps[i + 1];
      tl.fromTo(L, { x: -50, opacity: 0 }, { x: 0, opacity: 1, duration: .65, ease: 'expo.out' }, i ? '>-.05' : '+=.15')
        .fromTo(R, { x: 50, opacity: 0 }, { x: 0, opacity: 1, duration: .65, ease: 'expo.out' }, '<.12')
        .to([L, R], { y: '-=14', opacity: 0, duration: .4, ease: 'power2.in' }, '+=.75');
    }
    tl.to(name, { width: () => name.scrollWidth, opacity: 1, duration: .8, ease: 'expo.inOut' }, '-=.1')
      .add(() => {                                                       // mede onde a logo vai ficar no menu (menu na posição final)
        gsap.set('.nav', { yPercent: 0 }); gsap.set(navLogo, { opacity: 0 });
        const r = navLogo.getBoundingClientRect();
        target = { x: r.left + r.width / 2 - innerWidth / 2, y: r.top + r.height / 2 - innerHeight / 2 };
        gsap.set('.nav', { yPercent: -160 });
      }, '+=.45')
      .to(brand, { x: () => target.x, y: () => target.y, scale: 1, duration: 1.15, ease: 'expo.inOut' })
      .to('.nav', { yPercent: 0, duration: 1, ease: 'expo.out' }, '<.1')
      .to(intro, { backgroundColor: 'rgba(10, 10, 11, 0)', duration: .9, ease: 'power2.inOut' }, '<.15')
      .add(() => { gsap.set(navLogo, { opacity: 1 }); intro.remove(); (tl.parent || tl).timeScale(1); try { localStorage.setItem('vn-intro', '1'); } catch {} });
    intro.addEventListener('click', () => (tl.parent || tl).timeScale(6), { once: true });   // pular: acelera até o fim do intro
    return tl;
  }

  /* ---------- preloader (modelo do reel) ----------
     o personagem fica em loop enquanto o contador vai de 0 a 100; ao chegar, o número deixa um eco,
     o personagem sobe e some, nome e topo saem, e a cortina clara sobe revelando o hero */
  const counter = { v: 0 };
  const countEl = $('[data-count]');
  const loaderVideo = $('.loader__video');
  const clockEl = $('[data-loader-clock]');
  if (clockEl) clockEl.textContent = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
  const videoReady = new Promise(res => {                        // espera o vídeo poder tocar (no máx. 1,2 s)
    if (!loaderVideo || loaderVideo.readyState >= 3) return res();
    loaderVideo.addEventListener('canplay', res, { once: true });
    setTimeout(res, 1200);
  });
  const echo = () => {                                           // eco do "100": duas cópias que sobem e se desfazem
    const box = $('.loader__count');
    [1, 2].forEach(i => {
      const g = box.cloneNode(true); g.classList.add('loader__count--ghost'); g.removeAttribute('data-count');
      box.after(g);
      gsap.fromTo(g, { opacity: .5 / i, y: 0, filter: 'blur(0px)' },
        { opacity: 0, y: -26 * i, filter: `blur(${4 * i}px)`, duration: .7, ease: 'power2.out', onComplete: () => g.remove() });
    });
  };
  videoReady.then(() => gsap.timeline()
    .to(counter, {
      v: 100, duration: 3, ease: 'power1.inOut',
      onUpdate: () => { countEl.textContent = Math.round(counter.v); }
    })
    .to('.loader__bar i', { scaleX: 1, duration: 3, ease: 'power1.inOut' }, 0)
    .add(echo)
    .to('.loader__video', { yPercent: -70, scale: .72, opacity: 0, duration: .9, ease: 'expo.in' }, '+=.15')
    .to(['.loader__top', '.loader__name', '.loader__count'], { y: -36, opacity: 0, duration: .55, stagger: .05, ease: 'power2.in' }, '<.2')
    .to('.loader', { clipPath: 'inset(0% 0% 100% 0%)', duration: 1, ease: 'expo.inOut' }, '-=.15')
    .add(() => { $('.loader').remove(); })
    .add(introTL())                                                     // símbolo → legendas → logo + nome → voa p/ o menu
    .to('.hero__strip', { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'expo.inOut' }, '-=1.1')
    .to(heroChars.length ? heroChars : '.hero__bottom', { yPercent: 0, duration: 1.2, stagger: { each: .06, from: 'center' }, ease: 'expo.out' }, '<.35')
    .to('.reveal-up', { y: 0, opacity: 1, duration: 1, stagger: .1, ease: 'expo.out' }, '<.2')
    .add(() => { document.body.classList.remove('is-loading'); lenis.start(); }));

  /* ---------- cursor ---------- */
  if (fine) {
    const cursor = $('.cursor');
    const label = $('.cursor__label');
    const cx = gsap.quickTo(cursor, 'x', { duration: .45, ease: 'power3' });
    const cy = gsap.quickTo(cursor, 'y', { duration: .45, ease: 'power3' });
    window.addEventListener('pointermove', e => { cx(e.clientX); cy(e.clientY); });

    document.addEventListener('pointerover', e => {
      const labelled = e.target.closest('[data-cursor]');
      const link = e.target.closest('a, button, input[type=range], .shapes svg, .chips li');
      cursor.classList.toggle('is-label', !!labelled);
      cursor.classList.toggle('is-link', !labelled && !!link);
      label.textContent = labelled ? labelled.dataset.cursor : '';
    });
  }

  /* ---------- botões magnéticos ---------- */
  if (fine) {
    $$('.magnetic').forEach(el => {
      const xTo = gsap.quickTo(el, 'x', { duration: .6, ease: 'elastic.out(1, .4)' });
      const yTo = gsap.quickTo(el, 'y', { duration: .6, ease: 'elastic.out(1, .4)' });
      el.addEventListener('pointermove', e => {
        const r = el.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * .35);
        yTo((e.clientY - r.top - r.height / 2) * .45);
      });
      el.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    });
  }

  /* ---------- nav some ao descer, volta ao subir ---------- */
  const nav = $('.nav');
  let lastY = 0;
  lenis.on('scroll', ({ scroll }) => {
    nav.classList.toggle('is-hidden', scroll > lastY && scroll > 200);
    lastY = scroll;
  });

  /* ---------- hero: parallax de saída ---------- */
  gsap.to('.hero__bottom', {          // o texto da hero sobe e esmaece enquanto a câmera avança no vídeo
    yPercent: -12, opacity: 0, ease: 'none',
    scrollTrigger: { trigger: '.hero', start: '30% top', end: 'bottom top', scrub: true }
  });

  /* ---------- vídeo do contato: só decodifica enquanto está visível ---------- */
  // (hoje o cartão é a órbita em HTML — orbita/orbita.js já pausa sozinha fora da tela; isto só vale se voltar o <video>)
  const contactVideo = $('.contact__video video');
  if (contactVideo) ScrollTrigger.create({
    trigger: '.contact__video', start: 'top bottom', end: 'bottom top',
    onToggle: self => { self.isActive ? contactVideo.play().catch(() => {}) : contactVideo.pause(); }
  });
  gsap.from('.contact__video', {
    scale: .6, opacity: 0, duration: 1.4, ease: 'expo.out', // rotação fica com o parallax de [data-depth]
    scrollTrigger: { trigger: '.contact', start: 'top 70%' }
  });

  /* ---------- galeria horizontal guiada pelo scroll ---------- */
  const row = $('.gallery__row');
  gsap.fromTo(row, { x: () => innerWidth * .1 }, {
    x: () => -(row.scrollWidth - innerWidth * .9),
    ease: 'none',
    scrollTrigger: { trigger: '.gallery', start: 'top bottom', end: 'bottom top', scrub: .6, invalidateOnRefresh: true }
  });
  $$('.tile').forEach((t, i) => {
    gsap.fromTo(t, { rotate: i % 2 ? 3 : -3 }, {
      rotate: i % 2 ? -3 : 3, ease: 'none',
      scrollTrigger: { trigger: '.gallery', start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  /* ---------- em números: faixas de slides em sentidos opostos ---------- */
  $$('.slides-row').forEach((row, i) => {
    const travel = () => Math.max(0, row.scrollWidth - innerWidth * .9);
    const [from, to] = i % 2 ? [() => -travel(), () => -travel() * .25] : [() => -travel() * .1, () => -travel() * .85];
    gsap.fromTo(row, { x: from }, {
      x: to, ease: 'none',
      scrollTrigger: { trigger: '.numbers', start: 'top bottom', end: 'bottom top', scrub: .8, invalidateOnRefresh: true }
    });
  });

  /* ---------- títulos que sobem por linha ---------- */
  $$('.split-lines').forEach(el => {
    const inner = wrapInner(el);
    gsap.from(inner, {
      yPercent: 110, rotate: 3, duration: 1.2, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%' }
    });
  });
  $$('.display--emboss, .footer__name').forEach(el => {
    const chars = splitChars(el);
    gsap.from(chars, {
      yPercent: 100, opacity: 0, rotateX: -80, transformOrigin: '50% 100%',
      duration: 1.1, stagger: .04, ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 85%' }
    });
  });

  /* ---------- texto do "sobre" acendendo palavra por palavra ---------- */
  $$('.scrub-words').forEach(el => {
    const words = splitWords(el);
    gsap.to(words, {
      opacity: 1, stagger: .1, ease: 'none',
      scrollTrigger: { trigger: el, start: 'top 80%', end: 'bottom 45%', scrub: true }
    });
  });

  /* ---------- objetos 3D flutuando em profundidades diferentes ---------- */
  $$('[data-depth]').forEach(el => {
    const d = parseFloat(el.dataset.depth);
    gsap.fromTo(el, { y: 180 * d, rotate: -12 * d }, {
      y: -180 * d, rotate: 12 * d, ease: 'none',
      scrollTrigger: { trigger: el.parentElement, start: 'top bottom', end: 'bottom top', scrub: true }
    });
  });

  /* ---------- contadores ---------- */
  $$('[data-to]').forEach(el => {
    const o = { v: 0 };
    gsap.to(o, {
      v: +el.dataset.to, duration: 2, ease: 'power3.out',
      onUpdate: () => { el.textContent = Math.round(o.v) + (el.dataset.suffix || ''); },   // data-suffix: ex. º
      scrollTrigger: { trigger: el, start: 'top 90%', once: true }
    });
  });

  /* ---------- entradas em sequência ---------- */
  const batchIn = sel => ScrollTrigger.batch(sel, {
    start: 'top 92%',
    once: true,
    onEnter: els => gsap.fromTo(els, { y: 60, opacity: 0 }, { y: 0, opacity: 1, duration: 1, stagger: .1, ease: 'expo.out', overwrite: true })
  });
  const batched = ['.card', '.stats', '.profile-card', '.contact__grid > *', '.footer__cols > div'];
  gsap.set(batched.join(','), { opacity: 0 });
  batched.forEach(batchIn);

  gsap.from('.shapes svg', {
    yPercent: 120, rotate: 45, duration: 1.2, stagger: .06, ease: 'back.out(1.6)',
    scrollTrigger: { trigger: '.shapes', start: 'top 95%' }
  });

  /* ---------- seções claras "abrindo" ---------- */
  $$('.light').forEach(sec => {
    gsap.fromTo(sec, { clipPath: 'inset(6% 5% 0% 5% round 56px)' }, {
      clipPath: 'inset(0% 0% 0% 0% round 56px)', ease: 'none',
      scrollTrigger: { trigger: sec, start: 'top bottom', end: 'top 30%', scrub: true }
    });
  });

  /* ---------- transições entre seções (escolhidas para a estrutura deste site) ----------
     1. Depth: ao sair da hero a câmera "atravessa" a faixa panorâmica — ela cresce até cobrir a hero; as bordas escuras
        da faixa fazem a hero terminar escura e emendar no letreiro.
     2. Mask reveal: o painel violeta de Serviços nasce como um cartão arredondado e abre até a tela cheia
        (mesmo idioma das seções claras abrindo).
     3. Parallax overlap: o título de cada seção já começa a subir enquanto a anterior ainda sai.
     immediateRender: false → nada disso mexe nos estados da entrada (preloader / revelações). */
  gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } })
    .fromTo('.hero__strip', { scale: 1 }, { scale: 1.18, ease: 'none', immediateRender: false }, 0)   // a câmera avança no vídeo ao rolar;

  gsap.fromTo('.sv', { clipPath: 'inset(8% 6% 0% 6% round 48px)' }, {
    clipPath: 'inset(0% 0% 0% 0% round 0px)', ease: 'none',
    scrollTrigger: { trigger: '.sv', start: 'top bottom', end: 'top 20%', scrub: true }
  });
  gsap.fromTo('.sv__head', { y: 90 }, { y: 0, ease: 'none', immediateRender: false,
    scrollTrigger: { trigger: '.sv', start: 'top bottom', end: 'top 20%', scrub: true } });
  // saída de Serviços → Sem atrito: o painel fecha de volta num cartão arredondado (o espelho da entrada) e
  // recua um pouco, enquanto Sem atrito sobe por baixo — nada de borda seca no fim do violeta
  gsap.fromTo('.sv', { clipPath: 'inset(0% 0% 0% 0% round 0px)', scale: 1 }, {
    clipPath: 'inset(0% 6% 10% 6% round 48px)', scale: .96, transformOrigin: '50% 100%', ease: 'none', immediateRender: false,
    scrollTrigger: { trigger: '.sv', start: 'bottom 85%', end: 'bottom 15%', scrub: true }
  });
  gsap.fromTo('#destaques', { y: 0 }, { y: -60, ease: 'none', immediateRender: false,     // Sem atrito encosta no painel enquanto ele fecha
    scrollTrigger: { trigger: '.sv', start: 'bottom 85%', end: 'bottom 15%', scrub: true } });

  // (os títulos em relevo — Sobre mim e Projetos — ficam de fora: o deslocamento quebra o recorte do degradê e cria uma letra fantasma)
  ['#processo .section-head', '#modelos .section-head', '#destaques .section-head', '#numeros .section-head']
    .forEach(sel => { const el = $(sel); if (!el) return;
      gsap.fromTo(el, { y: 140 }, { y: -30, ease: 'none', immediateRender: false,
        scrollTrigger: { trigger: el.closest('section'), start: 'top bottom', end: 'top top', scrub: true } }); });

  /* ---------- bento: tilt 3D + brilho seguindo o mouse ---------- */
  if (fine) {
    $$('[data-tilt]').forEach(card => {
      card.addEventListener('pointermove', e => {
        const r = card.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width;
        const py = (e.clientY - r.top) / r.height;
        card.style.setProperty('--mx', px * 100 + '%');
        card.style.setProperty('--my', py * 100 + '%');
        gsap.to(card, { rotateY: (px - .5) * 8, rotateX: (.5 - py) * 8, transformPerspective: 900, duration: .6, ease: 'power3' });
      });
      card.addEventListener('pointerleave', () => {
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: .8, ease: 'elastic.out(1, .5)' });
      });
    });
  }

  /* ---------- projetos: cards empilhando — cada cartão novo cobre o anterior, que encolhe e escurece ---------- */
  const cards = $$('.pcard');
  cards.forEach((card, i) => {
    const next = cards[i + 1];
    if (!next) return;
    gsap.to(card, {
      scale: .92 - (cards.length - i) * .01,
      filter: 'brightness(.45)',
      ease: 'none',
      scrollTrigger: { trigger: next, start: 'top bottom', end: 'top top', scrub: true }
    });
  });

  /* ---------- antes / depois ---------- */
  $$('[data-compare]').forEach(c => {
    const input = $('input', c);
    const set = () => c.style.setProperty('--p', input.value + '%');
    input.addEventListener('input', set);
    set();
  });

  /* ---------- recalcula após fontes carregarem ---------- */
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
})();
