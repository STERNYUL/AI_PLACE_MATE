# P1a · P1b — 계약 및 규약 명세 이슈 11건

**Phase:** P1a (SPEC-000) · P1b (SPEC-001~010)
**템플릿:** `.github/ISSUE_TEMPLATE/feature_task.md`
**원장:** `TASKS-adtech-mvp-v1.0.md` EPIC S
**차단 안건:** `docs/W0-decision-agenda.md` D-01 → SPEC-006 · SPEC-010

---

## 이 Phase의 산출물

| 산출물 | 내용 |
| --- | --- |
| `docs/api_v1.yaml` | 10개 엔드포인트의 OpenAPI 명세 |
| 공통 규약 합의서 | 인증 헤더 · 오류 응답 · 요청 추적 ID · 소프트 삭제 기본 필터 |
| 성능 예산 배분표 | 100ms 구간 배분 (SPEC-007 산출) |
| 멱등키 규약 | SPEC-008 · SPEC-009 공통 |
| 타게팅 조건 결합 규칙 | SPEC-005 산출 → FR-029 · FR-030 구현 기준 |

## 공통 라벨

`spec, contract, backend, priority:high` — SPEC-007은 `critical-path` 추가

## 표기 규칙

| 표기 | 의미 |
| --- | --- |
| 표시 없음 | SRS 원문에서 직접 도출 |
| **(제안)** | SRS에 없어 이 문서에서 제안 — 계약 리뷰에서 확정 |
| **(미정)** | 확정 주체의 답 필요 — 부록 D 또는 W0 안건 |

## 공통 DoD

템플릿의 DoD 10개 항목을 그대로 적용하고, `[API Spec]` 유형에는 아래 4개를 추가로 적용한다.

- [ ] OpenAPI 문서에 요청·응답·에러 코드가 모두 기재되었는가?
- [ ] 소비 측 팀(구현·모킹·클라이언트)이 계약을 검토하고 동의했는가?
- [ ] **(미정)** 표기 항목이 전부 해소되었거나, 해소 담당자·기한이 지정되었는가?
- [ ] 계약 변경 절차(누가 승인하고 누구에게 통보하는가)가 정해졌는가?

---
---

# [Spec] SPEC-000: 공통 규약 확정

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

# [Spec] SPEC-001: 프로파일 조회 계약

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

# [Spec] SPEC-002: 세그먼트 갱신 계약

**labels**: `spec, contract, backend, audience-service, priority:high`

## 🎯 Summary
- **Task ID**: SPEC-002
- **Epic (도메인)**: Contract
- **기능명**: [SPEC-002] `POST /api/v1/audience/profiles/{userId}/segments` 요청·응답 DTO 및 에러 코드
- **목적**: 사용자를 36칸 격자 중 정확히 한 칸에 배치하는 계약. MECE 원칙이 계약 수준에서 강제되는 지점이다.
- **우선순위 / 복잡도**: Must / M

## 🔗 References (Spec & Context)
- SRS 요구사항: §6.1 · REQ-FUNC-001 · §6.3 규칙 1
- SRS 부속 명세: §6.2 `AgeSegment`(4) · `IncomeSegment`(3) · `GeographySegment`(3) → 36조합
- 태스크 원장: EPIC S · 후행 FR-017, MOCK-001

## ✅ Task Breakdown (실행 계획)
- [ ] **요청 형식 결정** — 원시값 전달(안 A) vs enum 직접 지정(안 B)
- [ ] 부분 갱신 불허 규칙 명시
- [ ] 경계값 귀속 규칙 문서화 **(미정)**
- [ ] 차원 미상 사용자 처리 **(미정)**
- [ ] 에러 코드 목록 확정

### 요청 계약 — 두 안 중 확정 필요 **(미정)**

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

## 🧪 Acceptance Criteria (BDD/GWT)

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

## ⚙️ Technical & Non-Functional Constraints
- 데이터: 3개 차원 모두 필수. 사용자당 세그먼트 정확히 1개 (§6.3 규칙 1)
- 보안: 안 A 채택 시 소득 원시값 **평문 로깅 금지** (SPEC-000 · NF-012)
- 유지보수성: 새 enum 값 추가 시 계약 변경 불필요 (REQ-NF-005)

## 🏁 Definition of Done (DoD)
- 공통 DoD 10개 + `[API Spec]` 추가 4개
- [ ] 안 A·B 중 하나가 확정되었는가?
- [ ] 경계값 4건의 귀속이 계약 문서에 기록되었는가?

