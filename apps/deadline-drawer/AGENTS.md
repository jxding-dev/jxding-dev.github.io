# CODEX 인수인계 — deadline-drawer (앱 표시명: 까먹지말자)

이 문서는 Claude가 만든 React + Vite PWA 프로젝트를 **Codex로 이어서 작업할 때** 쓰는 작업 지시서다.
핵심은 **기존 코드·로직·디자인을 함부로 손대지 않고**, 요청받은 부분만 **최소 수정**하는 것이다.
아래 "현재 상태"는 실제 코드를 확인해 작성했으니, 추측으로 바꾸지 말고 그대로 신뢰한다.

---

## 0. 프로젝트 기본 정보 (현재 상태)

| 항목 | 값 | 주의 |
|------|-----|------|
| 저장소/패키지/배포경로 이름 | `deadline-drawer` | **절대 바꾸지 말 것** (아래 1·4 참고) |
| 앱 표시명(UI) | `까먹지말자` | 헤더·`<title>`·manifest·설정에 모두 이 이름 |
| 태그라인 | `놓치기 전에 꺼내보기` | |
| 저장소 | https://github.com/jxding-dev/deadline-drawer.git | |
| 배포 주소 | https://jxding-dev.github.io/deadline-drawer/ | |
| 스택 | React 18 + Vite 5 (순수 JS, **TypeScript 아님**) | |
| 의존성 | `react`, `react-dom`, `@vitejs/plugin-react`, `vite` **뿐** | 새 라이브러리 금지 |
| 상태 관리 | `useState` / `useEffect` 만 (라우터·상태 라이브러리 없음) | |
| 저장 | 서버 없음, `localStorage` 만 | |
| 배포 | GitHub Pages + GitHub Actions | Pages Source = **GitHub Actions** |
| Vite base | `/deadline-drawer/` | 유지 필수 |
| 로컬 폴더명 | `까먹기 전에` (한글) | 단순 표시용, 저장소와 무관 |
| 개발 OS | Windows (PowerShell + Git Bash), 실행은 `실행.bat` | LF→CRLF 경고는 무시해도 됨 |

> ⚠️ **이름이 두 종류다.** UI 표시명은 `까먹지말자`, 저장소/배포 경로는 `deadline-drawer`.
> 이 둘은 **일부러 다른 것**이다. "통일하겠다"며 한쪽을 바꾸지 마라. 특히 `deadline-drawer` 경로를 바꾸면 배포가 깨진다.

---

## 1. 절대 규칙 (위반 금지)

1. **기능 로직을 수정하지 않는다.** — CRUD, `localStorage` 저장, 날짜 계산, 필터, 통계, PWA, 라우팅/탭/오버레이 화면 전환 로직.
2. **디자인 컨셉을 새로 갈아엎지 않는다.** — 라이트 테마(화이트) + 앰버 포인트 + 잉크 블랙(검정) 주요 액션 톤 유지. 색은 전부 `variables.css` 토큰 경유. 요청받은 부분만 손본다.
3. **전체 리팩토링 금지.** — 컴포넌트 재작성/파일 이동/폴더 구조 변경/대량 변수명 변경/CSS 전체 재작성 금지.
4. **새 라이브러리 설치 금지.** — 의존성 복구용 `npm install`만 허용. `npm install <pkg>` 금지.
5. **한글/인코딩을 깨뜨리지 않는다.** — 모든 파일 UTF-8 유지. 한글 UI 문구 임의 수정 금지. 파일 전체 재저장·포매터 일괄 실행 금지 (5번 섹션 참고).
6. **Git 기록을 망가뜨리지 않는다.** — `.git` 삭제, `git reset --hard`, `--force` push, 히스토리 변조 금지.
7. **배포 설정을 함부로 바꾸지 않는다.** — `vite.config.js`의 `base`, `.github/workflows/deploy.yml`, `public/manifest.webmanifest`, `public/sw.js`는 꼭 필요할 때만.

---

## 2. 아키텍처 / 파일 맵

