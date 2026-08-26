# MOCK-007 · 예약·결제 Mock

> **웨이브** `P1c-mock` · **라벨** `mock, backend, payment-service, priority:high, phase-1`
> **원본** [`docs/issues-aiplace/P1c-mock.md`](../P1c-mock.md#mock-007)
> **원장** `TASKS-ai-place-v1.0.md` (TASKS-AIPLACE-MVP-001 v1.1 · 50건) · **SRS** `SRS-ai-place-v1.0.md` (SRS-AIPLACE-MVP-001 v1.9)

### 🎯 Summary
- **Task ID** `MOCK-007` · **Must / M**
- **목적** **PG사 선정 전에도 결제 화면을 만들 수 있게** 한다. `SPEC-007`의 절반이 미확정인 상태를 우회한다.

### 🔗 References
- 계약 **`SPEC-007`** · 소비 `CLI-D`(FR-072·073) · `UX-E`

### ✅ Task Breakdown
- [ ] 승인 성공 응답 — 거래 토큰
- [ ] 승인 실패 응답 (카드 거절 · 한도 초과 등)
- [ ] **PG 장애 응답** (`SPEC-007` Scenario 2)
- [ ] 취소·환불 접수 응답
- [ ] 환불 완료 응답 (비동기)
- [ ] 2시간 전 시한 경과 취소 거부 응답

### ⚠️ PG사 미선정 상태를 Mock이 흡수한다

`SPEC-007`은 **실제 API 형식·토큰 형식·오류 코드 체계가 PG 선정 후에만 확정**된다.
Mock은 **우리 쪽 요구사항**(카드 정보 비보관 · 환불 ≤ 24h · 거래 토큰만)만으로 만들 수 있다.

**따라서 `CLI-D`·`UX-E`는 PG 계약을 기다리지 않는다.** PG 선정 후 Mock을 실제 규격으로 갱신한다.

### 🧪 Acceptance Criteria

**Scenario 1 · 정상** — 승인 성공 시 거래 토큰이 반환되고 예약 확정 화면이 렌더된다
**Scenario 2 · 예외** — PG 장애 응답 시 **예약이 미확정 상태로 남고** 재시도 경로가 동작한다
**Scenario 3 · 경계** — 2시간 전 시한을 지난 취소 요청이 거부된다 (`REQ-FUNC-017`)
**Scenario 4 · 근거 무결성 — 해당 없음** — 후보·제안을 반환하지 않는다

### ⚙️ Technical & Non-Functional Constraints
- **`REQ-NF-016`** 카드 정보 비보관 — **Mock도 카드 정보를 받지 않는다**
- **`REQ-FUNC-017`** 환불 ≤ 24h · 2시간 전 시한
- PG 선정 후 **갱신 필수**

### 🏁 DoD
공통 DoD 6개. 추가로 —
- [ ] Mock이 카드 정보를 요구하지 않는가?
- [ ] PG 선정 후 갱신 절차가 문서화되었는가?

### 🚧 Dependencies & Blockers
- **Depends on** `MOCK-001` (#108) `SPEC-007` (#100)
- **Blocks** `CLI-D` (#138) `UX-E` (#144)
- **미정** `SPEC-007` PG 장애 시 예약 상태 처리

### 공통 DoD — 웨이브 `P1c-mock` 전체

- [ ] 응답이 `docs/api-aiplace.yaml` 스키마 검증을 **자동으로** 통과하는가? (수동 대조는 반드시 어긋난다)
- [ ] 정상·예외·경계 시나리오를 **스위치로 전환**할 수 있는가?
- [ ] **지연 주입**이 가능한가? (p95 초과·타임아웃 경로 검증용)
- [ ] 계약 변경 시 Mock 갱신을 강제하는 절차가 있는가?
- [ ] 소비 측 팀이 실제로 이 Mock으로 착수했음을 확인했는가?
- [ ] 실구현 완료 후 **폐기 시점**이 정해져 있는가?

