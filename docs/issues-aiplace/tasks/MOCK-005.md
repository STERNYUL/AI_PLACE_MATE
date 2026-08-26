# MOCK-005 · 공유 카드 Mock

> **웨이브** `P1c-mock` · **라벨** `mock, backend, evidence-service, priority:medium, phase-1`
> **원본** [`docs/issues-aiplace/P1c-mock.md`](../P1c-mock.md#mock-005)
> **원장** `TASKS-ai-place-v1.0.md` (TASKS-AIPLACE-MVP-001 v1.1 · 50건) · **SRS** `[SRS]ai-place -mate-SRSv1.0.md` (SRS-AIPLACE-MVP-001 v1.9)

### 🎯 Summary
- **Task ID** `MOCK-005` · **Should / L**
- **목적** 공유 카드 생성 성공과 **근거 누락 `400`** 두 경로를 재현한다.

### 🔗 References
- 계약 **`SPEC-004`** · 소비 `CLI-C`(FR-070) · `UX-D`

### ✅ Task Breakdown
- [ ] 성공 응답 — 이미지 URL + 딥링크
- [ ] **근거 누락 `400`** 응답
- [ ] 이미지 생성 실패 응답 (`SPEC-004` Scenario 2 확정 후)
- [ ] p95 3,000ms 초과 지연 응답

### 🧪 Acceptance Criteria

**Scenario 1 · 정상** — 이미지 URL·딥링크가 반환되고 공유 UI가 동작한다
**Scenario 2 · 예외** — 근거 누락 시 `400`이 반환되고 **클라이언트가 카드 생성을 시도하지 않는다**
**Scenario 3 · 경계** — 3,000ms 지연 시 로딩 처리가 검증된다
**Scenario 4 · 근거 무결성** — **근거 없는 카드가 생성되는 응답을 만들 수 없다** (계약이 금지)

### ⚙️ Technical & Non-Functional Constraints
- 생성된 카드는 **외부로 유통**된다. 근거 없는 카드가 나가면 회수 불가
- `SPEC-004` p95 ≤ 3,000ms

### 🏁 DoD
공통 DoD 6개. 추가로 —
- [ ] `400` 경로가 `UX-D` 플로우에 반영되었는가?

### 🚧 Dependencies & Blockers
- **Depends on** `MOCK-001` (#108) `SPEC-004` (#97)
- **Blocks** `CLI-C` (#137)(FR-070) `UX-D` (#143)
- **미정** `SPEC-004` 이미지 생성 실패 시 동작

### 공통 DoD — 웨이브 `P1c-mock` 전체

- [ ] 응답이 `docs/api-aiplace.yaml` 스키마 검증을 **자동으로** 통과하는가? (수동 대조는 반드시 어긋난다)
- [ ] 정상·예외·경계 시나리오를 **스위치로 전환**할 수 있는가?
- [ ] **지연 주입**이 가능한가? (p95 초과·타임아웃 경로 검증용)
- [ ] 계약 변경 시 Mock 갱신을 강제하는 절차가 있는가?
- [ ] 소비 측 팀이 실제로 이 Mock으로 착수했음을 확인했는가?
- [ ] 실구현 완료 후 **폐기 시점**이 정해져 있는가?

