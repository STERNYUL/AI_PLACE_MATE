# P2b — 쓰기 로직 이슈 23건 `[Feature/Command]` · `[Util]` · `[Feature/Q+C]`

**Phase:** P2b
**템플릿:** `.github/ISSUE_TEMPLATE/feature_task.md`
**원장:** `TASKS-adtech-mvp-v1.0.md`
**선행:** P1 전체 · P2a(Query) · **D-02 · D-03 회신** (C-16 · C-23)

---

## 대상 23건

| 이슈 | 원장 | Type | Epic | 복잡도 | 차단 |
| --- | --- | --- | --- | --- | --- |
| C-01 | FR-012 | Command | Audience | H | — |
| C-02 | FR-013 | **Util** | Audience | L | 부록 D (포맷) |
| C-03 | FR-014 | Command | Audience | M | 부록 D (`UNKNOWN`) |
| C-04 | FR-015 | Command | Audience | H | — |
| C-05 | FR-017 | Command | Audience | M | 부록 D |
| C-06 | FR-018 | Command | Audience | M | E-09 (호출 주체) |
| C-07 | FR-019a | Command | Campaign | M | — |
| C-08 | FR-020 | Command | Campaign | M | E-04 (`COMPLETED`) |
| C-09 | FR-021 | Command | Campaign | H | E-02 (결합 규칙) |
| C-10 | FR-022 | Command | Campaign | H | **D-02** |
| C-11 | FR-023 | Command | Campaign | M | **D-02** |
| C-12 | FR-024 | Command | Campaign | M | **D-03** |
| C-13 | FR-025 | Command | Campaign | M | UX-004 |
| C-14 | FR-026 | Command | Campaign | M | — |
| C-15 | FR-027 | Command | Campaign | M | E-02 |
| C-16 | **FR-035** | Command | Ad Serving | H | **D-02 — 최우선** |
| C-17 | FR-033 | Command | Ad Serving | L | — |
| C-18 | FR-038 | Command | Ad Serving | M | 멱등성 |
| C-19 | FR-039 | Command | Tracking | H | 멱등성 |
| C-20 | FR-040 | Command | Tracking | H | 멱등성 |
| C-21 | FR-043 | Command | Tracking | M | "실시간" 충돌 |
| C-22 | FR-044 | Command | Tracking | H | 어트리뷰션 윈도우 |
| C-23 | **FR-037** | **Q+C** | Ad Serving | H | **D-05 · SPEC-007** |

## 공통 라벨

`feature, command, backend, priority:high` + Epic 라벨

## 공통 제약 — 23건 전체 적용

| 항목 | 제약 | 근거 |
| --- | --- | --- |
| 소프트 삭제 | 삭제는 `deleted_at` 갱신만. 물리 삭제 금지 | REQ-FUNC-007 · §6.3 규칙 5 |
| 인가 | 자원 소유자만 변경 가능 (D-01) | REQ-NF-004 |
| 열거값 | §6.2 범위 밖 입력은 `400` | §6.2 · SPEC-000 |
| 원자성 | 함께 성공하거나 함께 실패해야 하는 작업은 트랜잭션으로 묶는다 | — |
| 개인정보 | 요청·응답 로깅 시 마스킹 | REQ-NF-004 · NF-012 |

## 공통 DoD

템플릿 DoD 10개 + `[Feature/Command]` 추가 4개

- [ ] 실패 시 **부분 변경이 남지 않음**을 테스트로 확인했는가?
- [ ] 동시 요청 상황에서 데이터가 어긋나지 않는가?
- [ ] 소프트 삭제 규칙을 준수했는가?
- [ ] 변경 이력이 필요한 자원이라면 추적 가능한가?

---
---

# [Feature/Command] C-01 (FR-012): MECE 복합 세그먼트 분류기

**labels**: `feature, command, backend, audience-service, priority:high`

## 🎯 Summary
- **Task ID**: FR-012 · **Epic**: Audience Service · **Must / H**
- **기능명**: `DemographicSegmentClassifier` — 나이·소득·지역을 36칸 중 하나로 배정
- **목적**: 이 시스템의 통계가 거짓말하지 않게 하는 장치. **분류가 틀리면 모든 리포트가 틀린다.**

## 🔗 References
- SRS: **REQ-FUNC-001** · §6.3 규칙 1 · §5 `DemographicSegmentClassifier` · §6.2 인구통계 3종
- 선행: DB-001 · DB-002 · SPEC-002 (요청 형식 안 A·B)
- 학습 해설: `SRS-READER.html` 14장

## ✅ Task Breakdown
- [ ] 연령 → `AgeSegment` 분류 함수 (경계: 18·24·25·34·35·44·45)
- [ ] 소득 → `IncomeSegment` 분류 함수 (경계: 50000·50001·100000·100001) — **통화 단위 확정 후**
- [ ] 지역 → `GeographySegment` 분류 함수 — **판정 기준 확정 후 (미정)**
- [ ] 3개 결과를 복합 세그먼트로 조합 (FR-013 호출)
- [ ] **전역성 보장** — 어떤 입력에도 정확히 하나를 반환하거나 명시적으로 실패
- [ ] 저장 (DB-002 제약이 최종 방어선)

### 이 함수가 만족해야 하는 성질

| 성질 | 뜻 | 위반 시 |
| --- | --- | --- |
| **전체 정의** | 모든 유효 입력에 결과가 있다 | 그 사용자는 광고를 못 받는다 (Fill Rate 하락) |
| **단일 결과** | 입력 하나에 결과 하나 | 리포트 합계가 노출 수를 초과한다 (정산 분쟁) |
| **결정적** | 같은 입력에 같은 결과 | 사용자가 갱신마다 세그먼트를 옮겨 다닌다 |

**경계값이 코드에 박혀야 한다.** §6.2는 `AGE_25_34("젊은 직장인층", 25, 34)`처럼 범위를 주지만,
만 25세가 `AGE_18_24`인지 `AGE_25_34`인지는 **범위 표기만으로 확정되지 않는다**(24 다음이 25이므로 후자로 읽히나 명문화가 필요).

## 🧪 Acceptance Criteria

**Scenario 1: 36칸 전수 배정**
- **Given**: 36개 조합 각각에 해당하는 입력 36건
- **When**: 분류를 수행함
- **Then**: 36개 서로 다른 복합 세그먼트가 생성되며 누락·중복이 없다

**Scenario 2: 경계값 — 연령**
- **Given**: 만 24세 / 만 25세 / 만 44세 / 만 45세
- **When**: 분류함
- **Then**: 각각 `AGE_18_24` / `AGE_25_34` / `AGE_35_44` / `AGE_45_PLUS`로 배정된다

**Scenario 3: 경계값 — 소득**
- **Given**: 50,000 / 50,001 / 100,000 / 100,001
- **When**: 분류함
- **Then**: 각각 `LOW` / `MID` / `MID` / `HIGH`로 배정된다 (§6.2 범위 그대로)

**Scenario 4: 결정성**
- **Given**: 동일 입력
- **When**: 100회 분류함
- **Then**: 100회 모두 동일 결과다

**Scenario 5: 판정 불가 입력**
- **Given**: 지역 정보를 판정할 수 없는 입력
- **When**: 분류함
- **Then**: **(미정)** — `UNKNOWN`이 없어 반환할 값이 없다. 명시적 실패인가, 기본값인가

**Scenario 6: 상한 초과 연령**
- **Given**: 만 130세 (§6.2의 `AGE_45_PLUS`는 45~120)
- **When**: 분류함
- **Then**: **(제안)** `AGE_45_PLUS`로 배정된다. 상한 120을 넘는 값을 거부하면 전체 포괄이 깨진다

## ⚙️ Constraints
공통 제약 5개. 추가로 —
- 이 함수는 **순수 함수여야 한다** — 같은 입력에 같은 출력, 외부 상태 의존 없음. 테스트와 재현성의 전제
- 성능: 광고 요청 경로에서 호출되지 않는다(조회는 FR-016). 갱신 시점에만 실행되므로 여유가 있다
- 개인정보: 소득 원시값을 입력으로 받는 경우 로깅 금지 (NF-012)

## 🏁 DoD
공통 DoD 14개. 추가로 —
- [ ] 36칸 전수 배정 테스트가 통과하는가?
- [ ] **전체 사용자 수 = 세그먼트별 인원 합계**가 검증되었는가? (겹침·누락 동시 확인)
- [ ] 경계값 8건의 귀속이 문서와 코드에서 일치하는가?
- [ ] 판정 불가 입력의 동작이 확정되었는가?

## 🚧 Dependencies & Blockers
- **Depends on**: DB-001, DB-002, SPEC-002
- **Blocks**: FR-013, FR-014, FR-016, FR-017, FR-042, QA-001
- **SRS 미정의**: 통화 단위 / 지역 판정 기준 / `UNKNOWN` 부재 / 경계값 명문화 (부록 D)

---

# [Util] C-02 (FR-013): 세그먼트 식별자 포맷 생성·파싱

**labels**: `feature, util, backend, audience-service, priority:medium`

## 🎯 Summary
- **Task ID**: FR-013 · **Epic**: Audience Service · **Must / L**
- **기능명**: 복합 세그먼트 문자열 생성 및 파싱
- **목적**: 3개 차원값 ↔ 하나의 문자열을 왕복 변환한다. 리포트·로그·이벤트 스냅샷이 이 문자열을 쓴다.

## 🔗 References
- SRS: REQ-FUNC-001 (형식 `AGE_XX_INCOME_XX_GEOGRAPHY_XX`) · **§1.3 정의 (예: `AGE_25_34_MID_URBAN`)**
- 선행: FR-012

## ⚠️ 원문 두 곳의 형식이 서로 다르다

| 위치 | 형식 |
| --- | --- |
| §4.1 REQ-FUNC-001 인수 기준 | `AGE_XX_INCOME_XX_GEOGRAPHY_XX` — **차원 라벨 포함** |
| §1.3 정의·약어 | `AGE_25_34_MID_URBAN` — **값만** |

**두 형식은 호환되지 않는다.** 하나를 확정해야 하고, 그 결정이 DB-002의 `composite_segment` 컬럼 길이와
FR-042의 리포트 표기, DB-004의 이벤트 스냅샷 값에 모두 반영된다.

**권고: §1.3 형식(`AGE_25_34_MID_URBAN`).** 짧고, 문서의 실제 예시이며, 라벨은 파싱에 불필요하다.
다만 파싱 시 값 자체에 `_`가 포함되므로(`AGE_25_34`) **구분자 규칙을 명확히 정해야 한다** — 이것이 이 태스크의 실질적 난점이다.

## ✅ Task Breakdown
- [ ] 형식 확정 (§4.1 vs §1.3)
- [ ] 생성 함수 — 3개 enum → 문자열
- [ ] 파싱 함수 — 문자열 → 3개 enum
- [ ] **구분자 모호성 해결** — `AGE_25_34_MID_URBAN`에서 어디까지가 연령인지
- [ ] 왕복 변환 불변성 테스트

## 🧪 Acceptance Criteria

**Scenario 1: 생성**
- **Given**: `AGE_25_34` · `MID` · `URBAN`
- **When**: 생성 함수를 호출함
- **Then**: 확정된 형식의 문자열이 반환된다

**Scenario 2: 왕복 불변**
- **Given**: 36개 조합 전부
- **When**: 생성 → 파싱을 수행함
- **Then**: 36건 모두 원래 3개 값으로 정확히 복원된다

**Scenario 3: 구분자 모호성**
- **Given**: `AGE_25_34_MID_URBAN`
- **When**: 파싱함
- **Then**: `AGE_25_34` / `MID` / `URBAN`으로 정확히 분해된다 (`AGE_25` / `34_MID` 같은 오분해 없음)

**Scenario 4: 잘못된 문자열**
- **Given**: 형식에 맞지 않는 문자열
- **When**: 파싱함
- **Then**: 명시적 오류가 발생하며 부분 결과를 반환하지 않는다

## ⚙️ Constraints
공통 제약 5개. 추가로 —
- 순수 함수. 상태 없음
- 이 문자열이 **DB에 저장되고 리포트에 표시되므로**, 형식을 나중에 바꾸면 기존 데이터 전량 마이그레이션이다

