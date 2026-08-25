# [태스크 분해] AI-Place-Mate — 개발 태스크 리스트

**문서 ID:** TASKS-AIPLACE-MVP-001
**개정 버전:** 1.0
**날짜:** 2026-08-25
**상위 문서:** [`SRS-ai-place-v1.0.md`](SRS-ai-place-v1.0.md) (SRS-AIPLACE-MVP-001 v1.9, ISO/IEC/IEEE 29148:2018)
**작성 관점:** Technical Project Manager / System Architect

---

## 0. 분해 원칙과 읽는 법

### 0.1 도출 규칙

| 규칙 | 내용 |
| --- | --- |
| 근거 강제 | 모든 태스크는 SRS의 **실재하는 절 또는 요구사항 ID**를 근거로 갖는다. 근거를 댈 수 없는 기능은 만들지 않았다 |
| 관점 분리 | **UI/UX 디자인(`UX-`)** 과 **개발·인프라(`FR-`·`IN-`)** 를 별도 표로 분리했다 |
| 최소 단위 | 1스프린트(2주) 안에 착수·완료 판정이 가능한 크기로 쪼갰다. 그보다 큰 것은 분할했다 |
| 의존성 | 선행 태스크는 **없으면 착수 자체가 불가능한 것**만 적었다. "있으면 편한 것"은 의존성이 아니다 |
| 복잡도 | H = 외부 연동·동시성·정확도 튜닝·되돌리기 비용이 큰 것 / M = 표준적 구현 / L = 단순 CRUD·설정·표기 |
| ID 완전 표기 | 요구사항 ID는 `REQ-FUNC-002 · REQ-FUNC-010`처럼 **매번 전체를 적는다.** `002 · 010` 축약은 검색에 걸리지 않아 추적성 문서에서는 없는 것과 같다 |

### 0.2 ID 체계

| 접두 | 관점 | 건수 |
| --- | --- | --- |
| `UX-` | UI/UX 디자인 (화면 설계·플로우·라이팅 가이드) | 15 |
| `FR-` | 백엔드/프론트엔드 기능 개발 | 82 |
| `IN-` | 인프라 구성·공통 계층·운영 | 14 |
| **합계** | | **111** |

`FR-` 태스크는 기능명 앞에 계층을 표기했다 — `[BE]` 백엔드 · `[FE]` 프론트엔드.

### 0.3 SRS에서 태스크로 오지 않은 것 (의도적 제외)

| 제외 | 근거 |
| --- | --- |
| 다지점 공정 지점 산출 · 리뷰 3축 재가공 · AI 전화 예약 대행 · 광고 상품 | SRS §1.2 **제외 (v0.1)** 목록 |
| 지도·경로 API 연동 | SRS §3.1 · §8.1 — **v0.1 미사용**, v0.2 도입 |
| 실시간 매장 상태 공급자 연동 | SRS §3.1 · §8.1 — **검토 단계**, 단가 조건 미충족 시 미도입 |
| 성분(F1a)·접근성(F1b) 데이터 적재 | SRS §1.2 · §9.2 — v0.1은 **필드만 사전 확보** (→ `FR-006`) |
| E1·E2 이용자 클래스 기능 | SRS §2.2 — **Won't (필드만)** |
| 결제·정산 자체 구축 | SRS §1.2 — PCI-DSS 준수 PG 위탁 (→ `FR-031`) |
| 외부 데이터 조달 단가 통제 (`REQ-NF-023`) | 실시간 상태 공급자 **미도입**이므로 적용 대상이 없다. 시스템 기능이 아니라 **제휴 계약 단가 검토 항목**이며, 도입 시 `IN-`·`FR-` 태스크가 새로 생긴다 |

> **요구사항 커버리지.** SRS의 `REQ-FUNC-001~027`(27건) · `REQ-NF-001~032`(32건) 총 **59건 중 58건**이
> 하나 이상의 태스크에 연결된다. 연결되지 않은 1건은 위 표의 `REQ-NF-023`이며 사유를 명시했다.

---

## 1. UI/UX 디자인 태스크

> SRS §3.1.2는 "각 화면의 **논리적 특성만** 규정하며 시각 설계는 포함하지 않는다"고 명시한다.
> 따라서 아래 태스크의 근거는 **화면이 반드시 만족해야 할 제약**(필수 필드 0개, 설정 화면 3개 이하, 판정형 문구 금지 등)이며,
> 시각 표현은 각 태스크 안에서 결정한다.

