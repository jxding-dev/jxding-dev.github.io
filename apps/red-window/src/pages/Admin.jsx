import { useEffect, useMemo, useState } from 'react';
import {
  createRecord,
  deleteRecord,
  getAdminRecords,
  updateRecord,
} from '../services/records.js';

const emptyForm = {
  record_code: '',
  title: '',
  category: '괴담',
  type: 'text',
  danger: 'LOW',
  corruption: 0,
  discovered_at: '',
  location: '',
  summary: '',
  content: '',
  image_url: '',
  tags: '',
  hidden_message: '',
  glitch_level: 0,
  visibility: 'public',
  is_hidden: false,
};

const categories = [
  '괴담',
  '도시전설',
  '발견 문서',
  '실화 제보',
  '악몽 기록',
  'CCTV',
  '음성 기록',
  '이미지 기록',
  '시스템 로그',
  '미분류',
];

const types = ['text', 'image', 'log', 'cctv', 'memo', 'nightmare'];
const dangers = ['LOW', 'MEDIUM', 'HIGH', 'UNKNOWN'];

async function sha256Hex(value) {
  const bytes = new TextEncoder().encode(value);
  const digest = await crypto.subtle.digest('SHA-256', bytes);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, '0')).join('');
}

function formatDateTimeInput(value) {
  if (!value) {
    return '';
  }

  return value.slice(0, 16);
}

function recordToForm(record) {
  return {
    record_code: record.record_code || '',
    title: record.title || '',
    category: record.category || '괴담',
    type: record.type || 'text',
    danger: record.danger || 'LOW',
    corruption: record.corruption ?? 0,
    discovered_at: formatDateTimeInput(record.discovered_at),
    location: record.location || '',
    summary: record.summary || '',
    content: record.content || '',
    image_url: record.image_url || '',
    tags: Array.isArray(record.tags) ? record.tags.join(', ') : '',
    hidden_message: record.hidden_message || '',
    glitch_level: record.glitch_level ?? 0,
    visibility: record.visibility || 'public',
    is_hidden: Boolean(record.is_hidden),
  };
}

function normalizeForm(form) {
  return {
    ...form,
    corruption: Number(form.corruption),
    glitch_level: Number(form.glitch_level),
    discovered_at: form.discovered_at ? new Date(form.discovered_at).toISOString() : null,
    tags: form.tags
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
    is_hidden: Boolean(form.is_hidden),
  };
}

