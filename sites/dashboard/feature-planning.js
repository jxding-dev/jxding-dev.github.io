// ==========================================
// 5. PLANNING FEATURES
// ==========================================

// -- Dashboard --
function renderDashboard() {
  let totalItems = 0, doneItems = 0;
  state.checklist.groups.forEach(g => { totalItems += g.items.length; doneItems += g.items.filter(i => i.done).length; });
  const pct = totalItems ? Math.round((doneItems / totalItems) * 100) : 0;
  const net = calcNetRevenue();

  if (el('dash-check-count')) el('dash-check-count').textContent = doneItems;
  if (el('dash-check-total')) el('dash-check-total').textContent = totalItems;
  if (el('dash-check-progress')) el('dash-check-progress').style.width = pct + '%';
  if (el('dash-revenue')) el('dash-revenue').textContent = Math.round(net / 10000);
  if (el('sidebar-goal')) el('sidebar-goal').textContent = Math.round(net / 10000) + '만';
  if (el('dash-roadmap-months')) el('dash-roadmap-months').textContent = state.roadmap.months.length;
  if (el('dash-prompt-count')) el('dash-prompt-count').textContent = state.prompts.length;
  if (el('dashboard-note')) el('dashboard-note').value = state.notes.dashboard || '';
  renderDashboardProcess();
}

function saveDashboardNote() { 
  state.notes.dashboard = safeStr(el('dashboard-note').value, MEMO_MAX); 
  saveState(); 
  showToast('메모 저장됨'); 
}

function initDragAndDrop() {
  const grid = el('dashboard-stat-grid'); if (!grid) return;
  let dragSrc = null;
  grid.querySelectorAll('.stat-card').forEach(card => {
    card.setAttribute('draggable', 'true');
    card.addEventListener('dragstart', function (e) { dragSrc = this; this.classList.add('dragging'); e.dataTransfer.setData('text/plain', this.id); });
    card.addEventListener('dragend', function () { this.classList.remove('dragging'); grid.querySelectorAll('.stat-card').forEach(c => c.classList.remove('drag-over')); state.dashboardCardOrder = [...grid.querySelectorAll('.stat-card')].map(c => c.id); saveState(); });
    card.addEventListener('dragover', function (e) { e.preventDefault(); if (this !== dragSrc) { grid.querySelectorAll('.stat-card').forEach(c => c.classList.remove('drag-over')); this.classList.add('drag-over'); } });
    card.addEventListener('dragleave', function () { this.classList.remove('drag-over'); });
    card.addEventListener('drop', function (e) { e.preventDefault(); if (this !== dragSrc) { const cards = [...grid.querySelectorAll('.stat-card')]; const srcIdx = cards.indexOf(dragSrc) < cards.indexOf(this) ? this.nextSibling : this; grid.insertBefore(dragSrc, srcIdx); } this.classList.remove('drag-over'); });
  });
}

function restoreCardOrder() {
  const grid = el('dashboard-stat-grid'); if (!grid || !state.dashboardCardOrder) return;
  state.dashboardCardOrder.forEach(id => { const card = el(id); if (card) grid.appendChild(card); });
}

