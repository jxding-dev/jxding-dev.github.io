const modalApi = {
  open(selector) {
    const modal = document.querySelector(selector);
    if (!modal) return;
    modal.setAttribute("aria-modal", "true");
    if (typeof modal.showModal === "function") {
      modal.showModal();
      return;
    }
    modal.setAttribute("open", "");
  },
  close(modal) {
    if (!modal) return;
    modal.removeAttribute("aria-modal");
    if (typeof modal.close === "function") {
      modal.close();
      return;
    }
    modal.removeAttribute("open");
  },
};

window.ReserveFlowModal = modalApi;

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll("[data-modal-open]").forEach((button) => {
    if (button.dataset.modalReady) return;
    button.dataset.modalReady = "true";
    button.addEventListener("click", () => modalApi.open(button.dataset.modalOpen));
  });

  document.querySelectorAll("[data-modal-close]").forEach((button) => {
    if (button.dataset.modalCloseReady) return;
    button.dataset.modalCloseReady = "true";
    button.addEventListener("click", () => modalApi.close(button.closest("dialog")));
  });

  document.querySelectorAll("dialog.modal").forEach((modal) => {
    if (modal.dataset.overlayReady) return;
    modal.dataset.overlayReady = "true";
    modal.addEventListener("click", (event) => {
      if (event.target === modal) modalApi.close(modal);
    });
  });
});
