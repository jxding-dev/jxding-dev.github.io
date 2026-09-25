// 날짜 계산 유틸.
// 마감 항목의 dueDate 는 "YYYY-MM-DD" 형태의 날짜 문자열을 기본으로 본다.
// 모든 비교는 문자열이 아니라 Date 객체(로컬 자정 기준)로 처리한다.

const MS_PER_DAY = 1000 * 60 * 60 * 24

/** 어떤 입력이든 Date 로 변환. "YYYY-MM-DD" 는 로컬 자정으로 파싱한다. */
export function toDate(value) {
  if (value instanceof Date) return value
  if (typeof value === 'string') {
    const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
    if (dateOnly) {
      const [, y, m, d] = dateOnly
      return new Date(Number(y), Number(m) - 1, Number(d))
    }
  }
  return new Date(value)
}

/** 시/분/초를 버리고 그 날의 자정(로컬) Date 를 반환. */
export function startOfDay(value = new Date()) {
  const d = toDate(value)
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
}

/** 날짜에 days 만큼 더한 새 Date. (음수 가능) */
export function addDays(value, days) {
  const d = startOfDay(value)
  d.setDate(d.getDate() + days)
  return d
}

/** Date 를 "YYYY-MM-DD" 로컬 문자열로. */
export function toISODateString(value = new Date()) {
  const d = toDate(value)
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

/**
 * D-day(정수). dueDate - 오늘 의 일수 차.
 *  - 0  : 오늘 마감
 *  - 음수: 기한 지남 (예: -2)
 *  - 양수: 남은 일수 (예: 3)
 */
export function getDday(dueDate, base = new Date()) {
  const diff = startOfDay(dueDate).getTime() - startOfDay(base).getTime()
  return Math.round(diff / MS_PER_DAY)
}

/** "D-3" / "D-DAY" / "D+2" 형태의 짧은 라벨. (360px 표시용) */
export function formatDday(dueDate, base = new Date()) {
  const dday = getDday(dueDate, base)
  if (dday === 0) return 'D-DAY'
  if (dday > 0) return `D-${dday}`
  return `D+${Math.abs(dday)}`
}

/** 오늘이 마감일인가. */
export function isDueToday(dueDate, base = new Date()) {
  return getDday(dueDate, base) === 0
}

/**
 * 이번 주 마감인가. (오늘 ~ 이번 주 일요일까지, 월요일 시작 기준)
 * 기한이 지난 항목은 false. 오늘 마감은 포함.
 */
export function isDueThisWeek(dueDate, base = new Date()) {
  const today = startOfDay(base)
  const due = startOfDay(dueDate)
  if (due < today) return false
  // 월요일=0 ... 일요일=6 로 환산
  const weekday = (today.getDay() + 6) % 7
  const endOfWeek = addDays(today, 6 - weekday)
  return due <= endOfWeek
}

/** 기한이 지났는가. (dueDate 가 오늘보다 과거) */
export function isOverdue(dueDate, base = new Date()) {
  return getDday(dueDate, base) < 0
}

const WEEKDAY_KO = ['일', '월', '화', '수', '목', '금', '토']

/**
 * 날짜 포맷. 360px 에서 쓰기 좋은 짧은 한글 표기.
 *  - 'short'(기본): "6월 25일 (목)"
 *  - 'compact'     : "6.25 (목)"
 *  - 'monthDay'    : "6월 25일"
 */
export function formatDate(dueDate, style = 'short') {
  const d = toDate(dueDate)
  const month = d.getMonth() + 1
  const day = d.getDate()
  const weekday = WEEKDAY_KO[d.getDay()]
  if (style === 'compact') return `${month}.${day} (${weekday})`
  if (style === 'monthDay') return `${month}월 ${day}일`
  return `${month}월 ${day}일 (${weekday})`
}

/** "2026.06.22 14:30" 형태. 생성일/수정일 표시용. */
export function formatDateTime(value) {
  const d = toDate(value)
  const p = (n) => String(n).padStart(2, '0')
  const date = `${d.getFullYear()}.${p(d.getMonth() + 1)}.${p(d.getDate())}`
  return `${date} ${p(d.getHours())}:${p(d.getMinutes())}`
}

/** 현재 시각 ISO 문자열. createdAt/updatedAt/completedAt 용. */
export function nowISO() {
  return new Date().toISOString()
}