## 🚧 Dependencies & Blockers
- **Depends on**: SPEC-000
- **Blocks**: FR-017, MOCK-001
- **SRS 미정의**: 통화 단위 / 지역 판정 기준 / `UNKNOWN` 세그먼트 부재 / 경계값 귀속 — 전부 부록 D

---

# [Spec] SPEC-003: 행동 신호 추가 계약

**labels**: `spec, contract, backend, audience-service, priority:high`

## 🎯 Summary
- **Task ID**: SPEC-003
- **Epic (도메인)**: Contract
- **기능명**: [SPEC-003] `POST /api/v1/audience/profiles/{userId}/behavioral-signals` 요청·응답 DTO 및 에러 코드
- **목적**: 구매 의도·참여 행동·디바이스 선호 태그를 누적하는 계약. 1단계 정밀 타게팅의 유일한 입력원이다.
- **우선순위 / 복잡도**: Must / M

## 🔗 References (Spec & Context)
- SRS 요구사항: §6.1 · REQ-FUNC-002 · §6.3 규칙 2
- SRS 부속 명세: §6.2 `PurchaseIntent`(7) · `EngagementBehavior`(5) · `DevicePreference`(4)
- 태스크 원장: EPIC S · 후행 FR-018, MOCK-001
- 학습 해설: `SRS-READER.html` 15장

## ✅ Task Breakdown (실행 계획)
- [ ] 단건 vs 배열 전송 확정
- [ ] 누적(append) vs 교체(replace) 확정
- [ ] 동일 태그 재전송 처리 확정
- [ ] 배열 내 일부 오류 시 처리 (전부 실패 vs 부분 수용)
- [ ] 태그 개수 상한 **(미정)**

### 요청 계약 (제안)

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

## 🧪 Acceptance Criteria (BDD/GWT)

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

## ⚙️ Technical & Non-Functional Constraints
- 데이터: 사용자당 다수 행(일대다). **"이 태그를 가진 사용자 전부"** 역방향 조회가 FR-029의 입력이므로 색인 전제
- 성능: 이 엔드포인트는 광고 요청 경로 **밖**이다. 쓰기 지연이 100ms 예산에 포함되지 않음
- 유지보수성: 새 태그 값 추가 시 계약 변경 불필요

## 🏁 Definition of Done (DoD)
- 공통 DoD 10개 + `[API Spec]` 추가 4개
- [ ] 누적·교체 중 하나가 확정되었는가?
- [ ] **MVP에서 이 API를 호출하는 주체가 정해졌는가?**
  <!-- §7.2가 동적 태깅을 향후로 미뤘으므로 MVP에서 태그가 자동으로 붙지 않는다.
       CRM 매니저의 수동 입력인가, 외부 User Profile Service의 배치 전송(FR-049)인가. -->

## 🚧 Dependencies & Blockers
- **Depends on**: SPEC-000
- **Blocks**: FR-018, MOCK-001
- **SRS 미정의**: 태그 최소·최대 개수 (REQ-FUNC-002 검증 불가) / 유효 기간·신뢰도 (§7.2) / **호출 주체 미정**

---

# [Spec] SPEC-004: 캠페인 생성 계약

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

# [Spec] SPEC-005: 타게팅 갱신 계약 · 조건 결합 규칙

**labels**: `spec, contract, backend, campaign-service, priority:high`

## 🎯 Summary
- **Task ID**: SPEC-005
- **Epic (도메인)**: Contract
- **기능명**: [SPEC-005] `PUT /api/v1/campaigns/{campaignId}/targeting` 요청·응답 DTO 및 **조건 결합 규칙**
- **목적**: 이 캠페인이 노리는 오디언스를 지정하는 계약. **조건 결합 규칙이 FR-029·FR-030 구현의 유일한 기준이다.**
- **우선순위 / 복잡도**: Must / H

## 🔗 References (Spec & Context)
- SRS 요구사항: §6.1 · REQ-FUNC-003 · §1.2 범위
- SRS 부속 명세: §6.2 인구통계·행동 신호 enum 전체 · §6.4 `campaign_targeting` **(비정규화)**
- 태스크 원장: EPIC S · 후행 FR-027, MOCK-002, FR-029, FR-030

## ✅ Task Breakdown (실행 계획)
- [ ] **조건 결합 규칙 확정** — 계약의 핵심 산출물
- [ ] `PUT` 의미 확정 — 전체 교체 (부분 수정 필요 시 `PATCH` 신설 검토)
- [ ] 빈 배열의 의미 확정 ("제약 없음")
- [ ] 인구통계 없이 행동 조건만 지정하는 경우의 처리
- [ ] 소유자 검증 규약 — **D-01 반영**

