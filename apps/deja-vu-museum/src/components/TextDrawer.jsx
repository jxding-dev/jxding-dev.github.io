import { useState } from 'react'
import { motion } from 'motion/react'

function TextDrawer({ notes }) {
  const [offsets, setOffsets] = useState(() => notes.map(() => ({ x: 0, y: 0 })))

  const evadeNote = (event, index) => {
    if (event.pointerType === 'touch') return

    const rect = event.currentTarget.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2
    const directionX = event.clientX < centerX ? 1 : -1
    const directionY = event.clientY < centerY ? 1 : -1
    const strength = 34 + (index % 4) * 10

    setOffsets((current) =>
      notes.map((_, offsetIndex) => {
        const offset = current[offsetIndex] || { x: 0, y: 0 }

        return offsetIndex === index
          ? {
              x: Math.max(-90, Math.min(90, offset.x + directionX * strength)),
              y: Math.max(-54, Math.min(54, offset.y + directionY * Math.round(strength * 0.55))),
            }
          : offset
      }),
    )
  }

  return (
    <section className="text-drawer section-shell" id="text-drawer">
      <div className="drawer-head">
        <p className="section-kicker">제3전시실 / 문장 서랍</p>
        <h2 data-reveal>서랍에서 꺼낸 문장 조각은 순서를 자주 잃어버립니다.</h2>
      </div>
      <div className="drawer-slab">
        {notes.map((note, index) => (
          <motion.article
            animate={{ x: offsets[index]?.x || 0, y: offsets[index]?.y || 0 }}
            drag
            dragElastic={0.2}
            onPointerDown={(event) => evadeNote(event, index)}
            onPointerEnter={(event) => evadeNote(event, index)}
            transition={{ type: 'spring', stiffness: 260, damping: 18 }}
            whileDrag={{ scale: 1.04, rotate: index % 2 ? -4 : 4, zIndex: 4 }}
            whileHover={{ y: -8, rotate: index % 2 ? -2 : 2 }}
            className="note-card"
            key={note}
            data-cursor="이동"
            role="group"
            tabIndex={0}
            aria-label={`이동 가능한 메모 ${index + 1}: ${note}`}
            aria-roledescription="이동 가능한 메모"
          >
            <span>메모 {String(index + 1).padStart(2, '0')}</span>
            <p>{note}</p>
          </motion.article>
        ))}
      </div>
    </section>
  )
}

export default TextDrawer
