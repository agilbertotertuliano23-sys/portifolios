// NECRÓPOLIS 2 — caso-12
// 1. imagens reais: troca a composição em CSS pelo arquivo de assets/fotos/ quando ele existe
// 2. entrada dos blocos ao rolar
// 3. carrossel de criaturas (pontinhos + troca automática)
// 4. habilidades humanas (ícones trocam nome e texto)
// 5. "ver imagem maior" e trailer em um visualizador
// (a névoa em fluido fica em assets/fluid.js)

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

