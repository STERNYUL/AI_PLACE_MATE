# 개발 태스크 리스트 — AD-Core-Platform MVP

**출처 문서:** SRS-ADTECH-MVP-001 v1.0 (`reference/SRS-example-AD-Core-Platform.md`)
**표준:** ISO/IEC/IEEE 29148:2018
**작성 관점:** Technical Project Manager / System Architect
**개정:** v1.1 (2025-08-25) — 태스크 추출 방법론 4단계 정합화
**총 태스크:** 99건 — SPEC 11 · MOCK 4 · FR 52 · NF 12 · QA 14 · UX 6

---

## 개정 이력

| 판 | 변경 | 근거 |
| --- | --- | --- |
| v1.0 | 초판 82건 · 커버리지 검증(부록 B) · 의존 관계도(부록 A) | SRS 전수 스캔 |
| **v1.1** | **P0 · M1~M9 적용** — `Type`·`Blocks` 열 신설 / `SPEC-000~010` 11건 신설 / `MOCK-001~004` 4건 신설 / `NF-012` 신설 / `FR-019` 분할 / 부록 E(AC 준비도) 신설 | `docs/task-extraction-assessment.md` |

### v1.1에서 정정된 수치

평가 보고서는 수정 후 규모를 **101건**으로 추정했으나, 실제 재분류 결과는 **99건**이다.
보고서가 Query 12 + Command 27로 잡았는데, `FR` 52건에서 `[DB]` 9 · `[Integration]` 6을 제외한
로직 태스크는 37건이며 Query 12 · Command 23 · Util 1 · Query+Command 1로 분해된다. 2건 초과 추정이었다.

---

## 0. 도출 원칙

| 원칙 | 적용 |
| --- | --- |
| **SRS 명시 범위만** | 원문에 문장·표·enum·스키마·규칙으로 존재하는 항목만 태스크화. §7 향후 개선 사항은 제외 |
| **관점 분리** | `FR/NF/QA` = 백엔드·프론트엔드·인프라 개발 / `UX` = UI·UX 디자인. ID 접두어로 분리 |
| **최소 실행 단위** | 단일 담당자가 착수·완료·검증할 수 있는 Feature 단위로 분해. 원문의 복합 조항(REQ-FUNC-003)은 분리 |
| **추적성 유지** | 모든 태스크에 SRS 섹션 및 §5 추적성 매트릭스의 구현 클래스명을 연결 |
| **커버리지 증명** | 정방향(요구사항→태스크)·역방향(태스크→근거)·검증(요구사항→TC) 3축으로 누락 검사. 부록 B |
| **계약 우선 (v1.1)** | 계약(`SPEC`)과 구현(`FR`)을 분리한다. 계약이 얼지 않으면 4개 서비스 병렬 개발은 착시다 |
| **CQRS 절단 (v1.1)** | 로직 태스크는 읽기(`Query`)와 쓰기(`Command`)로 나눠 표기한다. 상태 변경 지점을 드러내기 위함 |

### ID 체계

**기존 ID는 재번호하지 않는다.** 부록 A의 도식 4종, 부록 B의 커버리지 표 5종, `SRS-READER.html`의 조항 참조가
모두 기존 번호에 걸려 있다. 분류 축(`Type` 열)과 식별 축(ID)을 분리한다.

| 접두어 | 관점 | 범위 |
| --- | --- | --- |
| `SPEC-` | **계약·규약 명세 (v1.1 신설)** | SPEC-000 ~ SPEC-010 |
| `MOCK-` | **모킹 서버 (v1.1 신설)** | MOCK-001 ~ MOCK-004 |
| `FR-` | 기능 개발 (백엔드/프론트엔드) | FR-001 ~ FR-051 (FR-019는 a·b로 분할) |
| `NF-` | 비기능 · 인프라 · 보안 | NF-001 ~ NF-012 |
| `QA-` | 검증 · 테스트 케이스 구현 | QA-001 ~ QA-014 |
| `UX-` | UI/UX 디자인 | UX-001 ~ UX-006 |

### Type 분류 (v1.1 신설)

| Type | 뜻 | 건수 |
| --- | --- | --- |
| `[API Spec]` | 요청·응답 DTO 및 에러 코드 계약 | 11 |
| `[Mock]` | 계약 기반 가짜 응답 서버 | 4 |
| `[DB]` | 데이터 모델 · 스키마 · 마이그레이션 | 9 |
| `[Feature/Query]` | 상태를 바꾸지 않는 읽기 | 12 |
| `[Feature/Command]` | 상태를 바꾸는 쓰기 | 23 |
| `[Feature/Q+C]` | 읽기 경로 안에 쓰기가 포함된 복합 — **주의 대상** | 1 |
| `[Util]` | 순수 변환 · 유틸리티 | 1 |
| `[Integration]` | 클라이언트 · 외부 시스템 연동 | 6 |
| `[Infra]` | 인프라 · 성능 · 가용성 · 운영 | 8 |
| `[Sec]` | 인증 · 인가 · 감사 · 마스킹 | 4 |
| `[Test]` | 테스트 케이스 구현 | 14 |
| `[Design]` | UI/UX 디자인 | 6 |

---

## EPIC S · 계약 및 규약 명세 (v1.1 신설)

> **이 Epic이 크리티컬 패스의 첫 마디다.** §6.1은 메서드·경로·한 줄 설명만 제공해 계약으로 쓸 수 없다.
> 산출물은 `docs/api_v1.yaml`이며, 그것이 나오면 `MOCK` 4건과 4개 팀 병렬 개발이 가능해진다.

| Task ID | Type | Epic (도메인) | Feature (기능명) | 관련 SRS 섹션 | 선행 (Depends on) | 후행 (Blocks) | 복잡도 |
|---|---|---|---|---|---|---|---|
| SPEC-000 | `[API Spec]` | Contract | 공통 규약 확정 — 인증 헤더 · 오류 응답 형식 · 요청 추적 ID · 소프트 삭제 기본 필터 | §6.1 · REQ-NF-004 · REQ-FUNC-007 | None | SPEC-001~010 | M |
| SPEC-001 | `[API Spec]` | Contract | `GET /audience/profiles/{userId}` 요청·응답 DTO 및 에러 코드 | §6.1 · REQ-FUNC-001·002 | SPEC-000 | FR-016, MOCK-001 | M |
| SPEC-002 | `[API Spec]` | Contract | `POST .../segments` 요청·응답 DTO 및 에러 코드 | §6.1 · REQ-FUNC-001 | SPEC-000 | FR-017, MOCK-001 | M |
| SPEC-003 | `[API Spec]` | Contract | `POST .../behavioral-signals` 요청·응답 DTO 및 에러 코드 | §6.1 · REQ-FUNC-002 | SPEC-000 | FR-018, MOCK-001 | M |
| SPEC-004 | `[API Spec]` | Contract | `POST /campaigns` 요청·응답 DTO 및 에러 코드 | §6.1 · REQ-FUNC-003 | SPEC-000 | FR-026, MOCK-002 | M |
| SPEC-005 | `[API Spec]` | Contract | `PUT /campaigns/{id}/targeting` 요청·응답 DTO 및 **조건 결합 규칙** | §6.1 · REQ-FUNC-003 | SPEC-000 | FR-027, MOCK-002, FR-029, FR-030 | H |
| SPEC-006 | `[API Spec]` | Contract | `GET /campaigns/{id}/performance` 요청·응답 DTO 및 에러 코드 | §6.1 · REQ-FUNC-008 | SPEC-000 | FR-028, MOCK-002 | M |
| SPEC-007 | `[API Spec]` | Contract | **`POST /ads/request` 요청·응답 DTO 및 에러 코드 (최우선)** | §6.1 · REQ-FUNC-004·005·006 | SPEC-000 | FR-037, MOCK-003 | H |
| SPEC-008 | `[API Spec]` | Contract | `POST /ads/events/click` 요청·응답 DTO 및 **멱등키 규약** | §6.1 · REQ-FUNC-008 | SPEC-000 | FR-038, MOCK-003 | M |
| SPEC-009 | `[API Spec]` | Contract | `POST /tracking/events` 일괄 수집 계약 · 배치 상한 · 부분 실패 정책 | §6.1 · REQ-FUNC-008 · REQ-NF-002 | SPEC-000, SPEC-008 | FR-040, MOCK-004 | H |
| SPEC-010 | `[API Spec]` | Contract | `GET /tracking/campaigns/{id}/metrics` 요청·응답 DTO 및 에러 코드 | §6.1 · REQ-FUNC-008 · §6.3 규칙 8 | SPEC-000, SPEC-006 | FR-045, MOCK-004 | M |

> **SPEC-008 → SPEC-009 의존**은 멱등키 규약을 두 엔드포인트가 **동일하게** 써야 하기 때문이다. 따로 정하면 중복 집계 규칙이 갈린다.
> **SPEC-006 → SPEC-010 의존**은 성과 응답 스키마를 통일해야 하기 때문이다. 두 경로가 다른 숫자를 반환하면 광고주 화면과 대시보드가 어긋난다.