## 🏁 DoD
공통 DoD 14개. 추가로 —
- [ ] 형식이 확정되고 SRS 원문 불일치가 정정 요청되었는가?
- [ ] 36건 왕복 변환이 전수 테스트되었는가?

## 🚧 Dependencies & Blockers
- **Depends on**: FR-012
- **Blocks**: QA-001, FR-016, FR-042
- **SRS 미정의**: **§1.3 ↔ §4.1 형식 불일치 (부록 D)**

---

# [Feature/Command] C-03 (FR-014): MECE 제약 강제

**labels**: `feature, command, backend, audience-service, priority:high`

## 🎯 Summary
- **Task ID**: FR-014 · **Epic**: Audience Service · **Must / M**
- **기능명**: 차원별 정확히 1값 · 중복·누락 차단
- **목적**: 분류기가 실수해도, API가 잘못 호출돼도 **잘못된 상태가 저장되지 않게** 막는 최종 방어선.

## 🔗 References
- SRS: REQ-FUNC-001 · **§6.3 규칙 1** ("각 사용자는 각 차원에 대해 정확히 하나의 값을 가져야 한다")
- 선행: FR-012 · DB-002 (제약 조건)

## ✅ Task Breakdown
- [ ] 3개 차원 필수 검증 (애플리케이션 계층)
- [ ] 부분 갱신 거부
- [ ] 사용자당 세그먼트 1개 보장 (DB 기본키 + 애플리케이션 확인)
- [ ] enum 범위 검증
- [ ] **정합성 검사 도구** — 전체 사용자 수 vs 세그먼트별 합계 대조 (운영 중 상시 확인용)

### 방어를 4중으로 둔다

| 계층 | 장치 | 막는 것 |
| --- | --- | --- |
| 타입 | enum | 목록 밖의 값 |
| 애플리케이션 | 3차원 필수 검증 | 부분 갱신 |
| DB 제약 | `NOT NULL` + 기본키 | 누락·중복 |
| **운영 검사** | 합계 대조 도구 | **이미 어긋난 데이터의 발견** |

**네 번째가 실무에서 가장 중요하다.** 앞의 셋을 다 갖춰도 마이그레이션·직접 수정·버그로 데이터가 어긋날 수 있고,
그때 **아무도 모른 채 리포트가 틀리는 것**이 최악의 경우다. 정기 검사가 그것을 잡는다.

## 🧪 Acceptance Criteria

**Scenario 1: 부분 갱신 거부**
- **Given**: 3개 차원 중 하나만 담긴 갱신 요청
- **When**: 처리함
- **Then**: 거부되고 기존 세그먼트가 변경되지 않는다

**Scenario 2: 중복 세그먼트 차단**
- **Given**: 세그먼트가 이미 있는 사용자
- **When**: 두 번째 세그먼트를 추가 시도함
- **Then**: 거부된다 (갱신은 교체로만 가능)

**Scenario 3: 정합성 검사 — 합계 일치**
- **Given**: 사용자 10,000명이 적재된 상태
- **When**: 정합성 검사를 실행함
- **Then**: **세그먼트별 인원 합계 = 10,000**임이 확인되고, 어긋나면 어긋난 사용자 목록이 보고된다

**Scenario 4: 정합성 검사 — 어긋난 데이터 발견**
- **Given**: 직접 조작으로 세그먼트가 비어 있는 사용자를 만듦
- **When**: 정합성 검사를 실행함
- **Then**: 해당 사용자가 보고된다

**Scenario 5: 정보 미상 사용자**
- **Given**: 소득을 알 수 없는 사용자
- **When**: 저장을 시도함
- **Then**: **(미정)** — 저장 불가. `UNKNOWN` 값 부재로 **MECE 전체 포괄이 물리적으로 깨진다**

## ⚙️ Constraints
공통 제약 5개. 추가로 —
- 정합성 검사는 **운영 중 정기 실행** 대상 — 실행 주기와 알림 경로를 정해야 한다
- 성능: 검사는 대량 스캔이므로 운영 시간대를 피할 것

## 🏁 DoD
공통 DoD 14개. 추가로 —
- [ ] 4중 방어가 모두 동작하는가?
- [ ] 정합성 검사 도구가 있고 실행 주기가 정해졌는가?
- [ ] QA-001의 커버리지 검증에 이 도구가 사용되는가?

## 🚧 Dependencies & Blockers
- **Depends on**: FR-012, DB-002
- **Blocks**: FR-017, QA-001
- **SRS 미정의**: `UNKNOWN` 세그먼트 부재 (부록 D) — **이 태스크의 근본 제약**

---

# [Feature/Command] C-04 (FR-015): 멀티 태그 행동 신호 처리기

**labels**: `feature, command, backend, audience-service, priority:high`

## 🎯 Summary
- **Task ID**: FR-015 · **Epic**: Audience Service · **Must / H**
- **기능명**: `BehavioralSignalProcessor` — 카테고리 간 복수 태그 관리
- **목적**: 1단계 정밀 타게팅의 입력을 만든다. **인구통계와 정반대로 "겹치는 것이 정상"인 데이터**를 다룬다.

## 🔗 References
- SRS: **REQ-FUNC-002** · §6.3 규칙 2 · §5 `BehavioralSignalProcessor` · §6.2 행동 신호 3종
- 선행: DB-001 · DB-002 · SPEC-003
- 학습 해설: `SRS-READER.html` 15장

## ✅ Task Breakdown
- [ ] 태그 추가 (누적) — SPEC-003 확정안
- [ ] 태그 제거
- [ ] 동일 태그 재전송 멱등 처리 (DB 유일성 제약 활용)
- [ ] 카테고리별 그룹 조회 지원
- [ ] **역방향 조회** — 태그 → 사용자 (FR-029의 입력)
- [ ] 배열 요청의 전부 성공/전부 실패 처리

### `EngagementBehavior`의 구조 문제를 설계에 반영할 것

§6.2의 `EngagementBehavior`는 성격이 다른 두 축을 한 enum에 섞었다.

| 값 | 축 | 성질 |
| --- | --- | --- |
| `HIGH_FREQUENCY` · `MODERATE_FREQUENCY` · `LOW_FREQUENCY` | **얼마나 자주** | 서로 배타적 |
| `RESEARCH_ORIENTED` · `IMPULSE_DRIVEN` | **어떤 방식으로** | 빈도와 독립 |

한 사람이 "고빈도이면서 탐색 지향"인 것은 자연스러운데, 한 enum에 섞여 있으면 그 조합을 표현하기가 어색해진다.
**빈도 3종은 사실상 단일 선택으로 취급하는 것이 옳다** — 그 규칙을 이 태스크에서 정해야 한다.
근본 해결은 두 enum으로 분리하는 것이며, 설계 리뷰 안건으로 제기할 것.

## 🧪 Acceptance Criteria

**Scenario 1: 카테고리 간 복수 태그**
- **Given**: 태그가 없는 사용자
- **When**: 3개 카테고리에 각 1개씩 추가함
- **Then**: 3개가 모두 저장되고 카테고리별로 조회된다

**Scenario 2: 같은 카테고리에 복수 태그 — 멀티 태그 성립**
- **Given**: `PURCHASE_INTENT / AUTOMOTIVE`가 부여된 사용자
- **When**: `PURCHASE_INTENT / FINANCE`를 추가함
- **Then**: **두 값이 공존**한다 (§6.3 규칙 2)

**Scenario 3: 빈도 태그 배타성**
- **Given**: `HIGH_FREQUENCY`가 부여된 사용자
- **When**: `LOW_FREQUENCY`를 추가함
- **Then**: **(제안)** 기존 빈도 태그가 교체된다 (한 사람의 활동 빈도는 하나)

**Scenario 4: 동일 태그 멱등**
- **Given**: `AUTOMOTIVE`가 부여된 사용자
- **When**: 같은 태그를 다시 추가함
- **Then**: 태그는 1개로 유지되고 오류가 발생하지 않는다

**Scenario 5: 배열 일부 오류**
- **Given**: 열거값 밖 항목이 섞인 배열
- **When**: 추가함
- **Then**: **전부 실패**하고 아무것도 저장되지 않는다

**Scenario 6: 역방향 조회 성능**
- **Given**: 태그 500만 건 적재
- **When**: 특정 태그를 가진 사용자를 조회함
- **Then**: `ix_signals_reverse`를 사용하고 FR-029의 예산 이내다

**Scenario 7: 태그 개수 상한**
- **Given**: 태그가 다수 부여된 사용자
- **When**: 추가함
- **Then**: **(미정)** — REQ-FUNC-002에 최소·최대가 없어 판정 불가

## ⚙️ Constraints
공통 제약 5개. 추가로 —
- 태그는 **무한히 쌓인다.** 유효 기간·상한이 없으면 정확도가 시간과 함께 떨어진다 (§7.2가 향후로 이관)
- 성능: 역방향 조회가 FR-029의 입력이므로 색인이 필수
- **MVP에서 이 데이터를 누가 채우는가** — §7.2가 동적 태깅을 미뤘으므로 미정 (E-09)

## 🏁 DoD
공통 DoD 14개. 추가로 —
- [ ] 같은 카테고리 복수 태그 유지가 테스트로 증명되었는가?
- [ ] 빈도 태그의 배타 처리 규칙이 확정되었는가?
- [ ] 역방향 조회 실행 계획이 색인을 사용하는가?
- [ ] 태그 최소·최대 개수가 확정되었는가? (REQ-FUNC-002 인수 기준 보완)

## 🚧 Dependencies & Blockers
- **Depends on**: DB-001, DB-002, SPEC-003
- **Blocks**: FR-016, FR-018, FR-029, FR-042, QA-002
- **SRS 미정의**: 태그 개수 · 유효 기간 · 신뢰도 / **E-09 호출 주체** / `EngagementBehavior` 축 혼재

---

# [Feature/Command] C-05 (FR-017): 세그먼트 갱신 API 구현

**labels**: `feature, command, backend, audience-service, priority:high`

## 🎯 Summary
- **Task ID**: FR-017 · **Epic**: Audience Service · **Must / M**
- **기능명**: `POST /api/v1/audience/profiles/{userId}/segments` 구현
- **목적**: 외부에서 세그먼트를 배정·재배정하는 경로.

## 🔗 References
- 계약: **SPEC-002** · SRS: §6.1 · REQ-FUNC-001 · §6.3 규칙 1
- 선행: FR-012 · FR-014 · DB-002

## ✅ Task Breakdown
- [ ] 요청 DTO 및 검증 (SPEC-002 확정안 A 또는 B)
- [ ] 분류기 호출 (안 A) 또는 직접 검증 (안 B)
- [ ] MECE 제약 적용 (FR-014)
- [ ] 기존 세그먼트 교체 — 이력 보존 여부 확정
- [ ] 응답에 배정 결과 반환
- [ ] 단위 · 통합 테스트

## 🧪 Acceptance Criteria

**Scenario 1: 신규 배정**
- **Given**: 세그먼트가 없는 사용자와 판정 가능한 입력
- **When**: 갱신을 요청함
- **Then**: `200`과 배정된 복합 세그먼트가 반환되고, 조회 시 동일 값이 나온다

**Scenario 2: 재배정 — 교체**
- **Given**: `AGE_25_34_MID_URBAN`인 사용자
- **When**: 연령이 바뀐 입력으로 갱신함
- **Then**: 세그먼트가 교체되고 **이전 값은 남지 않는다** (사용자당 1개)

**Scenario 3: 부분 갱신 거부**
- **Given**: 3개 차원 중 하나만 담긴 요청
- **When**: 갱신을 요청함
- **Then**: `400`이 반환되고 변경되지 않는다

**Scenario 4: 열거값 밖 입력**
- **Given**: 정의되지 않은 값
- **When**: 갱신을 요청함
- **Then**: `400`이 반환된다

**Scenario 5: 과거 이벤트 불변**
- **Given**: 이 사용자로 노출이 기록된 상태
- **When**: 세그먼트를 재배정함
- **Then**: **과거 이벤트의 세그먼트 스냅샷은 변하지 않는다** (DB-004 설계 근거)

