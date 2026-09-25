// 월별 기록/통계 계산. 모든 집계는 dueDate(마감일) 기준 "이번 달"로 본다.

import { toDate, isOverdue } from './dateUtils'
import { DEFAULT_CATEGORIES, getCategory } from '../data/defaultCategories'
import { IMPORTANCE } from './labelUtils'

/** 같은 연·월인가. */
export function isInMonth(value, base = new Date()) {
  const d = toDate(value)
  const b = toDate(base)
  return d.getFullYear() === b.getFullYear() && d.getMonth() === b.getMonth()
}

/** 마감일이 기준 달에 속한 항목만. (dueDate 없는 항목 제외) */
export function getMonthItems(list, base = new Date()) {
  return list.filter((i) => i.dueDate && isInMonth(i.dueDate, base))
}

/** 완료율(%). 항목이 없으면 0. */
export function completionRate(items) {
  if (items.length === 0) return 0
  const done = items.filter((i) => i.status === 'completed').length
  return Math.round((done / items.length) * 100)
}

/** 이번 달 요약 수치. */
export function getMonthStats(items) {
  const completed = items.filter((i) => i.status === 'completed').length
  const onHold = items.filter((i) => i.status === 'onHold').length
  // 놓침 = 완료/보류가 아니면서 기한이 지난 것
  const overdue = items.filter(
    (i) =>
      i.status !== 'completed' && i.status !== 'onHold' && isOverdue(i.dueDate),
  ).length
  return {
    total: items.length,
    completed,
    overdue,
    onHold,
    rate: completionRate(items),
  }
}

/** 카테고리별 개수(0건 제외, 많은 순). */
export function countByCategory(items, categories = DEFAULT_CATEGORIES) {
  return categories.map((c) => ({
    id: c.id,
    label: c.label,
    icon: c.icon,
    count: items.filter((i) => i.category === c.id).length,
  }))
    .filter((row) => row.count > 0)
    .sort((a, b) => b.count - a.count)
}

/** 중요도별 개수(높음→보통→낮음, 0건도 유지). */
export function countByImportance(items) {
  return ['high', 'medium', 'low'].map((id) => ({
    id,
    label: IMPORTANCE[id].label,
    color: IMPORTANCE[id].color,
    count: items.filter((i) => i.importance === id).length,
  }))
}

/** 이번 달 놓친 항목(기한 지남, 미완료) — 급한 순. */
export function getMissedItems(items) {
  return items
    .filter(
      (i) =>
        i.status !== 'completed' &&
        i.status !== 'onHold' &&
        isOverdue(i.dueDate),
    )
    .sort((a, b) => toDate(a.dueDate) - toDate(b.dueDate))
}

// 카테고리 메타 재노출(필요 시 사용)
export { getCategory }
