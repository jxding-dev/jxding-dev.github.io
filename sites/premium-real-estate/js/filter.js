(() => {
  const form = document.querySelector("[data-filter]");
  const grid = document.querySelector(".property-grid");
  const cards = [...document.querySelectorAll("[data-property-card]")];
  const count = document.querySelector("[data-result-count]");
  const empty = document.querySelector("[data-empty-message]");
  const sort = document.querySelector("[data-sort]");

  if (!form || !grid || !cards.length) return;

  const getValues = () => Object.fromEntries(new FormData(form).entries());

  const matches = (card, values) => {
    const checks = ["location", "deal", "type", "size", "room", "option", "status"];
    const matchSelects = checks.every((key) => !values[key] || !card.dataset[key] || card.dataset[key] === values[key]);
    const matchPrice = !values.price || Number(card.dataset.price) <= Number(values.price);
    return matchSelects && matchPrice;
  };

  const sortCards = () => {
    const mode = sort?.value || "latest";
    const sorted = [...cards].sort((a, b) => {
      if (mode === "price-desc") return Number(b.dataset.price) - Number(a.dataset.price);
      if (mode === "price-asc") return Number(a.dataset.price) - Number(b.dataset.price);
      return Number(b.dataset.order) - Number(a.dataset.order);
    });

    sorted.forEach((card) => grid.appendChild(card));
  };

  const updateCount = (visibleCount) => {
    if (count) count.textContent = String(visibleCount);
    if (empty) empty.hidden = visibleCount !== 0;
  };

  const applyFilter = () => {
    const values = getValues();
    let visibleCount = 0;

    sortCards();

    cards.forEach((card) => {
      const visible = matches(card, values);
      card.hidden = !visible;
      if (visible) visibleCount += 1;
    });

    updateCount(visibleCount);
  };

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    applyFilter();
  });

  form.addEventListener("reset", () => {
    window.setTimeout(applyFilter, 0);
  });

  sort?.addEventListener("change", applyFilter);
  applyFilter();
})();
