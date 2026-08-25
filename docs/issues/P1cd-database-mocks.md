# P1c · P1d — 데이터베이스 5건 · 모킹 서버 4건

**Phase:** P1c (`[DB]` FR-001~011 → 5이슈) · P1d (`[Mock]` MOCK-001~004)
**템플릿:** `.github/ISSUE_TEMPLATE/feature_task.md`
**원장:** `TASKS-adtech-mvp-v1.0.md` EPIC A · EPIC M
**차단 안건:** `docs/W0-decision-agenda.md` D-04 → DB-002 (개인정보 보관·파기)

---

## 묶음 정책

원장의 `FR-001~011` 11건을 **5개 이슈로 묶었다.** 복잡도 `L`인 인접 태스크를 개별 이슈로 만들면
관리 비용이 산출 가치를 넘는다. 원장 ID는 유지하고 이슈 안에서 체크박스로 추적한다.

| 이슈 | 묶인 원장 태스크 | 근거 |
| --- | --- | --- |
| `DB-001` | FR-001, FR-002, FR-003, FR-004, FR-005 | 전부 §6.2 enum 정의 + 그 확장 패턴 |
| `DB-002` | FR-006 | Audience 도메인 2개 테이블 |
| `DB-003` | FR-007 | Campaign 도메인 3개 테이블 |
| `DB-004` | FR-008, FR-009 | 이벤트 원본 + 그 집계 뷰 — 함께 설계해야 함 |
| `DB-005` | FR-010, FR-011 | 소프트 삭제 컴포넌트 + 전 서비스 적용 |

## 공통 라벨

`db, backend, priority:high` — DB-002는 `blocked-d04` 추가 · MOCK은 `mock, backend, priority:high`

## 공통 DoD

템플릿 DoD 10개 항목에 `[DB]` 유형은 아래 3개를 추가로 적용한다.

- [ ] **마이그레이션 스크립트**가 작성되고 롤백 경로가 검증되었는가?
- [ ] 모든 테이블에 `deleted_at` 컬럼과 색인이 있는가? (DB-005 규칙 적용)
- [ ] 조회 패턴에 맞는 색인이 설계되고 실행 계획으로 확인되었는가?

---
---

# [DB] DB-001: Enum 타입 정의 11종 및 확장 패턴

**labels**: `db, backend, priority:high`
**원장 태스크**: FR-001 · FR-002 · FR-003 · FR-004 · FR-005

## 🎯 Summary
- **Task ID**: DB-001 (FR-001~005)
- **Epic (도메인)**: Foundation
- **기능명**: [DB-001] §6.2 데이터 모델 enum 11종 정의 및 확장 패턴 설계
- **목적**: 시스템의 모든 분류값을 타입으로 고정한다. **오타로 `URBAN` 대신 `URBAM`이 들어가는 사고를 원천 봉쇄**하고, 이후 모든 태스크가 인용할 어휘를 확정한다.
- **우선순위 / 복잡도**: Must / M (개별 enum은 L, 확장 패턴이 M)

## 🔗 References (Spec & Context)
- SRS 요구사항: REQ-FUNC-001·002·003·004·006·008 · **REQ-NF-005** (확장 패턴)
- SRS 부속 명세: **§6.2 데이터 모델 정의 전문**
- 태스크 원장: `TASKS-adtech-mvp-v1.0.md#EPIC-A`
- 학습 해설: `SRS-READER.html` 11장 (Enum·열거형)

## ✅ Task Breakdown (실행 계획)
- [ ] **FR-001** 인구통계 3종 — `AgeSegment`(4) · `IncomeSegment`(3) · `GeographySegment`(3)
- [ ] **FR-002** 행동 신호 3종 — `PurchaseIntent`(7) · `EngagementBehavior`(5) · `DevicePreference`(4)
- [ ] **FR-003** 캠페인 2종 — `BiddingStrategy`(3) · `CampaignStatus`(4)
- [ ] **FR-004** 노출·이벤트 3종 — `AdPosition`(5) · `EventType`(3) · `FallbackStage`(3)
- [ ] **FR-005** 확장 패턴 설계 — 신규 값 추가 시 변경 파일 최소화
- [ ] `IncomeSegment` **통화 단위 확정** 후 반영 **(미정 — 부록 D)**
- [ ] DB 저장 형태 결정 — 문자열 vs DB enum 타입 vs 코드 테이블 (아래 참조)
- [ ] 마이그레이션 스크립트 작성

### enum 11종 총람 (§6.2 원문 그대로)

| # | Enum | 값 수 | 값 |
| --- | --- | --- | --- |
| 1 | `AgeSegment` | 4 | AGE_18_24 / AGE_25_34 / AGE_35_44 / AGE_45_PLUS |
| 2 | `IncomeSegment` | 3 | LOW(0~50000) / MID(50001~100000) / HIGH(100001~) **단위 미정** |
| 3 | `GeographySegment` | 3 | URBAN / SUBURBAN / RURAL |
| 4 | `PurchaseIntent` | 7 | AUTOMOTIVE / FINANCE / TRAVEL / RETAIL / TECHNOLOGY / HEALTHCARE / REAL_ESTATE |
| 5 | `EngagementBehavior` | 5 | HIGH·MODERATE·LOW_FREQUENCY / RESEARCH_ORIENTED / IMPULSE_DRIVEN |
| 6 | `DevicePreference` | 4 | MOBILE_FIRST / DESKTOP_PREFERRED / MULTI_DEVICE / TABLET_FOCUSED |
| 7 | `BiddingStrategy` | 3 | CPC / CPM / CPA |
| 8 | `CampaignStatus` | 4 | DRAFT / ACTIVE / PAUSED / COMPLETED |
| 9 | `AdPosition` | 5 | MAIN_TOP / MAIN_MIDDLE / MAIN_BOTTOM / MAIN_LEFT_SIDEBAR / MAIN_RIGHT_SIDEBAR |
| 10 | `EventType` | 3 | IMPRESSION / CLICK / CONVERSION |
| 11 | `FallbackStage` | 3 | STAGE_PRECISE(1) / STAGE_DEMOGRAPHIC(2) / STAGE_CONTEXTUAL(3) |

### 저장 형태 — 확장 패턴의 실질적 선택 (FR-005)

REQ-NF-005는 *"신규 세그먼트·태그·위치를 추가할 때 enum 패턴을 통해 코드 변경을 최소화"* 를 요구한다.
그런데 **enum은 코드에 값을 박는 방식이므로 값을 추가하려면 배포가 필요하다.** 세 안을 비교한다.

| 안 | 저장 | 신규 값 추가 시 | 무결성 | 권고 |
| --- | --- | --- | --- | --- |
| **A** | DB enum 타입 | 스키마 변경 + 배포 | 최상 | ✗ 확장 비용 큼 |
| **B** | 문자열 + 애플리케이션 검증 | 코드 배포 | 중 | ○ **MVP 권고** |
| **C** | 코드 테이블 + FK | **데이터 추가만** | 상 | ◎ 운영 중 추가 가능 |

**MVP는 B를 권고한다.** SRS §6.2가 자바 enum 코드를 명시했으므로 그 의도에 가장 가깝다.
**단 C를 검토해야 하는 조건이 있다** — 운영 중에 CRM 매니저가 새 `PurchaseIntent` 값을 직접 추가하고 싶어 한다면 B로는 불가능하다.
**CRM 매니저에게 "값이 얼마나 자주 바뀔 것인가"를 확인한 뒤 결정할 것.**

## 🧪 Acceptance Criteria (BDD/GWT)

**Scenario 1: 열거값 밖 입력 차단**
- **Given**: `geographySegment`에 `"URBAM"`(오타)이 담긴 저장 시도
- **When**: 저장을 실행함
- **Then**: 저장이 거부되고 오류가 발생한다. **DB에 잘못된 값이 남지 않는다**

