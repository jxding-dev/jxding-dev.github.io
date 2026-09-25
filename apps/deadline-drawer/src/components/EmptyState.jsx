import './EmptyState.css'

// 목록이 비었을 때 보여주는 공용 빈 상태 카드.
export default function EmptyState({ icon = '🗂️', title, hint }) {
  return (
    <div className="empty-state">
      <span className="empty-state__icon" aria-hidden="true">
        {icon}
      </span>
      <p className="empty-state__title">{title}</p>
      {hint && <p className="empty-state__hint">{hint}</p>}
    </div>
  )
}