---

## EPIC M · 모킹 서버 (v1.1 신설)

> **이 Epic이 크리티컬 패스를 단축한다.** Ad Serving Engine은 Audience·Campaign이 둘 다 완성돼야
> 통합 테스트를 시작할 수 있다(부록 A-2). 모킹이 있으면 계약만으로 착수해 직렬 구간이 병렬로 바뀐다.
> **SRS에 직접 근거가 없는 방법론 파생 태스크다** — 부록 B-3에 그 사실을 표기했다.

| Task ID | Type | Epic (도메인) | Feature (기능명) | 관련 SRS 섹션 | 선행 (Depends on) | 후행 (Blocks) | 복잡도 |
|---|---|---|---|---|---|---|---|
| MOCK-001 | `[Mock]` | Mock | Audience Service 모킹 — 프로파일 조회·세그먼트·행동 신호 3종 | 방법론 파생 (§6.1 계약 기반) | SPEC-001, SPEC-002, SPEC-003 | FR-029, FR-030 | M |
| MOCK-002 | `[Mock]` | Mock | Campaign Service 모킹 — 캠페인·타게팅·성과 3종 | 방법론 파생 (§6.1 계약 기반) | SPEC-004, SPEC-005, SPEC-006 | FR-029, FR-030, FR-031, FR-034 | M |
| MOCK-003 | `[Mock]` | Mock | Ad Serving 모킹 — 광고 요청·클릭 2종 (클라이언트·UI 개발용) | 방법론 파생 (§6.1 계약 기반) | SPEC-007, SPEC-008 | FR-046, FR-047, FR-048, UX-002, UX-003 | M |
| MOCK-004 | `[Mock]` | Mock | Tracking 모킹 — 이벤트 일괄 수집·지표 조회 2종 | 방법론 파생 (§6.1 계약 기반) | SPEC-009, SPEC-010 | FR-028, FR-051, UX-006 | M |

---

## EPIC A · Foundation (공통 기반)

> 4개 서비스 전체의 선행 조건. §6.2 데이터 모델과 §6.4 스키마가 확정되지 않으면 어떤 서비스도 착수할 수 없다.
> **v1.1 — M8 적용:** FR-006~009의 산출물에 **마이그레이션 스크립트**를 명시했다.

| Task ID | Type | Epic (도메인) | Feature (기능명) | 관련 SRS 섹션 | 선행 (Depends on) | 후행 (Blocks) | 복잡도 |
|---|---|---|---|---|---|---|---|
| FR-001 | `[DB]` | Foundation | 인구통계 Enum 정의 (AgeSegment / IncomeSegment / GeographySegment) | 6.2 · REQ-FUNC-001 | None | FR-005, FR-006, FR-012, FR-021 | L |
| FR-002 | `[DB]` | Foundation | 행동 신호 Enum 정의 (PurchaseIntent / EngagementBehavior / DevicePreference) | 6.2 · REQ-FUNC-002 | None | FR-005, FR-006, FR-015, FR-021 | L |
| FR-003 | `[DB]` | Foundation | 캠페인 Enum 정의 (BiddingStrategy / CampaignStatus) | 6.2 · REQ-FUNC-003 | None | FR-005, FR-007, FR-020, FR-024 | L |
| FR-004 | `[DB]` | Foundation | 노출·이벤트 Enum 정의 (AdPosition / EventType / FallbackStage) | 6.2 · REQ-FUNC-004·006·008 | None | FR-005, FR-008, FR-031, FR-033, FR-036, FR-038 | L |
| FR-005 | `[DB]` | Foundation | Enum 확장 패턴 설계 — 신규 값 추가 시 코드 변경 최소화 | REQ-NF-005 · 6.2 | FR-001~004 | NF-011, QA-013 | M |
| FR-006 | `[DB]` | Foundation | 스키마 + **마이그레이션 스크립트** — `user_profiles` / `user_behavioral_signals` | 6.4 · REQ-FUNC-001·002 | FR-001, FR-002 | FR-010, FR-012, FR-015, FR-049 | M |
| FR-007 | `[DB]` | Foundation | 스키마 + **마이그레이션 스크립트** — `campaigns` / `campaign_targeting`(비정규화) / `campaign_creatives` | 6.4 · REQ-FUNC-003 | FR-003 | FR-010, FR-019a, FR-019b, FR-025 | M |
| FR-008 | `[DB]` | Foundation | 스키마 + **마이그레이션 스크립트** — `ad_events` (대용량 파티셔닝) | 6.4 · REQ-FUNC-008 · REQ-NF-002 | FR-004 | FR-010, FR-039, FR-009 | H |
| FR-009 | `[DB]` | Foundation | 스키마 + **마이그레이션 스크립트** — `campaign_performance_realtime` (구체화 뷰) | 6.4 · 6.3 규칙 8 | FR-008 | FR-043, FR-028, FR-045 | H |
| FR-010 | `[Feature/Command]` | Foundation | 공통 소프트 삭제 컴포넌트 `SoftDeleteService` (`deleted_at` 갱신 + 조회 제외 필터) | REQ-FUNC-007 · 6.3 규칙 5 · §5 | FR-006, FR-007, FR-008 | FR-011 | M |
| FR-011 | `[Feature/Command]` | Foundation | 4개 서비스 전체에 소프트 삭제 적용 및 데이터 무결성·이력 보존 검증 | REQ-FUNC-007 · §5 (All Services) | FR-010 | QA-007 | M |

---

## EPIC B · Audience Service

| Task ID | Type | Epic (도메인) | Feature (기능명) | 관련 SRS 섹션 | 선행 (Depends on) | 후행 (Blocks) | 복잡도 |
|---|---|---|---|---|---|---|---|
| FR-012 | `[Feature/Command]` | Audience Service | MECE 복합 세그먼트 분류기 `DemographicSegmentClassifier` (연령×소득×지역 36조합) | REQ-FUNC-001 · 6.3 규칙 1 · §5 | FR-001, FR-006 | FR-013, FR-014, FR-016, FR-017, FR-042 | H |
| FR-013 | `[Util]` | Audience Service | 세그먼트 식별자 포맷 생성·파싱 (`AGE_XX_INCOME_XX_GEOGRAPHY_XX`) | REQ-FUNC-001 · 1.3 정의 | FR-012 | QA-001 | L |
| FR-014 | `[Feature/Command]` | Audience Service | MECE 제약 강제 — 차원별 정확히 1값, 중복·누락 차단 | REQ-FUNC-001 · 6.3 규칙 1 | FR-012 | FR-017, QA-001 | M |
| FR-015 | `[Feature/Command]` | Audience Service | 멀티 태그 행동 신호 처리기 `BehavioralSignalProcessor` (카테고리 간 복수 태그) | REQ-FUNC-002 · 6.3 규칙 2 · §5 | FR-002, FR-006 | FR-016, FR-018, FR-042 | H |
| FR-016 | `[Feature/Query]` | Audience Service | `GET /api/v1/audience/profiles/{userId}` 프로파일 조회 구현 | 6.1 | SPEC-001, FR-012, FR-015 | FR-029, FR-030 | M |
| FR-017 | `[Feature/Command]` | Audience Service | `POST /api/v1/audience/profiles/{userId}/segments` 세그먼트 갱신 구현 | 6.1 | SPEC-002, FR-012, FR-014 | QA-001 | M |
| FR-018 | `[Feature/Command]` | Audience Service | `POST /api/v1/audience/profiles/{userId}/behavioral-signals` 행동 신호 추가 구현 | 6.1 | SPEC-003, FR-015 | QA-002 | M |

---

## EPIC C · Campaign Service

> 원문 REQ-FUNC-003은 "생성 · 타게팅 조건 설정 · 예산 관리"를 한 조항에 담고 있어 단일성 위반이다. 진척 측정이 가능하도록 FR-019 / FR-021 / FR-022로 분리했다.
> **v1.1 — M5 적용:** `FR-019 캠페인 CRUD`를 CQRS 축으로 재분할했다. CRUD 묶음은 "60% 완료" 같은 무의미한 보고를 만든다.

