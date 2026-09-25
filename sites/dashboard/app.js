// ==========================================
// 8. INITIALIZATION & EVENT DELEGATION
// ==========================================

function initRoadmapEvents() {
  const container = el('roadmap-container'); if (!container) return;
  container.addEventListener('click', e => {
    const delBtn = e.target.closest('[data-month-del]'), taskDelBtn = e.target.closest('[data-month-task-del]'), taskAddBtn = e.target.closest('[data-month-task-add]');
    if (delBtn) deleteMonth(delBtn.dataset.monthDel);
    if (taskDelBtn) deleteMonthTask(taskDelBtn.dataset.monthTaskDel, parseInt(taskDelBtn.dataset.taskIdx, 10));
    if (taskAddBtn) addMonthTask(taskAddBtn.dataset.monthTaskAdd);
  });
  container.addEventListener('change', e => {
    if (e.target.dataset.monthGoal) updateMonthField(e.target.dataset.monthGoal, 'goal', safeStr(e.target.value, STR_MAX));
    if (e.target.dataset.monthTask) updateMonthTask(e.target.dataset.monthTask, parseInt(e.target.dataset.taskIdx, 10), safeStr(e.target.value, STR_MAX));
    if (e.target.dataset.monthNotes) updateMonthField(e.target.dataset.monthNotes, 'notes', safeStr(e.target.value, MEMO_MAX));
  });
  container.addEventListener('keydown', e => { if (e.key === 'Enter' && e.target.dataset.monthTaskNew) addMonthTask(e.target.dataset.monthTaskNew); });
}

function initWorkflowEvents() {
  const container = el('workflow-steps-container'); if (!container) return;
  container.addEventListener('click', e => {
    const editBtn = e.target.closest('[data-wf-edit]'), delBtn = e.target.closest('[data-wf-del]');
    if (editBtn) openWorkflowModal(editBtn.dataset.wfEdit);
    if (delBtn) deleteWorkflowStep(delBtn.dataset.wfDel);
  });
}

function init() {
  applyTheme(state.settings.theme || 'dark');
  applyFontSize(state.settings.fontSize || 'normal');
  if (el('current-date')) el('current-date').textContent = new Date().toLocaleDateString('ko-KR');

  // app.js 의 init() 함수 내부
  const actions = {
    'toggle-theme': toggleTheme, 'reset': resetAllData, 'export': exportData,
    'save-dashboard-note': saveDashboardNote, 'save-layout-note': saveLayoutNote,
    'add-group': addGroup, 'add-month': addMonth, 'add-prompt': () => openPromptModal(''),
    'add-step': () => openWorkflowModal(''), 'save-workflow-note': saveWorkflowNote,
    'add-platform': () => openPlatformModal(''), 'save-platforms-note': savePlatformsNote,
    'save-calc': saveCalculatorResult,
    'open-invoice': openInvoiceModal,
    'add-process': () => openProcessModal(''),
    'add-role': () => openRoleModal('')
  };

  Object.entries(actions).forEach(([action, fn]) => {
    document.querySelectorAll(`[data-action="${action}"]`).forEach(btn => btn.addEventListener('click', fn));
  });

  document.querySelectorAll('.nav-item[data-page]').forEach(btn => btn.addEventListener('click', () => showPage(btn.dataset.page)));
  if (document.querySelector('[data-action="import"]')) document.querySelector('[data-action="import"]').addEventListener('change', importData);
  if (el('prompt-search')) el('prompt-search').addEventListener('input', searchPromptsHandler);
  
  document.querySelectorAll('.filter-btn[data-filter]').forEach(btn => btn.addEventListener('click', () => filterPrompts(btn.dataset.filter, btn)));
  ['calc-unit-price', 'calc-projects', 'calc-expenses', 'calc-tax-rate'].forEach(id => { if (el(id)) el(id).addEventListener('input', updateCalculator); });
  if (el('layout-guide-save-btn')) el('layout-guide-save-btn').addEventListener('click', saveLayoutGuide);

  restoreCardOrder(); initDragAndDrop(); initRoadmapEvents(); initWorkflowEvents();
  showPage('dashboard');
}

document.addEventListener('DOMContentLoaded', init);