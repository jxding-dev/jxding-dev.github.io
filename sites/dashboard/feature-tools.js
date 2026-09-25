// ==========================================
// 6. TOOLS FEATURES
// ==========================================

// -- Layout Guide --
function renderLayout() {
  if (el('layout-note')) el('layout-note').value = state.notes.layout || '';
  document.querySelectorAll('.layout-section-item').forEach((item, i) => {
    const data = state.layoutGuide?.[i]; if (!data) return;
    item.querySelector('[data-field="name"]').value = data.name || '';
    item.querySelector('[data-field="tip"]').value = data.tip || '';
    item.querySelector('[data-field="size"]').value = data.size || '';
  });
}
function saveLayoutNote() { state.notes.layout = safeStr(el('layout-note').value, MEMO_MAX); saveState(); showToast('저장됨'); }
function saveLayoutGuide() {
  state.layoutGuide = Array.from(document.querySelectorAll('.layout-section-item')).map(item => ({ name: safeStr(item.querySelector('[data-field="name"]')?.value || '', 50), tip: safeStr(item.querySelector('[data-field="tip"]')?.value || '', 80), size: safeStr(item.querySelector('[data-field="size"]')?.value || '', 20) }));
  saveState(); showToast('저장됨');
}

// -- Prompts --
function renderPrompts() {
  const container = el('prompts-container');
  if (!container) return;

  let filtered = [...state.prompts];

  if (promptFilter) {
    filtered = filtered.filter(p => p.category === promptFilter);
  }

  if (promptSearch) {
    const q = promptSearch.toLowerCase();
    filtered = filtered.filter(p => {
      return (
        p.title.toLowerCase().includes(q) ||
        p.body.toLowerCase().includes(q) ||
        (CAT_LABELS[p.category] || '').toLowerCase().includes(q)
      );
    });
  }

  const badge = el('prompt-count-badge');
  if (badge) {
    badge.textContent = filtered.length + '개';
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">💬</div>
        <p>프롬프트가 없습니다.</p>
        <p>${promptSearch || promptFilter ? '검색 조건을 변경해보세요.' : '"새 프롬프트" 버튼으로 추가하세요.'}</p>
      </div>
    `;
    return;
  }

  container.innerHTML = '';

  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'prompt-card';
    card.id = 'prompt-' + p.id;

    const hdr = document.createElement('div');
    hdr.className = 'prompt-card-header';

    const tag = document.createElement('span');
    tag.className = 'prompt-tag ' + (CAT_CLASSES[p.category] || 'ptag-other');
    tag.textContent = CAT_LABELS[p.category] || p.category;

    const actDiv = document.createElement('div');
    actDiv.className = 'prompt-card-actions';

    const copyBtn = document.createElement('button');
    copyBtn.className = 'btn-icon';
    copyBtn.setAttribute('aria-label', `"${p.title}" 프롬프트 복사`);
    copyBtn.textContent = '📋 복사';
    copyBtn.addEventListener('click', () => copyPrompt(p.id));

    const editBtn = document.createElement('button');
    editBtn.className = 'btn-icon';
    editBtn.setAttribute('aria-label', `"${p.title}" 프롬프트 수정`);
    editBtn.textContent = '✏️';
    editBtn.addEventListener('click', () => openPromptModal(p.id));

    const delBtn = document.createElement('button');
    delBtn.className = 'btn-icon btn-danger';
    delBtn.setAttribute('aria-label', `"${p.title}" 프롬프트 삭제`);
    delBtn.textContent = '🗑';
    delBtn.addEventListener('click', () => deletePrompt(p.id));

    actDiv.appendChild(copyBtn);
    actDiv.appendChild(editBtn);
    actDiv.appendChild(delBtn);

    const titleEl = document.createElement('div');
    titleEl.className = 'prompt-title';
    titleEl.textContent = p.title;

    const bodyEl = document.createElement('div');
    bodyEl.className = 'prompt-body';
    bodyEl.textContent = p.body;

    const metaEl = document.createElement('div');
    metaEl.className = 'prompt-meta';
    metaEl.textContent = `${formatDate(p.createdAt)} 작성 · ${formatDate(p.updatedAt)} 수정`;

    hdr.appendChild(tag);
    hdr.appendChild(actDiv);

    card.appendChild(hdr);
    card.appendChild(titleEl);
    card.appendChild(bodyEl);
    card.appendChild(metaEl);

    container.appendChild(card);
  });
}

function filterPrompts(cat, btnEl) {
  promptFilter = promptFilter === cat ? '' : cat;
  document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
  if (promptFilter && btnEl) btnEl.classList.add('active');
  renderPrompts();
}

function searchPromptsHandler() { promptSearch = el('prompt-search').value; renderPrompts(); }

function openPromptModal(id) {
  if (el('prompt-modal')) return;

  const isEdit = !!id;
  const p = isEdit ? state.prompts.find(item => item.id === id) : null;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'prompt-modal';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'prompt-modal-title');

  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title" id="prompt-modal-title">${isEdit ? '프롬프트 수정' : '새 프롬프트 추가'}</div>
        <button class="btn-icon modal-close" id="prompt-modal-close" aria-label="모달 닫기">✕</button>
      </div>
      <div class="modal-body">
        <label class="field-label" for="pm-title">제목</label>
        <input
          type="text"
          class="input-field"
          id="pm-title"
          value="${isEdit ? escHtml(p.title) : ''}"
          placeholder="프롬프트 제목"
          maxlength="${STR_MAX}"
          aria-required="true"
        >

        <label class="field-label" for="pm-cat" style="margin-top:14px">카테고리</label>
        <select class="select-field" id="pm-cat">
          ${Object.entries(CAT_LABELS).map(([key, value]) => `
            <option value="${key}" ${isEdit && p.category === key ? 'selected' : ''}>${escHtml(value)}</option>
          `).join('')}
        </select>

        <label class="field-label" for="pm-body" style="margin-top:14px">프롬프트 본문</label>
        <textarea
          class="textarea-field"
          id="pm-body"
          rows="10"
          placeholder="프롬프트 내용을 입력하세요..."
          maxlength="${BODY_MAX}"
          aria-required="true"
        >${isEdit ? escHtml(p.body) : ''}</textarea>

        <div style="font-size:11px;color:var(--text-muted);text-align:right;margin-top:4px">
          <span id="pm-body-count">${isEdit ? p.body.length : 0}</span> / ${BODY_MAX}자
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-secondary" id="prompt-modal-cancel">취소</button>
        <button class="btn-primary" id="prompt-modal-save">저장</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  openModal(overlay);

  const bodyInput = el('pm-body');
  const counter = el('pm-body-count');

  if (bodyInput && counter) {
    bodyInput.addEventListener('input', () => {
      counter.textContent = bodyInput.value.length;
    });
  }

  el('prompt-modal-close').addEventListener('click', () => closeModal(overlay));
  el('prompt-modal-cancel').addEventListener('click', () => closeModal(overlay));
  el('prompt-modal-save').addEventListener('click', () => savePromptModal(id || ''));
}

function savePromptModal(id) {
  const title = safeStr(el('pm-title').value.trim(), STR_MAX);
  const category = el('pm-cat').value;
  const body = safeStr(el('pm-body').value.trim(), BODY_MAX);

  if (!title || !body) {
    showToast('제목과 본문을 입력하세요', 'error');
    return;
  }

  const now = new Date().toISOString();

  if (id) {
    const p = state.prompts.find(item => item.id === id);
    if (p) {
      p.title = title;
      p.category = category;
      p.body = body;
      p.updatedAt = now;
    }
  } else {
    state.prompts.push({
      id: genId(),
      title,
      category,
      body,
      createdAt: now,
      updatedAt: now,
    });
  }

  saveState();
  closeModal(el('prompt-modal'));
  renderPrompts();
  showToast('저장됨');
}

function deletePrompt(id) { confirmAction('삭제할까요?', () => { state.prompts = state.prompts.filter(item => item.id !== id); saveState(); renderPrompts(); }); }
function copyPrompt(id) { const p = state.prompts.find(item => item.id === id); if (p) navigator.clipboard ? navigator.clipboard.writeText(p.body).then(() => showToast('복사됨')) : fallbackCopy(p.body); }

// -- Workflow --
function renderWorkflow() {
  const container = el('workflow-steps-container');
  if (!container) return;

  if (state.workflow.steps.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">🔄</div>
        <p>워크플로우 스텝이 없습니다.</p>
        <p>"스텝 추가" 버튼으로 나만의 워크플로우를 만들어보세요.</p>
      </div>
    `;
  } else {
    container.innerHTML = state.workflow.steps.map((step, idx) => `
      <div class="workflow-step" id="ws-${escHtml(step.id)}">
        <div class="step-num" aria-hidden="true">${idx + 1}</div>
        <div class="step-content" style="flex:1">
          <div class="step-tool">${escHtml(step.tool)}</div>
          <div class="step-title">${escHtml(step.title)}</div>
          <div class="step-desc">${escHtml(step.desc)}</div>
        </div>
        <div class="step-actions">
          <button class="btn-icon" data-wf-edit="${escHtml(step.id)}" aria-label="${escHtml(step.title)} 수정">✏️</button>
          <button class="btn-icon btn-danger" data-wf-del="${escHtml(step.id)}" aria-label="${escHtml(step.title)} 삭제">🗑</button>
        </div>
      </div>
    `).join('');
  }

  const noteEl = el('workflow-note');
  if (noteEl) {
    noteEl.value = state.workflow.notes || '';
  }
  renderWorkflowRoles();
}

