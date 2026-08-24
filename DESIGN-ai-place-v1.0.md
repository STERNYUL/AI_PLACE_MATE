# [설계 문서] AI-Place-Mate

# 소프트웨어 설계 문서 (SDD)

**문서 ID:** SDD-AIPLACE-MVP-001

**개정 버전:** 1.0

**날짜:** 2026-08-24

**상위 문서:** [`SRS-ai-place-v1.0.md`](SRS-ai-place-v1.0.md) (SRS-AIPLACE-MVP-001, 개정 1.9)

---

## 1. 서론

### 1.1 목적

본 문서는 SRS에 명시된 요구사항 59건(REQ-FUNC 27 · REQ-NF 32)을 **어떻게 실현하는지**를 설계 관점으로 기술한다. 유스케이스·클래스·컴포넌트·시퀀스·상태 전이·논리 흐름 도식으로 구성한다.

### 1.2 SRS와의 경계

ISO/IEC/IEEE 29148:2018 **§9.6.10**은 요구사항에 설계 해법을 넣으면 "다른 설계 대안이 검토되지 못하고 배제될 위험"이 생긴다고 경고하고, **§5.2.5 Appropriate**는 "아키텍처·설계에 불필요한 제약을 두지 말라"고 규정한다. 따라서 두 문서의 역할을 아래와 같이 갈랐다.

| | SRS | 본 문서 (SDD) |
| --- | --- | --- |
| 답하는 질문 | **무엇을** 만족해야 하는가 | **어떻게** 실현하는가 |
| 도식 수준 | 블랙박스 — 외부에서 관찰 가능한 것 | 화이트박스 — 내부 구조와 호출 |
| 담는 도식 | 유스케이스 개요 · 여정 흐름 · 요구사항 의존성 · 상태 전이 · 블랙박스 시퀀스 · 엔터티 관계 | 유스케이스 상세 · 도메인/계층 클래스 · 물리 ERD · 컴포넌트 · 배포 · 내부 시퀀스 · 논리 흐름 |
| 변경 권한 | 기획 매니저 (PM) | 개발팀 리드 |

**같은 도식을 두 문서에 두지 않는다.** 중복은 한쪽만 갱신되는 순간 어긋나기 때문이다. 상태 전이도는 SRS 8.2(데이터 수명주기가 요구사항이므로), 클래스·컴포넌트 내부는 본 문서가 단일 원천이다.

### 1.3 도식 목록

| # | 도식 | 유형 | 절 |
| --- | --- | --- | --- |
| 1 | 유스케이스 — 수요 측 | flowchart | 2.1 |
| 2 | 유스케이스 — 공급 측 | flowchart | 2.2 |
| 3 | 도메인 클래스 (CLD) | classDiagram | 3.1 |
| 4 | 서비스 계층 클래스 | classDiagram | 3.2 |
| 5 | 물리 ERD | erDiagram | 3.3 |
| 6 | 컴포넌트 구조 | flowchart | 4.1 |
| 7 | 배포 구조 | flowchart | 4.2 |
| 8 | 시퀀스 — 조건 질의 → Top-3 | sequenceDiagram | 5.1 |
| 9 | 시퀀스 — 파싱 실패 → 폴백 | sequenceDiagram | 5.2 |
| 10 | 시퀀스 — 공유 카드 생성 | sequenceDiagram | 5.3 |
| 11 | 시퀀스 — 에이전트 소환 → 제안 수집 | sequenceDiagram | 5.4 |
| 12 | 시퀀스 — 제안 선택 → 예약 → 결제 | sequenceDiagram | 5.5 |
| 13 | 시퀀스 — 노쇼 판정 → 정산 | sequenceDiagram | 5.6 |
| 14 | 시퀀스 — 조건 불일치 신고 → 재확인 | sequenceDiagram | 5.7 |
| 15 | 논리 흐름 — 근거 4항목 검증 게이트 | flowchart | 6.1 |
| 16 | 논리 흐름 — 예산·조건 필터 판정 | flowchart | 6.2 |
| 17 | 논리 흐름 — KPI 집계 파이프라인 | flowchart | 6.3 |

---

## 2. 유스케이스

> **읽는 방법** — 타원이 유스케이스(시스템이 이용자에게 제공하는 하나의 완결된 가치), 사각형이 액터(시스템을 쓰는 사람 또는 외부 시스템)다. 점선 `<<include>>`는 "항상 포함", `<<extend>>`는 "조건이 맞을 때만 확장"을 뜻한다.

### 2.1 유스케이스 — 수요 측

```mermaid
flowchart LR
    C2["이용자<br/>예산 우선 (C2)"]
    C3["이용자<br/>메뉴 우선 (C3)"]
    C4["이용자<br/>사전 판단 (C4)"]
    C1["이용자<br/>근거 요구 (C1·N1)"]
    A2["이용자<br/>단체 총무 (A2)"]

    subgraph SYS["AI Place Mate"]
        UC01(("UC-01<br/>조건으로 후보 찾기"))
        UC02(("UC-02<br/>예산 안에서 걸러내기"))
        UC03(("UC-03<br/>메뉴명으로 찾기"))
        UC04(("UC-04<br/>근거 확인하기"))
        UC05(("UC-05<br/>선택 근거 공유하기"))
        UC06(("UC-06<br/>조건 불일치 신고하기"))
        UC07(("UC-07<br/>제안 받기"))
        UC08(("UC-08<br/>예약·결제하기"))
    end

    PG["외부 시스템<br/>PG"]

    C2 --> UC01
    C2 --> UC02
    C3 --> UC03
    C4 --> UC04
    C4 --> UC06
    C1 --> UC04
    C1 --> UC05
    A2 --> UC07
    A2 --> UC08

    UC02 -. include .-> UC01
    UC03 -. include .-> UC01
    UC04 -. include .-> UC01
    UC05 -. extend .-> UC04
    UC08 -. include .-> UC07
    UC08 --> PG
```

