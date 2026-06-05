import { useState } from 'react';

export default function Submit() {
  const [notice, setNotice] = useState('');

  return (
    <section className="page app-page settings-screen">
      <div className="screen-heading">
        <p className="page__eyebrow">RWA / SUBMIT</p>
        <h1 className="page__title">제보 안내</h1>
        <p className="page__text">직접 업로드는 허용되지 않습니다.</p>
      </div>

      <section className="settings-card app-card">
        <span>접수 방식</span>
        <strong>이메일 제보만 가능</strong>
        <p>방문자 작성 폼, 파일 업로드, 회원 기능은 제공하지 않습니다.</p>
      </section>

      <button
        type="button"
        className="email-card app-card"
        onClick={() => setNotice('전송 전 다시 생각하십시오.')}
      >
        redwindow.archive@example.com
        <span>탭하여 안내 확인</span>
      </button>

      <section className="settings-card app-card">
        <span>제보 양식</span>
        <p>기록 제목, 발생 위치, 시간, 본문, 이미지 URL을 이메일 본문에 적어 주세요.</p>
      </section>

      <p className="observer-hint bottom-sheet">제보 기록은 원문 그대로 보관되지 않습니다.</p>
      {notice ? <p className="app-toast app-toast--static">{notice}</p> : null}
    </section>
  );
}
