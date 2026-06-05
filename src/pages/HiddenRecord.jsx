import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  canAccessHiddenRecords,
  getHiddenAccessReason,
  registerHiddenEntry,
  startPageStayTimer,
} from '../lib/observer.js';
import { getPublicHiddenRecordByIdOrCode } from '../services/records.js';

export default function HiddenRecord() {
  const { id } = useParams();
  const [record, setRecord] = useState(null);
  const [status, setStatus] = useState('숨겨진 기록을 확인하는 중입니다.');
  const [hasAccess, setHasAccess] = useState(() => canAccessHiddenRecords());

  useEffect(() => startPageStayTimer(), []);

  useEffect(() => {
    let isMounted = true;
    const allowed = canAccessHiddenRecords();
    setHasAccess(allowed);

    if (!allowed) {
      setStatus(getHiddenAccessReason());
      return () => {
        isMounted = false;
      };
    }

    async function loadRecord() {
      try {
        const data = await getPublicHiddenRecordByIdOrCode(id);
        if (isMounted) {
          setRecord(data);
          setStatus(data ? '' : '공개된 숨겨진 기록을 찾을 수 없습니다.');
          if (data) {
            registerHiddenEntry(data.id);
          }
        }
      } catch (error) {
        if (isMounted) {
          setStatus(`숨겨진 기록을 불러오지 못했습니다: ${error.message}`);
        }
      }
    }

    loadRecord();

    return () => {
      isMounted = false;
    };
  }, [id]);

  return (
    <section className="page app-page hidden-screen">
      <div className="screen-heading">
        <p className="page__eyebrow">RWA / HIDDEN</p>
        <h1 className="page__title">내부 기록</h1>
        {status ? <p className="page__text">{status}</p> : null}
      </div>

      {!hasAccess ? (
        <div className="app-card denied-card">
          <strong>접근 조건이 충족되지 않았습니다.</strong>
          <p>이 기록은 아직 당신에게 열리지 않았습니다.</p>
        </div>
      ) : null}

      {record ? (
        <article className="record-detail hidden-document">
          <div className="document-header app-card">
            <span className="record-card__code">{record.record_code}</span>
            <h1 className="page__title">{record.title}</h1>
            <p>{record.summary}</p>
          </div>

          <div className="record-content app-card">
            {(record.content || '').split('\n').map((paragraph, index) => (
              <p key={`${record.id}-${index}`}>{paragraph}</p>
            ))}
          </div>

          {record.hidden_message ? (
            <div className="record-hidden-message bottom-sheet">
              <strong>숨겨진 문구</strong>
              <p>{record.hidden_message}</p>
            </div>
          ) : null}
        </article>
      ) : null}
    </section>
  );
}
