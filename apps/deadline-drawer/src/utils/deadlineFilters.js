// 마감 목록 필터/정렬 로직. 화면 여러 곳에서 재사용하기 위해 분리한다.

import { isDueToday, isDueThisWeek, isOverdue, getDday } from './dateUtils'

// 홈 긴급 목록·요약에서 제외할 상태: 완료 / 보류
const EXCLUDED_STATUS = new Set(['completed', 'onHold'])

/** 기한 계산 대상인가. (완료·보류 제외, dueDate 있음) */
export function isTrackable(item) {
  return !EXCLUDED_STATUS.has(item.status) && Boolean(item.dueDate)
}

/** 기한 계산 대상만 추린다. */
export function trackable(list) {
  return list.filter(isTrackable)
}

// dueDate 없는 항목은 맨 뒤로 보낸다.
const dueKey = (item) =>
  item.dueDate ? getDday(item.dueDate) : Number.POSITIVE_INFINITY

/** dueDate 가까운 순(지난 항목 먼저) 정렬한 새 배열. */
export function sortByDue(list) {
  return [...list].sort((a, b) => dueKey(a) - dueKey(b))
}

// 완료 항목은 최근 완료 순.
const byCompletedDesc = (a, b) =>
  (b.completedAt ?? '').localeCompare(a.completedAt ?? '')

export function getUpcomingItems(list) {
  return trackable(list).filter((i) => getDday(i.dueDate) > 0)
}

export function getDueTodayItems(list) {
  return trackable(list).filter((i) => isDueToday(i.dueDate))
}

export function getThisWeekItems(list) {
  return trackable(list).filter((i) => isDueThisWeek(i.dueDate))
}

export function getOverdueItems(list) {
  return trackable(list).filter((i) => isOverdue(i.dueDate))
}

export function getCompletedItems(list) {
  return list.filter((i) => i.status === 'completed').sort(byCompletedDesc)
}

export function getOnHoldItems(list) {
  return list.filter((i) => i.status === 'onHold')
}

/**
 * 홈 긴급 목록: "지금 터질 기한".
 * 기한 지남 + 오늘 마감 항목을, 급한 순(지난 것 먼저)으로 정렬.
 */
export function getUrgentItems(list) {
  const urgent = trackable(list).filter(
    (i) => isOverdue(i.dueDate) || isDueToday(i.dueDate),
  )
  return sortByDue(urgent)
}

/**
 * 전체 목록: 진행 중(마감일 순) → 보류 → 완료(최근순) 순으로 묶어 보여준다.
 * 지난 항목이 위쪽, 완료는 아래쪽에 모인다.
 */
export function getAllSorted(list) {
  const active = list.filter(
    (i) => i.status !== 'completed' && i.status !== 'onHold',
  )
  return [...sortByDue(active), ...getOnHoldItems(list), ...getCompletedItems(list)]
}

/** 상태 필터 id 에 맞는 목록(정렬 포함)을 반환한다. */
export function getListItems(list, filter) {
  switch (filter) {
    case 'upcoming':
      return sortByDue(getUpcomingItems(list))
    case 'today':
      return sortByDue(getDueTodayItems(list))
    case 'week':
      return sortByDue(getThisWeekItems(list))
    case 'overdue':
      return sortByDue(getOverdueItems(list))
    case 'completed':
      return getCompletedItems(list)
    case 'onHold':
      return getOnHoldItems(list)
    case 'all':
    default:
      return getAllSorted(list)
  }
}