| Task ID | Epic (도메인) | Feature (기능명) | 관련 SRS 섹션 | 선행 태스크 (Dependencies) | 복잡도 (H/M/L) |
|---|---|---|---|---|---|
| UX-001 | Design Foundation | 디자인 시스템 · 토큰 · 공통 컴포넌트 정의 † | §3.1.2 (시각 설계는 SRS 범위 외로 명시) | None | M |
| UX-002 | Search Entry | 조건 입력 화면 설계 — 필수 입력 필드 0개, 입력 단계 1회 이하 | §3.1.2, REQ-FUNC-008 | UX-001 | M |
| UX-003 | Search Entry | 폴백 필터 UI 설계 및 전환 고지 문구 | §3.1.2, REQ-FUNC-009 | UX-002 | M |
| UX-004 | Candidate | Top-3 카드 설계 — 인당가 범위·대표 메뉴·상황 속성·근거 4항목·페이지네이션 없음 | §3.1.2, REQ-FUNC-002 · REQ-FUNC-010 · REQ-FUNC-014 | UX-001 | H |
| UX-005 | Evidence | 신선도 경고 표기 설계 — 90일 초과 병기, 판정형 문구 금지 | §3.1.2, REQ-FUNC-011 | UX-004 | M |
| UX-006 | Evidence | 공유 카드 템플릿 설계 (이미지 · 링크 2종) | §3.1.2, REQ-FUNC-012 | UX-004 | M |
| UX-007 | Evidence | 조건 불일치 신고 플로우 설계 | REQ-FUNC-013 | UX-004 | L |
| UX-008 | Reservation | 예약 · 결제 · 취소 플로우 설계 — 재입력 필드 0개 | REQ-FUNC-015 · REQ-FUNC-016 · REQ-FUNC-017 | UX-001 | H |
| UX-009 | Agent Room | 대화방 설계 — 소환 매장 수 및 180초 카운트다운 노출 | §3.1.2, REQ-FUNC-022 · REQ-FUNC-023 | UX-001 | H |
| UX-010 | Agent Room | 제안 비교 화면 설계 — 적합도 1순위 정렬, 가격 협상 요소 부재 | §3.1.2, REQ-FUNC-024 | UX-009 | M |
| UX-011 | Merchant Console | 매장 콘솔 설계 — 설정 화면 3개 이하, 필수 항목 5개 이하, 1회 클릭 수정 | §3.1.2, REQ-FUNC-019 · REQ-FUNC-027 | UX-001 | H |
| UX-012 | Privacy | 개인 제약 정보 옵트인 동의 화면 설계 | REQ-NF-014 · REQ-NF-032, §8.6.4 | UX-001 | M |
| UX-013 | Performance | 모바일 성능 가이드 — LCP 2.5s 대응 이미지·번들 규칙 | REQ-NF-006, §6.3 | UX-001 | M |
| UX-014 | Resilience | 빈 화면 금지 상태 설계 — 폴백 전환 · 제안 0건 Top-3 회귀 | §8.3 규칙 5, REQ-FUNC-025 | UX-003, UX-009 | M |
| UX-015 | Content | 근거 문장 · 확인 주체 표기 라이팅 가이드 — 판정 금지 원칙 | §1.1, REQ-FUNC-010 · REQ-FUNC-011, §8.3 규칙 3 | UX-004 | M |

† **UX-001만 SRS에 직접 대응하는 요구사항이 없다.** §3.1.2가 시각 설계를 명시적으로 SRS 범위 밖에 두었기 때문이며,
UX-002 이하 전 태스크의 공통 선행이므로 남겨두되 이 사실을 밝힌다. 착수 전 PM 승인 대상이다.

---

## 2. 인프라 · 공통 계층 태스크

