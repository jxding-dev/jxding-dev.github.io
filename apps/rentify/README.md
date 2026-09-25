# RENTIFY

## 공유 장비 대여 예약 관리 시스템

**RENTIFY**는 카메라, 태블릿, 노트북, 마이크, 조명 장비 등 다양한 공유 장비를 사용자가 예약하고, 관리자가 예약 승인 및 대여 상태를 관리할 수 있는 장비 대여 예약 관리 웹서비스입니다.

단순한 장비 목록 조회를 넘어서, 예약 신청부터 승인, 대여, 반납까지의 상태 흐름을 관리할 수 있도록 구성한 프로젝트입니다.

---

## 프로젝트 개요

이 프로젝트는 사용자가 필요한 장비를 조회하고 예약을 신청할 수 있으며, 관리자는 장비 정보와 예약 상태를 관리할 수 있는 웹 기반 대여 관리 시스템입니다.

장비 대여 과정에서 발생하는 주요 상태를 데이터로 관리합니다.

```txt
예약 요청 → 승인 완료 → 대여 중 → 반납 완료
```

이를 통해 단순 CRUD 기능뿐만 아니라, 예약 상태 변경과 장비 수량 관리 흐름까지 구현하는 것을 목표로 합니다.

---

## 프로젝트 목적

- 장비 목록을 데이터베이스에서 조회할 수 있도록 구현
- 사용자가 원하는 장비를 선택하고 예약 신청 가능
- 예약 정보가 서버와 DB에 저장되도록 구현
- 관리자가 예약 상태를 변경할 수 있도록 구현
- 장비의 대여 가능 수량을 예약 상태에 따라 관리
- 프론트엔드와 백엔드, DB가 연결된 웹서비스 구조 경험

---

## 주요 기능

### 사용자 기능

- 장비 목록 조회
- 장비 카테고리 필터
- 장비 검색
- 장비 상세 정보 확인
- 장비 예약 신청
- 연락처를 통한 내 예약 조회
- 예약 상태 확인

---

### 관리자 기능

- 장비 등록
- 장비 수정
- 장비 삭제
- 전체 예약 목록 조회
- 예약 상태 변경
- 상태별 예약 필터
- 대여 가능 수량 관리

---

## 예약 상태 흐름

| 상태 | 설명 |
|---|---|
| 예약 요청 | 사용자가 장비 예약을 신청한 상태 |
| 승인 완료 | 관리자가 예약을 승인한 상태 |
| 대여 중 | 실제 장비가 대여된 상태 |
| 반납 완료 | 장비 반납이 완료된 상태 |
| 취소됨 | 예약이 취소된 상태 |

---

## 페이지 구성

### 1. 사용자 메인 페이지

사용자가 장비 목록을 확인하는 페이지입니다.

주요 기능:

- 장비 목록 출력
- 카테고리별 필터
- 검색 기능
- 대여 가능 여부 표시
- 상세 페이지 이동
- 예약하기 버튼 제공

---

### 2. 장비 상세 페이지

선택한 장비의 상세 정보를 확인하는 페이지입니다.

표시 정보:

- 장비 이미지
- 장비명
- 카테고리
- 설명
- 보유 수량
- 현재 대여 가능 수량
- 예약하기 버튼

---

### 3. 예약 신청 페이지

사용자가 장비 예약을 신청하는 페이지입니다.

입력 정보:

- 이름
- 연락처
- 장비 ID
- 대여 시작일
- 반납 예정일
- 사용 목적

---

### 4. 내 예약 확인 페이지

사용자가 본인의 예약 상태를 확인하는 페이지입니다.

조회 기준:

- 연락처

표시 정보:

- 예약번호
- 장비명
- 예약자명
- 대여 기간
- 예약 상태

---

### 5. 관리자 페이지

관리자가 장비와 예약 정보를 관리하는 페이지입니다.

주요 기능:

- 장비 등록
- 장비 수정
- 장비 삭제
- 예약 목록 확인
- 예약 승인
- 대여 처리
- 반납 처리
- 예약 상태 필터

---

## 기술 스택

### Frontend

- HTML
- CSS
- JavaScript

### Backend

- Node.js
- Express

### Database

- MySQL

### Library / Package