### 2.2 유스케이스 — 공급 측

```mermaid
flowchart LR
    P5["매장 사장 (P5)"]
    OP["서비스 운영자"]

    subgraph SYS["AI Place Mate"]
        UC09(("UC-09<br/>매장 프로필 등록·갱신"))
        UC10(("UC-10<br/>소환 받고 제안 제출"))
        UC11(("UC-11<br/>제안 품질 심사"))
        UC12(("UC-12<br/>불이행 신고 처리"))
    end

    P5 --> UC09
    P5 --> UC10
    OP --> UC11
    OP --> UC12

    UC10 -. include .-> UC09
    UC11 -. extend .-> UC10
    UC12 -. extend .-> UC10
```

### 2.3 유스케이스 명세

| ID | 유스케이스 | 주 액터 | 사전 조건 | 주 흐름 | 대안·예외 흐름 | 사후 조건 | 요구사항 |
| --- | --- | --- | --- | --- | --- | --- | --- |
| **UC-01** | 조건으로 후보 찾기 | 이용자 | 상권 데이터 적재 완료 | 조건 입력 → 파싱 → 색인 질의 → 근거 검증 → Top-3 반환 | 파싱 실패 시 폴백 필터 (5.2) | Top-3가 렌더되고 `top3_render` 기록 | REQ-FUNC-001 · 008 · 009 · 014 |
| **UC-02** | 예산 안에서 걸러내기 | 이용자 (C2) | 인당 예산 상한 입력 | 상한 초과 매장 제외 → 인당가 범위 표기 → 초과 건수 요약 | 결제액 입력 시 편차를 다음 표기에 반영 | 모든 카드에 범위가 표기됨 | REQ-FUNC-002 · 003 · 005 |
| **UC-03** | 메뉴명으로 찾기 | 이용자 (C3) | 메뉴 색인에 `canonicalKey` 등재 | 메뉴명 1건 입력 → 취급 매장 Top-3 반환 | 미등재 시 유사 메뉴 3건 이상이면 대체 사실 명시 후 반환 | 업종 목록이 아닌 매장이 반환됨 | REQ-FUNC-006 · 007 |
| **UC-04** | 근거 확인하기 | 이용자 (C4·C1·N1) | Top-3 렌더됨 | 카드별 선정 이유·근거 속성·확인 일자·확인 주체 확인 | 90일 초과 속성은 경고 병기 | 근거 4항목이 노출됨 | REQ-FUNC-010 · 011 |
| **UC-05** | 선택 근거 공유하기 | 이용자 (C1) | 후보 1건 선택 | 공유 요청 → 카드 생성 → 이미지·링크 반환 | 근거 4항목 누락 시 `400` | 외부로 공유 가능한 카드 생성 | REQ-FUNC-012 |
| **UC-06** | 조건 불일치 신고하기 | 이용자 (C4) | 방문 완료 | 신고 접수 → 확인 상태 `RECHECK_REQUIRED` 전이 → 재확인 큐 등록 | — | 60초 내 상태 반영 | REQ-FUNC-013 |
| **UC-07** | 제안 받기 | 이용자 (A2) | 가맹점 프로필 등록됨 | 카테고리·지역 지정 → 3~5곳 소환 → 대화방(180초) → 제안 수집 → 적합도 정렬 | 소환 0곳이면 미개시. 마감 시 0건이면 Top-3 회귀 | 제안이 적합도 순으로 제시됨 | REQ-FUNC-020 · 022~025 |
| **UC-08** | 예약·결제하기 | 이용자 (A2·C2) | 제안 1건 선택 | 조건 승계 → 예약 생성 → 주문량 산출 → 결제 승인 → 매장 통보 | 2시간 전 취소는 전액 환불 | 예약이 `CONFIRMED`, 결제가 `AUTHORIZED` | REQ-FUNC-015~018 |
| **UC-09** | 매장 프로필 등록·갱신 | 매장 사장 (P5) | 가맹 온보딩 완료 | 분위기·강점·서비스·수용 조건 등록 → 1회 클릭으로 수정 | 근거 없는 강점 문구는 저장 거부 | 프로필이 소환 매칭에 반영됨 | REQ-FUNC-019 · 021 · 027 |
| **UC-10** | 소환 받고 제안 제출 | 매장 사장 (P5) | 수용 조건 충족 | 소환 알림 → 조건 확인 → 제안 제출 | 수용 조건 밖이면 소환되지 않음. 마감 후 제출은 거부 | 제안이 대화방에 등록됨 | REQ-FUNC-020 · 023 |
| **UC-11** | 제안 품질 심사 | 서비스 운영자 | 제안 등록됨 | 규칙 위반 자동 탐지 → 예외만 사람이 심사 | 가맹점 150곳당 1 FTE 상한 초과 시 온보딩 속도 조절 | 근거 없는 문구 0건 유지 | REQ-FUNC-021 · REQ-NF-022 |
| **UC-12** | 불이행 신고 처리 | 서비스 운영자 | 이용자 신고 접수 | 신고 확인 → 불이행 기록 → 소환 가중치 하향 | 48시간 내 처리 | 이행률 지표에 반영됨 | REQ-FUNC-026 |

---

## 3. 정적 구조

### 3.1 도메인 클래스 다이어그램 (CLD)

> **CLD** = Class Diagram(클래스 다이어그램). 시스템 사고의 Causal Loop Diagram과 약어가 겹치므로, 본 문서에서 CLD는 항상 UML 클래스 다이어그램을 뜻한다.
>
> **읽는 방법** — 사각형이 클래스(같은 성질의 데이터와 동작을 묶은 단위). 선 위의 숫자는 **다중도**로, `1` 대 `0..*`은 "하나가 여러 개를 가질 수 있고 없어도 된다"는 뜻이다. `◆`(composition)는 부모가 사라지면 자식도 사라지는 관계다.