**Scenario 2: 11종 전수 정의 확인**
- **Given**: §6.2 원문
- **When**: 정의된 enum과 원문을 대조함
- **Then**: 11개 타입과 총 44개 값이 **누락·오타 없이** 일치한다

**Scenario 3: `FallbackStage`의 부가 필드**
- **Given**: §6.2의 `FallbackStage`는 `stageNumber`·`stageName`·`description` 세 필드를 갖는다
- **When**: `STAGE_PRECISE`를 조회함
- **Then**: `stageNumber`가 `1`로 반환된다 (응답·로그에 이 번호가 실림 — FR-033)

**Scenario 4: 확장성 측정 (FR-005)**
- **Given**: `PurchaseIntent`에 새 값 1개를 추가하는 작업
- **When**: 추가에 필요한 변경을 수행함
- **Then**: **(미정)** — 변경 파일 수가 확정된 상한 이하다
  <!-- REQ-NF-005의 "최소화"에 정량 기준이 없다. 제안: 변경 파일 3개 이하 + 스키마 변경 불필요.
       QA-013(TC-NF-005)이 이 수치로 판정한다. -->

## ⚙️ Technical & Non-Functional Constraints
- **유지보수성**: REQ-NF-005. 신규 값 추가 시 변경 범위가 QA-013에서 측정된다
- 데이터: `IncomeSegment` 경계값(50000·50001·100000·100001)의 귀속이 코드에 명시되어야 함
- **주의**: `EngagementBehavior`는 성격이 다른 두 축이 섞여 있다 — 빈도 3종(배타적)과 방식 2종(빈도와 독립). 두 enum으로 분리하는 안을 설계 리뷰에 제기할 것

## 🏁 Definition of Done (DoD)
- 공통 DoD 10개 + `[DB]` 추가 3개
- [ ] 저장 형태가 A·B·C 중 하나로 확정되고 근거가 기록되었는가?
- [ ] `IncomeSegment` 통화 단위가 확정되어 반영되었는가?
- [ ] REQ-NF-005의 "최소화" 정량 기준이 합의되었는가? (QA-013의 통과선)

## 🚧 Dependencies & Blockers
- **Depends on**: 없음 — **즉시 착수 가능**
- **Blocks**: DB-002, DB-003, DB-004, FR-012, FR-015, FR-020, FR-021, FR-024, FR-031, FR-033, FR-036, FR-038, NF-011, QA-013
- **SRS 미정의**: `IncomeSegment` 통화 단위 / 경계값 귀속 / REQ-NF-005 정량 기준 / `UNKNOWN` 값 부재 (부록 D)

---

# [DB] DB-002: Audience 도메인 스키마 및 마이그레이션

**labels**: `db, backend, priority:high, blocked-d04`
**원장 태스크**: FR-006

## 🎯 Summary
- **Task ID**: DB-002 (FR-006)
- **Epic (도메인)**: Foundation
- **기능명**: [DB-002] `user_profiles` / `user_behavioral_signals` 스키마 및 마이그레이션 스크립트
- **목적**: 36칸 격자와 멀티 태그를 담을 자리를 만든다. **MECE 원칙이 DB 제약으로 강제되는 지점**이다.
- **우선순위 / 복잡도**: Must / M

## 🔗 References (Spec & Context)
- SRS 요구사항: REQ-FUNC-001 · REQ-FUNC-002 · §6.3 규칙 1·2
- SRS 부속 명세: §6.4 `user_profiles`, `user_behavioral_signals` · §6.2 enum 6종
- 태스크 원장: EPIC A · 선행 DB-001
- 확정 안건: `docs/W0-decision-agenda.md` **D-04 (개인정보 — 이 스키마의 착수 차단 요인)**

## ✅ Task Breakdown (실행 계획)
- [ ] `user_profiles` 컬럼 설계 — 3개 차원 + 복합 문자열
- [ ] **MECE를 DB 제약으로 강제** — 3개 차원 `NOT NULL` + 사용자당 유일
- [ ] `user_behavioral_signals` 설계 — 일대다 + **역방향 조회 색인**
- [ ] 개인정보 보관 필드 범위 확정 — **D-04 회신 반영**
- [ ] 파기·비식별화 경로 컬럼 설계 — **D-04 회신 반영**
- [ ] 마이그레이션 스크립트 + 롤백 검증

### 스키마 (제안)

```sql
-- MECE 인구통계: 사용자당 정확히 1행
CREATE TABLE user_profiles (
  user_id             VARCHAR(64)  PRIMARY KEY,        -- 사용자당 유일 → 세그먼트 중복 불가
  age_segment         VARCHAR(16)  NOT NULL,           -- §6.2 AgeSegment
  income_segment      VARCHAR(16)  NOT NULL,           -- §6.2 IncomeSegment
  geography_segment   VARCHAR(16)  NOT NULL,           -- §6.2 GeographySegment
  composite_segment   VARCHAR(64)  NOT NULL,           -- 포맷 (미정) — 부록 D
  created_at          TIMESTAMP    NOT NULL,
  updated_at          TIMESTAMP    NOT NULL,
  deleted_at          TIMESTAMP    NULL                -- REQ-FUNC-007
);
CREATE INDEX ix_profiles_composite ON user_profiles (composite_segment) WHERE deleted_at IS NULL;

-- 멀티 태그 행동 신호: 사용자당 다수 행
CREATE TABLE user_behavioral_signals (
  signal_id     BIGINT       PRIMARY KEY,
  user_id       VARCHAR(64)  NOT NULL REFERENCES user_profiles(user_id),
  category      VARCHAR(32)  NOT NULL,   -- PURCHASE_INTENT / ENGAGEMENT_BEHAVIOR / DEVICE_PREFERENCE
  value         VARCHAR(32)  NOT NULL,   -- §6.2 해당 enum 값
  created_at    TIMESTAMP    NOT NULL,
  deleted_at    TIMESTAMP    NULL,
  UNIQUE (user_id, category, value)      -- 동일 태그 중복 방지 → SPEC-003 멱등성의 근거
);
-- 역방향 조회: "이 태그를 가진 사용자 전부" — FR-029의 입력
CREATE INDEX ix_signals_reverse ON user_behavioral_signals (category, value, user_id)
  WHERE deleted_at IS NULL;
```

**세 가지 설계 결정에 근거를 붙인다.**

`user_id`를 기본키로 둔 것이 **MECE 상호 배타의 DB 수준 보증**이다. 사용자당 1행이므로 두 세그먼트를 가질 수 없다.
세 차원의 `NOT NULL`이 **전체 포괄의 보증**이다. 단 이것이 곧 **`UNKNOWN` 값이 없으면 정보 미상 사용자를 아예 저장할 수 없다**는 뜻이다 — 부록 D의 항목이 여기서 물리적 장벽이 된다.

`UNIQUE (user_id, category, value)`가 SPEC-003 Scenario 3(동일 태그 재전송 시 멱등)의 근거다. 애플리케이션이 아니라 DB가 보증한다.

`ix_signals_reverse`가 없으면 FR-029의 1단계 정밀 타게팅이 전체 스캔이 되어 **100ms 예산이 무너진다.**

## 🧪 Acceptance Criteria (BDD/GWT)

**Scenario 1: MECE 상호 배타 강제**
- **Given**: 세그먼트가 이미 부여된 사용자
- **When**: 같은 사용자에게 두 번째 세그먼트 행을 삽입 시도함
- **Then**: 기본키 위반으로 거부된다. **한 사용자가 두 세그먼트를 갖는 상태가 물리적으로 불가능하다**

**Scenario 2: MECE 전체 포괄 강제**
- **Given**: `income_segment`가 비어 있는 삽입 시도
- **When**: 삽입을 실행함
- **Then**: `NOT NULL` 위반으로 거부된다