- mysql2
- cors
- dotenv

---

## 폴더 구조

```txt
rentify/
│
├─ client/
│  ├─ index.html
│  ├─ detail.html
│  ├─ reserve.html
│  ├─ my-reservation.html
│  ├─ admin.html
│  │
│  ├─ css/
│  │  └─ style.css
│  │
│  └─ js/
│     ├─ main.js
│     ├─ detail.js
│     ├─ reserve.js
│     ├─ myReservation.js
│     └─ admin.js
│
└─ server/
   ├─ server.js
   ├─ db.js
   ├─ .env
   └─ routes/
      ├─ equipmentRoutes.js
      └─ reservationRoutes.js
```

---

## DB 테이블 설계

### equipment 테이블

장비 정보를 저장하는 테이블입니다.

```sql
CREATE TABLE equipment (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  category VARCHAR(50) NOT NULL,
  description TEXT,
  image_url TEXT,
  total_count INT NOT NULL,
  available_count INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### reservations 테이블

예약 정보를 저장하는 테이블입니다.

```sql
CREATE TABLE reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  equipment_id INT NOT NULL,
  user_name VARCHAR(50) NOT NULL,
  phone VARCHAR(30) NOT NULL,
  purpose TEXT,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  status VARCHAR(30) DEFAULT '예약 요청',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (equipment_id) REFERENCES equipment(id)
);
```

---

## API 설계

### 장비 API

| Method | URL | 설명 |
|---|---|---|
| GET | /api/equipment | 장비 전체 조회 |
| GET | /api/equipment/:id | 장비 상세 조회 |
| POST | /api/equipment | 장비 등록 |
| PUT | /api/equipment/:id | 장비 수정 |
| DELETE | /api/equipment/:id | 장비 삭제 |

---

### 예약 API

| Method | URL | 설명 |
|---|---|---|
| GET | /api/reservations | 예약 전체 조회 |
| GET | /api/reservations/search?phone=01012345678 | 내 예약 조회 |
| POST | /api/reservations | 예약 신청 |
| PATCH | /api/reservations/:id/status | 예약 상태 변경 |
| DELETE | /api/reservations/:id | 예약 취소 |

---

## 주요 구현 흐름

1. MySQL 데이터베이스 생성
2. equipment 테이블 생성
3. reservations 테이블 생성
4. Express 서버 구성
5. MySQL DB 연결
6. 장비 목록 조회 API 구현
7. 프론트엔드에서 fetch로 장비 목록 출력
8. 장비 상세 페이지 구현
9. 예약 신청 API 구현
10. 예약 폼 데이터 서버 전송
11. 관리자 예약 목록 출력
12. 예약 상태 변경 기능 구현
13. 장비 등록, 수정, 삭제 기능 구현

---

## 1차 구현 범위

프로젝트의 1차 완성 기준은 다음과 같습니다.

- 장비 목록이 DB에서 불러와진다.
- 장비 상세 페이지가 열린다.
- 예약 신청 정보가 DB에 저장된다.
- 관리자 화면에서 예약 목록을 확인할 수 있다.
- 관리자가 예약 상태를 변경할 수 있다.
- 변경된 상태가 DB에 반영된다.

---

## 추가 구현 예정 기능

- 장비 검색 기능
- 카테고리 필터 기능
- 예약 상태 필터 기능
- 예약 승인 시 대여 가능 수량 감소
- 반납 완료 시 대여 가능 수량 증가
- 관리자용 장비 등록 및 수정 기능 개선

---

## 제외한 기능

초기 구현 범위를 명확히 하기 위해 아래 기능은 제외합니다.

- 회원가입
- 로그인
- JWT 인증
- 실제 결제 기능
- 이미지 파일 업로드
- 캘린더 예약 기능
- 중복 예약 방지 고도화

---

## 기대 효과

RENTIFY는 장비 대여 과정에서 필요한 조회, 예약, 승인, 반납 흐름을 하나의 시스템 안에서 관리할 수 있도록 구성한 프로젝트입니다.

프론트엔드 화면 구현뿐만 아니라 서버 API, MySQL 데이터베이스, 상태 변경 로직을 함께 다루며 실제 웹서비스의 기본 구조를 경험할 수 있습니다.