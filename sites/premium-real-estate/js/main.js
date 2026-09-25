(() => {
  const fileName = location.pathname.split("/").pop() || "index.html";
  const pageMap = {
    "index.html": "index",
    "properties.html": "properties",
    "property-detail.html": "properties",
    "premium.html": "premium",
    "about.html": "about",
    "reservation.html": "reservation",
    "contact.html": "contact",
  };
  const current = pageMap[fileName];

  if (!current) return;

  document.querySelectorAll("[data-page]").forEach((link) => {
    link.classList.toggle("is-active", link.dataset.page === current);
  });
})();

(() => {
  const header = document.querySelector(".site-header");
  if (!header) return;

  const syncHeader = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 12);
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    document.documentElement.style.setProperty("--scroll-progress", `${Math.min(progress, 100)}%`);
  };

  syncHeader();
  window.addEventListener("scroll", syncHeader, { passive: true });
})();

(() => {
  document.querySelectorAll(".hero-keyword-search").forEach((search) => {
    const input = search.querySelector("input");
    const button = search.querySelector("button");
    if (!input || !button) return;

    const go = () => {
      const keyword = input.value.trim();
      const suffix = keyword ? `?q=${encodeURIComponent(keyword)}` : "";
      location.href = `properties.html${suffix}`;
    };

    button.addEventListener("click", go);
    input.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        go();
      }
    });
  });
})();

(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const counters = [...document.querySelectorAll("[data-count-to]")];
  if (!counters.length) return;

  const animate = (element) => {
    const target = Number(element.dataset.countTo);
    if (!Number.isFinite(target)) return;
    if (reduceMotion) {
      element.textContent = String(target);
      return;
    }

    const duration = 1100;
    const start = performance.now();
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      element.textContent = String(Math.round(target * eased));
      if (progress < 1) requestAnimationFrame(tick);
    };

    element.textContent = "0";
    requestAnimationFrame(tick);
  };

  const observer = "IntersectionObserver" in window
    ? new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          animate(entry.target);
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.5 })
    : null;

  counters.forEach((counter) => {
    if (observer) observer.observe(counter);
    else animate(counter);
  });
})();

(() => {
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (reduceMotion || matchMedia("(pointer: coarse)").matches) return;

  const cards = [...document.querySelectorAll(".property-card, .category-card, .collection-card, .premium-category")];
  cards.forEach((card) => {
    card.addEventListener("mousemove", (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.setProperty("--tilt-y", `${x * 5}deg`);
      card.style.setProperty("--tilt-x", `${y * -5}deg`);
    });

    card.addEventListener("mouseleave", () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    });
  });
})();

(() => {
  const gallery = document.querySelector("[data-gallery]");
  if (!gallery) return;

  const mainImage = gallery.querySelector("[data-gallery-main]");
  const thumbs = [...gallery.querySelectorAll("[data-gallery-thumb]")];
  if (!mainImage || !thumbs.length) return;

  const activateThumb = (thumb) => {
    const src = thumb.dataset.src;
    if (!src) return;

    mainImage.src = src;
    mainImage.alt = thumb.dataset.alt || "";
    thumbs.forEach((item) => {
      item.classList.remove("is-active");
      item.setAttribute("aria-current", "false");
    });
    thumb.classList.add("is-active");
    thumb.setAttribute("aria-current", "true");
  };

  thumbs.forEach((thumb) => {
    thumb.addEventListener("click", () => activateThumb(thumb));
  });
})();

(() => {
  document.querySelectorAll(".deal-tabs").forEach((group) => {
    const buttons = [...group.querySelectorAll("button")];
    buttons.forEach((button) => {
      button.addEventListener("click", () => {
        buttons.forEach((item) => item.classList.toggle("is-active", item === button));
      });
    });
  });
})();

(() => {
  const form = document.querySelector("[data-reservation-form]");
  if (!form) return;

  const message = form.querySelector("[data-form-message]");
  const requiredFields = [...form.querySelectorAll("[required]")];
  if (!message) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const invalid = requiredFields.find((field) => {
      if (field.type === "checkbox") return !field.checked;
      return !field.value.trim();
    });

    if (invalid) {
      message.textContent = "필수 항목을 모두 입력해 주세요.";
      message.classList.add("is-error");
      invalid.focus();
      return;
    }

    message.textContent = "예약 문의가 접수되었습니다. 담당자가 확인 후 연락드리겠습니다.";
    message.classList.remove("is-error");
    form.reset();
  });
})();
