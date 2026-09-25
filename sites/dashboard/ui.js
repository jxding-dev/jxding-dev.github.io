// ==========================================
// 4. UI COMPONENTS (Toasts, Modals, Nav, Theme)
// ==========================================
function showToast(msg, type = 'success') {
  document.querySelectorAll('.toast').forEach(t => t.remove());
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  toast.textContent = msg;
  document.body.appendChild(toast);
  requestAnimationFrame(() => toast.classList.add('show'));
  setTimeout(() => { toast.classList.remove('show'); setTimeout(() => toast.remove(), 300); }, 2500);
}

function confirmAction(msg, callback) { if (window.confirm(msg)) callback(); }

function applyTheme(theme) {
  document.body.classList.toggle('light', theme === 'light');
  if (el('theme-toggle')) el('theme-toggle').textContent = theme === 'light' ? '🌙' : '☀️';
  state.settings.theme = theme; saveState();
}
function toggleTheme() { applyTheme(state.settings.theme === 'dark' ? 'light' : 'dark'); }

function applyFontSize(size) {
  document.body.classList.remove('font-small', 'font-normal', 'font-large');
  document.body.classList.add('font-' + size);
  document.querySelectorAll('.font-size-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.size === size));
  state.settings.fontSize = size; saveState();
}

function showPage(pageId) {
  currentPage = pageId;
  document.querySelectorAll('.page-section').forEach(section => section.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(nav => { nav.classList.remove('active'); nav.setAttribute('aria-current', 'false'); });
  
  if (el('page-' + pageId)) el('page-' + pageId).classList.add('active');
  const navItem = document.querySelector(`[data-page="${pageId}"]`);
  if (navItem) { navItem.classList.add('active'); navItem.setAttribute('aria-current', 'page'); }
  if (el('page-title')) el('page-title').textContent = PAGE_TITLES[pageId] || pageId;

  const renderMap = {
    dashboard: renderDashboard, checklist: renderChecklist, roadmap: renderRoadmap,
    layout: renderLayout, prompts: renderPrompts, workflow: renderWorkflow,
    platforms: renderPlatforms, calculator: renderCalculator
  };
  if (renderMap[pageId]) renderMap[pageId]();
}

// Modal Logic
function openModal(modalEl) {
  _modalFocusBefore = document.activeElement; 
  document.body.style.overflow = 'hidden';
  
  // 🚀 숨겨진 모달을 화면에 보이게 하는 핵심 코드 추가!
  modalEl.classList.add('show'); 

  const onEsc = e => { if (e.key === 'Escape') closeModal(modalEl); };
  const onBg = e => { if (e.target === modalEl) closeModal(modalEl); };
  modalEl.addEventListener('keydown', trapFocus);
  modalEl.addEventListener('keydown', onEsc); modalEl.addEventListener('click', onBg);
  modalEl._openHandlers = { onEsc, onBg };
  setTimeout(() => modalEl.querySelector('input:not([disabled]),textarea:not([disabled]),button:not([disabled])')?.focus(), 50);
}

function closeModal(modalEl) {
  if (!modalEl || !modalEl.isConnected) return;
  if (modalEl._openHandlers) {
    modalEl.removeEventListener('keydown', trapFocus);
    modalEl.removeEventListener('keydown', modalEl._openHandlers.onEsc);
    modalEl.removeEventListener('click', modalEl._openHandlers.onBg); delete modalEl._openHandlers;
  }
  
  // 🚀 닫을 때 다시 숨겨주기
  modalEl.classList.remove('show'); 
  modalEl.remove(); 
  document.body.style.overflow = '';
  if (_modalFocusBefore?.focus) _modalFocusBefore.focus();
}

function trapFocus(e) {
  if (e.key !== 'Tab') return;
  const focusable = Array.from(e.currentTarget.querySelectorAll('input:not([disabled]),textarea:not([disabled]),button:not([disabled])')).filter(n => n.offsetParent !== null);
  if (!focusable.length) { e.preventDefault(); return; }
  const first = focusable[0], last = focusable[focusable.length - 1];
  if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
  else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
}