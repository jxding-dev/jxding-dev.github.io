import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { registerRecordRead, startPageStayTimer } from '../lib/observer.js';
import { getPublicRecordByIdOrCode, getPublicRecords } from '../services/records.js';

function formatDate(value) {
  if (!value) {
    return '미기록';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

function markSlowRed(text) {
  const targets = ['창문', '문', '기록', '얼굴', '새벽'];
  const target = targets.find((word) => text.includes(word));

  if (!target) {
    return text;
  }

  const parts = text.split(target);
  return parts.flatMap((part, index) =>
    index < parts.length - 1
      ? [part, <span className="slow-red" key={`${target}-${index}`}>{target}</span>]
      : [part]
  );
}

export default function RecordDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [record, setRecord] = useState(null);
  const [relatedRecords, setRelatedRecords] = useState([]);
  const [showHiddenMessage, setShowHiddenMessage] = useState(false);
  const [quietMessage, setQuietMessage] = useState('');
  const [status, setStatus] = useState('기록을 불러오는 중입니다.');

  useEffect(() => startPageStayTimer(), []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      setQuietMessage('문서 하단 체류 시간이 기록되었습니다.');
    }, 42000);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadRecord() {
      try {
        const data = await getPublicRecordByIdOrCode(id);
        if (!isMounted) {
          return;
        }

        setRecord(data);
        setStatus(data ? '' : '공개된 기록을 찾을 수 없습니다.');

        if (data) {
          const result = registerRecordRead(data.id);
          setShowHiddenMessage(result.hasReadBefore);
          const records = await getPublicRecords();
          if (isMounted) {
            setRelatedRecords(
              records
                .filter((item) => item.id !== data.id && item.category === data.category)
                .slice(0, 3)
            );
          }
        }
      } catch (error) {
        if (isMounted) {
          setStatus(`기록을 불러오지 못했습니다: ${error.message}`);
        }
      }
    }

    loadRecord();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <section className="page app-page document-view">
      <button type="button" className="back-button" onClick={() => navigate(-1)}>
        ‹ 기록 목록
      </button>

      {status ? <p className="record-status app-card">{status}</p> : null}

      {record ? (
        <article className="record-detail">
          <div className="document-header app-card">
            <span className="record-card__code">{record.record_code}</span>
            <h1 className="page__title">{record.title}</h1>
            <p>{record.summary}</p>
          </div>

          <dl className="record-meta">
            <div>
              <dt>분류</dt>
              <dd>{record.category}</dd>
            </div>
            <div>
              <dt>유형</dt>
              <dd>{record.type}</dd>
            </div>
            <div>
              <dt>위험도</dt>
              <dd>{record.danger}</dd>
            </div>
            <div>
              <dt>훼손율</dt>
              <dd>{record.corruption}%</dd>
            </div>
            <div>
              <dt>발견 시각</dt>
              <dd>{formatDate(record.discovered_at)}</dd>
            </div>
            <div>
              <dt>위치</dt>
              <dd>{record.location || '미기록'}</dd>
            </div>
          </dl>

          {record.image_url ? (
            <img className="record-image" src={record.image_url} alt={record.title} />
          ) : null}

          <div className="record-content app-card">
            {(record.content || '').split('\n').map((paragraph, index) => (
              <p key={`${record.id}-${index}`}>{markSlowRed(paragraph)}</p>
            ))}
          </div>

          {showHiddenMessage && record.hidden_message ? (
            <p className="observer-hint bottom-sheet">{record.hidden_message}</p>
          ) : null}

          {quietMessage ? <p className="observer-hint bottom-sheet">{quietMessage}</p> : null}

          {Array.isArray(record.tags) && record.tags.length ? (
            <div className="record-tags">
              {record.tags.map((tag) => (
                <span key={tag}>{tag}</span>
              ))}
            </div>
          ) : null}

          {relatedRecords.length ? (
            <section className="record-section">
              <h2>관련 기록</h2>
              <div className="record-list">
                {relatedRecords.map((item) => (
                  <Link className="record-card app-card record-card--compact" key={item.id} to={`/record/${item.record_code || item.id}`}>
                    <span className="record-card__code">{item.record_code}</span>
                    <strong>{item.title}</strong>
                    <small>{item.category}</small>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </article>
      ) : null}
    </section>
  );
}