**Scenario 3: 멀티 태그 허용**
- **Given**: `PURCHASE_INTENT / AUTOMOTIVE`가 부여된 사용자
- **When**: `PURCHASE_INTENT / FINANCE`를 삽입함
- **Then**: 성공하고 두 행이 공존한다 (§6.3 규칙 2)

**Scenario 4: 동일 태그 중복 차단**
- **Given**: `PURCHASE_INTENT / AUTOMOTIVE`가 부여된 사용자
- **When**: 동일 조합을 다시 삽입함
- **Then**: 유일성 제약으로 거부된다

**Scenario 5: 역방향 조회 성능**
- **Given**: 사용자 100만 명·태그 500만 건이 적재된 상태
- **When**: 특정 태그를 가진 사용자를 조회함
- **Then**: 실행 계획에서 `ix_signals_reverse`를 사용하며 전체 스캔이 발생하지 않는다

**Scenario 6: 정보 미상 사용자**
- **Given**: 소득을 알 수 없는 신규 사용자
- **When**: 프로파일 삽입을 시도함
- **Then**: **(미정)** — `UNKNOWN` 값이 없어 삽입이 불가능하다. **부록 D 해소 전에는 이 시나리오에 답이 없다**

## ⚙️ Technical & Non-Functional Constraints
- **보안·법령 (D-04)**: 연령·소득·지역·행동 이력은 개인정보다. `IncomeSegment`는 특히 민감하게 취급된다
- **보존·파기**: §6.3 규칙 5가 물리 삭제를 예외 없이 금지하나, 삭제 요구권과 충돌한다. **D-04 회신 없이 이 스키마를 확정하면 재작업 위험이 크다**
- 성능: `ix_signals_reverse`가 FR-029의 예산을 결정한다
- 데이터: `composite_segment`는 3개 차원에서 파생되는 중복 컬럼 — 조회 속도를 위한 의도적 비정규화

## 🏁 Definition of Done (DoD)
- 공통 DoD 10개 + `[DB]` 추가 3개
- [ ] D-04 회신이 반영되어 파기·비식별화 경로가 스키마에 존재하는가?
- [ ] 정보 미상 사용자의 처리 방식이 확정되고 제약에 반영되었는가?
- [ ] 역방향 조회 실행 계획이 색인을 사용함을 확인했는가?

## 🚧 Dependencies & Blockers
- **Depends on**: DB-001 (FR-001, FR-002)
- **Blocks**: DB-005, FR-012, FR-015, FR-049, NF-012
- **SRS 미정의**: **D-04 개인정보 근거·파기 경로 — 착수 차단** / `UNKNOWN` 세그먼트 부재 / 복합 세그먼트 포맷 / 태그 유효 기간·신뢰도(§7.2)

---

# [DB] DB-003: Campaign 도메인 스키마 및 마이그레이션

**labels**: `db, backend, priority:high`
**원장 태스크**: FR-007

## 🎯 Summary
- **Task ID**: DB-003 (FR-007)
- **Epic (도메인)**: Foundation
- **기능명**: [DB-003] `campaigns` / `campaign_targeting`(비정규화) / `campaign_creatives` 스키마 및 마이그레이션
- **목적**: 광고 후보의 원천 데이터를 담는다. **광고 요청 경로에서 읽히는 테이블이므로 조회 최적화가 갱신 편의보다 우선한다.**
- **우선순위 / 복잡도**: Must / M

## 🔗 References (Spec & Context)
- SRS 요구사항: REQ-FUNC-003 · REQ-FUNC-005 · §6.3 규칙 4·7
- SRS 부속 명세: §6.4 3개 테이블 (**`campaign_targeting`에 "비정규화" 주석**) · §6.2 `CampaignStatus`·`BiddingStrategy`·`AdPosition`
- 태스크 원장: EPIC A · 선행 DB-001

## ✅ Task Breakdown (실행 계획)
- [ ] `campaigns` 컬럼 설계 — 상태·입찰·예산·기간
- [ ] **예산 잔액 컬럼 설계** — 원자적 차감을 가능하게 하는 구조 (FR-035의 전제)
- [ ] `campaign_targeting` 비정규화 구조 설계 — SPEC-005의 조건 결합 규칙 반영
- [ ] `campaign_creatives` 설계 — 위치별 소재
- [ ] 소유자(광고주) 컬럼 — **D-01 반영**
- [ ] 후보 조회 색인 설계 (상태 + 예산 잔액 + 타게팅)
- [ ] 마이그레이션 스크립트 + 롤백 검증

### 스키마 (제안)

```sql
CREATE TABLE campaigns (
  campaign_id        VARCHAR(64) PRIMARY KEY,
  advertiser_id      VARCHAR(64) NOT NULL,          -- D-01 소유자 검증의 기준
  name               VARCHAR(200) NOT NULL,
  status             VARCHAR(16) NOT NULL,          -- §6.2 CampaignStatus
  bidding_strategy   VARCHAR(8)  NOT NULL,          -- §6.2 BiddingStrategy
  bid_amount         BIGINT      NOT NULL,          -- 통화 단위 (미정)
  total_budget       BIGINT      NOT NULL,
  daily_budget_cap   BIGINT      NOT NULL,          -- §6.3 규칙 7
  spent_total        BIGINT      NOT NULL DEFAULT 0,
  spent_today        BIGINT      NOT NULL DEFAULT 0,-- FR-035가 원자적으로 증가시키는 컬럼
  spent_date         DATE        NOT NULL,          -- 일자 전환 감지용
  start_at           TIMESTAMP   NULL,              -- (제안) COMPLETED 진입 조건
  end_at             TIMESTAMP   NULL,              -- (제안)
  created_at         TIMESTAMP   NOT NULL,
  updated_at         TIMESTAMP   NOT NULL,
  deleted_at         TIMESTAMP   NULL
);
-- 후보 조회: ACTIVE + 일일 예산 잔액 있음
CREATE INDEX ix_campaigns_servable ON campaigns (status, spent_date)
  WHERE deleted_at IS NULL;

-- 타게팅 조건 (비정규화 — §6.4 주석) : 조회 1회로 전 조건 확보
CREATE TABLE campaign_targeting (
  campaign_id           VARCHAR(64) PRIMARY KEY REFERENCES campaigns(campaign_id),
  age_segments          TEXT[] NOT NULL DEFAULT '{}',   -- 빈 배열 = 제약 없음 (SPEC-005)
  income_segments       TEXT[] NOT NULL DEFAULT '{}',
  geography_segments    TEXT[] NOT NULL DEFAULT '{}',
  purchase_intents      TEXT[] NOT NULL DEFAULT '{}',
  engagement_behaviors  TEXT[] NOT NULL DEFAULT '{}',
  device_preferences    TEXT[] NOT NULL DEFAULT '{}',
  updated_at            TIMESTAMP NOT NULL,
  deleted_at            TIMESTAMP NULL
);
CREATE INDEX ix_targeting_demo ON campaign_targeting
  USING GIN (age_segments, income_segments, geography_segments);
CREATE INDEX ix_targeting_behav ON campaign_targeting
  USING GIN (purchase_intents, engagement_behaviors, device_preferences);

CREATE TABLE campaign_creatives (
  creative_id   VARCHAR(64) PRIMARY KEY,
  campaign_id   VARCHAR(64) NOT NULL REFERENCES campaigns(campaign_id),
  position      VARCHAR(32) NOT NULL,     -- §6.2 AdPosition
  creative_url  TEXT NOT NULL,
  landing_url   TEXT NOT NULL,
  width         INT NULL,                 -- UX-004 규격 확정 후
  height        INT NULL,
  created_at    TIMESTAMP NOT NULL,
  deleted_at    TIMESTAMP NULL
);
CREATE INDEX ix_creatives_campaign_pos ON campaign_creatives (campaign_id, position)
  WHERE deleted_at IS NULL;
```