```mermaid
classDiagram
    direction TB

    class Place {
        +UUID id
        +String name
        +Geo location
        +int seats
        +int maxParty
        +boolean acceptsParty(int size)
    }
    class Dish {
        +UUID id
        +String name
        +String canonicalKey
        +int price
    }
    class PriceProfile {
        +int perPersonLow
        +int perPersonAvg
        +int perPersonHigh
        +String conditionTags
        +boolean withinBudget(int cap)
        +int deviationFrom(int actual)
    }
    class Attribute {
        +String key
        +String value
        +AttributeScope scope
    }
    class Verification {
        +VerificationStatus status
        +LocalDate verifiedAt
        +VerifiedBy verifiedBy
        +String sourceUrl
        +boolean isStale()
        +void markRecheck()
    }
    class Candidate {
        +UUID placeId
        +String reason
        +boolean evidenceComplete()
    }
    class AgentRoom {
        +UUID id
        +Json conditions
        +int agentCount
        +Instant expiresAt
        +AgentRoomStatus status
        +boolean isOpen()
    }
    class Proposal {
        +String headline
        +Json highlights
        +Json services
        +Instant submittedAt
        +boolean groundedIn(Attribute[] a)
    }
    class Reservation {
        +UUID id
        +ReservationStatus status
        +int partySize
        +Instant reservedAt
    }
    class Payment {
        +int orderAmount
        +PaymentStatus status
    }

    Place "1" *-- "0..*" Dish : serves
    Place "1" *-- "1" PriceProfile : has
    Place "1" --> "0..*" Attribute : has
    Dish "1" --> "0..*" Attribute : has
    Attribute "1" --> "1" Verification : verified by
    PriceProfile "1" --> "1" Verification : verified by
    Place "1" --> "0..*" Candidate : rendered as
    Place "1" --> "0..*" Proposal : offers
    AgentRoom "1" *-- "0..*" Proposal : receives
    Proposal "1" --> "0..1" Reservation : selected as
    Reservation "1" --> "0..1" Payment : settled by
```

**설계 판단 3건**

| 판단 | 근거 |
| --- | --- |
| `Verification`을 독립 클래스로 분리 | 속성마다 확인 정보를 인라인으로 두면 REQ-FUNC-010(근거 4항목)의 검증을 속성 개수만큼 반복해야 한다 (ADR-002) |
| `Candidate`를 별도 클래스로 도입 | `Place`는 마스터 데이터이고 `Candidate`는 특정 질의에 대한 응답 단위다. `evidenceComplete()`가 질의 시점에 평가되어야 하므로 분리했다 |
| `PriceProfile`에 판정 메서드를 둠 | `withinBudget()`·`deviationFrom()`을 데이터와 같은 곳에 두어 REQ-FUNC-003·005의 판정 로직이 흩어지지 않게 했다 |

### 3.2 서비스 계층 클래스 다이어그램

> **읽는 방법** — `<<interface>>`는 구현을 갖지 않는 계약이다. 점선 화살표는 "이 인터페이스를 구현한다", 실선 화살표는 "이것을 사용한다"를 뜻한다.

```mermaid
classDiagram
    direction LR

    class QueryController {
        +query(QueryRequest) Top3Response
    }
    class ConditionParser {
        <<interface>>
        +parse(String) ParsedCondition
    }
    class NlConditionParser {
        +parse(String) ParsedCondition
    }
    class StructuredFallback {
        +parse(String) ParsedCondition
    }
    class CandidateSelector {
        +select(ParsedCondition) Candidate[]
        -filterByBudget()
        -filterByAttribute()
    }
    class EvidenceGate {
        +validate(Candidate) boolean
        +reject(Candidate) void
    }
    class RelevanceRanker {
        +rank(Candidate[]) Candidate[]
    }
    class IndexRepository {
        <<interface>>
        +findByCanonicalKey(String) Dish[]
        +findAttributes(UUID) Attribute[]
    }
    class VerificationService {
        +evaluate(Attribute) VerificationStatus
        +markRecheck(UUID) void
    }
    class ShareCardService {
        +create(UUID, Summary) CardRef
    }
    class TrackingPublisher {
        <<interface>>
        +publish(Event) void
    }

    QueryController --> ConditionParser
    QueryController --> CandidateSelector
    QueryController --> TrackingPublisher
    ConditionParser <|.. NlConditionParser
    ConditionParser <|.. StructuredFallback
    NlConditionParser ..> StructuredFallback : 실패 시 위임
    CandidateSelector --> IndexRepository
    CandidateSelector --> EvidenceGate
    CandidateSelector --> RelevanceRanker
    EvidenceGate --> VerificationService
    ShareCardService --> EvidenceGate
```

**핵심 설계 결정** — `EvidenceGate`를 `RelevanceRanker`보다 **앞에** 배치했다. 근거 없는 후보가 정렬 대상에 들어가면 REQ-FUNC-014("근거 4항목이 없는 후보는 반환하지 않는다")를 정렬 이후 필터로 지키게 되어, 후보가 3개 미만으로 떨어지는 경로가 생긴다. 게이트를 먼저 통과시키면 정렬은 항상 유효 후보만 다룬다.

`NlConditionParser`가 실패 시 `StructuredFallback`에 위임하는 구조는 REQ-FUNC-009의 폴백을 예외 처리가 아니라 **정상 경로의 분기**로 구현한다 — 빈 화면이 반환될 수 있는 코드 경로 자체를 없애기 위한 선택이다.

### 3.3 물리 ERD

> **읽는 방법** — `PK`는 기본키(행을 유일하게 식별), `FK`는 외래키(다른 표를 가리킴), `UK`는 유일 제약, `IDX`는 인덱스다. `||--o{`는 "왼쪽 1개 : 오른쪽 0개 이상"을 뜻한다.