| Task ID | Type | Epic (도메인) | Feature (기능명) | 관련 SRS 섹션 | 선행 (Depends on) | 후행 (Blocks) | 복잡도 |
|---|---|---|---|---|---|---|---|
| FR-019a | `[Feature/Command]` | Campaign Service | 캠페인 생성·수정·삭제 `CampaignManager` (쓰기) | REQ-FUNC-003 · §5 | FR-007 | FR-020, FR-021, FR-022, FR-024, FR-025, FR-026 | M |
| FR-019b | `[Feature/Query]` | Campaign Service | 캠페인 단건·목록 조회 `CampaignManager` (읽기) | REQ-FUNC-003 · §5 | FR-007 | FR-028, FR-029, FR-030 | M |
| FR-020 | `[Feature/Command]` | Campaign Service | 캠페인 상태 전이 관리 (DRAFT → ACTIVE → PAUSED → COMPLETED) | REQ-FUNC-003 · 6.2 CampaignStatus | FR-003, FR-019a | FR-023, QA-003 | M |
| FR-021 | `[Feature/Command]` | Campaign Service | 타게팅 조건 설정·저장 (인구통계 + 행동 조건) | REQ-FUNC-003 · 1.2 범위 | FR-001, FR-002, FR-019a | FR-027, FR-029, FR-030, FR-031 | H |
| FR-022 | `[Feature/Command]` | Campaign Service | 예산 관리 — 총예산·일일 상한 설정 및 잔액 추적 | REQ-FUNC-003 · 6.3 규칙 7 | FR-019a | FR-023, FR-035 | H |
| FR-023 | `[Feature/Command]` | Campaign Service | 예산 소진 시 캠페인 자동 일시중지 | 6.3 규칙 7 · REQ-FUNC-003 | FR-020, FR-022 | QA-003 | M |
| FR-024 | `[Feature/Command]` | Campaign Service | 입찰 전략 설정 (CPC / CPM / CPA) | 6.2 BiddingStrategy · REQ-FUNC-005 | FR-003, FR-019a | FR-034 | M |
| FR-025 | `[Feature/Command]` | Campaign Service | 크리에이티브 자산 등록·관리 | 6.4 `campaign_creatives` | FR-007, FR-019a | FR-037, UX-004 | M |
| FR-026 | `[Feature/Command]` | Campaign Service | `POST /api/v1/campaigns` 캠페인 생성 구현 | 6.1 | SPEC-004, FR-019a | FR-050, QA-003 | M |
| FR-027 | `[Feature/Command]` | Campaign Service | `PUT /api/v1/campaigns/{campaignId}/targeting` 타게팅 갱신 구현 | 6.1 | SPEC-005, FR-021 | FR-050, QA-003 | M |
| FR-028 | `[Feature/Query]` | Campaign Service | `GET /api/v1/campaigns/{campaignId}/performance` 성과 조회 구현 | 6.1 | SPEC-006, FR-019b, FR-041 | FR-050, UX-006 | M |

---

## EPIC D · Ad Serving Engine

> **v1.1 — M9 적용:** `FR-037`은 읽기 경로 안에서 쓰기(`FR-035` 예산 차감)를 수행하는 복합 태스크(`[Feature/Q+C]`)다.
> **이것이 부록 D의 예산 초과 집행이 발생하는 구조적 원인이다.** 초당 1,000건이 흐르는 Query 경로에
> 동시성 제어 없는 Command가 끼어 있다. `FR-035`의 Task Breakdown에 **원자적 차감을 필수 항목으로 못박을 것.**

| Task ID | Type | Epic (도메인) | Feature (기능명) | 관련 SRS 섹션 | 선행 (Depends on) | 후행 (Blocks) | 복잡도 |
|---|---|---|---|---|---|---|---|
| FR-029 | `[Feature/Query]` | Ad Serving Engine | 1단계 정밀 타게팅 후보 조회 (인구통계 + 행동 신호) | REQ-FUNC-004 1단계 | FR-016, FR-021, FR-019b, SPEC-005 · *(MOCK-001·002로 선행 착수 가능)* | FR-032 | H |
| FR-030 | `[Feature/Query]` | Ad Serving Engine | 2단계 인구통계 전용 후보 조회 | REQ-FUNC-004 2단계 | FR-016, FR-021, FR-019b, SPEC-005 · *(MOCK-001·002로 선행 착수 가능)* | FR-032 | M |
| FR-031 | `[Feature/Query]` | Ad Serving Engine | 3단계 컨텍스트·기본 광고 후보 조회 (위치 기반) | REQ-FUNC-004 3단계 · 6.2 FallbackStage | FR-004, FR-021 · *(MOCK-002)* | FR-032 | M |
| FR-032 | `[Feature/Query]` | Ad Serving Engine | 3단계 폴백 오케스트레이션 `ThreeStageRecommendationEngine` (1→2→3 순서 보장) | REQ-FUNC-004 · 6.3 규칙 3 · §5 | FR-029, FR-030, FR-031 | FR-033, FR-034, QA-004 | H |
| FR-033 | `[Feature/Command]` | Ad Serving Engine | 폴백 단계 기록 — `FallbackStage`를 응답·로그에 부착 (성과 분석용) | 6.2 FallbackStage · REQ-FUNC-004 | FR-004, FR-032 | QA-004 | L |
| FR-034 | `[Feature/Query]` | Ad Serving Engine | 수익 최적화 캠페인 선택 `YieldOptimizer` (타게팅 조건 내 최고 입찰가) | REQ-FUNC-005 · 6.3 규칙 4 · §5 | FR-024, FR-032 | FR-035, FR-036, FR-037, QA-005 | H |
| FR-035 | `[Feature/Command]` | Ad Serving Engine | **예산 제약 검증 및 원자적 차감** — 읽기 경로 내 유일한 쓰기 | REQ-FUNC-005 · 6.3 규칙 4·7 | FR-022, FR-034 | FR-037, QA-005 | H |
| FR-036 | `[Feature/Query]` | Ad Serving Engine | 노출 위치별 광고 슬롯 수 제어 `PositionBasedAdSelector` | REQ-FUNC-006 · 6.2 AdPosition · §5 | FR-004, FR-034 | FR-037, QA-006 | M |
| FR-037 | `[Feature/Q+C]` | Ad Serving Engine | `POST /api/v1/ads/request` 3단계 폴백 포함 광고 요청 구현 | 6.1 | SPEC-007, FR-032, FR-034, FR-035, FR-036, FR-025 | FR-046, FR-047, FR-048, NF-001, QA-004, QA-009 | H |
| FR-038 | `[Feature/Command]` | Ad Serving Engine | `POST /api/v1/ads/events/click` 클릭 이벤트 추적 구현 | 6.1 | SPEC-008, FR-004 | FR-041, FR-044, FR-048 | M |

---

## EPIC E · Tracking Service

| Task ID | Type | Epic (도메인) | Feature (기능명) | 관련 SRS 섹션 | 선행 (Depends on) | 후행 (Blocks) | 복잡도 |
|---|---|---|---|---|---|---|---|
| FR-039 | `[Feature/Command]` | Tracking Service | 이벤트 수집·저장 (IMPRESSION / CLICK / CONVERSION) | REQ-FUNC-008 · 6.2 EventType | FR-008 | FR-040, FR-041, FR-044 | H |
| FR-040 | `[Feature/Command]` | Tracking Service | `POST /api/v1/tracking/events` 대용량 일괄 수집 구현 | 6.1 · REQ-NF-002 | SPEC-009, FR-039 | FR-048, QA-008, QA-010 | H |
| FR-041 | `[Feature/Query]` | Tracking Service | 성과 지표 산출 `PerformanceTracker` (CTR / CPC / eCPM) | REQ-FUNC-008 · §5 | FR-039 | FR-028, FR-042, FR-043, FR-045 | H |
| FR-042 | `[Feature/Query]` | Tracking Service | 인구통계 세그먼트·행동 태그 기준 지표 분해 집계 | REQ-FUNC-008 | FR-012, FR-015, FR-041 | QA-008 | H |
| FR-043 | `[Feature/Command]` | Tracking Service | 5분 주기 실시간 집계 배치 (구체화 뷰 갱신) | 6.3 규칙 8 | FR-009, FR-041 | FR-045, QA-008 | M |
| FR-044 | `[Feature/Command]` | Tracking Service | Last-click 어트리뷰션 처리 | 6.3 규칙 6 · REQ-FUNC-008 | FR-039, FR-038 | QA-008 | H |
| FR-045 | `[Feature/Query]` | Tracking Service | `GET /api/v1/tracking/campaigns/{campaignId}/metrics` 실시간 지표 조회 구현 | 6.1 | SPEC-010, FR-041, FR-043 | FR-051, UX-006 | M |

---

## EPIC F · Client Integration (웹/모바일 분리 API)

| Task ID | Type | Epic (도메인) | Feature (기능명) | 관련 SRS 섹션 | 선행 (Depends on) | 후행 (Blocks) | 복잡도 |
|---|---|---|---|---|---|---|---|
| FR-046 | `[Integration]` | Client Integration | 모바일 웹 앱 연동 엔드포인트 (`api.adtech.example.com/mobile`) | 1.2 범위 · 3 시스템 맥락 | FR-037 · *(MOCK-003으로 선행 착수 가능)* | UX-002 | M |
| FR-047 | `[Integration]` | Client Integration | 데스크톱 웹 앱 연동 엔드포인트 (`api.adtech.example.com/desktop`) | 1.2 범위 · 3 시스템 맥락 | FR-037 · *(MOCK-003)* | UX-003 | M |
| FR-048 | `[Integration]` | Client Integration | 클라이언트 측 노출·클릭 이벤트 전송 모듈 | 3 시스템 맥락 · REQ-FUNC-008 | FR-038, FR-040 · *(MOCK-003·004)* | QA-008 | M |