## ⚙️ Constraints
공통 제약 5개. 추가로 —
- 광고 요청 경로 밖. 성능 여유 있음
- 소득 원시값 수신 시 마스킹 (NF-012)

## 🏁 DoD
공통 DoD 14개. 추가로 —
- [ ] 재배정이 과거 리포트를 변경하지 않음을 확인했는가?
- [ ] 세그먼트 변경 이력 보존 여부가 결정되었는가?

## 🚧 Dependencies & Blockers
- **Depends on**: SPEC-002, FR-012, FR-014, DB-002
- **Blocks**: QA-001
- **SRS 미정의**: 요청 형식 안 A·B / 통화 단위 / 지역 판정 기준 / 변경 이력 보존 여부

---

# [Feature/Command] C-06 (FR-018): 행동 신호 추가 API 구현

**labels**: `feature, command, backend, audience-service, priority:high`

## 🎯 Summary
- **Task ID**: FR-018 · **Epic**: Audience Service · **Must / M**
- **기능명**: `POST /api/v1/audience/profiles/{userId}/behavioral-signals` 구현
- **목적**: 행동 태그를 외부에서 주입하는 경로. **MVP에서 이 API가 호출되지 않으면 1단계 타게팅이 동작하지 않는다.**

## 🔗 References
- 계약: **SPEC-003** · SRS: §6.1 · REQ-FUNC-002 · §6.3 규칙 2
- 선행: FR-015 · DB-002

## ⚠️ 이 태스크에는 사업적 미결 사항이 걸려 있다 (E-09)

§7.2가 **동적 태깅 파이프라인을 향후 개선으로 이관**했다. 즉 **MVP에서 태그가 자동으로 붙지 않는다.**
그러면 이 API는 누가 호출하는가?

| 가능한 주체 | 함의 |
| --- | --- |
| CRM 매니저 수동 입력 | 규모의 한계 — 수백만 사용자에 수동 태깅은 불가능 |
| 외부 User Profile Service 배치 (FR-049) | 현실적. 단 §3에 그 인터페이스가 명시되지 않음 |
| 아무도 호출하지 않음 | **1단계 정밀 타게팅이 항상 실패한다** → 전 요청이 2·3단계로 |

**세 번째가 실제로 벌어지면 REQ-FUNC-004의 1단계는 죽은 코드가 된다.**
착수 전에 확인할 사업 판단 사항이다.

## ✅ Task Breakdown
- [ ] 요청 DTO 및 검증 (SPEC-003)
- [ ] 처리기 호출 (FR-015)
- [ ] 배열 전부 성공/전부 실패 처리
- [ ] 멱등 응답 (`duplicate` 표기)
- [ ] **호출 주체 확인 및 연동 경로 확정 (E-09)**

## 🧪 Acceptance Criteria

**Scenario 1: 태그 3개 추가**
- **Given**: 태그가 없는 사용자
- **When**: 3개 카테고리에 각 1개씩 추가함
- **Then**: `201`과 `added: 3`이 반환된다

**Scenario 2: 멱등 재전송**
- **Given**: 이미 부여된 태그
- **When**: 동일 태그를 재전송함
- **Then**: 오류 없이 처리되고 태그 수가 증가하지 않는다

**Scenario 3: 배열 일부 오류**
- **Given**: 열거값 밖 항목이 섞인 배열
- **When**: 추가를 요청함
- **Then**: `400`이 반환되고 **아무것도 저장되지 않는다**

**Scenario 4: 존재하지 않는 사용자**
- **Given**: 프로파일이 없는 사용자 ID
- **When**: 태그 추가를 요청함
- **Then**: **(미정)** — `404`인가, 프로파일을 함께 생성하는가
  <!-- DB-002의 외래키가 user_profiles를 참조하므로, 프로파일 없이 태그만 저장할 수 없다.
       인구통계를 모르는 사용자의 태그는 어디에 저장하는가 — UNKNOWN 부재 문제와 연결된다. -->

## ⚙️ Constraints
공통 제약 5개. 추가로 —
- 광고 요청 경로 밖
- 대량 배치 유입 가능성 — 속도 제한 검토

## 🏁 DoD
공통 DoD 14개. 추가로 —
- [ ] **E-09(호출 주체)가 확정되었는가?**
- [ ] Scenario 4가 확정되고 DB-002 외래키 설계와 정합한가?

## 🚧 Dependencies & Blockers
- **Depends on**: SPEC-003, FR-015, DB-002
- **Blocks**: QA-002
- **SRS 미정의**: **E-09 호출 주체 — 1단계 타게팅 동작 여부와 직결** / 프로파일 없는 사용자의 태그 저장

---

# [Feature/Command] C-07 (FR-019a): 캠페인 생성·수정·삭제

**labels**: `feature, command, backend, campaign-service, priority:high`

## 🎯 Summary
- **Task ID**: FR-019a · **Epic**: Campaign Service · **Must / M**
- **기능명**: `CampaignManager` 쓰기 — 생성·수정·삭제
- **목적**: v1.1에서 CRUD를 CQRS 축으로 분할한 쓰기 절반. **"CRUD 60% 완료" 같은 무의미한 보고를 없앤다.**

## 🔗 References
- SRS: REQ-FUNC-003 · §5 `CampaignManager` · §6.4 `campaigns`
- 선행: DB-003 · 원장 v1.1 M5

## ✅ Task Breakdown
- [ ] 생성 — 초기 상태 `DRAFT` 고정
- [ ] 수정 — 어떤 필드가 어떤 상태에서 수정 가능한지 규칙화
- [ ] **삭제 — 논리 삭제 (DB-005 컴포넌트 사용)**
- [ ] 소유자 귀속 (D-01)
- [ ] 예산 필드 검증 (총예산 ≥ 일일 상한)
- [ ] 트랜잭션 처리

### 상태별 수정 가능 필드 (제안 — SRS에 규정 없음)

| 상태 | 수정 가능 | 근거 |
| --- | --- | --- |
| `DRAFT` | 전부 | 아직 집행 전 |
| `ACTIVE` | 예산 증액 · 종료일 연장 · 타게팅 | 집행 중 변경은 제한적으로 |
| `PAUSED` | `ACTIVE`와 동일 | — |
| `COMPLETED` | 없음 (읽기만) | 종료된 캠페인의 변경은 정산 왜곡 |

**`ACTIVE` 상태에서 입찰가·과금 방식을 바꿀 수 있는가**가 특히 중요하다. 허용하면 집행 중 단가가 변해
성과 지표의 해석이 어려워진다. 금지하는 편이 안전하나 광고주 편의는 떨어진다 — 사업 판단이 필요하다.

## 🧪 Acceptance Criteria

**Scenario 1: 생성**
- **Given**: 유효한 캠페인 정보
- **When**: 생성함
- **Then**: `DRAFT` 상태로 생성되고 소유자가 귀속된다

**Scenario 2: 예산 구성 검증**
- **Given**: 일일 상한이 총예산을 초과하는 입력
- **When**: 생성함
- **Then**: 거부된다

**Scenario 3: 논리 삭제**
- **Given**: 성과가 집계된 캠페인
- **When**: 삭제함
- **Then**: 목록에서 사라지지만 **DB에 행이 남고 과거 리포트가 유지된다**

**Scenario 4: 완료된 캠페인 수정 거부**
- **Given**: `COMPLETED` 캠페인
- **When**: 예산 수정을 시도함
- **Then**: **(제안)** 거부된다

**Scenario 5: 타 광고주 캠페인 수정**
- **Given**: 광고주 A의 인증과 B의 캠페인
- **When**: 수정을 시도함
- **Then**: `403`이 반환된다 (D-01)

**Scenario 6: 이름 재사용**
- **Given**: 삭제된 캠페인과 동일한 이름
- **When**: 새 캠페인을 생성함
- **Then**: 성공한다 (DB-005 부분 색인)

## ⚙️ Constraints
공통 제약 5개. 추가로 —
- 물리 삭제 절대 금지 (§6.3 규칙 5)
- 상태 전이는 이 태스크의 책임이 아니다 (FR-020)

## 🏁 DoD
공통 DoD 14개. 추가로 —
- [ ] 상태별 수정 가능 필드 규칙이 확정되고 구현되었는가?
- [ ] `ACTIVE` 상태의 입찰가 변경 허용 여부가 결정되었는가?

## 🚧 Dependencies & Blockers
- **Depends on**: DB-003, DB-005
- **Blocks**: FR-020, FR-021, FR-022, FR-024, FR-025, FR-026, QA-003
- **SRS 미정의**: 상태별 수정 가능 필드 (본 이슈 제기) / **D-01** 소유자

---

# [Feature/Command] C-08 (FR-020): 캠페인 상태 전이 관리

**labels**: `feature, command, backend, campaign-service, priority:high`

## 🎯 Summary
- **Task ID**: FR-020 · **Epic**: Campaign Service · **Must / M**
- **기능명**: `DRAFT → ACTIVE → PAUSED → COMPLETED` 전이 관리
- **목적**: 캠페인이 언제 광고 후보가 되고 언제 빠지는지를 통제한다. **후보 자격의 유일한 판정 기준**이다.

## 🔗 References
- SRS: REQ-FUNC-003 · **§6.2 `CampaignStatus`**(4종) · §6.3 규칙 7
- 선행: DB-001 · FR-019a

## ⚠️ `COMPLETED` 진입 조건이 정의되지 않았다 (E-04)

§6.2는 `COMPLETED("완료")`를 정의하지만 **무엇이 캠페인을 완료로 만드는지** 규정이 없다.
§6.3 규칙 7의 예산 소진은 `PAUSED`로 이어진다. 그러면 남는 후보는 **기간 만료**인데,
§6.4 `campaigns`에 기간 컬럼이 명시되지 않았다(SPEC-004에서 신설 제안).

**기간 필드가 없으면 `COMPLETED`는 도달 불가능한 상태가 된다.**

## ✅ Task Breakdown
- [ ] 허용 전이 규칙 구현 (아래 표)
- [ ] 잘못된 전이 거부
- [ ] `COMPLETED` 자동 진입 — 기간 만료 감지 **(E-04 확정 후)**
- [ ] 전이 이력 기록
- [ ] 전이 시 후보 자격 즉시 반영

### 허용 전이 (제안)

| From → To | 허용 | 트리거 |
| --- | --- | --- |
| `DRAFT` → `ACTIVE` | ○ | 광고주 수동 |
| `ACTIVE` → `PAUSED` | ○ | 광고주 수동 **또는 예산 소진 자동(FR-023)** |
| `PAUSED` → `ACTIVE` | ○ | 광고주 수동 (예산 잔액 있을 때만) |
| `ACTIVE`·`PAUSED` → `COMPLETED` | ○ | **기간 만료 자동 (E-04)** |
| `COMPLETED` → 무엇이든 | ✗ | 종료는 되돌릴 수 없다 |
| `DRAFT` → `PAUSED`·`COMPLETED` | ✗ | 집행 없이 종료는 삭제로 처리 |

## 🧪 Acceptance Criteria

**Scenario 1: 정상 전이**
- **Given**: `DRAFT` 캠페인
- **When**: `ACTIVE`로 전이함
- **Then**: 성공하고 **즉시 광고 후보에 포함된다**

**Scenario 2: 잘못된 전이 거부**
- **Given**: `COMPLETED` 캠페인
- **When**: `ACTIVE`로 전이 시도함
- **Then**: 거부된다

**Scenario 3: 일시중지 시 후보 제외**
- **Given**: `ACTIVE` 캠페인이 후보에 포함된 상태
- **When**: `PAUSED`로 전이함
- **Then**: **즉시 후보에서 제외된다** (캐시가 있다면 무효화 필요)

**Scenario 4: 예산 잔액 없이 재개 시도**
- **Given**: 예산이 소진되어 `PAUSED`된 캠페인
- **When**: `ACTIVE`로 전이 시도함
- **Then**: **(제안)** 거부된다 — 즉시 다시 `PAUSED`될 상태로 되돌릴 이유가 없다

