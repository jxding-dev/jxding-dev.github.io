// ==========================================
// 7. FINANCE FEATURES
// ==========================================

// -- Platforms --
function renderPlatforms() {
  const tbody = el('platforms-tbody');
  if (!tbody) return;

  if (state.platforms.length === 0) {
    tbody.innerHTML = `<tr><td colspan="6" class="table-empty">등록된 플랫폼이 없습니다</td></tr>`;
  } else {
    tbody.innerHTML = '';

    state.platforms.forEach(pl => {
      const tr = document.createElement('tr');

      tr.innerHTML = `
        <td><span class="platform-name">${escHtml(pl.name)}</span></td>
        <td><span class="platform-type-badge">${escHtml(pl.type)}</span></td>
        <td class="mono-text">${escHtml(pl.unitPrice)}</td>
        <td>${escHtml(pl.strategy)}</td>
        <td><span class="status-badge ${STATUS_CLASSES[pl.status] || ''}">${STATUS_LABELS[pl.status] || escHtml(pl.status)}</span></td>
        <td class="table-actions">
          <button class="btn-icon" aria-label="${escHtml(pl.name)} 수정">✏️</button>
          <button class="btn-icon btn-danger" aria-label="${escHtml(pl.name)} 삭제">🗑</button>
        </td>
      `;

      const buttons = tr.querySelectorAll('button');
      buttons[0].addEventListener('click', () => openPlatformModal(pl.id));
      buttons[1].addEventListener('click', () => deletePlatform(pl.id));

      tbody.appendChild(tr);
    });
  }

  const noteEl = el('platforms-note');
  if (noteEl) {
    noteEl.value = state.notes.platforms || '';
  }
}

