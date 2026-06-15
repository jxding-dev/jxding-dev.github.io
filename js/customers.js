document.addEventListener("DOMContentLoaded", () => {
  const customerRoot = document.querySelector("[data-customers]");
  if (!customerRoot) return;

  const customers = [
    { id: 1, name: "김하린", phone: "010-4832-1190", recent: "2026.06.16", visits: 12, service: "젤 네일 케어", tags: ["VIP", "재방문"], memo: "밝은 톤 선호. 예약 전날 오전 알림 선호.", history: ["06.16 젤 네일 케어", "05.20 손톱 보강"] },
    { id: 2, name: "오민재", phone: "010-9021-7742", recent: "2026.06.16", visits: 1, service: "PT 체험 세션", tags: ["첫방문"], memo: "무릎 부담이 있어 하체 운동 강도 조절 필요.", history: ["06.16 PT 체험 세션"] },
    { id: 3, name: "박소율", phone: "010-7713-2048", recent: "2026.06.12", visits: 8, service: "두피 케어", tags: ["재방문"], memo: "퇴근 후 시간대 선호.", history: ["06.12 두피 케어", "05.28 헤어 클리닉"] },
    { id: 4, name: "한도윤", phone: "010-3355-1802", recent: "2026.05.30", visits: 3, service: "퍼스널 컬러 상담", tags: ["노쇼주의"], memo: "일정 변경이 잦아 당일 확인 필요.", history: ["05.30 상담"] },
  ];
  const list = customerRoot.querySelector("[data-customer-list]");
  const search = customerRoot.querySelector("[data-customer-search]");
  const profile = customerRoot.querySelector("[data-customer-profile]");
  let activeId = 1;

  function memoKey(id) {
    return `reserveflow_customerMemo_${id}`;
  }

  function readMemo(customer) {
    try {
      return localStorage.getItem(memoKey(customer.id)) || customer.memo;
    } catch {
      return customer.memo;
    }
  }

  function saveMemo(id, value) {
    try {
      localStorage.setItem(memoKey(id), value);
      window.ReserveFlowToast?.show("고객 메모를 저장했습니다.");
    } catch {
      window.ReserveFlowToast?.show("브라우저 저장소를 사용할 수 없습니다.", "warning");
    }
  }

  function tagClass(tag) {
    if (tag === "VIP") return "vip";
    if (tag === "첫방문") return "new";
    if (tag === "노쇼주의") return "warning";
    return "completed";
  }

  function renderList() {
    if (!list) return;
    const query = (search?.value || "").trim().toLowerCase();
    const filtered = customers.filter((item) => `${item.name} ${item.phone} ${item.service} ${item.tags.join(" ")}`.toLowerCase().includes(query));
    list.innerHTML = filtered.map((item) => `<button class="customer-item ${item.id === activeId ? "active" : ""}" type="button" data-customer-id="${item.id}"><span>${item.tags.map((tag) => `<b class="badge ${tagClass(tag)}">${tag}</b>`).join(" ")}</span><strong>${item.name}</strong><small>${item.phone} · ${item.service}</small></button>`).join("");
  }

  function renderProfile() {
    const customer = customers.find((item) => item.id === activeId) || customers[0];
    if (!profile || !customer) return;
    const memo = readMemo(customer);
    profile.innerHTML = `<div class="panel-header"><div><small>고객 프로필</small><h2>${customer.name}</h2></div><span class="badge ${tagClass(customer.tags[0])}">${customer.tags[0]}</span></div><div class="profile-meta"><div><small>연락처</small><strong>${customer.phone}</strong></div><div><small>최근 방문</small><strong>${customer.recent}</strong></div><div><small>누적 방문</small><strong>${customer.visits}회</strong></div><div><small>선호 서비스</small><strong>${customer.service}</strong></div></div><label class="profile-memo" for="customerMemo"><strong>고객 메모</strong><textarea class="textarea" id="customerMemo" name="customerMemo" data-memo>${memo}</textarea></label><button class="button" type="button" data-save-memo>메모 저장</button><h3 class="profile-subtitle">방문 기록</h3><ul class="visit-list">${customer.history.map((item) => `<li class="memo-card">${item}</li>`).join("")}</ul>`;
  }

  customerRoot.addEventListener("click", (event) => {
    const item = event.target.closest("[data-customer-id]");
    const save = event.target.closest("[data-save-memo]");
    if (item) {
      activeId = Number(item.dataset.customerId);
      renderList();
      renderProfile();
    }
    if (save) {
      const memo = profile?.querySelector("[data-memo]");
      saveMemo(activeId, memo?.value || "");
    }
  });

  search?.addEventListener("input", renderList);
  renderList();
  renderProfile();
});
