# DESIGN_SYSTEM.md

이 문서는 랜딩페이지 목업 제작 시 사용하는 디자인 시스템 기준입니다.

Codex는 새 프로젝트를 시작할 때 이 문서를 참고하여 색상, 폰트, 여백, radius, shadow, 컴포넌트 스타일을 먼저 설계한 뒤 코드를 작성합니다.

---

## 1. 디자인 시스템 목표

- 프로젝트마다 고유한 분위기를 만듭니다.
- 색상만 바꾼 복제 디자인을 만들지 않습니다.
- 폰트, 여백, 카드, 버튼, 이미지 구성까지 브랜드에 맞게 재설계합니다.
- 실제 디자이너가 만든 것처럼 일관된 시각 규칙을 유지합니다.
- 디자인 품질과 유지보수성을 동시에 고려합니다.

---

## 2. 디자인 토큰 기본 구조

`common.css`에는 기본 디자인 토큰을 먼저 선언합니다.

```css
:root {
  --font-xs: clamp(0.75rem, 0.7rem + 0.2vw, 0.875rem);
  --font-sm: clamp(0.875rem, 0.82rem + 0.25vw, 1rem);
  --font-base: clamp(1rem, 0.95rem + 0.3vw, 1.125rem);
  --font-md: clamp(1.125rem, 1rem + 0.6vw, 1.5rem);
  --font-lg: clamp(1.5rem, 1.25rem + 1.2vw, 2.25rem);
  --font-xl: clamp(2rem, 1.5rem + 2.5vw, 4rem);

  --space-xs: clamp(0.5rem, 0.4rem + 0.5vw, 0.75rem);
  --space-sm: clamp(0.75rem, 0.6rem + 0.8vw, 1.25rem);
  --space-md: clamp(1.25rem, 1rem + 1.2vw, 2rem);
  --space-lg: clamp(2rem, 1.5rem + 2vw, 4rem);
  --space-xl: clamp(3rem, 2rem + 4vw, 7rem);

  --container: min(1120px, calc(100% - 32px));

  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-lg: 28px;
  --radius-pill: 999px;

  --shadow-sm: 0 8px 24px rgba(0, 0, 0, 0.06);
  --shadow-md: 0 16px 40px rgba(0, 0, 0, 0.1);
  --shadow-lg: 0 28px 70px rgba(0, 0, 0, 0.14);
}
```

프로젝트 분위기에 따라 색상, radius, shadow는 새로 설계합니다.

---

## 3. 색상 설계 규칙

색상은 최소 5단계로 설계합니다.

```css
:root {
  --color-primary: #000000;
  --color-secondary: #000000;
  --color-accent: #000000;
  --color-bg: #ffffff;
  --color-surface: #f7f7f7;
  --color-text: #1f1f1f;
  --color-muted: #666666;
  --color-border: rgba(0, 0, 0, 0.1);
}
```

### 색상 역할

- `primary`: 핵심 브랜드 색상
- `secondary`: 보조 브랜드 색상
- `accent`: CTA, 강조, 포인트
- `bg`: 전체 배경
- `surface`: 카드, 박스, 섹션 배경
- `text`: 기본 텍스트
- `muted`: 보조 설명
- `border`: 구분선

### 금지

- 모든 프로젝트에 같은 베이지/브라운/화이트 조합 반복 금지
- 검정 버튼 + 흰 배경 + 둥근 카드 반복 금지
- 색상만 바꾸고 레이아웃을 재사용 금지
- 대비가 낮아 읽기 어려운 텍스트 금지

---

## 4. 업종별 색상 방향 예시

아래는 참고용입니다. 그대로 복사하지 말고 업종에 맞게 변형합니다.

### 카페 / 디저트

- Warm Beige
- Cream
- Cocoa Brown
- Muted Orange
- Soft Green

분위기: 따뜻함, 감성, 부드러움

### 피부관리 / 에스테틱

