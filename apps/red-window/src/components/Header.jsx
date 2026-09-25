import { useEffect, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

const appStatuses = ['열람 가능', '기록 동기화 중', '열람자 확인됨', '신호 불안정'];

const tabItems = [
  { to: '/', label: '홈', icon: '⌂' },
  { to: '/archive', label: '기록', icon: '▤' },
  { to: '/search', label: '검색', icon: '⌕' },
  { to: '/observer', label: '관찰', icon: '◉' },
  { to: '/submit', label: '제보', icon: '✉' },
];

export default function Header() {
  const location = useLocation();
  const [statusIndex, setStatusIndex] = useState(0);
  const [isWatchingTitle, setIsWatchingTitle] = useState(false);
  const showBottomTabs = location.pathname !== '/admin';

  useEffect(() => {
    const statusTimer = window.setInterval(() => {
      setStatusIndex((current) => (current + 1) % appStatuses.length);
    }, 6200);
    const titleTimer = window.setInterval(() => {
      setIsWatchingTitle(true);
      window.setTimeout(() => setIsWatchingTitle(false), 220);
    }, 18000);

    return () => {
      window.clearInterval(statusTimer);
      window.clearInterval(titleTimer);
    };
  }, []);

  return (
    <>
      <header className="app-bar">
        <div>
          <p className="app-bar__kicker">RED WINDOW</p>
          <NavLink to="/" className="app-bar__title" aria-label="RED WINDOW 홈">
            {isWatchingTitle ? 'RED WATCHING' : 'RED WINDOW'}
          </NavLink>
        </div>
        <div className="app-status" aria-label={`상태: ${appStatuses[statusIndex]}`}>
          <span className="rec-dot" />
          <span>{appStatuses[statusIndex]}</span>
        </div>
      </header>

      {showBottomTabs ? (
        <nav className="bottom-tabs" aria-label="하단 탭">
          {tabItems.map((item) => (
            <NavLink key={item.to} to={item.to} end={item.to === '/'}>
              <span className="bottom-tabs__icon">{item.icon}</span>
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
      ) : null}
    </>
  );
}
