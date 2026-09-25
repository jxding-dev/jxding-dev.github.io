import { useLayoutEffect, useRef } from 'react'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

function Corridor({ rooms, onOpenRoom }) {
  const sectionRef = useRef(null)
  const trackRef = useRef(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()

    mm.add('(min-width: 761px) and (prefers-reduced-motion: no-preference)', () => {
      if (!sectionRef.current || !trackRef.current) return undefined

      const tween = gsap.to(trackRef.current, {
        x: () => -(trackRef.current.scrollWidth - window.innerWidth + 80),
        ease: 'none',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top top',
          end: () => `+=${trackRef.current.scrollWidth}`,
          scrub: 0.7,
          pin: true,
          invalidateOnRefresh: true,
        },
      })

      ScrollTrigger.refresh()

      return () => {
        tween.scrollTrigger?.kill()
        tween.kill()
      }
    })

    return () => mm.revert()
  }, [])

  return (
    <section ref={sectionRef} className="corridor" id="corridor">
      <div className="corridor-fog" aria-hidden="true" />
      <div className="corridor-warning" aria-hidden="true">
        <span>관람자 추적 중</span>
        <span>복도 기록 불안정</span>
        <span>뒤돌아보지 마십시오</span>
      </div>
      <div className="corridor-track" ref={trackRef}>
        <div className="corridor-title">
          <p>긴 복도 / 벽면 색인</p>
          <h2>박물관 복도</h2>
          <div className="corridor-signal" aria-hidden="true">
            <i />
            <span>비상등이 정상적인 방향으로 깜빡이지 않습니다.</span>
          </div>
        </div>
        {rooms.map((room, index) => (
          <a
            aria-label={`${room.title} 페이지 열기`}
            className={`wall-sign wall-sign-${index + 1}`}
            data-room={room.slug}
            href={`#page-${room.slug}`}
            key={room.title}
            onClick={() => onOpenRoom(room)}
            data-cursor="입장"
          >
            <b aria-hidden="true" />
            <span>{room.code}</span>
            <h3>{room.title}</h3>
            <p>{room.text}</p>
            <small>{index % 2 === 0 ? '복도 끝에서 같은 발소리가 반복됩니다.' : '문틈 아래로 붉은 빛이 새고 있습니다.'}</small>
            <em>전시실 페이지 열기</em>
          </a>
        ))}
      </div>
    </section>
  )
}

export default Corridor
