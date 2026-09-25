# REVIEW. 2기 플래그십 최종 검수 결과 & 수정 지시

> 검수 방법: 5개 사이트 × 5페이지 전부 로컬 서버 구동, DOM/CSS/JS 런타임 검사 +
> 코드 정적 분석 + 데스크톱/모바일(375px) 오버플로 전수 검사.
> 결론: **구조·DNA·플래그십 전부 통과. 아래 소수의 수정만 반영하면 완성.**

## A. 통과 확인된 것 (재작업 금지 — 건드리지 말 것)
- 25페이지 전부 200 응답, 콘솔 에러 0, 데스크톱·모바일 가로 스크롤 0
- 1기 금지 목록 위반 0 (폰트·마퀴·그레인·스탬프 등 전무. 헤더 스크롤 블러는 기능적 사용으로 허용)
- 폰트 DNA 5종 정확히 적용 (IBM Plex / Myeongjo+Cormorant / Wanted Sans / Gothic A1+Archivo / Black Han Sans)
- 플래그십 전부 구현 확인:
  리포트(스크롤리 3씬·스텝 10·SVG 차트 3·진행률 바·KPI 카운트업) /
  향수(520vh 시네마 트랙·스테이지·레이어 19·screen 블렌드·온도계) /
  앱(CSS 폰 목업·코딩된 스크린 4·별 canvas·달 SVG·스토어 텍스트 버튼) /
  건축(관성 커서 pointer-events:none + fine 포인터 가드·h-track 가로 스크롤·WRK 번호·SVG 도면) /
  컨퍼런스(키네틱 보드 4줄·타자기 자막·티켓 스텁·D-day·매트릭스 34셀 + dialog + ✱ localStorage 실동작 테스트 통과)
- 모바일 대체 문법 동작 확인 (매트릭스→리스트, h-track 해체, 스크롤리 그래픽 상단 스티키)
- reduced-motion 처리 5개 사이트 전부 존재 (향수 `.cinema.is-static` 해체 포함)
- 이미지 alt 누락 0, 파비콘·og:title/description 전 사이트 존재
- ※ 이미지 49장이 루트에 방치되어 있던 것은 검수 중 각 사이트 `images/`로 이동 완료
  (참조 대조: 누락 0)

## B. 수정 필요 (이번 작업의 전부 — 이것만 고칠 것)

### B-1. [버그] conf-devwave 홈에 `<h1>`이 없다
- `index.html`의 오프닝 보드(`.board`)가 div 4줄로만 구성됨 → 접근성·SEO 위반.
- 수정: `.board` 안의 4줄을 `<h1>` 하나로 감싸고 각 줄을 `<span class="board__line …>`으로 변경
  (h1 기본 마진 리셋, 기존 `.board__line` 스타일·키네틱 JS가 그대로 동작해야 함 —
  JS 셀렉터가 태그가 아닌 클래스 기준인지 확인 후 필요 시 함께 수정).
  시각 결과물은 지금과 100% 동일해야 한다.

### B-2. [누락] 미사용 이미지 5장 배치
- `perfume-ondo/images/ondo-ing-musk.jpg`, `ondo-ing-rain.jpg` →
  `notes.html`의 베이스 노트(머스크)·미들/탑의 레인 노트 항목에 배치
  (현재 notes.html은 원료 이미지 3장만 사용 중 — 5장 체계로 맞출 것. 레이아웃 문법은 유지).
- `studio-muge/images/muge-b-2.jpg`, `muge-c-2.jpg`, `muge-d-2.jpg` →
  `works.html` 리스트 뷰의 행 hover 썸네일 미리보기 소스로 추가하거나,
  그리드 뷰에서 해당 프로젝트 hover 시 두 번째 컷으로 크로스페이드. 둘 중 구현이 깔끔한 쪽 하나만.

