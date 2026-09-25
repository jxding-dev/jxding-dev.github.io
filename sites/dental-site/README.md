# Prime Dental Clinic Website

프리미엄 치과 홈페이지 샘플입니다. 청록, 민트, 네이비, 골드 포인트를 중심으로 신뢰감 있는 병원/클리닉 톤을 유지하며 360px부터 반응형으로 동작하도록 구성했습니다.

## 페이지 구성

- `index.html` - 메인 랜딩 페이지
- `about.html` - 병원소개
- `doctors.html` - 의료진 소개
- `treatments.html` - 진료과목
- `reservation.html` - 예약/상담
- `location.html` - 오시는 길

## 주요 기능

- fixed header, 모바일 햄버거 메뉴
- hero, quick reservation, CTA, fixed bottom bar
- 진료과목 카드 hover 인터랙션
- 후기 Vanilla JS 슬라이드
- FAQ 아코디언
- IntersectionObserver 기반 reveal 애니메이션
- 지도 및 이미지 placeholder 접근성 라벨
- 360px 모바일 기준 반응형 레이아웃

## 수정 가능한 항목

- 색상, 폰트, container, radius, shadow: `css/common.css`의 `:root`
- 공통 레이아웃 및 컴포넌트 스타일: `css/main.css`
- 반응형 breakpoint: `css/responsive.css`
- 모바일 메뉴, FAQ, reveal, 예약 폼 UI 동작: `js/main.js`
- 후기 슬라이드: `js/slider.js`
- 병원명, 전화번호, 주소, 진료시간: 각 HTML의 header/footer/CTA/location 영역

## 사용 기술

- HTML5
- CSS3
- Vanilla JavaScript

## 참고

- 실제 지도 API와 실제 예약 전송 기능은 포함하지 않은 UI 샘플입니다.
- Before/After 영역은 placeholder이며, 의료광고 과장 표현을 피하고 “개인에 따라 결과가 다를 수 있습니다.” 문구를 유지했습니다.