| Task ID | Epic (도메인) | Feature (기능명) | 관련 SRS 섹션 | 선행 태스크 (Dependencies) | 복잡도 (H/M/L) |
|---|---|---|---|---|---|
| IN-001 | Platform | API Gateway 구축 — 인증 · 라우팅 공통 계층 | §3.1, §5.1 | None | H |
| IN-002 | Security | 전송 구간 TLS 1.3 적용 | §3.1.4, REQ-NF-026 | IN-001 | L |
| IN-003 | Security | API 인증 미들웨어 (전 API 인증 강제) | §3.1.4, REQ-NF-018 | IN-001 | M |
| IN-004 | Observability | SLO 계측 지점 구성 — 응답 시간 · 5xx 오류율 | §3.1, REQ-NF-001 · REQ-NF-008, §6.3 | IN-001 | M |
| IN-005 | Scalability | 서비스별 수평 확장 구성 (피크 3,000 RPS) | REQ-NF-005, §4.2 | IN-001 | H |
| IN-006 | Reliability | 이중화 및 장애 복구 절차 (RTO 30분) | REQ-NF-012, §4.5.3 | IN-005 | H |
| IN-007 | Reliability | 백업 구성 및 RPO 5분 확보 | REQ-NF-027, §8.6.5 | IN-006 | M |
| IN-008 | Observability | 헬스체크 5분 간격 및 월 가용성 집계 (99.5%) | REQ-NF-007, §6.3 | IN-004 | M |
| IN-009 | Observability | APM 트레이스 및 알림 채널 연동 (Slack · PagerDuty) | §6.3 | IN-004 | M |
| IN-010 | Security | 결제 · 정산 데이터 저장 암호화 (AES-256) | REQ-NF-017, §8.6.4 | IN-001 | M |
| IN-011 | Security | 감사 로그 파이프라인 — 내부 조회 전량 기록 | REQ-NF-025, §4.4 | IN-001 | M |
| IN-012 | Performance | 캐시 계층 구성 — TTL 6시간, 히트율 70% 이상 | REQ-NF-020, §4.5.4, §8.6.2 | IN-001 | M |
| IN-013 | Data | `tracking_events` 시간 기준 파티셔닝 및 보존 구성 | §8.4, §8.6.2, §8.6.5 | IN-001 | M |
| IN-014 | Verification | 부하 테스트 환경 구축 (REQ-NF-001~005 검증용) | §4.2 검증 방식 열, §6.2 | IN-005 | M |

---

## 3. 개발 태스크 — 백엔드 / 프론트엔드

### 3.1 Epic: Index Service — 색인 및 카탈로그

| Task ID | Epic (도메인) | Feature (기능명) | 관련 SRS 섹션 | 선행 태스크 (Dependencies) | 복잡도 (H/M/L) |
|---|---|---|---|---|---|
| FR-001 | Index Service | [BE] 공통 색인 스키마 확정 — place · dish · attribute · price_profile · verification | §8.2, §8.4, REQ-FUNC-001, ADR-001 | None | H |
| FR-002 | Index Service | [BE] `canonical_key` 메뉴명 정규화 규칙 및 사전 구축 | §1.3, §8.2, REQ-FUNC-001 | FR-001 | H |
| FR-003 | Index Service | [BE] 색인 파이프라인 구축 (적재 · 갱신 · 재색인) | REQ-FUNC-001, §4.3.3 | FR-001, FR-002 | H |
| FR-004 | Index Service | [BE] 상권 1곳 300건 초기 적재 (필수 필드 5개) | §3.1.6, §1.5.2, R2 | FR-003 | M |
| FR-005 | Index Service | [BE] `PriceProfile` 저장 · 조회 — 하한/평균/상한 및 조건 태그 | §8.2, §8.6.3, REQ-FUNC-002 | FR-001 | M |
| FR-006 | Index Service | [BE] `Attribute.scope` 구현 및 성분 · 접근성 필드 사전 확보 | REQ-NF-024, §8.2, §9.2 | FR-001 | M |
| FR-007 | Index Service | [BE] `Verification` 독립 엔터티 및 상태 전이 구현 | §8.2 상태 전이, ADR-002, §8.6.3 | FR-001 | H |
| FR-008 | Index Service | [BE] `GET /v1/places/{id}/dishes` 구현 | §8.1, §8.1.1, REQ-NF-002 | FR-002, FR-005 | M |
| FR-009 | Index Service | [BE] 메뉴 · 속성 조회 캐시 적용 및 히트/미스 계측 | REQ-NF-002 · REQ-NF-020, §8.6.2 | FR-008, IN-012 | M |
| FR-010 | Index Service | [BE] 조건 카테고리 사전 관리 (상권별 운영 조건 어휘) | §3.1.6, REQ-FUNC-004 | FR-006 | M |

### 3.2 Epic: Search Service — 조건 파싱 및 후보 선별

