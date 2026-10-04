// Interações da landing page — Dra. Luana Mattos Advocacia

document.addEventListener('DOMContentLoaded', () => {
  // Abas das outras áreas de atuação
  const tabs = Array.from(document.querySelectorAll('.tab'));
  const panel = document.querySelector('.tab-panel');
  const nextBtn = document.querySelector('.tabs-next');

  const descriptions = {
    trabalho: 'Regulamentação das relações de trabalho, incluindo questões de contratações, remunerações, jornada de trabalho e rescisão contratual.',
    consumidor: 'Proteção aos direitos do consumidor em relações de consumo, vícios de produtos, cobranças indevidas e contratos abusivos.',
    previdenciario: 'Assessoria e planejamento previdenciário, auxílios, aposentadorias e revisão de benefícios perante o INSS.'
  };

  const activate = (tab) => {
    tabs.forEach((t) => {
      const on = t === tab;
      t.classList.toggle('is-active', on);
      t.setAttribute('aria-selected', String(on));
    });
    if (panel) {
      panel.textContent = descriptions[tab.dataset.tab] || '';
      // reinicia a animação de entrada do texto
      panel.classList.remove('is-changing');
      void panel.offsetWidth;
      panel.classList.add('is-changing');
    }
    tab.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'smooth' });
  };

  tabs.forEach((tab) => tab.addEventListener('click', () => activate(tab)));

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      const current = tabs.findIndex((t) => t.classList.contains('is-active'));
      activate(tabs[(current + 1) % tabs.length]);
    });
  }

  // Navegação: fundo ao rolar, menu mobile e seção atual
  const nav = document.querySelector('.nav');
  const toggle = document.querySelector('.nav-toggle');
  const navLinks = Array.from(document.querySelectorAll('.nav-links a'));

  if (nav) {
    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  const setMenu = (open) => {
    nav.classList.toggle('is-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  };

  if (nav && toggle) {
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
        if (!link) return;
        navLinks.forEach((a) => {
          a.classList.toggle('is-current', a === link);
          if (a === link) a.setAttribute('aria-current', 'true');
          else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    byId.forEach((_, id) => {
      const section = document.getElementById(id);
      if (section) spy.observe(section);
    });
  }

  // Ano atual no rodapé
  const ano = document.getElementById('ano');
  if (ano) ano.textContent = new Date().getFullYear();

  // Parallax leve: expõe a rolagem (limitada à hero) como variável CSS
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (!reduceMotion) {
    const root = document.documentElement;
    let ticking = false;
    const update = () => {
      root.style.setProperty('--scroll', Math.min(window.scrollY, 900).toFixed(0));
      ticking = false;
    };
    window.addEventListener('scroll', () => {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  // Animação de entrada ao rolar
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  items.forEach((el) => observer.observe(el));
});