**Scenario 5: 기간 만료**
- **Given**: 종료일이 지난 `ACTIVE` 캠페인
- **When**: 만료 감지가 실행됨
- **Then**: **(미정 — E-04)** `COMPLETED`로 전이한다. 기간 필드 신설이 전제

## ⚙️ Constraints
공통 제약 5개. 추가로 —
- **전이가 후보 자격에 즉시 반영되어야 한다.** 캐시를 쓴다면 무효화 경로가 필수 — 일시중지된 캠페인이 계속 노출되면 예산 초과 집행이다
- 전이 이력은 정산 분쟁 시 근거가 된다

## 🏁 DoD
공통 DoD 14개. 추가로 —
- [ ] 전이 규칙표가 확정되고 전수 테스트되었는가?
- [ ] **E-04(`COMPLETED` 진입 조건)가 확정되었는가?**
- [ ] 전이 후 후보 자격 반영 지연이 측정되었는가?

## 🚧 Dependencies & Blockers
- **Depends on**: DB-001, FR-019a
- **Blocks**: FR-023, QA-003
- **SRS 미정의**: **E-04 `COMPLETED` 진입 조건 · 기간 필드 부재** / 전이 규칙 자체 (본 이슈 제안)

---

# [Feature/Command] C-09 (FR-021): 타게팅 조건 설정·저장

**labels**: `feature, command, backend, campaign-service, priority:high`

## 🎯 Summary
- **Task ID**: FR-021 · **Epic**: Campaign Service · **Must / H**
- **기능명**: 인구통계 + 행동 타게팅 조건 저장
- **목적**: 캠페인이 노리는 오디언스를 확정한다. **FR-029·FR-030 매칭의 기준 데이터**를 만든다.

## 🔗 References
- 계약: **SPEC-005 조건 결합 규칙 (E-02)**
- SRS: REQ-FUNC-003 · §1.2 범위 · §6.4 `campaign_targeting` **(비정규화)**
- 선행: DB-001 · DB-003 · FR-019a

## ✅ Task Breakdown
- [ ] 6개 차원 배열 저장 (비정규화 구조)
- [ ] enum 범위 검증
- [ ] 빈 배열 = 제약 없음 처리
- [ ] 전체 교체 의미 구현 (`PUT`)
- [ ] GIN 색인 갱신 확인
- [ ] **조건 결합 규칙을 FR-029·FR-030과 동일 해석으로 문서화**

## 🧪 Acceptance Criteria

**Scenario 1: 6개 차원 저장**
- **Given**: 인구통계 3차원 + 행동 3차원 조건
- **When**: 저장함
- **Then**: 모두 저장되고 조회 시 동일하게 반환된다

**Scenario 2: 전체 교체**
- **Given**: `purchaseIntents`에 2개 값이 있는 캠페인
- **When**: 1개만 담아 저장함
- **Then**: 기존 2개가 제거되고 1개만 남는다

**Scenario 3: 빈 배열 의미**
- **Given**: 행동 3차원을 모두 빈 배열로 저장함
- **When**: FR-030이 후보를 조회함
- **Then**: 이 캠페인이 **2단계 후보**로 나타난다

**Scenario 4: 열거값 밖 값**
- **Given**: 정의되지 않은 세그먼트 값
- **When**: 저장함
- **Then**: `400`이 반환되고 기존 조건이 변경되지 않는다

**Scenario 5: 인구통계 없이 행동만**
- **Given**: 인구통계 3차원을 비우고 행동 조건만 지정
- **When**: 저장함
- **Then**: **(미정)** — 허용하는가. 허용 시 이 캠페인은 1단계에서만 매칭되고 2단계에서는 제외된다
  <!-- Q-04의 E-10과 같은 뿌리다. 2단계 정의를 확정하면 이 시나리오도 함께 결정된다. -->

**Scenario 6: 색인 성능**
- **Given**: 캠페인 5,000건의 조건이 저장된 상태
- **When**: 세그먼트·태그 조합으로 후보를 조회함
- **Then**: GIN 색인을 사용하고 Campaign 구간 예산 이내다

## ⚙️ Constraints
공통 제약 5개. 추가로 —
- **이 데이터는 광고 요청 경로에서 읽힌다.** §6.4의 비정규화는 조회 속도를 위한 의도적 선택 — 갱신 편의보다 조회가 우선
- 조건 결합 규칙을 FR-029·FR-030과 다르게 해석하면 **같은 캠페인이 구현마다 다르게 매칭된다**

## 🏁 DoD
공통 DoD 14개. 추가로 —
- [ ] **E-02 조건 결합 규칙이 확정되고 FR-029·FR-030 담당자와 해석이 일치하는가?**
- [ ] 빈 배열의 의미가 세 태스크에서 동일하게 구현되었는가?

## 🚧 Dependencies & Blockers
- **Depends on**: DB-001, DB-003, FR-019a, SPEC-005
- **Blocks**: FR-027, FR-029, FR-030, FR-031, QA-003
- **SRS 미정의**: **E-02 조건 결합 규칙** / 인구통계 없는 조건의 허용 여부 (본 이슈 제기)

---

# [Feature/Command] C-10 (FR-022): 예산 관리 — 상한 설정 및 잔액 추적

**labels**: `feature, command, backend, campaign-service, priority:high, blocked-d02`

## 🎯 Summary
- **Task ID**: FR-022 · **Epic**: Campaign Service · **Must / H**
- **기능명**: 총예산·일일 상한 설정 및 잔액 추적
- **목적**: 광고비 집행의 상한을 관리한다. **여기가 틀리면 청구할 수 없는 광고를 집행한다.**

## 🔗 References
- SRS: REQ-FUNC-003 · **§6.3 규칙 7** ("일일 예산 상한을 적용하고, 예산 소진 시 캠페인을 자동 일시중지")
- 확정 안건: `docs/W0-decision-agenda.md` **D-02**
- 선행: DB-003 (`spent_today`·`spent_date` 컬럼) · FR-019a

## ✅ Task Breakdown
- [ ] 총예산·일일 상한 설정·수정
- [ ] 잔액 계산 — 누적 컬럼 기반 (DB-003 설계)
- [ ] **일자 전환 처리** — `spent_today` 초기화 시점과 기준 시간대 **(미정)**
- [ ] 잔액 조회 인터페이스 (FR-029·FR-030의 후보 필터가 사용)
- [ ] 증액·감액 처리 — 이미 집행된 금액과의 관계
- [ ] **D-02 확정안 반영** — 허용 초과율

### 일자 전환이 의외의 난점이다

일일 예산은 "하루"를 기준으로 하는데, **하루의 시작이 언제인지가 SRS에 없다.**

| 기준 | 함의 |
| --- | --- |
| UTC 자정 | 구현 단순. 국내 광고주에게는 오전 9시가 하루의 시작 |
| 서비스 기준 시간대 자정 | 자연스러움. 시간대 설정이 필요 |
| 광고주별 시간대 | 다국가 대응. 구현 복잡 |

**국내 서비스라면 두 번째가 맞고, 그 결정을 계약·문서에 명시해야 한다.**
잘못 정하면 광고주가 "우리 예산이 왜 새벽에 리셋되냐"고 묻게 된다.

## 🧪 Acceptance Criteria

**Scenario 1: 상한 설정**
- **Given**: 총예산 500만 · 일일 상한 50만
- **When**: 설정함
- **Then**: 저장되고 잔액이 정확히 계산된다

**Scenario 2: 일자 전환**
- **Given**: `spent_today`가 상한에 도달한 캠페인
- **When**: 날짜가 바뀜
- **Then**: `spent_today`가 0으로 초기화되고 캠페인이 다시 노출 가능해진다

**Scenario 3: 총예산 소진**
- **Given**: 총예산이 소진된 캠페인
- **When**: 날짜가 바뀜
- **Then**: **일일 상한이 초기화되어도 총예산 소진으로 여전히 노출되지 않는다**

**Scenario 4: 증액**
- **Given**: 총예산이 소진되어 중지된 캠페인
- **When**: 총예산을 증액함
- **Then**: 다시 노출 가능해진다 (상태 전이는 FR-020)

**Scenario 5: 감액 — 이미 집행된 금액 이하로**
- **Given**: 300만 집행된 캠페인
- **When**: 총예산을 200만으로 감액 시도함
- **Then**: **(제안)** 거부된다. 이미 집행된 금액보다 작은 예산은 성립하지 않는다

**Scenario 6: 동시 잔액 조회**
- **Given**: 초당 1,000건의 후보 조회가 잔액을 읽는 상황
- **When**: 조회가 수행됨
- **Then**: 잔액 조회가 병목이 되지 않는다 (누적 컬럼 직접 읽기, 이벤트 합산 금지)

## ⚙️ Constraints
공통 제약 5개. 추가로 —
- **잔액은 캐시하면 안 된다.** 예산 소진 순간의 지연이 곧 초과 집행이다 (`SRS-READER.html` 9장 캐시 항목)
- 성능: 잔액 조회가 광고 요청 경로 안에 있다. 이벤트 합산 방식은 초당 1,000건을 버틸 수 없다
- **실제 차감은 FR-035의 책임.** 이 태스크는 상한 설정과 잔액 노출까지

## 🏁 DoD
공통 DoD 14개. 추가로 —
- [ ] **일자 전환 기준 시간대가 확정되고 문서화되었는가?**
- [ ] 잔액 조회가 누적 컬럼 기반이며 이벤트 합산이 아님을 확인했는가?
- [ ] D-02의 허용 초과율이 반영되었는가?

## 🚧 Dependencies & Blockers
- **Depends on**: DB-003, FR-019a
- **Blocks**: FR-023, FR-035, QA-005
- **SRS 미정의**: **D-02 동시성·허용 초과율** / 일자 전환 기준 시간대 (본 이슈 제기) / 페이싱 부재 (부록 C)

---

# [Feature/Command] C-11 (FR-023): 예산 소진 시 자동 일시중지

**labels**: `feature, command, backend, campaign-service, priority:high, blocked-d02`

## 🎯 Summary
- **Task ID**: FR-023 · **Epic**: Campaign Service · **Must / M**
- **기능명**: 예산 소진 감지 및 `PAUSED` 자동 전환
- **목적**: §6.3 규칙 7의 후반부를 구현한다. **초과 집행을 막는 두 번째 방어선.**

## 🔗 References
- SRS: **§6.3 규칙 7** · REQ-FUNC-003 · §6.2 `CampaignStatus.PAUSED`
- 선행: FR-020 · FR-022 · **D-02**

## ✅ Task Breakdown
- [ ] 소진 감지 시점 결정 — 차감 직후 동기 vs 주기 배치 (아래)
- [ ] `PAUSED` 전환 (FR-020 호출)
- [ ] 후보 목록에서 즉시 제외 반영
- [ ] 일자 전환 시 재개 처리
- [ ] 광고주 통보 여부 **(미정)**

### 감지 시점 — 두 안의 차이가 크다

| 안 | 방식 | 초과 위험 | 비용 |
| --- | --- | --- | --- |
| **A** | 차감 직후 동기 확인 (권고) | 최소 | 차감 경로에 로직 추가 |
| **B** | 1분 주기 배치 확인 | **1분간 계속 집행** — 초당 1,000건 환경에서 최대 6만 건 | 낮음 |

**A를 권고한다.** B는 감지 지연 동안 집행이 계속되므로 §6.3 규칙 7의 의도를 달성하지 못한다.
단 A는 FR-035의 차감 경로에 붙으므로 **성능 예산에 포함된다** — 가벼워야 한다.

## 🧪 Acceptance Criteria

**Scenario 1: 일일 상한 도달**
- **Given**: 일일 상한에 1원 남은 캠페인
- **When**: 그 금액을 초과하는 집행이 발생함
- **Then**: 캠페인이 `PAUSED`로 전환되고 **즉시 후보에서 제외된다**

**Scenario 2: 총예산 소진**
- **Given**: 총예산에 도달한 캠페인
- **When**: 감지가 실행됨
- **Then**: `PAUSED`로 전환되고, **일자 전환에도 재개되지 않는다**

