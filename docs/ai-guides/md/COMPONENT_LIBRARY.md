# COMPONENT_LIBRARY.md

이 문서는 랜딩페이지 제작 시 사용할 수 있는 컴포넌트 패턴 기준입니다.

컴포넌트는 복붙용 코드가 아니라, 상황에 맞게 변형해서 쓰는 설계 기준입니다.

---

## 1. 컴포넌트 기본 원칙

- 같은 UI를 그대로 복붙하지 않습니다.
- 컴포넌트는 재사용 가능한 단위로 제작합니다.
- Variant와 Modifier를 활용합니다.
- HTML 구조, CSS 스타일, JS 동작을 분리합니다.
- 모바일에서 구조가 무너지지 않게 설계합니다.
- 같은 컴포넌트라도 프로젝트마다 분위기를 바꿉니다.

예시 클래스:

```text
button
button-primary
button-outline
button-large

card
card-feature
card-review
card-price

section
section-dark
section-soft
section-split
```

---

## 2. Hero Component

Hero는 랜딩페이지의 첫 인상입니다.

필수 요소:

- eyebrow 또는 badge
- title
- description
- primary CTA
- secondary CTA
- visual image 또는 graphic
- trust point

### Hero Pattern 1: Split Hero

좌측 텍스트, 우측 이미지 구조입니다.

적합:

- 카페
- 뷰티샵
- 업체 소개
- 클래스

주의:

- 모바일에서는 세로 배치
- 이미지가 텍스트보다 커서 CTA를 밀어내지 않게 함

### Hero Pattern 2: Center Hero

중앙 정렬 Hero입니다.

적합:

- 포트폴리오
- 클래스
- 이벤트
- 브랜드 소개

주의:

- 제목이 너무 길면 모바일에서 답답함
- CTA와 설명 간격 확보

### Hero Pattern 3: Full Image Hero

전체 배경 이미지 위에 텍스트를 올리는 구조입니다.

적합:

- 카페
- 숙소
- 스튜디오
- 뷰티

필수:

- overlay
- safe area
- 텍스트 max-width
- 대비 확보

금지:

- 이미지 위에 absolute로 텍스트를 아무렇게나 배치
- 얼굴, 제품, CTA가 겹침
- hero 높이 100vh 고정 남발

### Hero Pattern 4: Editorial Hero

잡지형 레이아웃입니다.

적합:

- 프리미엄 브랜드
- 감성 카페
- 디자인 스튜디오
- 공방

특징:

- 큰 타이포그래피
- 비대칭 이미지
- 여백 중심 구성

---

## 3. Button Component

버튼은 행동을 유도하는 요소입니다.

### Button Types

```text
Primary    핵심 CTA
Secondary  보조 CTA
Outline    덜 중요한 이동
Ghost      헤더/가벼운 링크
Icon       아이콘 포함 액션
```

### 기본 규칙

- Primary 버튼은 가장 눈에 띄어야 합니다.
- Secondary는 Primary보다 대비가 낮아야 합니다.
- 모바일에서 버튼 높이는 최소 44px 이상입니다.
- 핵심 CTA는 48px 이상을 권장합니다.
- 버튼 텍스트는 명확한 행동을 표현합니다.

좋은 문구:

```text
상담 문의하기
예약하기
메뉴 보기
가격표 확인하기
견적 요청하기
오시는 길 보기
```

나쁜 문구:

```text
Click
Submit
More
Go
Next
```

---

## 4. Card Component

카드는 정보를 묶는 단위입니다.

### Card Types

- Feature Card
- Service Card
- Review Card
- Price Card
- Process Card
- Gallery Card
- Portfolio Card
- FAQ Card

### Feature Card 구성

- icon 또는 image
- title
- description
- optional link

### Review Card 구성

- quote
- name
- role 또는 service
- rating 선택
- profile image 선택

### Price Card 구성

- plan name
- price
- description
- included list
- CTA
- highlight badge 선택

### 금지

- 카드 높이를 강제로 맞추기 위해 텍스트를 자름
- 모든 카드에 같은 그림자 사용
- 카드 간격이 너무 좁음
- 모바일에서 카드 안 텍스트가 넘침

---

## 5. Section Title Component

섹션 제목은 페이지 흐름을 안내합니다.

구성:

- eyebrow
- title
- description

예시:

```text
eyebrow: SERVICE
title: 필요한 정보만 보기 쉽게 정리합니다
description: 메뉴, 위치, 예약 정보를 모바일에서도 쉽게 확인할 수 있습니다.
```

규칙:

- 제목은 1~2줄
- description은 1~2문장
- eyebrow는 선택
- 섹션마다 같은 문장 구조 반복 금지

---

## 6. Navigation Component

Navigation은 단순 메뉴가 아니라 이동 안내입니다.

필수:

- brand
- menu links
- CTA
- mobile menu button

모바일:

- hamburger menu 사용 가능
- aria-label 작성
- 메뉴 열림/닫힘 상태 관리
- 메뉴 외부 클릭 또는 닫기 버튼 고려

주의:

- 헤더 높이가 모바일에서 너무 커지지 않게 함
- CTA가 있으면 메뉴와 시각적 우선순위 구분
- sticky header는 필요할 때만 사용

---

## 7. CTA Component

