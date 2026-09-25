import { useRef, useState } from 'react'

function RestrictedRoom() {
  const [open, setOpen] = useState(false)
  const [alertVisible, setAlertVisible] = useState(false)
  const [alertKey, setAlertKey] = useState(0)
  const alertTimer = useRef(null)
  const pointerTriggered = useRef(false)

  const handleReveal = () => {
    setOpen(true)
    setAlertVisible(false)

    if (alertTimer.current) {
      window.clearTimeout(alertTimer.current)
    }

    window.setTimeout(() => {
      setAlertKey((key) => key + 1)
      setAlertVisible(true)
    }, 20)

    alertTimer.current = window.setTimeout(() => {
      setAlertVisible(false)
      alertTimer.current = null
    }, 1450)
  }

  const handlePointerDown = () => {
    pointerTriggered.current = true
    handleReveal()
  }

  const handleClick = () => {
    if (pointerTriggered.current) {
      pointerTriggered.current = false
      return
    }

    handleReveal()
  }

  return (
    <section className={open ? 'restricted section-shell is-open' : 'restricted section-shell'} id="restricted-room">
      <div className="restricted-copy">
        <p className="section-kicker">제4전시실 / 제한 구역</p>
        <h2 className="glitch" data-text="이 방은 당신을 먼저 기억합니다.">이 방은 당신을 먼저 기억합니다.</h2>
        <p>
          열람 제한 구역입니다. 기록이 흐릿하게 보인다면 아직 박물관이 관람자를 분류하는 중입니다.
        </p>
      </div>
      <button
        className="restricted-panel"
        type="button"
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        data-cursor="개봉"
        data-testid="restricted-panel"
      >
        <span>{open ? '열람 기록 복구됨' : '눌러서 봉인 해제'}</span>
        <strong>{open ? '당신은 이 방을 처음 본 것이 아닙니다.' : '제한 자료'}</strong>
      </button>
      {alertVisible && (
        <div className="restricted-alert" key={alertKey} aria-live="polite" aria-atomic="true">
          <span data-text="제한된 자료입니다">제한된 자료입니다</span>
        </div>
      )}
    </section>
  )
}

export default RestrictedRoom
