import { useEffect, useState } from 'react';
import { getObservationSnapshot } from '../lib/observer.js';

function formatLastVisit(value) {
  if (!value) {
    return '미기록';
  }

  return new Intl.DateTimeFormat('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}

export default function Observer() {
  const [snapshot, setSnapshot] = useState(() => getObservationSnapshot());
  const progress = Math.min(100, snapshot.observationLevel);

  useEffect(() => {
    setSnapshot(getObservationSnapshot());
  }, []);

  return (
    <section className="page app-page observer-screen">
      <div className="screen-heading">
        <p className="page__eyebrow">RWA / OBSERVER</p>
        <h1 className="page__title">내 상태</h1>
        <p className="page__text">{snapshot.observationLabel}</p>
      </div>

      <section className="observer-status-card app-card">
        <div className="section-title-row">
          <span className="soft-badge">열람자 감지됨</span>
          <span>{snapshot.observationLevel}</span>
        </div>
        <div className="progress-track">
          <span style={{ width: `${progress}%` }} />
        </div>
        <p>기록 접근 패턴 분석 중</p>
      </section>

      <div className="observer-panel">
        <div>
          <span>방문 횟수</span>
          <strong>{snapshot.visitCount}</strong>
        </div>
        <div>
          <span>열람한 기록</span>
          <strong>{snapshot.readRecordIds.length}</strong>
        </div>
        <div>
          <span>체류 시간</span>
          <strong>{snapshot.pageStaySeconds}s</strong>
        </div>
        <div>
          <span>lost 진입</span>
          <strong>{snapshot.lostEntryCount}</strong>
        </div>
      </div>

      <section className="app-card log-list">
        <h2>로그</h2>
        <p>반복 열람 경향 확인</p>
        <p>최근 열람 기록 {snapshot.readRecordIds.at(-1) || '없음'}</p>
        <p>마지막 접속 {formatLastVisit(snapshot.lastVisitAt)}</p>
        <p>권고: 열람 중단</p>
      </section>
    </section>
  );
}
