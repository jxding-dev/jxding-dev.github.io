import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from 'gsap'

function DreamStorage({ dreams }) {
  const sectionRef = useRef(null)
  const [selectedDream, setSelectedDream] = useState(null)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      gsap.fromTo(
        '.dream-paper',
        { y: 120, rotate: -8, opacity: 0 },
        {
          y: 0,
          rotate: (index) => [-5, 3, -2, 5][index],
          opacity: 1,
          stagger: 0.18,
          ease: 'power3.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 62%' },
        },
      )
    }, sectionRef)

    return () => ctx.revert()
  }, [])

  useEffect(() => {
    if (!selectedDream) return undefined

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedDream(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedDream])

  return (
    <section ref={sectionRef} className="dream-storage section-shell" id="dream-storage">
      <div className="section-heading">
        <p className="section-kicker">제1전시실 / 꿈 보관소</p>
        <h2 data-reveal>꿈은 종이로 보관됩니다. 종이는 낡는 법을 알고 있으니까요.</h2>
      </div>
      <div className="paper-stack">
        {dreams.map((dream) => (
          <button
            aria-label={`${dream.title} 상세 기록 열기`}
            className="dream-paper"
            key={dream.title}
            type="button"
            onClick={() => setSelectedDream(dream)}
            data-cursor="열람"
          >
            <span className="paper-date">{dream.date}</span>
            <h3>{dream.title}</h3>
            <p>{dream.line}</p>
            <small>{dream.emotion}</small>
          </button>
        ))}
      </div>
      {selectedDream && (
        <div
          className="dream-modal"
          role="dialog"
          aria-modal="true"
          aria-labelledby="dream-modal-title"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedDream(null)
            }
          }}
        >
          <article className="dream-modal__paper">
            <button
              className="dream-modal__close"
              type="button"
              onClick={() => setSelectedDream(null)}
              data-cursor="닫기"
            >
              창닫기
            </button>
            <span className="paper-date">{selectedDream.date}</span>
            <h3 id="dream-modal-title">{selectedDream.title}</h3>
            <p className="dream-modal__line">{selectedDream.line}</p>
            <p className="dream-modal__body">{selectedDream.body}</p>
            <small>{selectedDream.emotion}</small>
          </article>
        </div>
      )}
    </section>
  )
}

export default DreamStorage
