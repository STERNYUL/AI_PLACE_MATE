# EVD-D · 불일치 신고 및 재확인 큐

> **웨이브** `P2b-evidence` · **라벨** `feature, command, backend, evidence-service, priority:high, phase-1`
> **원본** [`docs/issues-aiplace/P2b-evidence.md`](../P2b-evidence.md#evd-d)
> **원장** `TASKS-ai-place-v1.0.md` (TASKS-AIPLACE-MVP-001 v1.1 · 50건) · **SRS** `SRS-ai-place-v1.0.md` (SRS-AIPLACE-MVP-001 v1.9)

**원문** `FR-026` `FR-027`

### 🎯 Summary
- **Task ID** `EVD-D` · **Must / M (M×2)**
- **목적** 사용자가 "가봤더니 아니었다"를 알릴 경로. **북극성 KPI(불일치 신고율)의 데이터 원천**이다.

### 🔗 References
- `REQ-FUNC-013`(신고 접수 · `RECHECK_REQUIRED` ≤60s) · §8.3 규칙 12 · §8.6.5(이력 보존)
- 선행 `IDX-D`(FR-007 상태 전이) · 후행 `TRK-C`(KPI 집계)
- Phase 1 게이트 — **불일치 신고 ≤ 15%**

### ✅ Task Breakdown
- [ ] **`FR-026`** 신고 접수 + **`RECHECK_REQUIRED` 전환 (≤60s)**
- [ ] **`FR-027`** 재확인 큐 등록 및 처리 — **이력 보존** (§8.6.5)
- [ ] 신고 사유 분류 체계 **(미정 — SRS에 없다)**
- [ ] 재확인 처리 주체와 SLA **(미정)**
- [ ] 중복 신고 처리
- [ ] `TRK-C` KPI 집계 연동 — 신고율 산출

### ⚠️ 재확인을 누가 언제 하는지가 없다

`FR-027`은 *"재확인 큐 등록 및 처리"* 를 규정하지만 **처리 주체와 기한이 SRS에 없다.**

`RECHECK_REQUIRED` 상태의 후보는 `EVD-A` 검증에서 어떻게 취급되는가 — 이것도 `SPEC-008` 미정 항목이다.
**큐에 쌓이기만 하고 처리되지 않으면 그 매장은 영원히 후보에서 빠지거나, 영원히 잘못된 정보로 노출된다.**

| 미정 | 영향 |
| --- | --- |
| 처리 주체 | 운영팀? 매장 자신? 자동 재크롤링? |
| 처리 SLA | 24h? 7일? 없으면 큐가 무한히 쌓인다 |
| 처리 중 노출 여부 | `RECHECK_REQUIRED` 후보를 반환하는가 (`SPEC-008`) |

### 🧪 Acceptance Criteria

**Scenario 1 · 정상 — 신고 접수**
- **Given** 사용자가 조건 불일치를 신고함
- **When** 접수함
- **Then** **60초 이내**에 해당 `Verification`이 `RECHECK_REQUIRED`로 전이하고 재확인 큐에 등록된다

**Scenario 2 · 예외 (§4.5.3) — 중복 신고**
- **Given** 이미 `RECHECK_REQUIRED` 상태인 대상에 추가 신고
- **When** 접수함
- **Then** **(제안)** 접수는 받되 상태 전이는 중복 실행하지 않고, 신고 건수는 누적한다 (KPI 정확성)

**Scenario 3 · 경계 — 60초 경계**
- **Given** 신고 접수 시각
- **When** 전이 완료 시각을 측정함
- **Then** **60초 이내**다 (`REQ-FUNC-013`)

**Scenario 4 · 근거 무결성 — 이력 보존**
- **Given** 재확인이 완료되어 상태가 갱신됨
- **When** 이력을 조회함
- **Then** **이전 확인 정보와 신고 내역이 보존**된다 (§8.6.5). 덮어쓰지 않는다

### ⚙️ Technical & Non-Functional Constraints
- **`REQ-FUNC-013`** 신고 → 전이 **≤ 60s**
- **§8.6.5** 이력 보존 — 재확인 전후를 모두 남긴다
- **Phase 1 게이트** 불일치 신고 **≤ 15%** — 이 태스크가 그 수치의 원천
- 신고는 **사용자 신뢰의 마지막 경로**다. 접수 실패는 신뢰 실패다

### 🏁 DoD
공통 DoD 5개. 추가로 —
- [ ] 60초 전이가 실측으로 확인되는가?
- [ ] **재확인 처리 주체와 SLA가 확정되었는가?**
- [ ] 신고 사유 분류가 `TRK-C` KPI 산출에 필요한 형태인가?
- [ ] 이력이 보존되고 조회 가능한가?

### 🚧 Dependencies & Blockers
- **Depends on** `IDX-D`
- **Blocks** `TRK-C` `CLI-C`(FR-071)
- **미정 — 확정 필요**
  - **재확인 처리 주체와 SLA** — PM + 서비스 운영자 · **신규 발견**
  - 신고 사유 분류 체계
  - `RECHECK_REQUIRED` 후보의 노출 여부 (`SPEC-008`)

### 공통 DoD — 웨이브 `P2b-evidence` 전체

- [ ] **`SPEC-008` 4항목 정의를 재정의하지 않고 참조만** 했는가?
- [ ] **판정형 문구가 0건**인가? (§8.3 규칙 3 · `UX-C` 라이팅 가이드)
- [ ] 확인 일자·주체가 없는 정보가 외부로 나가지 않는가?
- [ ] `MOCK-003`·`MOCK-004`의 누락·상태 케이스로 검증했는가?
- [ ] SRS 수치를 반올림·요약 없이 옮겼는가?

