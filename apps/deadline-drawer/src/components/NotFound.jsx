import EmptyState from './EmptyState'
import './NotFound.css'

// 존재하지 않는 항목에 접근했을 때 보여주는 전체 화면.
export default function NotFound({ onBack }) {
  return (
    <div className="app-frame">
      <header className="notfound-header">
        <button
          type="button"
          className="notfound-header__back"
          onClick={onBack}
          aria-label="닫기"
        >
          ←
        </button>
      </header>
      <main className="app-body notfound-body">
        <EmptyState
          icon="🫥"
          title="항목을 찾을 수 없어요"
          hint="이미 삭제되었거나 잘못된 접근일 수 있어요."
        />
        <button type="button" className="notfound-back-btn" onClick={onBack}>
          목록으로 돌아가기
        </button>
      </main>
    </div>
  )
}
