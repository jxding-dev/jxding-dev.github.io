// 중요도 / 상태 값을 화면 표시용 라벨로 변환한다.
// color 키는 CSS 변수(--danger / --accent / --ok / --text-dim)와 매핑된다.

export const IMPORTANCE = {
  high: { label: '높음', short: '높음', color: 'danger', order: 0 },
  medium: { label: '보통', short: '보통', color: 'accent', order: 1 },
  low: { label: '낮음', short: '낮음', color: 'ok', order: 2 },
}

export const STATUS = {
  pending: { label: '대기', short: '대기', color: 'text-dim' },
  completed: { label: '완료', short: '완료', color: 'ok' },
  postponed: { label: '미룸', short: '미룸', color: 'accent' },
  onHold: { label: '보류', short: '보류', color: 'text-dim' },
}

const FALLBACK = { label: '-', short: '-', color: 'text-dim' }

/** 중요도 메타(label/short/color). 알 수 없는 값이면 fallback. */
export function getImportance(importance) {
  return IMPORTANCE[importance] ?? FALLBACK
}

/** 중요도 라벨 문자열만 필요할 때. */
export function getImportanceLabel(importance) {
  return getImportance(importance).label
}

/** 상태 메타(label/short/color). */
export function getStatus(status) {
  return STATUS[status] ?? FALLBACK
}

/** 상태 라벨 문자열만 필요할 때. */
export function getStatusLabel(status) {
  return getStatus(status).label
}