### 요청 계약 (제안)

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

### 조건 결합 규칙 **(미정 — 이 계약의 핵심)**

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

## 🧪 Acceptance Criteria (BDD/GWT)

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

## ⚙️ Technical & Non-Functional Constraints
- 성능: 이 데이터는 **광고 요청 경로에서 읽힌다.** §6.4가 비정규화를 명시한 이유이며, 조회 최적화가 갱신 편의보다 우선
- 데이터: 조건 결합 규칙이 저장 구조를 결정한다. **규칙 확정 전 스키마 확정 불가**
- 보안: 소유자 검증 필수 (**D-01**)

## 🏁 Definition of Done (DoD)
- 공통 DoD 10개 + `[API Spec]` 추가 4개
- [ ] 조건 결합 규칙이 문서로 확정되고 **FR-029·FR-030 담당자가 동일하게 해석**하는가?
- [ ] 빈 배열의 의미가 계약에 명시되었는가?

## 🚧 Dependencies & Blockers
- **Depends on**: SPEC-000
- **Blocks**: FR-027, MOCK-002, **FR-029, FR-030** (구현 기준)
- **SRS 미정의**: 조건 결합 규칙 (본 이슈 제기) / **D-01** 소유자 검증

---

# [Spec] SPEC-006: 캠페인 성과 조회 계약

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

# [Spec] SPEC-007: 광고 요청 계약 — 최우선

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

# [Spec] SPEC-008: 클릭 이벤트 계약 · 멱등키 규약

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

# [Spec] SPEC-009: 이벤트 일괄 수집 계약

**labels**: `spec, contract, backend, tracking-service, priority:high`

## 🎯 Summary
- **Task ID**: SPEC-009
- **Epic (도메인)**: Contract
- **기능명**: [SPEC-009] `POST /api/v1/tracking/events` 일괄 수집 계약 · 배치 상한 · 부분 실패 정책
- **목적**: 노출을 포함한 대량 이벤트를 모아 받는 계약. **기록되지 않은 노출은 청구할 수 없다.**
- **우선순위 / 복잡도**: Must / H

## 🔗 References (Spec & Context)
- SRS 요구사항: §6.1 ("대용량 추적을 위한 이벤트 일괄 수집") · REQ-FUNC-008 · REQ-NF-002
- SRS 부속 명세: §6.2 `EventType` · §6.4 `ad_events` **(파티셔닝)**
- 태스크 원장: EPIC S · 후행 FR-040, MOCK-004 · 선행 SPEC-008(멱등키)

## ✅ Task Breakdown (실행 계획)
- [ ] 배치 최대 건수 확정 **(제안: 500)**
- [ ] 부분 실패 정책 확정 **(제안: 부분 수용)**
- [ ] 멱등 처리 — **SPEC-008과 동일 규칙**
- [ ] 과부하 시 거절 정책 및 속도 제한
- [ ] 허용 유실률 확정 **(미정)**

### 요청 계약 (제안)

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

## 🧪 Acceptance Criteria (BDD/GWT)

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

## ⚙️ Technical & Non-Functional Constraints
- 처리량: 하루 8,640만 건 기준 설계. 이벤트당 200바이트 가정 시 **하루 약 17GB · 월 500GB**
- 데이터: §6.4가 `ad_events`를 파티셔닝한 이유가 이 규모다. 오래된 파티션은 통째로 분리·폐기 가능해야 함
- 가용성: 이 서비스가 죽어도 광고 응답(SPEC-007)은 계속되어야 함
- 정확성: 중복 금지 · 유실 최소화

## 🏁 Definition of Done (DoD)
- 공통 DoD 10개 + `[API Spec]` 추가 4개
- [ ] 멱등 규칙이 SPEC-008과 **동일**하게 정의되었는가?
- [ ] 배치 상한과 부분 실패 정책이 계약에 명시되었는가?

## 🚧 Dependencies & Blockers
- **Depends on**: SPEC-000, SPEC-008 (멱등키 규약 공유)
- **Blocks**: FR-040, MOCK-004, QA-008, QA-010
- **SRS 미정의**: 멱등성 규칙 / 허용 유실률 / 배치 상한 / REQ-NF-002의 응답 시간 조건 부재

---

# [Spec] SPEC-010: 실시간 지표 조회 계약

**labels**: `spec, contract, backend, tracking-service, priority:high, blocked-d01`