**Scenario 3: 일자 전환 재개**
- **Given**: 일일 상한 소진으로 `PAUSED`된 캠페인 (총예산 잔액 있음)
- **When**: 날짜가 바뀜
- **Then**: 다시 노출 가능해진다

**Scenario 4: 감지 지연 측정**
- **Given**: 소진이 발생함
- **When**: 후보 제외까지의 시간을 측정함
- **Then**: **(미정)** — 확정된 허용 지연 이내다. **이 지연 × 초당 요청 수 = 초과 집행량**

**Scenario 5: 동시 소진**
- **Given**: 여러 요청이 동시에 소진 지점을 통과함
- **When**: 감지가 실행됨
- **Then**: 중복 전환 시도가 오류를 일으키지 않는다 (멱등)

## ⚙️ Constraints
공통 제약 5개. 추가로 —
- **감지 지연이 곧 손실이다.** 지연 1초 × 1,000 RPS = 최대 1,000건의 초과 노출
- 후보 제외 반영에 캐시가 관여하면 무효화 경로가 필수

## 🏁 DoD
공통 DoD 14개. 추가로 —
- [ ] 감지 시점이 A·B 중 확정되었는가?
- [ ] 감지→후보 제외 지연이 측정되고 허용 범위가 합의되었는가?
- [ ] 광고주 통보 여부가 결정되었는가?

## 🚧 Dependencies & Blockers
- **Depends on**: FR-020, FR-022
- **Blocks**: QA-003, QA-005
- **SRS 미정의**: **D-02** / 감지 허용 지연 / 광고주 통보 / 페이싱 부재

---

# [Feature/Command] C-12 (FR-024): 입찰 전략 설정

**labels**: `feature, command, backend, campaign-service, priority:high, blocked-d03`

## 🎯 Summary
- **Task ID**: FR-024 · **Epic**: Campaign Service · **Must / M**
- **기능명**: CPC / CPM / CPA 입찰 전략 및 입찰가 설정
- **목적**: FR-034의 선택 기준 입력을 만든다. **D-03의 결정에 따라 이 태스크의 범위가 달라진다.**

## 🔗 References
- SRS: **§6.2 `BiddingStrategy`**(CPC·CPM·CPA) · REQ-FUNC-005
- 확정 안건: **D-03** — 안 B(CPM 단일화) 선택 시 이 태스크가 크게 축소된다
- 선행: DB-001 · DB-003 · FR-019a
- 학습 해설: `SRS-READER.html` 13장 (CPC·CPM·CPA·eCPM)

## ✅ Task Breakdown
- [ ] 전략 선택 및 입찰가 설정
- [ ] **통화 단위 확정 후 반영 (미정)**
- [ ] 전략별 입찰가 의미 검증 (CPC=클릭당, CPM=1,000노출당, CPA=전환당)
- [ ] 집행 중 전략·입찰가 변경 허용 여부 (C-07 규칙 적용)
- [ ] **D-03 안 B 선택 시** — CPC·CPA를 §7로 이관하고 CPM만 허용

## 🧪 Acceptance Criteria

**Scenario 1: 전략별 설정**
- **Given**: CPC 1,000원 / CPM 3,000원 / CPA 50,000원
- **When**: 각각 설정함
- **Then**: 저장되고 단위가 명시적으로 구분된다

**Scenario 2: 단위 혼동 방지**
- **Given**: CPM 3,000원 캠페인
- **When**: 입찰가를 조회함
- **Then**: **"1,000회 노출당 3,000원"** 임이 응답·화면에서 명확하다
  <!-- 단위 표기가 없으면 CPC 3,000원과 혼동되어 광고주가 예산을 잘못 계획한다. -->

**Scenario 3: 열거값 밖 전략**
- **Given**: `"CPV"` 등
- **When**: 설정함
- **Then**: `400`이 반환된다

**Scenario 4: 집행 중 변경**
- **Given**: `ACTIVE` 캠페인
- **When**: 입찰가 변경을 시도함
- **Then**: **(미정)** — C-07의 상태별 수정 규칙에 따름

**Scenario 5: D-03 안 B 적용 시**
- **Given**: D-03에서 CPM 단일화가 결정된 경우
- **When**: CPC 전략으로 설정을 시도함
- **Then**: 거부되고 §7 향후 개선 항목임을 안내한다

## ⚙️ Constraints
공통 제약 5개. 추가로 —
- **단위 표기가 필수다.** 세 전략의 단위가 다르므로 숫자만으로는 의미가 없다
- D-03의 결정이 이 태스크의 범위를 정한다 — 착수 전 확인

## 🏁 DoD
공통 DoD 14개. 추가로 —
- [ ] **D-03 확정안이 반영되었는가?**
- [ ] 통화 단위가 확정되고 API·화면에 표기되는가?
- [ ] 전략별 단위가 광고주에게 명확히 전달되는가?

## 🚧 Dependencies & Blockers
- **Depends on**: DB-001, DB-003, FR-019a
- **Blocks**: FR-034, QA-005
- **SRS 미정의**: **D-03 — 이 태스크의 범위 결정** / 통화 단위 / 집행 중 변경 허용

---

# [Feature/Command] C-13 (FR-025): 크리에이티브 자산 등록·관리

**labels**: `feature, command, backend, campaign-service, priority:medium`

## 🎯 Summary
- **Task ID**: FR-025 · **Epic**: Campaign Service · **Must / M**
- **기능명**: 광고 소재 등록·수정·삭제
- **목적**: 실제로 화면에 보이는 것을 관리한다. **FR-037이 응답에 실어 보낼 대상.**

## 🔗 References
- SRS: **§6.4 `campaign_creatives`** ("크리에이티브 자산 및 성과") · §6.2 `AdPosition`
- 선행: DB-003 · FR-019a · **UX-004 위치별 규격**

## ⚠️ SRS에 소재 관련 규정이 거의 없다

§6.4가 테이블 이름과 한 줄 설명만 제공한다. 다음이 전부 미정의다.

| 미정의 항목 | 왜 필요한가 |
| --- | --- |
| 위치별 크기 규격 | 규격 없이 등록하면 지면이 깨진다 → UX-004에서 산출 |
| 허용 파일 형식·용량 | 큰 이미지는 광고 로딩을 지연시켜 노출로 집계되지 않는다 |
| 소재 심사 절차 | 부적절한 소재의 노출은 매체 신뢰도 문제 |
| A/B 테스트 지원 | §6.4가 "성과"를 언급하나 소재별 성과 비교 요구사항은 없다 |

**MVP 범위를 명시적으로 좁히는 것을 권고한다** — 규격 검증만 하고 심사·A/B는 §7로 이관.

## ✅ Task Breakdown
- [ ] 소재 등록 — 위치 지정 + 이미지 URL + 랜딩 URL
- [ ] **위치별 규격 검증** (UX-004 산출물 기반)
- [ ] 파일 형식·용량 제한 **(미정)**
- [ ] 논리 삭제
- [ ] 캠페인당 다수 소재 관리
- [ ] 소재 심사 절차 범위 결정 **(미정)**

## 🧪 Acceptance Criteria

**Scenario 1: 소재 등록**
- **Given**: `MAIN_TOP` 규격에 맞는 이미지와 랜딩 URL
- **When**: 등록함
- **Then**: 저장되고 해당 위치의 광고 응답에 포함될 수 있다

**Scenario 2: 규격 불일치 거부**
- **Given**: `MAIN_TOP` 규격에 맞지 않는 크기의 이미지
- **When**: 등록함
- **Then**: **(미정 — UX-004 확정 후)** 거부되거나 경고가 표시된다

**Scenario 3: 캠페인당 다수 소재**
- **Given**: 한 캠페인에 위치별 소재 3개
- **When**: 각각 등록함
- **Then**: 모두 저장되고 위치별로 조회된다

**Scenario 4: 논리 삭제**
- **Given**: 노출 이력이 있는 소재
- **When**: 삭제함
- **Then**: 새 노출에서 제외되지만 **과거 성과 리포트에는 남는다**

**Scenario 5: 랜딩 URL 검증**
- **Given**: 형식이 잘못된 랜딩 URL
- **When**: 등록함
- **Then**: `400`이 반환된다

## ⚙️ Constraints
공통 제약 5개. 추가로 —
- 소재 용량이 광고 로딩 시간에 직결된다 — 노출 집계 정확도에 영향
- 논리 삭제 필수 (과거 성과 보존)

## 🏁 DoD
공통 DoD 14개. 추가로 —
- [ ] UX-004의 위치별 규격이 검증 규칙으로 반영되었는가?
- [ ] MVP 범위(심사·A/B 제외)가 명시적으로 기록되었는가?

## 🚧 Dependencies & Blockers
- **Depends on**: DB-003, FR-019a, **UX-004**
- **Blocks**: FR-037
- **SRS 미정의**: 위치별 규격 / 파일 형식·용량 / 심사 절차 / A/B 테스트 (전부 SRS 부재)

---

# [Feature/Command] C-14 (FR-026): 캠페인 생성 API 구현

**labels**: `feature, command, backend, campaign-service, priority:high`

## 🎯 Summary
- **Task ID**: FR-026 · **Epic**: Campaign Service · **Must / M**
- **기능명**: `POST /api/v1/campaigns` 구현
- **목적**: 계약(SPEC-004)을 실제 엔드포인트로 구현한다.

## 🔗 References
- 계약: **SPEC-004** · SRS: §6.1 · REQ-FUNC-003
- 선행: FR-019a · DB-003

## ✅ Task Breakdown
- [ ] 요청 DTO 및 검증 (SPEC-004)
- [ ] `FR-019a` 호출
- [ ] `201` + `campaignId` 응답
- [ ] 예산 구성 모순 검증 (`400`)
- [ ] 소유자 귀속 (D-01)
- [ ] 통합 테스트

## 🧪 Acceptance Criteria

**Scenario 1: 정상 생성**
- **Given**: 계약에 맞는 요청
- **When**: 호출함
- **Then**: `201`과 `campaignId`·`status: DRAFT`가 반환된다

**Scenario 2: 필수 필드 누락**
- **Given**: `biddingStrategy`가 없는 요청
- **When**: 호출함
- **Then**: `400`과 계약에 정의된 오류 본문이 반환된다

**Scenario 3: 예산 구성 모순**
- **Given**: 일일 상한 > 총예산
- **When**: 호출함
- **Then**: `400`이 반환된다

**Scenario 4: 미인증**
- **Given**: 인증 정보 없는 요청
- **When**: 호출함
- **Then**: `401`이 반환된다

## ⚙️ Constraints
공통 제약 5개.

## 🏁 DoD
공통 DoD 14개. 추가로 —
- [ ] 응답이 `docs/api_v1.yaml` 스키마 검증을 통과하는가?

## 🚧 Dependencies & Blockers
- **Depends on**: SPEC-004, FR-019a, DB-003
- **Blocks**: FR-050, QA-003
- **SRS 미정의**: 통화 단위 / `COMPLETED` 조건 / **D-01**

---

# [Feature/Command] C-15 (FR-027): 타게팅 갱신 API 구현

**labels**: `feature, command, backend, campaign-service, priority:high`

## 🎯 Summary
- **Task ID**: FR-027 · **Epic**: Campaign Service · **Must / M**
- **기능명**: `PUT /api/v1/campaigns/{campaignId}/targeting` 구현
- **목적**: 계약(SPEC-005)을 실제 엔드포인트로 구현한다.

## 🔗 References
- 계약: **SPEC-005** · SRS: §6.1 · REQ-FUNC-003
- 선행: FR-021 · DB-003

## ✅ Task Breakdown
- [ ] 요청 DTO 및 검증 (SPEC-005)
- [ ] `FR-021` 호출
- [ ] 전체 교체 의미 구현
- [ ] 소유자 검증 (D-01)
- [ ] 캠페인 미존재 `404`
- [ ] 통합 테스트

## 🧪 Acceptance Criteria

**Scenario 1: 정상 갱신**
- **Given**: 계약에 맞는 조건
- **When**: 호출함
- **Then**: `200`이 반환되고 후보 매칭에 즉시 반영된다