function openPlatformModal(id) {
  if (el('platform-modal')) return;

  const isEdit = !!id;
  const pl = isEdit ? state.platforms.find(item => item.id === id) : null;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'platform-modal';
  overlay.setAttribute('role', 'dialog');
  overlay.setAttribute('aria-modal', 'true');
  overlay.setAttribute('aria-labelledby', 'pl-modal-title');

  overlay.innerHTML = `
    <div class="modal">
      <div class="modal-header">
        <div class="modal-title" id="pl-modal-title">${isEdit ? '플랫폼 수정' : '새 플랫폼 추가'}</div>
        <button class="btn-icon modal-close" id="pl-modal-close" aria-label="모달 닫기">✕</button>
      </div>

      <div class="modal-body">
        <label class="field-label" for="plm-name">플랫폼명</label>
        <input
          type="text"
          class="input-field"
          id="plm-name"
          value="${isEdit ? escHtml(pl.name) : ''}"
          maxlength="${STR_MAX}"
          placeholder="예: 크몽, 인스타그램 등"
          aria-required="true"
        >

        <label class="field-label" for="plm-type" style="margin-top:14px">유형</label>
        <input
          type="text"
          class="input-field"
          id="plm-type"
          value="${isEdit ? escHtml(pl.type) : ''}"
          maxlength="${STR_MAX}"
          placeholder="예: 프리랜서 마켓, SNS 등"
        >

        <label class="field-label" for="plm-price" style="margin-top:14px">단가</label>
        <input
          type="text"
          class="input-field"
          id="plm-price"
          value="${isEdit ? escHtml(pl.unitPrice) : ''}"
          maxlength="${STR_MAX}"
          placeholder="예: 30~100만원"
        >

        <label class="field-label" for="plm-strategy" style="margin-top:14px">전략</label>
        <input
          type="text"
          class="input-field"
          id="plm-strategy"
          value="${isEdit ? escHtml(pl.strategy) : ''}"
          maxlength="${STR_MAX}"
          placeholder="예: 포트폴리오 중심"
        >

        <label class="field-label" for="plm-status" style="margin-top:14px">상태</label>
        <select class="select-field" id="plm-status">
          ${Object.entries(STATUS_LABELS).map(([key, value]) => `
            <option value="${key}" ${isEdit && pl.status === key ? 'selected' : ''}>${escHtml(value)}</option>
          `).join('')}
        </select>
      </div>

      <div class="modal-footer">
        <button class="btn-secondary" id="pl-modal-cancel">취소</button>
        <button class="btn-primary" id="pl-modal-save">저장</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  openModal(overlay);

  el('pl-modal-close').addEventListener('click', () => closeModal(overlay));
  el('pl-modal-cancel').addEventListener('click', () => closeModal(overlay));
  el('pl-modal-save').addEventListener('click', () => savePlatformModal(id || ''));
}

function savePlatformModal(id) {
  const name = safeStr(el('plm-name').value.trim(), STR_MAX);

  if (!name) {
    showToast('플랫폼명을 입력하세요', 'error');
    return;
  }

  const data = {
    name,
    type: safeStr(el('plm-type').value.trim(), STR_MAX),
    unitPrice: safeStr(el('plm-price').value.trim(), STR_MAX),
    strategy: safeStr(el('plm-strategy').value.trim(), STR_MAX),
    status: safeEnum(el('plm-status').value, ['active', 'pending', 'paused'], 'pending'),
  };

  if (id) {
    const pl = state.platforms.find(item => item.id === id);
    if (pl) {
      Object.assign(pl, data);
    }
  } else {
    state.platforms.push({
      id: genId(),
      ...data,
    });
  }

  saveState();
  closeModal(el('platform-modal'));
  renderPlatforms();
  showToast('저장됨');
}

function deletePlatform(id) { confirmAction('삭제할까요?', () => { state.platforms = state.platforms.filter(item => item.id !== id); saveState(); renderPlatforms(); }); }
function savePlatformsNote() { state.notes.platforms = safeStr(el('platforms-note').value, MEMO_MAX); saveState(); showToast('저장됨'); }

// -- Calculator --
function calcNetRevenue() {
  const c = state.calculator;
  const gross = (c.unitPrice || 0) * (c.projectsPerMonth || 0);
  const tax = Math.round(gross * (c.taxRate || 0) / 100);
  return Math.max(0, gross - tax - (c.expenses || 0));
}

function renderCalculator() {
  const c = state.calculator;
  if (el('calc-unit-price')) el('calc-unit-price').value = c.unitPrice;
  if (el('calc-projects')) el('calc-projects').value = c.projectsPerMonth;
  if (el('calc-expenses')) el('calc-expenses').value = c.expenses;
  if (el('calc-tax-rate')) el('calc-tax-rate').value = c.taxRate;
  updateCalculator(); renderSavedResults();
}

function updateCalculator() {
  const unitPrice = safeNum(el('calc-unit-price')?.value, 0, 1e9), projects = safeNum(el('calc-projects')?.value, 0, 9999);
  const expenses = safeNum(el('calc-expenses')?.value, 0, 1e9), taxRate = safeNum(el('calc-tax-rate')?.value, 0, 100);
  const gross = unitPrice * projects, tax = Math.round(gross * taxRate / 100), net = Math.max(0, gross - tax - expenses);
  const fmt = n => (n / 10000).toFixed(1) + '만원';

  if (el('calc-gross')) el('calc-gross').textContent = fmt(gross);
  if (el('calc-tax')) el('calc-tax').textContent = fmt(tax);
  if (el('calc-expenses-out')) el('calc-expenses-out').textContent = fmt(expenses);
  if (el('calc-net')) el('calc-net').textContent = fmt(net);
  if (el('calc-total-display')) el('calc-total-display').textContent = Math.round(net / 10000);

  state.calculator = { ...state.calculator, unitPrice, projectsPerMonth: projects, expenses, taxRate };
  saveState(); renderDashboard();
}

function saveCalculatorResult() {
  state.calculator.savedResults = state.calculator.savedResults || [];
  state.calculator.savedResults.unshift({ id: genId(), date: new Date().toISOString(), unitPrice: state.calculator.unitPrice, projects: state.calculator.projectsPerMonth, net: calcNetRevenue(), memo: safeStr(el('calc-memo')?.value.trim(), STR_MAX) });
  if (state.calculator.savedResults.length > 10) state.calculator.savedResults.pop();
  if (el('calc-memo')) el('calc-memo').value = '';
  saveState(); renderSavedResults(); showToast('저장됨');
}

function renderSavedResults() {
  const container = el('calc-saved-results');
  if (!container) return;

  const results = state.calculator.savedResults || [];

  if (results.length === 0) {
    container.innerHTML = '<div class="empty-state-small">저장된 계산 결과가 없습니다</div>';
    return;
  }

  container.innerHTML = '';

  results.forEach(r => {
    const item = document.createElement('div');
    item.className = 'saved-result-item';

    const left = document.createElement('div');

    const dateEl = document.createElement('div');
    dateEl.className = 'saved-result-date';
    dateEl.textContent = formatDate(r.date);

    const detailEl = document.createElement('div');
    detailEl.className = 'saved-result-detail';
    detailEl.textContent = `단가 ${Math.round(r.unitPrice / 10000)}만원 × ${r.projects}건/월`;

    left.appendChild(dateEl);
    left.appendChild(detailEl);

    if (r.memo) {
      const memoEl = document.createElement('div');
      memoEl.className = 'saved-result-memo';
      memoEl.textContent = r.memo;
      left.appendChild(memoEl);
    }

    const right = document.createElement('div');
    right.style.cssText = 'display:flex;align-items:center;gap:12px';

    const netEl = document.createElement('div');
    netEl.className = 'saved-result-net';
    netEl.innerHTML = `월 순수익 <strong>${Math.round(r.net / 10000)}만원</strong>`;

    const delBtn = document.createElement('button');
    delBtn.className = 'btn-icon btn-danger';
    delBtn.setAttribute('aria-label', `${formatDate(r.date)} 계산 결과 삭제`);
    delBtn.textContent = '✕';
    delBtn.addEventListener('click', () => deleteSavedResult(r.id));

    right.appendChild(netEl);
    right.appendChild(delBtn);

    item.appendChild(left);
    item.appendChild(right);

    container.appendChild(item);
  });
}

function deleteSavedResult(id) { state.calculator.savedResults = state.calculator.savedResults.filter(r => r.id !== id); saveState(); renderSavedResults(); }

// ==========================================
// 8. INVOICE & TEMPLATE GENERATOR
// ==========================================

// 은행 정보 저장소
function getBankInfoLocal() {
  try { return JSON.parse(localStorage.getItem('mymanager_bank')) || { bank: '', account: '', name: '' }; }
  catch(e) { return { bank: '', account: '', name: '' }; }
}

function saveBankInfoLocal() {
  const data = {
    bank: safeStr(el('inv-bank').value.trim(), 50),
    account: safeStr(el('inv-account').value.trim(), 50),
    name: safeStr(el('inv-name').value.trim(), 50)
  };
  localStorage.setItem('mymanager_bank', JSON.stringify(data));
}

// 템플릿 저장소
function getTemplatesLocal() {
  try {
    const t = JSON.parse(localStorage.getItem('mymanager_templates'));
    if (t && Array.isArray(t) && t.length > 0) return t;
  } catch(e) {}
  
  // 기본 템플릿 제공
  return [
    { 
      id: 'inv-req', 
      name: '💰 결제 요청서 (작업 완료 후)', 
      content: "안녕하세요 [고객명]님,\n\n요청해주신 [ [작업 내용] ] 작업이 모두 완료되었습니다.\n작업물 확인해 보시고, 이상이 없다면 아래 계좌로 대금 입금을 부탁드리겠습니다.\n\n항상 믿고 맡겨주셔서 진심으로 감사드립니다.\n좋은 하루 보내세요!\n\n■ 청구 내역\n- 작업명 : [작업 내용]\n- 청구 금액 : [금액] 원\n\n■ 입금 계좌\n- 은행 : [은행명]\n- 계좌번호 : [계좌번호]\n- 예금주 : [예금주]\n\n*기타 문의사항이 있으시면 언제든 연락 주세요." 
    },
    { 
      id: 'inv-est', 
      name: '📄 견적 안내서 (문의 답변용)', 
      content: "안녕하세요 [고객명]님,\n\n문의해주신 [ [작업 내용] ]에 대한 견적을 안내해 드립니다.\n말씀해 주신 내용을 바탕으로 산정된 예상 비용 및 결제 정보는 아래와 같습니다.\n\n추가로 궁금한 점이 있으시거나 일정 조율이 필요하시다면 편하게 말씀해 주세요.\n\n■ 견적 내역\n- 작업명 : [작업 내용]\n- 예상 비용 : [금액] 원\n\n■ 결제 계좌\n- 은행 : [은행명]\n- 계좌번호 : [계좌번호]\n- 예금주 : [예금주]\n\n감사합니다." 
    }
  ];
}

function saveTemplatesLocal(templates) {
  localStorage.setItem('mymanager_templates', JSON.stringify(templates));
}

// 메인 모달창 열기
function openInvoiceModal() {
  if (el('invoice-modal')) return;

  const b = getBankInfoLocal();
  const templates = getTemplatesLocal();
  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'invoice-modal';

  overlay.innerHTML = `
    <div class="modal" style="width: 100%; max-width: 700px;">
      <div class="modal-header">
        <div class="modal-title" style="font-size: 1.1rem;">🧾 원클릭 청구서/견적서 생성</div>
        <button class="btn-icon modal-close" id="inv-modal-close">✕</button>
      </div>

      <div class="modal-body" style="display: flex; gap: 20px; flex-wrap: wrap;">
        <div style="flex: 1; min-width: 280px;">
          
          <label class="field-label">템플릿 선택</label>
          <div style="display: flex; gap: 4px; margin-bottom: 14px; align-items: center;">
            <select class="select-field" id="inv-type" style="margin-bottom: 0; flex: 1;">
              ${templates.map(t => `<option value="${t.id}">${escHtml(t.name)}</option>`).join('')}
            </select>
            <button class="btn-icon" id="inv-btn-add" title="새 템플릿 추가" style="background: rgba(255,255,255,0.05);">➕</button>
            <button class="btn-icon" id="inv-btn-edit" title="현재 템플릿 수정" style="background: rgba(255,255,255,0.05);">✏️</button>
            <button class="btn-icon btn-danger" id="inv-btn-del" title="현재 템플릿 삭제">🗑</button>
          </div>

          <label class="field-label">고객명 / 담당자명</label>
          <input type="text" class="input-field" id="inv-client" placeholder="예: OOO 대표" style="margin-bottom: 12px;">

          <label class="field-label">작업 내용</label>
          <input type="text" class="input-field" id="inv-task" placeholder="예: 유튜브 썸네일 3건 디자인" style="margin-bottom: 12px;">

          <label class="field-label">청구 금액</label>
          <div class="input-with-unit" style="margin-bottom: 14px;">
            <input type="text" class="input-field" id="inv-amount" placeholder="예: 300,000" style="margin-bottom: 0; font-family: 'JetBrains Mono', monospace;">
            <span class="input-unit">원</span>
          </div>

          <div style="padding: 14px; background: rgba(255,255,255,0.03); border-radius: 8px; border: 1px solid var(--border);">
            <label class="field-label" style="color: var(--accent); margin-bottom: 10px;">내 계좌 정보 (자동 저장됨)</label>
            <div style="display: flex; gap: 6px; margin-bottom: 6px;">
              <input type="text" class="input-field" id="inv-bank" placeholder="은행명" value="${escHtml(b.bank)}" style="width: 80px; margin:0; padding: 8px;">
              <input type="text" class="input-field" id="inv-account" placeholder="계좌번호 (- 포함)" value="${escHtml(b.account)}" style="flex:1; margin:0; padding: 8px;">
            </div>
            <input type="text" class="input-field" id="inv-name" placeholder="예금주 성함" value="${escHtml(b.name)}" style="margin:0; padding: 8px; width: 100%;">
          </div>
        </div>

        <div style="flex: 1; min-width: 280px; display: flex; flex-direction: column;">
          <label class="field-label">미리보기 (카톡/메일용)</label>
          <textarea class="textarea-field" id="inv-result" style="flex: 1; min-height: 280px; background: var(--bg); font-size: 13px; line-height: 1.7; color: var(--fg);" readonly></textarea>
        </div>
      </div>

      <div class="modal-footer">
        <button class="btn-secondary" id="inv-modal-cancel">닫기</button>
        <button class="btn-primary" id="inv-modal-copy">📋 텍스트 복사하기</button>
      </div>
    </div>
  `;

  document.body.appendChild(overlay);
  openModal(overlay);

  // 이벤트 리스너 연결
  const inputs = ['inv-type', 'inv-client', 'inv-task', 'inv-amount', 'inv-bank', 'inv-account', 'inv-name'];
  inputs.forEach(id => { el(id).addEventListener('input', updateInvoiceText); });

  el('inv-amount').addEventListener('input', function() {
    let val = this.value.replace(/[^0-9]/g, '');
    this.value = val ? Number(val).toLocaleString('ko-KR') : '';
  });

  // 버튼 액션
  el('inv-modal-close').addEventListener('click', () => { saveBankInfoLocal(); closeModal(overlay); });
  el('inv-modal-cancel').addEventListener('click', () => { saveBankInfoLocal(); closeModal(overlay); });
  el('inv-modal-copy').addEventListener('click', () => {
    saveBankInfoLocal();
    const text = el('inv-result').value;
    if(!text.trim()) return;
    navigator.clipboard ? navigator.clipboard.writeText(text).then(() => showToast('클립보드 복사 완료!')) : fallbackCopy(text);
  });

  // 템플릿 관리 버튼
  el('inv-btn-add').addEventListener('click', () => openTemplateEditModal(null));
  el('inv-btn-edit').addEventListener('click', () => openTemplateEditModal(el('inv-type').value));
  el('inv-btn-del').addEventListener('click', deleteCurrentTemplate);

  updateInvoiceText();
}

function updateInvoiceText() {
  const typeId = el('inv-type').value;
  const client = el('inv-client').value.trim() || '[고객명]';
  const task = el('inv-task').value.trim() || '[작업 내용]';
  const amount = el('inv-amount').value.trim() || '[금액]';
  const bank = el('inv-bank').value.trim() || '[은행명]';
  const account = el('inv-account').value.trim() || '[계좌번호]';
  const name = el('inv-name').value.trim() || '[예금주]';

  const templates = getTemplatesLocal();
  const tpl = templates.find(t => t.id === typeId);
  if (!tpl) return;

  // [태그] 자동 변환 처리
  let text = tpl.content
    .split('[고객명]').join(client)
    .split('[작업 내용]').join(task)
    .split('[금액]').join(amount)
    .split('[은행명]').join(bank)
    .split('[계좌번호]').join(account)
    .split('[예금주]').join(name);

  el('inv-result').value = text;
}

// 템플릿 추가/수정 모달창
function openTemplateEditModal(tplId) {
  const templates = getTemplatesLocal();
  const tpl = tplId ? templates.find(t => t.id === tplId) : null;

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.id = 'template-edit-modal';
  overlay.style.zIndex = '2100'; // 청구서 모달창 위에 띄우기 위함

  overlay.innerHTML = `
    <div class="modal" style="width: 100%; max-width: 480px;">
      <div class="modal-header">
        <div class="modal-title">${tpl ? '✏️ 템플릿 수정' : '➕ 새 템플릿 추가'}</div>
        <button class="btn-icon modal-close" id="tpl-modal-close">✕</button>
      </div>
      <div class="modal-body">
        <label class="field-label">템플릿 이름</label>
        <input type="text" class="input-field" id="tpl-name" value="${tpl ? escHtml(tpl.name) : ''}" placeholder="예: 디자인 초안 전달용" style="margin-bottom: 16px;">

        <label class="field-label">템플릿 본문 작성</label>
        <textarea class="textarea-field" id="tpl-content" rows="10" placeholder="내용을 입력하세요...">${tpl ? escHtml(tpl.content) : ''}</textarea>

        <div style="margin-top: 14px; padding: 14px; background: rgba(255,77,28,0.08); border-radius: 8px; font-size: 0.85rem; color: var(--fg); line-height: 1.8;">
          <strong>💡 마법의 단어 (자동 변환 태그)</strong><br>
          본문에 아래 괄호 단어들을 포함하면 입력값으로 자동 변환됩니다.<br>
          <span class="tag"> [고객명] </span> <span class="tag"> [작업 내용] </span> <span class="tag"> [금액] </span><br>
          <span class="tag"> [은행명] </span> <span class="tag"> [계좌번호] </span> <span class="tag"> [예금주] </span>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-secondary" id="tpl-modal-cancel">취소</button>
        <button class="btn-primary" id="tpl-modal-save">저장</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  openModal(overlay);

  el('tpl-modal-close').addEventListener('click', () => closeModal(overlay));
  el('tpl-modal-cancel').addEventListener('click', () => closeModal(overlay));
  
  el('tpl-modal-save').addEventListener('click', () => {
     const name = el('tpl-name').value.trim();
     const content = el('tpl-content').value.trim();
     if (!name || !content) return showToast('이름과 내용을 입력하세요', 'error');

     if (tpl) {
         tpl.name = name;
         tpl.content = content;
     } else {
         const newId = 'inv-' + Date.now();
         templates.push({ id: newId, name, content });
         tplId = newId;
     }
     
     saveTemplatesLocal(templates);
     closeModal(overlay);
     showToast('템플릿이 저장되었습니다');

     // 메인 모달의 셀렉트박스 새로고침
     const select = el('inv-type');
     if(select) {
         select.innerHTML = templates.map(t => `<option value="${t.id}">${escHtml(t.name)}</option>`).join('');
         select.value = tplId;
         updateInvoiceText();
     }
  });
}

// 템플릿 삭제 로직
function deleteCurrentTemplate() {
  const select = el('inv-type');
  if(!select) return;
  
  const templates = getTemplatesLocal();
  if(templates.length <= 1) {
    showToast('최소 1개의 템플릿은 남겨두어야 합니다.', 'error');
    return;
  }

  confirmAction('현재 선택된 템플릿을 삭제하시겠습니까?', () => {
     const tplId = select.value;
     const newTemplates = templates.filter(t => t.id !== tplId);
     saveTemplatesLocal(newTemplates);
     
     select.innerHTML = newTemplates.map(t => `<option value="${t.id}">${escHtml(t.name)}</option>`).join('');
     updateInvoiceText();
     showToast('삭제되었습니다.');
  });
}