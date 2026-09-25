document.addEventListener("DOMContentLoaded", () => {
  const reservationRoot = document.querySelector("[data-reservations]");
  if (!reservationRoot) return;

  const fallback = [
    { id: 1, date: "06.16 10:30", name: "김하린", phone: "010-4832-1190", service: "젤 네일 케어", staff: "원장", status: "confirmed", price: "68,000원", memo: "재방문 고객" },
    { id: 2, date: "06.16 12:00", name: "오민재", phone: "010-9021-7742", service: "PT 체험 세션", staff: "민서", status: "payment", price: "50,000원", memo: "결제 대기" },
    { id: 3, date: "06.16 14:20", name: "박소율", phone: "010-7713-2048", service: "두피 케어", staff: "지후", status: "completed", price: "89,000원", memo: "메모 있음" },
    { id: 4, date: "06.17 16:10", name: "한도윤", phone: "010-3355-1802", service: "퍼스널 컬러 상담", staff: "원장", status: "noshow", price: "120,000원", memo: "노쇼주의" },
    { id: 5, date: "06.17 18:30", name: "정유찬", phone: "010-8841-5530", service: "도자기 원데이 클래스", staff: "하린", status: "canceled", price: "90,000원", memo: "취소" },
  ];
  const storageKey = "reserveflow_reservations";
  const statusLabel = { all: "전체", confirmed: "예약확정", pending: "대기중", completed: "방문완료", canceled: "취소", noshow: "노쇼주의", payment: "결제대기" };
  const tbody = reservationRoot.querySelector("[data-reservation-body]");
  const empty = reservationRoot.querySelector("[data-empty]");
  const search = reservationRoot.querySelector("[data-search]");
  const dateFilter = reservationRoot.querySelector("[data-date-filter]");
  const serviceSelect = reservationRoot.querySelector("[data-service-select]");
  const filters = reservationRoot.querySelectorAll("[data-filter]");
  const filterToggle = reservationRoot.querySelector("[data-filter-toggle]");
  const filterContent = reservationRoot.querySelector("[data-filter-content]");
  const modalBody = document.querySelector("[data-reservation-detail]");
  let activeFilter = "all";
  let rows = readRows();

  function readRows() {
    try {
      return JSON.parse(localStorage.getItem(storageKey) || "null") || fallback;
    } catch {
      return fallback;
    }
  }

  function save() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(rows));
    } catch {
      window.ReserveFlowToast?.show("브라우저 저장소를 사용할 수 없습니다.", "warning");
    }
  }

  function filteredRows() {
    const query = (search?.value || "").trim().toLowerCase();
    const dateValue = dateFilter?.value ? dateFilter.value.slice(5).replace("-", ".") : "";
    const serviceValue = serviceSelect?.value || "all";
    return rows.filter((row) => {
      const matchesStatus = activeFilter === "all" || row.status === activeFilter;
      const matchesDate = !dateValue || row.date.startsWith(dateValue);
      const matchesService = serviceValue === "all" || row.service === serviceValue;
      const matchesQuery = `${row.name} ${row.phone} ${row.service}`.toLowerCase().includes(query);
      return matchesStatus && matchesDate && matchesService && matchesQuery;
    });
  }

  function render() {
    if (!tbody) return;
    const list = filteredRows();
    tbody.innerHTML = list.map((row) => `<tr class="status-row status-${row.status}"><td data-label="예약일시">${row.date}</td><td data-label="고객명"><strong>${row.name}</strong><small class="row-note">${row.memo || "방문 예정"}</small></td><td data-label="연락처">${row.phone}</td><td data-label="서비스">${row.service}</td><td data-label="담당자">${row.staff}</td><td data-label="상태"><span class="badge ${row.status}">${statusLabel[row.status]}</span></td><td data-label="금액">${row.price}</td><td data-label="관리"><div class="row-actions"><button class="status-button" type="button" data-change="${row.id}">상태 변경</button><button class="status-button" type="button" data-view="${row.id}">상세</button></div></td></tr>`).join("");
    if (empty) empty.classList.toggle("show", list.length === 0);
  }

  reservationRoot.addEventListener("click", (event) => {
    const changeButton = event.target.closest("[data-change]");
    const viewButton = event.target.closest("[data-view]");
    if (changeButton) {
      const row = rows.find((item) => item.id === Number(changeButton.dataset.change));
      if (!row) return;
      const order = ["confirmed", "pending", "payment", "completed", "noshow", "canceled"];
      row.status = order[(order.indexOf(row.status) + 1) % order.length];
      save();
      render();
      window.ReserveFlowToast?.show(`예약 상태가 ${statusLabel[row.status]}로 변경되었습니다.`);
    }
    if (viewButton && modalBody) {
      const row = rows.find((item) => item.id === Number(viewButton.dataset.view));
      if (!row) return;
      modalBody.innerHTML = `<div class="reservation-detail-grid"><div><small>고객</small><strong>${row.name}</strong></div><div><small>예약일시</small><strong>${row.date}</strong></div><div><small>서비스</small><strong>${row.service}</strong></div><div><small>담당자</small><strong>${row.staff}</strong></div><div><small>연락처</small><strong>${row.phone}</strong></div><div><small>금액</small><strong>${row.price}</strong></div></div>`;
      window.ReserveFlowModal?.open("#reservationModal");
    }
  });

  filters.forEach((button) => {
    button.addEventListener("click", () => {
      filters.forEach((item) => item.classList.remove("active"));
      button.classList.add("active");
      activeFilter = button.dataset.filter || "all";
      render();
    });
  });

  search?.addEventListener("input", render);
  dateFilter?.addEventListener("change", render);
  serviceSelect?.addEventListener("change", render);
  if (filterToggle && filterContent) {
    filterToggle.addEventListener("click", () => {
      const expanded = filterToggle.getAttribute("aria-expanded") === "true";
      filterToggle.setAttribute("aria-expanded", String(!expanded));
      filterToggle.textContent = expanded ? "필터 열기" : "필터 닫기";
      filterContent.classList.toggle("is-open", !expanded);
    });
  }
  render();
});
