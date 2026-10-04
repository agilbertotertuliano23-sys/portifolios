// Augusto Landau — caso-10
// 1. fotos reais: troca a composição em CSS pelo arquivo de assets/fotos/ quando ele existe
// 2. entrada dos blocos ao rolar
// 3. arrastar a fileira de exposições com o mouse

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

/* ---------- 3. arrastar exposições ---------- */
const row = document.querySelector('[data-drag]');
if (row) {
  let startX = 0;
  let startScroll = 0;
  let dragging = false;
  row.addEventListener('pointerdown', (e) => {
    if (e.pointerType !== 'mouse' || e.target.closest('a')) return;
    dragging = true;
    startX = e.clientX;
    startScroll = row.scrollLeft;
    row.classList.add('is-dragging');
    row.setPointerCapture(e.pointerId);
  });
  row.addEventListener('pointermove', (e) => {
    if (dragging) row.scrollLeft = startScroll - (e.clientX - startX);
  });
  const stop = () => { dragging = false; row.classList.remove('is-dragging'); };
  row.addEventListener('pointerup', stop);
  row.addEventListener('pointercancel', stop);
}
