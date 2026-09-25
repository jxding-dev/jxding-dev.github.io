// 전체 목록 화면의 상태 필터 탭 정의. (id 는 getListItems 와 매핑)
export const LIST_FILTERS = [
  { id: 'all', label: '전체' },
  { id: 'upcoming', label: '예정' },
  { id: 'today', label: '오늘' },
  { id: 'week', label: '이번 주' },
  { id: 'overdue', label: '지남' },
  { id: 'completed', label: '완료' },
  { id: 'onHold', label: '보류' },
]

export const DEFAULT_LIST_FILTER = 'all'
