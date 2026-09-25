// ==========================================
// 3. STORAGE & GLOBAL STATE
// ==========================================
const Storage = {
  load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      return sanitizeState(JSON.parse(raw));
    } catch (e) { console.warn('localStorage 데이터 손상. 기본값으로 복구합니다.', e); return null; }
  },
  save(data) {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); return true; } 
    catch (e) { console.error('localStorage 저장 실패:', e); return false; }
  }
};

// Global Variables
let state = Storage.load() || getDefaultData();
let currentPage = 'dashboard';
let promptFilter = '';
let promptSearch = '';
let _modalFocusBefore = null;

function saveState() { Storage.save(state); }

// Data Management Functions
function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `mymanager-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click(); URL.revokeObjectURL(url);
  showToast('데이터 내보내기 완료');
}

function importData(event) {
  const file = event.target.files[0];
  if (!file) return;
  if (file.size > 10 * 1024 * 1024) return showToast('파일이 너무 큽니다 (최대 10MB)', 'error'), event.target.value = '';
  
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const raw = JSON.parse(e.target.result);
      if (!raw || typeof raw !== 'object' || Array.isArray(raw)) throw new Error('Invalid structure');
      
      confirmAction('기존 데이터를 불러온 데이터로 교체할까요?', () => {
        state = sanitizeState(raw); saveState(); showPage(currentPage); showToast('데이터 불러오기 완료');
      });
    } catch (err) { showToast('올바른 백업 파일이 아닙니다.', 'error'); }
  };
  reader.readAsText(file);
  event.target.value = '';
}

function resetAllData() {
  confirmAction('⚠️ 모든 데이터를 초기화할까요? 되돌릴 수 없습니다.', () => {
    confirmAction('정말 초기화하시겠습니까?', () => {
      localStorage.removeItem(STORAGE_KEY); state = getDefaultData(); saveState();
      showPage('dashboard'); showToast('데이터 초기화 완료', 'info');
    });
  });
}