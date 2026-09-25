import { useState } from 'react'
import { getAllCategories } from '../data/defaultCategories'
import { IMPORTANCE } from '../utils/labelUtils'
import { addDays, toISODateString } from '../utils/dateUtils'
import './DeadlineForm.css'

// 중요도 선택은 낮음 → 보통 → 높음 순으로 노출.
const IMPORTANCE_OPTIONS = ['low', 'medium', 'high'].map((id) => ({
  id,
  ...IMPORTANCE[id],
}))

// 마감일 빠른 선택.
const DATE_PRESETS = [
  { label: '오늘', offset: 0 },
  { label: '내일', offset: 1 },
  { label: '+7일', offset: 7 },
]

const EMPTY = {
  title: '',
  category: '',
  dueDate: '',
  importance: '',
  memo: '',
}

function validate(values) {
  const errors = {}
  if (!values.title.trim()) errors.title = '제목을 입력해 주세요.'
  if (!values.category) errors.category = '카테고리를 선택해 주세요.'
  if (!values.dueDate) errors.dueDate = '마감일을 선택해 주세요.'
  if (!values.importance) errors.importance = '중요도를 선택해 주세요.'
  return errors
}

export default function DeadlineForm({
  onSubmit,
  onCancel,
  initialValues,
  submitLabel = '저장',
  categories = getAllCategories(),
}) {
  // 수정 모드면 기존 값으로 채운다.
  const [values, setValues] = useState(() => ({ ...EMPTY, ...initialValues }))
  const [errors, setErrors] = useState({})

  // 값 변경 시 해당 필드 에러는 즉시 해제.
  function setField(name, value) {
    setValues((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => (prev[name] ? { ...prev, [name]: undefined } : prev))
  }

  function handleSubmit(e) {
    e.preventDefault()
    const nextErrors = validate(values)
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }
    onSubmit({
      title: values.title.trim(),
      category: values.category,
      dueDate: values.dueDate,
      importance: values.importance,
      memo: values.memo.trim(),
    })
  }

  return (
    <form className="deadline-form" onSubmit={handleSubmit} noValidate>
      <div className="deadline-form__fields">
        {/* 제목 */}
        <label className="field">
          <span className="field__label">제목</span>
          <input
            className="field__input"
            type="text"
            value={values.title}
            onChange={(e) => setField('title', e.target.value)}
            placeholder="예: 넷플릭스 무료체험 해지"
            maxLength={60}
            autoComplete="off"
          />
          {errors.title && <span className="field__error">{errors.title}</span>}
        </label>

        {/* 카테고리 */}
        <div className="field">
          <span className="field__label">카테고리</span>
          <div className="choice-grid">
            {categories.map((c) => (
              <button
                key={c.id}
                type="button"
                className="choice"
                data-active={values.category === c.id}
                onClick={() => setField('category', c.id)}
              >
                <span aria-hidden="true">{c.icon}</span>
                {c.label}
              </button>
            ))}
          </div>
          {errors.category && (
            <span className="field__error">{errors.category}</span>
          )}
        </div>

        {/* 마감일 */}
        <div className="field">
          <span className="field__label">마감일</span>
          <input
            className="field__input"
            type="date"
            value={values.dueDate}
            onChange={(e) => setField('dueDate', e.target.value)}
          />
          <div className="date-presets">
            {DATE_PRESETS.map((p) => (
              <button
                key={p.label}
                type="button"
                className="date-preset"
                onClick={() =>
                  setField('dueDate', toISODateString(addDays(new Date(), p.offset)))
                }
              >
                {p.label}
              </button>
            ))}
          </div>
          {errors.dueDate && (
            <span className="field__error">{errors.dueDate}</span>
          )}
        </div>

        {/* 중요도 */}
        <div className="field">
          <span className="field__label">중요도</span>
          <div className="segmented">
            {IMPORTANCE_OPTIONS.map((opt) => (
              <button
                key={opt.id}
                type="button"
                className="segmented__item"
                data-active={values.importance === opt.id}
                data-color={opt.color}
                onClick={() => setField('importance', opt.id)}
              >
                {opt.label}
              </button>
            ))}
          </div>
          {errors.importance && (
            <span className="field__error">{errors.importance}</span>
          )}
        </div>

        {/* 메모 (선택) */}
        <label className="field">
          <span className="field__label">
            메모 <span className="field__optional">선택</span>
          </span>
          <textarea
            className="field__input field__textarea"
            value={values.memo}
            onChange={(e) => setField('memo', e.target.value)}
            placeholder="놓치면 안 되는 이유, 준비물 등"
            rows={3}
            maxLength={300}
          />
        </label>
      </div>

      <div className="deadline-form__actions">
        <button
          type="button"
          className="form-btn form-btn--ghost"
          onClick={onCancel}
        >
          취소
        </button>
        <button type="submit" className="form-btn form-btn--primary">
          {submitLabel}
        </button>
      </div>
    </form>
  )
}