| Task ID | Epic (도메인) | Feature (기능명) | 관련 SRS 섹션 | 선행 태스크 (Dependencies) | 복잡도 (H/M/L) |
|---|---|---|---|---|---|
| FR-011 | Search Service | [BE] 자연어 조건 파서 연동 (외부 추론 서비스) | §3.1.7, REQ-FUNC-009, REQ-NF-019 | IN-001 | H |
| FR-012 | Search Service | [BE] 파싱 실패 시 구조화 필터 폴백 전환 로직 | REQ-FUNC-009, REQ-NF-009, §4.5.3 | FR-011 | M |
| FR-013 | Search Service | [BE] 필수 입력 없는 질의 수용 (필수 필드 0개) | REQ-FUNC-008, §8.1.1 | FR-011 | L |
| FR-014 | Search Service | [BE] 예산 상한 필터 및 '예산 초과 N곳' 요약 | REQ-FUNC-003, §4.5.4 | FR-005 | M |
| FR-015 | Search Service | [BE] 운영 조건 카테고리 필터 (무한리필 · 룸 · 주차 · 단체) | REQ-FUNC-004 | FR-010 | M |
| FR-016 | Search Service | [BE] 메뉴명 단위 매장 반환 (반경 1km) | REQ-FUNC-006, §4.5.4 | FR-002, FR-008 | H |
| FR-017 | Search Service | [BE] 유사 메뉴 대체 반환 및 대체 사실 명시 | REQ-FUNC-007, REQ-NF-010 | FR-016 | M |
| FR-018 | Search Service | [BE] 적합도 정렬 및 Top-3 고정 구성 (페이지네이션 없음) | REQ-FUNC-014, §4.5.2, §8.3 규칙 2 | FR-014, FR-015, FR-017, FR-021 | H |
| FR-019 | Search Service | [BE] `POST /v1/query` 엔드포인트 구현 | §8.1, §8.1.1, REQ-NF-001 | FR-018 | M |
| FR-020 | Search Service | [BE] 조건 파싱 실패율 5분 윈도 집계 및 경보 연동 | REQ-NF-009, §6.3 | FR-012, IN-009 | M |

### 3.3 Epic: Evidence Service — 근거 · 확인 상태 · 공유

| Task ID | Epic (도메인) | Feature (기능명) | 관련 SRS 섹션 | 선행 태스크 (Dependencies) | 복잡도 (H/M/L) |
|---|---|---|---|---|---|
| FR-021 | Evidence Service | [BE] 근거 4항목 검증기 — 정렬 이전 단계 배치 | REQ-FUNC-010, §4.5.1, §4.5.2, §8.3 규칙 1 | FR-007 | H |
| FR-022 | Evidence Service | [BE] 선정 이유 문장 생성 (외부 추론 서비스) | REQ-FUNC-010, §3.1.7, §4.5.2 | FR-021 | M |
| FR-023 | Evidence Service | [BE] 90일 신선도 경고 표기 및 `STALE` 전이 | REQ-FUNC-011, REQ-NF-011, §8.2 | FR-007 | M |
| FR-024 | Evidence Service | [BE] 판정형 문구 차단 검증 (판정 금지 원칙) | REQ-FUNC-011, §8.3 규칙 3 | FR-022 | M |
| FR-025 | Evidence Service | [BE] `POST /v1/share-cards` 공유 카드 생성 — 근거 누락 시 400 | REQ-FUNC-012, REQ-NF-003, §4.5.1 | FR-021, FR-022 | H |
| FR-026 | Evidence Service | [BE] 조건 불일치 신고 접수 및 `RECHECK_REQUIRED` 전환 (≤60s) | REQ-FUNC-013, §8.3 규칙 12 | FR-007 | M |
| FR-027 | Evidence Service | [BE] 재확인 큐 등록 및 처리 (이력 보존) | REQ-FUNC-013, §8.6.5 | FR-026 | M |

### 3.4 Epic: Reservation & Payment Service — 예약 · 결제 · 정산

| Task ID | Epic (도메인) | Feature (기능명) | 관련 SRS 섹션 | 선행 태스크 (Dependencies) | 복잡도 (H/M/L) |
|---|---|---|---|---|---|
| FR-028 | Reservation Service | [BE] `Reservation` 엔터티 및 상태 전이 구현 | §8.2, §8.6.3, REQ-FUNC-015 | FR-001 | M |
| FR-029 | Reservation Service | [BE] 제안 조건 자동 승계 (인원 · 메뉴 구성 · 시간) ‡ | REQ-FUNC-015, §4.5.5, §8.6.3 | FR-028 | M |
| FR-030 | Payment Service | [BE] 주문량 기반 결제 금액 산출 | REQ-FUNC-016, §4.5.5 | FR-029 | M |
| FR-031 | Payment Service | [BE] PG 결제 승인 연동 — 카드 정보 비보관, 거래 토큰만 취급 | REQ-FUNC-016, REQ-NF-016, §3.1.1, §8.1 | FR-030, IN-002, IN-010 | H |
| FR-032 | Payment Service | [BE] 매장 확정 통보 (≤30s) | REQ-FUNC-016 | FR-031 | M |
| FR-033 | Payment Service | [BE] 취소 접수 및 전액 환불 (2시간 전 시한, ≤24h 처리) | REQ-FUNC-017, §4.5.4 | FR-031 | M |
| FR-034 | Reservation Service | [BE] 방문 확인 처리 (`VISITED` 전이) | REQ-FUNC-018, §8.2 | FR-028 | M |
| FR-035 | Reservation Service | [BE] 노쇼 판정 및 매장 정산 (`NO_SHOW` → `SETTLED`) | REQ-FUNC-018, §8.2, §8.6.3 | FR-031, FR-034 | H |
| FR-036 | Payment Service | [BE] 결제 API 오류율 분리 계측 (≤0.1%) | REQ-NF-008, §6.3 | FR-031, IN-004 | L |

