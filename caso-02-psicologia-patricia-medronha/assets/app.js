// Real number in international format: 55 + DDD + phone. When empty,
// scheduling links lead to the existing contact channels in the footer.
const WHATSAPP_NUMBER = '';
const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

if (/^\d{12,13}$/.test(WHATSAPP_NUMBER)) {
  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent('Olá, gostaria de agendar uma sessão.')}`;
  document.querySelectorAll('[data-schedule], [data-whatsapp]').forEach(link => {
    link.href = url;
    link.target = '_blank';
    link.rel = 'noopener noreferrer';
    link.hidden = false;
  });
}

const header = document.querySelector('[data-nav]');
const navToggle = header.querySelector('.nav-toggle');
const navLinks = [...header.querySelectorAll('[data-nav-link]')];
function setMenu(open) {
  header.classList.toggle('nav-open', open);
  navToggle.setAttribute('aria-expanded', String(open));
  navToggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
}
navToggle.addEventListener('click', () => setMenu(!header.classList.contains('nav-open')));
header.querySelectorAll('.site-nav a').forEach(link => link.addEventListener('click', () => setMenu(false)));
document.addEventListener('keydown', event => { if (event.key === 'Escape') setMenu(false); });
document.addEventListener('click', event => { if (!header.contains(event.target)) setMenu(false); });
const syncHeader = () => header.classList.toggle('is-scrolled', window.scrollY > 24);
window.addEventListener('scroll', syncHeader, { passive: true });
syncHeader();
// Highlight the link of the section crossing the middle of the viewport.
const sectionObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    navLinks.forEach(link => link.setAttribute('aria-current', String(link.hash === `#${entry.target.id}`)));
  });
}, { rootMargin: '-45% 0px -50% 0px' });
navLinks.forEach(link => { const section = document.querySelector(link.hash); if (section) sectionObserver.observe(section); });

const track = document.querySelector('#testimonials-track');
const previous = document.querySelector('[data-testimonial="-1"]');
const next = document.querySelector('[data-testimonial="1"]');
const status = document.querySelector('.testimonials-status');
let testimonialIndex = 0;
function syncTestimonials() {
  const step = track.firstElementChild.getBoundingClientRect().width + 24;
  testimonialIndex = Math.round(track.scrollLeft / step);
  previous.disabled = track.scrollLeft < 5;
  next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 5;
  status.textContent = `Depoimento ${testimonialIndex + 1} de ${track.children.length}`;
}
document.querySelectorAll('[data-testimonial]').forEach(button => {
  button.addEventListener('click', () => {
    const step = track.firstElementChild.getBoundingClientRect().width + 24;
    const index = Math.max(0, Math.min(track.children.length - 1, testimonialIndex + Number(button.dataset.testimonial)));
    track.scrollTo({ left: index * step, behavior: reducedMotion.matches ? 'instant' : 'smooth' });
  });
});
track.addEventListener('scroll', syncTestimonials, { passive: true });
new ResizeObserver(syncTestimonials).observe(track);
syncTestimonials();

// Keep the static composition if modules or WebGL are unavailable.
const laptopStage = document.querySelector('#laptop-stage');
const laptopObserver = new IntersectionObserver(entries => {
  if (!entries.some(entry => entry.isIntersecting)) return;
  laptopObserver.disconnect();
  if (location.protocol === 'file:') return;
  import('./laptop.js').then(module => module.mountLaptop(laptopStage)).catch(() => {
    laptopStage.dataset.renderMode = 'fallback';
  });
}, { rootMargin: '350px' });
laptopObserver.observe(laptopStage);

const brainStage = document.querySelector('#brain-stage');
const brainObserver = new IntersectionObserver(entries => {
  if (!entries.some(entry => entry.isIntersecting)) return;
  brainObserver.disconnect();
  if (location.protocol === 'file:') return;
  import('./brain.js').then(module => module.mountBrain(brainStage)).catch(() => {
    brainStage.dataset.renderMode = 'fallback';
  });
}, { rootMargin: '600px' });
brainObserver.observe(brainStage);