function openWorkflowModal(id) {
  if (el('workflow-modal')) return;

  const isEdit = !!id;
  const step = isEdit ? state.workflow.steps.find(item => item.id === id) : null;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'workflow-modal';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'wf-modal-title');

  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title" id="wf-modal-title">${isEdit ? '스텝 수정' : '새 스텝 추가'}</div>
        <button class="btn-icon modal-close" id="wf-modal-close" aria-label="모달 닫기">✕</button>
      </div>

      <div class="modal-body">
        <label class="field-label" for="wm-tool">툴명 / 구분</label>
        <input
          type="text"
          class="input-field"
          id="wm-tool"
          value="${isEdit ? escHtml(step.tool) : ''}"
          maxlength="${STR_MAX}"
          placeholder="예: STEP 1, 도구명 등"
          aria-required="true"
        >

        <label class="field-label" for="wm-title" style="margin-top:14px">스텝 제목</label>
        <input
          type="text"
          class="input-field"
          id="wm-title"
          value="${isEdit ? escHtml(step.title) : ''}"
          maxlength="${STR_MAX}"
          placeholder="이 단계의 이름"
          aria-required="true"
        >

        <label class="field-label" for="wm-desc" style="margin-top:14px">설명</label>
        <textarea
          class="textarea-field"
          id="wm-desc"
          rows="4"
          maxlength="${MEMO_MAX}"
          placeholder="이 스텝에서 하는 작업..."
        >${isEdit ? escHtml(step.desc) : ''}</textarea>
      </div>

      <div class="modal-footer">
        <button class="btn-secondary" id="wf-modal-cancel">취소</button>
        <button class="btn-primary" id="wf-modal-save">저장</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  openModal(overlay);

  el('wf-modal-close').addEventListener('click', () => closeModal(overlay));
  el('wf-modal-cancel').addEventListener('click', () => closeModal(overlay));
  el('wf-modal-save').addEventListener('click', () => saveWorkflowModal(id || ''));
}

