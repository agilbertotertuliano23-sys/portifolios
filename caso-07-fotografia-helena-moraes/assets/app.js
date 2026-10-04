// Helena Moraes — caso-07
// 1. fotos reais: troca a composição em CSS pelo arquivo de assets/fotos/ quando ele existe
// 2. entrada dos blocos ao rolar
// 3. contadores da seção "Sobre mim"

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
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  reveals.forEach((el) => io.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('is-in'));
}

/* ---------- 3. contadores ---------- */
const counters = document.querySelectorAll('[data-count]');
if ('IntersectionObserver' in window && !reduceMotion) {
  const run = (el) => {
    const end = Number(el.dataset.count);
    const suffix = el.dataset.suffix || '';
    const start = performance.now();
    const step = (now) => {
      const k = Math.min((now - start) / 1400, 1);
      const eased = 1 - Math.pow(1 - k, 3);
      el.textContent = `${Math.round(end * eased)}${suffix}`;
      if (k < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };
  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      run(entry.target);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.6 });
  counters.forEach((el) => io.observe(el));
}