- Ivory
- Champagne
- Dusty Pink
- Soft Gold
- Deep Brown

분위기: 고급스러움, 신뢰감, 깨끗함

### 병원 / 클리닉

- Clean White
- Medical Blue
- Pale Mint
- Cool Gray
- Navy

분위기: 신뢰, 안전, 전문성

### 미용실 / 네일

- Black
- Pearl White
- Rose
- Mauve
- Metallic Gray

분위기: 트렌디함, 세련됨, 개성

### 클래스 / 강사

- Soft Yellow
- Ink Black
- Paper White
- Calm Blue
- Warm Gray

분위기: 명확함, 학습, 친근함

### 소규모 업체 소개

- Charcoal
- White
- Deep Blue
- Gray
- Accent Orange

분위기: 전문성, 실용성, 안정감

---

## 5. 타이포그래피 규칙

전체 사이트는 아래 계층을 유지합니다.

```text
Brand             32px / Bold / line-height 140%
Hero Title        40~64px / 600~700 / line-height 110~125%
Section Title     24~40px / 600~700 / line-height 130~140%
Content Title     20~24px / 600 / line-height 140%
Price             18~22px / 700 / line-height 140%
Total Price       28~36px / 700 / line-height 130%
Body              16~18px / 400 / line-height 150~165%
Caption           13~14px / 400 / line-height 150%
```

### font-weight 기준

- 400: 본문
- 500: 보조 강조
- 600: 제목, 메뉴명
- 700: Hero, 가격, 핵심 CTA
- 800 이상: 특별한 경우 외 사용하지 않음
- 900: 사용 금지

### 타이포그래피 금지

- 모든 제목을 지나치게 굵게 만들지 않음
- 본문 line-height 1 이하 사용 금지
- px 단위 폰트 크기 남발 금지
- 모바일에서 제목이 3~4줄 이상 길게 흐르는 구조 금지

---

## 6. 여백 규칙

여백은 시각적 고급스러움을 만드는 핵심입니다.

### 기본 섹션 여백

```css
.section {
  padding-block: var(--space-xl);
}
```

### 섹션 내부 간격

- 섹션 제목과 본문: `var(--space-sm)`
- 제목 블록과 콘텐츠 그리드: `var(--space-lg)`
- 카드 내부 여백: `var(--space-md)`
- 카드 간격: `var(--space-md)` 이상
- 모바일 섹션 간격: 줄이되 답답하지 않게 유지

### 금지

- margin으로 위치를 억지 조정
- 음수 margin으로 레이아웃 해결
- 텍스트와 버튼이 너무 가까운 구성
- 섹션 사이 간격이 모두 동일해서 단조로운 구성

---

## 7. Radius 규칙

radius는 브랜드 분위기에 맞게 결정합니다.

```text
Minimal / Corporate    8px~12px
Soft / Beauty          20px~32px
Cafe / Handmade        16px~28px
Premium / Luxury       0px~12px 또는 극단적 pill
Trendy / Creative      혼합 가능
```

### 금지

- 모든 카드와 버튼에 무조건 24px radius 반복
- 모든 프로젝트에 pill button 반복
- radius만 다르고 구조는 같은 카드 반복

---

## 8. Shadow 규칙

shadow는 과하게 사용하지 않습니다.

### 사용 위치

- 떠 있는 카드
- 모달
- sticky header
- 강조 CTA 영역
- 이미지 카드

### 금지

- 모든 박스에 같은 shadow 적용
- 진하고 탁한 그림자 남발
- 모바일에서 shadow 때문에 답답해 보이는 구성

---

## 9. 버튼 디자인 규칙

버튼은 액션 중요도에 따라 구분합니다.

```text
Primary CTA        최소 높이 48px / 핵심 행동
Secondary Button   44px 이상 / 보조 행동
Navigation / Tab   높이 36~40px / 이동, 전환
Tag / Filter       높이 28~32px / 보조 기능
```

