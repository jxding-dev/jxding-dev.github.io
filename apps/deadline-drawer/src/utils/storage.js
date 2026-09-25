// localStorage 안전 래퍼.
// 파싱 실패 / 접근 불가(프라이빗 모드 등)에도 앱이 깨지지 않도록 방어한다.

/** key 의 JSON 값을 읽는다. 없거나 깨졌으면 fallback 반환. */
export function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    if (raw == null) return fallback
    return JSON.parse(raw)
  } catch (err) {
    console.warn(`[storage] "${key}" 읽기 실패 — 기본값 사용`, err)
    return fallback
  }
}

/** value 를 JSON 으로 직렬화해 저장. 실패해도 throw 하지 않는다. */
export function writeJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (err) {
    console.warn(`[storage] "${key}" 저장 실패`, err)
    return false
  }
}

/** key 삭제. */
export function removeKey(key) {
  try {
    localStorage.removeItem(key)
  } catch (err) {
    console.warn(`[storage] "${key}" 삭제 실패`, err)
  }
}
