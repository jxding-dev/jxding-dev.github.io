document.addEventListener("DOMContentLoaded", () => {
  const path = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll("[data-nav]").forEach((link) => {
    const href = link.getAttribute("href");
    if (href !== path) return;
    link.classList.add("active");
    link.setAttribute("aria-current", "page");
  });
});
