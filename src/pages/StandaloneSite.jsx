import { Link } from 'react-router-dom';
import heroImage from '../assets/red-window-site-hero.png';
import evidenceImage from '../assets/red-window-evidence-room.png';

const cases = [
  {
    code: 'RWA-0333-417',
    type: '창문 기록',
    title: '없는 층에서 켜진 붉은 창',
    body: '동일한 골목에서 촬영된 여섯 장의 사진 중 한 장에만 창문이 나타났다. 촬영자는 그 뒤로 같은 주소를 찾지 못했다.',
  },
  {
    code: 'MEM-0808-019',
    type: '기억 불일치',
    title: '가족사진의 빈자리',
    body: '사진 속 의자는 매번 다른 위치에 놓여 있었다. 가족들은 의자를 본 적이 없다고 진술했지만, 먼지는 의자 주변만 비어 있었다.',
  },
  {
    code: 'DOC-1212-003',
    type: '문서 복원',
    title: '본문보다 먼저 작성된 댓글',
    body: '기록이 공개되기 전, 이미 41개의 반응이 남아 있었다. 복원 로그의 시간은 모두 03:33에 멈춰 있다.',
  },
];

const signals = ['열람자 식별 불가', '사진 원본 불일치', '복원률 71%', '격리 대기'];

export default function StandaloneSite() {
  return (
    <div className="standalone-site">
      <div className="site-noise" aria-hidden="true" />

      <header className="standalone-header">
        <a href="#top" className="standalone-brand">
          <span>RED WINDOW</span>
          <strong>RECORDS</strong>
        </a>
        <nav aria-label="사이트 메뉴">
          <a href="#records">기록</a>
          <a href="#evidence">증거</a>
          <a href="#submit">제보</a>
          <Link to="/">앱으로</Link>
        </nav>
      </header>

      <main>
        <section className="standalone-hero" id="top">
          <img src={heroImage} alt="비 오는 골목의 붉은 창문" />
          <div className="hero-vignette" aria-hidden="true" />
          <div className="hero-copy-block">
            <p className="site-kicker">03:33 / RECOVERED INDEX</p>
            <h1>열기 전부터 기록되어 있던 창문</h1>
            <p>
              RED WINDOW는 사라진 사람보다 먼저 남겨진 사진, 존재하지 않는 방,
              그리고 복원할수록 달라지는 문서를 수집합니다.
            </p>
            <div className="hero-actions">
              <a href="#records">기록 열람</a>
              <a href="#submit">이상 현상 제보</a>
            </div>
          </div>
          <aside className="hero-log" aria-label="복원 로그">
            <span>03:33:00 observer connected</span>
            <span>03:33:01 window state: open</span>
            <span>03:33:01 reader count mismatch</span>
          </aside>
        </section>

        <section className="signal-strip" aria-label="현재 신호">
          {signals.map((signal) => (
            <span key={signal}>{signal}</span>
          ))}
        </section>

        <section className="standalone-section intro-grid">
          <div>
            <p className="site-kicker">ABOUT</p>
            <h2>괴담처럼 보관되지만, 문서처럼 확인됩니다.</h2>
          </div>
          <p>
            참고 사이트의 불안한 기록 보관소 분위기는 유지하되, 이 프로젝트에서는 실제
            탐색 흐름에 맞춰 사건 카드, 복원 이미지, 제보 흐름을 한 화면에서 읽을 수 있게
            재구성했습니다.
          </p>
        </section>

        <section className="standalone-section" id="records">
          <div className="section-head">
            <p className="site-kicker">CLASSIFIED RECORDS</p>
            <h2>분류 거부 문서</h2>
          </div>
          <div className="case-grid">
            {cases.map((item) => (
              <article className="case-tile" key={item.code}>
                <div>
                  <span>{item.type}</span>
                  <small>{item.code}</small>
                </div>
                <h3>{item.title}</h3>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="standalone-section evidence-layout" id="evidence">
          <figure className="evidence-frame">
            <img src={evidenceImage} alt="붉은 창문 너머 빈 의자가 놓인 방" />
            <figcaption>
              <strong>window_room_recovered.png</strong>
              <span>복원률 71% / 유리 반사 이상 / 원본 없음</span>
            </figcaption>
          </figure>
          <div className="evidence-copy">
            <p className="site-kicker">EVIDENCE VAULT</p>
            <h2>이미지는 증거가 아니라, 다음 기록의 입구입니다.</h2>
            <p>
              새로 제작한 복원 이미지는 원본 참고 자산을 사용하지 않았습니다. 사이트 안에서는
              증거 사진처럼 배치해 사용자가 곧바로 기록 세계관을 이해하도록 구성했습니다.
            </p>
            <dl>
              <div>
                <dt>감지 시간</dt>
                <dd>03:33</dd>
              </div>
              <div>
                <dt>위험도</dt>
                <dd>중간</dd>
              </div>
              <div>
                <dt>상태</dt>
                <dd>공개 대기</dd>
              </div>
            </dl>
          </div>
        </section>

        <section className="standalone-section submit-band" id="submit">
          <p className="site-kicker">SUBMIT</p>
          <h2>창문이 먼저 당신을 본 경우에만 제보하세요.</h2>
          <p>
            촬영 시각, 주소의 변동 여부, 사진 속 빈자리, 반복되는 문장을 함께 남겨 주세요.
            관리자는 기록을 공개하지 않고 먼저 격리 상태로 복원합니다.
          </p>
          <Link to="/submit">제보 화면으로 이동</Link>
        </section>
      </main>
    </div>
  );
}
