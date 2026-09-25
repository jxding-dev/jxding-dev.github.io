// 기본 카테고리 + 사용자 카테고리 레지스트리.
// 카드/상세/통계 등 표시 코드는 getCategory(id) 로 라벨·아이콘을 조회하므로,
// 사용자 추가 카테고리도 즉시 인식되도록 단일 레지스트리를 둔다.

import { readJSON } from '../utils/storage'

export const CATEGORIES_KEY = 'deadline-drawer-categories'

// 기본(삭제 불가) 카테고리
export const DEFAULT_CATEGORIES = [
  { id: 'utility', label: '공과금', icon: '💡' },
  { id: 'subscription', label: '구독', icon: '🔁' },
  { id: 'hospital', label: '병원', icon: '🏥' },
  { id: 'document', label: '서류', icon: '📄' },
  { id: 'delivery', label: '택배/반품', icon: '📦' },
  { id: 'exam', label: '시험/접수', icon: '📝' },
  { id: 'appointment', label: '약속', icon: '🤝' },
  { id: 'etc', label: '기타', icon: '📌' },
]

export const DEFAULT_CATEGORY_ID = 'etc'

const DEFAULT_IDS = new Set(DEFAULT_CATEGORIES.map((c) => c.id))

/** 기본 카테고리(삭제 불가)인가. */
export function isDefaultCategory(id) {
  return DEFAULT_IDS.has(id)
}

function sanitize(list) {
  return Array.isArray(list)
    ? list.filter((c) => c && typeof c.id === 'string' && typeof c.label === 'string')
    : []
}

// 사용자 카테고리 레지스트리 — import 시점에 localStorage 에서 1회 로드.
let _custom = sanitize(readJSON(CATEGORIES_KEY, []))

export function getCustomCategories() {
  return _custom
}

/** 레지스트리 갱신(훅에서 상태 변경 시 동기 호출). */
export function setCustomCategories(list) {
  _custom = sanitize(list)
}

/** 기본 + 사용자 전체 카테고리. */
export function getAllCategories() {
  return [...DEFAULT_CATEGORIES, ..._custom]
}

/** id 로 카테고리 메타 조회. 없으면 '기타'. */
export function getCategory(id) {
  const all = getAllCategories()
  return (
    all.find((c) => c.id === id) ??
    all.find((c) => c.id === DEFAULT_CATEGORY_ID)
  )
}

/** 카테고리 라벨만 필요할 때. */
export function getCategoryLabel(id) {
  return getCategory(id).label
}
