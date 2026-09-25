// 마감 항목 상태 + localStorage 영속화 + CRUD/상태전이 훅.
// App.jsx 에서 한 번 호출하고, 반환된 함수들을 하위 컴포넌트로 내려 쓴다.

import { useEffect, useState } from 'react'
import { SAMPLE_DEADLINES } from '../data/sampleDeadlines'
import { DEFAULT_CATEGORY_ID } from '../data/defaultCategories'
import { readJSON, writeJSON } from '../utils/storage'
import { createId } from '../utils/id'
import { nowISO } from '../utils/dateUtils'

export const STORAGE_KEY = 'deadline-drawer-items'

// 저장된 값이 없을 때만 샘플로 시드한다. (배열이 아니면 깨진 값으로 보고 시드)
function loadInitial() {
  const stored = readJSON(STORAGE_KEY, null)
  if (Array.isArray(stored)) return stored
  return SAMPLE_DEADLINES
}

// 입력값으로 완전한 마감 항목을 만든다. 누락 필드는 기본값으로 채운다.
function createDeadline(input = {}) {
  const ts = nowISO()
  return {
    id: createId(),
    title: input.title?.trim() || '제목 없음',
    category: input.category || DEFAULT_CATEGORY_ID,
    dueDate: input.dueDate || null,
    importance: input.importance || 'medium',
    status: input.status || 'pending',
    memo: input.memo || '',
    createdAt: ts,
    updatedAt: ts,
    postponedCount: 0,
    completedAt: null,
  }
}

export function useDeadlines() {
  const [deadlines, setDeadlines] = useState(loadInitial)

  // 변경될 때마다 자동 저장.
  useEffect(() => {
    writeJSON(STORAGE_KEY, deadlines)
  }, [deadlines])

  // 특정 id 항목에 patch 를 머지하고 updatedAt 을 자동 갱신하는 공통 헬퍼.
  function patchById(id, patch) {
    setDeadlines((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              ...(typeof patch === 'function' ? patch(item) : patch),
              updatedAt: nowISO(),
            }
          : item,
      ),
    )
  }

  // 새 항목 추가. 생성된 항목을 반환한다.
  function addDeadline(input) {
    const item = createDeadline(input)
    setDeadlines((prev) => [item, ...prev])
    return item
  }

  // 임의 필드 수정. (updatedAt 자동 갱신)
  function updateDeadline(id, patch) {
    patchById(id, patch)
  }

  function deleteDeadline(id) {
    setDeadlines((prev) => prev.filter((item) => item.id !== id))
  }

  // 완료 처리 — completedAt 기록.
  function completeDeadline(id) {
    patchById(id, { status: 'completed', completedAt: nowISO() })
  }

  // 미룸 처리 — postponedCount 증가, newDueDate 가 주어지면 dueDate 교체.
  function postponeDeadline(id, newDueDate) {
    patchById(id, (item) => ({
      status: 'postponed',
      postponedCount: (item.postponedCount ?? 0) + 1,
      dueDate: newDueDate ?? item.dueDate,
    }))
  }

  // 보류 처리 — 기한 계산 목록에서 따로 구분하기 위한 상태.
  function holdDeadline(id) {
    patchById(id, { status: 'onHold' })
  }

  // 대기 상태로 되돌림 — 완료 기록 해제.
  function restoreDeadline(id) {
    patchById(id, { status: 'pending', completedAt: null })
  }

  // 카테고리 삭제 시 해당 카테고리를 쓰던 기한을 다른 카테고리로 옮긴다.
  function reassignCategory(fromId, toId = 'etc') {
    setDeadlines((prev) =>
      prev.map((item) =>
        item.category === fromId
          ? { ...item, category: toId, updatedAt: nowISO() }
          : item,
      ),
    )
  }

  // 백업 불러오기 — 검증된 목록으로 통째 교체.
  function importDeadlines(list) {
    if (Array.isArray(list)) setDeadlines(list)
  }

  // 샘플 데이터로 초기화.
  function resetDeadlines() {
    setDeadlines(SAMPLE_DEADLINES)
  }

  // 전체 데이터 삭제.
  function clearDeadlines() {
    setDeadlines([])
  }

  return {
    deadlines,
    addDeadline,
    updateDeadline,
    deleteDeadline,
    completeDeadline,
    postponeDeadline,
    holdDeadline,
    restoreDeadline,
    reassignCategory,
    importDeadlines,
    resetDeadlines,
    clearDeadlines,
  }
}

export default useDeadlines