---

## EPIC G · External System Integration

| Task ID | Type | Epic (도메인) | Feature (기능명) | 관련 SRS 섹션 | 선행 (Depends on) | 후행 (Blocks) | 복잡도 |
|---|---|---|---|---|---|---|---|
| FR-049 | `[Integration]` | External Integration | User Profile Service 연동 (프로필 원천 데이터 수신) | 3 외부 시스템 | FR-006 | FR-012, FR-015 | H |
| FR-050 | `[Integration]` | External Integration | Advertiser Portal 연동 인터페이스 | 3 외부 시스템 | FR-026, FR-027, FR-028 | UX-005 | M |
| FR-051 | `[Integration]` | External Integration | Logging & Performance Dashboard System 연동 | 3 외부 시스템 | FR-045 · *(MOCK-004)* | UX-006 | M |

---

## EPIC H · Non-Functional / Infrastructure

> **v1.1 — M7 적용:** `NF-012` 개인정보 로깅 마스킹을 신설했다. 방법론 예시가 마스킹을 명시적 태스크로 들고 있고,
> §6.2 `IncomeSegment`의 민감 정보 성격상 부록 D의 개인정보 항목과 직결된다.

| Task ID | Type | Epic (도메인) | Feature (기능명) | 관련 SRS 섹션 | 선행 (Depends on) | 후행 (Blocks) | 복잡도 |
|---|---|---|---|---|---|---|---|
| NF-001 | `[Infra]` | Infra / Gateway | API Gateway 구축 + `PerformanceMonitor` 계측 | REQ-NF-001 · §5 | FR-037 | NF-002, NF-003, NF-008 | H |
| NF-002 | `[Infra]` | Performance | E2E 응답시간 최적화 — 95% 시나리오 100ms 이하 | REQ-NF-001 | NF-001, FR-037 | QA-009 | H |
| NF-003 | `[Infra]` | Performance / QA | 부하 테스트 프로그램 구축 (차원 쿼리 포함) — **조기 착수 권고** | REQ-NF-001 검증 방식 | NF-001 | NF-004, NF-005, QA-009 | H |
| NF-004 | `[Infra]` | Scalability | 1,000+ RPS — 서비스 간 수직·수평 확장 구성 | REQ-NF-002 | NF-003 | NF-006, QA-010 | H |
| NF-005 | `[Infra]` | Scalability / QA | 다중 서비스 아키텍처 부하 테스트 프로그램 | REQ-NF-002 검증 방식 | NF-003 | QA-010 | M |
| NF-006 | `[Infra]` | Reliability | 가용성 99% — 서비스 수준 이중화 (연 다운타임 ≤ 3.65일) | REQ-NF-003 | NF-004 | NF-007, QA-011 | H |
| NF-007 | `[Infra]` | Reliability / Ops | 마이크로서비스 전반 모니터링 및 SLA 검증 체계 | REQ-NF-003 검증 방식 | NF-006 | QA-011 | M |
| NF-008 | `[Sec]` | Security | 전체 API 기본 인증 적용 | REQ-NF-004 | NF-001, SPEC-000 | NF-009 | H |
| NF-009 | `[Sec]` | Security | 인가 처리 — 비인가 접근 차단 (자원 소유자 검증) | REQ-NF-004 | NF-008 | NF-010, QA-012 | H |
| NF-010 | `[Sec]` | Security / QA | 보안 감사 및 접근 제어 테스트 | REQ-NF-004 검증 방식 | NF-009 | QA-012 | M |
| NF-011 | `[Infra]` | Maintainability | Enum 확장성 코드 리뷰 및 확장성 테스트 | REQ-NF-005 검증 방식 | FR-005 | QA-013 | L |
| **NF-012** | `[Sec]` | Security | **개인정보 로깅 마스킹 파이프라인** (연령 · 소득 · 지역 · 행동 이력) | REQ-NF-004 · 6.2 IncomeSegment | NF-008, FR-006 | QA-012 | M |

---

## EPIC I · QA · 추적성 (§5 테스트 케이스 구현)

| Task ID | Type | Epic (도메인) | Feature (기능명) | 관련 SRS 섹션 | 선행 (Depends on) | 후행 (Blocks) | 복잡도 |
|---|---|---|---|---|---|---|---|
| QA-001 | `[Test]` | QA | `TC-FUNC-001` — MECE 준수 테스트 + 차원 커버리지 검증 | §5 · REQ-FUNC-001 검증 방식 | FR-013, FR-014, FR-017 | — | M |
| QA-002 | `[Test]` | QA | `TC-FUNC-002` — 태그 할당 테스트 + 다중 카테고리 검증 | §5 · REQ-FUNC-002 검증 방식 | FR-015, FR-018 | — | M |
| QA-003 | `[Test]` | QA | `TC-FUNC-003` — 캠페인 CRUD 테스트 + 타게팅 로직 검증 | §5 · REQ-FUNC-003 검증 방식 | FR-019a, FR-019b, FR-020, FR-023, FR-026, FR-027 | — | M |
| QA-004 | `[Test]` | QA | `TC-FUNC-004` — 폴백 순서 테스트 + 단계 검증 | §5 · REQ-FUNC-004 검증 방식 | FR-032, FR-033, FR-037 | — | H |
| QA-005 | `[Test]` | QA | `TC-FUNC-005` — 입찰 최적화 테스트 + 수익 검증 + **동시성 초과 집행 검증** | §5 · REQ-FUNC-005 검증 방식 | FR-034, FR-035 | — | H |
| QA-006 | `[Test]` | QA | `TC-FUNC-006` — 위치 기반 테스트 + 슬롯 수 검증 | §5 · REQ-FUNC-006 검증 방식 | FR-036 | — | M |
| QA-007 | `[Test]` | QA | `TC-FUNC-007` — 삭제 로직 테스트 + 데이터 무결성 검증 | §5 · REQ-FUNC-007 검증 방식 | FR-010, FR-011 | — | M |
| QA-008 | `[Test]` | QA | `TC-FUNC-008` — 지표 정확성 테스트 + 어트리뷰션 검증 | §5 · REQ-FUNC-008 검증 방식 | FR-040, FR-042, FR-043, FR-044, FR-048 | — | H |
| QA-009 | `[Test]` | QA | `TC-NF-001` — E2E 응답시간 성능 검증 | §5 · REQ-NF-001 검증 방식 | NF-002, NF-003 | — | H |
| QA-010 | `[Test]` | QA | `TC-NF-002`† — 1,000+ RPS 처리량 검증 (다중 서비스 부하) | §4.2 REQ-NF-002 검증 방식 | NF-004, NF-005, FR-040 | QA-014 | H |
| QA-011 | `[Test]` | QA | `TC-NF-003`† — 가용성 99% 검증 (연 다운타임 ≤ 3.65일 · 이중화 동작) | §4.2 REQ-NF-003 검증 방식 | NF-006, NF-007 | QA-014 | M |
| QA-012 | `[Test]` | QA | `TC-NF-004`† — 인증 적용 및 비인가 접근 차단 검증 | §4.2 REQ-NF-004 검증 방식 | NF-009, NF-010, NF-012 | QA-014 | H |
| QA-013 | `[Test]` | QA | `TC-NF-005`† — Enum 확장성 검증 (신규 값 추가 시 변경 범위 측정) | §4.2 REQ-NF-005 검증 방식 | FR-005, NF-011 | QA-014 | L |
| QA-014 | `[Test]` | QA | §5 추적성 매트릭스 갱신 — TC-NF-002~005 행 및 담당 모듈 등재 | §5 · REQ-NF-002~005 | QA-010, QA-011, QA-012, QA-013 | — | L |

> **† 4건은 §5 추적성 매트릭스에 존재하지 않는 TC ID로, 본 문서에서 신설했다.**
> 도출 근거는 §4.2 **검증 방식 열**이다 — 원문이 검증 수단(부하 테스트 프로그램 / 모니터링 및 SLA 검증 /
> 보안 감사 및 접근 제어 테스트 / 코드 리뷰 및 확장성 테스트)을 명시하고 있어 케이스 도출이 가능하다.
> 누락된 것은 **ID와 §5 등재**이며, 그 복구가 QA-014다.
>
> **NF- 태스크와의 관계 — 중복이 아니다.** `NF-005·007·010·011`은 검증 **수단**(환경·도구·체계)의 구축이고,
> `QA-010~013`은 그 수단으로 실행하는 **케이스 정의 및 합격 판정**이다.
> 기존 `NF-003`(부하 테스트 프로그램) ↔ `QA-009`(TC-NF-001)와 동일한 분리 방식을 따른다.
>
> **합격 기준은 4건 모두 원문에 없다.** 특히 REQ-NF-002의 인수 기준 *"1k+ RPS를 처리할 수 있어야 한다"* 에는
> **유지해야 할 응답 시간**이 빠져 있어 그대로는 불합격을 낼 수 없다. 각 TC의 통과선 확정은 부록 D에 선행 과제로 기록했다.

