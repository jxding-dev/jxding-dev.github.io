import { useEffect, useRef, useState } from 'react';
import { HelpNote } from '../ui/HelpNote';
import styles from './UrlPreview.module.css';

interface Props {
  url: string;
  width: number;
  height: number;
  refreshKey: number;
}

type Status = 'loading' | 'loaded' | 'blocked';

export function UrlPreview({ url, width, height, refreshKey }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [availableWidth, setAvailableWidth] = useState(0);
  const [status, setStatus] = useState<Status>('loading');

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    const observer = new ResizeObserver(([entry]) => setAvailableWidth(entry.contentRect.width));
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  // Reset to loading on each URL/refresh. If the iframe never reports a load
  // within the timeout, treat it as a likely embed block (X-Frame-Options/CSP).
  useEffect(() => {
    setStatus('loading');
    const timeout = window.setTimeout(() => {
      setStatus((current) => (current === 'loading' ? 'blocked' : current));
    }, 6000);
    return () => window.clearTimeout(timeout);
  }, [url, refreshKey]);

  const scale = availableWidth ? Math.min(1, Math.max(0.16, (availableWidth - 32) / width)) : 1;
  const scaledHeight = Math.max(180, height * scale);

  return (
    <div className={styles.preview} ref={containerRef}>
      <div className={styles.previewHead}>
        <span className={styles.deviceLabel}>{width} × {height}</span>
        <span className={`${styles.statusChip} ${styles[`status_${status}`]}`}>
          {status === 'loading' ? '불러오는 중' : status === 'loaded' ? '미리보기 표시됨' : '임베드 차단 의심'}
        </span>
      </div>
      <div className={styles.viewport} style={{ height: scaledHeight }}>
        <div className={styles.frame} style={{ width, height, transform: `scale(${scale})` }}>
          <iframe
            key={refreshKey}
            src={url}
            title="URL 반응형 미리보기"
            sandbox="allow-forms allow-popups allow-scripts"
            referrerPolicy="no-referrer"
            loading="lazy"
            className={status === 'loading' ? styles.iframeLoading : styles.iframeReady}
            onLoad={() => setStatus('loaded')}
          />
        </div>

        {status === 'loading' && (
          <div className={styles.skeleton} aria-hidden>
            <div className={styles.skeletonBar} style={{ width: '38%' }} />
            <div className={styles.skeletonBlock} />
            <div className={styles.skeletonRow}>
              <div className={styles.skeletonCard} />
              <div className={styles.skeletonCard} />
              <div className={styles.skeletonCard} />
            </div>
            <div className={styles.skeletonBar} style={{ width: '70%' }} />
            <div className={styles.skeletonBar} style={{ width: '52%' }} />
            <div className={styles.skeletonSpinnerRow}>
              <span className={styles.skeletonSpinner} />
              불러오는 중…
            </div>
          </div>
        )}
      </div>

      {status === 'loaded' && (
        <div className={styles.notice}>
          <p className={styles.noticeInfo}>미리보기를 불러왔어요. 화면이 비어 보이면 아래 설명을 확인하세요.</p>
          <HelpNote summary="미리보기가 비어 보이나요?">
            사이트가 정상이어도 <strong>보안 정책</strong> 때문에 다른 페이지 안에서는
            내용이 안 보일 수 있어요. 문제는 아니며, 아래 방법으로 확인하면 됩니다.
            <ul>
              <li>왼쪽 패널의 <strong>새 창에서 열기</strong>로 실제 화면을 확인하세요.</li>
              <li>W · H 값이나 프리셋으로 원하는 기기 크기를 맞춰 보세요.</li>
            </ul>
          </HelpNote>
        </div>
      )}
      {status === 'blocked' && (
        <div className={styles.notice}>
          <p className={styles.noticeWarn}>이 사이트는 외부 미리보기를 막아 둔 것 같아요.</p>
          <HelpNote summary="왜 안 보이나요? 어떻게 확인하죠?" tone="warn">
            사이트가 <code>X-Frame-Options</code>·<code>CSP</code>로 임베드를 차단하면
            여기서는 표시할 수 없어요. 에러가 아니라 사이트의 정책입니다.
            <ul>
              <li>왼쪽 패널의 <strong>새 창에서 열기</strong>로 반응형을 확인하세요.</li>
              <li>내 사이트라면 임베드 허용 설정 후 다시 시도할 수 있어요.</li>
            </ul>
          </HelpNote>
        </div>
      )}
    </div>
  );
}
