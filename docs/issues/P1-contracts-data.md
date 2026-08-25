# P1 · 계약 및 데이터 기반 — 12건

**Phase** P1a·P1b(계약 6) · P1c·P1d(데이터·모킹 6)

**원장** `TASKS-adtech-mvp-v1.0.md` v1.2 부록 F · **결정** `docs/W0-decisions.md` · **SRS** v1.1

> 각 섹션은 GitHub 이슈 1건에 대응한다. 흡수된 이슈의 상세는 접힌 블록으로 보존했다.

## 수록 이슈

| 이슈 | 신규 ID | 원장 태스크 수 |
| --- | --- | --- |
| [#1](../../issues/1) | `SPEC-A` | 1 |
| [#2](../../issues/2) | `SPEC-B` | 3 |
| [#5](../../issues/5) | `SPEC-C` | 4 |
| [#7](../../issues/7) | `SPEC-D` | 6 |
| [#8](../../issues/8) | `SPEC-E` | 3 |
| [#9](../../issues/9) | `SPEC-F` | 3 |
| [#12](../../issues/12) | `DB-A` | 7 |
| [#13](../../issues/13) | `DB-B` | 8 |
| [#15](../../issues/15) | `DB-C` | 3 |
| [#16](../../issues/16) | `DB-D` | 2 |
| [#17](../../issues/17) | `MOCK-A` | 6 |
| [#19](../../issues/19) | `MOCK-B` | 8 |

---

# SPEC-A: 공통 규약 확정

**이슈** [#1](../../issues/1) · **신규 ID** `SPEC-A`

**원장 태스크** `SPEC-000`

**단독 유지** — 병합 금지 대상

### 원장 태스크 체크리스트

- [ ] `SPEC-000`

---


**labels**: `spec, contract, backend, priority:high, blocks-all`

## 🎯 Summary
- **Task ID**: SPEC-000
- **Epic (도메인)**: Contract
- **기능명**: [SPEC-000] 전 API 공통 규약 — 인증 헤더 · 오류 응답 형식 · 요청 추적 ID · 소프트 삭제 기본 필터
- **목적**: 10개 계약이 각자 다른 규칙을 만들지 않도록 공통 골격을 먼저 못박는다. **이 태스크가 EPIC S 전체를 차단한다.**
- **우선순위 / 복잡도**: Must / M

## 🔗 References (Spec & Context)
- SRS 요구사항: §6.1 API 목록 · REQ-NF-004 (인증·인가) · REQ-FUNC-007 (소프트 삭제)
- SRS 부속 명세: §6.3 규칙 5 (물리 삭제 금지) · §6.2 enum 전체 (입력 검증 범위)
- 태스크 원장: `TASKS-adtech-mvp-v1.0.md#EPIC-S`
- 확정 안건: `docs/W0-decision-agenda.md` D-01 (인증 방식)

## ✅ Task Breakdown (실행 계획)
- [ ] 인증 방식 확정 — **D-01 회신 반영**
- [ ] 인가 규약 확정 — 자원 소유자 검증 위치와 실패 응답
- [ ] 오류 응답 본문 형식 확정
- [ ] 요청 추적 ID 헤더 규약 확정 — 4개 서비스 로그 연결
- [ ] enum 입력 검증 규칙 — 열거값 밖 입력의 응답
- [ ] 소프트 삭제 제외 필터의 **강제 지점** 확정
- [ ] 개인정보 마스킹 대상 필드 목록 확정 (NF-012 연계)
- [ ] 속도 제한 정책 (제안)

### 확정할 규약

| 항목 | 규약 | 근거 |
| --- | --- | --- |
| 형식 | 요청·응답 JSON (`Content-Type: application/json`) | 관례 |
| 경로 | 전 엔드포인트 `/api/v1/` 접두어 | §6.1 |
| 인증 | 전 API 필수. 방식은 **(미정 — D-01)** | REQ-NF-004 |
| 인가 | 요청 주체 소유 자원만 접근. 위반 시 `403` | **(미정 — D-01)** |
| 요청 추적 | `X-Request-Id` 헤더 필수 **(제안)** | 관측성 — SRS 미정의 |
| 소프트 삭제 | 모든 조회에 `deleted_at IS NULL` 기본 적용 | REQ-FUNC-007 · §6.3 규칙 5 |
| 오류 응답 | `{ "code", "message", "requestId" }` **(제안)** | SRS 미정의 |
| 열거값 | §6.2 정의 밖이면 `400` | §6.2 · REQ-NF-005 |
| 개인정보 | 연령·소득·지역·행동 이력 로깅 시 마스킹 | REQ-NF-004 · NF-012 |
| 속도 제한 | 클라이언트별 상한 **(제안)** | SRS 미정의 |

### 소프트 삭제 필터의 강제 지점 — 이 결정이 중요하다

필터를 애플리케이션 곳곳에 흩어놓으면 **한 군데를 빠뜨리는 순간 삭제된 캠페인이 다시 노출된다.**
소프트 삭제 도입 후 가장 흔한 결함이 정확히 이것이다. 두 안 중 하나를 계약으로 못박아야 한다.

| 안 | 내용 |
| --- | --- |
| **A** | 데이터 접근 계층에서 자동 부착 — 개발자가 잊을 수 없음 (권고) |
| **B** | 필터가 적용된 뷰만 노출하고 원본 테이블 직접 접근 금지 |

## 🧪 Acceptance Criteria (BDD/GWT)

**Scenario 1: 인증 없는 요청**
- **Given**: 인증 정보가 없는 요청
- **When**: 임의의 `/api/v1/` 엔드포인트를 호출함
- **Then**: `401`이 반환되고, 오류 본문이 확정된 형식(`code`·`message`·`requestId`)을 따른다

**Scenario 2: 요청 추적 ID 전파**
- **Given**: `X-Request-Id`가 담긴 요청
- **When**: 4개 서비스를 거치는 호출을 수행함
- **Then**: 네 서비스의 로그에서 동일한 ID로 하나의 요청을 추적할 수 있다

**Scenario 3: 열거값 밖 입력**
- **Given**: §6.2에 없는 enum 값이 담긴 요청
- **When**: 해당 엔드포인트를 호출함
- **Then**: `400`이 반환되고 어떤 데이터도 변경되지 않는다

**Scenario 4: 소프트 삭제 자원 조회**
- **Given**: `deleted_at`이 채워진 자원
- **When**: 조회 API를 호출함
- **Then**: 해당 자원이 결과에 포함되지 않는다 (모든 조회 API에 일관 적용)

**Scenario 5: 개인정보 로깅**
- **Given**: 소득·지역이 담긴 요청
- **When**: 요청이 처리되고 로그가 기록됨
- **Then**: 로그에 해당 값이 평문으로 남지 않는다

## ⚙️ Technical & Non-Functional Constraints
- 이 규약은 **10개 계약과 4개 모킹 서버에 모두 적용**된다. 나중에 바꾸면 전량 수정이다
- 인증 검증 비용이 성능 예산(REQ-NF-001)에 포함된다 — 배분표의 게이트웨이 구간
- 개인정보 마스킹은 D-04의 법무 검토 결과에 따라 대상 범위가 확장될 수 있다

## 🏁 Definition of Done (DoD)
- 공통 DoD 10개 + `[API Spec]` 추가 4개
- [ ] 소프트 삭제 필터의 강제 지점이 A·B 중 하나로 확정되었는가?
- [ ] 마스킹 대상 필드 목록이 문서화되었는가?

## 🚧 Dependencies & Blockers
- **Depends on**: 없음 — **즉시 착수 가능**
- **Blocks**: SPEC-001 ~ SPEC-010 (전부), NF-008
- **SRS 미정의**: **D-01** 인증 방식·인가 규칙 / 오류 응답 형식 / 요청 추적 ID / 속도 제한 — 전부 SRS에 없음

---



# SPEC-B: Audience 계약 3종

**이슈** [#2](../../issues/2) · **신규 ID** `SPEC-B`

**원장 태스크** `SPEC-001` · `SPEC-002` · `SPEC-003`

**흡수한 이슈** #3 · #4

### 원장 태스크 체크리스트

- [ ] `SPEC-001`
- [ ] `SPEC-002`
- [ ] `SPEC-003`

---


**labels**: `spec, contract, backend, audience-service, priority:high`

## 🎯 Summary
- **Task ID**: SPEC-001
- **Epic (도메인)**: Contract
- **기능명**: [SPEC-001] `GET /api/v1/audience/profiles/{userId}` 요청·응답 DTO 및 에러 코드
- **목적**: 광고 요청 경로에서 "이 사용자가 누구인지"를 한 번에 확보하는 계약. 1·2단계 타게팅의 유일한 입력이다.
- **우선순위 / 복잡도**: Must / M

## 🔗 References (Spec & Context)
- SRS 요구사항: §6.1 · REQ-FUNC-001 · REQ-FUNC-002
- SRS 부속 명세: §6.2 인구통계 3종·행동 신호 3종 enum · §6.4 `user_profiles`, `user_behavioral_signals`
- 태스크 원장: EPIC S · 후행 FR-016, MOCK-001
- 학습 해설: `SRS-READER.html` 14~15장

## ✅ Task Breakdown (실행 계획)
- [ ] 응답 스키마 확정 — 복합 세그먼트 문자열과 3개 차원값의 동시 노출 여부
- [ ] 프로파일 미존재 시 응답 확정 **(미정)**
- [ ] 행동 태그 0개일 때 표현 확정 (`null` vs 빈 배열)
- [ ] 에러 코드 목록 확정
- [ ] OpenAPI 반영

### 응답 계약 (제안)

```
200 OK
{
  "userId": "u-10293",
  "demographicSegment": {
    "composite": "AGE_25_34_INCOME_MID_GEOGRAPHY_URBAN",   // 포맷 (미정) — 부록 D
    "ageSegment": "AGE_25_34",
    "incomeSegment": "MID",
    "geographySegment": "URBAN"
  },
  "behavioralSignals": {
    "purchaseIntents":      ["AUTOMOTIVE", "FINANCE"],
    "engagementBehaviors":  ["HIGH_FREQUENCY", "RESEARCH_ORIENTED"],
    "devicePreferences":    ["MOBILE_FIRST"]
  },
  "updatedAt": "2025-06-13T04:21:00Z"                       // (제안)
}
```

| 상태 코드 | 조건 |
| --- | --- |
| `200` | 정상 (프로파일 미존재 시에도 — 아래 결정에 따름) |
| `400` | `userId` 형식 오류 |
| `401` / `403` | 미인증 / 권한 없음 |
| `404` | 프로파일 미존재 **(미정 — 아래)** |

**복합 문자열과 차원값을 함께 반환하는 이유** — 소비자가 둘 다 필요하다.
Ad Serving은 차원별 비교로 타게팅을 판정하고(FR-029·030), Tracking은 복합 문자열로 지표를 분해한다(FR-042).
한쪽만 주면 나머지가 매번 파싱하거나 재조합해야 한다.

## 🧪 Acceptance Criteria (BDD/GWT)

**Scenario 1: 프로파일이 존재하는 사용자**
- **Given**: 세그먼트가 부여되고 행동 태그 3개가 붙은 사용자
- **When**: 계약대로 조회를 요청함
- **Then**: `200`과 함께 복합 세그먼트 1개, 차원값 3개, 카테고리별 태그가 반환된다

**Scenario 2: 프로파일이 없는 사용자**
- **Given**: 기록이 없는 사용자 ID
- **When**: 조회를 요청함
- **Then**: **(미정)** — `404`인가, 빈 프로파일을 담은 `200`인가
  <!-- 이 선택이 FR-029/030의 분기 로직을 바꾼다. 빈 프로파일 200이면 Ad Serving은 단계 판정만 하면 되고,
       404면 예외 처리가 추가된다. 제안: 빈 프로파일 + 200 — 프로파일 부재는 오류가 아니라 3단계 폴백 사유다. -->

**Scenario 3: 행동 태그가 0개**
- **Given**: 인구통계만 있고 태그가 없는 사용자
- **When**: 조회를 요청함
- **Then**: 세 배열이 모두 **빈 배열**로 반환된다 (`null` 아님)

## ⚙️ Technical & Non-Functional Constraints
- 성능: 이 조회는 **광고 요청 경로 안에 있다.** 성능 예산의 Audience 구간(제안 15ms) 이내
- 보안: 소득·지역 응답 로깅 시 마스킹 (SPEC-000 규약)
- 데이터: 소프트 삭제된 프로파일은 반환되지 않음

## 🏁 Definition of Done (DoD)
- 공통 DoD 10개 + `[API Spec]` 추가 4개
- [ ] Scenario 2가 확정되고 FR-029·FR-030 담당자가 동의했는가?
- [ ] 복합 세그먼트 포맷이 §1.3↔§4.1 불일치 해소 결과와 일치하는가?

## 🚧 Dependencies & Blockers
- **Depends on**: SPEC-000
- **Blocks**: FR-016, MOCK-001
- **SRS 미정의**: 세그먼트 포맷 불일치 (부록 D) / 프로파일 미존재 시 응답 (본 이슈 제기)

---


---

<details>
<summary><b>흡수 · #3 [Spec] SPEC-002: 세그먼트 갱신 계약</b></summary>


**labels**: `spec, contract, backend, audience-service, priority:high`

### 🎯 Summary
- **Task ID**: SPEC-002
- **Epic (도메인)**: Contract
- **기능명**: [SPEC-002] `POST /api/v1/audience/profiles/{userId}/segments` 요청·응답 DTO 및 에러 코드
- **목적**: 사용자를 36칸 격자 중 정확히 한 칸에 배치하는 계약. MECE 원칙이 계약 수준에서 강제되는 지점이다.
- **우선순위 / 복잡도**: Must / M

### 🔗 References (Spec & Context)
- SRS 요구사항: §6.1 · REQ-FUNC-001 · §6.3 규칙 1
- SRS 부속 명세: §6.2 `AgeSegment`(4) · `IncomeSegment`(3) · `GeographySegment`(3) → 36조합
- 태스크 원장: EPIC S · 후행 FR-017, MOCK-001

### ✅ Task Breakdown (실행 계획)
- [ ] **요청 형식 결정** — 원시값 전달(안 A) vs enum 직접 지정(안 B)
- [ ] 부분 갱신 불허 규칙 명시
- [ ] 경계값 귀속 규칙 문서화 **(미정)**
- [ ] 차원 미상 사용자 처리 **(미정)**
- [ ] 에러 코드 목록 확정

#### 요청 계약 — 두 안 중 확정 필요 **(미정)**

```
안 A · 원시값 전달 — 분류는 서버 책임 (권고)
{ "age": 29, "annualIncome": 72000, "region": "SEOUL_GANGNAM" }

안 B · enum 직접 지정 — 분류는 호출자 책임
{ "ageSegment": "AGE_25_34", "incomeSegment": "MID", "geographySegment": "URBAN" }
```

**A를 권고한다.** §5가 `DemographicSegmentClassifier`를 Audience Service의 구현 클래스로 지정했으므로
분류 책임은 서버에 있다. B를 택하면 분류기의 역할이 불분명해지고, 호출자마다 다른 기준으로 분류할 여지가 생긴다.

**단 A는 두 값을 요구한다** — `IncomeSegment`의 **통화 단위**와 지역 → `URBAN`/`SUBURBAN`/`RURAL` **판정 기준**.
둘 다 SRS에 없다(부록 D). 확정 전에는 안 A의 계약을 완결할 수 없다.

| 상태 코드 | 조건 |
| --- | --- |
| `200` | 갱신 성공 — 배정된 복합 세그먼트 반환 |
| `400` | 열거값 밖 / 3개 차원 미충족 / 판정 불가 입력 |
| `401` / `403` | 미인증 / 권한 없음 |

### 🧪 Acceptance Criteria (BDD/GWT)

**Scenario 1: 신규 세그먼트 부여**
- **Given**: 3개 차원을 모두 판정할 수 있는 입력
- **When**: 갱신을 요청함
- **Then**: `200`과 함께 배정된 복합 세그먼트가 반환된다

**Scenario 2: 부분 갱신 시도 — MECE 방어**
- **Given**: 3개 차원 중 하나만 담긴 요청
- **When**: 갱신을 요청함
- **Then**: `400`이 반환된다. **불완전 세그먼트는 생성되지 않는다**

**Scenario 3: 열거값 밖 입력**
- **Given**: `"URBAM"` 같은 정의되지 않은 값 (안 B 기준)
- **When**: 갱신을 요청함
- **Then**: `400`이 반환되고 기존 세그먼트가 변경되지 않는다

**Scenario 4: 경계값**
- **Given**: 만 25세 / 소득 정확히 50,000 / 소득 50,001
- **When**: 각각 갱신을 요청함
- **Then**: **(미정)** — 각 경계의 귀속 칸이 계약에 명시되어 있어야 한다

**Scenario 5: 차원 데이터 미상**
- **Given**: 소득을 알 수 없는 사용자
- **When**: 갱신을 요청함
- **Then**: **(미정)** — `UNKNOWN` 값이 §6.2에 없어 답이 없다. **MECE 전체 포괄이 깨지는 지점**

### ⚙️ Technical & Non-Functional Constraints
- 데이터: 3개 차원 모두 필수. 사용자당 세그먼트 정확히 1개 (§6.3 규칙 1)
- 보안: 안 A 채택 시 소득 원시값 **평문 로깅 금지** (SPEC-000 · NF-012)
- 유지보수성: 새 enum 값 추가 시 계약 변경 불필요 (REQ-NF-005)

### 🏁 Definition of Done (DoD)
- 공통 DoD 10개 + `[API Spec]` 추가 4개
- [ ] 안 A·B 중 하나가 확정되었는가?
- [ ] 경계값 4건의 귀속이 계약 문서에 기록되었는가?

### 🚧 Dependencies & Blockers
- **Depends on**: SPEC-000
- **Blocks**: FR-017, MOCK-001
- **SRS 미정의**: 통화 단위 / 지역 판정 기준 / `UNKNOWN` 세그먼트 부재 / 경계값 귀속 — 전부 부록 D

---


</details>

---

<details>
<summary><b>흡수 · #4 [Spec] SPEC-003: 행동 신호 추가 계약</b></summary>


**labels**: `spec, contract, backend, audience-service, priority:high`

### 🎯 Summary
- **Task ID**: SPEC-003
- **Epic (도메인)**: Contract
- **기능명**: [SPEC-003] `POST /api/v1/audience/profiles/{userId}/behavioral-signals` 요청·응답 DTO 및 에러 코드
- **목적**: 구매 의도·참여 행동·디바이스 선호 태그를 누적하는 계약. 1단계 정밀 타게팅의 유일한 입력원이다.
- **우선순위 / 복잡도**: Must / M

### 🔗 References (Spec & Context)
- SRS 요구사항: §6.1 · REQ-FUNC-002 · §6.3 규칙 2
- SRS 부속 명세: §6.2 `PurchaseIntent`(7) · `EngagementBehavior`(5) · `DevicePreference`(4)
- 태스크 원장: EPIC S · 후행 FR-018, MOCK-001
- 학습 해설: `SRS-READER.html` 15장

### ✅ Task Breakdown (실행 계획)
- [ ] 단건 vs 배열 전송 확정
- [ ] 누적(append) vs 교체(replace) 확정
- [ ] 동일 태그 재전송 처리 확정
- [ ] 배열 내 일부 오류 시 처리 (전부 실패 vs 부분 수용)
- [ ] 태그 개수 상한 **(미정)**

#### 요청 계약 (제안)

```
POST .../behavioral-signals
{
  "signals": [
    { "category": "PURCHASE_INTENT",     "value": "AUTOMOTIVE" },
    { "category": "ENGAGEMENT_BEHAVIOR", "value": "RESEARCH_ORIENTED" },
    { "category": "DEVICE_PREFERENCE",   "value": "MOBILE_FIRST" }
  ]
}

201 Created
{ "userId": "u-10293", "added": 3, "totalSignals": 5 }
```

**누적을 기본으로 제안한다.** REQ-FUNC-002가 "복수의 태그를 부여받아야 한다"이므로 교체가 아니라 누적이 자연스럽다.
**단 그 경우 태그가 무한히 쌓인다** — 유효 기간이나 상한이 필요한데 SRS에 없다(§7.2가 동적 태깅을 향후로 이관).

### 🧪 Acceptance Criteria (BDD/GWT)

**Scenario 1: 서로 다른 카테고리에 태그 3개**
- **Given**: 태그가 없는 사용자
- **When**: 3개 카테고리에 각 1개씩 추가함
- **Then**: `201`이 반환되고 카테고리별로 정확히 1개씩 조회된다

**Scenario 2: 같은 카테고리에 태그 2개 — 멀티 태그 성립 확인**
- **Given**: `PURCHASE_INTENT`에 `AUTOMOTIVE`가 부여된 사용자
- **When**: 동일 카테고리에 `FINANCE`를 추가함
- **Then**: `201`이 반환되고 **두 값이 모두 유지**된다 (교체되지 않음)

**Scenario 3: 동일 태그 재전송**
- **Given**: `AUTOMOTIVE`가 이미 부여된 사용자
- **When**: 같은 태그를 다시 추가함
- **Then**: **(제안)** `200`이 반환되고 태그는 1개로 유지된다 (멱등)

**Scenario 4: 배열 내 열거값 밖 항목**
- **Given**: `"CRYPTO"` 처럼 §6.2에 없는 값이 섞인 배열
- **When**: 추가를 요청함
- **Then**: `400`이 반환되고 **배열의 다른 항목도 저장되지 않는다** (전부 성공 또는 전부 실패)

**Scenario 5: 태그 개수 상한**
- **Given**: 태그가 다수 부여된 사용자
- **When**: 추가를 요청함
- **Then**: **(미정)** — REQ-FUNC-002 인수 기준에 최소·최대가 없어 판정 불가

### ⚙️ Technical & Non-Functional Constraints
- 데이터: 사용자당 다수 행(일대다). **"이 태그를 가진 사용자 전부"** 역방향 조회가 FR-029의 입력이므로 색인 전제
- 성능: 이 엔드포인트는 광고 요청 경로 **밖**이다. 쓰기 지연이 100ms 예산에 포함되지 않음
- 유지보수성: 새 태그 값 추가 시 계약 변경 불필요

### 🏁 Definition of Done (DoD)
- 공통 DoD 10개 + `[API Spec]` 추가 4개
- [ ] 누적·교체 중 하나가 확정되었는가?
- [ ] **MVP에서 이 API를 호출하는 주체가 정해졌는가?**
  <!-- §7.2가 동적 태깅을 향후로 미뤘으므로 MVP에서 태그가 자동으로 붙지 않는다.
       CRM 매니저의 수동 입력인가, 외부 User Profile Service의 배치 전송(FR-049)인가. -->

### 🚧 Dependencies & Blockers
- **Depends on**: SPEC-000
- **Blocks**: FR-018, MOCK-001
- **SRS 미정의**: 태그 최소·최대 개수 (REQ-FUNC-002 검증 불가) / 유효 기간·신뢰도 (§7.2) / **호출 주체 미정**

---


</details>


# SPEC-C: Campaign 계약 2종 — 생성·타게팅

**이슈** [#5](../../issues/5) · **신규 ID** `SPEC-C`

**원장 태스크** `SPEC-004` · `SPEC-005`

**흡수한 이슈** #6

### 원장 태스크 체크리스트

- [ ] `SPEC-004`
- [ ] `SPEC-005`

---


**labels**: `spec, contract, backend, campaign-service, priority:high`

## 🎯 Summary
- **Task ID**: SPEC-004
- **Epic (도메인)**: Contract
- **기능명**: [SPEC-004] `POST /api/v1/campaigns` 요청·응답 DTO 및 에러 코드
- **목적**: 광고주의 예산과 입찰 조건을 등재하는 계약. 이 자원이 없으면 광고 후보가 존재하지 않는다.
- **우선순위 / 복잡도**: Must / M

## 🔗 References (Spec & Context)
- SRS 요구사항: §6.1 · REQ-FUNC-003 · §6.3 규칙 7
- SRS 부속 명세: §6.2 `CampaignStatus`(4) · `BiddingStrategy`(3) · §6.4 `campaigns`
- 태스크 원장: EPIC S · 후행 FR-026, MOCK-002

## ✅ Task Breakdown (실행 계획)
- [ ] 요청 필드 확정 — 예산·입찰가·기간
- [ ] 예산·입찰가 **통화 단위** 명시 **(미정)**
- [ ] 캠페인 기간 필드 신설 여부 확정 **(제안)**
- [ ] 초기 상태 `DRAFT` 고정 명시
- [ ] 소유자 귀속 규약 — **D-01 반영**

### 요청 계약 (제안)

```
POST /api/v1/campaigns
{
  "name": "2025 여름 자동차 프로모션",
  "biddingStrategy": "CPM",              // §6.2 BiddingStrategy
  "bidAmount": 3000,                     // 단위 (미정)
  "totalBudget": 5000000,
  "dailyBudgetCap": 500000,              // §6.3 규칙 7
  "startAt": "2025-07-01T00:00:00Z",     // (제안) — §6.4에 기간 컬럼 미명시
  "endAt":   "2025-07-31T23:59:59Z"      // (제안)
}

201 Created
{ "campaignId": "cmp-8842", "status": "DRAFT", "createdAt": "..." }
```

**`startAt`·`endAt`을 제안하는 근거** — §6.2 `CampaignStatus`에 `COMPLETED`가 있다.
무엇이 캠페인을 완료로 만드는지 규정이 없는데, 예산 소진(규칙 7)은 `PAUSED`로 이어지므로
`COMPLETED`의 조건은 **기간 만료**일 가능성이 높다. **기간 필드가 없으면 이 상태에 도달할 방법이 없다.**

| 상태 코드 | 조건 |
| --- | --- |
| `201` | 생성 성공 |
| `400` | 열거값 밖 / 예산 구성 모순 / 필수 필드 누락 |
| `401` / `403` | 미인증 / 권한 없음 |

## 🧪 Acceptance Criteria (BDD/GWT)

**Scenario 1: 정상 생성**
- **Given**: 유효한 입찰 전략·입찰가·예산
- **When**: 생성을 요청함
- **Then**: `201`과 함께 `campaignId`가 반환되고 상태는 `DRAFT`다

**Scenario 2: 일일 상한이 총예산 초과**
- **Given**: `totalBudget` 100,000 · `dailyBudgetCap` 500,000
- **When**: 생성을 요청함
- **Then**: **(제안)** `400`. 논리적으로 성립할 수 없는 예산 구성이다

**Scenario 3: 열거값 밖 입찰 전략**
- **Given**: `biddingStrategy`가 `"CPV"`
- **When**: 생성을 요청함
- **Then**: `400`이 반환된다

**Scenario 4: 생성 직후 후보 배제**
- **Given**: 방금 생성된 `DRAFT` 캠페인
- **When**: 해당 타게팅에 맞는 광고 요청이 들어옴
- **Then**: 이 캠페인은 후보에 포함되지 않는다 (`ACTIVE`만 후보)

## ⚙️ Technical & Non-Functional Constraints
- 데이터: 생성 상태는 `DRAFT` 고정. 이 API로 `ACTIVE` 진입 불허 (상태 전이는 FR-020)
- 보안: 생성자를 소유자로 귀속 (**D-01**)
- 데이터: 소프트 삭제 컬럼 포함

## 🏁 Definition of Done (DoD)
- 공통 DoD 10개 + `[API Spec]` 추가 4개
- [ ] 통화 단위가 계약에 명시되었는가?
- [ ] `COMPLETED` 진입 조건이 정의되었는가?

## 🚧 Dependencies & Blockers
- **Depends on**: SPEC-000
- **Blocks**: FR-026, MOCK-002
- **SRS 미정의**: 통화 단위 / `COMPLETED` 진입 조건 / 기간 필드 부재 / **D-01** 소유자 귀속

---


---

<details>
<summary><b>흡수 · #6 [Spec] SPEC-005: 타게팅 갱신 계약 · 조건 결합 규칙</b></summary>


**labels**: `spec, contract, backend, campaign-service, priority:high`

### 🎯 Summary
- **Task ID**: SPEC-005
- **Epic (도메인)**: Contract
- **기능명**: [SPEC-005] `PUT /api/v1/campaigns/{campaignId}/targeting` 요청·응답 DTO 및 **조건 결합 규칙**
- **목적**: 이 캠페인이 노리는 오디언스를 지정하는 계약. **조건 결합 규칙이 FR-029·FR-030 구현의 유일한 기준이다.**
- **우선순위 / 복잡도**: Must / H

### 🔗 References (Spec & Context)
- SRS 요구사항: §6.1 · REQ-FUNC-003 · §1.2 범위
- SRS 부속 명세: §6.2 인구통계·행동 신호 enum 전체 · §6.4 `campaign_targeting` **(비정규화)**
- 태스크 원장: EPIC S · 후행 FR-027, MOCK-002, FR-029, FR-030

### ✅ Task Breakdown (실행 계획)
- [ ] **조건 결합 규칙 확정** — 계약의 핵심 산출물
- [ ] `PUT` 의미 확정 — 전체 교체 (부분 수정 필요 시 `PATCH` 신설 검토)
- [ ] 빈 배열의 의미 확정 ("제약 없음")
- [ ] 인구통계 없이 행동 조건만 지정하는 경우의 처리
- [ ] 소유자 검증 규약 — **D-01 반영**

#### 요청 계약 (제안)

```
PUT /api/v1/campaigns/cmp-8842/targeting
{
  "demographic": {
    "ageSegments":       ["AGE_25_34", "AGE_35_44"],
    "incomeSegments":    ["MID", "HIGH"],
    "geographySegments": ["URBAN"]
  },
  "behavioral": {
    "purchaseIntents":     ["AUTOMOTIVE"],
    "engagementBehaviors": [],
    "devicePreferences":   ["MOBILE_FIRST", "MULTI_DEVICE"]
  }
}
```

#### 조건 결합 규칙 **(미정 — 이 계약의 핵심)**

SRS는 타게팅 "조건"을 요구하지만 **조건을 어떻게 결합하는지 규정하지 않는다.** 제안은 다음이다.

> **차원 내부는 OR, 차원 간은 AND. 빈 배열은 "제약 없음".**
> 위 예시는 *(25\~34세 OR 35\~44세) AND (중소득 OR 고소득) AND (도시) AND (자동차 관심) AND (모바일 우선 OR 멀티 디바이스)* 로 해석된다.

**이 규칙이 확정되지 않으면 FR-029·FR-030의 매칭 구현이 개발자마다 달라진다.**
같은 캠페인이 어떤 구현에서는 후보가 되고 다른 구현에서는 되지 않는다. 계약에서 못박아야 한다.

| 상태 코드 | 조건 |
| --- | --- |
| `200` | 갱신 성공 |
| `400` | 열거값 밖 / 형식 오류 |
| `401` / `403` | 미인증 / **타 광고주 캠페인** |
| `404` | 캠페인 미존재 |

### 🧪 Acceptance Criteria (BDD/GWT)

**Scenario 1: 인구통계 + 행동 조건 지정**
- **Given**: `ACTIVE` 캠페인과 위 예시 형태의 조건
- **When**: 갱신을 요청함
- **Then**: `200`이 반환되고, 조건에 부합하는 사용자의 광고 요청에서 이 캠페인이 **1단계** 후보로 나타난다

**Scenario 2: 행동 조건을 모두 비움**
- **Given**: `behavioral`의 세 배열이 모두 빈 배열
- **When**: 갱신을 요청함
- **Then**: `200`이 반환되고, 이 캠페인은 **2단계**(인구통계 전용) 후보로 동작한다

**Scenario 3: 전체 교체 의미 확인**
- **Given**: `purchaseIntents`에 2개 값이 설정된 캠페인
- **When**: 1개만 담긴 `PUT`을 보냄
- **Then**: 기존 2개가 **제거되고** 새 1개만 남는다

**Scenario 4: 타 광고주 캠페인 수정 시도**
- **Given**: 광고주 A의 인증 정보와 광고주 B의 `campaignId`
- **When**: 갱신을 요청함
- **Then**: `403`이 반환되고 변경되지 않는다 **(D-01 확정 대기)**

### ⚙️ Technical & Non-Functional Constraints
- 성능: 이 데이터는 **광고 요청 경로에서 읽힌다.** §6.4가 비정규화를 명시한 이유이며, 조회 최적화가 갱신 편의보다 우선
- 데이터: 조건 결합 규칙이 저장 구조를 결정한다. **규칙 확정 전 스키마 확정 불가**
- 보안: 소유자 검증 필수 (**D-01**)

### 🏁 Definition of Done (DoD)
- 공통 DoD 10개 + `[API Spec]` 추가 4개
- [ ] 조건 결합 규칙이 문서로 확정되고 **FR-029·FR-030 담당자가 동일하게 해석**하는가?
- [ ] 빈 배열의 의미가 계약에 명시되었는가?

### 🚧 Dependencies & Blockers
- **Depends on**: SPEC-000
- **Blocks**: FR-027, MOCK-002, **FR-029, FR-030** (구현 기준)
- **SRS 미정의**: 조건 결합 규칙 (본 이슈 제기) / **D-01** 소유자 검증

---


</details>


# SPEC-D: 성과 조회 계약 2종 — 스키마 통일

**이슈** [#7](../../issues/7) · **신규 ID** `SPEC-D`

**원장 태스크** `SPEC-006` · `SPEC-010`

**흡수한 이슈** #11

### 원장 태스크 체크리스트

- [ ] `SPEC-006`
- [ ] `SPEC-010`

---


**labels**: `spec, contract, backend, campaign-service, priority:high, blocked-d01`

## 🎯 Summary
- **Task ID**: SPEC-006
- **Epic (도메인)**: Contract
- **기능명**: [SPEC-006] `GET /api/v1/campaigns/{campaignId}/performance` 요청·응답 DTO 및 에러 코드
- **목적**: 광고주가 집행 결과를 확인하는 계약. **정산과 직결되는 숫자를 노출하는 경로**다.
- **우선순위 / 복잡도**: Must / M

## 🔗 References (Spec & Context)
- SRS 요구사항: §6.1 · REQ-FUNC-008 · §6.3 규칙 8 (5분 주기)
- SRS 부속 명세: §6.4 `campaign_performance_realtime` **(구체화 뷰)**
- 태스크 원장: EPIC S · 후행 FR-028, MOCK-002 · **SPEC-010과 스키마 통일**
- 확정 안건: `docs/W0-decision-agenda.md` **D-01 (이 계약의 착수 차단 요인)**

## ⚠️ SPEC-010과의 중복 — 이 계약에서 결정한다

§6.1은 성과 조회 엔드포인트를 **두 개** 정의한다.

| | SPEC-006 / FR-028 | SPEC-010 / FR-045 |
| --- | --- | --- |
| 경로 | `/campaigns/{id}/performance` | `/tracking/campaigns/{id}/metrics` |
| 소속 | Campaign Service | Tracking Service |
| 설명 | "캠페인 성과 지표 조회" | "실시간 캠페인 성과 지표" |

**반환할 숫자는 같은 원천(구체화 뷰)에서 나온다.** 두 계약이 다른 스키마를 갖게 되면
**광고주 화면과 대시보드가 다른 숫자를 보여주는 사고**가 발생한다.

| 안 | 내용 |
| --- | --- |
| **A** | **응답 스키마 통일 + 두 경로 유지** (권고) — 소비자가 다름(포털 vs 대시보드), 스키마 정의는 한 곳 |
| **B** | SPEC-006을 SPEC-010으로 위임(프록시) |
| **C** | 하나를 폐기 — §6.1 수정 필요 |

## ✅ Task Breakdown (실행 계획)
- [ ] SPEC-010과 응답 스키마 통일 (안 확정)
- [ ] `asOf` 필드 규약 확정 — 집계 지연을 계약으로 설명
- [ ] 기간·세그먼트 분해 파라미터 설계
- [ ] **소유자 검증 규약 — D-01 회신 필수**
- [ ] 에러 코드 목록 확정

### 응답 계약 (제안)

```
200 OK
{
  "campaignId": "cmp-8842",
  "asOf": "2025-06-13T04:20:00Z",       // 집계 기준 시각 — 5분 주기 (§6.3 규칙 8)
  "totals": {
    "impressions": 128400, "clicks": 386, "conversions": 12,
    "ctr": 0.0030, "cpc": 812.5, "ecpm": 2441.0, "spend": 313625
  },
  "byDemographicSegment": [ ... ],       // REQ-FUNC-008 — 세그먼트 기준 분해
  "byBehavioralSignal":  [ ... ]         // REQ-FUNC-008 — 태그 기준 분해
}
```

**`asOf`가 이 계약의 핵심이다.** REQ-FUNC-008은 "실시간 기록"을, §6.3 규칙 8은 "5분 주기 갱신"을 말한다.
둘은 다른 일이지만 문서가 구분하지 않아 **광고주가 방금 클릭을 못 찾을 때 설명할 근거가 없다.**
응답에 집계 기준 시각을 실으면 그 설명이 계약으로 해결된다.

## 🧪 Acceptance Criteria (BDD/GWT)

**Scenario 1: 지표 조회와 정합성**
- **Given**: 노출 100건·클릭 3건이 집계된 캠페인
- **When**: 성과 조회를 요청함
- **Then**: `200`과 함께 CTR 3%가 반환되고 `asOf`가 5분 이내 시각이다

**Scenario 2: 세그먼트 분해 합계 검증**
- **Given**: 여러 세그먼트에 걸쳐 노출이 발생한 캠페인
- **When**: 성과 조회를 요청함
- **Then**: `byDemographicSegment`의 노출 합계가 `totals.impressions`와 **정확히 일치**한다
  <!-- 이 시나리오가 MECE 준수의 최종 확인이다. 초과하면 세그먼트가 겹친 것이고, 미달이면 누락된 것이다. -->

**Scenario 3: 타 광고주 캠페인 조회 시도**
- **Given**: 광고주 A의 인증 정보와 광고주 B의 `campaignId`
- **When**: 성과 조회를 요청함
- **Then**: `403`이 반환되고 **어떤 숫자도 노출되지 않는다**
  <!-- 이 시나리오가 D-01의 직접 검증 지점이다. -->

**Scenario 4: 집계 이전의 신규 캠페인**
- **Given**: 생성 직후 노출 0건인 캠페인
- **When**: 성과 조회를 요청함
- **Then**: `200`과 함께 모든 지표가 0으로 반환된다 (`404` 아님)

## ⚙️ Technical & Non-Functional Constraints
- 성능: 광고 요청 경로 **밖**. 다만 대량 분해 조회가 운영 DB를 압박하지 않아야 함 (OLTP·OLAP 분리 검토)
- 정확성: **정산에 쓰이는 숫자다.** 분해 합계와 전체 합계가 반드시 일치
- 보안: **이 엔드포인트가 D-01의 핵심 위험 지점이다**

## 🏁 Definition of Done (DoD)
- 공통 DoD 10개 + `[API Spec]` 추가 4개
- [ ] SPEC-010과 응답 스키마가 통일되었는가?
- [ ] `asOf` 의미가 계약과 광고주 화면(UX-006) 양쪽에 반영되었는가?

## 🚧 Dependencies & Blockers
- **Depends on**: SPEC-000
- **Blocks**: FR-028, MOCK-002, SPEC-010(스키마 통일), UX-006
- **SRS 미정의**: **D-01 소유자 검증 — 착수 차단** / 정산 확정 시점 / SPEC-010과의 역할 분담

---


---

<details>
<summary><b>흡수 · #11 [Spec] SPEC-010: 실시간 지표 조회 계약</b></summary>


**labels**: `spec, contract, backend, tracking-service, priority:high, blocked-d01`

### 🎯 Summary
- **Task ID**: SPEC-010
- **Epic (도메인)**: Contract
- **기능명**: [SPEC-010] `GET /api/v1/tracking/campaigns/{campaignId}/metrics` 요청·응답 DTO 및 에러 코드
- **목적**: 대시보드가 최신 집계 결과를 읽는 계약. **SPEC-006과 숫자가 일치해야 한다.**
- **우선순위 / 복잡도**: Must / M

### 🔗 References (Spec & Context)
- SRS 요구사항: §6.1 · REQ-FUNC-008 · §6.3 규칙 8
- SRS 부속 명세: §6.4 `campaign_performance_realtime`
- 태스크 원장: EPIC S · 후행 FR-045, MOCK-004 · **선행 SPEC-006(스키마 통일)**
- **SPEC-006의 "중복" 절을 함께 읽을 것**

### ✅ Task Breakdown (실행 계획)
- [ ] SPEC-006과 응답 스키마 통일 (안 A·B·C 중 확정)
- [ ] 시간 구간 파라미터 설계 (`from`·`to`·`granularity`)
- [ ] `asOf` 규약 — SPEC-006과 동일
- [ ] 소유자·내부 운영자 권한 구분 — **D-01 연계**

#### 응답 계약

**SPEC-006과 동일 스키마를 사용한다** (안 A 권고). 차이는 파라미터뿐이다.

```
GET /api/v1/tracking/campaigns/cmp-8842/metrics?from=...&to=...&granularity=5m

200 OK
{
  "campaignId": "cmp-8842",
  "asOf": "2025-06-13T04:20:00Z",
  "granularity": "5m",
  "totals": { ... },                  // SPEC-006과 동일 구조
  "series": [ { "at": "...", "impressions": ..., "clicks": ... } ],   // (제안)
  "byDemographicSegment": [ ... ],
  "byBehavioralSignal":  [ ... ]
}
```

### 🧪 Acceptance Criteria (BDD/GWT)

**Scenario 1: 최신 집계 조회**
- **Given**: 5분 주기 집계가 동작 중인 캠페인
- **When**: 지표 조회를 요청함
- **Then**: `200`과 함께 `asOf`가 **5분 이내** 시각으로 반환된다

**Scenario 2: SPEC-006과의 숫자 일치**
- **Given**: 동일 캠페인·동일 시점
- **When**: 두 엔드포인트를 각각 호출함
- **Then**: `totals`의 모든 값이 **일치**한다
  <!-- 두 경로가 다른 숫자를 반환하면 광고주 화면과 대시보드가 어긋난다. 이 시나리오가 그 방어선이다. -->

**Scenario 3: 집계 직전 발생한 이벤트**
- **Given**: 방금 전송된 클릭이 아직 집계되지 않음
- **When**: 지표 조회를 요청함
- **Then**: 해당 클릭은 포함되지 않으며 `asOf`가 그 사실을 설명한다

**Scenario 4: 권한**
- **Given**: 타 광고주 또는 미인증 요청
- **When**: 지표 조회를 요청함
- **Then**: `403` 또는 `401`이 반환된다 **(D-01 확정 대기)**

### ⚙️ Technical & Non-Functional Constraints
- 성능: 대시보드 조회가 이벤트 수집(SPEC-009)을 방해하지 않아야 함 — OLTP·OLAP 분리 검토
- 정확성: SPEC-006과 동일 원천·동일 스키마
- 보안: 소유자 검증 (**D-01**)

### 🏁 Definition of Done (DoD)
- 공통 DoD 10개 + `[API Spec]` 추가 4개
- [ ] SPEC-006과 스키마가 통일되었는가?
- [ ] `asOf`와 집계 주기가 대시보드 화면(UX-006) 설계에 반영되었는가?

### 🚧 Dependencies & Blockers
- **Depends on**: SPEC-000, SPEC-006 (스키마 통일)
- **Blocks**: FR-045, MOCK-004, FR-051, UX-006
- **SRS 미정의**: **D-01 소유자 검증 — 착수 차단** / "실시간" 정의 충돌 (REQ-FUNC-008 vs §6.3 규칙 8) / SPEC-006과의 역할 분담

---


</details>


# SPEC-E: 광고 요청 계약 — 최우선

**이슈** [#8](../../issues/8) · **신규 ID** `SPEC-E`

**원장 태스크** `SPEC-007`

**단독 유지** — 병합 금지 대상

### 원장 태스크 체크리스트

- [ ] `SPEC-007`

---


**labels**: `spec, contract, backend, ad-serving, priority:high, critical-path`

## 🎯 Summary
- **Task ID**: SPEC-007
- **Epic (도메인)**: Contract
- **기능명**: [SPEC-007] `POST /api/v1/ads/request` 요청·응답 DTO 및 에러 코드
- **목적**: **시스템 전체가 이 한 호출을 위해 존재한다.** 나머지 계약은 이것을 위한 입력·출력이다.
- **우선순위 / 복잡도**: Must / H

## 🔗 References (Spec & Context)
- SRS 요구사항: §6.1 · REQ-FUNC-004 (3단계) · REQ-FUNC-005 (수익 최적화) · REQ-FUNC-006 (슬롯) · REQ-NF-001 (100ms)
- SRS 부속 명세: §6.2 `AdPosition`(5) · `FallbackStage`(3) · §6.3 규칙 3·4
- 태스크 원장: EPIC S · 후행 FR-037, MOCK-003
- 학습 해설: `SRS-READER.html` 16장 (3단계 폴백) · 19장 (100ms 예산)

## ✅ Task Breakdown (실행 계획)
- [ ] 요청 필드 확정 — 3단계 컨텍스트 광고에 필요한 페이지 정보 포함 여부
- [ ] 응답 필드 확정 — 광고 배열 + `fallbackStage` + `requestId`
- [ ] **성능 예산 배분표 작성** — 100ms를 구간별로 나눠 각 팀 배정 (D-05 연계, 이 태스크의 부수 산출물)
- [ ] 단계별 타임아웃 규약 — 3단계까지 내려간 요청이 예산을 넘기지 않도록
- [ ] `requestId` 발급 규약 — 이후 이벤트가 이 ID로 요청과 연결
- [ ] 후보 없음 응답 확정 **(미정)**
- [ ] 슬롯 수 파라미터 처리 **(미정)**

### 요청·응답 계약 (제안)

```
POST /api/v1/ads/request
{
  "userId": "u-10293",
  "position": "MAIN_TOP",                  // §6.2 AdPosition
  "slotCount": 2,                          // (미정) — REQ-FUNC-006의 "정의된 슬롯 수"가 문서에 없음
  "pageContext": { "category": "AUTOMOTIVE" },   // (제안) 3단계 컨텍스트 광고용
  "deviceType": "MOBILE"                   // (제안) — §3의 mobile/desktop 분리 연계
}

200 OK
{
  "requestId": "req-7f31a9",               // 이벤트 연결용 — 필수
  "fallbackStage": 1,                      // §6.2 FallbackStage — "성과 분석용"으로 명시됨
  "ads": [
    { "campaignId": "cmp-8842", "creativeId": "crt-221",
      "creativeUrl": "https://.../banner.png", "landingUrl": "https://...",
      "position": "MAIN_TOP", "slotIndex": 0 }
  ]
}
```

**`fallbackStage`를 응답에 넣는 근거** — §6.2가 `FallbackStage` enum에 **"성과 분석용"** 이라고 못박았다.
모든 응답에 단계를 실어야 단계별 비율을 볼 수 있다.
**1단계 비율이 낮으면 타게팅이 실패 중이라는 신호이고, 그 지표 없이는 기능이 "정상 동작"으로 보이면서 사업이 실패한다.**

| 상태 코드 | 조건 |
| --- | --- |
| `200` | 광고 반환 (후보 없음 포함 — 아래 결정에 따름) |
| `204` | 후보 없음 **(미정 — 아래)** |
| `400` | 열거값 밖 `position` / 필수 필드 누락 |
| `401` | 미인증 |
| `429` | 속도 제한 초과 |
| `503` | 과부하 |

## 🧪 Acceptance Criteria (BDD/GWT)

**Scenario 1: 1단계 정밀 타게팅으로 채워짐**
- **Given**: 인구통계와 행동 태그를 갖춘 사용자, 부합하는 `ACTIVE` 캠페인
- **When**: 광고를 요청함
- **Then**: `200`과 함께 광고가 반환되고 `fallbackStage`는 **1**이다

**Scenario 2: 2단계로 내려감**
- **Given**: 인구통계만 있는 사용자, 인구통계 조건만 지정된 캠페인
- **When**: 광고를 요청함
- **Then**: `200`과 함께 광고가 반환되고 `fallbackStage`는 **2**다

**Scenario 3: 3단계로 내려감**
- **Given**: 프로파일 정보가 전혀 없는 신규 사용자
- **When**: 광고를 요청함
- **Then**: `200`과 함께 위치 기반 기본 광고가 반환되고 `fallbackStage`는 **3**이다

**Scenario 4: 3단계에서도 후보가 없음**
- **Given**: 어떤 단계에서도 후보 캠페인이 없는 상태
- **When**: 광고를 요청함
- **Then**: **(미정)** — 빈 배열 `200`인가, `204`인가, 오류인가
  <!-- 클라이언트가 빈 지면을 어떻게 그릴지가 여기서 결정된다. UX-002·003과 함께 확정.
       제안: 빈 배열 + 200. 광고 부재는 오류가 아니다. -->

**Scenario 5: 슬롯 수만큼 서로 다른 광고**
- **Given**: `MAIN_TOP`의 슬롯 수가 2로 정의되고 후보가 3개 이상
- **When**: 광고를 요청함
- **Then**: 광고 2개가 반환되며 **서로 다른 캠페인**이다
  <!-- 슬롯 수 자체가 미정(부록 D)이며, 중복 배제 규칙도 SRS에 없다. -->

**Scenario 6: 성능**
- **Given**: 확정된 부하·데이터 조건 (D-05)
- **When**: 부하 테스트를 실행함
- **Then**: **(미정)** — p95가 확정 목표치 이하. **3단계까지 내려간 요청도 예산 안에** 있다

## ⚙️ Technical & Non-Functional Constraints
- **성능**: REQ-NF-001. 3단계 폴백은 조회를 최대 3회 수행하므로 **단계별 타임아웃 없이는 예산이 무너진다**
- **처리량**: 1,000 RPS (REQ-NF-002) — 하루 8,640만 건
- 가용성: Tracking이 죽어도 광고 응답은 계속되어야 함 (이벤트 기록은 비동기)
- 데이터: `ACTIVE` + 예산 잔액 있는 캠페인만 후보 (§6.3 규칙 4·7)
- 보안: 응답에 타 광고주 정보가 섞이지 않아야 함

## 🏁 Definition of Done (DoD)
- 공통 DoD 10개 + `[API Spec]` 추가 4개
- [ ] **성능 예산 배분표가 산출되고 4개 팀에 배정되었는가?**
- [ ] Scenario 4가 확정되고 클라이언트(UX-002·003) 담당자가 동의했는가?
- [ ] `requestId`가 SPEC-008·SPEC-009의 이벤트 계약과 연결되는가?

## 🚧 Dependencies & Blockers
- **Depends on**: SPEC-000
- **Blocks**: FR-037, MOCK-003, NF-001, QA-004, QA-009
- **SRS 미정의**: 3단계 실패 시 동작 / 단계별 실패 판정 기준 / 슬롯 수 / 동일 지면 중복 배제 / **D-05** 측정 조건

---



# SPEC-F: 이벤트 계약 2종 — 멱등키 규약 공유

**이슈** [#9](../../issues/9) · **신규 ID** `SPEC-F`

**원장 태스크** `SPEC-008` · `SPEC-009`

**흡수한 이슈** #10

### 원장 태스크 체크리스트

- [ ] `SPEC-008`
- [ ] `SPEC-009`

---


**labels**: `spec, contract, backend, ad-serving, priority:high`

## 🎯 Summary
- **Task ID**: SPEC-008
- **Epic (도메인)**: Contract
- **기능명**: [SPEC-008] `POST /api/v1/ads/events/click` 요청·응답 DTO 및 **멱등키 규약**
- **목적**: 클릭 기록 계약. **CPC 캠페인에서는 이 기록이 곧 청구 근거다.**
- **우선순위 / 복잡도**: Must / M

## 🔗 References (Spec & Context)
- SRS 요구사항: §6.1 · REQ-FUNC-008 · §6.3 규칙 6 (Last-click)
- SRS 부속 명세: §6.2 `EventType` · §6.4 `ad_events`
- 태스크 원장: EPIC S · 후행 FR-038, MOCK-003, **SPEC-009(멱등키 공유)**

## ✅ Task Breakdown (실행 계획)
- [ ] **멱등키 규약 확정** — SPEC-009와 동일 규칙 적용
- [ ] `requestId` 연결 규약 — 원 광고 요청과의 결합
- [ ] 비동기 처리 규약 — 사용자 이동을 지연시키지 않음
- [ ] SPEC-009와의 역할 분담 확정 **(미정)**
- [ ] 허용 유실률 확정 **(미정)**

### 요청 계약 (제안)

```
POST /api/v1/ads/events/click
{
  "eventId":    "evt-b41f27",       // (제안) 멱등키 — 클라이언트 생성 UUID
  "requestId":  "req-7f31a9",       // SPEC-007이 발급한 ID
  "campaignId": "cmp-8842",
  "creativeId": "crt-221",
  "occurredAt": "2025-06-13T04:19:58Z"
}

202 Accepted
{ "eventId": "evt-b41f27", "duplicate": false }
```

**멱등키가 없으면 돈이 새는 방향으로 샌다.** 네트워크가 응답을 잃으면 클라이언트는 실패로 알고 재전송하고,
서버는 같은 클릭을 두 번 기록한다. **CPC 캠페인에서 이는 두 번 청구다.** SRS에 규칙이 없으므로 계약에서 정해야 한다.

### SPEC-008과 SPEC-009의 역할 분담 **(미정)**

§6.1은 클릭 전용 엔드포인트와 일괄 수집 엔드포인트를 모두 정의한다. 제안은 다음이다.

> **SPEC-008 = 즉시성이 필요한 단건 클릭** (사용자가 이동하기 직전, 유실 위험이 큼)
> **SPEC-009 = 노출 등 대량 이벤트의 일괄 전송** (모아 보내도 되는 것)

## 🧪 Acceptance Criteria (BDD/GWT)

**Scenario 1: 정상 클릭 기록**
- **Given**: `requestId`가 유효한 광고 응답이 선행됨
- **When**: 클릭 이벤트를 전송함
- **Then**: `202`가 반환되고 해당 캠페인의 클릭 수가 1 증가한다

**Scenario 2: 동일 이벤트 재전송 — 멱등성**
- **Given**: `eventId`가 동일한 클릭이 이미 기록됨
- **When**: 같은 이벤트를 다시 전송함
- **Then**: `202`와 `duplicate: true`가 반환되고 **클릭 수는 증가하지 않는다**

**Scenario 3: 존재하지 않는 `requestId`**
- **Given**: 발급되지 않은 `requestId`
- **When**: 클릭 이벤트를 전송함
- **Then**: **(제안)** `400`. **광고 요청 없이 발생한 클릭은 부정 트래픽 의심 대상이다**

**Scenario 4: Tracking 서비스 장애 중**
- **Given**: Tracking이 응답하지 않는 상태
- **When**: 클릭 이벤트를 전송함
- **Then**: **(제안)** `202`가 반환되고 버퍼에 적재된다. **클릭 유실은 청구 손실이므로 즉시 실패시키지 않는다**

## ⚙️ Technical & Non-Functional Constraints
- 정확성: 중복 금지 · 유실 최소화. **양방향 모두 정산에 직결**
- 성능: 사용자 이동 경로에 있으므로 응답은 즉시. 실제 저장은 비동기
- 보안: `campaignId` 위조로 타 광고주 지표를 오염시킬 수 없어야 함

## 🏁 Definition of Done (DoD)
- 공통 DoD 10개 + `[API Spec]` 추가 4개
- [ ] 멱등키 규약이 SPEC-009와 **동일**하게 정의되었는가?
- [ ] 허용 유실률이 합의되고 측정 방법이 정해졌는가?

## 🚧 Dependencies & Blockers
- **Depends on**: SPEC-000
- **Blocks**: FR-038, MOCK-003, **SPEC-009**(멱등키 규약 공유)
- **SRS 미정의**: 멱등성·중복 제거 규칙 / 허용 유실률 / SPEC-009와의 역할 분담 / **부정 클릭 필터 부재**(§7 이관 여부)

---


---

<details>
<summary><b>흡수 · #10 [Spec] SPEC-009: 이벤트 일괄 수집 계약</b></summary>


**labels**: `spec, contract, backend, tracking-service, priority:high`

### 🎯 Summary
- **Task ID**: SPEC-009
- **Epic (도메인)**: Contract
- **기능명**: [SPEC-009] `POST /api/v1/tracking/events` 일괄 수집 계약 · 배치 상한 · 부분 실패 정책
- **목적**: 노출을 포함한 대량 이벤트를 모아 받는 계약. **기록되지 않은 노출은 청구할 수 없다.**
- **우선순위 / 복잡도**: Must / H

### 🔗 References (Spec & Context)
- SRS 요구사항: §6.1 ("대용량 추적을 위한 이벤트 일괄 수집") · REQ-FUNC-008 · REQ-NF-002
- SRS 부속 명세: §6.2 `EventType` · §6.4 `ad_events` **(파티셔닝)**
- 태스크 원장: EPIC S · 후행 FR-040, MOCK-004 · 선행 SPEC-008(멱등키)

### ✅ Task Breakdown (실행 계획)
- [ ] 배치 최대 건수 확정 **(제안: 500)**
- [ ] 부분 실패 정책 확정 **(제안: 부분 수용)**
- [ ] 멱등 처리 — **SPEC-008과 동일 규칙**
- [ ] 과부하 시 거절 정책 및 속도 제한
- [ ] 허용 유실률 확정 **(미정)**

#### 요청 계약 (제안)

```
POST /api/v1/tracking/events
{
  "events": [
    { "eventId": "evt-a1", "type": "IMPRESSION", "requestId": "req-7f31a9",
      "campaignId": "cmp-8842", "creativeId": "crt-221",
      "occurredAt": "2025-06-13T04:19:55Z" },
    { "eventId": "evt-a2", "type": "CONVERSION", "requestId": "req-7f31a9",
      "campaignId": "cmp-8842", "occurredAt": "2025-06-13T04:31:10Z" }
  ]
}

202 Accepted
{ "accepted": 2, "duplicates": 0, "rejected": [] }
```

**배치 최대 건수 (제안 500)** — SRS에 없다. 상한이 없으면 **클라이언트 하나가 거대한 요청으로 서비스를 마비시킬 수 있다.**
초과 시 `413`.

**부분 실패 처리 (제안: 부분 수용)** — 배치 중 1건이 잘못됐다고 499건을 버리면 유실이 커진다.
유효한 건은 받고 거절된 건만 `rejected`로 알려준다.

| 상태 코드 | 조건 |
| --- | --- |
| `202` | 수용 (부분 수용 포함) |
| `400` | 배치 전체가 형식 오류 |
| `401` | 미인증 |
| `413` | 배치 상한 초과 |
| `429` | 속도 제한 초과 |

### 🧪 Acceptance Criteria (BDD/GWT)

**Scenario 1: 정상 일괄 수집**
- **Given**: 유효한 이벤트 100건 배치
- **When**: 일괄 수집을 요청함
- **Then**: `202`와 `accepted: 100`이 반환되고, 5분 이내에 지표에 반영된다 (§6.3 규칙 8)

**Scenario 2: 중복 포함 배치 — 멱등성**
- **Given**: 이미 수집된 `eventId` 30건이 섞인 100건 배치
- **When**: 일괄 수집을 요청함
- **Then**: `accepted: 70`, `duplicates: 30`이 반환되고 **지표는 70건만 증가**한다

**Scenario 3: 일부 항목이 유효하지 않음**
- **Given**: `type`이 열거값 밖인 항목 2건이 섞인 100건 배치
- **When**: 일괄 수집을 요청함
- **Then**: **(제안)** `202`와 `accepted: 98`, `rejected` 2건이 반환된다

**Scenario 4: 배치 크기 초과**
- **Given**: 상한을 초과하는 건수의 배치
- **When**: 일괄 수집을 요청함
- **Then**: `413`이 반환되고 **어떤 항목도 저장되지 않는다**

**Scenario 5: 처리량**
- **Given**: 1,000 RPS 지속 부하
- **When**: 일괄 수집을 계속 호출함
- **Then**: **(미정)** — 확정된 응답 시간 목표를 유지하며 유실이 허용 범위 안
  <!-- REQ-NF-002의 인수 기준에 "유지해야 할 응답 시간"이 없어 판정 불가. D-05 및 부록 D 연계. -->

### ⚙️ Technical & Non-Functional Constraints
- 처리량: 하루 8,640만 건 기준 설계. 이벤트당 200바이트 가정 시 **하루 약 17GB · 월 500GB**
- 데이터: §6.4가 `ad_events`를 파티셔닝한 이유가 이 규모다. 오래된 파티션은 통째로 분리·폐기 가능해야 함
- 가용성: 이 서비스가 죽어도 광고 응답(SPEC-007)은 계속되어야 함
- 정확성: 중복 금지 · 유실 최소화

### 🏁 Definition of Done (DoD)
- 공통 DoD 10개 + `[API Spec]` 추가 4개
- [ ] 멱등 규칙이 SPEC-008과 **동일**하게 정의되었는가?
- [ ] 배치 상한과 부분 실패 정책이 계약에 명시되었는가?

### 🚧 Dependencies & Blockers
- **Depends on**: SPEC-000, SPEC-008 (멱등키 규약 공유)
- **Blocks**: FR-040, MOCK-004, QA-008, QA-010
- **SRS 미정의**: 멱등성 규칙 / 허용 유실률 / 배치 상한 / REQ-NF-002의 응답 시간 조건 부재

---


</details>


# DB-A: Enum 타입 정의 및 확장 패턴

**이슈** [#12](../../issues/12) · **신규 ID** `DB-A`

**원장 태스크** `FR-001` · `FR-002` · `FR-003` · `FR-004` · `FR-005`

**단독 유지** — 병합 금지 대상

### 원장 태스크 체크리스트

- [ ] `FR-001`
- [ ] `FR-002`
- [ ] `FR-003`
- [ ] `FR-004`
- [ ] `FR-005`

---


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



# DB-B: Audience · Campaign 스키마 및 마이그레이션

**이슈** [#13](../../issues/13) · **신규 ID** `DB-B`

**원장 태스크** `FR-006` · `FR-007`

**흡수한 이슈** #14

### 원장 태스크 체크리스트

- [ ] `FR-006`
- [ ] `FR-007`

---


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


---

<details>
<summary><b>흡수 · #14 [DB] DB-003: Campaign 도메인 스키마 및 마이그레이션</b></summary>


**labels**: `db, backend, priority:high`
**원장 태스크**: FR-007

### 🎯 Summary
- **Task ID**: DB-003 (FR-007)
- **Epic (도메인)**: Foundation
- **기능명**: [DB-003] `campaigns` / `campaign_targeting`(비정규화) / `campaign_creatives` 스키마 및 마이그레이션
- **목적**: 광고 후보의 원천 데이터를 담는다. **광고 요청 경로에서 읽히는 테이블이므로 조회 최적화가 갱신 편의보다 우선한다.**
- **우선순위 / 복잡도**: Must / M

### 🔗 References (Spec & Context)
- SRS 요구사항: REQ-FUNC-003 · REQ-FUNC-005 · §6.3 규칙 4·7
- SRS 부속 명세: §6.4 3개 테이블 (**`campaign_targeting`에 "비정규화" 주석**) · §6.2 `CampaignStatus`·`BiddingStrategy`·`AdPosition`
- 태스크 원장: EPIC A · 선행 DB-001

### ✅ Task Breakdown (실행 계획)
- [ ] `campaigns` 컬럼 설계 — 상태·입찰·예산·기간
- [ ] **예산 잔액 컬럼 설계** — 원자적 차감을 가능하게 하는 구조 (FR-035의 전제)
- [ ] `campaign_targeting` 비정규화 구조 설계 — SPEC-005의 조건 결합 규칙 반영
- [ ] `campaign_creatives` 설계 — 위치별 소재
- [ ] 소유자(광고주) 컬럼 — **D-01 반영**
- [ ] 후보 조회 색인 설계 (상태 + 예산 잔액 + 타게팅)
- [ ] 마이그레이션 스크립트 + 롤백 검증

#### 스키마 (제안)

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

### 🧪 Acceptance Criteria (BDD/GWT)

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

### ⚙️ Technical & Non-Functional Constraints
- **성능**: 이 세 테이블은 **광고 요청 경로에서 읽힌다.** 색인 설계가 REQ-NF-001 달성의 절반이다
- 데이터: 비정규화는 §6.4가 명시한 의도적 선택 — 조회 속도를 위해 갱신 복잡도를 감수
- 보안: `advertiser_id`가 D-01 소유자 검증의 기준 컬럼
- 데이터: 배열 컬럼 값은 DB-001 enum 범위 안이어야 함 (애플리케이션 검증)

### 🏁 Definition of Done (DoD)
- 공통 DoD 10개 + `[DB]` 추가 3개
- [ ] SPEC-005의 조건 결합 규칙이 색인 설계에 반영되었는가?
- [ ] `spent_today` 조건부 증가가 동시성 테스트를 통과했는가?
- [ ] 캠페인 기간 필드 신설 여부가 확정되었는가? (`COMPLETED` 진입 조건)

### 🚧 Dependencies & Blockers
- **Depends on**: DB-001 (FR-003), SPEC-005 (조건 결합 규칙 → 색인 설계)
- **Blocks**: DB-005, FR-019a, FR-019b, FR-025, FR-035
- **SRS 미정의**: 통화 단위 / `COMPLETED` 진입 조건 / 기간 필드 / **D-01** 소유자 / SPEC-005 조건 결합 규칙

---


</details>


# DB-C: 이벤트 원본 및 실시간 집계 뷰

**이슈** [#15](../../issues/15) · **신규 ID** `DB-C`

**원장 태스크** `FR-008` · `FR-009`

**단독 유지** — 병합 금지 대상

### 원장 태스크 체크리스트

- [ ] `FR-008`
- [ ] `FR-009`

---


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



# DB-D: 소프트 삭제 컴포넌트 및 전 서비스 적용

**이슈** [#16](../../issues/16) · **신규 ID** `DB-D`

**원장 태스크** `FR-010` · `FR-011`

**단독 유지** — 병합 금지 대상

### 원장 태스크 체크리스트

- [ ] `FR-010`
- [ ] `FR-011`

---


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



# MOCK-A: 백엔드 모킹 — Audience · Campaign

**이슈** [#17](../../issues/17) · **신규 ID** `MOCK-A`

**원장 태스크** `MOCK-001` · `MOCK-002`

**흡수한 이슈** #18

### 원장 태스크 체크리스트

- [ ] `MOCK-001`
- [ ] `MOCK-002`

---


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


---

<details>
<summary><b>흡수 · #18 [Mock] MOCK-002: Campaign Service 모킹</b></summary>


**labels**: `mock, backend, priority:high`

### 🎯 Summary
- **Task ID**: MOCK-002
- **Epic (도메인)**: Mock
- **기능명**: [MOCK-002] Campaign Service 3개 엔드포인트 모킹
- **목적**: Ad Serving 팀이 Campaign 실구현(FR-019a~028)을 기다리지 않고 후보 조회·수익 최적화에 착수하게 한다.
- **우선순위 / 복잡도**: Must / M

### 🔗 References (Spec & Context)
- 계약: SPEC-004 · SPEC-005 · SPEC-006 · `docs/api_v1.yaml`
- 태스크 원장: EPIC M · 소비 주체 FR-029, FR-030, FR-031, FR-034
- **SRS 근거: 없음 — 방법론 파생**

### ✅ Task Breakdown (실행 계획)
- [ ] `POST /campaigns` · `PUT .../targeting` · `GET .../performance` 모킹
- [ ] 후보 캠페인 데이터셋 구성 (아래)
- [ ] 예산 잔액 상태 전환 스위치
- [ ] 지연 주입 · 오류 응답 스위치

#### 필요한 후보 캠페인 데이터셋 — FR-034 검증에 필수

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

### 🧪 Acceptance Criteria (BDD/GWT)

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

### ⚙️ Technical & Non-Functional Constraints
- 계약이 단일 진실 원천
- 실구현 완료 후 폐기 대상

### 🏁 Definition of Done (DoD)
- 모킹 공통 DoD 5개
- [ ] 7종 데이터셋이 모두 동작하는가?
- [ ] Ad Serving 팀이 이 모킹으로 FR-029~034에 착수했는가?

### 🚧 Dependencies & Blockers
- **Depends on**: SPEC-004, SPEC-005, SPEC-006
- **Blocks**: FR-029, FR-030, FR-031, FR-034
- **주의**: SPEC-006은 D-01에 차단되어 있다. 성과 조회 모킹은 D-01 회신 후 완결 가능

---


</details>


# MOCK-B: 프런트 모킹 — Ad Serving · Tracking

**이슈** [#19](../../issues/19) · **신규 ID** `MOCK-B`

**원장 태스크** `MOCK-003` · `MOCK-004`

**흡수한 이슈** #20

### 원장 태스크 체크리스트

- [ ] `MOCK-003`
- [ ] `MOCK-004`

---


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


---

<details>
<summary><b>흡수 · #20 [Mock] MOCK-004: Tracking 모킹</b></summary>


**labels**: `mock, backend, priority:high`

### 🎯 Summary
- **Task ID**: MOCK-004
- **Epic (도메인)**: Mock
- **기능명**: [MOCK-004] Tracking 2개 엔드포인트 모킹
- **목적**: Campaign 성과 조회(FR-028)와 대시보드(UX-006)가 Tracking 실구현을 기다리지 않게 한다.
- **우선순위 / 복잡도**: Must / M

### 🔗 References (Spec & Context)
- 계약: SPEC-009 · SPEC-010 · `docs/api_v1.yaml`
- 태스크 원장: EPIC M · 소비 주체 FR-028, FR-051, UX-006
- **SRS 근거: 없음 — 방법론 파생**

### ✅ Task Breakdown (실행 계획)
- [ ] `POST /tracking/events` 모킹 — 부분 수용·중복·상한 초과 응답
- [ ] `GET .../metrics` 모킹 — 지표 데이터셋
- [ ] `asOf` 시각 변화 재현 (집계 지연 표현)
- [ ] 세그먼트 분해 데이터셋 (합계 정합성 검증용)

#### 필요한 지표 데이터셋

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

### 🧪 Acceptance Criteria (BDD/GWT)

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

### ⚙️ Technical & Non-Functional Constraints
- 계약이 단일 진실 원천 — SPEC-006과 SPEC-010의 **스키마 통일 결과를 반영**해야 함
- 실구현 완료 후 폐기 대상

### 🏁 Definition of Done (DoD)
- 모킹 공통 DoD 5개
- [ ] 6종 데이터셋이 모두 동작하는가?
- [ ] SPEC-006 ↔ SPEC-010 스키마 통일 결과가 반영되었는가?
- [ ] UX-006 담당자가 `asOf` 표기를 실제로 설계했는가?

### 🚧 Dependencies & Blockers
- **Depends on**: SPEC-009, SPEC-010
- **Blocks**: FR-028, FR-051, UX-006
- **주의**: SPEC-010은 D-01에 차단되어 있다. 권한 관련 응답은 회신 후 완결

</details>