function saveWorkflowModal(id) {
  const tool = safeStr(el('wm-tool').value.trim().toUpperCase(), STR_MAX);
  const title = safeStr(el('wm-title').value.trim(), STR_MAX);
  const desc = safeStr(el('wm-desc').value.trim(), MEMO_MAX);

  if (!tool || !title) {
    showToast('구분과 제목을 입력하세요', 'error');
    return;
  }

  if (id) {
    const step = state.workflow.steps.find(item => item.id === id);
    if (step) {
      step.tool = tool;
      step.title = title;
      step.desc = desc;
    }
  } else {
    state.workflow.steps.push({
      id: genId(),
      tool,
      title,
      desc,
    });
  }

  saveState();
  closeModal(el('workflow-modal'));
  renderWorkflow();
  showToast('저장됨');
}

function deleteWorkflowStep(id) { confirmAction('삭제할까요?', () => { state.workflow.steps = state.workflow.steps.filter(step => step.id !== id); saveState(); renderWorkflow(); }); }
function saveWorkflowNote() { state.workflow.notes = safeStr(el('workflow-note').value, MEMO_MAX); saveState(); showToast('저장됨'); }

// ==========================================
// 항목별 역할 (Workflow) 관리 로직
// ==========================================
function renderWorkflowRoles() {
  const container = el('workflow-roles-container');
  if (!container) return;

  container.innerHTML = state.roles.map(r => `
    <div class="guide-card-item guide-card-item-${r.color}" style="cursor: pointer;" onclick="openRoleModal('${r.id}')">
      <div class="guide-card-label guide-card-label-${r.color}">${escHtml(r.label)}</div>
      <div class="guide-card-desc">${escHtml(r.desc)}</div>
    </div>
  `).join('');
}

