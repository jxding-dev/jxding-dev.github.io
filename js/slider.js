(() => {
  const slider = document.querySelector("[data-slider]");
  if (!slider) return;

  const slides = [...slider.querySelectorAll("[data-slide]")];
  if (!slides.length) return;

  const prev = slider.querySelector("[data-prev]");
  const next = slider.querySelector("[data-next]");
  const dotsWrap = slider.querySelector("[data-slider-dots]");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const interval = Number(slider.dataset.interval) || 6000;
  let current = slides.findIndex((slide) => slide.classList.contains("is-active"));
  let timer = null;

  if (current < 0) current = 0;

  const dots = dotsWrap
    ? slides.map((_, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.setAttribute("aria-label", `${index + 1}번 슬라이드`);
        button.addEventListener("click", () => {
          show(index);
          restart();
        });
        dotsWrap.appendChild(button);
        return button;
      })
    : [];

  const show = (index) => {
    slides[current].classList.remove("is-active");
    dots[current]?.classList.remove("is-active");
    current = (index + slides.length) % slides.length;
    slides[current].classList.add("is-active");
    dots[current]?.classList.add("is-active");
  };

  const start = () => {
    if (reduceMotion || slides.length < 2 || timer) return;
    timer = window.setInterval(() => show(current + 1), interval);
  };

  const stop = () => {
    if (!timer) return;
    window.clearInterval(timer);
    timer = null;
  };

  const restart = () => {
    stop();
    start();
  };

  dots[current]?.classList.add("is-active");

  prev?.addEventListener("click", () => {
    show(current - 1);
    restart();
  });

  next?.addEventListener("click", () => {
    show(current + 1);
    restart();
  });

  slider.addEventListener("mouseenter", stop);
  slider.addEventListener("mouseleave", start);
  slider.addEventListener("focusin", stop);
  slider.addEventListener("focusout", start);

  start();
})();
