// 하단 탭 메타데이터. 라벨/아이콘을 한 곳에서 관리해 컴포넌트 중복을 줄인다.
// icon 은 의존성 없이 쓰는 인라인 이모지 글리프. 추후 SVG 로 교체 가능.
export const TABS = [
  { id: 'today', label: '오늘', icon: '🔥' },
  { id: 'week', label: '이번주', icon: '🗓️' },
  { id: 'overdue', label: '지남', icon: '⚠️' },
  { id: 'all', label: '전체', icon: '📋' },
  { id: 'stats', label: '기록', icon: '📊' },
]

export const DEFAULT_TAB = TABS[0].id

export function getTab(id) {
  return TABS.find((tab) => tab.id === id) ?? TABS[0]
}
