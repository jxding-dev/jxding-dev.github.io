function ExhibitPage({ room, onClose }) {
  if (!room) return null

  return (
    <aside className="exhibit-page" aria-modal="true" role="dialog" aria-labelledby="exhibit-page-title">
      <div className="exhibit-page__chrome">
        <p>{room.code}</p>
        <a href="#corridor" data-close-room onClick={onClose}>
          복도로 돌아가기
        </a>
      </div>

      <div className="exhibit-page__body">
        <div className="exhibit-page__title">
          <span>{room.title}</span>
          <h2 id="exhibit-page-title">{room.pageTitle}</h2>
        </div>

        <p className="exhibit-page__lead">{room.pageLead}</p>

        <div className="exhibit-page__grid">
          {room.pageNotes.map((note, index) => (
            <article key={note}>
              <span>기록 {String(index + 1).padStart(2, '0')}</span>
              <p>{note}</p>
            </article>
          ))}
        </div>
      </div>
    </aside>
  )
}

export default ExhibitPage
