document.addEventListener("DOMContentLoaded", () => {
  const opsData = {
    status: "정상 운영",
    peak: "14:00 ~ 17:00",
    noShow: "2명",
    openSlots: "11:30, 16:00",
    revenue: "428,000원",
    task: "대기 예약 3건을 확인하세요.",
  };

  const opsRoot = document.querySelector("[data-ops-mode]");
  if (opsRoot) {
    const bindings = {
      "[data-ops-status]": opsData.status,
      "[data-ops-peak]": opsData.peak,
      "[data-ops-noshow]": opsData.noShow,
      "[data-ops-open]": opsData.openSlots,
      "[data-ops-revenue]": opsData.revenue,
      "[data-ops-task]": opsData.task,
    };
    Object.entries(bindings).forEach(([selector, value]) => {
      const node = opsRoot.querySelector(selector);
      if (node) node.textContent = value;
    });
  }

  document.querySelectorAll("[data-quick-action]").forEach((button) => {
    button.addEventListener("click", () => {
      const message = button.dataset.quickAction;
      if (window.ReserveFlowToast) window.ReserveFlowToast.show(`${message} 작업을 준비했습니다.`);
    });
  });

  document.querySelectorAll("[data-status-cycle]").forEach((button) => {
    button.addEventListener("click", () => {
      const statuses = ["confirmed", "completed", "pending"];
      const labels = { confirmed: "확정", completed: "완료", pending: "대기" };
      const current = button.dataset.status || "confirmed";
      const next = statuses[(statuses.indexOf(current) + 1) % statuses.length];
      button.dataset.status = next;
      button.textContent = labels[next];
      if (typeof button.animate === "function") {
        button.animate([{ transform: "translateY(-1px)" }, { transform: "translateY(0)" }], { duration: 160, easing: "ease" });
      }
      if (window.ReserveFlowToast) window.ReserveFlowToast.show(`상태가 ${labels[next]}으로 변경되었습니다.`);
    });
  });

  const revealItems = document.querySelectorAll(".page-header, .summary-grid > *, .panel");
  revealItems.forEach((item) => item.classList.add("reveal"));
  if (!("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("is-visible");
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });
  revealItems.forEach((item) => observer.observe(item));
});
