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