### B-3. [보강] og:image 추가 (전 사이트, 크몽/카톡 공유 썸네일)
- 각 사이트 5페이지 전부에 `<meta property="og:image" content="images/<대표이미지>">` 추가:
  report→report-hero.jpg / perfume→ondo-bottle-front.jpg / app→dal-mood-night.jpg /
  muge→muge-hero.jpg / conf→dw-crowd.jpg. (상대경로 한계는 알지만 배포 시 절대경로로
  바꿀 수 있게 일단 통일 — 각 head에 `<!-- 배포 시 절대 URL로 교체 -->` 주석 1줄)

### B-4. [마이너] conf-devwave 카운트다운 타이머
- `setInterval(tickCountdown, 1000)` 이 탭 비활성 시에도 계속 돎 →
  `document.visibilitychange` 에서 정지/재개 처리 추가 (app-dalmuryup의 별하늘 처리와 동일 패턴).

### B-5. [피팅] 실제 이미지 기준 화면 맞춤 (전 사이트)
이미지 49장은 이미 각 사이트 `images/`에 정확한 파일명으로 배치 완료됨 (검수에서 확인).
이제 각 사이트를 로컬 서버로 열어 **실제 사진이 들어간 화면 기준**으로 아래를 맞춰라:
- **잘림 보정**: object-fit:cover 래퍼에서 어색하게 잘리는 사진은 `object-position` 으로 보정.
  우선순위: 인물(연사 8명 얼굴 중앙, 대표·건축가 얼굴, 자는 사람) → 향수병(병 전체가 프레임 안에,
  시네마 씬0·씬4에서 병 중앙 정렬) → 건축(건물 수직선이 기울어 보이지 않는 크롭).
- **향수 시네마 레이어**: 순흑 배경 원료 컷들이 screen 블렌드로 자연스럽게 뜨는지,
  병 컷과 겹칠 때 서로를 가리지 않는지 — 어색하면 레이어 위치·크기만 조정 (씬 구성 변경 금지).
- **텍스트 가독성**: 사진 위 텍스트(리포트 커버, 컨퍼런스 crowd 밴드, 앱 무드 밴드 등)가
  실제 사진 위에서 안 읽히면 오버레이 농도만 미세 조정 (레이아웃 변경 금지).
- **필터 일관성**: muge 사진에 틴트·필터 금지 유지(hover 오버레이만), conf 연사 duotone hover가
  실제 사진에서 자연스러운지.
- **로딩 체감**: 히어로급 대형 이미지(report-hero, muge-hero, dw-crowd, ondo-bottle-front)에
  `fetchpriority="high"` (히어로만), 나머지 lazy 유지 확인.

## C. 수정 후 검증 (보고 항목)
- [ ] conf 홈: h1 존재 + 키네틱 보드가 이전과 동일하게 움직임 (스크롤 시 줄별 반대 방향 이동)
- [ ] 향수 notes: 원료 이미지 5장 전부 표시, 모바일 레이아웃 정상
- [ ] muge works: 추가 컷이 hover에서 자연스럽게 동작, 터치 기기에서 무해
- [ ] 전 사이트 og:image 태그 존재 (25페이지)
- [ ] 피팅: 인물 얼굴 잘림 0, 향수 시네마에서 병·원료 레이어 겹침 자연스러움,
      사진 위 텍스트 전부 가독, object-position 보정한 파일 목록 보고
- [ ] 콘솔 에러 0 유지, 360px 가로 스크롤 0 유지
- [ ] B 항목 외에 어떤 파일도 변경되지 않았을 것 (diff 최소화)

## D. 다음 단계 (이번 작업 아님 — 별도 진행)
1. **포트폴리오 허브 업데이트**: `삭제금지;/index.html` 허브에 2기 5개 카드 추가
   (현재 "10 WORKS" 배지·카드 구성이 1기 기준 — 15 WORKS로. 별도 세션에서 진행 권장)
2. GitHub Pages 배포 (jxding-dev.github.io/<사이트명>) 후 og:image 절대경로 교체
3. 크몽 등록용 대표 스크린샷 캡처 (사이트당 PC 1장 + 모바일 1장, 플래그십 장면 위주)