**Scenario 2: 전체 교체**
- **Given**: 기존 조건이 있는 캠페인
- **When**: 일부만 담아 `PUT`함
- **Then**: 담기지 않은 값은 **제거된다**

**Scenario 3: 타 광고주 캠페인**
- **Given**: 광고주 A 인증 + B 캠페인
- **When**: 호출함
- **Then**: `403`이 반환된다

**Scenario 4: 캠페인 미존재**
- **Given**: 없는 `campaignId`
- **When**: 호출함
- **Then**: `404`가 반환된다

## ⚙️ Constraints
공통 제약 5개. 추가로 —
- 갱신이 후보 매칭에 즉시 반영되어야 함 (캐시 무효화)

## 🏁 DoD
공통 DoD 14개. 추가로 —
- [ ] 갱신 후 후보 매칭 반영 지연이 측정되었는가?

## 🚧 Dependencies & Blockers
- **Depends on**: SPEC-005, FR-021, DB-003
- **Blocks**: FR-050, QA-003
- **SRS 미정의**: **E-02 조건 결합 규칙** / **D-01**

---

# [Feature/Command] C-16 (FR-035): 예산 검증 및 원자적 차감 ★

**labels**: `feature, command, backend, ad-serving, priority:high, critical-path, blocked-d02`

## 🎯 Summary
- **Task ID**: FR-035 · **Epic**: Ad Serving Engine · **Must / H**
- **기능명**: 예산 제약 검증 및 **원자적** 차감
- **목적**: **읽기 경로 안의 유일한 쓰기.** 이 태스크가 이 프로젝트에서 가장 위험한 지점이다.

## 🔗 References
- SRS: REQ-FUNC-005 · §6.3 규칙 4·7
- 확정 안건: **D-02 — 이 태스크의 존재 이유**
- 선행: FR-022 · FR-034 · DB-003 (`spent_today` 조건부 증가 구조)
- 원장 근거: **부록 A-4 주황 노드** · v1.1 M9
- 학습 해설: `SRS-READER.html` 17장 (예산 경쟁 조건)

## ⚠️ 왜 이 태스크가 가장 위험한가

원장 부록 A-4를 보면 광고 요청 흐름은 거의 전부 Query이고, **이 태스크만 Command**다.
초당 1,000건이 통과하는 읽기 경로에 쓰기가 하나 끼어 있고, SRS는 그 동시성을 규정하지 않았다.

```
잔액 1,000원 캠페인 + 동시 요청 50건
  → 50건 모두 "잔액 있음"을 읽는다
  → 50건 모두 통과한다
  → 예산을 수십 배 초과 집행한다
```

**이것은 예외 상황이 아니라 정상 동작의 결과다.** 초과분은 광고주에게 청구할 수 없으므로 그대로 손실이다.

## ✅ Task Breakdown
- [ ] **원자적 차감 구현** — 조건부 갱신(`WHERE spent_today + ? <= daily_budget_cap`) 방식
- [ ] 차감 실패 시 다음 후보로 넘기는 경로 (FR-034 결과 재사용)
- [ ] 총예산·일일 상한 이중 검증
- [ ] 일자 전환 감지 (`spent_date` 비교)
- [ ] 소진 감지 트리거 (FR-023 호출)
- [ ] **D-02 확정안 반영** — 허용 초과율
- [ ] **동시성 테스트 작성** — 이 태스크의 핵심 검증

### 구현 방식 비교 (D-02의 선택지)

| 안 | 방식 | 초과 | 성능 | 권고 |
| --- | --- | --- | --- | --- |
| A | 조회 후 차감 | **발생** | 최상 | ✗ |
| B | 비관적 잠금 | 0 | **인기 캠페인 행이 병목** | △ |
| **C** | **조건부 원자 갱신 + 실패 시 차순위** | 0 | 양호 | ◎ **권고** |
| D | C + 슬롯 예약 | 0 + 페이싱 | 복잡 | 향후 |

**C의 핵심은 "읽고 나서 쓰는" 것이 아니라 "조건과 함께 쓰는" 것이다.**
갱신문 자체에 상한 조건을 넣으면 DB가 원자적으로 판정하므로 경쟁 조건이 사라진다.
갱신된 행이 0건이면 상한 초과이므로 차순위 후보로 넘어간다.

## 🧪 Acceptance Criteria

**Scenario 1: 정상 차감**
- **Given**: 잔액이 충분한 캠페인
- **When**: 차감을 수행함
- **Then**: `spent_today`가 정확히 증가하고 광고가 반환된다

**Scenario 2: 동시 요청 초과 집행 방지 — 이 태스크의 핵심 시나리오**
- **Given**: 일일 상한에 1건 분량만 남은 캠페인
- **When**: **동시에 100건**의 차감을 시도함
- **Then**: **정확히 1건만 성공**하고 99건은 실패해 차순위로 넘어간다. `spent_today`가 상한을 넘지 않는다

**Scenario 3: 차감 실패 시 차순위**
- **Given**: 최고 비교값 캠페인의 예산이 방금 소진됨
- **When**: 차감이 실패함
- **Then**: 차순위 후보로 차감을 재시도하고, 광고가 정상 반환된다

**Scenario 4: 총예산 상한**
- **Given**: 일일 상한은 남았으나 총예산이 소진된 캠페인
- **When**: 차감을 시도함
- **Then**: 실패한다 (이중 검증)

**Scenario 5: 일자 전환**
- **Given**: `spent_date`가 어제인 캠페인
- **When**: 차감을 시도함
- **Then**: `spent_today`가 초기화되고 오늘 기준으로 차감된다

**Scenario 6: 성능**
- **Given**: 1,000 RPS 지속 부하
- **When**: 차감이 계속 수행됨
- **Then**: 배분된 예산 이내이며 **잠금 대기로 인한 지연 급증이 없다**

**Scenario 7: 모든 후보 차감 실패**
- **Given**: 후보 전부의 예산이 소진됨
- **When**: 차감을 시도함
- **Then**: 다음 폴백 단계로 넘어가거나, SPEC-007의 후보 없음 응답으로 이어진다

## ⚙️ Constraints
공통 제약 5개. 추가로 —
- **원자성이 이 태스크의 존재 이유다.** 조회 후 차감 방식은 어떤 경우에도 채택 불가
- **성능과 정확성의 균형**: 비관적 잠금은 정확하지만 초당 1,000건에서 병목이 된다
- 잔액 캐시 금지
- **읽기 경로 안의 쓰기**이므로 실패가 전체 요청을 실패시키지 않아야 한다 — 차순위 경로 필수

## 🏁 DoD
공통 DoD 14개. 추가로 —
- [ ] **동시 100건 테스트에서 초과 집행이 0건인가?** (QA-005의 핵심 케이스)
- [ ] 차감 방식이 D-02 확정안과 일치하는가?
- [ ] 부하 하에서 잠금 대기 지연이 측정되었는가?
- [ ] 차순위 재시도 경로가 검증되었는가?
- [ ] 초과 집행이 발생했을 때의 탐지·보정 절차가 있는가?

## 🚧 Dependencies & Blockers
- **Depends on**: FR-022, FR-034, DB-003
- **Blocks**: FR-037, FR-023, QA-005
- **SRS 미정의**: **D-02 — 착수 차단** / 허용 초과율 / 페이싱 부재 / 초과 발생 시 비용 부담 주체

---

# [Feature/Command] C-17 (FR-033): 폴백 단계 기록

**labels**: `feature, command, backend, ad-serving, priority:medium`

## 🎯 Summary
- **Task ID**: FR-033 · **Epic**: Ad Serving Engine · **Must / L**
- **기능명**: `FallbackStage`를 응답·로그에 부착
- **목적**: **작지만 사업적으로 가장 중요한 태스크 중 하나.** 이 기록이 없으면 타게팅 실패를 아무도 눈치채지 못한다.

## 🔗 References
- SRS: **§6.2 `FallbackStage`** — enum 주석에 **"성과 분석용 폴백 단계"** 로 명시 · REQ-FUNC-004
- 선행: DB-001 · FR-032 · SPEC-007 (응답 필드)
- 학습 해설: `SRS-READER.html` 16장

## ⚠️ 이 태스크를 생략하면 벌어지는 일

SRS가 `FallbackStage` enum을 **"성과 분석용"** 이라고 명시한 이유가 있다.

기능은 정상 동작한다. 광고는 나간다. 채움율도 높다. **그런데 1단계 비율이 5%라면 타게팅이 사실상 작동하지 않는 것이고,
그것은 기능 실패가 아니라 사업 실패다.** 이 기록이 없으면 아무도 그 사실을 모른다.

## ✅ Task Breakdown
- [ ] 단계 번호를 응답에 부착 (`fallbackStage`)
- [ ] 이벤트에 단계 저장 (DB-004 `fallback_stage` 컬럼)
- [ ] 로그에 단계 기록
- [ ] **단계별 분포 집계 경로 확보** — FR-041·FR-042에서 볼 수 있게
- [ ] 단계별 목표 비율 설정 **(미정)**

## 🧪 Acceptance Criteria

**Scenario 1: 응답 부착**
- **Given**: 1단계에서 채워진 요청
- **When**: 응답을 확인함
- **Then**: `fallbackStage: 1`이 포함된다

**Scenario 2: 이벤트 저장**
- **Given**: 2단계에서 채워진 노출
- **When**: 이벤트가 기록됨
- **Then**: `ad_events.fallback_stage`가 `2`로 저장된다

**Scenario 3: 단계별 분포 조회**
- **Given**: 1단계 400건 · 2단계 500건 · 3단계 100건
- **When**: 단계별 분포를 조회함
- **Then**: 40% / 50% / 10%가 확인된다

**Scenario 4: 목표 비율 대비 경보**
- **Given**: 1단계 목표 비율이 설정됨
- **When**: 실제 비율이 목표를 크게 밑돎
- **Then**: **(미정)** — 경보가 발생하는가. 목표 비율 자체가 SRS에 없다

## ⚙️ Constraints
공통 제약 5개. 추가로 —
- 복잡도 `L`이지만 **생략하면 관측 불가 상태가 된다.** 축소 대상이 아니다
- 성능: 단순 필드 부착이므로 예산 영향 미미

## 🏁 DoD
공통 DoD 14개. 추가로 —
- [ ] 단계별 분포를 실제로 조회할 수 있는가?
- [ ] 단계별 목표 비율이 설정되었는가? (없으면 잘 되는지 판정 불가)

## 🚧 Dependencies & Blockers
- **Depends on**: DB-001, DB-004, FR-032, SPEC-007
- **Blocks**: QA-004, FR-041 (Fill Rate 산출)
- **SRS 미정의**: 단계별 목표 비율 (부록 D)

---

# [Feature/Command] C-18 (FR-038): 클릭 이벤트 추적 API 구현

**labels**: `feature, command, backend, ad-serving, priority:high`

## 🎯 Summary
- **Task ID**: FR-038 · **Epic**: Ad Serving Engine · **Must / M**
- **기능명**: `POST /api/v1/ads/events/click` 구현
- **목적**: 클릭을 기록한다. **CPC 캠페인에서 이 기록이 곧 청구 근거다.**

## 🔗 References
- 계약: **SPEC-008 (멱등키 규약)** · SRS: §6.1 · REQ-FUNC-008
- 선행: DB-001 · DB-004 · FR-037 (`requestId`)

## ✅ Task Breakdown
- [ ] 요청 DTO 및 검증
- [ ] **멱등 처리** — `event_id` 기반 중복 차단 (DB-004 기본키 활용)
- [ ] `requestId` 유효성 확인
- [ ] 비동기 저장 — 사용자 이동을 지연시키지 않음
- [ ] Tracking 장애 시 버퍼 적재
- [ ] `202` + `duplicate` 응답

## 🧪 Acceptance Criteria

**Scenario 1: 정상 기록**
- **Given**: 유효한 `requestId`
- **When**: 클릭을 전송함
- **Then**: `202`가 반환되고 클릭 수가 1 증가한다

**Scenario 2: 멱등 재전송**
- **Given**: 동일 `eventId`가 이미 기록됨
- **When**: 재전송함
- **Then**: `202` + `duplicate: true`, **클릭 수 불변**

