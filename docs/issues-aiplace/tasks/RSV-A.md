# RSV-A · Reservation 엔터티 및 조건 승계

> **웨이브** `P2d-reservation-privacy` · **라벨** `feature, backend, reservation-service, priority:high, phase-1-late`
> **원본** [`docs/issues-aiplace/P2d-reservation-privacy.md`](../P2d-reservation-privacy.md#rsv-a)
> **원장** `TASKS-ai-place-v1.0.md` (TASKS-AIPLACE-MVP-001 v1.1 · 50건) · **SRS** `SRS-ai-place-v1.0.md` (SRS-AIPLACE-MVP-001 v1.9)

**원문** `FR-028` `FR-029`

### 🎯 Summary
- **Task ID** `RSV-A` · **Must / M (M×2)**
- **목적** 예약의 뼈대. **재입력 필드 0개**(`REQ-FUNC-015`)를 성립시키는 조건 승계가 핵심이다.

### 🔗 References
- §8.2 · §8.6.3 · §4.5.5 · `REQ-FUNC-015`
- **ADR-005** · 선행 `IDX-A`(`Proposal` 참조 계약)

### ⚠️ `Proposal` 참조는 계약만 있고 대상은 아직 없다

§8.6.3은 `Reservation.proposalId`가 `Proposal`을 참조하도록 규정한다.
그런데 `Proposal`을 만드는 `AGT-C`(FR-044)는 **Phase 2**다.

**`IDX-A`에서 스키마 계약을 고정했으므로 이 태스크는 착수할 수 있다.**
실제 참조 연결은 `AGT-C` 완료 시점에 결선된다. Phase 2가 이월되면 **참조가 비어 있는 상태로 운영**된다 —
그 경우의 동작이 정의돼야 한다.

### ✅ Task Breakdown
- [ ] **`FR-028`** `Reservation` 엔터티 + 상태 전이 (§8.2)
- [ ] **`FR-029`** 제안 조건 자동 승계 — **인원 · 메뉴 구성 · 시간**
- [ ] `proposalId` 참조 — **Phase 2 미착수 시 null 허용 여부 확정 (미정)**
- [ ] 재입력 필드 0개 검증 (`REQ-FUNC-015`)
- [ ] Top-3 후보에서 직접 예약하는 경로 (제안 없이)

### 🧪 Acceptance Criteria

**Scenario 1 · 정상 — 조건 승계**
- **Given** 선택된 제안 또는 후보의 인원·메뉴 구성·시간
- **When** 예약을 생성함
- **Then** 조건이 자동 승계되고 **사용자가 재입력할 필드가 0개**다

**Scenario 2 · 예외 (§4.5.3) — 제안 없는 예약**
- **Given** Phase 2 미착수로 `Proposal`이 존재하지 않음
- **When** Top-3 후보에서 직접 예약함
- **Then** **(미정 — 확정 필요)** `proposalId` null 허용인지, 별도 경로인지

**Scenario 3 · 경계 — 승계 조건 불완전**
- **Given** 제안에 시간 정보가 없음
- **When** 승계함
- **Then** **(미정)** 누락 필드를 사용자에게 물으면 "재입력 0개"가 깨진다

**Scenario 4 · 근거 무결성 — 승계 값 출처 추적**
- **Given** 승계된 예약 조건
- **When** 출처를 확인함
- **Then** 어느 제안·후보에서 왔는지 추적 가능하다 (분쟁 대응)

### ⚙️ Technical & Non-Functional Constraints
- **`REQ-FUNC-015`** 재입력 필드 **0개**
- **§8.6.3** `Reservation.proposalId` 참조 제약
- **ADR-005** 이 태스크가 Phase 2보다 먼저 — 참조 대상이 나중에 생긴다
- 상태 전이는 §8.2 도식과 일치

### 🏁 DoD
공통 DoD 5개. 추가로 —
- [ ] **Phase 2 미착수 시 `proposalId` 처리가 확정되었는가?**
- [ ] 재입력 필드가 실제로 0개인가? (`UX-E` 플로우로 검증)
- [ ] 승계 출처가 추적 가능한가?

### 🚧 Dependencies & Blockers
- **Depends on** `IDX-A`(`Proposal` 스키마 계약)
- **Blocks** `RSV-B` `RSV-C` `CLI-D`
- **미정 — 확정 필요** Phase 2 미착수 시 `proposalId` 처리 · 승계 조건 불완전 시 동작

### 공통 DoD — 웨이브 `P2d-reservation-privacy` 전체

- [ ] **카드 정보가 어느 경로로도 저장되지 않는가?** (`REQ-NF-016`)
- [ ] 상태 전이가 §8.2 · §8.6.3과 일치하는가?
- [ ] 개인정보가 로그·이벤트에 평문으로 남지 않는가?
- [ ] `MOCK-007`로 PG 미선정 상태에서도 검증했는가?
- [ ] SRS 수치를 반올림·요약 없이 옮겼는가?

