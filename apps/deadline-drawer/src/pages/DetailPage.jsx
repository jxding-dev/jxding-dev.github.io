import { useState } from 'react'
import NotFound from '../components/NotFound'
import {
  formatDday,
  formatDate,
  formatDateTime,
  isOverdue,
  isDueToday,
  addDays,
  toISODateString,
} from '../utils/dateUtils'
import { getCategory } from '../data/defaultCategories'
import { getStatus, getImportanceLabel } from '../utils/labelUtils'
import './DetailPage.css'

function getTone(item) {
  if (item.status === 'completed') return 'done'
  if (item.status === 'onHold') return 'hold'
  if (isOverdue(item.dueDate)) return 'overdue'
  if (isDueToday(item.dueDate)) return 'today'
  return 'normal'
}

const POSTPONE_PRESETS = [
  { label: '내일로', offset: 1 },
  { label: '3일 뒤', offset: 3 },
  { label: '1주 뒤', offset: 7 },
]

export default function DetailPage({
  item,
  onBack,
  onEdit,
  onComplete,
  onPostpone,
  onHold,
  onRestore,
  onDelete,
}) {
  const [postponeOpen, setPostponeOpen] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  if (!item) return <NotFound onBack={onBack} />

  const tone = getTone(item)
  const category = getCategory(item.category)
  const status = getStatus(item.status)
  const s = item.status

  const applyPostpone = (offset) => {
    onPostpone(toISODateString(addDays(new Date(), offset)))
    setPostponeOpen(false)
  }
  const applyCustomDate = (value) => {
    if (value) {
      onPostpone(value)
      setPostponeOpen(false)
    }
  }

  return (
    <div className="app-frame">
      <header className="detail-header">
        <button
          type="button"
          className="detail-header__back"
          onClick={onBack}
          aria-label="닫기"
        >
          ←
        </button>
        <span className="detail-header__eyebrow">기한 상세</span>
      </header>

      <main className="app-body detail">
        {/* 핵심 요약 */}
        <section className="detail-hero" data-tone={tone}>
          <span className="detail-hero__dday">
            {item.dueDate ? formatDday(item.dueDate) : '–'}
          </span>
          <h1 className="detail-hero__title">{item.title}</h1>
          <div className="detail-hero__badges">
            <span className="detail-badge">
              <span aria-hidden="true">{category.icon}</span>
              {category.label}
            </span>
            <span className="detail-badge" data-status={item.status}>
              {status.label}
            </span>
            {item.importance === 'high' && (
              <span className="detail-badge detail-badge--high">중요</span>
            )}
          </div>
        </section>

        {/* 기본 정보 */}
        <dl className="detail-meta">
          <div className="detail-meta__row">
            <dt>마감일</dt>
            <dd>{item.dueDate ? formatDate(item.dueDate, 'short') : '미정'}</dd>
          </div>
          <div className="detail-meta__row">
            <dt>중요도</dt>
            <dd>{getImportanceLabel(item.importance)}</dd>
          </div>
          <div className="detail-meta__row">
            <dt>상태</dt>
            <dd>{status.label}</dd>
          </div>
          <div className="detail-meta__row">
            <dt>미룬 횟수</dt>
            <dd>{item.postponedCount ?? 0}회</dd>
          </div>
        </dl>

        {/* 메모 */}
        {item.memo ? (
          <section className="detail-memo">
            <h2 className="detail-section-title">메모</h2>
            <p className="detail-memo__text">{item.memo}</p>
          </section>
        ) : null}

        {/* 상태 변경 액션 */}
        <section className="detail-block">
          <h2 className="detail-section-title">상태 변경</h2>
          <div className="detail-actions">
            {s !== 'completed' && (
              <button
                type="button"
                className="act act--primary"
                onClick={onComplete}
              >
                완료 처리
              </button>
            )}
            {s !== 'completed' && (
              <button
                type="button"
                className="act"
                onClick={() => setPostponeOpen((v) => !v)}
              >
                미루기
              </button>
            )}
            {s !== 'onHold' && s !== 'completed' && (
              <button type="button" className="act" onClick={onHold}>
                보류
              </button>
            )}
            {s !== 'pending' && (
              <button type="button" className="act" onClick={onRestore}>
                다시 예정으로
              </button>
            )}
          </div>

          {postponeOpen && (
            <div className="postpone-panel">
              {POSTPONE_PRESETS.map((p) => (
                <button
                  key={p.offset}
                  type="button"
                  className="postpone-opt"
                  onClick={() => applyPostpone(p.offset)}
                >
                  {p.label}
                </button>
              ))}
              <label className="postpone-custom">
                직접 선택
                <input
                  type="date"
                  defaultValue={item.dueDate ?? ''}
                  onChange={(e) => applyCustomDate(e.target.value)}
                />
              </label>
            </div>
          )}
        </section>

        {/* 관리 (수정 / 삭제) */}
        <section className="detail-block">
          <h2 className="detail-section-title">관리</h2>
          <div className="detail-manage">
            <button type="button" className="act" onClick={onEdit}>
              수정
            </button>
            {!confirmOpen && (
              <button
                type="button"
                className="act act--danger"
                onClick={() => setConfirmOpen(true)}
              >
                삭제
              </button>
            )}
          </div>

          {confirmOpen && (
            <div className="confirm-box" role="alertdialog" aria-label="삭제 확인">
              <p className="confirm-box__text">
                정말 삭제할까요? <strong>되돌릴 수 없어요.</strong>
              </p>
              <div className="confirm-box__actions">
                <button
                  type="button"
                  className="act"
                  onClick={() => setConfirmOpen(false)}
                >
                  취소
                </button>
                <button
                  type="button"
                  className="act act--danger-solid"
                  onClick={onDelete}
                >
                  삭제
                </button>
              </div>
            </div>
          )}
        </section>

        {/* 기록 */}
        <dl className="detail-stamps">
          <div>
            <dt>등록</dt>
            <dd>{formatDateTime(item.createdAt)}</dd>
          </div>
          <div>
            <dt>수정</dt>
            <dd>{formatDateTime(item.updatedAt)}</dd>
          </div>
        </dl>
      </main>
    </div>
  )
}
