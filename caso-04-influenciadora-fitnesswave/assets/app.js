// Interações do portfólio Fitnesswave

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------- Navegação: fundo ao rolar, menu mobile e seção atual ---------- */

const nav = document.querySelector('.nav');
const toggle = document.querySelector('.nav-toggle');
const navLinks = Array.from(document.querySelectorAll('.nav-links a'));

if (nav) {
  const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 24);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

if (nav && toggle) {
  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  };
  toggle.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  nav.querySelectorAll('.nav-menu a').forEach((a) => a.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav.classList.contains('is-open')) {
      setMenu(false);
      toggle.focus();
    }
  });
}

if ('IntersectionObserver' in window && navLinks.length) {
  const byId = new Map(navLinks.map((a) => [a.getAttribute('href').slice(1), a]));
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const link = byId.get(entry.target.id);
      navLinks.forEach((a) => {
        const on = a === link;
        a.classList.toggle('is-current', on);
        if (on) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    });
  }, { rootMargin: '-45% 0px -50% 0px' });
  ['inicio', ...byId.keys()].forEach((id) => {
    const section = document.getElementById(id);
    if (section) spy.observe(section);
  });
}

/* ---------- Ano no rodapé ---------- */

const ano = document.getElementById('ano');
if (ano) ano.textContent = new Date().getFullYear();

/* ---------- Contadores ---------- */

const formatCount = (value, el) => {
  const n = Math.round(value);
  const text = el.dataset.format === 'dot' ? n.toLocaleString('pt-BR') : String(n);
  return text + (el.dataset.suffix || '');
};

const runCounter = (el) => {
  const target = Number(el.dataset.count);
  if (reduceMotion || !target) return;
  const duration = 1600;
  const startTime = performance.now();
  const tick = (now) => {
    const t = Math.min((now - startTime) / duration, 1);
    el.textContent = formatCount(target * (1 - Math.pow(1 - t, 3)), el);
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

/* ---------- Revelar ao rolar ---------- */

const items = document.querySelectorAll('.reveal');
if (!('IntersectionObserver' in window) || reduceMotion) {
  items.forEach((el) => el.classList.add('is-visible'));
} else {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      entry.target.querySelectorAll('.count').forEach(runCounter);
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.15 });
  items.forEach((el) => observer.observe(el));
}

/* ---------- Parcerias: efeito MicroSlats ---------- */

const waveSection = document.querySelector('.wave');
const waveHost = document.getElementById('wave-canvas');

if (waveSection && waveHost) {
  const markUnsupported = () => waveSection.classList.add('no-webgl');

  // Carrega o WebGL só quando a seção se aproxima da tela
  const boot = async () => {
    try {
      const { createMicroSlats } = await import('./micro-slats.js');
      const slats = createMicroSlats(waveHost, {
        preset: 'swell',
        color: '#8B5CF6',
        glintColor: '#F3E8FF',
        backgroundColor: 'rgba(0, 0, 0, 0)',
        slatWidth: 8,
        slatHeight: 22,
        gap: 3,
        cursorSize: 60,
        swirl: 0.6,
        lean: 0.6
      });
      if (!slats.supported) return markUnsupported();

      const buttons = waveSection.querySelectorAll('.preset');
      buttons.forEach((btn) => {
        btn.addEventListener('click', () => {
          buttons.forEach((b) => {
            const on = b === btn;
            b.classList.toggle('is-active', on);
            b.setAttribute('aria-pressed', String(on));
          });
          slats.set({ preset: btn.dataset.preset });
        });
      });
    } catch (err) {
      console.warn('[Fitnesswave] Efeito de ondas indisponível:', err);
      markUnsupported();
    }
  };

  if ('IntersectionObserver' in window) {
    const lazy = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) {
        lazy.disconnect();
        boot();
      }
    }, { rootMargin: '400px 0px' });
    lazy.observe(waveSection);
  } else {
    boot();
  }
}
