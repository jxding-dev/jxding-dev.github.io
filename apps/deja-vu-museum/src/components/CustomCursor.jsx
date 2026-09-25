import { useEffect, useRef } from 'react'

function CustomCursor() {
  const cursorRef = useRef(null)
  const labelRef = useRef(null)
  const frameRef = useRef(0)
  const pointRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const finePointer = window.matchMedia('(pointer: fine)').matches
    if (!finePointer) return undefined

    const draw = () => {
      frameRef.current = 0
      if (!cursorRef.current) return
      cursorRef.current.style.transform = `translate(${pointRef.current.x}px, ${pointRef.current.y}px)`
    }

    const findTarget = (event, selector) => {
      if (!(event.target instanceof Element)) return null
      return event.target.closest(selector)
    }

    const updateCursorState = (event) => {
      const inCorridor = Boolean(findTarget(event, '#corridor'))
      const target = findTarget(event, 'button, a, [data-cursor]')
      cursorRef.current?.classList.toggle('is-corridor', inCorridor)
      cursorRef.current?.classList.toggle('is-active', Boolean(target))
      if (labelRef.current) {
        labelRef.current.textContent = target?.dataset.cursor || (target ? '열람' : inCorridor ? '복도 감지' : '')
      }
    }

    const move = (event) => {
      pointRef.current = { x: event.clientX, y: event.clientY }
      document.documentElement.style.setProperty('--mouse-x', `${event.clientX}px`)
      document.documentElement.style.setProperty('--mouse-y', `${event.clientY}px`)
      updateCursorState(event)
      if (!frameRef.current) frameRef.current = window.requestAnimationFrame(draw)
    }

    const over = (event) => {
      updateCursorState(event)
    }

    window.addEventListener('pointermove', move)
    window.addEventListener('pointerover', over)
    return () => {
      if (frameRef.current) window.cancelAnimationFrame(frameRef.current)
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerover', over)
    }
  }, [])

  return (
    <div className="custom-cursor" ref={cursorRef} aria-hidden="true">
      <span ref={labelRef} />
    </div>
  )
}

export default CustomCursor
