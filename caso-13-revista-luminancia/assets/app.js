// LUMINÂNCIA — caso-13
// 1. fotos reais: troca a composição em CSS pelo arquivo de assets/fotos/ quando ele existe
// 2. entrada dos blocos ao rolar
// 3. contador 30K+ do hero
// 4. formulário de assinatura (sem backend: só confirma na tela)

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

/* ---------- 3. contador ---------- */
const counter = document.querySelector('[data-count]');
if (counter && !reduceMotion) {
  const end = Number(counter.dataset.count);
  const suffix = counter.dataset.suffix || '';
  const start = performance.now();
  const step = (now) => {
    const k = Math.min((now - start) / 1600, 1);
    counter.textContent = `${Math.round(end * (1 - Math.pow(1 - k, 3)))}${suffix}`;
    if (k < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step);
}

/* ---------- 4. assinatura ---------- */
const form = document.querySelector('[data-sub]');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    form.querySelector('[data-sub-ok]').hidden = false;
    form.reset();
  });
}
