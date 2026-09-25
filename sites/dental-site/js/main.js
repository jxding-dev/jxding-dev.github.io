document.documentElement.classList.add("js-enabled");

const initHeader = () => {
  const siteHeader = document.querySelector("#siteHeader");
  const hamburgerButton = document.querySelector(".hamburger-button");
  const mobileMenu = document.querySelector("#mobileMenu");
  const mobileMenuLinks = document.querySelectorAll(".mobile-menu a");

  const closeMobileMenu = () => {
    if (!hamburgerButton || !mobileMenu) return;

    hamburgerButton.setAttribute("aria-expanded", "false");
    hamburgerButton.setAttribute("aria-label", "메뉴 열기");
    mobileMenu.classList.remove("is-open");
  };

  const updateHeaderShadow = () => {
    if (!siteHeader) return;
    siteHeader.classList.toggle("is-scrolled", window.scrollY > 0);
  };

  if (hamburgerButton && mobileMenu) {
    hamburgerButton.addEventListener("click", () => {
      const isOpen = mobileMenu.classList.toggle("is-open");

      hamburgerButton.setAttribute("aria-expanded", String(isOpen));
      hamburgerButton.setAttribute("aria-label", isOpen ? "메뉴 닫기" : "메뉴 열기");
    });

    mobileMenuLinks.forEach((link) => {
      link.addEventListener("click", closeMobileMenu);
    });
  }

  window.addEventListener("scroll", updateHeaderShadow, { passive: true });
  window.addEventListener("resize", () => {
    if (window.innerWidth > 768) {
      closeMobileMenu();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu();
    }
  });

  updateHeaderShadow();
};

const initReveal = () => {
  const revealElements = document.querySelectorAll(".reveal");
  if (!revealElements.length) return;

  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    revealElements.forEach((element) => {
      element.classList.add("is-visible");
    });
    return;
  }

  const observer = new IntersectionObserver(
    (entries, revealObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      });
    },
    {
      threshold: 0.16,
      rootMargin: "0px 0px -8% 0px",
    }
  );

  revealElements.forEach((element) => {
    observer.observe(element);
  });
};

const initFaq = () => {
  const faqItems = document.querySelectorAll(".faq-item");
  if (!faqItems.length) return;

  const closeItem = (item) => {
    const button = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    const icon = item.querySelector(".faq-icon");
    if (!button || !answer || !icon) return;

    button.setAttribute("aria-expanded", "false");
    answer.hidden = true;
    icon.textContent = "+";
  };

  const openItem = (item) => {
    const button = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");
    const icon = item.querySelector(".faq-icon");
    if (!button || !answer || !icon) return;

    faqItems.forEach((otherItem) => {
      if (otherItem !== item) {
        closeItem(otherItem);
      }
    });

    button.setAttribute("aria-expanded", "true");
    answer.hidden = false;
    icon.textContent = "-";
  };

  faqItems.forEach((item) => {
    const button = item.querySelector(".faq-question");
    if (!button) return;

    button.addEventListener("click", () => {
      const isOpen = button.getAttribute("aria-expanded") === "true";

      if (isOpen) {
        closeItem(item);
      } else {
        openItem(item);
      }
    });
  });
};

const initReservationForms = () => {
  const reservationForms = document.querySelectorAll(".reservation-form");
  if (!reservationForms.length) return;

  reservationForms.forEach((form) => {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      if (!form.checkValidity()) {
        form.reportValidity();
        return;
      }

      const message = form.querySelector(".form-message");
      if (message) {
        message.textContent = "상담 요청이 접수되었습니다. 확인 후 연락드리겠습니다.";
      }

      form.reset();
    });
  });
};

document.addEventListener("DOMContentLoaded", () => {
  initHeader();
  initReveal();
  initFaq();
  initReservationForms();
});