export default function Admin() {
  const adminPasswordHash = import.meta.env.VITE_ADMIN_PASSWORD_HASH;
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(
    () => sessionStorage.getItem('rwa_admin_unlocked') === 'true'
  );
  const [authError, setAuthError] = useState('');
  const [records, setRecords] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const isEditing = useMemo(() => Boolean(editingId), [editingId]);

  useEffect(() => {
    if (isUnlocked) {
      loadRecords();
    }
  }, [isUnlocked]);

  async function loadRecords() {
    setIsLoading(true);
    setStatus('');

    try {
      const data = await getAdminRecords();
      setRecords(data || []);
    } catch (error) {
      setStatus(`기록을 불러오지 못했습니다: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  async function handlePasswordSubmit(event) {
    event.preventDefault();

    if (!adminPasswordHash) {
      setAuthError('VITE_ADMIN_PASSWORD_HASH 환경변수가 설정되지 않았습니다.');
      return;
    }

    const passwordHash = await sha256Hex(password);

    if (passwordHash !== adminPasswordHash) {
      setAuthError('비밀번호가 맞지 않습니다.');
      return;
    }

    sessionStorage.setItem('rwa_admin_unlocked', 'true');
    setIsUnlocked(true);
    setAuthError('');
  }

  function handleChange(event) {
    const { name, type, checked, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: type === 'checkbox' ? checked : value,
    }));
  }

  function resetForm() {
    setForm(emptyForm);
    setEditingId(null);
    setStatus('');
  }

  function lockAdmin() {
    sessionStorage.removeItem('rwa_admin_unlocked');
    setIsUnlocked(false);
    setPassword('');
    resetForm();
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);
    setStatus('');

    try {
      const payload = normalizeForm(form);

      if (isEditing) {
        await updateRecord(editingId, payload);
        setStatus('기록을 수정했습니다.');
      } else {
        await createRecord(payload);
        setStatus('기록을 작성했습니다.');
      }

      resetForm();
      await loadRecords();
    } catch (error) {
      setStatus(`저장하지 못했습니다: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  function handleEdit(record) {
    setEditingId(record.id);
    setForm(recordToForm(record));
    setStatus(`${record.record_code} 기록을 수정 중입니다.`);
  }

  async function handleDelete(record) {
    const confirmed = window.confirm(`${record.record_code} 기록을 삭제할까요?`);

    if (!confirmed) {
      return;
    }

    setIsLoading(true);
    setStatus('');

    try {
      await deleteRecord(record.id);
      setStatus('기록을 삭제했습니다.');
      if (editingId === record.id) {
        resetForm();
      }
      await loadRecords();
    } catch (error) {
      setStatus(`삭제하지 못했습니다: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  }

  if (!isUnlocked) {
    return (
      <section className="page admin-page">
        <p className="page__eyebrow">RWA / ADMIN</p>
        <h1 className="page__title">관리자</h1>
        <form className="admin-login" onSubmit={handlePasswordSubmit}>
          <label htmlFor="admin-password">관리자 비밀번호</label>
          <input
            id="admin-password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            autoComplete="current-password"
          />
          {authError ? <p className="admin-message">{authError}</p> : null}
          <button type="submit">접속</button>
        </form>
      </section>
    );
  }

  return (
    <section className="page admin-page">
      <p className="page__eyebrow">RWA / ADMIN</p>
      <h1 className="page__title">관리자</h1>

      <form className="admin-form" onSubmit={handleSubmit}>
        <div className="admin-form__header">
          <h2>{isEditing ? '기록 수정' : '기록 작성'}</h2>
          {isEditing ? (
            <button type="button" className="admin-button-secondary" onClick={resetForm}>
              새 기록 작성
            </button>
          ) : null}
        </div>

        <div className="admin-grid">
          <label>
            기록번호
            <input name="record_code" value={form.record_code} onChange={handleChange} required />
          </label>
          <label>
            제목
            <input name="title" value={form.title} onChange={handleChange} required />
          </label>
          <label>
            분류
            <select name="category" value={form.category} onChange={handleChange}>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </label>
          <label>
            유형
            <select name="type" value={form.type} onChange={handleChange}>
              {types.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </label>
          <label>
            위험도
            <select name="danger" value={form.danger} onChange={handleChange}>
              {dangers.map((danger) => (
                <option key={danger} value={danger}>
                  {danger}
                </option>
              ))}
            </select>
          </label>
          <label>
            훼손율
            <input
              name="corruption"
              type="number"
              min="0"
              max="100"
              value={form.corruption}
              onChange={handleChange}
            />
          </label>
          <label>
            발견 시각
            <input
              name="discovered_at"
              type="datetime-local"
              value={form.discovered_at}
              onChange={handleChange}
            />
          </label>
          <label>
            위치
            <input name="location" value={form.location} onChange={handleChange} />
          </label>
          <label>
            이미지 URL
            <input name="image_url" value={form.image_url} onChange={handleChange} />
          </label>
          <label>
            태그
            <input
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="쉼표로 구분"
            />
          </label>
          <label>
            글리치 레벨
            <input
              name="glitch_level"
              type="number"
              min="0"
              max="5"
              value={form.glitch_level}
              onChange={handleChange}
            />
          </label>
          <label>
            공개 여부
            <select name="visibility" value={form.visibility} onChange={handleChange}>
              <option value="public">public</option>
              <option value="private">private</option>
            </select>
          </label>
        </div>

        <label>
          요약
          <textarea name="summary" rows="3" value={form.summary} onChange={handleChange} />
        </label>
        <label>
          본문
          <textarea name="content" rows="10" value={form.content} onChange={handleChange} />
        </label>
        <label>
          숨겨진 문구
          <textarea
            name="hidden_message"
            rows="3"
            value={form.hidden_message}
            onChange={handleChange}
          />
        </label>

        <label className="admin-check">
          <input
            name="is_hidden"
            type="checkbox"
            checked={form.is_hidden}
            onChange={handleChange}
          />
          숨김 기록으로 설정
        </label>

        {status ? <p className="admin-message">{status}</p> : null}

        <button type="submit" disabled={isLoading}>
          {isLoading ? '처리 중' : isEditing ? '수정 저장' : '기록 작성'}
        </button>
      </form>

      <div className="admin-records">
        <div className="admin-form__header">
          <h2>기록 목록</h2>
          <div className="admin-toolbar">
            <button type="button" className="admin-button-secondary" onClick={loadRecords}>
              새로고침
            </button>
            <button type="button" className="admin-button-secondary" onClick={lockAdmin}>
              잠금
            </button>
          </div>
        </div>

        {records.length === 0 ? (
          <p className="admin-empty">표시할 기록이 없습니다.</p>
        ) : (
          <ul className="admin-record-list">
            {records.map((record) => (
              <li key={record.id}>
                <div>
                  <strong>{record.record_code}</strong>
                  <span>{record.title}</span>
                  <small>
                    {record.visibility} / {record.is_hidden ? 'hidden' : 'normal'}
                  </small>
                </div>
                <div className="admin-record-actions">
                  <button type="button" onClick={() => handleEdit(record)}>
                    수정
                  </button>
                  <button type="button" onClick={() => handleDelete(record)}>
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