```mermaid
erDiagram
    PLACES ||--o{ DISHES : ""
    PLACES ||--|| PRICE_PROFILES : ""
    PLACES ||--o{ ATTRIBUTES : ""
    DISHES ||--o{ ATTRIBUTES : ""
    ATTRIBUTES ||--|| VERIFICATIONS : ""
    PRICE_PROFILES ||--|| VERIFICATIONS : ""
    AGENT_ROOMS ||--o{ PROPOSALS : ""
    PLACES ||--o{ PROPOSALS : ""
    PROPOSALS ||--o| RESERVATIONS : ""
    RESERVATIONS ||--o| PAYMENTS : ""
    PLACES ||--o{ TRACKING_EVENTS : ""

    PLACES {
        uuid id PK
        string name
        geography location IDX
        int seats
        int max_party
        string district_code IDX
        timestamp deleted_at
    }
    DISHES {
        uuid id PK
        uuid place_id FK
        string name
        string canonical_key IDX
        int price
    }
    PRICE_PROFILES {
        uuid id PK
        uuid place_id FK
        int per_person_low
        int per_person_avg
        int per_person_high
        string condition_tags
        uuid verification_id FK
    }
    ATTRIBUTES {
        uuid id PK
        uuid place_id FK
        uuid dish_id FK
        string attr_key IDX
        string attr_value
        string scope
        uuid verification_id FK
    }
    VERIFICATIONS {
        uuid id PK
        string status IDX
        date verified_at IDX
        string verified_by
        string source_url
    }
    AGENT_ROOMS {
        uuid id PK
        json conditions
        int agent_count
        timestamp expires_at IDX
        string status
    }
    PROPOSALS {
        uuid id PK
        uuid room_id FK
        uuid place_id FK
        string headline
        json highlights
        json services
        timestamp submitted_at
    }
    RESERVATIONS {
        uuid id PK
        uuid proposal_id FK UK
        string status IDX
        int party_size
        timestamp reserved_at IDX
    }
    PAYMENTS {
        uuid id PK
        uuid reservation_id FK UK
        int order_amount
        string status
        string pg_token
    }
    TRACKING_EVENTS {
        bigint id PK
        string event_name IDX
        uuid session_id IDX
        uuid anon_user_id IDX
        uuid place_id FK
        json payload
        timestamp occurred_at IDX
        int schema_version
    }
```

**물리 설계 결정 5건**

| 결정 | 근거 |
| --- | --- |
| `dishes.canonical_key`에 인덱스 | REQ-FUNC-006의 메뉴명 질의가 최고 빈도 경로이며 p95 ≤ 400ms를 만족해야 한다 (SRS 8.6.2) |
| `verifications.verified_at`에 인덱스 | REQ-NF-011의 "90일 초과 속성 비율" 주간 집계와 재확인 큐 조회가 날짜 범위 스캔이다 |
| `places.district_code` 컬럼 도입 | 배포 단위가 상권이므로(SRS 3.1.6) 상권별 커버리지 집계와 적재 관리에 필요하다 |
| `reservations.proposal_id`에 유일 제약 | 하나의 제안이 두 예약을 만들 수 없다 (SRS 8.6.3 예약-제안 연결) |
| `tracking_events`를 `occurred_at` 파티셔닝 | 대량 append 패턴이며 KPI 집계가 시간 범위 질의다 (SRS 6.1.2) |
| `deleted_at` 컬럼 (논리 삭제) | 확인 상태 이력을 보존해야 한다 (SRS 8.3 규칙 12, 8.6.5) |

---

## 4. 컴포넌트 구조

### 4.1 컴포넌트 다이어그램

> **읽는 방법** — 큰 상자가 컴포넌트(독립 배포 단위), 그 안의 `[ ]`가 제공 인터페이스(다른 컴포넌트가 호출할 수 있는 창구)다. 화살표는 호출 방향이며, 점선은 이벤트 발행(호출한 쪽이 응답을 기다리지 않음)이다.

```mermaid
flowchart TB
    subgraph CLIENT["클라이언트"]
        WEB["모바일 웹 / 네이버 지도 탭"]
        CONSOLE["매장 에이전트 콘솔"]
    end

    GW["API Gateway<br/>[인증] [라우팅] [SLO 계측]"]

    subgraph CORE["탐색 도메인"]
        SCH["Search Service<br/>[query] [rank]"]
        IDX["Index Service<br/>[findByCanonicalKey] [findAttributes]"]
        EVD["Evidence Service<br/>[validateEvidence] [createShareCard] [markRecheck]"]
    end

    subgraph SUPPLY["공급 도메인"]
        ARM["Agent Room Service<br/>[openRoom] [collectProposal] [rankProposal]"]
        MCS["Merchant Console Service<br/>[upsertProfile] [matchCapacity] [guardWording]"]
    end

    subgraph EXEC["실행 도메인"]
        RSV["Reservation Service<br/>[createReservation] [judgeNoShow]"]
        PAY["Payment Service<br/>[authorize] [refund] [settle]"]
    end

    TRK["Tracking Service<br/>[publish] [aggregate]"]
    DB[("PostgreSQL")]
    CACHE[("Cache<br/>TTL 6h")]
    PG_EXT["PG (외부)"]
    LLM["추론 서비스 (외부)"]

    WEB --> GW
    CONSOLE --> GW
    GW --> SCH
    GW --> EVD
    GW --> ARM
    GW --> MCS
    GW --> RSV

    SCH --> IDX
    SCH --> EVD
    SCH --> LLM
    EVD --> IDX
    EVD --> LLM
    ARM --> MCS
    ARM --> EVD
    RSV --> PAY
    PAY --> PG_EXT

    IDX --> CACHE
    IDX --> DB
    EVD --> DB
    ARM --> DB
    RSV --> DB
    PAY --> DB

    SCH -. 이벤트 .-> TRK
    EVD -. 이벤트 .-> TRK
    ARM -. 이벤트 .-> TRK
    RSV -. 이벤트 .-> TRK
    MCS -. 이벤트 .-> TRK
    TRK --> DB
```

**컴포넌트 경계 판단**