‡ **`FR-029`의 선행에 `FR-044`(제안 등록)를 넣지 않았다.** SRS §8.6.3은 `Reservation.proposalId`가 `Proposal`을 참조하도록
규정하지만, §4.3.1과 ADR-005는 **예약·결제(F9)를 제안(F7)보다 먼저** 배치한다 — "선결제 없이 제안을 열면 첫 노쇼에서 가맹점이 이탈"하기 때문이다.
따라서 `FR-029`는 `Proposal` 스키마 계약만 확정된 상태에서 착수하며, 실제 참조 연결은 `FR-044` 완료 시점에 결선된다.
**이 계약을 `FR-001` 스키마 확정 시점에 함께 고정하지 않으면 Phase 2에서 예약 도메인을 다시 손대게 된다.**

### 3.5 Epic: Merchant Console Service — 공급자 콘솔

| Task ID | Epic (도메인) | Feature (기능명) | 관련 SRS 섹션 | 선행 태스크 (Dependencies) | 복잡도 (H/M/L) |
|---|---|---|---|---|---|
| FR-037 | Merchant Console | [BE] 매장 프로필 등록 — 분위기 · 강점 · 서비스 · 수용 조건 | REQ-FUNC-019, §3.1.2 | FR-006 | M |
| FR-038 | Merchant Console | [BE] 매장 프로필 갱신 — 기존 항목 1회 클릭 로드 | REQ-FUNC-027 | FR-037 | L |
| FR-039 | Merchant Console | [BE] 수용 조건 매칭 및 조건 밖 소환 배제 | REQ-FUNC-020, §4.5.1 | FR-037 | M |
| FR-040 | Merchant Console | [BE] 근거 없는 문구 저장 차단 — `Attribute` 참조 검증 | REQ-FUNC-021, §8.3 규칙 7, §8.6.3 | FR-006, FR-037 | M |
| FR-041 | Merchant Console | [BE] 콘솔 접근 2FA 적용 및 접근 이상 탐지 | REQ-NF-018, §4.4, §6.3 | IN-003, IN-011 | M |

### 3.6 Epic: Agent Room Service — 소환 · 대화방 · 제안

| Task ID | Epic (도메인) | Feature (기능명) | 관련 SRS 섹션 | 선행 태스크 (Dependencies) | 복잡도 (H/M/L) |
|---|---|---|---|---|---|
| FR-042 | Agent Room | [BE] `POST /v1/agent-rooms` — 소환 3~5곳, 0곳 시 즉시 미개시 | REQ-FUNC-022, §8.1.1, §8.6.3 | FR-039 | H |
| FR-043 | Agent Room | [BE] 대화방 수명주기 — `expiresAt` = 생성 + 180초, 서버 시각 기준 판정 | REQ-FUNC-023, §8.3 규칙 13, §3.1.4 | FR-042 | H |
| FR-044 | Agent Room | [BE] `POST /v1/proposals` — 제안 등록 및 근거 검증, 가격 필드 부재 | REQ-FUNC-023, §8.1.1, §4.5.1 | FR-040, FR-043 | M |
| FR-045 | Agent Room | [BE] 제안 도착 · 카운트다운 단방향 갱신 채널 | §3.1.4, REQ-NF-004 | FR-043 | M |
| FR-046 | Agent Room | [BE] 적합도 우선 제안 정렬 — 가격은 정렬 키 아님 | REQ-FUNC-024, §4.5.5, §8.3 규칙 6 | FR-021, FR-044 | M |
| FR-047 | Agent Room | [BE] 유효 제안 0건 시 '제안 없는 Top-3' 회귀 | REQ-FUNC-025, §4.5.3, §8.3 규칙 5 | FR-018, FR-043 | M |
| FR-048 | Agent Room | [BE] 제안 불이행 기록 및 소환 가중치 하향 | REQ-FUNC-026, §4.5.5 | FR-044 | M |

### 3.7 Epic: Tracking Service — 계측 · KPI