---

## EPIC J · UI/UX 디자인 (개발 관점과 분리)

> SRS는 UI 요구사항을 별도 조항으로 규정하지 않는다. 아래 태스크는 §3 클라이언트 애플리케이션과 §6.2 `AdPosition`에서 도출 가능한 범위에 한정한다.
> **UX-005 · UX-006 주의** — Advertiser Portal과 Logging & Performance Dashboard System은 §3에서 **외부 시스템**으로 분류되어 있다. 화면 설계가 본 프로젝트 범위인지 **착수 전 확정 필요**.

| Task ID | Type | Epic (도메인) | Feature (기능명) | 관련 SRS 섹션 | 선행 (Depends on) | 후행 (Blocks) | 복잡도 |
|---|---|---|---|---|---|---|---|
| UX-001 | `[Design]` | UI/UX Design | 광고 노출 위치 5종 배치 정의 (TOP / MIDDLE / BOTTOM / L·R SIDEBAR) | 6.2 AdPosition · REQ-FUNC-006 | None | UX-002, UX-003, UX-004 | M |
| UX-002 | `[Design]` | UI/UX Design | 모바일 웹 광고 슬롯 반응형 레이아웃 | 3 · REQ-FUNC-006 | UX-001 · *(MOCK-003)* | FR-046 | M |
| UX-003 | `[Design]` | UI/UX Design | 데스크톱 웹 광고 슬롯 레이아웃 | 3 · REQ-FUNC-006 | UX-001 · *(MOCK-003)* | FR-047 | M |
| UX-004 | `[Design]` | UI/UX Design | 위치별 크리에이티브 규격 정의 (사이즈·형식) | 6.4 `campaign_creatives` · REQ-FUNC-006 | UX-001 | FR-025 | M |
| UX-005 | `[Design]` | UI/UX Design | 캠페인 관리 화면 설계 (생성·타게팅·예산) ※범위 확인 필요 | REQ-FUNC-003 · 3 | None | UX-006 | H |
| UX-006 | `[Design]` | UI/UX Design | 캠페인 성과 조회 화면 설계 ※범위 확인 필요 | REQ-FUNC-008 · 6.1 · 3 | UX-005 · *(MOCK-004)* | — | H |

---

## 부록 A · 의존 관계도

### A-1. Epic 레벨 의존 그래프

```mermaid
graph LR
  S["<b>S · Contract</b><br/>API 계약 11건<br/>SPEC-000~010"]
  MK["<b>M · Mock</b><br/>모킹 서버 4건<br/>MOCK-001~004"]
  A["<b>A · Foundation</b><br/>Enum · 스키마 · 소프트삭제<br/>FR-001~011"]
  B["<b>B · Audience</b><br/>MECE · 멀티태그<br/>FR-012~018"]
  C["<b>C · Campaign</b><br/>CRUD · 타게팅 · 예산<br/>FR-019a~028"]
  D["<b>D · Ad Serving</b><br/>3단계 폴백 · 수익 최적화<br/>FR-029~038"]
  E["<b>E · Tracking</b><br/>이벤트 · 집계 · 어트리뷰션<br/>FR-039~045"]
  F["<b>F · Client</b><br/>모바일 · 데스크톱 연동<br/>FR-046~048"]
  G["<b>G · External</b><br/>Profile · Portal · Dashboard<br/>FR-049~051"]
  H["<b>H · Infra / NF</b><br/>Gateway · 성능 · 보안<br/>NF-001~012"]
  I["<b>I · QA</b><br/>TC 구현 14건<br/>QA-001~014"]
  J["<b>J · UI/UX</b><br/>슬롯 · 규격 · 화면<br/>UX-001~006"]

  S --> MK
  S --> B
  S --> C
  S --> D
  S --> E
  S --> H
  MK --> D
  MK --> F
  MK --> J
  A --> B
  A --> C
  A --> E
  A --> G
  A --> H
  B --> D
  C --> D
  E --> C
  E --> G
  C --> G
  D --> F
  D --> H
  E --> F
  B --> I
  C --> I
  D --> I
  E --> I
  H --> I

  classDef crit fill:#fdeceb,stroke:#bc3226,stroke-width:2px,color:#6f1a13
  classDef plain fill:#eef1f8,stroke:#8b93a5,color:#1f2430
  classDef free fill:#eaf4ee,stroke:#1e7a55,color:#124434
  class S,A,D,H crit
  class B,C,E,F,G,I plain
  class MK,J free
```

> **v1.1 변경** — `S · Contract`가 그래프의 새 진입점이 되었다. 계약이 얼기 전에는 어떤 서비스 구현도 착수할 수 없다.
> `M · Mock`은 `S`만 있으면 성립하고, `D`·`F`·`J`의 착수를 앞당긴다.
> `E → C` 간선은 FR-028(캠페인 성과 조회)이 FR-041(지표 산출)을 선행으로 갖는 데서 발생한다.

### A-2. 크리티컬 패스 — Feature 레벨

```mermaid
graph TD
  SP0["SPEC-000<br/>공통 규약"]
  SP7["SPEC-007<br/>ads/request 계약"]

  subgraph FOUND["EPIC A · Foundation"]
    E1["FR-001~004<br/>Enum 정의 11종"]
    S1["FR-006<br/>user_profiles"]
    S2["FR-007<br/>campaigns"]
    S3["FR-008<br/>ad_events"]
  end

  MECE["FR-012<br/>MECE 분류기"]
  CRUD["FR-019a<br/>캠페인 쓰기"]
  TGT["FR-021<br/>타게팅 조건"]

  FB["FR-032<br/>3단계 폴백 오케스트레이션"]
  YO["FR-034<br/>수익 최적화 선택"]
  BG["FR-035<br/>예산 원자적 차감"]
  REQ["FR-037<br/>POST /ads/request"]

  GW["NF-001<br/>API Gateway"]
  PERF["NF-002<br/>100ms 최적화"]
  LOAD["NF-003<br/>부하 테스트"]
  SCALE["NF-004<br/>1,000 RPS 확장"]
  HA["NF-006<br/>가용성 99% 이중화"]

  SP0 --> SP7
  SP0 --> E1
  E1 --> S1
  E1 --> S2
  E1 --> S3
  S1 --> MECE
  S2 --> CRUD
  CRUD --> TGT
  MECE --> FB
  TGT --> FB
  FB --> YO
  YO --> BG
  YO --> REQ
  BG --> REQ
  SP7 --> REQ
  REQ --> GW
  GW --> PERF
  GW --> LOAD
  LOAD --> SCALE
  SCALE --> HA

  classDef crit fill:#fdeceb,stroke:#bc3226,stroke-width:2px,color:#6f1a13
  classDef plain fill:#eef1f8,stroke:#8b93a5,color:#1f2430
  class SP0,SP7,E1,S1,S2,S3,MECE,TGT,FB,YO,BG,REQ,GW,PERF,LOAD,SCALE,HA crit
  class CRUD plain
```

| 구간 | 근거 |
| --- | --- |
| **SPEC-000 → SPEC-007** | v1.1 신설. 계약이 크리티컬 패스의 첫 마디다 |
| **Enum·스키마 확정** (FR-001~008) | 전체 태스크의 최상위 선행. 미확정 시 병렬 개발 불가 |
| **FR-032 → FR-034 → FR-035 → FR-037** | Ad Serving Engine은 Audience·Campaign 양쪽 산출물이 모두 있어야 통합 가능. FR-035가 경로에 들어온 것이 v1.1 변경 |
| **NF-002 이후 체인** | 성능·확장·가용성은 통합 이후에만 측정 가능. 후반 집중 시 회복 불가 |

### A-3. 병렬 착수 트랙

