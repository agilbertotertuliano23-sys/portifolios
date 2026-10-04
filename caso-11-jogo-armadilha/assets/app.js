// ARMADILHA — caso-11
// 1. fotos reais: troca a composição em CSS pelo arquivo de assets/fotos/ quando ele existe
// 2. entrada dos blocos ao rolar
// 3. estática de TV (troca a semente do ruído)
// 4. glitch periódico nos títulos
// 5. texto datilografado na saga
// 6. contagem regressiva para 31.10.2026
// 7. player do trailer (ainda sem vídeo) e formulário de aviso

document.documentElement.classList.add('js');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- 1. fotos reais ---------- */
document.querySelectorAll('[data-photo]').forEach((el) => {
  const img = new Image();
  img.onload = () => {
    el.style.backgroundImage = `url("${el.dataset.photo}")`;
    el.classList.add('is-loaded');
  };
  img.src = el.dataset.photo;
});

/* ---------- 2. entrada ao rolar ---------- */
const onView = (els, cb, threshold = 0.15) => {
  if (!('IntersectionObserver' in window) || reduceMotion) { els.forEach(cb); return; }
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      cb(entry.target);
      io.unobserve(entry.target);
    });
  }, { threshold, rootMargin: '0px 0px -40px 0px' });
  els.forEach((el) => io.observe(el));
};
onView(document.querySelectorAll('.reveal'), (el) => el.classList.add('is-in'));

/* ---------- 3. estática de TV ---------- */
const noise = document.querySelector('[data-static]');
if (noise && !reduceMotion) {
  let seed = 1;
  setInterval(() => {
    if (document.hidden) return;
    seed = (seed % 97) + 1;
    noise.setAttribute('seed', seed);
  }, 90);
}

/* ---------- 4. glitch periódico ---------- */
const glitches = [...document.querySelectorAll('.glitch')];
if (glitches.length && !reduceMotion) {
  setInterval(() => {
    const el = glitches[Math.floor(Math.random() * glitches.length)];
    el.classList.add('is-glitching');
    setTimeout(() => el.classList.remove('is-glitching'), 450);
  }, 2600);
}

/* ---------- 5. texto datilografado ---------- */
const typed = document.querySelector('[data-type]');
if (typed && !reduceMotion) {
  const full = typed.textContent.trim();
  typed.textContent = '';
  typed.setAttribute('aria-label', full);
  onView([typed], () => {
    typed.classList.add('is-typing');
    let i = 0;
    const tick = () => {
      i += 1;
      typed.textContent = full.slice(0, i);
      if (i < full.length) setTimeout(tick, full[i - 1] === '.' ? 260 : 24);
      else typed.classList.remove('is-typing');
    };
    tick();
  }, 0.5);
}

/* ---------- 6. contagem regressiva ---------- */
const cd = document.querySelector('[data-countdown]');
if (cd) {
  const end = new Date(cd.dataset.countdown).getTime();
  const out = { d: cd.querySelector('[data-d]'), h: cd.querySelector('[data-h]'), m: cd.querySelector('[data-m]'), s: cd.querySelector('[data-s]') };
  const pad = (n) => String(n).padStart(2, '0');
  const render = () => {
    const left = Math.max(0, end - Date.now());
    out.d.textContent = pad(Math.floor(left / 86400000));
    out.h.textContent = pad(Math.floor(left / 3600000) % 24);
    out.m.textContent = pad(Math.floor(left / 60000) % 60);
    out.s.textContent = pad(Math.floor(left / 1000) % 60);
  };
  render();
  setInterval(render, 1000);
}

/* ---------- 7. trailer e aviso ---------- */
const play = document.querySelector('[data-play]');
const msg = document.querySelector('[data-player-msg]');
if (play && msg) {
  play.addEventListener('click', () => {
    msg.textContent = 'TRAILER LIBERADO EM 13.10.2026 — FIQUE ACORDADO';
  });
}
const notify = document.querySelector('[data-notify]');
if (notify) {
  notify.addEventListener('submit', (e) => {
    e.preventDefault();
    notify.querySelector('[data-notify-ok]').hidden = false;
    notify.reset();
  });
}
