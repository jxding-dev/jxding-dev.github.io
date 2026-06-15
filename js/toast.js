window.ReserveFlowToast = {
  show(message, type = "success") {
    if (!message || !document.body) return;
    document.querySelectorAll(".toast").forEach((item) => item.remove());
    const toast = document.createElement("div");
    toast.className = `toast ${type}`;
    toast.setAttribute("role", "status");
    toast.setAttribute("aria-live", "polite");
    toast.textContent = message;
    document.body.appendChild(toast);
    window.setTimeout(() => toast.remove(), 2200);
  },
};
