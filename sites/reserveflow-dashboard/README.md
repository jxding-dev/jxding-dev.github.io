# ReserveFlow Dashboard

소상공인 예약관리 대시보드 웹앱 UI 데모입니다. 예약, 고객 메모, 서비스 가격, 문의 메시지, 매장 설정을 실제 관리자 화면처럼 확인할 수 있도록 구성했습니다.

이 프로젝트는 프론트엔드 UI 샘플입니다. 실제 예약 저장, 메시지 발송, 결제, 서버 연동은 포함하지 않습니다.

## 페이지 구성

- `index.html`: 오늘 운영 모드, 예약 요약, 타임라인, 매출 흐름
- `calendar.html`: 주간 예약표, 날짜별 모바일 예약 리스트, 예약 상세
- `reservations.html`: 예약 검색, 상태 필터, 상태 변경, 상세 모달
- `customers.html`: 고객 목록, 프로필, 메모 저장, 방문 기록
- `services.html`: 서비스 카테고리, 가격표, 서비스 추가/수정 모달
- `messages.html`: 문의 목록, 메시지 상세, 빠른 답장 문구
- `settings.html`: 매장 프로필, 운영시간, 예약 규칙, 알림 문구

## 주요 기능

- 공통 sidebar, topbar, 모바일 bottom navigation
- 예약 상태 badge와 상태별 left border
- 모바일 table card list 전환
- 공통 modal, toast, badge, button, input, select, tab, empty state
- LocalStorage 기반 데모 저장

## 수정 위치

- 색상/토큰: `css/common.css`
- 레이아웃/반응형: `css/layout.css`, `css/responsive.css`
- 공통 컴포넌트: `css/components.css`, `js/modal.js`, `js/toast.js`
- 페이지 스타일: `css/pages.css`

## 더미 데이터 위치

- 캘린더 예약: `js/calendar.js`
- 예약 목록: `js/reservations.js`
- 고객 정보: `js/customers.js`
- 서비스 가격: `js/services.js`
- 메시지: `js/messages.js`
- 설정 저장: `js/settings.js`

## LocalStorage Key

- `reserveflow_reservations`
- `reserveflow_customerMemo_*`
- `reserveflow_services`
- `reserveflow_settings`