**Scenario 3: 잘못된 `requestId`**
- **Given**: 발급되지 않은 `requestId`
- **When**: 전송함
- **Then**: **(제안)** `400`. 광고 요청 없는 클릭은 부정 트래픽 의심

**Scenario 4: Tracking 장애**
- **Given**: Tracking이 응답하지 않음
- **When**: 전송함
- **Then**: `202`가 반환되고 버퍼에 적재된다 (클릭 유실 = 청구 손실)

**Scenario 5: 응답 지연**
- **Given**: 정상 상태
- **When**: 전송함
- **Then**: 응답이 즉시 반환되어 사용자 이동을 막지 않는다

## ⚙️ Constraints
공통 제약 5개. 추가로 —
- **중복과 유실 양방향이 모두 정산에 직결된다**
- 사용자 이동 경로에 있음 — 응답 즉시, 저장 비동기

## 🏁 DoD
공통 DoD 14개. 추가로 —
- [ ] 멱등성이 테스트로 증명되었는가?
- [ ] 멱등 구현이 FR-040과 **동일 규칙**인가?
- [ ] 허용 유실률이 합의되고 측정되는가?

## 🚧 Dependencies & Blockers
- **Depends on**: SPEC-008, DB-001, DB-004, FR-037
- **Blocks**: FR-041, FR-044, FR-048, QA-008
- **SRS 미정의**: 멱등성 규칙 / 허용 유실률 / 부정 클릭 필터 부재

---

# [Feature/Command] C-19 (FR-039): 이벤트 수집·저장

**labels**: `feature, command, backend, tracking-service, priority:high`

## 🎯 Summary
- **Task ID**: FR-039 · **Epic**: Tracking Service · **Must / H**
- **기능명**: IMPRESSION / CLICK / CONVERSION 수집·저장
- **목적**: **기록되지 않은 노출은 존재하지 않은 노출**이다. 청구의 원장을 만든다.

## 🔗 References
- SRS: REQ-FUNC-008 · §6.2 `EventType` · §6.4 `ad_events` (파티셔닝)
- 선행: DB-004 · SPEC-008·009 (멱등키)
- 학습 해설: `SRS-READER.html` 21장

## ✅ Task Breakdown
- [ ] 3종 이벤트 저장
- [ ] 멱등 처리 (기본키 위반 흡수)
- [ ] **세그먼트·태그 스냅샷 저장** — DB-004 설계 근거 (과거 리포트 불변)
- [ ] `charged_amount` 기록 — 과금액
- [ ] 파티션 라우팅
- [ ] 비동기 처리 및 버퍼

## 🧪 Acceptance Criteria

**Scenario 1: 3종 저장**
- **Given**: 노출·클릭·전환 각 1건
- **When**: 저장함
- **Then**: 3건이 각각 올바른 `event_type`으로 저장된다

**Scenario 2: 멱등**
- **Given**: 동일 `event_id`
- **When**: 재저장함
- **Then**: 1건만 유지되고 오류가 사용자에게 전파되지 않는다

**Scenario 3: 스냅샷 저장**
- **Given**: 세그먼트가 `AGE_25_34_MID_URBAN`인 사용자의 노출
- **When**: 저장함
- **Then**: `demographic_segment`에 그 값이 **복사되어** 저장된다

**Scenario 4: 스냅샷 불변성**
- **Given**: 저장 후 사용자의 세그먼트가 변경됨
- **When**: 과거 이벤트를 조회함
- **Then**: 저장 당시의 세그먼트가 유지된다

**Scenario 5: 파티션 배치**
- **Given**: 서로 다른 날짜의 이벤트
- **When**: 저장함
- **Then**: 각 날짜 파티션에 저장된다

**Scenario 6: 부하**
- **Given**: 1,000 RPS
- **When**: 저장이 계속됨
- **Then**: **(미정)** 확정된 응답 시간 목표를 유지한다

## ⚙️ Constraints
공통 제약 5개. 추가로 —
- 하루 8,640만 건 · 월 500GB 규모
- **광고 응답 경로를 막지 않아야 한다** — 비동기 필수
- 정확성: 정산 원장

## 🏁 DoD
공통 DoD 14개. 추가로 —
- [ ] 스냅샷 불변성이 테스트로 증명되었는가?
- [ ] 1,000 RPS에서 삽입 성능이 측정되었는가?
- [ ] 버퍼 유실률이 측정되었는가?

## 🚧 Dependencies & Blockers
- **Depends on**: DB-004, SPEC-008, SPEC-009
- **Blocks**: FR-040, FR-041, FR-044
- **SRS 미정의**: 멱등성 규칙 / 허용 유실률 / REQ-NF-002 응답 시간 조건

---

# [Feature/Command] C-20 (FR-040): 이벤트 일괄 수집 API 구현

**labels**: `feature, command, backend, tracking-service, priority:high`

## 🎯 Summary
- **Task ID**: FR-040 · **Epic**: Tracking Service · **Must / H**
- **기능명**: `POST /api/v1/tracking/events` 구현
- **목적**: 대량 이벤트를 모아 받는다. 하루 8,640만 건을 감당하는 입구.

## 🔗 References
- 계약: **SPEC-009** · SRS: §6.1 · REQ-FUNC-008 · **REQ-NF-002**
- 선행: FR-039 · DB-004

## ✅ Task Breakdown
- [ ] 배치 요청 처리 — 상한·부분 실패 (SPEC-009 확정안)
- [ ] 멱등 처리 — FR-038과 동일 규칙
- [ ] `202` + `accepted`·`duplicates`·`rejected` 응답
- [ ] 배치 상한 초과 `413`
- [ ] 속도 제한 및 과부하 거절
- [ ] 부하 테스트 시나리오 (NF-003·QA-010 연계)

## 🧪 Acceptance Criteria

**Scenario 1: 정상 일괄 수집**
- **Given**: 유효한 100건 배치
- **When**: 호출함
- **Then**: `202` + `accepted: 100`, 5분 이내 지표 반영

**Scenario 2: 중복 포함**
- **Given**: 기존 30건이 섞인 100건
- **When**: 호출함
- **Then**: `accepted: 70` · `duplicates: 30`, **지표는 70건만 증가**

**Scenario 3: 부분 실패**
- **Given**: 무효 2건이 섞인 100건
- **When**: 호출함
- **Then**: `accepted: 98` · `rejected` 2건

**Scenario 4: 상한 초과**
- **Given**: 상한 초과 배치
- **When**: 호출함
- **Then**: `413`, **아무것도 저장되지 않음**

**Scenario 5: 1,000 RPS 부하**
- **Given**: 지속 부하
- **When**: 호출이 계속됨
- **Then**: **(미정)** 확정된 목표 유지, 유실이 허용 범위 내

## ⚙️ Constraints
공통 제약 5개. 추가로 —
- REQ-NF-002의 주요 검증 대상 엔드포인트
- 이 서비스가 죽어도 FR-037은 계속 동작해야 함

## 🏁 DoD
공통 DoD 14개. 추가로 —
- [ ] 멱등 규칙이 FR-038과 동일한가?
- [ ] 배치 상한·부분 실패가 계약대로 동작하는가?
- [ ] 1,000 RPS 유실률이 측정되었는가?

## 🚧 Dependencies & Blockers
- **Depends on**: SPEC-009, FR-039, DB-004
- **Blocks**: FR-048, QA-008, QA-010
- **SRS 미정의**: 배치 상한 / 허용 유실률 / REQ-NF-002 응답 시간 조건

---

# [Feature/Command] C-21 (FR-043): 5분 주기 실시간 집계 배치

**labels**: `feature, command, backend, tracking-service, priority:high`

## 🎯 Summary
- **Task ID**: FR-043 · **Epic**: Tracking Service · **Must / M**
- **기능명**: 구체화 뷰 5분 주기 갱신
- **목적**: §6.3 규칙 8을 구현한다. **"실시간"이라 불리는 것의 실제 정체.**

## 🔗 References
- SRS: **§6.3 규칙 8** ("5분 단위 갱신 주기로 실시간 지표를 집계") · §6.4 `campaign_performance_realtime`
- 선행: DB-004 · FR-041
- 부록 D: **REQ-FUNC-008 "실시간"과의 정의 충돌**

## ⚠️ 문서 내부 모순이 이 태스크에 걸려 있다

| 위치 | 문장 |
| --- | --- |
| REQ-FUNC-008 인수 기준 | "CTR, CPC, eCPM을 **실시간** 기록해야 한다" |
| §6.3 규칙 8 | "**5분 단위** 갱신 주기로 실시간 지표를 집계" |

엄밀히 보면 둘은 다른 일이다 — **이벤트 기록**은 발생 즉시(FR-039), **지표 집계**는 5분 주기(이 태스크).
문서가 그 구분을 하지 않아 광고주가 대시보드에서 방금 클릭을 못 찾을 때 설명할 근거가 없다.
**해법은 `asOf` 필드**이며 SPEC-006·010에서 계약화했다.

## ✅ Task Breakdown
- [ ] 갱신 방식 선택 — 전체 재계산 vs 증분
- [ ] 5분 주기 스케줄링
- [ ] `as_of` 갱신
- [ ] **갱신 중 조회 가능성 보장** — 갱신 동안 대시보드가 멈추지 않게
- [ ] 갱신 실패 시 재시도 및 알림
- [ ] 갱신 소요 시간 계측

## 🧪 Acceptance Criteria

**Scenario 1: 주기 갱신**
- **Given**: 새 이벤트가 유입됨
- **When**: 5분이 경과함
- **Then**: 뷰에 반영되고 `as_of`가 갱신된다

**Scenario 2: 갱신 중 조회**
- **Given**: 갱신이 진행 중
- **When**: 대시보드가 조회함
- **Then**: 이전 값이라도 정상 응답한다 (조회 차단 없음)

**Scenario 3: 갱신 실패**
- **Given**: 갱신 중 오류 발생
- **When**: 다음 주기가 도래함
- **Then**: 재시도되고, 연속 실패 시 알림이 발생한다

**Scenario 4: 갱신 소요 시간**
- **Given**: 이벤트 1억 건 적재
- **When**: 갱신을 수행함
- **Then**: **5분 이내에 완료된다** (초과하면 주기가 겹쳐 누적 지연이 발생)

**Scenario 5: 삽입 경로 영향**
- **Given**: 1,000 RPS 삽입 중
- **When**: 갱신이 실행됨
- **Then**: 삽입 성능 저하가 허용 범위 내다

## ⚙️ Constraints
공통 제약 5개. 추가로 —
- **갱신이 5분을 넘으면 구조가 무너진다.** 주기가 겹치고 지연이 누적된다 — 증분 갱신 검토 필요
- 갱신이 이벤트 삽입(FR-040)을 방해하지 않아야 함 — OLTP·OLAP 분리 검토

## 🏁 DoD
공통 DoD 14개. 추가로 —
- [ ] 갱신 소요 시간이 5분 대비 충분한 여유가 있는가?
- [ ] 대시보드에 `asOf` 표기가 실제로 노출되는가? (UX-006)
- [ ] "실시간" 용어 충돌이 문서에서 정정 요청되었는가?

## 🚧 Dependencies & Blockers
- **Depends on**: DB-004, FR-041
- **Blocks**: FR-028, FR-045, QA-008
- **SRS 미정의**: **"실시간" vs "5분" 정의 충돌 (부록 D)** / 정산 확정 시점

---

# [Feature/Command] C-22 (FR-044): Last-click 어트리뷰션 처리

**labels**: `feature, command, backend, tracking-service, priority:high`

## 🎯 Summary
- **Task ID**: FR-044 · **Epic**: Tracking Service · **Must / H**
- **기능명**: 전환을 마지막 클릭에 귀속
- **목적**: **전환의 공을 누구에게 돌릴지 정한다. 이 규칙이 광고주 정산액을 직접 바꾼다.**

## 🔗 References
- SRS: **§6.3 규칙 6** ("MVP에서는 Last-click Attribution을 적용하며, 향후 Multi-touch 모델로 확장 가능") · REQ-FUNC-008
- 선행: DB-004 (`request_id` 색인) · FR-039 · FR-038
- 학습 해설: `SRS-READER.html` 21장 (어트리뷰션)

