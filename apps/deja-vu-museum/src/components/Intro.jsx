import { lazy, Suspense, useEffect, useState } from 'react'
import { motion } from 'motion/react'

const HeroRelic3D = lazy(() => import('./HeroRelic3D'))

function useRelic3DEnabled() {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const media = window.matchMedia('(min-width: 761px) and (prefers-reduced-motion: no-preference)')
    const sync = () => setEnabled(media.matches)

    sync()
    media.addEventListener('change', sync)
    return () => media.removeEventListener('change', sync)
  }, [])

  return enabled
}

function Intro({ entered, onEnter }) {
  const showRelic3D = useRelic3DEnabled()

  return (
    <section className="intro" id="entrance">
      <div className="light-field" aria-hidden="true" />
      <div className="intro-grid">
        <div className="intro-copy">
          <p className="museum-label">기시감 박물관</p>
          <motion.h1 initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.1 }}>
            기시감
            <span>박물관</span>
          </motion.h1>
          <p className="intro-text">
            꿈, 기억, 이미지, 문장 조각이 잘못 보관된 가상 박물관. 입장 기록은 관람이 끝난 뒤에야 작성됩니다.
          </p>
          <button data-cursor="입장" className="enter-button" type="button" onClick={onEnter}>
            잘못 보관된 기록실 입장
          </button>
        </div>
        <div className="relic-stage" data-cursor="전시물">
          {showRelic3D ? (
            <Suspense fallback={<div className="relic-fallback" aria-hidden="true" />}>
              <HeroRelic3D />
            </Suspense>
          ) : (
            <div className="relic-fallback" aria-hidden="true" />
          )}
          <span className="relic-caption">목록 번호 / 불안정한 전시물 00</span>
        </div>
      </div>
      <motion.div
        className="black-curtain"
        initial={{ scaleY: 0 }}
        animate={entered ? { scaleY: [0, 1, 0] } : { scaleY: 0 }}
        transition={{ duration: 0.9, ease: [0.76, 0, 0.24, 1] }}
      />
    </section>
  )
}

export default Intro