CTA는 페이지의 핵심 행동을 유도합니다.

### CTA Types

- Simple CTA
- Split CTA
- Banner CTA
- Floating CTA
- Footer CTA
- Sticky Mobile CTA

### CTA 구성

- title
- description
- primary action
- secondary action
- contact info 선택

좋은 CTA:

```text
지금 예약 가능한 시간을 확인해보세요
상담이 필요하다면 카카오톡으로 문의해 주세요
우리 매장에 맞는 페이지 구성을 확인해 보세요
```

주의:

- CTA가 너무 자주 나오면 부담스러움
- 버튼이 여러 개일 경우 우선순위 명확히 구분
- 모바일에서는 sticky CTA를 고려할 수 있음

---

## 8. FAQ Component

FAQ는 전환 직전 불안을 줄입니다.

기본 구조:

- question
- answer
- accordion button
- expanded state

질문 예시:

```text
제작 기간은 얼마나 걸리나요?
자료는 무엇을 준비해야 하나요?
수정은 몇 번 가능한가요?
도메인과 호스팅은 어떻게 하나요?
모바일에서도 잘 보이나요?
추후 수정도 가능한가요?
```

접근성:

- button으로 열고 닫기
- aria-expanded 사용
- 키보드 조작 가능

---

## 9. Form Component

폼은 가능한 짧게 구성합니다.

필수 필드 예시:

- 이름
- 연락처
- 문의 내용

선택 필드:

- 업체명
- 희망 서비스
- 예산
- 희망 일정

상태:

- default
- focus
- error
- success
- loading
- disabled

정적 사이트에서 실제 저장 기능이 없을 경우:

- 카카오톡 링크
- 네이버 예약
- 구글폼
- 이메일 링크
- 전화 링크

로 연결합니다.

---

## 10. Review Component

후기는 신뢰를 만드는 컴포넌트입니다.

패턴:

- Quote Card
- Star Review
- Before/After Review
- Horizontal Review Slider
- Compact Review List

주의:

- 모든 후기가 같은 말투가 되지 않게 함
- 과장 문구 금지
- 너무 긴 후기는 접거나 요약

---

## 11. Gallery Component

갤러리는 분위기를 전달합니다.

패턴:

- Basic Grid
- Bento Grid
- Horizontal Scroll
- Featured Image + Small Images
- Before/After
- Masonry 느낌

주의:

- 이미지 비율 통일
- 모바일에서 너무 작아지지 않게 함
- object-fit 사용
- 중요한 피사체가 잘리지 않게 함

---

## 12. Process Component

프로세스는 고객의 불안을 줄입니다.

패턴:

- Numbered Steps
- Timeline
- Horizontal Process
- Card Process
- Icon Process

예시:

```text
1. 문의
2. 자료 전달
3. 초안 제작
4. 수정
5. 최종 전달
```

규칙:

- 3~5단계 권장
- 각 단계 설명은 짧게
- 모바일에서는 세로 배치

---

## 13. Pricing Component

가격표가 필요한 경우 사용합니다.

구성:

- plan name
- price
- description
- features
- CTA
- recommended badge 선택

주의:

- 가격이 없으면 억지로 만들지 않음
- 가격 대신 “문의 필요”로 처리 가능
- 가장 추천하는 플랜을 시각적으로 구분

---

## 14. Badge / Chip Component

작은 정보 강조에 사용합니다.

사용 예시:

- Best
- New
- Popular
- 예약 가능
- 대표 메뉴
- 1:1 관리
- 모바일 최적화

주의:

- 너무 많이 쓰면 지저분해짐
- 색상 대비 유지
- 작은 화면에서 줄바꿈 자연스럽게 처리

---

## 15. Modal Component

모달은 꼭 필요할 때만 사용합니다.

사용 예시:

- 예약 안내
- 이미지 확대
- 상세 설명
- 문의 안내

필수:

- 닫기 버튼
- ESC 닫기 가능
- background overlay
- focus trap 고려
- 모바일 화면 대응

---

## 16. Slider Component

슬라이더는 과하게 쓰지 않습니다.

사용 예시:

- 후기
- 갤러리
- 대표 이미지

주의:

- JS 오류가 없어야 함
- 버튼과 pagination 제공
- 자동 재생은 신중히 사용
- 모바일에서 swipe 가능하면 좋음

---

## 17. Sticky Mobile CTA

모바일에서 문의/예약 전환이 중요할 때 사용합니다.

구성:

- 전화
- 카카오톡
- 예약
- 문의

주의:

- 콘텐츠를 가리지 않도록 body padding-bottom 확보
- 너무 많은 버튼 넣지 않음
- 2개 이하 권장

---

## 18. Component Self Check

작업 완료 후 확인합니다.

```text
□ 컴포넌트가 재사용 가능한가?
□ 같은 UI를 복붙하지 않았는가?
□ Variant/Modifier로 중복을 줄였는가?
□ 모바일에서 컴포넌트가 깨지지 않는가?
□ hover/focus 상태가 있는가?
□ 버튼과 링크가 명확한가?
□ 폼 상태가 고려되었는가?
□ FAQ는 접근성이 있는가?
□ 이미지 카드 비율이 안정적인가?
□ 컴포넌트가 프로젝트 분위기와 맞는가?
```