## ⚠️ 어트리뷰션 윈도우가 정의되지 않았다

Last-click은 "마지막 클릭이 전환의 공을 전부 가져간다"는 규칙이다. 그런데 **"마지막"의 범위가 없다.**

> 사용자가 3일 전 클릭했고 오늘 구매했다면, 그 클릭에 귀속되는가?
> 30일 전이라면? 90일 전이라면?

업계 관행은 **7일 또는 30일**이며, **이 숫자가 광고주 정산액을 직접 바꾼다.**
SRS에 없으므로 계약 전에 확정해야 한다(부록 D · W0 연계).

## ✅ Task Breakdown
- [ ] 전환 이벤트 수신 시 직전 클릭 탐색
- [ ] **어트리뷰션 윈도우 적용 (미정)**
- [ ] 클릭이 없는 전환 처리 (노출만 있는 경우)
- [ ] 귀속 결과 저장 — 어느 클릭에 귀속됐는지 추적 가능하게
- [ ] 재계산 경로 — 윈도우 변경 시 과거 데이터 재귀속
- [ ] Multi-touch 확장 여지 확보 (§6.3 규칙 6)

## 🧪 Acceptance Criteria

**Scenario 1: 단일 클릭 귀속**
- **Given**: 클릭 1건 후 전환 1건
- **When**: 어트리뷰션을 수행함
- **Then**: 그 클릭에 전환이 귀속된다

**Scenario 2: 복수 클릭 — Last-click**
- **Given**: 캠페인 A 클릭 → 캠페인 B 클릭 → 전환
- **When**: 어트리뷰션을 수행함
- **Then**: **캠페인 B가 전환을 전부 가져가고 A는 0이다**

**Scenario 3: 윈도우 경계**
- **Given**: 확정된 윈도우보다 오래된 클릭만 존재함
- **When**: 전환이 발생함
- **Then**: **(미정)** — 귀속되지 않는다. 윈도우 값이 확정되어야 판정 가능

**Scenario 4: 클릭 없는 전환**
- **Given**: 노출만 있고 클릭 없이 전환이 발생함
- **When**: 어트리뷰션을 수행함
- **Then**: **(미정)** — 노출에 귀속하는가(view-through), 귀속 없이 기록만 하는가
  <!-- SRS는 Last-click만 규정한다. 클릭 없는 전환의 처리는 정의되지 않았다. -->

**Scenario 5: 귀속 추적**
- **Given**: 전환이 귀속됨
- **When**: 근거를 조회함
- **Then**: 어느 클릭 이벤트에 귀속됐는지 확인 가능하다 (정산 분쟁 대응)

**Scenario 6: 중복 전환**
- **Given**: 동일 `event_id`의 전환이 재전송됨
- **When**: 어트리뷰션을 수행함
- **Then**: 한 번만 귀속된다

## ⚙️ Constraints
공통 제약 5개. 추가로 —
- **정산에 직결된다.** 귀속 규칙 변경은 과거 숫자를 바꾸므로 변경 이력이 필요
- 성능: 전환 발생 시 과거 클릭을 탐색하므로 `ix_events_request` 색인 활용 필수
- §6.3 규칙 6이 Multi-touch 확장을 예고하므로 구조를 열어둘 것

## 🏁 DoD
공통 DoD 14개. 추가로 —
- [ ] **어트리뷰션 윈도우가 확정되고 계약서에 반영되었는가?**
- [ ] 클릭 없는 전환의 처리가 확정되었는가?
- [ ] 귀속 근거가 추적 가능한가?
- [ ] 윈도우 변경 시 재계산 경로가 있는가?

## 🚧 Dependencies & Blockers
- **Depends on**: DB-004, FR-039, FR-038
- **Blocks**: QA-008
- **SRS 미정의**: **어트리뷰션 윈도우 (부록 D — 정산 기준 미확정)** / 클릭 없는 전환 처리 / Multi-touch 확장 시점

---

# [Feature/Q+C] C-23 (FR-037): 광고 요청 API 구현 ★

**labels**: `feature, query, command, backend, ad-serving, priority:high, critical-path`

## 🎯 Summary
- **Task ID**: FR-037 · **Epic**: Ad Serving Engine · **Must / H**
- **기능명**: `POST /api/v1/ads/request` — 3단계 폴백 포함 광고 요청
- **목적**: **시스템 전체가 이 한 호출을 위해 존재한다.** 앞의 모든 태스크가 이것의 부품이다.
- **Type**: `[Feature/Q+C]` — **읽기 경로 안에 쓰기(FR-035)를 포함한 유일한 복합 태스크**

## 🔗 References
- 계약: **SPEC-007** (성능 예산 배분표 포함)
- SRS: §6.1 · REQ-FUNC-004·005·006 · **REQ-NF-001**(100ms) · REQ-NF-002(1,000 RPS)
- 선행: FR-032 · FR-034 · **FR-035** · FR-036 · FR-025
- 확정 안건: **D-05** (성능 목표·측정 조건)
- 원장 근거: 부록 A-2 크리티컬 패스 종점 · 부록 A-4 흐름도

## ⚠️ CQRS 경계 위반이 여기서 발생한다

원장 부록 A-4의 흐름을 보면 이 엔드포인트는 거의 전부 Query인데 **FR-035만 Command**다.

```
프로파일 조회(Q) → 1·2·3단계 후보 조회(Q) → 선택(Q) → 예산 차감(C) → 슬롯 제어(Q) → 단계 기록(C) → 응답
```

이 구조가 D-02(예산 초과 집행)의 원인이다. **읽기 요청이 초당 1,000건 통과하는 경로에 쓰기가 있고,
그 쓰기의 실패가 전체 요청을 실패시키면 안 된다** — 차순위 재시도 경로가 필수인 이유다.

## ✅ Task Breakdown
- [ ] 요청 DTO 및 검증 (SPEC-007)
- [ ] FR-032 → FR-034 → FR-035 → FR-036 오케스트레이션
- [ ] **`requestId` 발급** — 이후 모든 이벤트가 이 ID로 연결
- [ ] `fallbackStage` 부착 (FR-033)
- [ ] 크리에이티브 정보 결합 (FR-025)
- [ ] **예산 차감 실패 시 차순위 재시도 경로**
- [ ] 후보 없음 응답 (SPEC-007 확정안)
- [ ] **성능 예산 준수 검증** — 구간별 계측
- [ ] Tracking 장애 시에도 응답 계속 (이벤트 비동기)

## 🧪 Acceptance Criteria

**Scenario 1: 1단계 정상 응답**
- **Given**: 완전 프로파일 사용자 + 부합 캠페인
- **When**: 광고를 요청함
- **Then**: `200` + 광고 + `fallbackStage: 1` + `requestId`가 반환된다

**Scenario 2: 2단계 응답**
- **Given**: 인구통계만 있는 사용자
- **When**: 요청함
- **Then**: `fallbackStage: 2`

**Scenario 3: 3단계 응답**
- **Given**: 프로파일 없는 신규 사용자
- **When**: 요청함
- **Then**: `fallbackStage: 3`

**Scenario 4: 후보 없음**
- **Given**: 어떤 단계에서도 후보 없음
- **When**: 요청함
- **Then**: SPEC-007 확정안대로 응답한다 (빈 배열 `200` 권고)

**Scenario 5: 슬롯 수만큼 서로 다른 광고**
- **Given**: 슬롯 2, 후보 3건 이상
- **When**: 요청함
- **Then**: 서로 다른 캠페인 2건이 `slotIndex` 0·1로 반환된다

**Scenario 6: 예산 차감 실패 → 차순위**
- **Given**: 최고 후보의 예산이 방금 소진됨
- **When**: 요청함
- **Then**: **요청이 실패하지 않고** 차순위 광고가 반환된다

**Scenario 7: `requestId` 연결**
- **Given**: 광고 응답을 받음
- **When**: 그 `requestId`로 클릭을 전송함
- **Then**: 원 요청과 연결되어 기록된다

**Scenario 8: Tracking 장애 중 응답**
- **Given**: Tracking 서비스가 응답하지 않음
- **When**: 광고를 요청함
- **Then**: **광고는 정상 반환된다** (이벤트 기록만 지연)

**Scenario 9: 성능 — p95**
- **Given**: D-05에서 확정된 부하·데이터·캐시 조건
- **When**: 부하 테스트를 수행함
- **Then**: **(미정)** p95가 확정 목표 이내다

**Scenario 10: 3단계 요청의 성능**
- **Given**: 3단계까지 내려가는 요청
- **When**: 응답 시간을 측정함
- **Then**: **(미정)** 예산 이내다. **3단계 요청 비율이 5%를 넘으면 p95가 위태로워진다**

## ⚙️ Constraints
공통 제약 5개. 추가로 —
- **성능이 최우선 제약이다.** REQ-NF-001 · REQ-NF-002가 모두 이 엔드포인트를 가리킨다
- 단계별 타임아웃 필수 (FR-032)
- 쓰기 실패가 읽기 요청 전체를 실패시키지 않아야 함
- 응답에 타 광고주 정보가 섞이지 않아야 함
- 가용성: Tracking 장애가 광고 응답을 막지 않아야 함

## 🏁 DoD
공통 DoD 14개. 추가로 —
- [ ] **세 단계가 각각 발생하는 것을 `fallbackStage`로 증명했는가?**
- [ ] 구간별 소요 시간이 계측되고 SPEC-007 배분표와 대조되었는가?
- [ ] 예산 차감 실패 시 차순위 경로가 검증되었는가?
- [ ] `requestId`가 클릭·노출 이벤트에서 실제로 연결되는가?
- [ ] Tracking 장애 시 광고 응답이 계속됨을 확인했는가?
- [ ] 3단계 요청의 비율과 p95가 측정되었는가?

## 🚧 Dependencies & Blockers
- **Depends on**: SPEC-007, FR-032, FR-034, FR-035, FR-036, FR-025
- **Blocks**: FR-046, FR-047, FR-048, NF-001, NF-002, QA-004, QA-009
- **SRS 미정의**: **D-05 성능 목표·측정 조건** / 3단계 실패 시 동작 / 슬롯 수 / 중복 배제 규칙 / **D-02·D-03**(FR-035·FR-034 경유)

---

## P2b에서 새로 발견된 미정의 항목

| # | 항목 | 제기 이슈 | 성격 |
| --- | --- | --- | --- |
| E-15 | **일일 예산의 "하루" 기준 시간대** — UTC 자정 vs 서비스 시간대 vs 광고주별 | C-10 (FR-022) | 사업 판단 · 광고주 커뮤니케이션 |
| E-16 | 상태별 수정 가능 필드 — 특히 `ACTIVE` 상태의 입찰가·과금 방식 변경 허용 여부 | C-07 (FR-019a) | 사업 판단 |
| E-17 | 예산 소진 감지 시점 — 차감 직후 동기 vs 주기 배치. **감지 지연 × RPS = 초과 집행량** | C-11 (FR-023) | 설계 판단 |
| E-18 | 클릭 없는 전환의 처리 (view-through 귀속 여부) | C-22 (FR-044) | 정산 규칙 |
| E-19 | 프로파일 없는 사용자의 태그 저장 — DB-002 외래키와 `UNKNOWN` 부재의 충돌 | C-06 (FR-018) | 설계 판단 |
| E-20 | 인구통계 조건 없이 행동 조건만 지정한 캠페인의 허용 여부 | C-09 (FR-021) | E-10과 동일 뿌리 |
| E-21 | 단계별 목표 비율 — 없으면 타게팅이 잘 되는지 판정 불가 | C-17 (FR-033) | KPI 설정 |
| E-22 | 소재 규격·형식·용량·심사 절차 (SRS 전무) | C-13 (FR-025) | 범위 판정 |

> **E-15와 E-17이 즉시 처리 대상이다.** 둘 다 **금액에 직접 영향**을 주는데 확정 난도가 낮다.
> E-15는 사업 측 한 문장으로 정해지고, E-17은 설계 리뷰 한 번으로 결정된다.