```
index.html              # PWA 메타. 경로는 %BASE_URL% 토큰 사용(아래 4-D)
vite.config.js          # base:'/deadline-drawer/', server.port = process.env.PORT||5173
.github/workflows/deploy.yml   # GitHub Pages 배포(Actions)
public/
  manifest.webmanifest  # 앱명 까먹지말자, start_url/scope=/deadline-drawer/ (하드코딩)
  sw.js                 # 서비스워커 (stale-while-revalidate, CACHE='kkamukgi-v3')
  icon.svg              # 파비콘(SVG)
  icons/icon-192.png, icon-512.png, icon-maskable-512.png   # PWA 아이콘
src/
  main.jsx              # 진입점 + 프로덕션 한정 SW 등록(import.meta.env.PROD)
  App.jsx               # ★ 라우팅 허브: activeTab + screen 오버레이 상태
  styles/
    variables.css       # ★ 디자인 토큰(색/간격/반경). 색은 전부 여기 변수로
    global.css          # reset + body/#root, #root는 flex 중앙정렬
  data/
    tabs.js             # 하단 탭: today/week/overdue/all/stats (라벨 오늘/이번주/지남/전체/기록)
    listFilters.js      # 전체목록 상태필터 7종
    sampleDeadlines.js  # 더미 데이터(오늘 기준 상대 오프셋으로 생성)
    defaultCategories.js# ★ 기본 카테고리 + getCategory 레지스트리
  hooks/
    useDeadlines.js     # ★ localStorage 'deadline-drawer-items' + CRUD/상태전이
    useCategories.js    # ★ localStorage 'deadline-drawer-categories'(사용자 추가분만)
  utils/
    dateUtils.js        # D-day/오늘·이번주·지남 판정/포맷 (전부 Date 객체 기준)
    labelUtils.js       # 중요도/상태 라벨·색 매핑
    deadlineFilters.js  # getListItems 등 목록 필터·정렬
    statsUtils.js       # 월별 통계 집계
    storage.js          # readJSON/writeJSON (파싱 실패 방어)
    id.js               # createId (crypto.randomUUID + fallback)
    backup.js           # JSON 백업 buildBackup/parseBackup(검증·정규화)
  components/           # AppLayout, AppHeader, TabBar, DeadlineCard, SummaryCard,
                        # EmptyState, QuickAddButton, FilterTabs, CategoryChips,
                        # DeadlineForm, MonthlySummary, StatBox, NotFound
  pages/                # HomePage, ListPage, AddPage, DetailPage, EditPage,
                        # StatsPage, SettingsPage  (각 .css 동반)
```

**라우팅(App.jsx):** 하단 탭 `activeTab`(today/week/overdue/all/stats) + 오버레이 `screen`(`{type:'tabs'|'add'|'detail'|'edit'|'settings', id?}`).
- `today`→HomePage, `stats`→StatsPage, 그 외→ListPage(해당 필터). 설정은 헤더 ⚙️ → `settings` 오버레이.
- add/detail/edit/settings는 탭바 없는 풀스크린(각자 `.app-frame` 재사용).
- 카드 본문 클릭 → 상세(`onOpen`). **목록 카드에는 인라인 액션 버튼이 없다** — 완료/미루기/보류/복구/수정/삭제는 전부 **DetailPage**에 있다.

---

## 3. 데이터 모델 / 저장

**기한 항목 (deadline item):**
```js
{
  id,                       // createId()
  title,                    // 문자열
  category,                 // 카테고리 id ('etc' 등)
  dueDate,                  // "YYYY-MM-DD" 로컬 날짜 문자열 (또는 null)
  importance,               // 'low' | 'medium' | 'high'
  status,                   // 'pending' | 'completed' | 'postponed' | 'onHold'
  memo,                     // 문자열(빈값 허용)
  createdAt, updatedAt,     // ISO 문자열 (저장 시 updatedAt 자동 갱신)
  postponedCount,           // 숫자
  completedAt,              // ISO 문자열 | null
}
```
**카테고리:** `{ id, label, icon, custom? }`. 기본 8종(utility/subscription/hospital/document/delivery/exam/appointment/etc)은 **삭제 불가**. 사용자 추가분만 삭제 가능하며, 삭제 시 그 카테고리를 쓰던 기한은 `etc`로 이동(`reassignCategory`).

**localStorage 키:** `deadline-drawer-items`(기한), `deadline-drawer-categories`(사용자 카테고리만).