```mermaid
graph LR
  CT(["게이트 1<br/>SPEC-000~010 확정"])
  GATE(["게이트 2<br/>FR-001~008 확정"])

  subgraph TM["Track 0 · Mock — 게이트 1 직후"]
    direction TB
    tma["MOCK-001~004<br/>4개 서비스 모킹"]
  end
  subgraph T1["Track 1 · Audience"]
    direction TB
    t1a["FR-012~015<br/>분류기 · 처리기"] --> t1b["FR-016~018<br/>API 3종"]
  end
  subgraph T2["Track 2 · Campaign"]
    direction TB
    t2a["FR-019a~025<br/>쓰기 · 타게팅 · 예산"] --> t2b["FR-019b·026~028<br/>읽기 · API"]
  end
  subgraph T3["Track 3 · Tracking"]
    direction TB
    t3a["FR-039~042<br/>수집 · 지표 · 분해"] --> t3b["FR-043~045<br/>집계 배치 · API"]
  end
  subgraph T5["Track 5 · 성능 환경"]
    direction TB
    t5a["NF-001<br/>Gateway"] --> t5b["NF-003<br/>부하 테스트 환경"]
  end

  CT --> TM
  CT --> GATE
  GATE --> T1
  GATE --> T2
  GATE --> T3
  TM --> MERGE
  T1 --> MERGE
  T2 --> MERGE
  T3 --> MERGE
  MERGE(["통합<br/>EPIC D · Ad Serving"]) --> T5

  subgraph T4["Track 4 · 선행 없음 · 즉시 착수"]
    direction TB
    t4a["UX-001<br/>노출 위치 5종"] --> t4b["UX-002~004<br/>레이아웃 · 규격"]
  end

  classDef gate fill:#fdeceb,stroke:#bc3226,stroke-width:2px,color:#6f1a13
  classDef free fill:#eaf4ee,stroke:#1e7a55,color:#124434
  classDef plain fill:#eef1f8,stroke:#8b93a5,color:#1f2430
  class CT,GATE,MERGE gate
  class t4a,t4b,tma free
  class t1a,t1b,t2a,t2b,t3a,t3b,t5a,t5b plain
```

| 트랙 | 태스크 | 착수 조건 |
| --- | --- | --- |
| Track 0 | MOCK-001~004 | **게이트 1(계약) 직후 — v1.1 신설** |
| Track 1 | FR-012 ~ FR-018 (Audience) | FR-001, FR-002, FR-006 + SPEC-001~003 |
| Track 2 | FR-019a ~ FR-028 (Campaign) | FR-003, FR-007 + SPEC-004~006 |
| Track 3 | FR-039 ~ FR-045 (Tracking) | FR-008 + SPEC-009~010 |
| Track 4 | UX-001 ~ UX-004 (디자인) | **선행 없음 — 즉시 착수** |
| Track 5 | NF-003 (부하 테스트 환경) | NF-001 완료 후 **조기 착수 권장** |

> 일정(기간·날짜) 기반 간트 차트는 작성하지 않았습니다. SRS에 공정 기간·인력 배정 정보가 없어
> 임의 추정 없이는 산출할 수 없습니다 — 도출 원칙("SRS 명시 범위만")에 따른 제외입니다.

### A-4. 3단계 폴백 처리 흐름 (FR-029 ~ FR-037)

```mermaid
flowchart TD
  RQ(["POST /api/v1/ads/request<br/>FR-037 · Q+C 복합"]) --> PF["프로파일 조회<br/>FR-016 · Query"]
  PF --> S1{"1단계 정밀<br/>인구통계 + 행동<br/>FR-029 · Query"}
  S1 -->|후보 있음| YO
  S1 -->|후보 없음| S2{"2단계 인구통계 전용<br/>FR-030 · Query"}
  S2 -->|후보 있음| YO
  S2 -->|후보 없음| S3{"3단계 컨텍스트·기본<br/>FR-031 · Query"}
  S3 -->|후보 있음| YO
  S3 -->|후보 없음| UNDEF["미정의<br/>부록 D 참조"]
  YO["최고 입찰가 선택<br/>FR-034 · Query"] --> BG["예산 검증·원자적 차감<br/>FR-035 · <b>Command</b>"]
  BG --> SLOT["위치별 슬롯 수 제어<br/>FR-036 · Query"]
  SLOT --> STG["FallbackStage 기록<br/>FR-033 · Command"]
  STG --> RES(["응답"])
  RES --> EV["이벤트 수집<br/>FR-039 · FR-040 · Command"]

  classDef undef fill:#fdeceb,stroke:#bc3226,stroke-width:2px,stroke-dasharray:4 3,color:#6f1a13
  classDef cmd fill:#fdf3e3,stroke:#9c5a05,stroke-width:2px,color:#5c3503
  classDef plain fill:#eef1f8,stroke:#8b93a5,color:#1f2430
  classDef term fill:#eaf4ee,stroke:#1e7a55,color:#124434
  class UNDEF undef
  class BG cmd
  class RQ,RES,EV term
  class PF,S1,S2,S3,YO,SLOT,STG plain
```

> **점선 붉은 노드**는 SRS에 동작이 규정되지 않은 지점입니다(3단계에서도 후보가 없는 경우).
> 각 단계의 실패 판정 기준 역시 미정의이며, 부록 D에 미결 항목으로 기록했습니다.
>
> **주황 노드 `FR-035`가 v1.1의 핵심 발견입니다.** 읽기 흐름 전체에서 유일한 쓰기이며,
> 초당 1,000건이 통과하는 경로 안에 있습니다. **동시성 제어가 없으면 예산 초과 집행이 구조적으로 발생합니다.**

### A-5. Mock 도입 효과 — 크리티컬 패스 단축 (v1.1 신설)

```mermaid
graph LR
  subgraph BEFORE["v1.0 · Mock 없음 — 직렬"]
    direction LR
    b1["Audience 완성"] --> b3["Ad Serving 착수"]
    b2["Campaign 완성"] --> b3
    b3 --> b4["Client · UI 착수"]
  end
  subgraph AFTER["v1.1 · Mock 도입 — 병렬"]
    direction LR
    a0["SPEC 계약 확정"] --> a1["MOCK-001·002"]
    a0 --> a2["MOCK-003"]
    a1 --> a3["Ad Serving 착수<br/>실서비스 대기 불필요"]
    a2 --> a4["Client · UI 착수<br/>Ad Serving 대기 불필요"]
    a0 --> a5["Audience · Campaign<br/>동시 진행"]
  end

  classDef slow fill:#fdeceb,stroke:#bc3226,color:#6f1a13
  classDef fast fill:#eaf4ee,stroke:#1e7a55,color:#124434
  class b1,b2,b3,b4 slow
  class a0,a1,a2,a3,a4,a5 fast
```

**효과** — Ad Serving은 앞의 두 서비스 완성을 기다리지 않고, 클라이언트·UI는 Ad Serving 완성을 기다리지 않는다.
직렬 3단이 병렬 2단으로 줄어든다. 대가는 모킹 태스크 4건과, **모킹과 실구현이 어긋나지 않게 유지하는 비용**이다
— 그래서 계약(`SPEC`)이 단일 진실 원천이어야 하고, 계약 변경 시 모킹도 함께 갱신해야 한다.

---

## 부록 B · 요구사항 커버리지 검증

> 태스크 리스트가 **누락 없이** 도출되었음을 증명하는 절이다. 세 방향으로 검증한다.
> ① 정방향 — 모든 요구사항이 태스크로 전개되었는가 ② 역방향 — 근거 없는 태스크가 없는가 ③ 검증 — 각 요구사항에 합격 판정 수단이 있는가

### B-1. 정방향 커버리지 — 요구사항 → 태스크 (13 / 13 · 100%)

| 요구사항 ID | 우선순위 | 전개된 태스크 | 태스크 수 | 커버 |
| --- | --- | --- | --- | --- |
| REQ-FUNC-001 | Must | FR-001, FR-006, FR-012, FR-013, FR-014, SPEC-001, SPEC-002, QA-001 | 8 | ✅ |
| REQ-FUNC-002 | Must | FR-002, FR-006, FR-015, FR-018, SPEC-003, QA-002 | 6 | ✅ |
| REQ-FUNC-003 | Must | FR-003, FR-007, FR-019a, FR-019b, FR-020, FR-021, FR-022, FR-023, FR-026, FR-027, SPEC-004, SPEC-005, QA-003 | 13 | ✅ |
| REQ-FUNC-004 | Must | FR-004, FR-029, FR-030, FR-031, FR-032, FR-033, SPEC-007, QA-004 | 8 | ✅ |
| REQ-FUNC-005 | Must | FR-024, FR-034, FR-035, QA-005 | 4 | ✅ |
| REQ-FUNC-006 | Should | FR-036, UX-001, UX-002, UX-003, UX-004, QA-006 | 6 | ✅ |
| REQ-FUNC-007 | Should | FR-010, FR-011, SPEC-000, QA-007 | 4 | ✅ |
| REQ-FUNC-008 | Must | FR-008, FR-028, FR-039, FR-040, FR-041, FR-042, FR-043, FR-044, FR-045, SPEC-006, SPEC-008, SPEC-009, SPEC-010, QA-008 | 14 | ✅ |
| REQ-NF-001 | Must | NF-001, NF-002, NF-003, QA-009 | 4 | ✅ |
| REQ-NF-002 | Should | FR-008, FR-040, NF-004, NF-005, QA-010 | 5 | ✅ |
| REQ-NF-003 | Must | NF-006, NF-007, QA-011 | 3 | ✅ |
| REQ-NF-004 | Must | NF-008, NF-009, NF-010, NF-012, SPEC-000, QA-012 | 6 | ✅ |
| REQ-NF-005 | Could | FR-005, NF-011, QA-013 | 3 | ✅ |

**미전개 요구사항 0건.** REQ-FUNC-003·008은 원문이 복합 조항이어서 각각 13·14개 태스크로 분해되었다.