| 판단 | 근거 |
| --- | --- |
| `Search`와 `Index`를 분리 | 색인은 읽기 편중·캐시 대상이고 질의 조합은 계산 로직이다. 스케일 특성이 달라 REQ-NF-005(3,000 RPS)를 각각 조정해야 한다 |
| `Evidence`를 `Search`에서 분리 | 근거 검증(REQ-FUNC-010)이 탐색과 제안(REQ-FUNC-024) 양쪽에서 재사용된다 |
| `Reservation`과 `Payment`를 분리 | 결제는 PCI-DSS 범위(REQ-NF-016)이며 오류율 임계가 다르다 (REQ-NF-008: 0.1% vs 0.3%) |
| `Tracking`을 이벤트 수신으로만 결합 | KPI 집계 장애가 이용자 경로를 막지 않아야 한다. 발행측은 응답을 기다리지 않는다 |

### 4.2 배포 구조

```mermaid
flowchart TB
    subgraph EDGE["엣지"]
        CDN["CDN<br/>정적 자산"]
        LB["로드 밸런서<br/>TLS 1.3 종료"]
    end

    subgraph APP["애플리케이션 (수평 확장)"]
        GWN["API Gateway × N"]
        SVC["도메인 서비스 × N<br/>Search · Index · Evidence · AgentRoom · Console · Reservation · Payment"]
        WRK["배치 워커<br/>KPI 집계 · 재확인 큐 · 노쇼 판정"]
    end

    subgraph DATA["데이터"]
        PRIMARY[("Primary DB")]
        REPLICA[("Read Replica")]
        REDIS[("Cache")]
        BACKUP[("백업<br/>RPO 5분")]
    end

    subgraph OBS["관측"]
        APM["APM 트레이스"]
        LOGS["감사 로그"]
        DASH["KPI 대시보드"]
    end

    CDN --> LB
    LB --> GWN
    GWN --> SVC
    SVC --> REDIS
    SVC --> PRIMARY
    SVC --> REPLICA
    WRK --> PRIMARY
    PRIMARY --> REPLICA
    PRIMARY --> BACKUP
    SVC --> APM
    SVC --> LOGS
    WRK --> DASH
```

| 배치 결정 | 대응 요구사항 |
| --- | --- |
| TLS 1.3을 로드 밸런서에서 종료 | REQ-NF-026 |
| 읽기 복제본 분리 | REQ-NF-001·002 응답 목표를 읽기 부하와 분리해 확보 |
| 백업 주기를 RPO 5분에 맞춤 | REQ-NF-027 |
| 이중화 및 헬스체크 5분 간격 | REQ-NF-007 (가용성 99.5%) |
| 감사 로그를 별도 저장소로 | REQ-NF-025 (전량 감사 로그, 누락 1건도 알림) |
| 배치 워커를 서비스와 분리 | KPI 집계·노쇼 판정이 이용자 요청 경로의 지연에 영향을 주지 않게 |

---

## 5. 동적 흐름 — 시퀀스

> **읽는 방법** — 세로선은 참여자의 생존 기간, 가로 화살표는 메시지다. 실선 `->>`은 호출, 점선 `-->>`은 응답이다. `alt`는 조건 분기, `opt`는 선택적 수행, `loop`는 반복을 뜻한다.

### 5.1 조건 질의 → Top-3 (정상 경로 · UC-01)

```mermaid
sequenceDiagram
    autonumber
    actor U as 이용자
    participant GW as API Gateway
    participant SCH as Search Service
    participant LLM as 추론 서비스
    participant IDX as Index Service
    participant CA as Cache
    participant EVD as Evidence Service
    participant TRK as Tracking

    U->>GW: POST /v1/query (자연어 1줄 · 지역 · 인원)
    GW->>TRK: query_submit
    GW->>SCH: 질의 전달
    SCH->>LLM: 조건 파싱 요청
    LLM-->>SCH: ParsedCondition (성공)
    SCH->>TRK: parse_result (success=true)

    SCH->>IDX: findByCanonicalKey / findAttributes
    IDX->>CA: 캐시 조회
    alt 캐시 히트
        CA-->>IDX: Dish · Attribute (≤120ms)
    else 캐시 미스
        IDX->>IDX: DB 조회 후 캐시 적재 (≤400ms)
    end
    IDX-->>SCH: 후보 모집단

    SCH->>SCH: 예산·조건 필터 (6.2)
    SCH->>EVD: validateEvidence(후보 목록)
    EVD-->>SCH: 근거 4항목 완비 후보만 반환
    Note over SCH,EVD: 게이트가 정렬보다 앞 — 근거 없는 후보는<br/>정렬 대상에 들어가지 않는다

    SCH->>SCH: 적합도 정렬 → 상위 3건
    SCH->>LLM: 선정 이유 문장 생성
    LLM-->>SCH: 근거 문장 3건
    SCH-->>GW: Top-3 (근거 4항목 포함)
    GW->>TRK: top3_render (candidate_ids · evidence_complete · latency_ms)
    GW-->>U: 200 OK · p95 ≤ 1,000ms
```

### 5.2 파싱 실패 → 폴백 (대안 경로 · REQ-FUNC-009)

```mermaid
sequenceDiagram
    autonumber
    actor U as 이용자
    participant GW as API Gateway
    participant SCH as Search Service
    participant LLM as 추론 서비스
    participant FB as StructuredFallback
    participant TRK as Tracking

    U->>GW: POST /v1/query (모호한 자연어)
    GW->>SCH: 질의 전달
    SCH->>LLM: 조건 파싱 요청
    LLM-->>SCH: 파싱 실패
    SCH->>TRK: parse_result (success=false, fallback_used=true)

    SCH->>FB: 구조화 조건으로 위임
    FB-->>SCH: 부분 조건 (지역 · 카테고리)
    Note over SCH,FB: 예외가 아니라 정상 경로의 분기다.<br/>빈 화면을 반환하는 코드 경로가 없다

    SCH->>SCH: 부분 조건으로 후보 선별 → 근거 검증 → 정렬
    SCH-->>GW: Top-3 + 폴백 고지 플래그
    GW-->>U: 200 OK · 구조화 필터 UI + Top-3

    Note over TRK: 파싱 실패율 5분 윈도 > 3% 이면<br/>PagerDuty 알림 + 파서 롤백 (SRS 6.3)
```

