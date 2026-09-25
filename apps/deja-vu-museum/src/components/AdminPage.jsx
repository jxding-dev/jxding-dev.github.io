import { useMemo, useState } from 'react'
import { clearAdminSession, hasAdminSession, verifyAdminPassphrase } from '../adminAuth'

const blankDream = {
  date: '',
  emotion: '',
  title: '',
  line: '',
  body: '',
}

const blankImage = {
  tag: '꿈',
  title: '',
  mark: '',
  src: '',
}

const blankRoom = {
  slug: '',
  code: '',
  title: '',
  text: '',
  pageTitle: '',
  pageLead: '',
  pageNotes: '',
}

function Field({ label, children }) {
  return (
    <label className="admin-field">
      <span>{label}</span>
      {children}
    </label>
  )
}

function AdminPage({ data, onChange, onClose, onReset }) {
  const [authorized, setAuthorized] = useState(hasAdminSession)
  const [passphrase, setPassphrase] = useState('')
  const [authError, setAuthError] = useState('')
  const [authPending, setAuthPending] = useState(false)
  const [dreamForm, setDreamForm] = useState(blankDream)
  const [imageForm, setImageForm] = useState(blankImage)
  const [noteForm, setNoteForm] = useState('')
  const [roomForm, setRoomForm] = useState(blankRoom)
  const [copyState, setCopyState] = useState('JSON 복사')
  const [editing, setEditing] = useState(null)

  const exportJson = useMemo(() => JSON.stringify(data, null, 2), [data])
  const isEditing = (type) => editing?.type === type

  const updateDream = (key, value) => setDreamForm((form) => ({ ...form, [key]: value }))
  const updateImage = (key, value) => setImageForm((form) => ({ ...form, [key]: value }))
  const updateRoom = (key, value) => setRoomForm((form) => ({ ...form, [key]: value }))

  const selectImageFile = (event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.addEventListener('load', () => {
      setImageForm((form) => ({
        ...form,
        src: reader.result,
        title: form.title || file.name.replace(/\.[^.]+$/, '').replaceAll('-', ' '),
      }))
    })
    reader.readAsDataURL(file)
  }

  const clearEditing = () => {
    setEditing(null)
    setDreamForm(blankDream)
    setImageForm(blankImage)
    setNoteForm('')
    setRoomForm(blankRoom)
  }

  const updateItem = (type, index, nextItem) => {
    onChange({
      ...data,
      [type]: data[type].map((item, itemIndex) => (itemIndex === index ? nextItem : item)),
    })
  }

  const saveDream = (event) => {
    event.preventDefault()
    if (!dreamForm.title.trim() || !dreamForm.line.trim()) return
    const nextDream = { ...dreamForm, title: dreamForm.title.trim(), line: dreamForm.line.trim() }

    if (isEditing('dreams')) {
      updateItem('dreams', editing.index, nextDream)
      clearEditing()
      return
    }

    onChange({
      ...data,
      dreams: [...data.dreams, nextDream],
    })
    setDreamForm(blankDream)
  }

  const saveImage = (event) => {
    event.preventDefault()
    if (!imageForm.title.trim() || !imageForm.src.trim()) return
    const nextImage = {
      ...imageForm,
      id: imageForm.id || Date.now(),
      title: imageForm.title.trim(),
      src: imageForm.src.trim(),
      mark: imageForm.mark.trim() || `${imageForm.tag}-${String(data.images.length + 1).padStart(3, '0')}`,
    }

    if (isEditing('images')) {
      updateItem('images', editing.index, nextImage)
      clearEditing()
      return
    }

    onChange({
      ...data,
      images: [...data.images, nextImage],
    })
    setImageForm(blankImage)
  }

  const saveNote = (event) => {
    event.preventDefault()
    const note = noteForm.trim()
    if (!note) return

    if (isEditing('notes')) {
      updateItem('notes', editing.index, note)
      clearEditing()
      return
    }

    onChange({ ...data, notes: [...data.notes, note] })
    setNoteForm('')
  }

  const saveRoom = (event) => {
    event.preventDefault()
    if (!roomForm.slug.trim() || !roomForm.title.trim()) return
    const nextRoom = {
      ...roomForm,
      slug: roomForm.slug.trim(),
      title: roomForm.title.trim(),
      pageNotes: roomForm.pageNotes
        .split('\n')
        .map((note) => note.trim())
        .filter(Boolean),
    }

    if (isEditing('rooms')) {
      updateItem('rooms', editing.index, nextRoom)
      clearEditing()
      return
    }

    onChange({
      ...data,
      rooms: [...data.rooms, nextRoom],
    })
    setRoomForm(blankRoom)
  }

  const removeItem = (type, index) => {
    onChange({
      ...data,
      [type]: data[type].filter((_, itemIndex) => itemIndex !== index),
    })
    if (editing?.type === type && editing.index === index) clearEditing()
  }

  const editItem = (type, index) => {
    const item = data[type][index]
    setEditing({ type, index })

    if (type === 'dreams') setDreamForm({ ...blankDream, ...item })
    if (type === 'images') setImageForm({ ...blankImage, ...item })
    if (type === 'notes') setNoteForm(item)
    if (type === 'rooms') {
      setRoomForm({
        ...blankRoom,
        ...item,
        pageNotes: Array.isArray(item.pageNotes) ? item.pageNotes.join('\n') : item.pageNotes || '',
      })
    }
  }

  const copyJson = async () => {
    await navigator.clipboard.writeText(exportJson)
    setCopyState('복사됨')
    window.setTimeout(() => setCopyState('JSON 복사'), 1200)
  }

  const submitAuth = async (event) => {
    event.preventDefault()
    setAuthPending(true)
    setAuthError('')

    try {
      const verified = await verifyAdminPassphrase(passphrase)
      if (verified) {
        setAuthorized(true)
        setPassphrase('')
      } else {
        setAuthError('접근 코드가 맞지 않습니다.')
      }
    } catch {
      setAuthError('브라우저 보안 모듈을 사용할 수 없습니다.')
    } finally {
      setAuthPending(false)
    }
  }

  const logout = () => {
    clearAdminSession()
    setAuthorized(false)
    setPassphrase('')
  }

  if (!authorized) {
    return (
      <aside className="admin-page admin-page--locked" role="dialog" aria-modal="true" aria-labelledby="admin-lock-title">
        <form className="admin-lock" onSubmit={submitAuth}>
          <p>기시감 박물관 / 관리자 잠금</p>
          <h2 id="admin-lock-title">접근 기록 확인</h2>
          <label className="admin-field">
            <span>관리자 접근 코드</span>
            <input
              autoComplete="current-password"
              autoFocus
              required
              type="password"
              value={passphrase}
              onChange={(event) => setPassphrase(event.target.value)}
            />
          </label>
          {authError && <strong className="admin-auth-error">{authError}</strong>}
          <div className="admin-form-actions">
            <button disabled={authPending} type="submit">
              {authPending ? '확인 중' : '봉인 해제'}
            </button>
            <button type="button" onClick={onClose}>
              닫기
            </button>
          </div>
        </form>
      </aside>
    )
  }

  return (
    <aside className="admin-page" role="dialog" aria-modal="true" aria-labelledby="admin-title">
      <header className="admin-header">
        <div>
          <p>기시감 박물관 / 관리자</p>
          <h2 id="admin-title">전시 내용 추가</h2>
        </div>
        <button type="button" onClick={onClose}>
          닫기
        </button>
        <button type="button" onClick={logout}>
          로그아웃
        </button>
      </header>

      <div className="admin-grid">
        <form className={isEditing('dreams') ? 'admin-panel is-editing' : 'admin-panel'} onSubmit={saveDream}>
          <h3>{isEditing('dreams') ? '꿈 기록 수정' : '꿈 기록'}</h3>
          <Field label="시간 / 날짜">
            <input value={dreamForm.date} onChange={(event) => updateDream('date', event.target.value)} />
          </Field>
          <Field label="제목">
            <input required value={dreamForm.title} onChange={(event) => updateDream('title', event.target.value)} />
          </Field>
          <Field label="짧은 문장">
            <textarea required value={dreamForm.line} onChange={(event) => updateDream('line', event.target.value)} />
          </Field>
          <Field label="상세 기록">
            <textarea value={dreamForm.body} onChange={(event) => updateDream('body', event.target.value)} />
          </Field>
          <Field label="감정">
            <input value={dreamForm.emotion} onChange={(event) => updateDream('emotion', event.target.value)} />
          </Field>
          <div className="admin-form-actions">
            <button type="submit">{isEditing('dreams') ? '수정 저장' : '꿈 추가'}</button>
            {isEditing('dreams') && (
              <button type="button" onClick={clearEditing}>
                취소
              </button>
            )}
          </div>
        </form>

        <form className={isEditing('images') ? 'admin-panel is-editing' : 'admin-panel'} onSubmit={saveImage}>
          <h3>{isEditing('images') ? '이미지 전시 수정' : '이미지 전시'}</h3>
          <Field label="분류">
            <select value={imageForm.tag} onChange={(event) => updateImage('tag', event.target.value)}>
              <option>꿈</option>
              <option>기억</option>
              <option>오류</option>
              <option>금지</option>
            </select>
          </Field>
          <Field label="제목">
            <input required value={imageForm.title} onChange={(event) => updateImage('title', event.target.value)} />
          </Field>
          <Field label="표식">
            <input value={imageForm.mark} onChange={(event) => updateImage('mark', event.target.value)} />
          </Field>
          <Field label="이미지 주소">
            <input
              placeholder="https://... 또는 /D-J-VU-MUSEUM/gallery/file.png"
              value={imageForm.src}
              onChange={(event) => updateImage('src', event.target.value)}
            />
          </Field>
          <Field label="이미지 파일">
            <input accept="image/*" type="file" onChange={selectImageFile} />
          </Field>
          {imageForm.src && (
            <div className="admin-image-preview">
              <img src={imageForm.src} alt="" />
            </div>
          )}
          <div className="admin-form-actions">
            <button type="submit">{isEditing('images') ? '수정 저장' : '이미지 추가'}</button>
            {isEditing('images') && (
              <button type="button" onClick={clearEditing}>
                취소
              </button>
            )}
          </div>
        </form>

        <form className={isEditing('notes') ? 'admin-panel is-editing' : 'admin-panel'} onSubmit={saveNote}>
          <h3>{isEditing('notes') ? '문장 메모 수정' : '문장 메모'}</h3>
          <Field label="메모 문장">
            <textarea required value={noteForm} onChange={(event) => setNoteForm(event.target.value)} />
          </Field>
          <div className="admin-form-actions">
            <button type="submit">{isEditing('notes') ? '수정 저장' : '메모 추가'}</button>
            {isEditing('notes') && (
              <button type="button" onClick={clearEditing}>
                취소
              </button>
            )}
          </div>
        </form>

        <form className={isEditing('rooms') ? 'admin-panel is-editing' : 'admin-panel'} onSubmit={saveRoom}>
          <h3>{isEditing('rooms') ? '복도 전시실 수정' : '복도 전시실'}</h3>
          <Field label="슬러그">
            <input required placeholder="new-room" value={roomForm.slug} onChange={(event) => updateRoom('slug', event.target.value)} />
          </Field>
          <Field label="번호">
            <input value={roomForm.code} onChange={(event) => updateRoom('code', event.target.value)} />
          </Field>
          <Field label="전시실명">
            <input required value={roomForm.title} onChange={(event) => updateRoom('title', event.target.value)} />
          </Field>
          <Field label="복도 설명">
            <textarea value={roomForm.text} onChange={(event) => updateRoom('text', event.target.value)} />
          </Field>
          <Field label="상세 제목">
            <input value={roomForm.pageTitle} onChange={(event) => updateRoom('pageTitle', event.target.value)} />
          </Field>
          <Field label="상세 설명">
            <textarea value={roomForm.pageLead} onChange={(event) => updateRoom('pageLead', event.target.value)} />
          </Field>
          <Field label="상세 기록 목록">
            <textarea
              placeholder="한 줄에 하나씩 입력"
              value={roomForm.pageNotes}
              onChange={(event) => updateRoom('pageNotes', event.target.value)}
            />
          </Field>
          <div className="admin-form-actions">
            <button type="submit">{isEditing('rooms') ? '수정 저장' : '전시실 추가'}</button>
            {isEditing('rooms') && (
              <button type="button" onClick={clearEditing}>
                취소
              </button>
            )}
          </div>
        </form>
      </div>

      <section className="admin-output">
        <div>
          <h3>현재 데이터</h3>
          <p>
            전시실 {data.rooms.length}개 / 꿈 {data.dreams.length}개 / 이미지 {data.images.length}개 / 메모 {data.notes.length}개
          </p>
        </div>
        <div className="admin-actions">
          <button type="button" onClick={copyJson}>
            {copyState}
          </button>
          <button type="button" onClick={onReset}>
            초기화
          </button>
        </div>
        <textarea readOnly value={exportJson} />
      </section>

      <section className="admin-list">
        <h3>기존 내용 수정 / 삭제</h3>
        <div>
          {data.rooms.map((room, index) => (
            <span className="admin-list-item" key={`room-${room.slug}-${index}`}>
              <button type="button" onClick={() => editItem('rooms', index)}>
                전시실 수정 / {room.title}
              </button>
              <button type="button" onClick={() => removeItem('rooms', index)}>
                삭제
              </button>
            </span>
          ))}
          {data.dreams.map((dream, index) => (
            <span className="admin-list-item" key={`dream-${dream.title}-${index}`}>
              <button type="button" onClick={() => editItem('dreams', index)}>
                꿈 수정 / {dream.title}
              </button>
              <button type="button" onClick={() => removeItem('dreams', index)}>
                삭제
              </button>
            </span>
          ))}
          {data.images.map((image, index) => (
            <span className="admin-list-item" key={`image-${image.title}-${index}`}>
              <button type="button" onClick={() => editItem('images', index)}>
                이미지 수정 / {image.title}
              </button>
              <button type="button" onClick={() => removeItem('images', index)}>
                삭제
              </button>
            </span>
          ))}
          {data.notes.map((note, index) => (
            <span className="admin-list-item" key={`note-${index}`}>
              <button type="button" onClick={() => editItem('notes', index)}>
                메모 수정 / {String(index + 1).padStart(2, '0')}
              </button>
              <button type="button" onClick={() => removeItem('notes', index)}>
                삭제
              </button>
            </span>
          ))}
        </div>
      </section>
    </aside>
  )
}

export default AdminPage
