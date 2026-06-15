# RAON PRESTIGE 부동산 홈페이지 샘플

프리미엄 부동산, 고급 빌라, 분양, 오피스텔, 전원주택 소개용 정적 웹사이트 샘플입니다.

## 페이지 구성
- `index.html` 메인
- `properties.html` 매물 목록
- `property-detail.html` 매물 상세
- `premium.html` 프리미엄 매물/분양
- `about.html` 브랜드 소개
- `reservation.html` 방문예약/문의
- `contact.html` 오시는 길/상담 안내

## 주요 기능
- Hero 슬라이드, pagination, 자동 재생, hover pause
- 매물 목록 프론트 필터와 정렬
- 상세페이지 이미지 갤러리
- FAQ 아코디언
- 스크롤 reveal, 숫자 count up
- 모바일 메뉴와 하단 fixed 문의 버튼

## 사용 기술
- HTML5
- CSS3
- Vanilla JavaScript
- 외부 라이브러리 없음

## 수정하기 쉬운 항목
- 공통 색상과 크기: `css/common.css`의 `:root`
- 레이아웃: `css/layout.css`
- 카드, 필터, 갤러리, 폼 컴포넌트: `css/components.css`
- 반응형 기준: `css/responsive.css`
- 슬라이드: `js/slider.js`
- 매물 필터: `js/filter.js`

## 이미지 교체 위치
- 매물 이미지는 `img/properties/property-01.jpg` 형식으로 연결되어 있습니다.
- 실제 이미지 파일을 같은 경로에 추가하거나 HTML의 `src`만 교체하면 됩니다.

## 컬러 수정 위치
- `css/common.css`의 `--color-bg`, `--color-primary`, `--color-primary-dark`, `--color-accent` 값을 수정하면 전체 톤을 바꿀 수 있습니다.

## 문의 폼 안내
- `reservation.html`의 문의 폼은 실제 전송 기능이 없는 UI 샘플입니다.
- 현재는 프론트에서 필수값만 검사하고 성공 메시지만 표시합니다.
