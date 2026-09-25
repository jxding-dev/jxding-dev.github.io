import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { shouldRevealLostPath } from '../lib/anomaly.js';
import { registerSearchAction } from '../lib/observer.js';
import { searchPublicRecords } from '../services/records.js';

const specialSearchMessages = {
  나: '검색 대상이 아닙니다.',
  뒤: '보지 마십시오.',
  삭제: '제거된 결과가 있습니다.',
  '03:17': '제한 기록 감지됨.',
};

const presetTerms = ['엘리베이터', '창문', '03:17', '삭제'];

export default function Search() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialQuery = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQuery);
  const [records, setRecords] = useState([]);
  const [status, setStatus] = useState('검색어를 입력하거나 전체 공개 기록을 확인하세요.');
  const showLostPath = useMemo(() => shouldRevealLostPath(0.1), []);
  const specialMessage = specialSearchMessages[initialQuery.trim()];

  useEffect(() => {
    let isMounted = true;

    async function loadSearchResults() {
      setStatus('기록을 검색하는 중입니다.');

      try {
        const data = await searchPublicRecords(initialQuery);
        if (isMounted) {
          setRecords(data);
          setStatus('');
        }
      } catch (error) {
        if (isMounted) {
          setStatus(`검색하지 못했습니다: ${error.message}`);
        }
      }
    }

    loadSearchResults();

    return () => {
      isMounted = false;
    };
  }, [initialQuery]);

  function handleSubmit(event) {
    event.preventDefault();
    registerSearchAction();
    const trimmedQuery = query.trim();
    setSearchParams(trimmedQuery ? { q: trimmedQuery } : {});
  }

  function runPreset(term) {
    registerSearchAction();
    setQuery(term);
    setSearchParams({ q: term });
  }

  return (
    <section className="page app-page search-screen">
      <div className="screen-heading">
        <p className="page__eyebrow">RWA / SEARCH</p>
        <h1 className="page__title">검색</h1>
        <p className="page__text">제목, 요약, 태그, 본문에서 공개 기록을 검색합니다.</p>
      </div>

      <form className="record-search app-card" onSubmit={handleSubmit}>
        <input
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="기록명, 시간, 장소"
          aria-label="검색어"
        />
        <button type="submit">검색</button>
      </form>

      <section className="recent-search app-card">
        <span>최근 감지어</span>
        <div>
          {presetTerms.map((term) => (
            <button key={term} type="button" onClick={() => runPreset(term)}>
              {term}
            </button>
          ))}
        </div>
      </section>

      {specialMessage ? <p className="app-toast app-toast--static">{specialMessage}</p> : null}

      {showLostPath ? (
        <Link className="lost-thread" to="/lost">
          결과 밖의 경로
        </Link>
      ) : null}

      {status ? (
        <div className="skeleton-stack">
          <span />
          <span />
        </div>
      ) : null}

      <div className="record-list">
        {records.map((record) => (
          <Link className="record-card app-card" key={record.id} to={`/record/${record.record_code || record.id}`}>
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
        ))}
      </div>

      {!status && records.length === 0 ? (
        <p className="record-empty app-card">결과 없음. 또는 결과가 제거되었습니다.</p>
      ) : null}
    </section>
  );
}
