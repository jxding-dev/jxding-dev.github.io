(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const createObserver = (callback, options) => {
    if (!("IntersectionObserver" in window)) return null;
    return new IntersectionObserver(callback, options);
  };

  const initReveal = () => {
    const elements = [...document.querySelectorAll(".reveal")];
    if (!elements.length) return;

    if (reduceMotion) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    const observer = createObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.16 });

    if (!observer) {
      elements.forEach((element) => element.classList.add("is-visible"));
      return;
    }

    elements.forEach((element) => observer.observe(element));
  };

  const initCountUp = () => {
    const numbers = [...document.querySelectorAll(".numbers-section .stat strong")];
    if (!numbers.length) return;

    const animate = (element) => {
      const rawNumber = element.textContent.replace(/[^0-9]/g, "");
      if (!rawNumber) return;

      const target = Number(rawNumber);
      if (!Number.isFinite(target)) return;

      if (reduceMotion) {
        element.textContent = String(target);
        return;
      }

      const duration = 1200;
      const startTime = performance.now();

      const tick = (now) => {
        const progress = Math.min((now - startTime) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        element.textContent = String(Math.round(target * eased));
        if (progress < 1) requestAnimationFrame(tick);
      };

      element.textContent = "0";
      requestAnimationFrame(tick);
    };

    const section = document.querySelector(".numbers-section");
    if (!section) return;

    const run = () => numbers.forEach(animate);
    const observer = createObserver((entries) => {
      if (!entries.some((entry) => entry.isIntersecting)) return;
      run();
      observer.disconnect();
    }, { threshold: 0.35 });

    if (observer) observer.observe(section);
    else run();
  };

  initReveal();
  initCountUp();
})();
