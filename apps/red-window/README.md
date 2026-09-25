# RED WINDOW

RED WINDOW는 공포/괴담 콘텐츠를 중심으로 한 기록형 웹사이트입니다. 방문자는 공개된 기록을 읽고 검색할 수 있으며, 글 작성과 업로드는 제공하지 않습니다. 운영자는 `/admin`에서 기록을 작성, 수정, 삭제할 수 있습니다.

사이트의 이상현상과 관찰 요소는 보조 장치입니다. 본문 읽기를 방해하는 자동 사운드, 점프스케어, 과한 글리치 효과는 사용하지 않습니다.

## 기술 스택

- Vite
- React
- React Router
- Supabase

## 설치 방법

```bash
npm.cmd install
```

## 실행 방법

```bash
npm.cmd run dev
```

기본 접속 주소:

```text
http://127.0.0.1:5173/
```

빌드 확인:

```bash
npm.cmd run build
```

## 환경변수 설정

프로젝트 루트에 `.env` 파일을 만들고 아래 값을 설정합니다.

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
ADMIN_PASSWORD=change-this-admin-password
VITE_ADMIN_PASSWORD_HASH=sha256-hash-of-admin-password
VITE_ENABLE_UNSAFE_CLIENT_ADMIN=false
```

`ADMIN_PASSWORD`는 로컬 관리용 값이며 Vite 클라이언트 코드에서는 직접 읽지 않습니다. `/admin` 화면은 `VITE_ADMIN_PASSWORD_HASH`와 입력값의 SHA-256 해시를 비교합니다.

해시 생성 예시:

```bash
node -e "console.log(require('crypto').createHash('sha256').update('change-this-admin-password','utf8').digest('hex'))"
```

주의: 프론트엔드 해시 비교는 강한 운영 보안이 아닙니다. 운영 배포에서 확실한 관리자 보호가 필요하면 Supabase Auth, Edge Function, 서버 검증 중 하나로 보강해야 합니다.

## Supabase 테이블 생성 방법

Supabase 프로젝트의 SQL Editor에서 아래 파일 내용을 실행합니다.

```text
supabase/records.sql
```

생성되는 테이블:

```text
records
```

주요 필드:

```text
id
record_code
title
category
type
danger
corruption
discovered_at
location
summary
content
image_url
tags
hidden_message
glitch_level
visibility
is_hidden
created_at
updated_at
```

기본 RLS 정책은 `visibility = public` 기록의 읽기만 허용합니다. 클라이언트에서 실제 Supabase insert/update/delete는 기본 차단되어 있습니다.

## 페이지 구조

방문자 페이지:

```text
/
/archive
/record/:id
/search
/observer
/submit
/lost
/hidden/:id
```

운영자 페이지:

```text
/admin
```

## /admin 접속 방법

1. `.env`에 `ADMIN_PASSWORD`를 설정합니다.
2. 같은 비밀번호의 SHA-256 값을 `VITE_ADMIN_PASSWORD_HASH`에 설정합니다.
3. 개발 서버를 재시작합니다.
4. `/admin`으로 접속합니다.
5. 관리자 비밀번호를 입력합니다.

```text
http://127.0.0.1:5173/admin
```

## 글 작성 방법

`/admin` 접속 후 기록 작성 폼에 아래 정보를 입력합니다.

- 기록번호
- 제목
- 분류
- 유형
- 위험도
- 훼손율
- 발견 시각
- 위치
- 요약
- 본문
- 이미지 URL
- 태그
- 숨겨진 문구
- 글리치 레벨
- 공개 여부
- 숨김 여부

태그는 쉼표로 구분합니다.

```text
거울, 엘리베이터, 실화 제보
```

## 글 수정/삭제 방법

`/admin` 하단 기록 목록에서 작업합니다.

- `수정`: 기존 기록을 폼으로 불러와 수정합니다.
- `삭제`: 확인 후 기록을 삭제합니다.
- `새 기록 작성`: 수정 모드를 해제하고 새 기록을 작성합니다.

Supabase 값이 placeholder인 개발 상태에서는 목업 기록이 localStorage에 저장됩니다. 실제 Supabase 연결 상태에서는 브라우저 직접 쓰기가 기본 차단됩니다. 서버 검증 없이 브라우저에서 쓰기를 허용하려면 `VITE_ENABLE_UNSAFE_CLIENT_ADMIN=true`가 필요하지만, 공개 배포에는 권장하지 않습니다.

## public / private / hidden 설명

`visibility`:

- `public`: 방문자 페이지에 노출 가능한 기록
- `private`: 방문자 페이지에서 숨겨지는 기록

`is_hidden`:

- `false`: `/archive`, `/record/:id`, `/search`에서 노출 가능한 기본 기록
- `true`: `/archive` 기본 목록에는 나오지 않고 `/hidden/:id`에서만 접근 가능한 숨김 기록

방문자 노출 규칙:

- `/archive`: `visibility = public` 그리고 `is_hidden = false`
- `/record/:id`: `visibility = public` 그리고 `is_hidden = false`
- `/search`: `visibility = public` 그리고 `is_hidden = false`
- `/hidden/:id`: `visibility = public` 그리고 `is_hidden = true`, localStorage 기반 접근 조건 필요

## 관찰 시스템

관찰 시스템은 실제 개인정보를 수집하지 않습니다. 카메라, 마이크, 위치, IP를 사용하지 않고 DB에도 방문자 정보를 저장하지 않습니다.

사용하는 localStorage 키:

```text
rwa_visit_count
rwa_read_record_ids
rwa_last_visit_at
rwa_page_stay_seconds
rwa_lost_entry_count
rwa_search_action_count
rwa_observation_level
```

초기화:

```js
localStorage.clear();
```

## /submit 안내

`/submit`은 방문자 업로드 폼을 제공하지 않습니다. 이메일 제보 안내만 표시합니다.

현재 안내 이메일:

```text
redwindow.archive@example.com
```

실제 운영 시 프로젝트용 이메일로 교체하세요.

## 배포 방법

추천 배포:

- Vercel + Supabase

절차:

1. GitHub 저장소에 프로젝트를 올립니다.
2. Vercel에서 저장소를 import 합니다.
3. Build Command는 `npm run build`로 둡니다.
4. Output Directory는 `dist`로 둡니다.
5. Vercel 환경변수에 `.env` 값을 등록합니다.
6. Supabase SQL Editor에서 `supabase/records.sql`을 실행합니다.

## 주의사항

- 방문자 회원가입, 로그인, 댓글, 좋아요, 채팅, 방문자 업로드 기능은 없습니다.
- 자동 사운드와 점프스케어는 없습니다.
- 이상현상 효과는 보조 요소이며 괴담 본문보다 앞서지 않게 구성되어 있습니다.
- `/admin` 비밀번호는 프론트엔드 번들에 포함될 수 있으므로 실제 운영 보안에는 충분하지 않습니다.
- 현재 구조는 비밀번호 원문 대신 해시만 클라이언트에 노출하지만, 해시 비교 역시 완전한 운영 보안은 아닙니다.
- Supabase RLS 쓰기 정책은 운영 보안 기준에 맞게 별도 설계해야 합니다.
- 실제 DB write는 기본적으로 브라우저에서 차단됩니다.
- private 기록은 방문자 조회 함수에서 제외됩니다.
- hidden 기록은 archive 기본 목록에서 제외됩니다.
