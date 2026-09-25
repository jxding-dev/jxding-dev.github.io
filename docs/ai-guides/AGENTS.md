# AGENTS.md

이 문서는 Codex가 프로젝트를 수정하거나 새 목업 페이지를 제작할 때 따르는 작업 기준입니다.

---

## 1. 작업 목표

판매용 홈페이지 목업 템플릿을 제작하거나 기존 랜딩페이지를 수정합니다.

결과물은 AI가 만든 티가 나는 단순 템플릿이 아니라, 실제 소규모 업체가 사용할 수 있는 완성도 있는 반응형 웹사이트처럼 보여야 합니다.

제작 예시 업종:

* 감성 카페
* 피부관리샵
* 미용실
* 클래스/강사
* 소규모 업체 소개
* 병원/클리닉
* 공방/스튜디오

---

## 2. 최우선 원칙

* 기존 화면, 기능, 반응형을 깨지 않습니다.
* 요청과 직접 관련된 파일만 최소 수정합니다.
* 애매하면 새로 만들지 말고 기존 구조를 유지합니다.
* 이전 AI의 작업을 먼저 읽고 이어서 수정합니다.
* 기존에 만든 사이트의 레이아웃, 색감, 카드 구조, 버튼 스타일을 반복하지 않습니다.
* 새 프로젝트마다 컬러 시스템, 타이포그래피, 카드 스타일, 버튼 형태, Hero 레이아웃, 섹션 구성을 새롭게 설계합니다.

---

## 3. 토큰 절약 규칙

* 처음부터 모든 파일을 읽지 않습니다.
* 관련 파일만 찾고 필요한 부분만 확인합니다.
* 긴 파일은 전체 출력보다 검색, 파일 목록, 필요한 범위 읽기를 우선합니다.
* 답변은 짧게 씁니다.
* 수정 파일, 핵심 변경, 확인 결과만 남깁니다.
* 설명보다 작업 결과를 우선합니다.
* 중복 규칙 문서를 새로 만들지 않습니다.
* 같은 내용을 반복하지 않습니다.
* UI 세부값이 필요할 때만 `docs/ui-rules.md`를 읽습니다.

---

## 4. 기본 파일 구조

새 목업을 제작할 때는 아래 구조를 기본으로 사용합니다.

```text
project/
├─ index.html
├─ pages/
│  ├─ about.html
│  ├─ service.html
│  ├─ review.html
│  └─ contact.html
├─ css/
│  ├─ reset.css
│  ├─ common.css
│  ├─ layout.css
│  ├─ components.css
│  ├─ main.css
│  └─ pages.css
├─ js/
│  ├─ common.js
│  ├─ navigation.js
│  ├─ slider.js
│  └─ modal.js
└─ assets/
   ├─ images/
   └─ icons/
```

페이지 구성은 기본적으로 다음을 사용합니다.

* 메인 페이지: `index.html`
* 소개 페이지: `pages/about.html`
* 서비스/메뉴 페이지: `pages/service.html`
* 후기/포트폴리오 페이지: `pages/review.html`
* 문의/오시는 길 페이지: `pages/contact.html`

---

## 5. 코드 작업 규칙

* HTML은 구조, CSS는 디자인, JS는 동작만 담당합니다.
* 클래스명은 kebab-case를 사용합니다.
* `box1`, `text2`, `item3`, `wrap01`, `div1`처럼 의미 없는 이름은 사용하지 않습니다.
* 색상, 폰트, 여백, radius, shadow는 CSS 변수나 공통 클래스로 관리합니다.
* 레이아웃은 flex/grid를 우선 사용합니다.
* `position: absolute`와 `z-index`는 장식 요소나 꼭 필요한 경우에만 최소로 사용합니다.
* JS는 기능별 함수로 나누고, 요소가 없어도 에러가 나지 않게 작성합니다.
* 외부 라이브러리는 꼭 필요할 때만 사용합니다.
* SEO 기본 태그와 접근성 기본값을 유지합니다.

좋은 클래스명 예시:

```text
section-title
hero-content
feature-card
process-item
review-list
contact-form
primary-button
```

---

## 6. CSS 파일 역할

```text
reset.css        기본 초기화
common.css       변수, 폰트, body, container, 공통 유틸
layout.css       header, footer, section layout
components.css   button, card, badge, form, modal, slider
main.css         index.html 전용 스타일
pages.css        서브페이지 공통 스타일
```