### 5.3 공유 카드 생성 (UC-05)

```mermaid
sequenceDiagram
    autonumber
    actor U as 이용자
    participant GW as API Gateway
    participant EVD as Evidence Service
    participant IDX as Index Service
    participant LLM as 추론 서비스
    participant ST as 오브젝트 스토리지
    participant TRK as Tracking

    U->>GW: POST /v1/share-cards (후보 id · 조건 요약)
    GW->>EVD: 카드 생성 요청
    EVD->>IDX: 근거 속성 · Verification 조회
    IDX-->>EVD: 속성 + 확인 일자 · 확인 주체

    alt 근거 4항목 완비
        EVD->>LLM: 선정 이유 1줄 생성
        LLM-->>EVD: 근거 문장
        EVD->>ST: 이미지 렌더 후 저장
        ST-->>EVD: 이미지 URL
        EVD-->>GW: 이미지 URL + 딥링크
        GW->>TRK: share_card_create (latency_ms)
        GW-->>U: 201 Created · p95 ≤ 3,000ms
    else 근거 항목 누락
        EVD-->>GW: 검증 실패
        GW-->>U: 400 Bad Request
        Note over TRK: 근거 표기 누락은 1건 발생 시<br/>즉시 알림 (SRS 6.3)
    end
```

### 5.4 에이전트 소환 → 제안 수집 (UC-07 · UC-10)

```mermaid
sequenceDiagram
    autonumber
    actor U as 이용자
    participant GW as API Gateway
    participant ARM as Agent Room Service
    participant MCS as Merchant Console
    actor P5 as 매장 사장
    participant EVD as Evidence Service
    participant TRK as Tracking

    U->>GW: POST /v1/agent-rooms (카테고리 · 지역 · 조건 ≥2)
    GW->>ARM: 대화방 개시 요청
    ARM->>MCS: matchCapacity (수용 조건 매칭)
    MCS-->>ARM: 적합 매장 목록

    alt 적합 매장 3~5곳
        ARM->>ARM: 대화방 생성 · expiresAt = now + 180s
        ARM-->>GW: room_id · 소환 매장 수
        GW->>TRK: room_create (summoned_count)
        GW-->>U: 201 Created · 카운트다운 노출

        loop 마감 180초 이내
            ARM->>P5: 소환 알림
            P5->>MCS: POST /v1/proposals (headline · highlights)
            MCS->>EVD: guardWording — 등록 속성 참조 검증
            alt 근거 있음
                EVD-->>MCS: 통과
                MCS->>ARM: 제안 등록
                ARM->>TRK: proposal_receive (elapsed_ms)
            else 근거 없음
                EVD-->>MCS: 거부
                MCS-->>P5: 400 · 속성 등록 안내
            end
        end

        ARM->>ARM: 마감 · 적합도 1순위 정렬 (가격은 정렬 키 아님)
        alt 유효 제안 ≥ 1건
            ARM-->>U: 제안 목록 (근거 표기 100%)
        else 유효 제안 0건
            ARM-->>U: 제안 없는 Top-3로 회귀 + 사실 고지
            Note over U,ARM: 빈 제안 화면 노출 0건 (REQ-FUNC-025)
        end
    else 적합 매장 0~2곳
        ARM-->>GW: 미개시
        GW-->>U: 대화방을 열지 않고 사유 고지
    end
```

### 5.5 제안 선택 → 예약 → 결제 (UC-08)

```mermaid
sequenceDiagram
    autonumber
    actor U as 이용자
    participant GW as API Gateway
    participant ARM as Agent Room Service
    participant RSV as Reservation Service
    participant PAY as Payment Service
    participant PGX as PG (외부)
    participant MCS as Merchant Console
    participant TRK as Tracking

    U->>GW: 제안 선택
    GW->>ARM: proposal_select
    ARM-->>RSV: 제안 조건 승계 (인원 · 메뉴 구성 · 시간)
    Note over ARM,RSV: 재입력 필드 0개 · 승계 누락률 ≤ 0.5%

    RSV->>RSV: Reservation 생성 (status=CONFIRMED)
    RSV->>PAY: 결제 요청 (주문량 기준 금액)
    PAY->>PAY: orderAmount = 메뉴 구성 × 주문량
    PAY->>PGX: 승인 요청 (거래 토큰)

    alt 승인 성공
        PGX-->>PAY: 승인 (오류율 ≤ 0.1%)
        PAY->>PAY: status=AUTHORIZED
        PAY-->>RSV: 결제 확정
        RSV->>MCS: 매장 확정 통보 (≤ 30s)
        RSV->>TRK: 예약 생성 이벤트
        RSV-->>U: 예약 확정
    else 승인 실패
        PGX-->>PAY: 거절
        PAY-->>RSV: 결제 실패
        RSV->>RSV: 예약을 확정하지 않음
        RSV-->>U: 실패 고지
    end

    opt 예약 2시간 전 취소
        U->>RSV: 취소 요청
        RSV->>PAY: 환불 요청
        PAY->>PGX: 전액 환불 (≤ 24h)
        PAY->>PAY: status=REFUNDED
        RSV->>RSV: status=CANCELLED
        RSV->>MCS: 즉시 알림
    end
```

### 5.6 노쇼 판정 → 정산 (REQ-FUNC-018)

