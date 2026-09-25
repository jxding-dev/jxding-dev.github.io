document.addEventListener("DOMContentLoaded", () => {
  const root = document.querySelector("[data-messages]");
  if (!root) return;

  const messages = [
    { id: 1, type: "신규 예약 문의", name: "김하린", time: "10:12", read: false, text: "오늘 저녁에 네일 케어 예약 가능한 시간이 있을까요? 가능하면 18시 이후로 부탁드립니다." },
    { id: 2, type: "예약 변경 요청", name: "오민재", time: "10:35", read: false, text: "내일 PT 체험 세션을 30분 늦출 수 있을까요? 퇴근 시간이 조금 밀릴 것 같습니다." },
    { id: 3, type: "노쇼 안내", name: "한도윤", time: "11:04", read: true, text: "지난 예약에 방문하지 못해 죄송합니다. 재예약 가능 여부와 안내 문구를 확인하고 싶습니다." },
    { id: 4, type: "결제 문의", name: "박소율", time: "12:18", read: true, text: "두피 케어 패키지 결제 방식과 현장 결제 가능 여부가 궁금합니다." },
    { id: 5, type: "리뷰 요청", name: "정유찬", time: "13:20", read: false, text: "원데이 클래스 참여 후 리뷰 링크를 받을 수 있을까요? 사진도 함께 남기고 싶습니다." },
  ];
  const list = root.querySelector("[data-message-list]");
  const detail = root.querySelector("[data-message-detail]");
  const unreadCount = root.querySelector("[data-unread-count]");
  let selectedId = messages[0].id;

  function selectedMessage() {
    return messages.find((message) => message.id === selectedId) || messages[0];
  }

  function renderList() {
    if (!list) return;
    list.innerHTML = messages.map((message) => `
      <button class="message-row ${message.id === selectedId ? "active" : ""} ${message.read ? "read" : "unread"}" type="button" data-message-id="${message.id}">
        <span class="message-row-meta"><strong>${message.type}</strong><small>${message.time}</small></span>
        <span class="message-row-title">${message.name}</span>
        <span class="message-row-text">${message.text}</span>
      </button>
    `).join("");
    const unread = messages.filter((message) => !message.read).length;
    if (unreadCount) unreadCount.textContent = `${unread} unread`;
  }

  function renderDetail() {
    const message = selectedMessage();
    if (!detail || !message) return;
    detail.innerHTML = `
      <div class="panel-header">
        <div><small>${message.type}</small><h2>${message.name}</h2></div>
        <span class="badge ${message.read ? "completed" : "pending"}">${message.read ? "읽음" : "안읽음"}</span>
      </div>
      <div class="message-body">${message.text}</div>
      <label class="reply-box" for="replyText"><strong>답장</strong><textarea class="textarea" id="replyText" name="replyText" data-reply-text placeholder="답장 내용을 입력하세요."></textarea></label>
      <div class="row-actions"><button class="button" type="button" data-send-reply>답장 보내기</button><button class="button secondary" type="button" data-mark-read>${message.read ? "안읽음 처리" : "읽음 처리"}</button></div>
    `;
  }

  root.addEventListener("click", (event) => {
    const row = event.target.closest("[data-message-id]");
    const markRead = event.target.closest("[data-mark-read]");
    const sendReply = event.target.closest("[data-send-reply]");
    const template = event.target.closest("[data-template]");
    if (row) {
      selectedId = Number(row.dataset.messageId);
      const message = selectedMessage();
      if (message) message.read = true;
      renderList();
      renderDetail();
      window.ReserveFlowToast?.show("메시지를 열었습니다.");
    }
    if (markRead) {
      const message = selectedMessage();
      if (!message) return;
      message.read = !message.read;
      renderList();
      renderDetail();
      window.ReserveFlowToast?.show(message.read ? "읽음으로 변경했습니다." : "안읽음으로 변경했습니다.");
    }
    if (sendReply) {
      window.ReserveFlowToast?.show("답장 내용이 준비됐습니다.");
    }
    if (template) {
      const textarea = root.querySelector("[data-reply-text]");
      if (textarea) {
        textarea.value = template.dataset.template || "";
        textarea.focus();
        window.ReserveFlowToast?.show("답장 문구를 넣었습니다.");
      }
    }
  });

  renderList();
  renderDetail();
});