### B-2. 부속 명세 커버리지 — 요구사항 표 밖의 구성 요소

| SRS 구성 요소 | 원문 항목 수 | 커버된 수 | 매핑 |
| --- | --- | --- | --- |
| §1.2 범위 항목 | 7 | 7 | FR-012 / FR-015 / FR-019a·021·022 / FR-032·034 / FR-039~045 / FR-010·011 / FR-046·047 |
| §3 클라이언트 애플리케이션 | 2 | 2 | FR-046(mobile), FR-047(desktop) |
| §3 내부 마이크로서비스 | 4 | 4 | EPIC B / C / D / E |
| §3 외부 시스템 | 3 | 3 | FR-049(User Profile), FR-050(Advertiser Portal), FR-051(Dashboard) |
| §5 구현 클래스 | 9 | 9 | FR-012, FR-015, FR-019a·b, FR-032, FR-034, FR-036, FR-010, FR-041, NF-001 |
| §6.1 API 엔드포인트 | 10 | 10 | **계약** SPEC-001~010 + **구현** FR-016~018, FR-026~028, FR-037, FR-038, FR-040, FR-045 |
| §6.2 Enum 타입 | 11 | 11 | FR-001(3) + FR-002(3) + FR-003(2) + FR-004(3) |
| §6.3 비즈니스 규칙 | 8 | 8 | 아래 B-2a 참조 |
| §6.4 테이블 | 7 | 7 | FR-006(2), FR-007(3), FR-008(1), FR-009(1) |
| **합계** | **61** | **61** | **100%** |

#### B-2a. §6.3 비즈니스 규칙 8건 개별 매핑

| 규칙 | 내용 | 태스크 |
| --- | --- | --- |
| 1 | MECE 준수 — 차원별 정확히 하나 | FR-014 |
| 2 | 멀티 태그 할당 | FR-015 |
| 3 | 폴백 순서 1→2→3 | FR-032 |
| 4 | 수익 최적화 — 최고 입찰가 | FR-034, FR-035 |
| 5 | 소프트 삭제 — 물리 삭제 금지 | FR-010, FR-011, SPEC-000 |
| 6 | 어트리뷰션 — Last-click | FR-044 |
| 7 | 예산 관리 — 일일 상한, 소진 시 자동 일시중지 | FR-022, FR-023 |
| 8 | 성과 추적 — 5분 단위 집계 | FR-043 |

### B-3. 역방향 커버리지 — 태스크 → SRS 근거 (95 / 99 · 방법론 파생 4건)

제약 조건 *"SRS에 명시되지 않은 기능을 임의로 추가하지 마십시오"* 의 준수 여부를 검증한다.

| 태스크 군 | 건수 | 근거 유형 | SRS 직접 근거 |
| --- | --- | --- | --- |
| SPEC-000 ~ SPEC-010 | 11 | §6.1 API 목록 · REQ-NF-004 · REQ-FUNC-007 | ✅ |
| **MOCK-001 ~ MOCK-004** | **4** | **방법론 파생** — §6.1 계약을 입력으로 삼되 SRS에 요구 문장 없음 | ⚠️ **없음** |
| FR-001 ~ FR-011 | 11 | §6.2 enum 정의 · §6.4 스키마 · REQ-FUNC-007 · REQ-NF-005 | ✅ |
| FR-012 ~ FR-018 | 7 | REQ-FUNC-001·002 · §6.1 · §6.3 규칙 1·2 · §1.3 포맷 정의 | ✅ |
| FR-019a ~ FR-028 | 11 | REQ-FUNC-003 · §6.1 · §6.2 · §6.3 규칙 7 · §6.4 | ✅ |
| FR-029 ~ FR-038 | 10 | REQ-FUNC-004·005·006 · §6.1 · §6.2 · §6.3 규칙 3·4 | ✅ |
| FR-039 ~ FR-045 | 7 | REQ-FUNC-008 · §6.1 · §6.2 · §6.3 규칙 6·8 | ✅ |
| FR-046 ~ FR-051 | 6 | §1.2 범위 · §3 시스템 맥락 및 인터페이스 | ✅ |
| NF-001 ~ NF-012 | 12 | REQ-NF-001~005 본문 및 **검증 방식 열** · §5 API Gateway · §6.2 민감 정보 | ✅ |
| QA-001 ~ QA-014 | 14 | §5 TC ID · §4.2 검증 방식 열(QA-010~013 †) · §5 갱신(QA-014) | ✅ |
| UX-001 ~ UX-006 | 6 | §6.2 AdPosition · §3 클라이언트 애플리케이션 · §6.4 creatives · REQ-FUNC-003·008 | ✅ |

**v1.1 정직성 고지 — "고아 태스크 0"은 더 이상 성립하지 않는다.**
`MOCK-001~004`는 **SRS에 근거 문장이 없다.** 개발 방법론상 필요해 신설한 것이며,
§6.1 계약을 입력으로 삼으므로 SRS와 무관하지는 않으나 **원문이 요구한 기능은 아니다.**
v1.0의 도출 원칙("SRS 명시 범위만")에 대한 **의도적 예외**이며, 그 사실을 여기 명시한다.
이 4건을 범위에서 제외할 것인지는 승인 회의의 판단 사항이다.

> **단, UX-005·UX-006은 근거 강도가 약하다.** REQ-FUNC-003·008이 기능 요구사항으로 존재하나
> 해당 화면의 소유 주체(Advertiser Portal · Dashboard)가 §3에서 **외부 시스템**으로 분류되어 있다.
> 범위 판정 결과에 따라 삭제 가능한 2건으로 표시했다.

### B-4. 검증 커버리지 — TC 태스크 기준 13 / 13 (100%)

| 요구사항 | TC ID | 출처 | 검증 수단 태스크 | 케이스 태스크 |
| --- | --- | --- | --- | --- |
| REQ-FUNC-001 ~ 008 | TC-FUNC-001 ~ 008 | §5 등재 | — | QA-001 ~ QA-008 |
| REQ-NF-001 | TC-NF-001 | §5 등재 | NF-002, NF-003 | QA-009 |
| REQ-NF-002 | `TC-NF-002` † | **본 문서 신설** (§4.2 검증 방식) | NF-004, NF-005 | QA-010 |
| REQ-NF-003 | `TC-NF-003` † | **본 문서 신설** (§4.2 검증 방식) | NF-006, NF-007 | QA-011 |
| REQ-NF-004 | `TC-NF-004` † | **본 문서 신설** (§4.2 검증 방식) | NF-009, NF-010, NF-012 | QA-012 |
| REQ-NF-005 | `TC-NF-005` † | **본 문서 신설** (§4.2 검증 방식) | FR-005, NF-011 | QA-013 |

**§5 등재 기준으로는 여전히 9 / 13이다.** 원문 추적성 매트릭스에 4개 행을 추가하는 문서 작업이 `QA-014`이며,
그것이 완료되어야 SRS 자체의 추적성이 복구된다.

```mermaid
flowchart LR
  subgraph OK["추적 사슬 완결 — 9건 (§5 등재)"]
    direction LR
    R1["REQ-FUNC-001~008<br/>REQ-NF-001"] --> M1["§5 모듈·클래스"] --> T1["TC-FUNC-001~008<br/>TC-NF-001"] --> Q1["QA-001~009"]
  end
  subgraph FIX["사슬 복구 — 4건 (본 문서 신설)"]
    direction LR
    R2["REQ-NF-002~005"] --> V2["§4.2 검증 방식 열<br/>= 유일한 근거"]
    V2 --> N2["NF-004·005·006·007<br/>009·010·011·012<br/>검증 수단 구축"]
    N2 --> T2["TC-NF-002~005 †<br/>신설 ID"]
    T2 --> Q2["QA-010~013"]
    Q2 -.->|"§5 등재 필요"| U2["QA-014<br/>추적성 매트릭스 갱신"]
  end
  T2 -.->|"합격 기준 미정의"| GAP["부록 D<br/>통과선 확정 선행"]

  classDef ok fill:#eaf4ee,stroke:#1e7a55,color:#124434
  classDef fix fill:#e9edf9,stroke:#2749c9,color:#16255f
  classDef warn fill:#fdf3e3,stroke:#9c5a05,color:#5c3503
  classDef gap fill:#fdeceb,stroke:#bc3226,stroke-width:2px,stroke-dasharray:4 3,color:#6f1a13
  class R1,M1,T1,Q1 ok
  class R2,N2,T2,Q2 fix
  class V2,U2 warn
  class GAP gap
```

**남은 격차는 ID가 아니라 통과선이다.** TC ID는 신설로 메웠으나 4건 모두 **합격 기준이 원문에 없다.**
REQ-NF-002는 유지 응답 시간이, REQ-NF-003은 계획 점검 시간 포함 여부와 측정 주체가,
REQ-NF-004는 인증 방식과 자원 소유자 판정 규칙이, REQ-NF-005는 "최소화"의 정량 기준이 각각 빠져 있다.
**QA-010~013은 착수는 가능하나 통과선 확정 없이는 완료 판정이 불가능하다** — 부록 D 참조.

