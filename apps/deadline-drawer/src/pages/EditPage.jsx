import DeadlineForm from '../components/DeadlineForm'
import NotFound from '../components/NotFound'
import './AddPage.css'

// 기한 수정 화면. AddPage 헤더 스타일을 공유하고 DeadlineForm 을 수정 모드로 재사용.
export default function EditPage({ item, onSave, onCancel, categories }) {
  if (!item) {
    return <NotFound onBack={onCancel} />
  }

  const initialValues = {
    title: item.title ?? '',
    category: item.category ?? '',
    dueDate: item.dueDate ?? '',
    importance: item.importance ?? '',
    memo: item.memo ?? '',
  }

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
        <h1 className="add-header__title">기한 수정</h1>
      </header>

      <DeadlineForm
        initialValues={initialValues}
        submitLabel="수정 완료"
        onSubmit={onSave}
        onCancel={onCancel}
        categories={categories}
      />
    </div>
  )
}