**중요 규칙:**
- 날짜 비교는 **문자열이 아니라 Date 객체**(`dateUtils`의 `startOfDay` 등) 기준. 직접 문자열 비교로 바꾸지 말 것.
- 표시용 카테고리 라벨/아이콘은 항상 `defaultCategories.js`의 `getCategory(id)`로 조회(사용자 카테고리도 인식하는 레지스트리). 정적 import로 우회하지 말 것.

---

## 4. 배포 / PWA — 가장 잘 깨지는 곳 (반드시 숙지)

**A. base 경로 일관성.** 다음 4곳이 서로 맞아야 한다. 저장소 이름을 바꾸지 않는 한 건드리지 말 것:
1. `vite.config.js` → `base: '/deadline-drawer/'`
2. `public/manifest.webmanifest` → `start_url`, `scope`, `icons[].src` 가 `/deadline-drawer/...` (이 파일은 정적이라 Vite가 경로를 안 고쳐줌 → **하드코딩**)
3. `index.html` → `%BASE_URL%` 토큰 (Vite가 빌드시 base로 치환)
4. GitHub Pages 자체 경로

**B. package-lock 이름 일치.** `package.json`의 `name`은 `deadline-drawer`. `package-lock.json`의 name도 같아야 CI `npm ci`가 통과한다. **lock을 이유 없이 재생성하지 말 것.**

**C. Pages Source = GitHub Actions.** 저장소 Settings → Pages → Source가 반드시 **GitHub Actions**여야 한다. "Deploy from a branch"로 되면 빌드 안 된 소스를 서빙해 **흰 화면**이 난다. (과거에 이 문제로 한 번 깨졌었음.)

**D. index.html은 `%BASE_URL%` 토큰 사용.** 예: `href="%BASE_URL%manifest.webmanifest"`. 이건 Vite의 HTML 환경변수 치환 기능으로 정상 동작한다(빌드 시 `/deadline-drawer/`로 바뀜). **CRA식 `%PUBLIC_URL%`로 바꾸거나 절대경로 `/manifest...`로 되돌리지 말 것.**

**E. 서비스워커.** `src/main.jsx`에서 `import.meta.env.PROD`일 때만 `${import.meta.env.BASE_URL}sw.js` 등록(실패해도 try/catch로 무시). `public/sw.js`는 same-origin GET만 stale-while-revalidate. 캐시 내용을 바꿨으면 `sw.js`의 `CACHE` 버전 문자열을 올려 옛 캐시를 무효화한다(현재 `kkamukgi-v3`).

**F. 배포 흐름.** `main`에 push → Actions가 `npm ci` → `npm run build` → `dist` 업로드 → 배포. 별도 수동 배포 불필요. `node_modules`/`dist`는 커밋하지 않는다(.gitignore에 `.env*` 포함).

---

## 5. 인코딩 보호 규칙 (한글 깨짐 방지)

이 프로젝트는 한글 UI 문구가 많다. 인코딩이 깨지면 화면이 망가진다.

**하지 말 것**
- 파일 전체 불필요한 재저장 / Prettier·formatter 일괄 실행
- `Set-Content`, `Out-File`, `echo > file`로 한글 포함 파일 덮어쓰기 (PowerShell 기본 인코딩은 UTF-16)
- 줄바꿈 CRLF/LF 일괄 변환, 한글 문자열 복사·재입력
- `package-lock.json` 이유 없는 재생성

**허용**
- 가능하면 `apply_patch`로 **필요한 줄만** 수정
- 직접 쓰면 UTF-8 + `newline="\n"` 명시 (예: Python `Path.write_text(text, encoding="utf-8", newline="\n")`)

**수정 후 확인** — diff에 `�`, `ì`, `ë`, `ê`, `í` 같은 글자가 생기면 인코딩 깨짐. 즉시 멈춘다.
```bash
git diff --check
```

---

## 6. 로컬 실행 / 검증

```bash
npm install        # 최초 1회 (또는 의존성 복구)
npm run dev        # 개발 서버 (또는 프로젝트 루트의 실행.bat 더블클릭)
npm run build      # 배포 빌드 — 작업 후 반드시 성공 확인
```
- dev 서버는 `PORT` 환경변수를 따른다(`vite.config.js`의 `server.port`).
- 빌드 결과 `dist/index.html`의 경로가 `/deadline-drawer/...`로 치환됐는지 확인하면 base 정상.

