// Interações da landing page — Método InovFit

document.addEventListener('DOMContentLoaded', () => {
  // Formulários de inscrição: validação e retorno na própria página
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

  document.querySelectorAll('.js-optin').forEach((form) => {
    const input = form.querySelector('input[type="email"]');
    const feedback = form.querySelector('.form-feedback');

    const show = (msg, type) => {
      feedback.textContent = msg;
      feedback.classList.toggle('is-success', type === 'success');
      feedback.classList.toggle('is-error', type === 'error');
    };

    input.addEventListener('input', () => {
      input.classList.remove('is-invalid');
      input.removeAttribute('aria-invalid');
    });

    form.addEventListener('submit', (event) => {
      event.preventDefault();
      const email = input.value.trim();

      if (!EMAIL_RE.test(email)) {
        input.classList.add('is-invalid');
        input.setAttribute('aria-invalid', 'true');
        show('Digite um e-mail válido para garantir sua vaga.', 'error');
        input.focus();
        return;
      }

      // TODO: enviar o e-mail para a ferramenta de captura (ex.: RD Station, ActiveCampaign)
      show('Inscrição confirmada! Enviamos os detalhes do evento para o seu e-mail.', 'success');
      form.reset();
    });
  });

  // Animação de entrada ao rolar
  const items = document.querySelectorAll('.reveal');
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!('IntersectionObserver' in window) || reduceMotion) {
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
