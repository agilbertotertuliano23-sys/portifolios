// NECRÓPOLIS 2 — caso-12
// 1. imagens reais: troca a composição em CSS pelo arquivo de assets/fotos/ quando ele existe
// 2. entrada dos blocos ao rolar
// 3. carrossel de criaturas (pontinhos + troca automática)
// 4. habilidades humanas (ícones trocam nome e texto)
// 5. "ver imagem maior" e trailer em um visualizador
// 6. vídeos cinemáticos em loop: tocam só quando aparecem na tela
// 7. menu: fundo ao rolar, barra de progresso, seção ativa, menu do celular
// 8. pré-registro do rodapé (sem backend: só confirma na tela)
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
document.querySelectorAll('[data-trailer]').forEach((trailer) => {
  trailer.addEventListener('click', () => {
    const video = document.createElement('video');
    [['webm', 'video/webm'], ['mp4', 'video/mp4']].forEach(([ext, type]) => {
      const source = document.createElement('source');
      source.src = `assets/videos/trailer.${ext}`;
      source.type = type;
      video.append(source);
    });
    video.poster = 'assets/videos/trailer.jpg';
    video.controls = true;
    video.autoplay = true;
    video.playsInline = true;
    open(video);
    video.play().catch(() => {});
  });
});
document.querySelector('[data-lb-close]').addEventListener('click', close);
lb.addEventListener('click', (e) => { if (e.target === lb) close(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && !lb.hidden) close(); });


/* ---------- 6. vídeos em loop ---------- */
// sem som, tocam só enquanto visíveis (economiza bateria); com movimento reduzido fica o pôster
const loops = document.querySelectorAll('video[data-autoplay]');
if (!reduceMotion && 'IntersectionObserver' in window) {
  const vio = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const v = entry.target;
      if (entry.isIntersecting) v.play().catch(() => {});
      else v.pause();
    });
  }, { threshold: 0.2 });
  loops.forEach((v) => vio.observe(v));
}

/* ---------- 7. menu ---------- */
const nav = document.querySelector('[data-nav]');
const progress = document.querySelector('[data-progress]');
const burger = document.querySelector('[data-burger]');
const navLinks = document.querySelector('[data-nav-links]');
if (nav) {
  let ticking = false;
  const onScroll = () => {
    ticking = false;
    nav.classList.toggle('is-solid', scrollY > 40);
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max > 0 ? Math.min(scrollY / max, 1) : 0})`;
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(onScroll); } }, { passive: true });
  onScroll();

  // seção ativa
  const spies = [...document.querySelectorAll('[data-spy]')];
  const targets = spies.map((a) => document.querySelector(a.getAttribute('href')));
  if ('IntersectionObserver' in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const i = targets.indexOf(entry.target);
        spies.forEach((a, k) => a.classList.toggle('is-active', k === i));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    targets.forEach((t) => t && spy.observe(t));
  }

  // menu do celular
  const setOpen = (open) => {
    burger.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  };
  burger.addEventListener('click', () => setOpen(burger.getAttribute('aria-expanded') !== 'true'));
  navLinks.addEventListener('click', (e) => { if (e.target.closest('a')) setOpen(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
}

/* ---------- 8. pré-registro ---------- */
const prereg = document.querySelector('[data-prereg]');
if (prereg) {
  prereg.addEventListener('submit', (e) => {
    e.preventDefault();
    prereg.querySelector('[data-prereg-ok]').hidden = false;
    prereg.reset();
  });
}