```mermaid
sequenceDiagram
    autonumber
    participant WRK as 배치 워커
    participant RSV as Reservation Service
    participant PAY as Payment Service
    participant PGX as PG (외부)
    participant MCS as Merchant Console
    participant TRK as Tracking

    WRK->>RSV: 예약 시각 경과 건 조회
    RSV->>RSV: 방문 확인 존재 여부 판정

    alt 방문 확인 있음
        RSV->>RSV: status=VISITED
        RSV->>TRK: visit_confirm
    else 방문 확인 없음
        RSV->>RSV: status=NO_SHOW
        RSV->>TRK: no_show_mark
        RSV->>PAY: 정산 요청
        PAY->>PGX: 매장 정산
        PAY->>PAY: status=SETTLED
        PAY->>MCS: 정산 통보
        Note over RSV,PAY: 오판정률 ≤ 1% — 방문 확인 신호가<br/>지연될 수 있어 판정 유예 시간을 둔다
    end

    Note over TRK: 노쇼율 주간 > 8% 이면 REQ-FUNC-019~026<br/>신규 노출 중단 (SRS 6.3)
```

### 5.7 조건 불일치 신고 → 재확인 (UC-06)

```mermaid
sequenceDiagram
    autonumber
    actor U as 이용자
    participant GW as API Gateway
    participant EVD as Evidence Service
    participant IDX as Index Service
    actor OP as 서비스 운영자
    participant TRK as Tracking

    U->>GW: 조건 불일치 신고 (attribute_key)
    GW->>EVD: 신고 접수
    EVD->>IDX: 해당 Attribute의 Verification 조회
    IDX-->>EVD: 현재 상태 (VERIFIED 또는 STALE)
    EVD->>EVD: status → RECHECK_REQUIRED
    Note over EVD: 데이터를 삭제하지 않는다.<br/>상태만 전이해 이력을 보존 (SRS 8.3 규칙 12)
    EVD->>IDX: 재확인 큐 등록
    EVD-->>GW: 반영 완료 (≤ 60s)
    GW->>TRK: mismatch_report
    GW-->>U: 접수 확인

    OP->>IDX: 재확인 큐 처리
    IDX->>IDX: 실사 후 verified_at 갱신 · status=VERIFIED
```

---

## 6. 논리 흐름

### 6.1 근거 4항목 검증 게이트

REQ-FUNC-010·014의 "근거 없는 후보는 반환하지 않는다"를 어디서 어떻게 판정하는지 밝힌다.

```mermaid
flowchart TD
    START(["후보 모집단"]) --> LOOP{"후보 남았는가"}
    LOOP -->|아니오| COUNT{"통과 후보 ≥ 3"}
    LOOP -->|예| R1{"선정 이유 1줄<br/>존재"}
    R1 -->|없음| DROP["후보 제외"]
    R1 -->|있음| R2{"근거 속성<br/>존재"}
    R2 -->|없음| DROP
    R2 -->|있음| R3{"확인 일자<br/>존재"}
    R3 -->|없음| DROP
    R3 -->|있음| R4{"확인 주체<br/>존재"}
    R4 -->|없음| DROP
    R4 -->|있음| AGE{"verified_at<br/>90일 초과"}
    AGE -->|초과| WARN["STALE 표시<br/>경고 문구 부착"]
    AGE -->|이내| PASS["통과 후보 목록에 추가"]
    WARN --> PASS
    PASS --> LOOP
    DROP --> ALERT["근거 표기 누락 이벤트<br/>1건 발생 시 알림"]
    ALERT --> LOOP

    COUNT -->|예| RANK["적합도 정렬 → 상위 3건"]
    COUNT -->|아니오| RELAX["조건 완화 후 모집단 재구성"]
    RELAX --> START
    RANK --> OUT(["Top-3 반환"])

    style DROP fill:#f8d7da,stroke:#c0392b,color:#000
    style WARN fill:#fdebd0,stroke:#b9770e,color:#000
    style OUT fill:#d6eaf8,stroke:#2471a3,color:#000
```

**핵심** — `STALE`은 제외 사유가 **아니다.** 90일 초과 속성은 경고를 붙여 노출한다. 판정을 시스템이 하지 않고 재료만 제공하는 원칙(SRS 8.3 규칙 3) 때문이다. 제외 사유는 4항목 중 하나라도 없는 경우뿐이다.

### 6.2 예산·조건 필터 판정

```mermaid
flowchart TD
    IN(["후보 + 파싱된 조건"]) --> BUD{"예산 상한<br/>입력됨"}
    BUD -->|아니오| ATTR
    BUD -->|예| CMP{"perPersonHigh<br/>≤ 예산 상한"}
    CMP -->|초과| EXC["기본 결과에서 제외<br/>초과 N곳으로 요약"]
    CMP -->|이내| WIDTH{"범위 폭<br/>≤ ±20%"}
    WIDTH -->|초과| NARROW["추정 재계산<br/>또는 표기 보류"]
    WIDTH -->|이내| ATTR
    NARROW --> ATTR

    ATTR{"운영 조건<br/>입력됨"} -->|아니오| DISH
    ATTR -->|예| DICT{"조건 카테고리<br/>사전에 등재"}
    DICT -->|미등재| SOFT["필터로 쓰지 않고<br/>정렬 가중치로만 반영"]
    DICT -->|등재| HARD["해당 조건 만족 매장만 통과"]
    SOFT --> DISH
    HARD --> DISH

    DISH{"메뉴명<br/>입력됨"} -->|아니오| OUT
    DISH -->|예| CK{"canonical_key<br/>일치 존재"}
    CK -->|있음| MATCH["취급 매장으로 한정"]
    CK -->|없음| SIM{"유사 메뉴<br/>≥ 3건"}
    SIM -->|예| ALT["대체 사실 명시 후 반환"]
    SIM -->|아니오| EMPTY["빈 결과 — 시간당 2% 이하 유지"]
    MATCH --> OUT
    ALT --> OUT
    EMPTY --> OUT

    OUT(["근거 게이트로 전달 (6.1)"])

    style EXC fill:#f8d7da,stroke:#c0392b,color:#000
    style EMPTY fill:#f8d7da,stroke:#c0392b,color:#000
    style OUT fill:#d6eaf8,stroke:#2471a3,color:#000
```