| Task ID | Epic (도메인) | Feature (기능명) | 관련 SRS 섹션 | 선행 태스크 (Dependencies) | 복잡도 (H/M/L) |
|---|---|---|---|---|---|
| FR-049 | Tracking Service | [BE] 이벤트 스키마 정의 22종 및 공통 속성 4개 | §6.1.1 | FR-001 | H |
| FR-050 | Tracking Service | [BE] 이벤트 수집 파이프라인 구축 | §6.1.1, §6.1.4 | FR-049, IN-013 | H |
| FR-051 | Tracking Service | [BE] 세션 정의 · 중복 제거 · 제외 트래픽 규칙 구현 | §6.1.3 | FR-050 | M |
| FR-052 | Tracking Service | [BE] 결측 처리 및 누락률 동반 보고 (5% 초과 시 미공표) | §6.1.3, §4.5.3 | FR-050 | M |
| FR-053 | Tracking Service | [BE] `schema_version` 관리 및 시계열 분리 | §6.1.3 | FR-049 | M |
| FR-054 | Tracking Service | [BE] KPI 산출식 12건 배치 집계 (북극성 WEBD 및 보조 1~11) | §6.1.2, §5.2, REQ-NF-030 | FR-026, FR-051 | H |
| FR-055 | Tracking Service | [BE] 결제액 피드백 반영 — 편차 기록 및 다음 표기 반영 | REQ-FUNC-005, §4.5.5 | FR-005, FR-050 | M |
| FR-056 | Tracking Service | [BE] 세션당 추론 비용 집계 (12원 상한) | REQ-NF-019, §6.3 | FR-050 | M |
| FR-057 | Tracking Service | [BE] 주간 리포트 · KPI 대시보드 공급 | §8.5.4, §6.1.2 | FR-054 | M |
| FR-080 | Tracking Service | [BE] 파생 지표 계측 — 탐색 노동 및 결정 시간 | §6.1.2 파생 지표, REQ-NF-028 · REQ-NF-029 | FR-051 | M |
| FR-081 | Tracking Service | [BE] 단위 경제 산출 — 성사 건당 수수료 대 처리 비용 배수 | REQ-NF-021, §8.5.4 | FR-054, FR-056 | M |
| FR-082 | Merchant Console | [BE] 심사 FTE 비율 월간 집계 및 온보딩 속도 조절 경보 | REQ-NF-022, R7, §6.3 | FR-037, FR-054 | M |

### 3.8 Epic: Privacy & Compliance — 개인정보 · 규제 준수

| Task ID | Epic (도메인) | Feature (기능명) | 관련 SRS 섹션 | 선행 태스크 (Dependencies) | 복잡도 (H/M/L) |
|---|---|---|---|---|---|
| FR-058 | Privacy | [BE] 참석자 출발지 정보 30일 내 파기 배치 | REQ-NF-013, §4.4, §8.6.5 | FR-050 | M |
| FR-059 | Privacy | [BE] 출발지 정보 목적 제한 접근 통제 및 로그 점검 | REQ-NF-031, §4.4 | IN-011 | M |
| FR-060 | Privacy | [FE] 개인 제약 정보 단말 저장 구현 | REQ-NF-014, §8.6.4 | FR-064 | M |
| FR-061 | Privacy | [FE] 개인 제약 정보 서버 전송 옵트인 및 미동의 전송 차단 | REQ-NF-032, §4.4 | FR-060, UX-012 | M |
| FR-062 | Privacy | [BE] 참석자 취향 · 비고 필드 미수집 — 스키마 필드 부재 검증 | REQ-NF-015, §8.6.4 | FR-001 | L |
| FR-063 | Data | [BE] 데이터 보존 정책 배치 — 이벤트 · 확인 상태 · 예약 · 결제 | §8.6.5 | IN-013 | M |

### 3.9 Epic: Client — 모바일 웹 및 유통 채널

