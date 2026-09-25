document.addEventListener('DOMContentLoaded', () => {
  const openModal = (selector) => {
    const modal = document.querySelector(selector);
    if (!modal) return;
    modal.classList.add('is-open');
    modal.querySelector('button,[href],input,textarea,select')?.focus();
  };

  const closeModal = (modal) => {
    if (!modal) return;
    modal.classList.remove('is-open');
  };

  document.querySelectorAll('[data-modal-open]').forEach((button) => {
    button.addEventListener('click', () => openModal(button.dataset.modalOpen));
  });

  document.querySelectorAll('[data-modal-close],.modal-overlay').forEach((element) => {
    element.addEventListener('click', (event) => {
      if (event.target === element || element.hasAttribute('data-modal-close')) {
        closeModal(element.closest('.modal-overlay'));
      }
    });
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') {
      document.querySelectorAll('.modal-overlay.is-open').forEach(closeModal);
    }
  });

  document.querySelectorAll('.faq-answer').forEach((answer) => {
    if (!answer.firstElementChild) {
      const inner = document.createElement('div');
      inner.textContent = answer.textContent;
      answer.textContent = '';
      answer.append(inner);
    }
  });

  document.querySelectorAll('.faq-question').forEach((button) => {
    button.addEventListener('click', () => {
      const item = button.closest('.faq-item');
      const isOpen = button.getAttribute('aria-expanded') === 'true';
      button.setAttribute('aria-expanded', String(!isOpen));
      item?.classList.toggle('is-open', !isOpen);
    });
  });

  const revealTargets = document.querySelectorAll('[data-reveal]');
  if ('IntersectionObserver' in window && revealTargets.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.16, rootMargin: '0px 0px -6% 0px' });

    revealTargets.forEach((target, index) => {
      target.style.transitionDelay = `${Math.min(index % 4, 3) * 90}ms`;
      observer.observe(target);
    });
  } else {
    revealTargets.forEach((target) => target.classList.add('is-visible'));
  }

  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  if (canHover) {
    document.querySelectorAll('[data-tilt]').forEach((card) => {
      card.addEventListener('pointermove', (event) => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        card.style.setProperty('--tilt-x', `${(x - 0.5) * 7}deg`);
        card.style.setProperty('--tilt-y', `${(0.5 - y) * 7}deg`);
        card.style.setProperty('--mouse-x', `${x * 100}`);
        card.style.setProperty('--mouse-y', `${y * 100}`);
      });

      card.addEventListener('pointerleave', () => {
        card.style.setProperty('--tilt-x', '0deg');
        card.style.setProperty('--tilt-y', '0deg');
        card.style.setProperty('--mouse-x', '50');
        card.style.setProperty('--mouse-y', '50');
      });
    });
  }
});