### B-5. 커버리지 종합

| 검증 축 | 대상 | 커버 | 비율 | 판정 |
| --- | --- | --- | --- | --- |
| 정방향 — 요구사항 전개 | 13 | 13 | 100% | ✅ 통과 |
| 부속 명세 — API·enum·규칙·스키마·인터페이스 | 61 | 61 | 100% | ✅ 통과 |
| 역방향 — 태스크 근거 추적 | 99 | 95 | 96% | ⚠️ **방법론 파생 4건 (MOCK)** |
| 검증 — TC 태스크 배정 | 13 | 13 | 100% | ✅ 통과 (4건은 신설 †) |
| 검증 — §5 원문 등재 | 13 | 9 | 69% | ⚠️ **QA-014로 복구 대상** |
| 인수 판정 가능성 — 부록 D·E 기준 | 13 | 8 | 62% | ⚠️ **통과선 미정의 13항목** |

> 마지막 세 축은 태스크 도출의 결함이 아니라 **원문 SRS의 미완성 상태**와 **방법론상 필요한 예외**에서 비롯된 것이다.

---

## 부록 C · 범위 외 (Won't Have)

§7 향후 개선 사항에 해당하며 **본 태스크 리스트에서 의도적으로 제외**했다. SRS에 요구사항 조항(REQ ID)이 부여되지 않았으므로 태스크로 도출하지 않는다.

| 항목 | SRS 근거 |
| --- | --- |
| RTB / OpenRTB 연동, DSP·SSP 입찰 통신, 예산 페이싱 | 7.1 |
| 동적 태깅 파이프라인, 규칙·ML 기반 태그 생성 | 7.2 |
| 컨텍스트·행동·리타게팅, 성별·위치정보·요일/시간대 타게팅 | 7.3 |
| Multi-touch 어트리뷰션 | 6.3 규칙 6 (향후 확장) |

---

## 부록 D · 태스크 도출 불가 항목 (착수 전 확정 필요)

아래는 SRS에 값·규칙이 정의되지 않아 **태스크로 확정할 수 없는** 항목이다. 임의 보완 없이 미결로 남긴다.
확정 안건서는 `docs/W0-decision-agenda.md`에 있다.

| 관련 태스크 | 미정의 항목 | 영향 |
| --- | --- | --- |
| FR-036 | REQ-FUNC-006의 "정의된 슬롯 수" — 위치별 슬롯 수 표가 원문에 없음 | 인수 기준 판정 불가 |
| FR-013 | 세그먼트 포맷이 §1.3(`AGE_25_34_MID_URBAN`)과 §4.1(`AGE_XX_INCOME_XX_GEOGRAPHY_XX`)에서 불일치 | 구현 분기 발생 |
| FR-001 | `IncomeSegment` 금액 단위(통화) 미표기 | 분류 기준 확정 불가 |
| FR-012, FR-014 | 차원 값 미상 사용자의 분류 대상 (enum에 `UNKNOWN` 없음) | MECE 전체 포괄 원칙 성립 불가 |
| FR-032 | 각 폴백 단계의 실패 판정 기준, 3단계 실패 시 응답 | 단계 통계 비교 불가 |
| FR-034 | 입찰가 동점 시 선택 규칙 | 구현 임의성 발생 |
| FR-035 | 예산 확인·차감의 동시성 처리 방식 — **읽기 경로 내 Command (A-4 참조)** | 초과 집행 위험 |
| FR-043, FR-045 | REQ-FUNC-008 "실시간"과 §6.3 규칙 8 "5분 주기"의 정의 충돌 | 인수 기준 상충 |
| FR-044 | 어트리뷰션 윈도우(인정 기간) | 정산 기준 미확정 |
| NF-002, QA-009 | REQ-NF-001의 측정 구간·부하 조건·데이터 조건·캐시 상태 | 성능 검증 불가 |
| NF-008, NF-009, NF-012 | REQ-NF-004의 "기본 인증" 구체 방식, 자원 소유자 기준 접근 제어 규칙, 마스킹 대상 범위 | 보안 설계 착수 불가 |
| NF-011 | REQ-NF-005 "코드 변경 최소화"의 정량 기준 | 합격선 부재 |
| QA-010 ~ QA-013 | REQ-NF-002~005의 **합격 기준(통과선)** 미정의. TC ID는 신설했으나 원문에 판정 수치가 없음 | 착수는 가능하나 완료 판정 불가 |
| QA-014 | REQ-NF-002~005가 §5 추적성 매트릭스에 미등재 — 담당 모듈도 미지정 | 원문 추적성 단절 |

---

## 부록 E · AC 준비도 원장 (v1.1 신설)

> **M4 적용 결과.** 평가 보고서는 `인수 기준 출처`·`AC 작성 가능` 두 열을 메인 표에 추가할 것을 권고했으나,
> 인수 기준 문장이 길어 메인 표(8열)에 넣으면 표가 무너진다. **별도 원장으로 분리**했다 — 목적(Step 3 성립)은 동일하다.
> 방법론 Step 3의 *"AC를 Feature 이슈 DoD로 삽입"* 은 이 원장을 원본으로 삼는다.

| 요구사항 | 원문 인수 기준 (§4.1 · §4.2) | AC 작성 | 차단 사유 |
| --- | --- | --- | --- |
| REQ-FUNC-001 | "정확히 하나의 복합 세그먼트에 할당. 형식 `AGE_XX_INCOME_XX_GEOGRAPHY_XX`" | ⚠️ 부분 | 포맷 불일치 · 통화 단위 · `UNKNOWN` 부재 |
| REQ-FUNC-002 | "복수의 태그를 부여받아야 한다" | 🔴 불가 | 최소·최대 개수 없음 — 불합격 판정 불가 |
| REQ-FUNC-003 | "캠페인 생성, 타게팅 조건 설정, 예산 관리를 지원" | ⚠️ 부분 | 단일성 위반 — 태스크별로 쪼개 재작성 필요 |
| REQ-FUNC-004 | "1단계 정밀 / 2단계 인구통계 / 3단계 컨텍스트·기본" | ⚠️ 부분 | 단계 실패 판정 기준 · 3단계 실패 시 동작 없음 |
| REQ-FUNC-005 | "가장 높은 입찰가를 선택, 예산 제약 준수" | ⚠️ 부분 | 제목(수익 최적화)과 기준(입찰가) 불일치 · 동점 규칙 · 동시성 없음 |
| REQ-FUNC-006 | "정의된 슬롯 수에 따라 광고를 노출" | 🔴 불가 | "정의된 슬롯 수"가 문서에 없음 |
| REQ-FUNC-007 | "`deleted_at` 필드만 갱신, 무결성·이력 유지" | ✅ 가능 | — (조회 제외 규칙은 SPEC-000에서 보완) |
| REQ-FUNC-008 | "세그먼트·태그별 CTR·CPC·eCPM 실시간 기록" | 🔴 불가 | "실시간" 미정의 · §6.3과 모순 · 어트리뷰션 윈도우 없음 |
| REQ-NF-001 | "E2E 응답 시간 95% 시나리오 100ms 이하" | ⚠️ 부분 | 측정 구간·부하·데이터·캐시 조건 없음 |
| REQ-NF-002 | "1k+ RPS를 처리할 수 있어야 한다" | 🔴 불가 | 유지할 응답 시간 없음 — 느려도 통과 |
| REQ-NF-003 | "연간 다운타임 3.65일 이하, 서비스 수준 이중화" | ✅ 가능 | — (계획 점검 포함 여부만 확인) |
| REQ-NF-004 | "모든 API에 기본 인증, 비인가 접근 차단" | 🔴 불가 | "기본 인증" 해석 갈림 · 인가 규칙 없음 |
| REQ-NF-005 | "enum 패턴으로 코드 변경을 최소화" | 🔴 불가 | "최소화"의 정량 기준 없음 |

| AC 작성 판정 | 건수 | 비율 |
| --- | --- | --- |
| ✅ 가능 | 2 | 15% |
| ⚠️ 부분 (가정 명시 후 작성 가능) | 5 | 39% |
| 🔴 불가 (확정 없이 작성 불가) | 6 | 46% |

**해석.** 13개 요구사항 중 **AC를 온전히 쓸 수 있는 것은 2건뿐**이다.
이것이 부록 B-5의 "인수 판정 가능성 62%"를 요구사항 단위로 내린 결과이며,
방법론 Step 3(테스트 태스크 변환)의 실질적 선행 조건이 부록 D 해소임을 보여준다.

---

*근거 문서: SRS-ADTECH-MVP-001 v1.0 · 2025-06-13 · ISO/IEC/IEEE 29148:2018*
*개정 근거: `docs/task-extraction-assessment.md` P0 · M1~M9*