**설계 판단** — 사전에 없는 조건은 **하드 필터로 쓰지 않는다.** 미등재 조건을 필터로 쓰면 빈 결과가 늘어 REQ-NF-010(빈 결과 ≤ 2%)을 깨뜨린다. 정렬 가중치로만 반영해 후보는 유지하고 순위로 표현한다.

### 6.3 KPI 집계 파이프라인

SRS 6.1의 계측 계획을 파이프라인으로 옮긴 것이다.

```mermaid
flowchart LR
    subgraph EMIT["발행"]
        SVC["도메인 서비스<br/>이벤트 22종"]
    end

    subgraph INGEST["수집"]
        Q["이벤트 큐"]
        VAL{"필수 속성<br/>완비"}
        RAW[("tracking_events<br/>occurred_at 파티션")]
        MISS["누락 카운터"]
    end

    subgraph CLEAN["정제"]
        BOT{"내부·봇<br/>트래픽"}
        SESS["세션 재구성<br/>30분 무활동 기준"]
        DEDUP["중복 제거<br/>session_id / anon_user_id / 도메인 ID"]
    end

    subgraph AGG["집계"]
        DAILY["일간 — 보조 2·4·8"]
        WEEKLY["주간 — 북극성 · 보조 1·3·7"]
        MONTHLY["월간 — 보조 5·6·9·10·11"]
    end

    subgraph PUB["공표"]
        GATE{"누락률<br/>≤ 5%"}
        SNAP[("kpi_weekly_snapshot")]
        HOLD["미공표<br/>사유 기록"]
        DASH["대시보드 · 6.3 알림"]
    end

    SVC -. 비동기 .-> Q
    Q --> VAL
    VAL -->|완비| RAW
    VAL -->|누락| MISS
    MISS --> GATE
    RAW --> BOT
    BOT -->|제외| MISS
    BOT -->|통과| SESS
    SESS --> DEDUP
    DEDUP --> DAILY
    DEDUP --> WEEKLY
    DEDUP --> MONTHLY
    DAILY --> GATE
    WEEKLY --> GATE
    MONTHLY --> GATE
    GATE -->|충족| SNAP
    GATE -->|초과| HOLD
    SNAP --> DASH

    style HOLD fill:#f8d7da,stroke:#c0392b,color:#000
    style DASH fill:#d6eaf8,stroke:#2471a3,color:#000
```

**핵심** — 이벤트 발행은 **비동기**다. 집계 파이프라인이 멈춰도 이용자 경로가 막히지 않는다. 대신 누락률 게이트를 두어, 5%를 넘으면 그 주 지표를 신뢰 구간 없이 공표하지 않는다 (SRS 6.1.3).

---

## 7. 추적성 — 설계 요소 ↔ 요구사항

| 설계 요소 | 절 | 실현하는 요구사항 |
| --- | --- | --- |
| `Index Service` · `dishes.canonical_key` 인덱스 | 4.1 · 3.3 | REQ-FUNC-001 · 006 · REQ-NF-002 · 020 |
| `PriceProfile.withinBudget()` · `deviationFrom()` | 3.1 | REQ-FUNC-002 · 003 · 005 |
| `NlConditionParser` → `StructuredFallback` 위임 | 3.2 · 5.2 | REQ-FUNC-009 · REQ-NF-009 |
| `EvidenceGate` (정렬 앞) · 근거 게이트 흐름 | 3.2 · 6.1 | REQ-FUNC-010 · 011 · 014 |
| `ShareCardService` · 오브젝트 스토리지 | 4.1 · 5.3 | REQ-FUNC-012 · REQ-NF-003 |
| `Verification` 상태 전이 · 재확인 큐 | 5.7 | REQ-FUNC-013 · REQ-NF-011 |
| `AgentRoom.expiresAt` · 마감 루프 | 3.1 · 5.4 | REQ-FUNC-022 · 023 · 025 · REQ-NF-004 |
| `Merchant Console.guardWording()` | 4.1 · 5.4 | REQ-FUNC-021 |
| `matchCapacity()` | 4.1 · 5.4 | REQ-FUNC-020 |
| 적합도 1순위 정렬 (가격 비정렬 키) | 5.4 | REQ-FUNC-024 |
| 조건 승계 → `Reservation` → `Payment` | 5.5 | REQ-FUNC-015 · 016 · 017 |
| 배치 워커 노쇼 판정 | 5.6 | REQ-FUNC-018 |
| 소환 가중치 하향 | 2.3 (UC-12) | REQ-FUNC-026 |
| 읽기 복제본 · 캐시 TTL 6h | 4.2 | REQ-NF-001 · 002 · 005 · 020 |
| LB TLS 1.3 종료 · 감사 로그 저장소 | 4.2 | REQ-NF-018 · 025 · 026 |
| 백업 주기 · 이중화 | 4.2 | REQ-NF-007 · 012 · 027 |
| `deleted_at` 논리 삭제 | 3.3 | REQ-NF-011 · SRS 8.6.5 |
| `places.district_code` | 3.3 | SRS 3.1.6 지역 적응 · R2 |
| 비동기 이벤트 발행 · 누락률 게이트 | 4.1 · 6.3 | SRS 6.1.2 · 6.1.3 |
| `tracking_events` 파티셔닝 | 3.3 | SRS 8.6.2 |

**미포함 요구사항** — REQ-NF-013 · 014 · 015 · 031 · 032(개인정보), REQ-NF-019 · 021 · 022 · 023(비용), REQ-NF-028 · 029 · 030(사용성)은 코드 구조가 아니라 **정책·운영·측정**으로 실현되므로 본 문서의 설계 대상이 아니다. 실현 방식은 SRS 4.4(표준·규제 준수)와 6.1(계측 계획)에 있다.

---

*작성자: 개발팀 리드, 검토자: 기획 매니저 (PM), 승인자: 개발팀 리드*
