# jxding-dev portfolio

모든 작업을 한 저장소에 모은 포트폴리오입니다. `main`에 push하면 GitHub Actions가 전체를 빌드해 **https://jxding-dev.github.io/** 로 배포합니다.

## 구조

| 폴더 | 내용 | 공개 주소 |
|---|---|---|
| `index.html` | 메인 허브 페이지 | `/` |
| `apps/<이름>` | 빌드가 필요한 React/Vite 앱 | 아래 표 참고 |
| `sites/<이름>` | 정적 사이트 (그대로 배포) | `/<이름>/` |
| `templates/<이름>` | 업종별 템플릿 | `/templates/<이름>/` |
| `docs/` | AI 작업 가이드, 기획 문서 (배포 안 함) | — |

| 앱 | 공개 주소 |
|---|---|
| `apps/mockfolio` | `/mockfolio/` |
| `apps/queuepilot` | `/queuepilot/` |
| `apps/deadline-drawer` (까먹지말자) | `/deadline-drawer/` |
| `apps/deja-vu-museum` | `/D-J-VU-MUSEUM/` |
| `apps/red-window` | 배포 안 함 (Supabase 필요) |
| `apps/rentify` | 배포 안 함 (Node 서버 필요) |

## 작업 방법

```bash
cd apps/mockfolio
npm install
npm run dev
```

정적 사이트는 `index.html`을 바로 열면 됩니다. 새 정적 사이트는 `sites/`에 폴더를 추가하고, 새 앱은 `apps/`에 추가한 뒤 `.github/workflows/deploy.yml`의 빌드 목록과 복사 경로에 넣어 주세요.

기존 개별 저장소의 커밋 기록은 `git subtree`로 그대로 가져왔습니다.
