// Theo Andrade — caso-06
// 0. título PORTFOLIO em fita (onda)
// 1. roda de cards do hero (gira um card por vez)
// 2. carrossel da tela de destaques
// 3. sentido de rotação do livro 3D
// 4. scroll da seção final (wordmark estica + nuvem de imagens)

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
  }, 2600);
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
const bookStage = document.querySelector('[data-book]');
const bookToggle = document.querySelector('[data-book-toggle]');
if (bookStage && bookToggle) {
  bookToggle.addEventListener('click', () => bookStage.classList.toggle('is-reverse'));
}

/* ---------- 4. seção final ---------- */
const track = document.querySelector('[data-stage]');
if (track && !reduceMotion) {
  let ticking = false;

  const update = () => {
    ticking = false;
    const rect = track.getBoundingClientRect();
    const total = rect.height - window.innerHeight;
    const p = Math.min(Math.max(-rect.top / total, 0), 1);
    // 0 → 1 → 0: abre a nuvem no meio do scroll e recolhe no fim, como na referência
    const wave = Math.sin(Math.PI * p);
    const e = wave * wave * (3 - 2 * wave); // smoothstep
    track.style.setProperty('--e', e.toFixed(4));
  };

  const onScroll = () => {
    if (!ticking) { ticking = true; requestAnimationFrame(update); }
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
}