---

## 7. 현재 반응형 상태 (사실대로 기록 — 추측 금지)

- `AppLayout.css`의 `.app-frame`은 현재 **`width:100%; max-width:none`** 으로, 화면 폭을 **항상 꽉 채운다**.
  (주석에는 "480px↑ 중앙 프레임"이라 적혀 있지만 **실제 CSS는 그렇지 않다.** 옛 주석이 남은 것.)
- 즉, 데스크톱에서도 중앙 모바일 프레임으로 좁히지 않는다. 이게 현재 의도된 상태인지 사용자에게 확인 후 작업할 것. **임의로 중앙 프레임을 부활시키지 마라.**
- 최소 대응 폭 360px, 주 대상 360~430px. 가로 스크롤이 생기면 안 됨.
- 디자인은 최근 한 차례 다듬어졌다(카드 그라데이션/반경/간격, 헤더 리스타일). 색은 전부 `variables.css` 토큰을 통하므로, 손볼 일이 있으면 **토큰을 통해** 바꾼다.

---

## 8. Codex 작업 순서 (일반)

1. `git status` / `git log --oneline -5` — 브랜치가 `main`인지, 미커밋 변경이 있는지 확인. **사용자 변경을 덮어쓰지 않는다.**
2. 작업 대상 파일을 **읽고**, 실제 className/함수명을 확인한 뒤 **그에 맞춰** 최소 수정.
3. `npm run build` 성공 확인.
4. `git diff --stat` / `git diff --check` — 의도치 않은 대량 변경·한글 깨짐 없는지 확인.
5. 선택적 add 후 커밋(메시지는 작업 내용). `git add .` 지양, `node_modules/dist/.env` 포함 금지, `--force` 금지.
6. push 후 Actions가 초록인지, 배포 주소가 정상인지 확인(필요 시 강력 새로고침).

---

## 9. Codex에 붙여넣을 기본 프롬프트(템플릿)

```txt
React + Vite PWA 프로젝트 deadline-drawer(앱 표시명 "까먹지말자")를 이어서 작업한다.
먼저 저장소 루트의 AGENTS.md를 읽고 그 규칙을 모두 지켜라.

절대 규칙:
- 기능/로직(CRUD, localStorage, 날짜계산, 필터, 통계, PWA, 라우팅)을 수정하지 마라.
- 디자인 컨셉을 갈아엎거나 전체 리팩토링하지 마라.
- 새 라이브러리 설치 금지. useState/useEffect만 사용.
- 한글 UI 문구·인코딩(UTF-8)을 깨뜨리지 마라. formatter 일괄 실행 금지.
- 'deadline-drawer'(저장소/배포 경로)와 vite base '/deadline-drawer/'를 바꾸지 마라.
  앱 표시명 '까먹지말자'와는 별개다(일부러 다름).
- package-lock.json을 이유 없이 재생성하지 마라.
- .git 삭제 / reset --hard / force push 금지.

작업할 내용: <여기에 구체적 요청>

작업 후:
1) npm run build 성공 확인
2) git diff --check 로 한글 깨짐·대량변경 점검
3) 문제 없으면 변경 파일만 선택 add 후 커밋·push
출력: 완료했습니다 / 원인 / 수정 파일 / build 성공 여부 / push 여부 (길게 설명하지 말 것)
```

---

## 10. 최종 점검 체크리스트

- [ ] `npm run build` 성공, 콘솔 에러 없음
- [ ] 기존 데이터 유지, 새 기한 추가/수정/삭제/상태변경 정상
- [ ] 360·375·390·430px에서 가로 스크롤·레이아웃 깨짐 없음
- [ ] 하단 탭바와 본문 겹침 없음, 플로팅 버튼 화면 안
- [ ] 한글 문구 정상(인코딩 OK), `git diff --check` 깨끗
- [ ] base 경로/`%BASE_URL%`/manifest/lock 이름 그대로
- [ ] 배포 후 https://jxding-dev.github.io/deadline-drawer/ 정상(필요 시 강력 새로고침)
