# TRK-C · KPI 배치 집계 및 파생 지표

> **웨이브** `P2c-tracking` · **라벨** `feature, backend, tracking-service, priority:high, phase-1`
> **원본** [`docs/issues-aiplace/P2c-tracking.md`](../P2c-tracking.md#trk-c)
> **원장** `TASKS-ai-place-v1.0.md` (TASKS-AIPLACE-MVP-001 v1.1 · 50건) · **SRS** `SRS-ai-place-v1.0.md` (SRS-AIPLACE-MVP-001 v1.9)

**원문** `FR-054` `FR-080`

### 🎯 Summary
- **Task ID** `TRK-C` · **Must / H (H×1+M×1)**
- **목적** **북극성 KPI WEBD를 산출한다.** Phase 1·2 게이트 판정이 전부 이 수치에 걸려 있다.

### 🔗 References
- **§6.1.2** KPI 산출식 12건 (북극성 WEBD + 보조 1~11) · 파생 지표 · §5.2
- `REQ-NF-028` · `REQ-NF-029`(탐색 노동·결정 시간) · `REQ-NF-030`
- 선행 `TRK-B` · `EVD-D`(불일치 신고율 원천)
- **Phase 1 게이트** WEBD ≥ 목표 60% · 불일치 신고 ≤ 15%

### ✅ Task Breakdown
- [ ] **`FR-054`** KPI 12건 배치 집계 — §6.1.2 산출식 그대로
- [ ] **`FR-080`** 파생 지표 — **탐색 노동** · **결정 시간**
- [ ] 배치 주기 확정 **(미정 — SRS에 없다)**
- [ ] 기준선 대비 판정 로직
- [ ] 게이트 판정 리포트 연동 (`TRK-D`)
- [ ] `schema_version` 전환 구간 처리 (§6.1.3)

### ⚠️ 기준선 15건이 미실측이다

원장 §7이 지적한 항목이다. KPI 기준선 중 **`산정` 9건 · `0%(신규)` 6건**이 실측되지 않았다.

**기준선 없이는 "목표 60% 달성"을 판정할 수 없다.** 무엇 대비 60%인지가 정해지지 않았기 때문이다.
§6.1.4는 **Phase 0 종료 시점에 기준선을 실측으로 전환**하도록 규정한다 — 그것이 `TRK-A`·`TRK-B`가 Phase 0인 이유다.

**이 태스크는 Phase 1이지만, 판정 가능성은 Phase 0 산출물에 달려 있다.**

### 🧪 Acceptance Criteria

**Scenario 1 · 정상 — WEBD 산출**
- **Given** 수집된 이벤트와 §6.1.2의 WEBD 산출식
- **When** 배치 집계를 실행함
- **Then** WEBD가 산출되고 기준선과 대비된다

**Scenario 2 · 예외 (§4.5.3) — 누락률 5% 초과**
- **Given** 특정 지표의 이벤트 누락률이 5%를 넘음
- **When** 집계함
- **Then** **해당 지표는 미공표**되고 누락률이 함께 보고된다 (§6.1.3 · `TRK-D`)

**Scenario 3 · 경계 — `schema_version` 전환 구간**
- **Given** 집계 기간 안에 버전 전환이 있음
- **When** 시계열을 산출함
- **Then** 버전별로 분리되어 **연속성이 깨진 구간이 표시**된다

**Scenario 4 · 근거 무결성 — 12건 전수 산출**
- **Given** §6.1.2의 산출식 12건
- **When** 집계를 실행함
- **Then** **12건 모두 산출된다.** 하나라도 못 뽑으면 `TRK-A` 스키마 보강이 필요하다

### ⚙️ Technical & Non-Functional Constraints
- **§6.1.2** 산출식 12건 — **반올림·요약 없이 원문 그대로**
- **§6.1.3** 누락률 5% 초과 미공표
- **Phase 1·2 게이트가 이 수치로 판정된다** — 계산 오류가 사업 판단 오류가 된다
- 기준선 15건 미실측 — Phase 0 종료 시 전환 (§6.1.4)

### 🏁 DoD
공통 DoD 5개. 추가로 —
- [ ] **12건 전수가 산출되는가?**
- [ ] 기준선이 Phase 0 실측값으로 전환되었는가?
- [ ] 배치 주기가 확정되고 게이트 판정 시점과 정합한가?
- [ ] 산출식이 §6.1.2 원문과 일치하는가?

### 🚧 Dependencies & Blockers
- **Depends on** `TRK-B` `EVD-D`
- **Blocks** `TRK-D` `TRK-E` · **Phase 1·2 게이트 판정**
- **미정 — 확정 필요** 배치 주기 · **기준선 15건 실측** (Phase 0 종료 시)

### 공통 DoD — 웨이브 `P2c-tracking` 전체

- [ ] §6.1.1의 이벤트 정의와 **건수까지** 일치하는가?
- [ ] 공통 속성 4개(`session_id` `anon_user_id` `occurred_at` `schema_version`)가 전 이벤트에 있는가?
- [ ] **누락률 5% 초과 시 미공표** 규칙이 적용되는가? (§6.1.3)
- [ ] KPI 산출식이 §6.1.2 원문과 일치하는가?
- [ ] 개인정보가 이벤트에 평문으로 실리지 않는가? (`PRV-A` 연계)

