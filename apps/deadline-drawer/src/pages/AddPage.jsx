import DeadlineForm from '../components/DeadlineForm'
import './AddPage.css'

// 새 기한 추가 화면. 자체 헤더 + 폼으로 구성된 풀스크린 푸시 화면.
export default function AddPage({ onSave, onCancel, categories }) {
  return (
    <div className="app-frame">
      <header className="add-header">
        <button
          type="button"
          className="add-header__back"
          onClick={onCancel}
          aria-label="닫기"
        >
          ←
        </button>
        <h1 className="add-header__title">새 기한 추가</h1>
      </header>

      <DeadlineForm
        onSubmit={onSave}
        onCancel={onCancel}
        categories={categories}
      />
    </div>
  )
}
