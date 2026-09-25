// ==========================================
// 1. CONFIG & CONSTANTS
// ==========================================
const STORAGE_KEY = 'mymanager_v1';

const STR_MAX = 2000;
const BODY_MAX = 10000;
const MEMO_MAX = 5000;
const ARR_MAX = 500;

const VALID_CARD_IDS = [
  'dash-card-checklist', 'dash-card-revenue', 
  'dash-card-roadmap', 'dash-card-prompts'
];

const PAGE_TITLES = {
  dashboard: '⚡ 대시보드', checklist: '✅ 체크리스트', roadmap: '🗺 로드맵',
  layout: '📐 레이아웃 가이드', prompts: '💬 프롬프트 뱅크', workflow: '🔄 툴 워크플로우',
  platforms: '🏪 플랫폼 전략', calculator: '💰 수익 계산기'
};

const CAT_LABELS = { claude: 'Claude', chatgpt: 'ChatGPT', gemini: 'Gemini', ps: 'Photoshop', other: '기타' };
const CAT_CLASSES = { claude: 'ptag-claude', chatgpt: 'ptag-chatgpt', gemini: 'ptag-gemini', ps: 'ptag-ps', other: 'ptag-other' };
const STATUS_LABELS = { active: '활성', pending: '준비중', paused: '보류' };
const STATUS_CLASSES = { active: 'status-active', pending: 'status-pending', paused: 'status-paused' };
const TAG_LABELS = { urgent: '긴급', today: '이번주', week: '나중에' };

function getDefaultData() {
  return {
    settings: { theme: 'dark', fontSize: 'normal' },
    checklist: { groups: [] },
    roadmap: { months: [] },
    prompts: [],
    notes: { dashboard: '', layout: '', workflow: '', platforms: '' },
    layoutGuide: Array(6).fill({ name: '', tip: '', size: '' }),
    platforms: [],
    workflow: { steps: [], notes: '' },
    calculator: { unitPrice: 0, projectsPerMonth: 0, expenses: 0, taxRate: 0, savedResults: [] },
    process: [
      { id: 'p1', icon: '📌', step: 'STEP 1', title: '단계 제목', desc: '클릭해서 내용을 수정하세요' }
    ],
    roles: [
      { id: 'r1', color: 'purple', label: '항목 1', desc: '클릭해서 내용을 수정하세요' }
    ],
    dashboardCardOrder: [...VALID_CARD_IDS],
  };
}