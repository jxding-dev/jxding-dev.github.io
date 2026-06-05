import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { shouldRevealLostPath } from '../lib/anomaly.js';
import { getObservationSnapshot } from '../lib/observer.js';
import { getPublicRecords } from '../services/records.js';

function isFalselyRead() {
  return Math.random() < 0.035;
}

export default function Archive() {
  const [records, setRecords] = useState([]);
  const [status, setStatus] = useState('기록을 불러오는 중입니다.');
  const [readIds, setReadIds] = useState([]);
  const showLostPath = useMemo(() => shouldRevealLostPath(), []);
  const falseReadMap = useRef(new Map());

  useEffect(() => {
    setReadIds(getObservationSnapshot().readRecordIds);
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadRecords() {
      try {
        const data = await getPublicRecords();
        if (isMounted) {
          setRecords(data);
          setStatus('');
        }
      } catch (error) {
        if (isMounted) {
          setStatus(`기록을 불러오지 못했습니다: ${error.message}`);
        }
      }
    }

    loadRecords();

    return () => {
      isMounted = false;
    };
  }, []);

  function readStateFor(record) {
    if (readIds.includes(record.id)) {
      return true;
    }

    if (!falseReadMap.current.has(record.id)) {
      falseReadMap.current.set(record.id, isFalselyRead());
    }

    return falseReadMap.current.get(record.id);
  }

  return (
    <section className="page app-page">
      <div className="screen-heading">
        <p className="page__eyebrow">RWA / ARCHIVE</p>
        <h1 className="page__title">기록보관소</h1>
        <p className="page__text">공개된 사건 파일입니다.</p>
      </div>

      {showLostPath ? (
        <Link className="lost-thread" to="/lost">
          색인되지 않은 경로
        </Link>
      ) : null}

      {status ? (
        <div className="skeleton-stack">
          <span />
          <span />
          <span />
        </div>
      ) : null}

      <div className="record-list">
        {records.map((record) => {
          const wasRead = readStateFor(record);

          return (
            <Link className="record-card app-card file-card" key={record.id} to={`/record/${record.record_code || record.id}`}>
              <div className="record-card__top">
                <span className="record-card__code">{record.record_code}</span>
                <span className={`danger-badge danger-${record.danger?.toLowerCase() || 'unknown'}`}>
                  {record.danger}
                </span>
              </div>
              <strong data-shift={record.title.replace('창문', '창目')}>{record.title}</strong>
              <p>{record.summary || '요약이 등록되지 않았습니다.'}</p>
              <div className="file-card__meta">
                <span>{record.category}</span>
                <span>훼손율 {record.corruption}%</span>
                {wasRead ? <span className="read-badge">열람됨</span> : null}
              </div>
            </Link>
          );
        })}
      </div>

      {!status && records.length === 0 ? (
        <p className="record-empty app-card">공개된 기록이 없습니다.</p>
      ) : null}
    </section>
  );
}
