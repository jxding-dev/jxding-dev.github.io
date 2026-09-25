import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { LOST_SENTENCES, pickRandom } from '../lib/anomaly.js';
import { registerLostEntry } from '../lib/observer.js';

export default function Lost() {
  const navigate = useNavigate();
  const sentence = useMemo(() => pickRandom(LOST_SENTENCES), []);
  const [lostCount, setLostCount] = useState(0);
  const [buttonText, setButtonText] = useState('이전 화면');

  useEffect(() => {
    const snapshot = registerLostEntry();
    setLostCount(snapshot.lostEntryCount);
  }, []);

  function goBack() {
    setButtonText('돌아가는 중...');
    window.setTimeout(() => navigate(-1), 260);
  }

  return (
    <section className="page app-page lost-screen">
      <div className="screen-heading">
        <p className="page__eyebrow">RWA / LOST</p>
        <h1 className="page__title">오류 화면</h1>
        <p className="page__text">{sentence}</p>
      </div>

      <section className="app-card error-card">
        <span>ROUTE_MISSING</span>
        <strong>요청한 화면을 찾을 수 없습니다.</strong>
        <p>이 진입은 남아 있습니다. 누적 {lostCount}회.</p>
      </section>

      <button type="button" className="primary-action broken-action" onClick={goBack}>
        {buttonText}
        <span>이 버튼은 가끔 늦게 반응합니다.</span>
      </button>

      {lostCount >= 3 ? (
        <Link className="lost-thread" to="/hidden/RWA-HIDDEN">
          분실 기록 RWA-HIDDEN
        </Link>
      ) : (
        <p className="observer-hint bottom-sheet">같은 경로가 더 쌓이면 닫힌 기록이 열립니다.</p>
      )}
    </section>
  );
}
