# MOCK-002 · Top-3 조회 Mock

> **웨이브** `P1c-mock` · **라벨** `mock, backend, search-service, priority:high, phase-1`
> **원본** [`docs/issues-aiplace/P1c-mock.md`](../P1c-mock.md#mock-002)
> **원장** `TASKS-ai-place-v1.0.md` (TASKS-AIPLACE-MVP-001 v1.1 · 50건) · **SRS** `[SRS]ai-place -mate-SRSv1.0.md` (SRS-AIPLACE-MVP-001 v1.9)

### 🎯 Summary
- **Task ID** `MOCK-002` · **Must / M**
- **목적** `CLI-B`·`CLI-C`가 `SRC-A`~`SRC-D` 완성을 기다리지 않게 한다. **직렬 구조가 풀리는 핵심 지점.**

### 🔗 References
- 계약 **`SPEC-002`** · 소비 `CLI-B`(FR-066·067) · `CLI-C`(FR-068)

### ✅ Task Breakdown
- [ ] 성공 응답 — 후보 **정확히 3개** · 여섯 필드 완비
- [ ] **폴백 전환 신호** 응답 (`REQ-FUNC-009`)
- [ ] 빈 결과 응답 — `SPEC-002` Scenario 4 확정 결과 반영
- [ ] '예산 초과 N곳' 요약 포함 응답 (`REQ-FUNC-003`)
- [ ] 유사 메뉴 대체 명시 응답 (`REQ-FUNC-007`)
- [ ] p95 1,000ms 초과 지연 응답

### 필요한 시나리오

| 시나리오 | 응답 | 소비 측이 검증할 것 |
| --- | --- | --- |
| 정상 3개 | 후보 3 · 여섯 필드 | Top-3 카드 렌더 |
| 폴백 전환 | 전환 신호 + 구조화 후보군 | 전환 고지 UI (`UX-B`) |
| 예산 초과 요약 | 'N곳 초과' 포함 | 요약 표기 |
| 유사 대체 | 대체 사실 명시 | 대체 고지 표기 |
| **후보 없음** | `SPEC-002` 확정안 | **빈 화면 금지 처리 (`UX-F`)** |
| 지연 1,500ms | 정상 응답 + 지연 | 로딩·레이아웃 안정 |

**"후보 없음"이 `UX-F`(빈 화면 금지)의 유일한 검증 수단이다.** 이 응답이 없으면 그 태스크를 그릴 수 없다.

### 🧪 Acceptance Criteria

**Scenario 1 · 정상** — 3개 후보 응답이 계약 스키마를 통과하고 `CLI-C`가 렌더한다
**Scenario 2 · 예외** — 폴백 전환 신호를 반환하면 `CLI-B`가 구조화 필터 UI로 전환한다
**Scenario 3 · 경계** — 지연 1,500ms 주입 시 클라이언트 로딩 처리와 레이아웃 안정성이 검증된다
**Scenario 4 · 근거 무결성** — 여섯 필드 중 **근거 문장·확인 일자·주체가 빠진 응답은 생성 불가**하다 (계약 검증)

### ⚙️ Technical & Non-Functional Constraints
- `SPEC-002` 계약 준수 · 후보 **정확히 3개**
- **`SPEC-002` Scenario 4 미확정** — "3개 고정 ↔ 근거 없는 후보 제외" 충돌이 정해져야 빈 결과 응답을 만들 수 있다

### 🏁 DoD
공통 DoD 6개. 추가로 —
- [ ] 6종 시나리오가 모두 동작하는가?
- [ ] `CLI-B`·`CLI-C` 담당자가 이 Mock으로 착수했는가?

### 🚧 Dependencies & Blockers
- **Depends on** `MOCK-001` (#108) `SPEC-002` (#95)
- **Blocks** `CLI-B` (#136) `CLI-C` (#137) `UX-F` (#145)
- **미정** `SPEC-002` Scenario 4 (3개 고정 ↔ 근거 제외 충돌)

### 공통 DoD — 웨이브 `P1c-mock` 전체

- [ ] 응답이 `docs/api-aiplace.yaml` 스키마 검증을 **자동으로** 통과하는가? (수동 대조는 반드시 어긋난다)
- [ ] 정상·예외·경계 시나리오를 **스위치로 전환**할 수 있는가?
- [ ] **지연 주입**이 가능한가? (p95 초과·타임아웃 경로 검증용)
- [ ] 계약 변경 시 Mock 갱신을 강제하는 절차가 있는가?
- [ ] 소비 측 팀이 실제로 이 Mock으로 착수했음을 확인했는가?
- [ ] 실구현 완료 후 **폐기 시점**이 정해져 있는가?

