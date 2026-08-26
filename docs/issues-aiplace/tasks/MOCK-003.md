# MOCK-003 · 근거 4항목 완비/누락 Mock

> **웨이브** `P1c-mock` · **라벨** `mock, backend, evidence-service, priority:high, phase-1`
> **원본** [`docs/issues-aiplace/P1c-mock.md`](../P1c-mock.md#mock-003)
> **원장** `TASKS-ai-place-v1.0.md` (TASKS-AIPLACE-MVP-001 v1.1 · 50건) · **SRS** `SRS-ai-place-v1.0.md` (SRS-AIPLACE-MVP-001 v1.9)

### 🎯 Summary
- **Task ID** `MOCK-003` · **Must / M**
- **목적** **근거 무결성 동작을 검증하는 유일한 수단.** 실제 데이터로는 누락 케이스를 만들기 어렵다.

### 🔗 References
- 계약 **`SPEC-002`** · **`SPEC-008`(근거 4항목)** · 소비 `CLI-C` · `UX-C`

### ✅ Task Breakdown
- [ ] 4항목 완비 응답
- [ ] **항목별 누락 응답 4종** — 선정 이유 / 근거 속성 / 확인 일자 / 확인 주체 각각
- [ ] 누락 시 제외 동작 검증용 조합 응답
- [ ] `SPEC-008` 확정 결과 반영 (제외인지 표기인지)

### 누락 4종이 각각 필요한 이유

`SPEC-008`은 4항목을 **동등하게** 취급한다. 그런데 구현이 실수로 3개만 검사할 수 있다.
**항목별로 하나씩 빼본 응답이 있어야 그 실수가 드러난다.**

### 🧪 Acceptance Criteria

**Scenario 1 · 정상** — 4항목 완비 후보가 정상 렌더된다
**Scenario 2 · 예외** — 확인 주체만 빠진 응답에서 **그 후보가 제외되거나 정의된 표기**가 나타난다
**Scenario 3 · 경계** — 4항목 중 1개씩 빠진 4종 응답 각각에서 **동일한 처리**가 일어난다
**Scenario 4 · 근거 무결성** — **이 Mock 자체가 근거 무결성 검증 도구다.** 4종 누락 케이스가 모두 재현된다

### ⚙️ Technical & Non-Functional Constraints
- `SPEC-008`의 정의를 **재정의하지 않고 재현만** 한다
- `EVD-A`·`EVD-C`·`AGT-C`·`CLI-C` 네 소비처가 같은 결론을 내는지 확인하는 데 쓰인다

### 🏁 DoD
공통 DoD 6개. 추가로 —
- [ ] 4종 누락 응답이 각각 생성되는가?
- [ ] `SPEC-008` 확정 후 동작이 갱신되었는가?

### 🚧 Dependencies & Blockers
- **Depends on** `MOCK-001` `SPEC-002` `SPEC-008`
- **Blocks** `CLI-C` `UX-C`
- **미정** `SPEC-008`의 누락 시 동작 (제외 vs 표기)

### 공통 DoD — 웨이브 `P1c-mock` 전체

- [ ] 응답이 `docs/api-aiplace.yaml` 스키마 검증을 **자동으로** 통과하는가? (수동 대조는 반드시 어긋난다)
- [ ] 정상·예외·경계 시나리오를 **스위치로 전환**할 수 있는가?
- [ ] **지연 주입**이 가능한가? (p95 초과·타임아웃 경로 검증용)
- [ ] 계약 변경 시 Mock 갱신을 강제하는 절차가 있는가?
- [ ] 소비 측 팀이 실제로 이 Mock으로 착수했음을 확인했는가?
- [ ] 실구현 완료 후 **폐기 시점**이 정해져 있는가?