**설계 결정 세 가지에 근거를 붙인다.**

`spent_today`와 `spent_date`를 분리한 것은 **FR-035의 원자적 차감을 가능하게 하기 위해서**다.
잔액을 매번 이벤트 테이블에서 합산하면 초당 1,000건 환경에서 버틸 수 없다. 누적 컬럼을 조건부로 증가시키는 방식이 필요하고, 그 구조를 스키마가 먼저 제공해야 한다.

`campaign_targeting`을 **배열 컬럼 + GIN 색인**으로 둔 것이 §6.4의 "비정규화" 주석을 구현한 것이다.
정규화하면 6개 자식 테이블에 조인 6회가 되고, 광고 요청 경로에서 그 비용을 감당할 수 없다.
**빈 배열 기본값이 SPEC-005의 "제약 없음" 의미와 정확히 대응한다.**

`campaign_id`를 `campaign_targeting`의 기본키로 둔 것은 캠페인당 타게팅 1행 = `PUT` 전체 교체 의미와 맞춘 것이다.

## 🧪 Acceptance Criteria (BDD/GWT)

**Scenario 1: 후보 조회 색인 사용**
- **Given**: 캠페인 10만 건 중 `ACTIVE`가 5,000건 적재된 상태
- **When**: 노출 가능 캠페인을 조회함
- **Then**: 실행 계획이 `ix_campaigns_servable`를 사용하고 전체 스캔이 없다

**Scenario 2: 타게팅 조건 매칭 색인 사용**
- **Given**: 타게팅 조건이 설정된 캠페인 5,000건
- **When**: 특정 세그먼트·태그 조합으로 후보를 조회함
- **Then**: GIN 색인을 사용하며 응답이 성능 예산의 Campaign 구간(제안 25ms) 이내다

**Scenario 3: 빈 배열의 의미**
- **Given**: `purchase_intents`가 빈 배열인 캠페인
- **When**: 행동 태그가 없는 사용자로 후보를 조회함
- **Then**: 이 캠페인이 **2단계 후보로 포함된다** (제약 없음 = 모두 허용)

**Scenario 4: 예산 누적 컬럼 동시 증가**
- **Given**: `spent_today`가 상한에 근접한 캠페인
- **When**: 동시에 100건의 조건부 증가를 시도함
- **Then**: 상한을 넘는 증가는 **모두 실패**하고 잔액이 음수가 되지 않는다
  <!-- 이 시나리오가 FR-035의 스키마 수준 전제다. 구현은 FR-035, 검증은 QA-005. -->

**Scenario 5: 외래키 무결성**
- **Given**: 존재하지 않는 `campaign_id`
- **When**: `campaign_creatives`에 삽입을 시도함
- **Then**: 외래키 위반으로 거부된다

## ⚙️ Technical & Non-Functional Constraints
- **성능**: 이 세 테이블은 **광고 요청 경로에서 읽힌다.** 색인 설계가 REQ-NF-001 달성의 절반이다
- 데이터: 비정규화는 §6.4가 명시한 의도적 선택 — 조회 속도를 위해 갱신 복잡도를 감수
- 보안: `advertiser_id`가 D-01 소유자 검증의 기준 컬럼
- 데이터: 배열 컬럼 값은 DB-001 enum 범위 안이어야 함 (애플리케이션 검증)

## 🏁 Definition of Done (DoD)
- 공통 DoD 10개 + `[DB]` 추가 3개
- [ ] SPEC-005의 조건 결합 규칙이 색인 설계에 반영되었는가?
- [ ] `spent_today` 조건부 증가가 동시성 테스트를 통과했는가?
- [ ] 캠페인 기간 필드 신설 여부가 확정되었는가? (`COMPLETED` 진입 조건)

## 🚧 Dependencies & Blockers
- **Depends on**: DB-001 (FR-003), SPEC-005 (조건 결합 규칙 → 색인 설계)
- **Blocks**: DB-005, FR-019a, FR-019b, FR-025, FR-035
- **SRS 미정의**: 통화 단위 / `COMPLETED` 진입 조건 / 기간 필드 / **D-01** 소유자 / SPEC-005 조건 결합 규칙

---

# [DB] DB-004: 이벤트 원본 및 실시간 집계 뷰

**labels**: `db, backend, priority:high`
**원장 태스크**: FR-008 · FR-009

## 🎯 Summary
- **Task ID**: DB-004 (FR-008, FR-009)
- **Epic (도메인)**: Foundation
- **기능명**: [DB-004] `ad_events`(파티셔닝) / `campaign_performance_realtime`(구체화 뷰) 스키마 및 마이그레이션
- **목적**: **하루 8,640만 건**의 이벤트를 감당하고, 그것을 5분 주기로 집계해 대시보드에 공급한다.
- **우선순위 / 복잡도**: Must / H

## 🔗 References (Spec & Context)
- SRS 요구사항: REQ-FUNC-008 · **REQ-NF-002** (1,000 RPS) · §6.3 규칙 8 (5분 주기)
- SRS 부속 명세: §6.4 `ad_events` **(파티셔닝)** · `campaign_performance_realtime` **(구체화 뷰)** · §6.2 `EventType`·`FallbackStage`
- 태스크 원장: EPIC A · 선행 DB-001
- 학습 해설: `SRS-READER.html` 11장 (파티셔닝·구체화 뷰) · 21장 (이벤트 추적)

## ✅ Task Breakdown (실행 계획)
- [ ] `ad_events` 컬럼 설계 — **멱등키 포함** (SPEC-008·009 규약)
- [ ] 파티션 전략 확정 — 기준 컬럼·주기·보존 기간
- [ ] **세그먼트 스냅샷 컬럼 설계** — 아래 근거 참조
- [ ] 구체화 뷰 설계 — 집계 축과 갱신 방식
- [ ] 5분 주기 갱신 전략 (전체 재계산 vs 증분)
- [ ] 용량 산정 및 보존 정책 **(미정)**
- [ ] 마이그레이션 스크립트 + 파티션 자동 생성 스크립트

### 스키마 (제안)

```sql
CREATE TABLE ad_events (
  event_id            VARCHAR(64)  NOT NULL,   -- 멱등키 (SPEC-008·009) — 중복 청구 방지
  event_type          VARCHAR(16)  NOT NULL,   -- §6.2 EventType
  request_id          VARCHAR(64)  NOT NULL,   -- SPEC-007이 발급 — 노출·클릭·전환 연결
  campaign_id         VARCHAR(64)  NOT NULL,
  creative_id         VARCHAR(64)  NULL,
  user_id             VARCHAR(64)  NULL,
  ad_position         VARCHAR(32)  NULL,       -- §6.2 AdPosition
  fallback_stage      SMALLINT     NULL,       -- §6.2 FallbackStage — "성과 분석용"
  demographic_segment VARCHAR(64)  NULL,       -- 발생 시점 스냅샷 (아래 근거)
  behavioral_signals  TEXT[]       NULL,       -- 발생 시점 스냅샷
  charged_amount      BIGINT       NULL,       -- 이 이벤트로 과금된 금액
  occurred_at         TIMESTAMP    NOT NULL,   -- 파티션 키
  received_at         TIMESTAMP    NOT NULL,
  PRIMARY KEY (event_id, occurred_at)          -- 멱등성 + 파티션 키 포함
) PARTITION BY RANGE (occurred_at);            -- §6.4 "파티셔닝"

CREATE INDEX ix_events_campaign ON ad_events (campaign_id, occurred_at);
CREATE INDEX ix_events_request  ON ad_events (request_id);        -- 어트리뷰션(FR-044)
CREATE INDEX ix_events_segment  ON ad_events (demographic_segment, occurred_at);  -- FR-042

-- 실시간 대시보드용 집계 (§6.4 구체화 뷰 · §6.3 규칙 8의 5분 주기 대상)
CREATE MATERIALIZED VIEW campaign_performance_realtime AS
SELECT campaign_id, demographic_segment,
       COUNT(*) FILTER (WHERE event_type = 'IMPRESSION') AS impressions,
       COUNT(*) FILTER (WHERE event_type = 'CLICK')      AS clicks,
       COUNT(*) FILTER (WHERE event_type = 'CONVERSION') AS conversions,
       SUM(charged_amount)                               AS spend,
       MAX(received_at)                                  AS as_of
FROM ad_events
WHERE occurred_at >= now() - INTERVAL '90 days'
GROUP BY campaign_id, demographic_segment;
```

