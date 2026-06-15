document.addEventListener("DOMContentLoaded", () => {
  const calendarRoot = document.querySelector("[data-calendar]");
  if (!calendarRoot) return;

  const reservations = [
    { day: "화", time: "10:00", name: "김하린", service: "젤 네일 케어", status: "confirmed", note: "재방문 고객" },
    { day: "화", time: "14:00", name: "박소율", service: "두피 케어", status: "completed" },
    { day: "수", time: "12:00", name: "오민재", service: "PT 체험 세션", status: "payment", note: "결제 대기" },
    { day: "금", time: "18:00", name: "정유찬", service: "도자기 원데이 클래스", status: "confirmed" },
    { day: "토", time: "16:00", name: "한도윤", service: "퍼스널 컬러 상담", status: "noshow", note: "노쇼주의" },
  ];
  const days = ["월", "화", "수", "목", "금", "토", "일"];
  const times = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00", "19:00", "20:00", "21:00"];
  const statusLabel = { confirmed: "예약확정", pending: "대기중", completed: "방문완료", canceled: "취소", noshow: "노쇼주의", payment: "결제대기" };
  const schedule = calendarRoot.querySelector("[data-week-schedule]");
  const detail = document.querySelector("[data-calendar-detail]");
  const mobileList = calendarRoot.querySelector("[data-mobile-reservations]");
  const dayTabs = calendarRoot.querySelectorAll("[data-day-tab]");

  function updateDetail(item) {
    if (!detail || !item) return;
    detail.innerHTML = `<div class="panel-header"><div><small>예약 상세</small><h2>${item.name}</h2></div><span class="badge ${item.status}">${statusLabel[item.status]}</span></div><p>${item.time} · ${item.service}</p><p class="muted">${item.note || "담당자 배정과 고객 메모를 확인하세요."}</p>`;
  }

  function createBlock(item) {
    const button = document.createElement("button");
    button.className = `reservation-block ${item.status}`;
    button.type = "button";
    button.innerHTML = `<strong>${item.name}</strong><span>${statusLabel[item.status]} · ${item.service}</span>`;
    button.addEventListener("click", () => updateDetail(item));
    return button;
  }

  function renderWeek() {
    if (!schedule) return;
    schedule.innerHTML = `<div class="time-head"></div>${days.map((day) => `<div class="day-head">${day}</div>`).join("")}`;
    times.forEach((time) => {
      const timeCell = document.createElement("div");
      timeCell.className = "time-slot";
      timeCell.textContent = time;
      schedule.appendChild(timeCell);
      days.forEach((day) => {
        const slot = document.createElement("div");
        slot.className = "day-slot";
        reservations.filter((item) => item.day === day && item.time === time).forEach((item) => slot.appendChild(createBlock(item)));
        schedule.appendChild(slot);
      });
    });
  }

  function renderMobile(day = "화") {
    if (!mobileList) return;
    const items = reservations.filter((item) => item.day === day);
    mobileList.innerHTML = items.map((item, index) => `<button class="reservation-block ${item.status}" type="button" data-mobile-index="${index}"><strong>${statusLabel[item.status]} · ${item.time} ${item.name}</strong><span>${item.service}</span></button>`).join("") || `<div class="empty-state show">선택한 날짜의 예약이 없습니다.</div>`;
    mobileList.querySelectorAll("[data-mobile-index]").forEach((button) => {
      button.addEventListener("click", () => updateDetail(items[Number(button.dataset.mobileIndex)]));
    });
  }

  dayTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      dayTabs.forEach((item) => item.classList.remove("active"));
      tab.classList.add("active");
      renderMobile(tab.dataset.dayTab);
    });
  });

  renderWeek();
  renderMobile();
  updateDetail(reservations[0]);
});