| Task ID | Epic (도메인) | Feature (기능명) | 관련 SRS 섹션 | 선행 태스크 (Dependencies) | 복잡도 (H/M/L) |
|---|---|---|---|---|---|
| FR-064 | Client | [FE] 모바일 웹 앱 셸 · 라우팅 · API 클라이언트 | §3.1, §1.2 | IN-001 | M |
| FR-065 | Client | [FE] 네이버 지도 내 탭 진입 연동 및 세션 개시 | §3.1.1, ADR-006, R6 | FR-064 | M |
| FR-066 | Search Entry | [FE] 조건 입력 화면 구현 | REQ-FUNC-008, §3.1.2 | FR-064, UX-002 | M |
| FR-067 | Search Entry | [FE] 폴백 필터 UI 구현 및 전환 고지 | REQ-FUNC-009, §3.1.2 | FR-066, UX-003 | M |
| FR-068 | Candidate | [FE] Top-3 카드 렌더 — 인당가 범위 · 근거 4항목 | REQ-FUNC-002 · REQ-FUNC-010 · REQ-FUNC-014, §3.1.2 | FR-019, UX-004 | H |
| FR-069 | Evidence | [FE] 신선도 경고 표기 구현 | REQ-FUNC-011, §3.1.2 | FR-068, UX-005 | L |
| FR-070 | Evidence | [FE] 공유 카드 생성 · 외부 전송 구현 | REQ-FUNC-012 | FR-025, UX-006 | M |
| FR-071 | Evidence | [FE] 조건 불일치 신고 화면 구현 | REQ-FUNC-013 | FR-026, UX-007 | L |
| FR-072 | Reservation | [FE] 예약 · 결제 화면 구현 — 재입력 필드 0개 | REQ-FUNC-015 · REQ-FUNC-016 | FR-031, UX-008 | H |
| FR-073 | Reservation | [FE] 취소 · 환불 화면 구현 | REQ-FUNC-017 | FR-033, UX-008 | M |
| FR-074 | Agent Room | [FE] 대화방 화면 및 카운트다운 구현 | REQ-FUNC-022 · REQ-FUNC-023, §3.1.2 | FR-045, UX-009 | H |
| FR-075 | Agent Room | [FE] 제안 비교 · 적합도 정렬 화면 구현 | REQ-FUNC-024, §3.1.2 | FR-046, UX-010 | M |
| FR-076 | Merchant Console | [FE] 매장 콘솔 화면 구현 — 설정 3화면 · 필수 5항목 | REQ-FUNC-019 · REQ-FUNC-027, §3.1.2 | FR-037, UX-011 | H |
| FR-077 | Performance | [FE] 초기 렌더 LCP 2.5s 최적화 (번들 분할 · 이미지 지연 로드) | REQ-NF-006, §6.3 | FR-068, UX-013 | M |
| FR-078 | Observability | [FE] RUM 계측 연동 (4G 세그먼트) | REQ-NF-006, §6.3 | FR-050, FR-077 | M |
| FR-079 | Tracking | [FE] 클라이언트 이벤트 계측 연동 (22종 발생 지점) | §6.1.1 | FR-050, FR-066 | M |

---

## 4. 착수 순서 — 의존성으로 도출한 임계 경로

SRS §4.3.1의 필수 선행 의존성을 태스크 수준으로 내린 결과다.

```
IN-001 ─┬─ FR-001 ──┬─ FR-002 ── FR-003 ── FR-004
        │           ├─ FR-005 ─┐
        │           ├─ FR-006 ─┼─ FR-014/015 ─┐
        │           └─ FR-007 ─┴─ FR-021 ─────┼─ FR-018 ── FR-019 ── FR-068
        └─ FR-011 ── FR-012 ─────────────────┘
                                              (Phase 1 Must 완료선)
FR-028 ── FR-030 ── FR-031 ── FR-035          (Phase 1 말 · 선결제)
FR-037 ── FR-039/040 ── FR-042 ── FR-043 ── FR-044 ── FR-046   (Phase 2 · 조건부)
```

| 순위 | 태스크 | 이유 |
| --- | --- | --- |
| 1 | `FR-001` 색인 스키마 확정 | SRS §4.3.2 — **후행 12건이 대기**. 사후 변경 비용이 전면 재색인 (ADR-001, REQ-NF-024) |
| 2 | `IN-001` API Gateway | 전 서비스의 계측·인증 지점. REQ-NF-001 · REQ-NF-005 · REQ-NF-008의 측정 기준점 |
| 3 | `FR-007` Verification 엔터티 | ADR-002 — 이것이 없으면 `FR-021` 근거 4항목이 성립하지 않고, 되돌리기 비용이 근거 표기 전면 재설계 |
| 4 | `FR-049`/`FR-050` 이벤트 파이프라인 | SRS §6.1.4 — Phase 0 산출물. **기준선 실측 전환의 전제**이며 미가동 시 모든 KPI 판정 불가 |
| 5 | `FR-031` PG 연동 | 외부 계약 선행. SRS §4.3.2 — 후행 8건 대기, ADR-005에 따라 F7·F8보다 선행 |

---

## 5. Phase 배분 (SRS §6.2 릴리스 게이트 대응)