**`demographic_segment`를 이벤트에 복사해 넣는 것이 이 설계의 핵심 결정이다.**

`user_profiles`를 조인해서 세그먼트별로 집계할 수도 있지만, 두 가지 이유로 스냅샷이 옳다.

첫째, **사용자의 세그먼트는 바뀐다.** 25~34세였던 사용자가 35~44세가 되면, 조인 방식에서는 **지난달 리포트의 숫자가 소급 변경된다.** 이미 광고주에게 청구한 숫자가 달라지는 것이므로 정산 분쟁이 된다.
발생 시점 값을 박아두면 과거 리포트가 불변이다.

둘째, 조인 없이 집계하므로 FR-042(세그먼트별 분해)의 비용이 크게 낮아진다. §6.4가 `campaign_targeting`에 비정규화를 명시한 것과 같은 성격의 선택이다.

`PRIMARY KEY (event_id, occurred_at)`는 멱등성과 파티셔닝을 동시에 만족시키기 위한 구성이다. 파티션 키가 기본키에 포함되어야 한다.

### 용량 산정

| 항목 | 계산 | 결과 |
| --- | --- | --- |
| 일 이벤트 수 | 1,000 RPS × 86,400초 | **8,640만 건** |
| 이벤트당 크기 | 위 스키마 기준 추정 | 약 200 바이트 |
| 일 증가량 | 8,640만 × 200B | **약 17 GB** |
| 월 증가량 | 17GB × 30 | **약 500 GB** |
| 색인 오버헤드 | 색인 3개 | 데이터의 30~50% 추가 |

**보존 기간이 정해지지 않으면 용량이 무한히 증가한다.** SRS에 보존 정책이 없다(부록 D).
위 뷰 정의의 90일은 **제안값**이다.

## 🧪 Acceptance Criteria (BDD/GWT)

**Scenario 1: 멱등성 — 중복 이벤트 차단**
- **Given**: `event_id`가 `evt-a1`인 이벤트가 이미 저장됨
- **When**: 동일 `event_id`·`occurred_at`으로 다시 삽입함
- **Then**: 기본키 위반으로 거부된다. **집계 수치가 증가하지 않는다**

**Scenario 2: 파티션 정확 배치**
- **Given**: 서로 다른 날짜의 이벤트 2건
- **When**: 각각 삽입함
- **Then**: 해당 날짜의 파티션에 저장되며, 하루치 조회가 **한 파티션만 읽는다**

**Scenario 3: 세그먼트 스냅샷 불변성**
- **Given**: `AGE_25_34`로 기록된 이벤트가 존재함
- **When**: 그 사용자의 세그먼트를 `AGE_35_44`로 갱신함
- **Then**: **기존 이벤트의 `demographic_segment`는 변하지 않는다.** 과거 리포트가 소급 변경되지 않는다

**Scenario 4: 집계 정합성**
- **Given**: 노출 100건·클릭 3건이 여러 세그먼트에 걸쳐 저장됨
- **When**: 구체화 뷰를 갱신하고 조회함
- **Then**: 세그먼트별 노출 합계가 **전체 노출 수와 정확히 일치**한다 (MECE 확인 지점)

**Scenario 5: 갱신 주기**
- **Given**: 방금 삽입된 이벤트
- **When**: 5분이 경과함
- **Then**: 구체화 뷰에 반영되고 `as_of`가 갱신된다 (§6.3 규칙 8)

**Scenario 6: 부하 하 삽입 성능**
- **Given**: 1,000 RPS 지속 부하
- **When**: 이벤트 삽입을 계속함
- **Then**: **(미정)** — 확정된 응답 시간 목표를 유지한다 (REQ-NF-002에 응답 시간 조건 부재)

## ⚙️ Technical & Non-Functional Constraints
- **처리량**: REQ-NF-002. 삽입 경로가 병목이 되지 않아야 함 — 색인 수와 쓰기 성능의 균형
- **용량**: 월 500GB. 오래된 파티션을 통째로 분리·폐기할 수 있어야 함
- 정확성: **정산에 쓰이는 원장이다.** 중복·유실 모두 금액 오류로 직결
- 성능: 구체화 뷰 갱신이 삽입 경로를 방해하지 않아야 함 (OLTP·OLAP 분리 검토)

## 🏁 Definition of Done (DoD)
- 공통 DoD 10개 + `[DB]` 추가 3개
- [ ] 파티션 자동 생성·폐기 스크립트가 동작하는가?
- [ ] 데이터 보존 기간이 확정되어 뷰 정의와 폐기 정책에 반영되었는가?
- [ ] 세그먼트 스냅샷 불변성이 테스트로 증명되었는가?
- [ ] 5분 주기 갱신이 삽입 성능에 미치는 영향이 측정되었는가?

## 🚧 Dependencies & Blockers
- **Depends on**: DB-001 (FR-004), SPEC-008·SPEC-009 (멱등키 규약 → `event_id` 설계)
- **Blocks**: DB-005, FR-039, FR-041, FR-043, FR-044, FR-028, FR-045
- **SRS 미정의**: 데이터 보존 기간 / 멱등성 규칙 / REQ-NF-002 응답 시간 조건 / "실시간" vs "5분" 정의 충돌 (부록 D)

---

# [DB] DB-005: 소프트 삭제 컴포넌트 및 전 서비스 적용

**labels**: `db, backend, priority:high`
**원장 태스크**: FR-010 · FR-011

## 🎯 Summary
- **Task ID**: DB-005 (FR-010, FR-011)
- **Epic (도메인)**: Foundation
- **기능명**: [DB-005] `SoftDeleteService` 구현 및 4개 서비스 전체 적용
- **목적**: 물리 삭제를 금지하면서, **"필터 한 군데를 빠뜨려 삭제된 데이터가 다시 보이는" 결함을 구조적으로 불가능하게** 만든다.
- **우선순위 / 복잡도**: Should / M

## 🔗 References (Spec & Context)
- SRS 요구사항: **REQ-FUNC-007** · §6.3 규칙 5 · §5 (`SoftDeleteService`, 모듈 = **All Services**)
- 태스크 원장: EPIC A · 선행 DB-002·003·004
- 확정 안건: `docs/W0-decision-agenda.md` D-04 (개인정보 파기 예외)
- 학습 해설: `SRS-READER.html` 18장 (소프트 삭제와 데이터 수명주기)

## ⚠️ 이 태스크의 구조적 위험 — 책임자 불명확

§5는 이 요구사항의 모듈을 **"All Services"** 로 지정한다. **전원의 일은 아무의 일도 아니다.**
소프트 삭제는 네 팀이 각자 구현하는 순간 규칙이 갈리고, 한 팀이 필터를 빠뜨리면 전체가 오염된다.

**착수 전에 단일 책임자를 지정할 것.** 규칙을 정하는 사람과, 네 서비스가 모두 지켰는지 확인하는 사람이 같아야 한다.

