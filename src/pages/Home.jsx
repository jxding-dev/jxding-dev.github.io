import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { getObservationSnapshot, getVisitMessage, registerVisit } from '../lib/observer.js';
import { getVisibleRecordsForHome } from '../services/records.js';

function RecordCard({ record, compact = false }) {
  if (!record) {
    return <div className="app-card muted-card">표시할 기록이 없습니다.</div>;
  }

  return (
    <Link className={`record-card app-card ${compact ? 'record-card--compact' : ''}`} to={`/record/${record.record_code || record.id}`}>
      <div className="record-card__top">
        <span className="record-card__code">{record.record_code}</span>
        <span className={`danger-badge danger-${record.danger?.toLowerCase() || 'unknown'}`}>
          {record.danger}
        </span>
      </div>
      <strong>{record.title}</strong>
      <p>{record.summary || '요약이 등록되지 않았습니다.'}</p>
      <small>{record.category}</small>
    </Link>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [homeData, setHomeData] = useState({
    recentRecords: [],
    todayRecord: null,
    randomRecord: null,
  });
  const [status, setStatus] = useState('기록을 불러오는 중입니다.');
  const [observation, setObservation] = useState(() => getObservationSnapshot());
  const [toast, setToast] = useState('');
  const visitMessage = useMemo(
    () => getVisitMessage(observation.visitCount),
    [observation.visitCount]
  );

  useEffect(() => {
    setObservation(registerVisit());
  }, []);

  useEffect(() => {
    let isMounted = true;

    async function loadHomeRecords() {
      try {
        const data = await getVisibleRecordsForHome();
        if (isMounted) {
          setHomeData(data);
          setStatus('');
        }
      } catch (error) {
        if (isMounted) {
          setStatus(`기록을 불러오지 못했습니다: ${error.message}`);
        }
      }
    }

    loadHomeRecords();

    return () => {
      isMounted = false;
    };
  }, []);

  function openRandomRecord() {
    setToast('무작위 색인을 확인 중');
    window.setTimeout(() => setToast(''), 1800);

    if (Math.random() < 0.08) {
      navigate('/lost');
      return;
    }

    if (homeData.randomRecord) {
      navigate(`/record/${homeData.randomRecord.record_code || homeData.randomRecord.id}`);
    }
  }

  return (
    <section className="page app-page">
      <div className="screen-heading">
        <p className="page__eyebrow">RWA / INDEX</p>
        <h1 className="page__title">괴담 열람</h1>
        <p className="page__text">{visitMessage}</p>
      </div>

      {status ? (
        <div className="skeleton-stack">
          <span />
          <span />
          <span />
        </div>
      ) : null}

      <section className="record-section">
        <div className="section-title-row">
          <h2>오늘의 기록</h2>
          <span className="soft-badge">동기화됨</span>
        </div>
        <RecordCard record={homeData.todayRecord} />
      </section>

      <button type="button" className="primary-action app-card" onClick={openRandomRecord}>
        무작위 기록 열람
        <span>색인이 흔들리면 다른 경로로 이동합니다.</span>
      </button>

      <section className="observer-card app-card">
        <div>
          <span>관찰 상태</span>
          <strong>{observation.observationLabel}</strong>
        </div>
        <p>열람 패턴 수집 중</p>
        <div className="scan-line" />
      </section>

      <section className="record-section">
        <div className="section-title-row">
          <h2>최근 발견된 기록</h2>
          <Link to="/archive">전체</Link>
        </div>
        <div className="record-list">
          {homeData.recentRecords.map((record) => (
            <RecordCard key={record.id} record={record} compact />
          ))}
        </div>
      </section>

      {toast ? <p className="app-toast">{toast}</p> : null}
    </section>
  );
}
