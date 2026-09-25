import { useEffect, useMemo, useState } from 'react';
import { FAKE_SYSTEM_LOGS, OBSERVATION_PHRASES, pickRandom, shouldShowNoise } from '../lib/anomaly.js';

export default function AnomalyLayer() {
  const [phrase, setPhrase] = useState('');
  const [quietMessage, setQuietMessage] = useState('');
  const [eyePosition, setEyePosition] = useState({ x: 50, y: 50 });
  const showNoise = useMemo(() => shouldShowNoise(), []);
  const systemLog = useMemo(() => pickRandom(FAKE_SYSTEM_LOGS), []);

  useEffect(() => {
    setPhrase(pickRandom(OBSERVATION_PHRASES));

    const title = document.title;
    const titleTimer = window.setTimeout(() => {
      document.title = title.includes('RED WINDOW')
        ? title.replace('WINDOW', 'WlNDOW')
        : `${title} .`;
    }, 9000);
    const restoreTitleTimer = window.setTimeout(() => {
      document.title = title;
    }, 13000);
    const quietTimer = window.setTimeout(() => {
      setQuietMessage('아직 같은 기록 안에 있습니다.');
    }, 45000);

    return () => {
      window.clearTimeout(titleTimer);
      window.clearTimeout(restoreTitleTimer);
      window.clearTimeout(quietTimer);
      document.title = title;
    };
  }, []);

  useEffect(() => {
    function handlePointerMove(event) {
      const x = Math.round((event.clientX / window.innerWidth) * 100);
      const y = Math.round((event.clientY / window.innerHeight) * 100);
      setEyePosition({
        x: Math.max(42, Math.min(58, x)),
        y: Math.max(42, Math.min(58, y)),
      });
    }

    window.addEventListener('pointermove', handlePointerMove);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, []);

  return (
    <>
      <div className="anomaly-eye" aria-hidden="true">
        <span style={{ transform: `translate(${eyePosition.x - 50}px, ${eyePosition.y - 50}px)` }} />
      </div>
      <div className="anomaly-log" aria-hidden="true">
        <span className="anomaly-red">{systemLog}</span>
      </div>
      {phrase ? <p className="anomaly-phrase">{phrase}</p> : null}
      {quietMessage ? <p className="anomaly-quiet">{quietMessage}</p> : null}
      {showNoise ? <div className="anomaly-noise" aria-hidden="true" /> : null}
    </>
  );
}