## ✅ Task Breakdown (실행 계획)
- [ ] **필터 강제 지점 확정** — SPEC-000의 A·B 안 반영
- [ ] 공통 컴포넌트 구현 — `deleted_at` 갱신 + 조회 제외
- [ ] 4개 서비스 전 조회 경로 감사 — 필터 누락 지점 목록화
- [ ] 유일성 제약 충돌 처리 (아래 참조)
- [ ] 연쇄 삭제 규칙 확정 (아래 참조)
- [ ] **개인정보 물리 삭제 예외 경로** — D-04 회신 반영
- [ ] 삭제 API 신설 — **§6.1에 없음** (아래 참조)

### 이 요구사항이 만드는 네 가지 문제와 대응

| 문제 | 왜 발생하나 | 대응 |
| --- | --- | --- |
| **필터 누락** | 조회가 수십 곳에 흩어져 있고 개발자가 잊는다 | 데이터 접근 계층에서 자동 부착 또는 필터된 뷰만 노출 (SPEC-000) |
| **유일성 충돌** | 삭제된 캠페인이 이름을 계속 점유해 같은 이름을 다시 못 쓴다 | 부분 색인 — `UNIQUE (name) WHERE deleted_at IS NULL` |
| **테이블 비대화** | 지워도 줄지 않아 색인이 무거워지고 조회가 느려진다 | 보존 기간 경과분 물리 삭제 (보존 정책 확정 필요) |
| **연쇄 삭제 모호** | 캠페인을 지우면 크리에이티브·타게팅도 지워진 것인가 | 규칙을 명문화 — **제안: 부모 삭제 시 자식도 논리 삭제** |

### §6.1에 삭제 API가 없다

§6.1의 10개 엔드포인트에 `DELETE`가 **하나도 없다.** 소프트 삭제 정책은 REQ-FUNC-007로 존재하는데,
**그 정책을 발동시킬 API가 정의되지 않았다.** 이 태스크에서 계약을 신설해야 한다.

> **제안** — `DELETE /api/v1/campaigns/{campaignId}` 등. 메서드는 `DELETE`를 쓰되 동작은 논리 삭제.
> HTTP 의미론상 `DELETE`는 "자원을 제거한다"이고, 그것이 물리적이어야 한다는 규정은 없다.

## 🧪 Acceptance Criteria (BDD/GWT)

**Scenario 1: 논리 삭제 동작**
- **Given**: `ACTIVE` 캠페인이 존재함
- **When**: 삭제를 요청함
- **Then**: 목록 조회에서 사라지지만 **DB에는 행이 남아 있고** `deleted_at`이 채워진다

**Scenario 2: 과거 리포트 보존**
- **Given**: 지난달 성과가 집계된 캠페인을 삭제함
- **When**: 지난달 리포트를 조회함
- **Then**: **해당 캠페인의 성과가 여전히 조회된다** (§6.3 규칙 5의 목적)

**Scenario 3: 필터 누락 감사**
- **Given**: 4개 서비스의 모든 조회 경로
- **When**: 삭제된 자원으로 각 경로를 호출함
- **Then**: **어느 경로에서도** 삭제된 자원이 반환되지 않는다
  <!-- 이 시나리오가 이 태스크의 핵심이다. 경로 목록을 만들고 전수 확인해야 한다. -->

**Scenario 4: 이름 재사용**
- **Given**: `"여름 프로모션"` 캠페인을 삭제함
- **When**: 같은 이름으로 새 캠페인을 생성함
- **Then**: 생성이 성공한다 (부분 색인으로 유일성 제약이 삭제된 행을 제외)

**Scenario 5: 연쇄 삭제**
- **Given**: 크리에이티브 3개를 가진 캠페인
- **When**: 캠페인을 삭제함
- **Then**: **(제안)** 크리에이티브 3개도 논리 삭제되어 조회되지 않는다

**Scenario 6: 개인정보 삭제 요구**
- **Given**: 사용자가 개인정보 삭제를 요구함
- **When**: 삭제를 처리함
- **Then**: **(미정)** — §6.3 규칙 5는 물리 삭제를 예외 없이 금지한다. **D-04 회신 없이는 답이 없다**
  <!-- 이대로 구현하면 삭제 요구권에 응할 수 없는 시스템이 된다. -->

## ⚙️ Technical & Non-Functional Constraints
- **법령 (D-04)**: 규칙 5의 "항상"과 개인정보 파기 의무가 충돌한다. 예외 경로가 필요하다
- 성능: 삭제 행 누적이 색인을 무겁게 만든다 — 보존 정책과 물리 정리 주기 필요
- 데이터: 부분 색인(`WHERE deleted_at IS NULL`)이 유일성 제약과 조회 성능 양쪽을 해결
- **조직**: 모듈이 "All Services"다. 규칙 위반을 CI에서 자동 검출하는 장치를 검토할 것

## 🏁 Definition of Done (DoD)
- 공통 DoD 10개 + `[DB]` 추가 3개
- [ ] **단일 책임자가 지정되었는가?**
- [ ] 4개 서비스의 조회 경로 목록이 작성되고 전수 확인되었는가?
- [ ] 삭제 API 계약이 신설되어 `docs/api_v1.yaml`에 반영되었는가?
- [ ] 개인정보 예외 경로가 D-04 회신에 따라 확정되었는가?
- [ ] 보존 기간과 물리 정리 주기가 정해졌는가?

## 🚧 Dependencies & Blockers
- **Depends on**: DB-002, DB-003, DB-004, SPEC-000 (필터 강제 지점)
- **Blocks**: QA-007, 그리고 **이후 신설되는 모든 조회 경로**
- **SRS 미정의**: **D-04** 개인정보 파기 예외 / 보존 기간 / 연쇄 삭제 규칙 / **삭제 API 자체가 §6.1에 없음** / 필터 강제 지점

---
---

# P1d · 모킹 서버 4건

> **이 Phase가 크리티컬 패스를 단축한다.** 원장 부록 A-5 참조 —
> Ad Serving은 Audience·Campaign 완성을 기다리지 않고, 클라이언트·UI는 Ad Serving 완성을 기다리지 않는다.
> **대가는 모킹과 실구현이 어긋나지 않게 유지하는 비용**이며, 그래서 계약(`SPEC`)이 단일 진실 원천이어야 한다.

## 4건 공통 사항

| 항목 | 내용 |
| --- | --- |
| **SRS 근거** | **없음 — 방법론 파생** (원장 부록 B-3에 명시) |
| 입력 | 대응 `SPEC` 계약 및 `docs/api_v1.yaml` |
| 공통 요구 | 계약과 동일한 상태 코드·응답 형식 · 시나리오별 응답 전환 · 지연 주입 · 계약 변경 시 동반 갱신 |
| 폐기 시점 | 대응 실구현 완료 및 통합 테스트 통과 후 |

### 모킹 공통 DoD

- [ ] 계약(`api_v1.yaml`)과 응답 스키마가 **자동 검증**되는가? (수동 대조는 반드시 어긋난다)
- [ ] 정상·예외·경계 시나리오를 스위치로 전환할 수 있는가?
- [ ] 지연 주입이 가능한가? (타임아웃·폴백 경로 검증용)
- [ ] 계약 변경 시 모킹 갱신을 강제하는 절차가 있는가?
- [ ] 소비 측 팀이 실제로 사용해 착수했음을 확인했는가?

---

# [Mock] MOCK-001: Audience Service 모킹

**labels**: `mock, backend, priority:high`

## 🎯 Summary
- **Task ID**: MOCK-001
- **Epic (도메인)**: Mock
- **기능명**: [MOCK-001] Audience Service 3개 엔드포인트 모킹
- **목적**: Ad Serving 팀이 Audience 실구현(FR-012~018)을 기다리지 않고 1·2단계 후보 조회에 착수하게 한다.
- **우선순위 / 복잡도**: Must / M

