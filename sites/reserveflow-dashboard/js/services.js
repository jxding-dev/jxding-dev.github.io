document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector("[data-services]");
  if (!root) return;

  const storageKey = "reserveflow_services";
  const defaultServices = [
    { id: 1, category: "beauty", name: "헤어컷", duration: "45분", price: "35,000원", status: "active", description: "기본 커트와 스타일 마무리를 포함합니다." },
    { id: 2, category: "beauty", name: "염색", duration: "120분", price: "120,000원", status: "active", description: "상담 후 컬러와 모발 상태에 맞춰 진행합니다." },
    { id: 3, category: "beauty", name: "네일 케어", duration: "70분", price: "68,000원", status: "active", description: "젤 제거, 케어, 컬러링을 선택할 수 있습니다." },
    { id: 4, category: "fitness", name: "PT 1회권", duration: "50분", price: "50,000원", status: "active", description: "체형과 목표에 맞춘 1:1 트레이닝입니다." },
    { id: 5, category: "class", name: "원데이 클래스", duration: "120분", price: "90,000원", status: "active", description: "소규모로 진행되는 체험형 클래스입니다." },
    { id: 6, category: "consult", name: "상담 예약", duration: "40분", price: "30,000원", status: "paused", description: "방문 전 요구사항과 진행 방향을 정리합니다." },
  ];
  const categoryLabels = { beauty: "뷰티", fitness: "운동", class: "클래스", consult: "상담" };
  const statusLabels = { active: "예약 가능", paused: "숨김" };
  const cards = root.querySelector("[data-service-cards]");
  const table = root.querySelector("[data-service-table]");
  const empty = root.querySelector("[data-service-empty]");
  const form = document.querySelector("[data-service-form]");
  const modalTitle = document.querySelector("#serviceModalTitle");
  const addButton = root.querySelector("[data-service-add]");
  const filterButtons = root.querySelectorAll("[data-service-filter]");
  let activeFilter = "all";
  let services = readServices();

  function readServices() {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "null") || defaultServices;
    } catch {
      return defaultServices;
    }
  }

  function saveServices() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(services));
    } catch {
      window.ReserveFlowToast?.show("브라우저 저장소를 사용할 수 없습니다.", "warning");
    }
  }

  function getVisibleServices() {
    return services.filter((service) => activeFilter === "all" || service.category === activeFilter);
  }

  function statusBadge(service) {
    return service.status === "active"
      ? '<span class="badge confirmed">예약 가능</span>'
      : '<span class="badge pending">숨김</span>';
  }

  function render() {
    const visible = getVisibleServices();
    if (cards) {
      cards.innerHTML = visible.map((service) => `
        <article class="service-card">
          <div class="service-card-top"><span class="badge new">${categoryLabels[service.category]}</span>${statusBadge(service)}</div>
          <h2>${service.name}</h2>
          <div class="service-meta"><strong>${service.duration}</strong><strong>${service.price}</strong></div>
          <p>${service.description}</p>
          <button class="button secondary" type="button" data-service-edit="${service.id}">수정</button>
        </article>
      `).join("");
    }
    if (table) {
      table.innerHTML = visible.map((service) => `
        <tr>
          <td data-label="서비스명">${service.name}</td>
          <td data-label="카테고리">${categoryLabels[service.category]}</td>
          <td data-label="소요시간">${service.duration}</td>
          <td data-label="가격">${service.price}</td>
          <td data-label="상태">${statusBadge(service)}</td>
          <td data-label="관리"><button class="status-button" type="button" data-service-edit="${service.id}">수정</button></td>
        </tr>
      `).join("");
    }
    if (empty) empty.classList.toggle("show", visible.length === 0);
  }

  function fillForm(service) {
    if (!form) return;
    form.elements.id.value = service?.id || "";
    form.elements.name.value = service?.name || "";
    form.elements.category.value = service?.category || "beauty";
    form.elements.duration.value = service?.duration || "";
    form.elements.price.value = service?.price || "";
    form.elements.status.value = service?.status || "active";
    form.elements.description.value = service?.description || "";
    if (modalTitle) modalTitle.textContent = service ? "서비스 수정" : "서비스 추가";
  }

  addButton?.addEventListener("click", () => {
    fillForm(null);
    window.ReserveFlowModal?.open("#serviceModal");
  });

  root.addEventListener("click", (event) => {
    const editButton = event.target.closest("[data-service-edit]");
    if (!editButton) return;
    const service = services.find((item) => item.id === Number(editButton.dataset.serviceEdit));
    if (!service) return;
    fillForm(service);
    window.ReserveFlowModal?.open("#serviceModal");
  });

  filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
      filterButtons.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      activeFilter = button.dataset.serviceFilter || "all";
      render();
    });
  });

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form).entries());
    const id = Number(data.id);
    if (id) {
      services = services.map((service) => service.id === id ? { ...service, ...data, id } : service);
    } else {
      services = [{ ...data, id: Date.now() }, ...services];
    }
    saveServices();
    render();
    window.ReserveFlowModal?.close(form.closest("dialog"));
    window.ReserveFlowToast?.show(id ? "서비스를 수정했습니다." : "서비스를 추가했습니다.");
  });

  render();
});
