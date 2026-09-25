import { useRef, useState } from 'react'
import { isDefaultCategory } from '../data/defaultCategories'
import Icon from '../components/Icon'
import { getCategoryIconName } from '../components/iconNames'
import './SettingsPage.css'

const APP_VERSION = 'v1.0.0'
const ICON_PRESETS = ['🏷️', '🎯', '💳', '🎓', '🏠', '🚗', '🐾', '🎁', '💊', '✈️']

export default function SettingsPage({
  categories = [],
  onAddCategory,
  onRemoveCategory,
  onExport,
  onImportFile,
  onReset,
  onClear,
  onBack,
}) {
  const [label, setLabel] = useState('')
  const [icon, setIcon] = useState(ICON_PRESETS[0])
  const [message, setMessage] = useState(null) // { tone, text }
  const [pending, setPending] = useState(null) // 'reset' | 'clear' | null
  const fileRef = useRef(null)

  const handleAdd = () => {
    const item = onAddCategory({ label, icon })
    if (!item) {
      setMessage({ tone: 'error', text: '카테고리 이름을 입력해 주세요.' })
      return
    }
    setLabel('')
    setIcon(ICON_PRESETS[0])
    setMessage({ tone: 'ok', text: `'${item.label}' 카테고리를 추가했어요.` })
  }

  const handleImportChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const res = await onImportFile(file)
    if (res.ok) {
      setMessage({ tone: 'ok', text: `${res.count}건을 불러왔어요.` })
    } else {
      setMessage({ tone: 'error', text: res.error })
    }
    e.target.value = '' // 같은 파일 다시 선택 가능하게
  }

  const runPending = () => {
    if (pending === 'reset') {
      onReset()
      setMessage({ tone: 'ok', text: '샘플 데이터로 초기화했어요.' })
    } else if (pending === 'clear') {
      onClear()
      setMessage({ tone: 'ok', text: '전체 데이터를 삭제했어요.' })
    }
    setPending(null)
  }

  return (
    <div className="app-frame">
      <header className="settings-header">
        <button
          type="button"
          className="settings-header__back"
          onClick={onBack}
          aria-label="닫기"
        >
          ←
        </button>
        <h1 className="settings-header__title">설정</h1>
      </header>

      <main className="app-body settings">
        {message && (
          <p className="settings-msg" data-tone={message.tone}>
            {message.text}
          </p>
        )}

        {/* 카테고리 관리 */}
        <section className="settings-card">
          <h2 className="settings-card__title">카테고리 관리</h2>

          <ul className="cat-list">
            {categories.map((c) => {
              const isDefault = isDefaultCategory(c.id)
              return (
                <li className="cat-item" key={c.id}>
                  <span className="cat-item__main">
                    {isDefault ? (
                      <Icon name={getCategoryIconName(c.id)} size={17} />
                    ) : (
                      <span aria-hidden="true">{c.icon}</span>
                    )}
                    {c.label}
                  </span>
                  {isDefault ? (
                    <span className="cat-item__badge">기본</span>
                  ) : (
                    <button
                      type="button"
                      className="cat-item__remove"
                      onClick={() => onRemoveCategory(c.id)}
                      aria-label={`${c.label} 삭제`}
                    >
                      삭제
                    </button>
                  )}
                </li>
              )
            })}
          </ul>

          <div className="cat-add">
            <div className="cat-add__icons">
              {ICON_PRESETS.map((emo) => (
                <button
                  key={emo}
                  type="button"
                  className="cat-add__icon"
                  data-active={icon === emo}
                  onClick={() => setIcon(emo)}
                  aria-label={`아이콘 ${emo}`}
                >
                  {emo}
                </button>
              ))}
            </div>
            <div className="cat-add__row">
              <input
                className="cat-add__input"
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                placeholder="새 카테고리 이름"
                maxLength={12}
              />
              <button
                type="button"
                className="btn btn--primary cat-add__btn"
                onClick={handleAdd}
              >
                추가
              </button>
            </div>
            <p className="settings-hint">
              삭제하면 그 카테고리의 기한은 '기타'로 바뀌어요.
            </p>
          </div>
        </section>

        {/* 데이터 관리 */}
        <section className="settings-card">
          <h2 className="settings-card__title">데이터 관리</h2>
          <div className="settings-actions">
            <button type="button" className="btn" onClick={onExport}>
              JSON 내보내기
            </button>
            <button
              type="button"
              className="btn"
              onClick={() => fileRef.current?.click()}
            >
              JSON 불러오기
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            hidden
            onChange={handleImportChange}
          />
        </section>

        {/* 앱 정보 */}
        <section className="settings-card">
          <h2 className="settings-card__title">앱 정보</h2>
          <dl className="info-list">
            <div className="info-list__row">
              <dt>앱 이름</dt>
              <dd>까먹지말자</dd>
            </div>
            <div className="info-list__row">
              <dt>저장 방식</dt>
              <dd>이 기기에만 저장</dd>
            </div>
            <div className="info-list__row">
              <dt>버전</dt>
              <dd>{APP_VERSION}</dd>
            </div>
          </dl>
        </section>

        {/* 위험 영역 — 하단 배치 */}
        <section className="settings-card settings-card--danger">
          <h2 className="settings-card__title">위험 구역</h2>

          {pending === null && (
            <div className="settings-actions">
              <button
                type="button"
                className="btn"
                onClick={() => setPending('reset')}
              >
                샘플로 초기화
              </button>
              <button
                type="button"
                className="btn btn--danger"
                onClick={() => setPending('clear')}
              >
                전체 삭제
              </button>
            </div>
          )}

          {pending !== null && (
            <div className="confirm-box" role="alertdialog">
              <p className="confirm-box__text">
                {pending === 'reset'
                  ? '현재 데이터를 모두 지우고 샘플로 되돌릴까요?'
                  : '모든 기한을 삭제할까요?'}{' '}
                <strong>되돌릴 수 없어요.</strong>
              </p>
              <div className="confirm-box__actions">
                <button
                  type="button"
                  className="btn"
                  onClick={() => setPending(null)}
                >
                  취소
                </button>
                <button
                  type="button"
                  className="btn btn--danger-solid"
                  onClick={runPending}
                >
                  {pending === 'reset' ? '초기화' : '삭제'}
                </button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
