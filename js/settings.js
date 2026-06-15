document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector("[data-settings]");
  const form = document.querySelector("[data-settings-form]");
  if (!root || !form) return;

  const storageKey = "reserveflow_settings";
  const saved = readSettings();

  function readSettings() {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "null");
    } catch {
      return null;
    }
  }

  function saveSettings(data) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(data));
      window.ReserveFlowToast?.show("설정을 저장했습니다.");
    } catch {
      window.ReserveFlowToast?.show("브라우저 저장소를 사용할 수 없습니다.", "warning");
    }
  }

  if (saved) {
    Object.entries(saved).forEach(([key, value]) => {
      const field = form.elements[key];
      if (field) field.value = value;
    });
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const required = Array.from(form.querySelectorAll("[required]"));
    const invalid = required.find((field) => !field.value.trim());
    if (invalid) {
      invalid.focus();
      window.ReserveFlowToast?.show("필수 항목을 입력해 주세요.", "warning");
      return;
    }
    const data = Object.fromEntries(new FormData(form).entries());
    saveSettings(data);
  });

  root.querySelector("[data-reset-settings]")?.addEventListener("click", () => {
    try {
      localStorage.removeItem(storageKey);
    } catch {
      window.ReserveFlowToast?.show("브라우저 저장소를 사용할 수 없습니다.", "warning");
      return;
    }
    form.reset();
    window.ReserveFlowToast?.show("데모 설정을 초기화했습니다.");
  });
});