## 🔗 References (Spec & Context)
- 계약: SPEC-001 · SPEC-002 · SPEC-003 · `docs/api_v1.yaml`
- 태스크 원장: EPIC M · 소비 주체 FR-029, FR-030
- **SRS 근거: 없음 — 방법론 파생**

## ✅ Task Breakdown (실행 계획)
- [ ] `GET /audience/profiles/{userId}` 모킹 — 3종 응답 프로파일
- [ ] `POST .../segments` 모킹
- [ ] `POST .../behavioral-signals` 모킹
- [ ] 시나리오 데이터셋 구성 (아래)
- [ ] 지연 주입 · 오류 응답 스위치

### 필요한 응답 시나리오 — 폴백 3단계를 전부 재현해야 한다

| 시나리오 | 응답 | 유발하는 폴백 단계 |
| --- | --- | --- |
| 완전 프로파일 | 세그먼트 + 태그 3개 | **1단계** |
| 인구통계만 | 세그먼트 + 빈 태그 배열 | **2단계** |
| 프로파일 없음 | SPEC-001 확정 결과에 따름 | **3단계** |
| 36칸 전수 | 각 세그먼트별 1건 | FR-042 분해 집계 검증 |
| 오류 | `401` · `500` · 타임아웃 | 폴백·타임아웃 경로 검증 |

**이 5종이 갖춰지지 않으면 Ad Serving은 1단계만 테스트하게 되고, 2·3단계는 통합 시점에 처음 돌아간다.**

## 🧪 Acceptance Criteria (BDD/GWT)

**Scenario 1: 완전 프로파일 응답**
- **Given**: 모킹이 "완전 프로파일" 모드로 설정됨
- **When**: FR-029 구현이 프로파일을 조회함
- **Then**: 계약과 동일한 형식으로 세그먼트와 태그가 반환되고, 1단계 후보 조회가 진행된다

**Scenario 2: 계약 일치 검증**
- **Given**: `docs/api_v1.yaml`
- **When**: 모킹 응답을 스키마로 검증함
- **Then**: 모든 시나리오 응답이 계약을 통과한다

**Scenario 3: 지연 주입**
- **Given**: 모킹에 500ms 지연을 설정함
- **When**: FR-029가 조회를 시도함
- **Then**: 타임아웃 처리가 발동하고 다음 단계로 넘어간다

## ⚙️ Technical & Non-Functional Constraints
- 계약이 단일 진실 원천. **모킹이 계약을 앞서 나가면 안 된다**
- 실구현 완료 후 폐기 대상 — 영구 자산으로 취급하지 않는다

## 🏁 Definition of Done (DoD)
- 모킹 공통 DoD 5개
- [ ] 5종 시나리오가 모두 동작하는가?
- [ ] Ad Serving 팀이 이 모킹으로 FR-029·FR-030에 착수했는가?

## 🚧 Dependencies & Blockers
- **Depends on**: SPEC-001, SPEC-002, SPEC-003
- **Blocks**: FR-029, FR-030
- **위험**: 계약 변경 시 모킹이 뒤처지면 **실구현과 어긋난 채 개발이 진행된다.** 갱신 절차가 없으면 이 위험이 현실화된다

---

# [Mock] MOCK-002: Campaign Service 모킹

**labels**: `mock, backend, priority:high`

## 🎯 Summary
- **Task ID**: MOCK-002
- **Epic (도메인)**: Mock
- **기능명**: [MOCK-002] Campaign Service 3개 엔드포인트 모킹
- **목적**: Ad Serving 팀이 Campaign 실구현(FR-019a~028)을 기다리지 않고 후보 조회·수익 최적화에 착수하게 한다.
- **우선순위 / 복잡도**: Must / M

## 🔗 References (Spec & Context)
- 계약: SPEC-004 · SPEC-005 · SPEC-006 · `docs/api_v1.yaml`
- 태스크 원장: EPIC M · 소비 주체 FR-029, FR-030, FR-031, FR-034
- **SRS 근거: 없음 — 방법론 파생**

## ✅ Task Breakdown (실행 계획)
- [ ] `POST /campaigns` · `PUT .../targeting` · `GET .../performance` 모킹
- [ ] 후보 캠페인 데이터셋 구성 (아래)
- [ ] 예산 잔액 상태 전환 스위치
- [ ] 지연 주입 · 오류 응답 스위치

### 필요한 후보 캠페인 데이터셋 — FR-034 검증에 필수

| 데이터셋 | 구성 | 검증 대상 |
| --- | --- | --- |
| 1단계 후보 | 인구통계 + 행동 조건 모두 지정 | FR-029 |
| 2단계 후보 | 인구통계만, 행동 배열 비움 | FR-030 |
| 3단계 후보 | 위치 기반 기본 캠페인 | FR-031 |
| **과금 방식 혼재** | CPC · CPM · CPA 각 1건 | **FR-034 — 입찰가 비교 불가 사례** |
| 예산 소진 | 잔액 0인 `ACTIVE` 캠페인 | FR-035 |
| 동일 입찰가 | 입찰가가 같은 2건 | FR-034 동점 규칙 |
| 슬롯 초과 | 후보 5건 (슬롯 2) | FR-036 |

**"과금 방식 혼재" 데이터셋이 특히 중요하다.** 원장 부록 D의 최고 입찰가 vs eCPM 문제가
이 데이터셋 없이는 개발 중에 드러나지 않는다. **CPC 1,000원 / CTR 0.2%** 캠페인과 **CPM 3,000원** 캠페인을 함께 넣으면,
구현이 어느 쪽을 고르는지가 즉시 보인다.

## 🧪 Acceptance Criteria (BDD/GWT)

**Scenario 1: 단계별 후보 반환**
- **Given**: 3개 데이터셋이 준비됨
- **When**: FR-032가 1→2→3 순서로 조회함
- **Then**: 각 단계에서 해당 데이터셋의 후보가 반환된다

**Scenario 2: 과금 방식 혼재 후보**
- **Given**: CPC·CPM·CPA 후보가 함께 반환되는 모드
- **When**: FR-034가 선택을 수행함
- **Then**: 선택 결과와 그 근거가 로그로 확인되어, **입찰가 비교인지 eCPM 비교인지 즉시 판별된다**

**Scenario 3: 예산 소진 후보 배제**
- **Given**: 잔액 0인 `ACTIVE` 캠페인
- **When**: 후보 조회를 수행함
- **Then**: 이 캠페인은 후보에서 제외된다 (§6.3 규칙 4·7)

## ⚙️ Technical & Non-Functional Constraints
- 계약이 단일 진실 원천
- 실구현 완료 후 폐기 대상

## 🏁 Definition of Done (DoD)
- 모킹 공통 DoD 5개
- [ ] 7종 데이터셋이 모두 동작하는가?
- [ ] Ad Serving 팀이 이 모킹으로 FR-029~034에 착수했는가?

## 🚧 Dependencies & Blockers
- **Depends on**: SPEC-004, SPEC-005, SPEC-006
- **Blocks**: FR-029, FR-030, FR-031, FR-034
- **주의**: SPEC-006은 D-01에 차단되어 있다. 성과 조회 모킹은 D-01 회신 후 완결 가능

---

# [Mock] MOCK-003: Ad Serving 모킹

**labels**: `mock, backend, frontend, priority:high`

## 🎯 Summary
- **Task ID**: MOCK-003
- **Epic (도메인)**: Mock
- **기능명**: [MOCK-003] Ad Serving 2개 엔드포인트 모킹 (클라이언트·UI 개발용)
- **목적**: 클라이언트와 UI 팀이 Ad Serving 실구현(FR-037)을 기다리지 않고 착수하게 한다. **직렬 3단을 병렬 2단으로 줄이는 지점**이다.
- **우선순위 / 복잡도**: Must / M