function openRoleModal(id) {
  if (el('role-modal')) return;

  const isEdit = !!id;
  const r = isEdit ? state.roles.find(item => item.id === id) : { color: 'purple', label: '', desc: '' };

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'role-modal';
  
  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title">${isEdit ? '항목 수정' : '새 항목 추가'}</div>
        <button class="btn-icon modal-close" id="role-modal-close">✕</button>
      </div>
      <div class="modal-body">
        <label class="field-label">테마 색상</label>
        <select class="select-field" id="role-color">
          <option value="purple" ${r.color === 'purple' ? 'selected' : ''}>보라색 (Purple)</option>
          <option value="green" ${r.color === 'green' ? 'selected' : ''}>초록색 (Green)</option>
          <option value="blue" ${r.color === 'blue' ? 'selected' : ''}>파란색 (Blue)</option>
          <option value="sky" ${r.color === 'sky' ? 'selected' : ''}>하늘색 (Sky)</option>
        </select>
        
        <label class="field-label" style="margin-top:14px">항목 이름</label>
        <input type="text" class="input-field" id="role-label" value="${escHtml(r.label)}" placeholder="예: 메인 도구">
        
        <label class="field-label" style="margin-top:14px">설명</label>
        <textarea class="textarea-field" id="role-desc" rows="3" placeholder="설명을 입력하세요">${escHtml(r.desc)}</textarea>
      </div>
      <div class="modal-footer" style="${isEdit ? 'justify-content: space-between;' : ''}">
        ${isEdit ? `<button class="btn-icon btn-danger" style="padding:0 10px;" id="role-modal-del">🗑 삭제</button>` : '<div></div>'}
        <div style="display:flex; gap:10px;">
          <button class="btn-secondary" id="role-modal-cancel">취소</button>
          <button class="btn-primary" id="role-modal-save">저장</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(overlay);
  openModal(overlay);

  el('role-modal-close').addEventListener('click', () => closeModal(overlay));
  el('role-modal-cancel').addEventListener('click', () => closeModal(overlay));
  if(isEdit) el('role-modal-del').addEventListener('click', () => {
    confirmAction('삭제할까요?', () => {
      state.roles = state.roles.filter(item => item.id !== id);
      saveState(); renderWorkflowRoles(); closeModal(overlay);
    });
  });

  el('role-modal-save').addEventListener('click', () => {
    const data = {
      color: el('role-color').value,
      label: el('role-label').value.trim() || '새 항목',
      desc: el('role-desc').value.trim()
    };
    if (isEdit) { Object.assign(state.roles.find(item => item.id === id), data); } 
    else { state.roles.push({ id: genId(), ...data }); }
    saveState(); renderWorkflowRoles(); closeModal(overlay); showToast('저장됨');
  });
}