## 🎯 Summary
- **Task ID**: SPEC-010
- **Epic (도메인)**: Contract
- **기능명**: [SPEC-010] `GET /api/v1/tracking/campaigns/{campaignId}/metrics` 요청·응답 DTO 및 에러 코드
- **목적**: 대시보드가 최신 집계 결과를 읽는 계약. **SPEC-006과 숫자가 일치해야 한다.**
- **우선순위 / 복잡도**: Must / M

## 🔗 References (Spec & Context)
- SRS 요구사항: §6.1 · REQ-FUNC-008 · §6.3 규칙 8
- SRS 부속 명세: §6.4 `campaign_performance_realtime`
- 태스크 원장: EPIC S · 후행 FR-045, MOCK-004 · **선행 SPEC-006(스키마 통일)**
- **SPEC-006의 "중복" 절을 함께 읽을 것**

## ✅ Task Breakdown (실행 계획)
- [ ] SPEC-006과 응답 스키마 통일 (안 A·B·C 중 확정)
- [ ] 시간 구간 파라미터 설계 (`from`·`to`·`granularity`)
- [ ] `asOf` 규약 — SPEC-006과 동일
- [ ] 소유자·내부 운영자 권한 구분 — **D-01 연계**

### 응답 계약

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

## 🧪 Acceptance Criteria (BDD/GWT)

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

## ⚙️ Technical & Non-Functional Constraints
- 성능: 대시보드 조회가 이벤트 수집(SPEC-009)을 방해하지 않아야 함 — OLTP·OLAP 분리 검토
- 정확성: SPEC-006과 동일 원천·동일 스키마
- 보안: 소유자 검증 (**D-01**)

## 🏁 Definition of Done (DoD)
- 공통 DoD 10개 + `[API Spec]` 추가 4개
- [ ] SPEC-006과 스키마가 통일되었는가?
- [ ] `asOf`와 집계 주기가 대시보드 화면(UX-006) 설계에 반영되었는가?

## 🚧 Dependencies & Blockers
- **Depends on**: SPEC-000, SPEC-006 (스키마 통일)
- **Blocks**: FR-045, MOCK-004, FR-051, UX-006
- **SRS 미정의**: **D-01 소유자 검증 — 착수 차단** / "실시간" 정의 충돌 (REQ-FUNC-008 vs §6.3 규칙 8) / SPEC-006과의 역할 분담

---

## P1a · P1b에서 새로 발견된 미정의 항목 — 부록 D 추가 대상

| # | 항목 | 제기 이슈 | 확정 난도 |
| --- | --- | --- | --- |
| E-01 | 프로파일 미존재 시 응답 (`404` vs 빈 프로파일 `200`) | SPEC-001 | 계약 리뷰에서 즉시 결정 가능 |
| E-02 | 타게팅 조건 결합 규칙 (차원 내 OR · 차원 간 AND) | SPEC-005 | 계약 리뷰에서 즉시 결정 가능 |
| E-03 | SPEC-006 ↔ SPEC-010 역할 분담 및 스키마 통일 | SPEC-006 · 010 | 계약 리뷰에서 즉시 결정 가능 |
| E-04 | 캠페인 기간 필드 부재 → `COMPLETED` 진입 불가 | SPEC-004 | 계약 리뷰에서 즉시 결정 가능 |
| E-05 | 배치 상한 및 부분 실패 정책 | SPEC-009 | 계약 리뷰에서 즉시 결정 가능 |
| E-06 | 동일 지면 내 캠페인 중복 배제 규칙 | SPEC-007 | 계약 리뷰에서 즉시 결정 가능 |
| E-07 | 오류 응답 형식 · 요청 추적 ID · 속도 제한 (SRS 전무) | SPEC-000 | 계약 리뷰에서 즉시 결정 가능 |
| E-08 | 소프트 삭제 필터의 강제 지점 | SPEC-000 | 설계 리뷰 필요 |
| E-09 | 행동 신호 API의 **MVP 호출 주체** | SPEC-003 | **사업·운영 판단 필요** |

> E-01 ~ E-08은 W0의 치명 5건과 달리 **외부 회신을 기다릴 필요가 없다** — 계약 리뷰 회의 한 번으로 처리 가능하다.
> **E-09는 성격이 다르다.** §7.2가 동적 태깅을 향후로 미뤘으므로 MVP에서 태그가 자동으로 붙지 않는데,
> 그러면 1단계 정밀 타게팅의 입력이 비게 된다. **REQ-FUNC-004의 1단계가 사실상 동작하지 않을 수 있다** — 사업 판단이 필요하다.
