# TRK-B · 수집 파이프라인

> **웨이브** `P2c-tracking` · **라벨** `feature, backend, tracking-service, priority:high, phase-0`
> **원본** [`docs/issues-aiplace/P2c-tracking.md`](../P2c-tracking.md#trk-b)
> **원장** `TASKS-ai-place-v1.0.md` (TASKS-AIPLACE-MVP-001 v1.1 · 50건) · **SRS** `SRS-ai-place-v1.0.md` (SRS-AIPLACE-MVP-001 v1.9)

**원문** `FR-050` `FR-051` `FR-053`

### 🎯 Summary
- **Task ID** `TRK-B` · **Must / H (H×1+M×2)**
- **목적** 이벤트를 받아 저장하고, **무엇이 한 세션인지 정의**한다. 세션 정의가 틀리면 모든 KPI 분모가 틀린다.

### 🔗 References
- §6.1.1 · **§6.1.3**(세션 정의·중복 제거·제외 트래픽·`schema_version`) · §6.1.4
- 선행 `TRK-A` · `IN-F`(IN-013 파티셔닝)

### ✅ Task Breakdown
- [ ] **`FR-050`** 이벤트 수집 파이프라인 구축
- [ ] **`FR-051`** 세션 정의 · 중복 제거 · **제외 트래픽 규칙**
- [ ] **`FR-053`** `schema_version` 관리 및 시계열 분리
- [ ] 파티셔닝 연동 (`IN-F`)
- [ ] 유실률 측정 경로
- [ ] 개인정보 마스킹 연동 (`PRV-A`)

### 세션 정의가 KPI의 분모다

§6.1.3이 세션 정의를 규정하는 이유가 있다. 북극성 KPI **WEBD**를 비롯한 12건 대부분이
*"세션당"* 또는 *"세션 대비"* 로 정의된다.

**세션 경계가 흔들리면 모든 비율이 흔들린다.** 그리고 제외 트래픽(봇·내부 접근) 규칙이 없으면
분모가 부풀어 KPI가 실제보다 낮게 나온다.

### 🧪 Acceptance Criteria

**Scenario 1 · 정상 — 이벤트 수집**
- **Given** 22종 중 임의 이벤트
- **When** 전송함
- **Then** 저장되고 공통 속성 4개가 보존된다

**Scenario 2 · 예외 (§4.5.3) — 중복 이벤트**
- **Given** 동일 이벤트가 재전송됨 (네트워크 재시도)
- **When** 수집함
- **Then** **중복 제거**되어 한 번만 집계된다 (§6.1.3)

**Scenario 3 · 경계 — 세션 경계**
- **Given** 세션 정의의 경계 조건 (타임아웃 등)
- **When** 세션을 판정함
- **Then** **(미정 — 확정 필요)** §6.1.3의 세션 정의 상세가 이 태스크에서 확정돼야 한다

**Scenario 4 · 근거 무결성 — 제외 트래픽**
- **Given** 내부 접근·봇 트래픽
- **When** 수집함
- **Then** **제외 규칙에 따라 KPI 분모에서 빠진다.** 규칙 없이는 모든 비율이 낮게 나온다

### ⚙️ Technical & Non-Functional Constraints
- **§6.1.4** Phase 0 산출물 — 게이트 판정의 전제
- **§6.1.3** 세션·중복·제외 규칙이 KPI 정확성의 근본
- 파티셔닝 (`IN-F`) 없이는 대용량 조회가 성립하지 않는다
- **`REQ-NF-013`** 출발지 정보 30일 파기 — 이벤트에 실리면 파기 대상 (`PRV-A`)

### 🏁 DoD
공통 DoD 5개. 추가로 —
- [ ] **세션 정의가 문서로 확정되고 KPI 담당자가 동의했는가?**
- [ ] 제외 트래픽 규칙이 적용되고 그 비율이 관측되는가?
- [ ] 중복 제거가 재전송 시나리오로 검증되었는가?
- [ ] 유실률이 측정 가능한가?

### 🚧 Dependencies & Blockers
- **Depends on** `TRK-A`(또는 `SPEC-009`) `IN-F`
- **Blocks** `TRK-C` `TRK-D` `TRK-E` `CLI-E` `PRV-A`
- **미정 — 확정 필요** 세션 정의 상세 · 제외 트래픽 판정 기준

### 공통 DoD — 웨이브 `P2c-tracking` 전체

- [ ] §6.1.1의 이벤트 정의와 **건수까지** 일치하는가?
- [ ] 공통 속성 4개(`session_id` `anon_user_id` `occurred_at` `schema_version`)가 전 이벤트에 있는가?
- [ ] **누락률 5% 초과 시 미공표** 규칙이 적용되는가? (§6.1.3)
- [ ] KPI 산출식이 §6.1.2 원문과 일치하는가?
- [ ] 개인정보가 이벤트에 평문으로 실리지 않는가? (`PRV-A` 연계)