`common.css`에는 반드시 기본 디자인 토큰을 선언합니다.

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
}
```

---

## 7. 레이아웃 규칙

* 랜딩페이지는 목적별 섹션 단위로 구성합니다.
* 기본 섹션 예시: Hero, About, Feature, Process, Review, FAQ, Contact, Footer
* 모든 콘텐츠는 `.container` 또는 `.inner` 기준으로 최대 너비와 중앙 정렬을 통일합니다.
* `.container`는 `width: var(--container); margin: 0 auto;`를 사용합니다.
* 섹션은 `padding-block: var(--space-xl);`을 기본으로 사용하되 모바일에서는 과하지 않게 조정합니다.
* margin으로 위치를 억지 조정하지 말고 gap, padding, flex, grid를 활용합니다.
* Hero 높이는 무조건 `100vh`로 고정하지 말고 `min-height`를 사용합니다.
* Hero는 desktop에서는 좌우 배치가 가능하지만 mobile에서는 반드시 세로 배치합니다.

---

## 8. 배경 이미지와 텍스트 규칙

* background-image 위에 텍스트를 올릴 경우 반드시 overlay 레이어를 사용합니다.
* 텍스트 박스에는 `max-width`를 지정합니다.
* 텍스트를 이미지 위에 `position: absolute`로 억지 배치하지 않습니다.
* flex/grid로 정렬합니다.
* Hero 텍스트는 화면 밖으로 밀리거나 잘리지 않아야 합니다.
* 모바일에서는 줄바꿈, 간격, 버튼 배치를 자연스럽게 조정합니다.
* `margin-top: 200px` 같은 임시 위치 조정값을 사용하지 않습니다.

---

## 9. 타이포그래피 규칙

전체 사이트는 아래 계층을 유지합니다.

```text
Brand             32px / Bold / line-height 140%
Section Title     24px / SemiBold / line-height 140%
Content Title     20px / SemiBold / line-height 140%
Price             18px / Bold / line-height 140%
Total Price       28px / Bold / line-height 140%
Body              16px / Regular / line-height 150%
Caption           14px / Regular / line-height 150%
```

* 모바일에서는 같은 계층을 유지하되 `clamp()`를 사용하여 자연스럽게 축소합니다.
* font-weight는 400, 500, 600, 700까지만 사용합니다.
* 800 이상은 특별한 경우 외에는 사용하지 않습니다.
* 900은 사용하지 않습니다.
* 본문 line-height는 150% 이상 유지합니다.
* 제목 전체를 과하게 두껍게 만들지 않습니다.
* px 단위 폰트 크기를 남발하지 않습니다.

---

## 10. 버튼과 액션 규칙

버튼은 중요도에 따라 크기와 대비를 구분합니다.

```text
Primary CTA        최소 높이 48px / 핵심 행동
Navigation / Tab   높이 36~40px / 이동, 전환
Tag / Filter       높이 28~32px / 보조 기능
```

* 핵심 CTA는 화면에서 가장 먼저 인지되도록 충분한 대비를 둡니다.
* 버튼은 터치 영역을 충분히 확보합니다.
* 모바일에서 폭이 부족하면 버튼을 줄바꿈하거나 `width: 100%`로 처리합니다.
* 버튼, 링크, 입력폼에는 hover/focus 상태를 둡니다.
* disabled 상태가 필요한 경우 시각적으로 구분합니다.

---

## 11. 이미지 규칙

모든 이미지는 기본적으로 아래 기준을 유지합니다.

```css
img {
  max-width: 100%;
  height: auto;
}
```

* 카드 이미지처럼 고정 비율이 필요한 경우 `aspect-ratio`를 사용합니다.
* 썸네일이나 카드 이미지는 `object-fit: cover`를 사용합니다.
* 이미지가 부모 영역을 밀어내거나 레이아웃을 깨지 않게 합니다.
* 이미지 비율을 맞추기 위해 텍스트를 잘라내지 않습니다.

---

## 12. 반응형 규칙

기본 분기점은 아래 기준을 사용합니다.

```text
desktop       1024px 이상
tablet        768px ~ 1023px
mobile        767px 이하
small mobile  480px 이하
```

반응형 필수 조건:

* 1440px, 1024px, 768px, 480px, 360px 화면에서 확인합니다.
* 모든 페이지는 360px 모바일 화면에서도 가로 스크롤이 없어야 합니다.
* 텍스트 잘림, 버튼 겹침, Hero 깨짐, 카드 깨짐이 없어야 합니다.
* 반응형을 단순히 width만 줄이는 방식으로 처리하지 않습니다.
* 레이아웃 구조 자체를 모바일에 맞게 재배치합니다.
* 모바일 반응형을 `transform: scale()`로 해결하지 않습니다.
* 2열/3열 카드는 모바일에서 1열 또는 2열로 자연스럽게 변경합니다.

Grid 기본 규칙:

```text
Desktop   3~4열
Tablet    2열
Mobile    1열
```

`body { overflow-x: hidden; }`은 가로 스크롤의 원인을 해결한 뒤 최종 안전장치로만 사용합니다.

---

## 13. UI 상태 규칙

폼이 있는 경우 다음 상태를 고려합니다.

* 기본 상태
* 입력 중 상태
* 에러 상태
* 성공 상태
* 로딩 상태

빈 목록, 완료 메시지, 실패 메시지는 짧고 명확하게 작성합니다.

JS는 기능이 없어도 콘솔 에러가 나지 않게 작성합니다.

---

## 14. 수정 전 확인

수정 전 반드시 확인합니다.

* 유지해야 할 화면, 기능, 반응형 범위
* 버튼, 링크, 폼, 탭, 토글, 스크롤 이벤트 영향 여부
* 클래스명 변경 시 HTML, CSS, JS 참조 관계
* 삭제 대상의 실제 사용 여부

---

## 15. 금지사항

* 기존 사이트와 동일한 컬러 팔레트, 카드 구조, 버튼 형태, Hero 구성을 반복하지 않습니다.
* Bootstrap 템플릿처럼 보이는 일반적인 레이아웃을 피합니다.
* 글자를 배경 이미지 안에 absolute로 아무렇게나 배치하지 않습니다.
* Hero 텍스트에 큰 margin 값으로 위치를 맞추지 않습니다.
* 카드 높이를 강제로 맞추려고 텍스트를 잘라내지 않습니다.
* line-height 1 이하를 사용하지 않습니다.
* 제목 전체에 font-weight 900을 사용하지 않습니다.
* 반응형 문제를 `transform: scale()`로 해결하지 않습니다.
* 사용하지 않는 파일이나 중복 규칙 문서를 새로 만들지 않습니다.

---

## 16. 실패 기준

아래 중 하나라도 발생하면 실패입니다.

* 기존 화면이 깨짐
* 기존 동작이 사라짐
* 반응형이 무너짐
* 새 콘솔 에러가 생김
* 모바일에서 가로 스크롤이 생김
* 텍스트가 배경 영역 밖으로 밀림
* 버튼과 텍스트가 겹침
* 기존 프로젝트와 너무 비슷한 디자인이 반복됨

---

## 17. 최종 검수

작업 완료 후 반드시 확인합니다.

```text
✓ Desktop, Tablet, Mobile에서 UI가 자연스러운가
✓ 360px 화면에서 가로 스크롤이 없는가
✓ Hero 텍스트가 이미지 밖으로 밀리지 않는가
✓ 텍스트, 버튼, 카드가 겹치지 않는가
✓ 카드 높이가 내용 때문에 깨지지 않는가
✓ Typography 계층이 유지되는가
✓ 버튼 크기가 액션 중요도에 맞는가
✓ Hover와 Focus가 존재하는가
✓ 이미지 비율이 유지되는가
✓ JS 콘솔 에러가 없는가
✓ 기존 프로젝트와 동일한 디자인을 반복하지 않았는가
```

문제가 있으면 스스로 수정한 뒤 최종 결과를 제공합니다.

---

## 18. 수정 후 기록 형식

작업 후 답변은 짧게 작성합니다.

```text
수정:
유지:
확인:
참고:
```

각 항목에는 핵심만 적습니다.

예시:

```text
수정:
- hero 영역 반응형 구조 수정
- 버튼 공통 스타일 정리

유지:
- 기존 섹션 순서
- 기존 링크 동작

확인:
- 1440px / 768px / 360px 화면 깨짐 없음
- 콘솔 에러 없음

참고:
- 배경 이미지 위 텍스트는 overlay 방식으로 처리
```