## 🔗 References (Spec & Context)
- 계약: SPEC-007 · SPEC-008 · `docs/api_v1.yaml`
- 태스크 원장: EPIC M · 소비 주체 FR-046, FR-047, FR-048, UX-002, UX-003
- **SRS 근거: 없음 — 방법론 파생**

## ✅ Task Breakdown (실행 계획)
- [ ] `POST /ads/request` 모킹 — 위치별·단계별 응답
- [ ] `POST /ads/events/click` 모킹 — 멱등 응답 포함
- [ ] `AdPosition` 5종 전수 응답 구성
- [ ] 슬롯 수 변화 응답 (1개·2개·다수)
- [ ] **후보 없음 응답** — SPEC-007 확정 결과 반영
- [ ] 지연 주입 (100ms 초과 상황 재현)

### 필요한 응답 시나리오 — UI가 그려야 하는 모든 상태

| 시나리오 | 응답 | UI가 검증할 것 |
| --- | --- | --- |
| `MAIN_TOP` 1장 | `fallbackStage: 1` | 상단 배너 레이아웃 (UX-002·003) |
| `MAIN_MIDDLE` 2장 | 슬롯 2개 | 슬롯 반복 렌더링 |
| 사이드바 좌·우 | 각 1장 | 데스크톱 전용 레이아웃 |
| 3단계 기본 광고 | `fallbackStage: 3` | 저품질 광고도 동일하게 렌더링되는가 |
| **후보 없음** | SPEC-007 확정 결과 | **빈 지면을 어떻게 그리는가** |
| 지연 | 300ms 응답 | 로딩 처리 · 지면 흔들림(레이아웃 시프트) |
| 오류 | `500` · `503` | 오류 시 지면 처리 |

**"후보 없음"과 "지연" 두 시나리오가 UI 품질을 결정한다.** 광고가 항상 오는 것처럼 만들면
실서비스에서 빈 지면이 깨지거나 레이아웃이 밀린다. **모킹 단계에서 이 두 경우를 먼저 그려야 한다.**

## 🧪 Acceptance Criteria (BDD/GWT)

**Scenario 1: 5개 위치 전수 렌더링**
- **Given**: `AdPosition` 5종 응답이 모두 준비됨
- **When**: UI가 각 위치를 요청함
- **Then**: 5개 위치가 모두 설계대로 렌더링된다 (UX-001 배치 정의 검증)

**Scenario 2: 후보 없음 처리**
- **Given**: 모킹이 "후보 없음" 모드
- **When**: UI가 광고를 요청함
- **Then**: 지면이 깨지지 않고 정의된 방식으로 처리된다 (접기·자리 유지·대체 콘텐츠)

**Scenario 3: 지연 상황 레이아웃**
- **Given**: 300ms 지연이 주입됨
- **When**: 페이지가 렌더링됨
- **Then**: 광고 도착 시 **주변 콘텐츠가 밀리지 않는다** (자리 예약 확인)

**Scenario 4: 클릭 멱등 응답**
- **Given**: 동일 `eventId`로 클릭을 두 번 전송함
- **When**: 두 번째 응답을 받음
- **Then**: `duplicate: true`가 반환되고 클라이언트가 중복 전송을 감지할 수 있다

## ⚙️ Technical & Non-Functional Constraints
- 계약이 단일 진실 원천
- **UI 팀과 클라이언트 팀이 동시 소비**한다 — 접근 방법과 사용법을 문서화할 것

## 🏁 Definition of Done (DoD)
- 모킹 공통 DoD 5개
- [ ] 7종 시나리오가 모두 동작하는가?
- [ ] UX-002·003 담당자가 후보 없음·지연 두 상태를 실제로 그렸는가?

## 🚧 Dependencies & Blockers
- **Depends on**: SPEC-007, SPEC-008
- **Blocks**: FR-046, FR-047, FR-048, UX-002, UX-003
- **SRS 미정의**: 슬롯 수 (부록 D) — 모킹은 임의값으로 진행하고 확정 후 갱신 / 후보 없음 응답 (SPEC-007)

---

# [Mock] MOCK-004: Tracking 모킹

**labels**: `mock, backend, priority:high`

## 🎯 Summary
- **Task ID**: MOCK-004
- **Epic (도메인)**: Mock
- **기능명**: [MOCK-004] Tracking 2개 엔드포인트 모킹
- **목적**: Campaign 성과 조회(FR-028)와 대시보드(UX-006)가 Tracking 실구현을 기다리지 않게 한다.
- **우선순위 / 복잡도**: Must / M

## 🔗 References (Spec & Context)
- 계약: SPEC-009 · SPEC-010 · `docs/api_v1.yaml`
- 태스크 원장: EPIC M · 소비 주체 FR-028, FR-051, UX-006
- **SRS 근거: 없음 — 방법론 파생**

## ✅ Task Breakdown (실행 계획)
- [ ] `POST /tracking/events` 모킹 — 부분 수용·중복·상한 초과 응답
- [ ] `GET .../metrics` 모킹 — 지표 데이터셋
- [ ] `asOf` 시각 변화 재현 (집계 지연 표현)
- [ ] 세그먼트 분해 데이터셋 (합계 정합성 검증용)

### 필요한 지표 데이터셋

| 데이터셋 | 구성 | 검증 대상 |
| --- | --- | --- |
| 정상 지표 | 노출 128,400 · 클릭 386 · CTR 0.30% | 대시보드 기본 표시 |
| **세그먼트 분해** | 36칸 분해, **합계 = 전체** | **MECE 정합성 · UX-006 표 렌더링** |
| 0건 캠페인 | 모든 지표 0 | 신규 캠페인 화면 (`404` 아님) |
| `asOf` 지연 | 5분 전 시각 | **집계 지연 표기 UI** |
| 배치 부분 수용 | `accepted: 98, rejected: 2` | 클라이언트 재전송 로직 |
| 배치 상한 초과 | `413` | 클라이언트 분할 전송 로직 |

**`asOf` 지연 데이터셋이 UX-006의 핵심이다.** 원장 부록 D의 "실시간 vs 5분" 정의 충돌이
화면에서 드러나는 지점이며, **광고주가 방금 클릭을 못 찾을 때 화면이 그 사실을 설명해야 한다.**

## 🧪 Acceptance Criteria (BDD/GWT)

**Scenario 1: 세그먼트 분해 합계 일치**
- **Given**: 36칸 분해 데이터셋
- **When**: UX-006이 지표를 표시함
- **Then**: 세그먼트별 노출 합계가 전체 노출 수와 일치하고, 화면에서 그것이 확인된다

**Scenario 2: 집계 지연 표기**
- **Given**: `asOf`가 5분 전인 응답
- **When**: 대시보드가 렌더링됨
- **Then**: **화면에 "5분 전 기준" 같은 표기가 나타난다**

**Scenario 3: 배치 부분 수용**
- **Given**: `rejected` 2건이 포함된 응답
- **When**: 클라이언트가 응답을 처리함
- **Then**: 거절된 2건만 재전송하고 수용된 98건은 재전송하지 않는다

## ⚙️ Technical & Non-Functional Constraints
- 계약이 단일 진실 원천 — SPEC-006과 SPEC-010의 **스키마 통일 결과를 반영**해야 함
- 실구현 완료 후 폐기 대상

## 🏁 Definition of Done (DoD)
- 모킹 공통 DoD 5개
- [ ] 6종 데이터셋이 모두 동작하는가?
- [ ] SPEC-006 ↔ SPEC-010 스키마 통일 결과가 반영되었는가?
- [ ] UX-006 담당자가 `asOf` 표기를 실제로 설계했는가?

## 🚧 Dependencies & Blockers
- **Depends on**: SPEC-009, SPEC-010
- **Blocks**: FR-028, FR-051, UX-006
- **주의**: SPEC-010은 D-01에 차단되어 있다. 권한 관련 응답은 회신 후 완결
