# 🚁️ 드론 목표 통제 및 관제 시스템

> 실시간 드론 상태 추적, 미션 할당, 지도 기본 시각화를 제공하는 Vue + Express 기반의 통합 관제 시스템

---

## 프로젝트 개요

목표는 다수의 드론의 상태를 실시간적으로 수신 및 시각화하고, 사용자가 드론의 목표 지점을 설정해 미션을 할당할 수 있도록 하는 “웹 기반 관제 대시보드”입니다. TCP 소컴, WebSocket, REST API를 통합해 실시간성과 제어 기능을 모두 구현했습니다.

기한: 2025년 3월 25일 (화)

---

## 기술 스택

| 영역                 | 기술                                                     |
| -------------------- | -------------------------------------------------------- |
| 프로트엔드           | Vue.js, Vue Router, WebSocket, Mapbox (or OpenStreetMap) |
| 백엔드               | Node.js, Express.js, WebSocket (`ws`), TCP Socket        |
| 시뮬레이터           | Node.js (`net` 모듈) 기반 드론 클라이언트                |
| 데이터베이스(미구현) | (Optional) Sequelize, MySQL                              |
| 기타(미구현)         | Raspberry Pi (LED 제어 기능 구현 예정)                   |

---

## 기능 설명

### ✅ 드론 시뮬레이션 (`drone-client.js`)

- TCP 연결 후 1초 간격으로 모집된 드론 상태정보와 위치을 전송
- `target` 설정 시 향적적 이동 (0.1칸 포건)

### ✅ 서버 (공통 `server.mjs`)

- **TCP 서버**: 드론의 JSON 데이터 수신 및 자동 드론 등록
- **WebSocket 서버**: 모든 환경에 대해 시스템 업데이트 전환
- **REST API**

  - `/api/drone/register`: 수동 드론 등록
  - `/api/drone/list`: 모든 드론 목록 조회
  - `/api/drone/info/:droneId`: 개념 드론 정보 조회
  - `/api/drone/assign-mission/:id`: 드론에 미션 할당 및 target 설정

### ✅ 프론트엔드 (Vue + Router)

- `/dashboard`: 지도 기능 포함 드론 현황 화면
- `/drone-status`: 드론 타겟, 배터리, 속도 상세
- `/mission-records`: 미션 기록 화면
- 현재 위치 업데이트, 드론 선택 시 지도의 해당 위치로 이동

---

## 데이터 헤더 (드론 상태)

```json
{
  "droneId": "drone-241",
  "droneModel": "99AirJY730",
  "battery": "93.2",
  "speed": "7.23",
  "location": {
    "lat": 37.5665,
    "lng": 126.978
  }
}
```

---

## 가져다 쓰기

### ▶️ 서버 실행

```bash
node server.mjs
```

### ▶️ 드론 시뮬레이터 실행

```bash
node drone-client.js
```

> 다수 드론을 시뮬레이션하려면 복잡 실행

### ▶️ Vue 실행

```bash
npm install
npm run dev
```

---

## 확장 기능 (안전기 포함)

- 목표 도달 검증 후 Raspberry Pi LED 제어
- 데이터베이스와 연동해 드론 및 미션 기록 저장
- 드론 건설, 사용자 권한 및 오류 처리 강화

---

## 보안 답안

개발자 가지의 학습 및 시험 목적이며, 실제 드론 운용 시스템과 다른 것을 명시합니다.
