// 카테고리 상태 + localStorage 영속화 훅. App 에서 한 번만 호출해 내려준다.

import { useState } from 'react'
import {
  DEFAULT_CATEGORIES,
  CATEGORIES_KEY,
  getCustomCategories,
  setCustomCategories,
  isDefaultCategory,
} from '../data/defaultCategories'
import { writeJSON } from '../utils/storage'
import { createId } from '../utils/id'

export function useCategories() {
  const [custom, setCustom] = useState(() => getCustomCategories())

  // 레지스트리 + localStorage 를 상태와 동기로 갱신한다.
  function commit(next) {
    setCustomCategories(next)
    writeJSON(CATEGORIES_KEY, next)
    setCustom(next)
  }

  // 사용자 카테고리 추가. 추가된 항목 반환(라벨 비면 null).
  function addCategory({ label, icon }) {
    const trimmed = (label ?? '').trim()
    if (!trimmed) return null
    const item = {
      id: createId(),
      label: trimmed.slice(0, 12),
      icon: icon || '🏷️',
      custom: true,
    }
    commit([...custom, item])
    return item
  }

  // 사용자 카테고리만 삭제 가능. 기본 카테고리는 무시.
  function removeCategory(id) {
    if (isDefaultCategory(id)) return
    commit(custom.filter((c) => c.id !== id))
  }

  // 백업 불러오기 시 사용자 카테고리 통째 교체(기본 id 와 충돌하는 건 제외).
  function replaceCustomCategories(list) {
    const safe = Array.isArray(list)
      ? list.filter((c) => c && c.id && c.label && !isDefaultCategory(c.id))
      : []
    commit(safe)
  }

  return {
    categories: [...DEFAULT_CATEGORIES, ...custom],
    defaultCategories: DEFAULT_CATEGORIES,
    customCategories: custom,
    addCategory,
    removeCategory,
    replaceCustomCategories,
    isDefaultCategory,
  }
}

export default useCategories