// -- Checklist --
function renderChecklist() {
  const container = el('checklist-container');
  if (!container) return;

  let totalItems = 0;
  let doneItems = 0;

  state.checklist.groups.forEach(group => {
    totalItems += group.items.length;
    doneItems += group.items.filter(item => item.done).length;
  });

  const pct = totalItems ? Math.round((doneItems / totalItems) * 100) : 0;

  const pfill = el('cl-progress-fill');
  const ptxt = el('cl-progress-text');

  if (pfill) pfill.style.width = pct + '%';
  if (ptxt) ptxt.textContent = `${doneItems} / ${totalItems} 완료 (${pct}%)`;

  if (state.checklist.groups.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">✅</div>
        <p>체크리스트 그룹이 없습니다.</p>
        <p>위 "그룹 추가" 버튼을 눌러 시작하세요.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = '';

  state.checklist.groups.forEach(group => {
    const groupDiv = document.createElement('div');
    groupDiv.className = 'checklist-group';
    groupDiv.id = 'group-' + group.id;

    const header = document.createElement('div');
    header.className = 'checklist-group-header';

    const titleEl = document.createElement('div');
    titleEl.className = 'checklist-group-title';
    titleEl.textContent = group.name;

    const actions = document.createElement('div');
    actions.className = 'group-actions';

    const editBtn = document.createElement('button');
    editBtn.className = 'btn-icon';
    editBtn.title = '그룹명 수정';
    editBtn.setAttribute('aria-label', `"${group.name}" 그룹 이름 수정`);
    editBtn.textContent = '✏️';
    editBtn.addEventListener('click', () => editGroup(group.id));

    const delBtn = document.createElement('button');
    delBtn.className = 'btn-icon btn-danger';
    delBtn.title = '그룹 삭제';
    delBtn.setAttribute('aria-label', `"${group.name}" 그룹 삭제`);
    delBtn.textContent = '🗑';
    delBtn.addEventListener('click', () => deleteGroup(group.id));

    actions.appendChild(editBtn);
    actions.appendChild(delBtn);
    header.appendChild(titleEl);
    header.appendChild(actions);
    groupDiv.appendChild(header);

    if (group.items.length === 0) {
      const empty = document.createElement('div');
      empty.className = 'empty-state-small';
      empty.textContent = '항목이 없습니다. 아래에서 추가하세요.';
      groupDiv.appendChild(empty);
    }

    group.items.forEach(item => {
      const itemDiv = document.createElement('div');
      itemDiv.className = 'check-item' + (item.done ? ' done' : '');
      itemDiv.id = 'item-' + item.id;

      const chk = document.createElement('input');
      chk.type = 'checkbox';
      chk.className = 'check-input';
      chk.checked = item.done;
      chk.id = 'chk-' + item.id;
      chk.setAttribute('aria-label', item.label);
      chk.addEventListener('change', () => toggleCheck(group.id, item.id));

      const labelEl = document.createElement('label');
      labelEl.htmlFor = 'chk-' + item.id;
      labelEl.style.cssText = 'flex:1;min-width:0;cursor:pointer';

      const labelText = document.createElement('div');
      labelText.className = 'check-label';
      labelText.textContent = item.label;
      labelEl.appendChild(labelText);

      if (item.desc) {
        const desc = document.createElement('div');
        desc.className = 'check-desc';
        desc.textContent = item.desc;
        labelEl.appendChild(desc);
      }

      itemDiv.appendChild(chk);
      itemDiv.appendChild(labelEl);

      if (item.tag) {
        const tag = document.createElement('span');
        tag.className = 'check-tag tag-' + item.tag;
        tag.textContent = TAG_LABELS[item.tag] || item.tag;
        itemDiv.appendChild(tag);
      }

      const itemDel = document.createElement('button');
      itemDel.className = 'btn-icon btn-danger item-delete-btn';
      itemDel.title = '삭제';
      itemDel.setAttribute('aria-label', `"${item.label}" 항목 삭제`);
      itemDel.textContent = '✕';
      itemDel.addEventListener('click', () => deleteCheckItem(group.id, item.id));

      itemDiv.appendChild(itemDel);
      groupDiv.appendChild(itemDiv);
    });

    const addRow = document.createElement('div');
    addRow.className = 'add-item-row';

    const newInput = document.createElement('input');
    newInput.type = 'text';
    newInput.className = 'input-inline';
    newInput.placeholder = '새 항목 추가...';
    newInput.maxLength = STR_MAX;
    newInput.id = 'new-item-' + group.id;
    newInput.setAttribute('aria-label', `${group.name} 그룹에 새 항목 추가`);
    newInput.addEventListener('keydown', e => {
      if (e.key === 'Enter') {
        addCheckItem(group.id);
      }
    });

    const tagSel = document.createElement('select');
    tagSel.className = 'select-inline';
    tagSel.id = 'new-tag-' + group.id;
    tagSel.setAttribute('aria-label', '태그 선택');

    [
      ['', '태그 없음'],
      ['urgent', '긴급'],
      ['today', '이번주'],
      ['week', '나중에'],
    ].forEach(([value, text]) => {
      const opt = document.createElement('option');
      opt.value = value;
      opt.textContent = text;
      tagSel.appendChild(opt);
    });

    const addBtn = document.createElement('button');
    addBtn.className = 'btn-sm btn-accent';
    addBtn.textContent = '+ 추가';
    addBtn.addEventListener('click', () => addCheckItem(group.id));

    addRow.appendChild(newInput);
    addRow.appendChild(tagSel);
    addRow.appendChild(addBtn);
    groupDiv.appendChild(addRow);

    container.appendChild(groupDiv);
  });
}

function toggleCheck(groupId, itemId) { const group = state.checklist.groups.find(g => g.id === groupId); if (!group) return; const item = group.items.find(i => i.id === itemId); if (!item) return; item.done = !item.done; saveState(); renderChecklist(); renderDashboard(); }
function addCheckItem(groupId) { const input = el('new-item-' + groupId), tagSel = el('new-tag-' + groupId); const label = safeStr(input.value.trim(), STR_MAX); if (!label) return input.focus(); const group = state.checklist.groups.find(g => g.id === groupId); group.items.push({ id: genId(), label, desc: '', tag: tagSel.value, done: false }); saveState(); renderChecklist(); }
function deleteCheckItem(groupId, itemId) { confirmAction('삭제할까요?', () => { const group = state.checklist.groups.find(g => g.id === groupId); group.items = group.items.filter(i => i.id !== itemId); saveState(); renderChecklist(); }); }
function deleteGroup(groupId) { confirmAction('그룹을 삭제할까요?', () => { state.checklist.groups = state.checklist.groups.filter(g => g.id !== groupId); saveState(); renderChecklist(); }); }

// -- Roadmap --
function renderRoadmap() {
  const container = el('roadmap-container');
  if (!container) return;

  if (state.roadmap.months.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🗺</div>
        <p>아직 로드맵이 없습니다.</p>
        <p>"월 추가" 버튼으로 장기 계획을 세워보세요.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = state.roadmap.months.map(month => `
    <div class="roadmap-month" id="rmonth-${escHtml(month.id)}">
      <div class="roadmap-month-header">
        <div class="timeline-week">MONTH ${escHtml(String(month.monthNum))}</div>
        <button class="btn-icon btn-danger" data-month-del="${escHtml(month.id)}" aria-label="Month ${month.monthNum} 삭제">🗑 삭제</button>
      </div>
      <div class="roadmap-month-body">
        <div class="field-group">
          <label class="field-label" for="mgoal-${escHtml(month.id)}">이번 달 목표</label>
          <input
            type="text"
            class="input-field"
            id="mgoal-${escHtml(month.id)}"
            value="${escHtml(month.goal)}"
            maxlength="${STR_MAX}"
            data-month-goal="${escHtml(month.id)}"
            placeholder="이번 달의 핵심 목표를 입력하세요"
          >
        </div>

        <div class="field-group">
          <label class="field-label">할 일 목록</label>
          <div class="roadmap-tasks-list">
            ${month.tasks.map((task, ti) => `
              <div class="roadmap-task-item">
                <span class="task-arrow" aria-hidden="true">→</span>
                <input
                  type="text"
                  class="input-inline"
                  value="${escHtml(task)}"
                  maxlength="${STR_MAX}"
                  data-month-task="${escHtml(month.id)}"
                  data-task-idx="${ti}"
                  aria-label="할 일 ${ti + 1}"
                >
                <button
                  class="btn-icon btn-danger"
                  data-month-task-del="${escHtml(month.id)}"
                  data-task-idx="${ti}"
                  aria-label="할 일 삭제"
                >✕</button>
              </div>
            `).join('')}
          </div>

          <div class="add-item-row" style="margin-top:8px">
            <input
              type="text"
              class="input-inline"
              placeholder="할 일 추가..."
              id="rtask-new-${escHtml(month.id)}"
              maxlength="${STR_MAX}"
              data-month-task-new="${escHtml(month.id)}"
              aria-label="새 할 일 입력"
            >
            <button class="btn-sm btn-accent" data-month-task-add="${escHtml(month.id)}">+ 추가</button>
          </div>
        </div>

        <div class="field-group">
          <label class="field-label" for="mnotes-${escHtml(month.id)}">메모</label>
          <textarea
            class="textarea-field"
            rows="3"
            id="mnotes-${escHtml(month.id)}"
            maxlength="${MEMO_MAX}"
            data-month-notes="${escHtml(month.id)}"
            placeholder="이 달에 대한 메모..."
          >${escHtml(month.notes)}</textarea>
        </div>
      </div>
    </div>
  `).join('');
}

function addMonth() { const nextNum = state.roadmap.months.length ? Math.max(...state.roadmap.months.map(m => m.monthNum)) + 1 : 1; state.roadmap.months.push({ id: genId(), monthNum: nextNum, goal: '', tasks: [], notes: '' }); saveState(); renderRoadmap(); }
function deleteMonth(monthId) { confirmAction('삭제할까요?', () => { state.roadmap.months = state.roadmap.months.filter(m => m.id !== monthId); saveState(); renderRoadmap(); }); }
function updateMonthField(monthId, field, value) { const m = state.roadmap.months.find(m => m.id === monthId); if (m) { m[field] = value; saveState(); } }
function addMonthTask(monthId) { const input = el('rtask-new-' + monthId); const task = safeStr(input?.value.trim(), STR_MAX); if (task) { state.roadmap.months.find(m => m.id === monthId).tasks.push(task); saveState(); renderRoadmap(); } }
function updateMonthTask(monthId, index, value) { state.roadmap.months.find(m => m.id === monthId).tasks[index] = value; saveState(); }
function deleteMonthTask(monthId, index) { state.roadmap.months.find(m => m.id === monthId).tasks.splice(index, 1); saveState(); renderRoadmap(); }

// ==========================================
// 프로세스 (Dashboard) 관리 로직
// ==========================================
function renderDashboardProcess() {
  const container = el('dashboard-process-container');
  if (!container) return;

  container.innerHTML = state.process.map(p => `
    <div class="process-card" style="position: relative; cursor: pointer;" onclick="openProcessModal('${p.id}')">
      <div class="process-icon">${escHtml(p.icon)}</div>
      <div class="process-step">${escHtml(p.step)}</div>
      <div class="process-title">${escHtml(p.title)}</div>
      <div class="process-desc">${escHtml(p.desc)}</div>
    </div>
  `).join('');
}

function openProcessModal(id) {
  if (el('process-modal')) return;

  const isEdit = !!id;
  const p = isEdit ? state.process.find(item => item.id === id) : { icon: '📌', step: 'STEP ', title: '', desc: '' };

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'process-modal';
  
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">${isEdit ? '프로세스 수정' : '새 프로세스 추가'}</div>
        <button class="btn-icon modal-close" id="proc-modal-close">✕</button>
      </div>
      <div class="modal-body">
        <div style="display:flex; gap:10px;">
          <div style="width: 80px;">
            <label class="field-label">아이콘</label>
            <input type="text" class="input-field" id="proc-icon" value="${escHtml(p.icon)}" placeholder="📌">
          </div>
          <div style="flex:1;">
            <label class="field-label">단계명 (STEP)</label>
            <input type="text" class="input-field" id="proc-step" value="${escHtml(p.step)}" placeholder="STEP 1">
          </div>
        </div>
        <label class="field-label" style="margin-top:14px">제목</label>
        <input type="text" class="input-field" id="proc-title" value="${escHtml(p.title)}" placeholder="단계 제목">
        <label class="field-label" style="margin-top:14px">설명</label>
        <textarea class="textarea-field" id="proc-desc" rows="3" placeholder="설명을 입력하세요">${escHtml(p.desc)}</textarea>
      </div>
      <div class="modal-footer" style="${isEdit ? 'justify-content: space-between;' : ''}">
        ${isEdit ? `<button class="btn-icon btn-danger" style="padding:0 10px;" id="proc-modal-del">🗑 삭제</button>` : '<div></div>'}
        <div style="display:flex; gap:10px;">
          <button class="btn-secondary" id="proc-modal-cancel">취소</button>
          <button class="btn-primary" id="proc-modal-save">저장</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  openModal(overlay);

  el('proc-modal-close').addEventListener('click', () => closeModal(overlay));
  el('proc-modal-cancel').addEventListener('click', () => closeModal(overlay));
  if(isEdit) el('proc-modal-del').addEventListener('click', () => {
    confirmAction('삭제할까요?', () => {
      state.process = state.process.filter(item => item.id !== id);
      saveState(); renderDashboardProcess(); closeModal(overlay);
    });
  });

  el('proc-modal-save').addEventListener('click', () => {
    const data = {
      icon: el('proc-icon').value.trim() || '📌',
      step: el('proc-step').value.trim() || 'STEP',
      title: el('proc-title').value.trim() || '새 단계',
      desc: el('proc-desc').value.trim()
    };
    if (isEdit) { Object.assign(state.process.find(item => item.id === id), data); } 
    else { state.process.push({ id: genId(), ...data }); }
    saveState(); renderDashboardProcess(); closeModal(overlay); showToast('저장됨');
  });
}

// 그룹 추가/수정 기능을 위한 새로운 모달 연결
function addGroup() { openGroupModal(); }
function editGroup(groupId) { openGroupModal(groupId); }

function openGroupModal(groupId = null) {
  if (el('group-modal')) return;

  const isEdit = !!groupId;
  const g = isEdit ? state.checklist.groups.find(item => item.id === groupId) : { name: '' };

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'group-modal';

  // 앱 테마에 맞는 HTML 구조 생성
  overlay.innerHTML = `
    <div class="modal" style="max-width: 400px;">
      <div class="modal-header">
        <div class="modal-title">${isEdit ? '✏️ 그룹 수정' : '➕ 새 그룹 추가'}</div>
        <button class="btn-icon modal-close" id="group-modal-close">✕</button>
      </div>
      <div class="modal-body">
        <label class="field-label">그룹 이름</label>
        <input type="text" class="input-field" id="group-name-input" value="${escHtml(g.name)}" placeholder="예: 오늘 할 일, 아이디어 스케치 등">
      </div>
      <div class="modal-footer">
        <button class="btn-secondary" id="group-modal-cancel">취소</button>
        <button class="btn-primary" id="group-modal-save">저장</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  openModal(overlay); // UI 애니메이션 적용

  const inputEl = el('group-name-input');
  
  // UX 디테일: 입력창에서 엔터키(Enter)를 누르면 바로 저장되도록 설정
  inputEl.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') el('group-modal-save').click();
  });

  // 닫기/취소 버튼 이벤트
  el('group-modal-close').addEventListener('click', () => closeModal(overlay));
  el('group-modal-cancel').addEventListener('click', () => closeModal(overlay));

  // 저장 버튼 이벤트
  el('group-modal-save').addEventListener('click', () => {
    const name = inputEl.value.trim();
    if (!name) {
      showToast('그룹 이름을 입력해주세요.', 'error');
      inputEl.focus();
      return;
    }

    if (isEdit) {
      const targetGroup = state.checklist.groups.find(item => item.id === groupId);
      if (targetGroup) targetGroup.name = safeStr(name, STR_MAX);
    } else {
      state.checklist.groups.push({ 
        id: genId(), 
        name: safeStr(name, STR_MAX), 
        items: [] 
      });
    }

    saveState();
    renderChecklist();
    closeModal(overlay);
    showToast(isEdit ? '그룹명이 수정되었습니다.' : '새 그룹이 추가되었습니다.');
  });
}