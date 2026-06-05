import { useEffect, useState } from 'react';

const bootLines = [
  '기록 색인 확인',
  '공개 문서 동기화',
  '열람 상태 복원',
  'RED WINDOW 준비 완료',
];

export default function BootScreen() {
  const [isVisible, setIsVisible] = useState(() => {
    if (typeof window === 'undefined') {
      return false;
    }

    return sessionStorage.getItem('rwa_boot_seen') !== 'true';
  });

  useEffect(() => {
    if (!isVisible) {
      return undefined;
    }

    const timer = window.setTimeout(() => {
      sessionStorage.setItem('rwa_boot_seen', 'true');
      setIsVisible(false);
    }, 2200);

    return () => window.clearTimeout(timer);
  }, [isVisible]);

  if (!isVisible) {
    return null;
  }

  return (
    <div className="boot-screen" role="status" aria-label="RED WINDOW 로딩 중">
      <div className="boot-panel">
        <div className="boot-mark">
          <span />
        </div>
        <p className="boot-kicker">ARCHIVE BOOT</p>
        <h1>RED WINDOW</h1>
        <div className="boot-progress">
          <span />
        </div>
        <ul>
          {bootLines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
