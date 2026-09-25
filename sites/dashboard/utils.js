// ==========================================
// 2. UTILITIES & SANITIZATION
// ==========================================
function el(id) { return document.getElementById(id); }

function genId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
}

function safeStr(val, max = STR_MAX) { return typeof val === 'string' ? val.slice(0, max) : ''; }
function safeNum(val, min = 0, max = 1e9) { const n = Number(val); return isFinite(n) ? Math.max(min, Math.min(max, n)) : min; }
function safeArr(val) { return Array.isArray(val) ? val : []; }
function safeObj(val) { return (val && typeof val === 'object' && !Array.isArray(val)) ? val : {}; }
function safeEnum(val, allowed, fallback) { return allowed.includes(val) ? val : fallback; }

function escHtml(str) {
  return String(str ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso);
  if (isNaN(d)) return '';
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

// -- Sanitize Functions --
function sanitizeChecklistItem(item) {
  if (!item || typeof item !== 'object') return null;
  return {
    id: safeStr(item.id, 64) || genId(), label: safeStr(item.label, STR_MAX), desc: safeStr(item.desc, STR_MAX),
    tag: safeEnum(item.tag, ['urgent', 'today', 'week', ''], ''), done: !!item.done,
  };
}
function sanitizeGroup(group) {
  if (!group || typeof group !== 'object') return null;
  return { id: safeStr(group.id, 64) || genId(), name: safeStr(group.name, STR_MAX), items: safeArr(group.items).slice(0, ARR_MAX).map(sanitizeChecklistItem).filter(Boolean) };
}
function sanitizeMonth(month) {
  if (!month || typeof month !== 'object') return null;
  return { id: safeStr(month.id, 64) || genId(), monthNum: safeNum(month.monthNum, 1, 999), goal: safeStr(month.goal, STR_MAX), tasks: safeArr(month.tasks).slice(0, ARR_MAX).map(t => safeStr(t, STR_MAX)).filter(Boolean), notes: safeStr(month.notes, MEMO_MAX) };
}
function sanitizePrompt(p) {
  if (!p || typeof p !== 'object') return null;
  return { id: safeStr(p.id, 64) || genId(), title: safeStr(p.title, STR_MAX), category: safeEnum(p.category, ['claude', 'chatgpt', 'gemini', 'ps', 'other'], 'other'), body: safeStr(p.body, BODY_MAX), createdAt: safeStr(p.createdAt, 64), updatedAt: safeStr(p.updatedAt, 64) };
}
function sanitizePlatform(pl) {
  if (!pl || typeof pl !== 'object') return null;
  return { id: safeStr(pl.id, 64) || genId(), name: safeStr(pl.name, STR_MAX), type: safeStr(pl.type, STR_MAX), unitPrice: safeStr(pl.unitPrice, STR_MAX), strategy: safeStr(pl.strategy, STR_MAX), status: safeEnum(pl.status, ['active', 'pending', 'paused'], 'pending') };
}
function sanitizeWorkflowStep(step) {
  if (!step || typeof step !== 'object') return null;
  return { id: safeStr(step.id, 64) || genId(), tool: safeStr(step.tool, STR_MAX), title: safeStr(step.title, STR_MAX), desc: safeStr(step.desc, MEMO_MAX) };
}
function sanitizeCalcResult(r) {
  if (!r || typeof r !== 'object') return null;
  return { id: safeStr(r.id, 64) || genId(), date: safeStr(r.date, 64), unitPrice: safeNum(r.unitPrice, 0, 1e9), projects: safeNum(r.projects, 0, 9999), net: safeNum(r.net, 0, 1e12), memo: safeStr(r.memo, STR_MAX) };
}

function sanitizeState(raw) {
  const def = getDefaultData();
  if (!raw || typeof raw !== 'object') return def;

  const settings = safeObj(raw.settings), checklist = safeObj(raw.checklist), roadmap = safeObj(raw.roadmap);
  const workflow = safeObj(raw.workflow), calc = safeObj(raw.calculator), notes = safeObj(raw.notes);
  
  const cardOrder = (() => {
    const order = safeArr(raw.dashboardCardOrder).filter(id => VALID_CARD_IDS.includes(id));
    VALID_CARD_IDS.forEach(id => { if (!order.includes(id)) order.push(id); });
    return order;
  })();

  return {
    settings: { theme: safeEnum(settings.theme, ['dark', 'light'], 'dark'), fontSize: safeEnum(settings.fontSize, ['small', 'normal', 'large'], 'normal') },
    checklist: { groups: safeArr(checklist.groups).slice(0, ARR_MAX).map(sanitizeGroup).filter(Boolean) },
    roadmap: { months: safeArr(roadmap.months).slice(0, 120).map(sanitizeMonth).filter(Boolean) },
    prompts: safeArr(raw.prompts).slice(0, ARR_MAX).map(sanitizePrompt).filter(Boolean),
    notes: { dashboard: safeStr(notes.dashboard, MEMO_MAX), layout: safeStr(notes.layout, MEMO_MAX), workflow: safeStr(notes.workflow, MEMO_MAX), platforms: safeStr(notes.platforms, MEMO_MAX) },
    layoutGuide: safeArr(raw.layoutGuide).slice(0, 6).map(item => ({ name: safeStr(item?.name, 50), tip: safeStr(item?.tip, 80), size: safeStr(item?.size, 20) })),
    platforms: safeArr(raw.platforms).slice(0, ARR_MAX).map(sanitizePlatform).filter(Boolean),
    workflow: { steps: safeArr(workflow.steps).slice(0, ARR_MAX).map(sanitizeWorkflowStep).filter(Boolean), notes: safeStr(workflow.notes, MEMO_MAX) },
    calculator: { unitPrice: safeNum(calc.unitPrice, 0, 1e9), projectsPerMonth: safeNum(calc.projectsPerMonth, 0, 9999), expenses: safeNum(calc.expenses, 0, 1e9), taxRate: safeNum(calc.taxRate, 0, 100), savedResults: safeArr(calc.savedResults).slice(0, 50).map(sanitizeCalcResult).filter(Boolean) },
    process: safeArr(raw.process).map(p => ({
      id: safeStr(p.id, 64) || genId(), icon: safeStr(p.icon, 10), step: safeStr(p.step, 20), title: safeStr(p.title, 50), desc: safeStr(p.desc, 200)
    })),
    roles: safeArr(raw.roles).map(r => ({
      id: safeStr(r.id, 64) || genId(), color: safeEnum(r.color, ['purple', 'green', 'blue', 'sky'], 'purple'), label: safeStr(r.label, 50), desc: safeStr(r.desc, 200)
    })),
    process: safeArr(raw.process).map(p => ({
      id: safeStr(p.id, 64) || genId(), icon: safeStr(p.icon, 10), step: safeStr(p.step, 20), title: safeStr(p.title, 50), desc: safeStr(p.desc, 200)
    })),
    roles: safeArr(raw.roles).map(r => ({
      id: safeStr(r.id, 64) || genId(), color: safeEnum(r.color, ['purple', 'green', 'blue', 'sky'], 'purple'), label: safeStr(r.label, 50), desc: safeStr(r.desc, 200)
    })),
    dashboardCardOrder: cardOrder,
  };
}