# MOCK-008 · 매장 콘솔 Mock

> **웨이브** `P1c-mock` · **라벨** `mock, backend, merchant-console, priority:medium, phase-2`
> **원본** [`docs/issues-aiplace/P1c-mock.md`](../P1c-mock.md#mock-008)
> **원장** `TASKS-ai-place-v1.0.md` (TASKS-AIPLACE-MVP-001 v1.1 · 50건) · **SRS** `SRS-ai-place-v1.0.md` (SRS-AIPLACE-MVP-001 v1.9)

### 🎯 Summary
- **Task ID** `MOCK-008` · **Should / M**
- **목적** 매장 콘솔 화면(`CLI-G`·`UX-H`)이 `MCH-A` 구현을 기다리지 않게 한다.
- **⚠️ Phase 2 조건부**

### 🔗 References
- 소비 `CLI-G`(FR-076) · `UX-H` · 대상 `MCH-A`(FR-037~040)
- **⚠️ 콘솔 API 계약이 `SPEC-`에 없다** — 아래 참조

### ⚠️ 콘솔 API 계약이 누락돼 있다

`SPEC-001`~`009` 어디에도 **매장 콘솔 CRUD 계약이 없다.**
평가서 §1의 신규 9건은 §8.1의 5개 엔드포인트 + PG + 근거 + 이벤트를 덮었는데,
**콘솔은 §8.1의 엔드포인트 목록 자체에 없다.**

**이 Mock을 만들려면 콘솔 계약을 먼저 정해야 한다.** `SPEC-010`(가칭) 신설이 필요할 수 있다 —
**확정 필요.** 그 전까지 이 Mock은 `MCH-A`의 Task Breakdown을 근거로 잠정 구성한다.

### ✅ Task Breakdown
- [ ] **콘솔 API 계약 확정 또는 `SPEC-010` 신설 판단**
- [ ] 프로필 조회 응답 — 기존 항목 1회 클릭 로드 (`REQ-FUNC-027`)
- [ ] 프로필 등록·갱신 응답
- [ ] **근거 없는 문구 저장 차단** `400` 응답 (`REQ-FUNC-021`)
- [ ] 수용 조건 설정 응답
- [ ] 설정 3화면 · 필수 5항목 구조 재현 (`REQ-FUNC-019`)

### 🧪 Acceptance Criteria

**Scenario 1 · 정상** — 프로필 조회 시 기존 항목이 1회 클릭으로 로드된다 (`REQ-FUNC-027`)
**Scenario 2 · 예외** — `Attribute` 미참조 문구 저장 시 `400`이 반환된다 (`REQ-FUNC-021`)
**Scenario 3 · 경계** — 필수 항목 5개 미만 입력 시 저장이 거부된다 (`REQ-FUNC-019`)
**Scenario 4 · 근거 무결성** — **근거 없는 문구가 저장되는 응답을 만들 수 없다**

### ⚙️ Technical & Non-Functional Constraints
- **`REQ-FUNC-019`** 설정 화면 **3개 이하** · 필수 항목 **5개 이하**
- **`REQ-FUNC-027`** 기존 항목 **1회 클릭** 로드
- **§8.3 규칙 7** 근거 없는 문구 저장 차단

### 🏁 DoD
공통 DoD 6개. 추가로 —
- [ ] **콘솔 API 계약이 확정되었는가?** (`SPEC-010` 신설 여부 포함)
- [ ] `UX-H`가 설정 3화면·필수 5항목 제약을 이 Mock으로 검증했는가?

### 🚧 Dependencies & Blockers
- **Depends on** `MOCK-001` (#108) · **콘솔 API 계약 (미정)**
- **Blocks** `CLI-G` (#153) `UX-H` (#147)
- **⚠️ Phase 게이트** Phase 2 조건부
- **미정 — 확정 필요** **콘솔 API 계약 부재** — `SPEC-010` 신설 판단 (담당: 개발팀 리드)

### 공통 DoD — 웨이브 `P1c-mock` 전체

- [ ] 응답이 `docs/api-aiplace.yaml` 스키마 검증을 **자동으로** 통과하는가? (수동 대조는 반드시 어긋난다)
- [ ] 정상·예외·경계 시나리오를 **스위치로 전환**할 수 있는가?
- [ ] **지연 주입**이 가능한가? (p95 초과·타임아웃 경로 검증용)
- [ ] 계약 변경 시 Mock 갱신을 강제하는 절차가 있는가?
- [ ] 소비 측 팀이 실제로 이 Mock으로 착수했음을 확인했는가?
- [ ] 실구현 완료 후 **폐기 시점**이 정해져 있는가?

