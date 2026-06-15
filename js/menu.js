(() => {
  const button = document.querySelector("[data-menu-button]");
  const nav = document.querySelector("[data-nav]");

  if (!button || !nav) return;

  const setMenu = (isOpen) => {
    nav.classList.toggle("is-open", isOpen);
    document.body.classList.toggle("is-menu-open", isOpen);
    button.setAttribute("aria-expanded", String(isOpen));
  };

  button.addEventListener("click", () => {
    setMenu(!nav.classList.contains("is-open"));
  });

  nav.addEventListener("click", (event) => {
    if (event.target.closest("a")) setMenu(false);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });
})();