### 버튼 상태

- default
- hover
- focus
- active
- disabled
- loading

### 버튼 금지

- 버튼 텍스트가 줄바꿈되어 읽기 어려운 구조
- 모바일에서 버튼끼리 겹침
- CTA가 배경과 대비되지 않음
- 모든 프로젝트에 같은 검정 pill 버튼 반복

---

## 10. 카드 디자인 규칙

카드는 단순 박스가 아니라 정보 구조입니다.

카드에 필요한 요소:

- 제목
- 설명
- 이미지 또는 아이콘
- 보조 정보
- CTA 또는 링크
- hover/focus 상태

### 카드 유형

- 이미지 중심 카드
- 텍스트 중심 카드
- 숫자 강조 카드
- 후기 카드
- 가격 카드
- 프로세스 카드
- 갤러리 카드
- 비교 카드

### 금지

- 카드 높이를 강제로 맞추기 위해 텍스트 자름
- 모든 카드가 같은 radius, shadow, padding
- 이미지 비율이 깨지는 카드
- 모바일에서 카드 내용이 넘치는 구조

---

## 11. 그리드 규칙

기본 그리드:

```text
Desktop   3~4열
Tablet    2열
Mobile    1열
```

### 그리드 사용 원칙

- 카드 개수가 3개면 3열
- 카드 개수가 4개면 4열 또는 2x2
- 콘텐츠 길이가 다르면 grid보다 flex/stack 구조 고려
- 갤러리는 masonry 느낌을 줄 수 있으나 반응형 안정성을 우선

---

## 12. 레이아웃 다양성 규칙

새 프로젝트마다 최소 3가지 이상의 레이아웃 패턴을 조합합니다.

예시:

- Split Hero + Asymmetric Gallery + Timeline Process
- Center Hero + Floating Cards + Horizontal Review
- Visual Hero + Bento Grid + Sticky CTA
- Editorial Hero + Image Collage + Pricing Table
- Full Bleed Hero + Scroll Sections + Contact Panel

같은 구조를 색상만 바꾸는 것은 금지입니다.

---

## 13. 디자인 품질 기준

디자인은 다음 수준을 목표로 합니다.

- Dribbble
- Awwwards
- Behance
- Pinterest 레퍼런스 수준의 다양한 레이아웃

단, 과도한 애니메이션이나 구현 난도가 너무 높은 효과는 피합니다.

무료 템플릿처럼 보이지 않도록 합니다.

금지되는 느낌:

- Bootstrap 기본 템플릿
- StartBootstrap 느낌
- Tailwind UI 샘플 느낌
- Flowbite 카드 나열 느낌
- DaisyUI 컴포넌트 조립 느낌
- 흔한 AI 랜딩페이지 느낌

---

## 14. 애니메이션 규칙

애니메이션은 보조 역할만 합니다.

허용:

- Fade
- Slide
- Scale
- Simple reveal
- Hover lift
- Soft transition

금지:

- 과도한 회전
- Bounce 남발
- 무한 애니메이션 남발
- Parallax 남발
- 성능을 떨어뜨리는 스크롤 이벤트
- 사용자가 콘텐츠를 읽기 어렵게 만드는 효과

권장 시간:

```text
transition: 0.2s ~ 0.35s
scroll reveal: 0.4s ~ 0.7s
```

---

## 15. 디자인 시스템 Self Check

작업 전 확인합니다.

```text
□ 이 프로젝트만의 색상 시스템이 있는가?
□ 기존 프로젝트와 다른 폰트 느낌인가?
□ 버튼 스타일이 새롭게 설계되었는가?
□ 카드 스타일이 기존과 다른가?
□ Hero 레이아웃이 새롭게 설계되었는가?
□ 여백이 답답하거나 과하지 않은가?
□ 모바일에서 폰트가 자연스럽게 줄어드는가?
□ 무료 템플릿처럼 보이지 않는가?
```
