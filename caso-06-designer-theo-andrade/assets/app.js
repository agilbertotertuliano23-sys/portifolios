// Theo Andrade — caso-06
// 0. título PORTFOLIO em fita (onda)
// 1. roda de cards do hero (gira um card por vez)
// 2. carrossel da tela de destaques
// 3. livro 3D folheando
// 4. loop da seção final (wordmark estica + nuvem de imagens)

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- 0. título em fita ---------- */
// cada letra tem duas cópias (preenchida e vazada) que trocam de lugar em contrafase;
// a fase avança letra a letra, então a troca corre pela palavra como uma onda.
// perto do cruzamento a letra achata e inclina seguindo a curva da fita.
const waveCols = [...document.querySelectorAll('.wave .col')];
if (waveCols.length && !reduceMotion) {
  const SPEED = 1.9;   // rad/s
  const STEP = 0.42;   // defasagem entre letras (rad)
  const AMP = 0.4;     // deslocamento vertical, em em
  const rows = waveCols.map((col) => [col.querySelector('.row.a'), col.querySelector('.row.b')]);

  const frame = (now) => {
    const t = now / 1000;
    const em = parseFloat(getComputedStyle(waveCols[0]).fontSize);
    const w = waveCols[0].offsetWidth || em;
    const y = (i, sign) => sign * -AMP * em * Math.cos(t * SPEED - i * STEP);

    rows.forEach(([a, b], i) => {
      [[a, 1], [b, -1]].forEach(([el, sign]) => {
        const c = Math.cos(t * SPEED - i * STEP);
        const sy = Math.max(Math.pow(Math.abs(c), 0.45), 0.06);
        const slope = (y(i + 1, sign) - y(i - 1, sign)) / (2 * w);
        const tilt = Math.atan(slope) * 0.9;
        el.style.transform = `translateY(${y(i, sign).toFixed(2)}px) skewY(${tilt.toFixed(3)}rad) scaleY(${sy.toFixed(3)})`;
      });
    });
    requestAnimationFrame(frame);
  };
  requestAnimationFrame(frame);
}

/* ---------- 1. roda de cards ---------- */
const wheel = document.querySelector('[data-wheel]');
if (wheel && !reduceMotion) {
  let rot = 0;
  setInterval(() => {
    if (document.hidden) return;
    rot -= 30;
    wheel.style.setProperty('--rot', `${rot}deg`);
  }, 2200);
}

/* ---------- 2. carrossel de destaques ---------- */
const carousel = document.querySelector('[data-carousel]');
if (carousel) {
  const slides = [...carousel.querySelectorAll('.slide')];
  const count = carousel.querySelector('[data-count]');
  const caption = carousel.querySelector('[data-caption]');
  const pad = (n) => String(n).padStart(2, '0');
  let current = 0;
  let timer;

  const show = (index) => {
    slides[current].classList.remove('is-active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('is-active');
    count.textContent = `${pad(current + 1)} / ${pad(slides.length)}`;
    caption.textContent = slides[current].dataset.name;
  };

  const restart = () => {
    clearInterval(timer);
    if (!reduceMotion) timer = setInterval(() => show(current + 1), 5000);
  };

  carousel.querySelector('[data-next]').addEventListener('click', () => { show(current + 1); restart(); });
  carousel.querySelector('[data-prev]').addEventListener('click', () => { show(current - 1); restart(); });
  carousel.addEventListener('mouseenter', () => clearInterval(timer));
  carousel.addEventListener('mouseleave', restart);
  restart();
}

/* ---------- 3. livro 3D ---------- */
// livro aberto que folheia sozinho: cada página anda pela pilha da direita,
// vira pela lombada e assenta na pilha da esquerda; a última volta para o início.
const bookStage = document.querySelector('[data-book]');
const bookToggle = document.querySelector('[data-book-toggle]');
const pages = bookStage ? [...bookStage.querySelectorAll('.page')] : [];
if (pages.length) {
  const N = pages.length;
  const STACK = (N - 2) / 2;          // páginas em cada pilha
  const FAN = 38;                     // abertura de cada pilha, em graus
  const RATE = 1.5;                   // páginas por segundo
  const smooth = (x) => x * x * (3 - 2 * x);

  // posição p (0..N) → ângulo da página: 0° deitada à direita, 180° deitada à esquerda
  const angle = (p) => {
    if (p < STACK) return 12 + (p / STACK) * FAN;
    if (p < STACK + 2) return 12 + FAN + smooth((p - STACK) / 2) * (180 - 24 - 2 * FAN);
    return 168 - FAN + ((p - STACK - 2) / STACK) * FAN;
  };

  const place = (s) => {
    pages.forEach((page, i) => {
      const p = (((i + s) % N) + N) % N;
      const a = angle(p);
      page.style.setProperty('--a', a.toFixed(2));
      page.style.opacity = Math.min(1, p / 0.5, (N - p) / 0.5).toFixed(3);
      page.classList.toggle('is-left', a > 90);
    });
  };

  let s = 0;
  let dir = 1;
  let last = performance.now();
  place(s);

  if (!reduceMotion) {
    const tick = (now) => {
      const dt = Math.min((now - last) / 1000, .1);
      last = now;
      s += dt * RATE * dir;
      place(s);
      requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  bookToggle?.addEventListener('click', () => { dir *= -1; });
}

/* ---------- 4. seção final ---------- */
// o loop (wordmark + nuvem) só toca enquanto a seção está visível
const stage = document.querySelector('[data-stage]');
if (stage && !reduceMotion) {
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([entry]) => {
      const entering = entry.isIntersecting && !stage.classList.contains('is-playing');
      stage.classList.toggle('is-playing', entry.isIntersecting);
      // sempre recomeça do repouso ao entrar, como na referência
      if (entering) stage.getAnimations({ subtree: true }).forEach((anim) => { anim.currentTime = 0; });
    }, { threshold: 0.35 }).observe(stage);
  } else {
    stage.classList.add('is-playing');
  }
}
