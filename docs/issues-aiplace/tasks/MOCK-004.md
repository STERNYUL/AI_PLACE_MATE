# MOCK-004 · 신선도 3상태 Mock

> **웨이브** `P1c-mock` · **라벨** `mock, backend, evidence-service, priority:high, phase-1`
> **원본** [`docs/issues-aiplace/P1c-mock.md`](../P1c-mock.md#mock-004)
> **원장** `TASKS-ai-place-v1.0.md` (TASKS-AIPLACE-MVP-001 v1.1 · 50건) · **SRS** `SRS-ai-place-v1.0.md` (SRS-AIPLACE-MVP-001 v1.9)

### 🎯 Summary
- **Task ID** `MOCK-004` · **Must / M**
- **목적** `VERIFIED` / `STALE` / `RECHECK_REQUIRED` 세 상태의 표기를 UI에서 미리 그린다.

### 🔗 References
- 계약 `SPEC-002` · SRS §8.2 상태 전이 · `REQ-FUNC-011` · `REQ-NF-011`
- 소비 `CLI-C`(FR-069 신선도 표기) · `UX-C`

### ✅ Task Breakdown
- [ ] `VERIFIED` 응답 — 경고 없음
- [ ] `STALE` 응답 — **90일 초과 경고 병기**
- [ ] `RECHECK_REQUIRED` 응답 — 재확인 중 표기
- [ ] 경계 응답 — `verified_at + 89일` / `+90일` / `+91일`
- [ ] **판정형 문구가 섞이지 않은** 문안 (§8.3 규칙 3)

### 🧪 Acceptance Criteria

**Scenario 1 · 정상** — `VERIFIED` 후보에 경고 표기가 없다
**Scenario 2 · 예외** — `RECHECK_REQUIRED` 후보의 표기가 정의된 대로 나타난다
**Scenario 3 · 경계** — 89일 / 90일 / 91일 세 응답에서 경고 전환 지점이 확인된다
**Scenario 4 · 근거 무결성** — 세 상태 어디에도 **판정형 문구가 없다** (§8.3 규칙 3 · `UX-C` 라이팅 가이드)

### ⚙️ Technical & Non-Functional Constraints
- **`REQ-NF-011`** 경고 누락률 **0%** — Mock이 경고 없는 `STALE`을 만들 수 있으면 안 된다
- **§8.3 규칙 3** 판정 금지 — 표기 문안이 사실 진술이어야 한다

### 🏁 DoD
공통 DoD 6개. 추가로 —
- [ ] 3상태 + 경계 3종이 모두 동작하는가?
- [ ] `UX-C` 담당자가 세 상태 표기를 실제로 그렸는가?

### 🚧 Dependencies & Blockers
- **Depends on** `MOCK-001` (#108) `SPEC-002` (#95)
- **Blocks** `CLI-C` (#137) `UX-C` (#142)

### 공통 DoD — 웨이브 `P1c-mock` 전체

- [ ] 응답이 `docs/api-aiplace.yaml` 스키마 검증을 **자동으로** 통과하는가? (수동 대조는 반드시 어긋난다)
- [ ] 정상·예외·경계 시나리오를 **스위치로 전환**할 수 있는가?
- [ ] **지연 주입**이 가능한가? (p95 초과·타임아웃 경로 검증용)
- [ ] 계약 변경 시 Mock 갱신을 강제하는 절차가 있는가?
- [ ] 소비 측 팀이 실제로 이 Mock으로 착수했음을 확인했는가?
- [ ] 실구현 완료 후 **폐기 시점**이 정해져 있는가?