| Phase | 기간 · 규모 | 포함 태스크 | 통과 게이트 |
| --- | --- | --- | --- |
| **Phase 0** 내부 드라이런 | 2주 · 상권 1곳 · 가맹 20곳 | `IN-001`~`IN-004`, `IN-013`, `FR-001`~`FR-004`, `FR-049`~`FR-052`, `UX-001` | 파싱 실패율 ≤ 3% · Top-3 p95 ≤ 1.5s |
| **Phase 1** 클로즈드 베타 | 8주 · 상권 3곳 · 가맹 150곳 · 사용자 500 | `FR-005`~`FR-027`, `FR-053`~`FR-057`, `FR-064`~`FR-071`, `FR-077`~`FR-080`, `FR-082`, `IN-005`~`IN-012`, `IN-014`, `UX-002`~`UX-007`, `UX-013`~`UX-015` | WEBD ≥ 목표 60% · 불일치 신고 ≤ 15% · 가맹 LOI ≥ 30곳 |
| **Phase 1 말** 실행 | 후반 | `FR-028`~`FR-036`, `FR-058`~`FR-063`, `FR-072`~`FR-073`, `FR-081`, `UX-008`, `UX-012` | 선택 제안 노쇼율 계측 개시 |
| **Phase 2** 오픈 베타 *(조건부)* | 8주 · 상권 5곳 | `FR-037`~`FR-048`, `FR-074`~`FR-076`, `UX-009`~`UX-011` | 제안 도착률 ≥ 70% · 선택 제안 노쇼 ≤ 8% |

> **Phase 2는 무조건 착수하지 않는다.** SRS §6.2는 세 조건(① WEBD 목표 60% 이상 ② 가맹 LOI 30곳 이상
> ③ 매장의 대화방 제안 참여 의향 **실측 확인**)이 **모두** 충족될 때만 착수하도록 규정한다.
> 미충족 시 `FR-037`~`FR-048` · `FR-074`~`FR-076` · `UX-009`~`UX-011` **총 24개 태스크가 v0.2로 이월**된다.

---

## 6. 복잡도 분포

| 복잡도 | UX | IN | FR | 합계 | 비중 |
| --- | --- | --- | --- | --- | --- |
| H | 4 | 3 | 20 | **27** | 24% |
| M | 10 | 10 | 56 | **76** | 69% |
| L | 1 | 1 | 6 | **8** | 7% |
| **합계** | **15** | **14** | **82** | **111** | 100% |

H 등급 27건은 네 종류로 갈린다.

| 성격 | 태스크 | 위험의 정체 |
| --- | --- | --- |
| 되돌리기 비용 최대 | `FR-001` 색인 스키마 · `FR-007` Verification | ADR-001 · ADR-002 — 사후 변경 시 전면 재색인 / 근거 표기 전면 재설계 |
| 외부 연동 | `FR-011` 추론 서비스 · `FR-031` PG · `IN-001` Gateway | 일정이 자사 통제 밖. 계약·쿼터·장애가 변수 |
| 동시성 · 수명주기 | `FR-043` 180초 만료 · `FR-035` 노쇼 정산 · `IN-005`/`IN-006` 확장·이중화 | 정상 동작의 결과로 사고가 나는 부류. 단위 테스트로 안 잡힌다 |
| 정확도 튜닝 | `FR-002` 정규화 · `FR-016` 메뉴 질의 · `FR-021` 근거 검증 · `FR-003` 색인 파이프라인 | 목표 수치(92% · 90%)를 만족할 때까지 반복. **공수 예측이 가장 어려운 부류** |

나머지 H — `FR-018` Top-3 구성 · `FR-025` 공유 카드 · `FR-042` 소환 · `FR-049`/`FR-050` 이벤트 파이프라인 ·
`FR-054` KPI 집계 · `FR-064`대 FE 화면 4건(`FR-068` · `FR-072` · `FR-074` · `FR-076`) ·
`UX-004` · `UX-008` · `UX-009` · `UX-011`.

---

## 7. 이 리스트로 판정할 수 없는 것 — 명시적 한계

| 항목 | 이유 | 해소 시점 |
| --- | --- | --- |
| 태스크별 공수(man-day) | SRS §4.3.3은 요구사항 군 단위 **S/M/L 규모와 스프린트 수**만 제공한다. 태스크 단위 공수는 문서에 없다 | 개발팀 리드 산정 |
| 구현 클래스 | SRS §5.1의 구현 클래스 열이 **59행 전부 `미정`** | Sprint 0 종료 (SRS §5.1 명시) |
| 테스트 케이스 상세 | SRS는 `TC-FUNC-001`~`TC-NF-032`의 **ID만** 부여했고 내용은 없다 | 상세 설계 단계 |
| 기준선 기반 인수 판정 | KPI 기준선 중 `산정` 9건 · `0%(신규)` 6건이 미실측 | Phase 0 종료 (SRS §6.1.4) |

---

*작성: Technical Project Manager / System Architect · 근거 문서: SRS-AIPLACE-MVP-001 v1.9*
