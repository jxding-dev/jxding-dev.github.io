// JSON 백업 만들기 / 파싱·검증. 잘못된 파일이 들어와도 throw 하지 않는다.

import { nowISO } from './dateUtils'

export const BACKUP_VERSION = 1

/** 내보내기용 백업 객체. */
export function buildBackup(deadlines, customCategories) {
  return {
    app: 'kkamukgi-jeone',
    version: BACKUP_VERSION,
    exportedAt: nowISO(),
    deadlines,
    categories: customCategories,
  }
}

function isValidDateOnly(value) {
  if (value == null || value === '') return true
  if (typeof value !== 'string') return false
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!match) return false
  const [, y, m, d] = match.map(Number)
  const date = new Date(y, m - 1, d)
  return (
    date.getFullYear() === y &&
    date.getMonth() === m - 1 &&
    date.getDate() === d
  )
}

function isValidDateTime(value) {
  return value == null || (typeof value === 'string' && !Number.isNaN(Date.parse(value)))
}

function isValidCategory(x) {
  return (
    x &&
    typeof x === 'object' &&
    typeof x.id === 'string' &&
    typeof x.label === 'string' &&
    (x.icon == null || typeof x.icon === 'string')
  )
}

function isValidDeadline(x) {
  return (
    x &&
    typeof x === 'object' &&
    typeof x.id === 'string' &&
    typeof x.title === 'string' &&
    isValidDateOnly(x.dueDate) &&
    isValidDateTime(x.createdAt) &&
    isValidDateTime(x.updatedAt) &&
    isValidDateTime(x.completedAt) &&
    (x.postponedCount == null || Number.isFinite(x.postponedCount))
  )
}

// 누락 필드를 기본값으로 채워 안전한 형태로 정규화.
function normalizeDeadline(d) {
  return {
    id: String(d.id),
    title: String(d.title),
    category: typeof d.category === 'string' ? d.category : 'etc',
    dueDate: d.dueDate || null,
    importance: ['low', 'medium', 'high'].includes(d.importance) ? d.importance : 'medium',
    status: ['pending', 'completed', 'postponed', 'onHold'].includes(d.status)
      ? d.status
      : 'pending',
    memo: typeof d.memo === 'string' ? d.memo : '',
    createdAt: d.createdAt || nowISO(),
    updatedAt: d.updatedAt || nowISO(),
    postponedCount: Number.isFinite(d.postponedCount) ? d.postponedCount : 0,
    completedAt: typeof d.completedAt === 'string' ? d.completedAt : null,
  }
}

/**
 * 백업 텍스트를 파싱·검증한다.
 * 반환: { ok: true, data: { deadlines, categories } } | { ok: false, error }
 */
export function parseBackup(text) {
  let data
  try {
    data = JSON.parse(text)
  } catch {
    return { ok: false, error: 'JSON 파일을 읽을 수 없어요.' }
  }

  // 백업 객체({deadlines}) 또는 배열(기한 목록)만 허용
  const rawList = Array.isArray(data?.deadlines)
    ? data.deadlines
    : Array.isArray(data)
      ? data
      : null

  if (!rawList) {
    return { ok: false, error: '백업 형식이 올바르지 않아요.' }
  }
  if (!rawList.every(isValidDeadline)) {
    return { ok: false, error: '기한 데이터 형식이 올바르지 않아요.' }
  }

  const deadlines = rawList.map(normalizeDeadline)
  const rawCategories = Array.isArray(data?.categories) ? data.categories : []
  if (!rawCategories.every(isValidCategory)) {
    return { ok: false, error: '카테고리 데이터 형식이 올바르지 않아요.' }
  }

  const categories = rawCategories
    .filter((c) => c.id.trim() && c.label.trim())
    .map((c) => ({
      id: c.id,
      label: c.label,
      icon: c.icon || '📌',
      custom: true,
    }))

  return { ok: true, data: { deadlines, categories } }
}
