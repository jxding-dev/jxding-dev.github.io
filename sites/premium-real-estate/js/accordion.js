(() => {
  const accordions = [...document.querySelectorAll("[data-accordion]")];
  if (!accordions.length) return;

  const closeItem = (item) => {
    const button = item.querySelector("[data-accordion-button]");
    const panel = item.querySelector(".accordion-panel");
    item.classList.remove("is-open");
    button?.setAttribute("aria-expanded", "false");
    if (panel) panel.style.maxHeight = "0px";
  };

  const openItem = (item) => {
    const button = item.querySelector("[data-accordion-button]");
    const panel = item.querySelector(".accordion-panel");
    item.classList.add("is-open");
    button?.setAttribute("aria-expanded", "true");
    if (panel) panel.style.maxHeight = `${panel.scrollHeight}px`;
  };

  accordions.forEach((accordion) => {
    const items = [...accordion.querySelectorAll("[data-accordion-item]")];
    if (!items.length) return;

    items.forEach((item) => {
      if (item.classList.contains("is-open")) openItem(item);
      else closeItem(item);
    });

    accordion.addEventListener("click", (event) => {
      const button = event.target.closest("[data-accordion-button]");
      if (!button) return;

      const item = button.closest("[data-accordion-item]");
      if (!item) return;

      const willOpen = !item.classList.contains("is-open");
      items.forEach(closeItem);
      if (willOpen) openItem(item);
    });
  });
})();
