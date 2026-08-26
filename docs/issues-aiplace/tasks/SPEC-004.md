# SPEC-004 · `POST /v1/share-cards` 계약

> **웨이브** `P1a-contracts` · **라벨** `spec, contract, backend, evidence-service, priority:high, phase-0`
> **원본** [`docs/issues-aiplace/P1a-contracts.md`](../P1a-contracts.md#spec-004)
> **원장** `TASKS-ai-place-v1.0.md` (TASKS-AIPLACE-MVP-001 v1.1 · 50건) · **SRS** `[SRS]ai-place -mate-SRSv1.0.md` (SRS-AIPLACE-MVP-001 v1.9)

### 🎯 Summary
- **Task ID** `SPEC-004` · **Epic** Contract · **Must / M**
- **목적** 공유 카드 생성 계약. **SRS가 `400` 반환 조건을 명시한 두 곳 중 하나**다.

### 🔗 References
- SRS §8.1.1 `POST /v1/share-cards` 행 · §8.1 "p95 ≤ 3,000ms, 근거 4항목 누락 시 400 반환"
- `REQ-FUNC-012` 공유 카드 · `REQ-NF-003` 응답 시간 · §4.5.1
- 공유 계약 **`SPEC-008`(근거 4항목)** — 누락 판정 기준의 원천

### ✅ Task Breakdown
- [ ] 요청 DTO — 후보 id + 조건 요약
- [ ] 응답 DTO — 이미지 URL + 딥링크 (§8.1.1 "포함 항목")
- [ ] **근거 4항목 누락 시 `400`** 규격 — 오류 본문에 어느 항목이 누락됐는지 표기 **(제안)**
- [ ] 카드 유효기간 **(미정)**
- [ ] 후보 id ↔ query 응답 연결 검증 (§8.1.1 상호 관계)

### 🧪 Acceptance Criteria

**Scenario 1 · 정상**
- **Given** 근거 4항목이 완비된 후보 id와 조건 요약
- **When** 호출함
- **Then** `200`과 이미지 URL·딥링크가 반환되고 **p95 ≤ 3,000ms**다

**Scenario 2 · 예외 (§4.5.3) — 이미지 생성 실패**
- **Given** 카드 이미지 생성이 실패함
- **When** 호출함
- **Then** **(미정 — 확정 필요)** 딥링크만 반환하는지 전체 실패인지 SRS에 없다

**Scenario 3 · 경계 — 유효하지 않은 후보 id**
- **Given** query 응답에 없던 후보 id
- **When** 호출함
- **Then** **(제안)** `400`. §8.1.1은 후보 id가 query에서 온다고만 규정한다

**Scenario 4 · 근거 무결성 — 이 태스크의 핵심**
- **Given** 근거 4항목 중 **확인 주체**가 누락된 후보 id
- **When** 호출함
- **Then** **`400`이 반환되고 카드가 생성되지 않는다** (§8.1 명시)

### ⚙️ Technical & Non-Functional Constraints
- **§8.1** p95 **≤ 3,000ms** · 근거 4항목 누락 시 **`400`**
- **§4.5.1** 근거 무결성이 생성의 전제
- 생성된 카드는 **외부로 유통된다** — 근거 없는 카드가 나가면 회수 불가

### 🏁 DoD
공통 DoD 5개. 추가로 —
- [ ] 누락 항목을 오류 본문에 표기하는지 확정되었는가?
- [ ] `SPEC-008`의 4항목 정의를 **재정의하지 않고 참조만** 했는가?

### 🚧 Dependencies & Blockers
- **Depends on** `SPEC-001` (#94) · **`SPEC-008` (#101)**
- **Blocks** `EVD-C` (#122)(FR-025) · `CLI-C` (#137)(FR-070) · `MOCK-005` (#112)
- **미정 — 확정 필요** 이미지 생성 실패 시 동작 · 카드 유효기간

### 공통 DoD — 웨이브 `P1a-contracts` 전체

- [ ] 계약이 `docs/api-aiplace.yaml`(OpenAPI)에 반영되었는가?
- [ ] 소비 측(구현·Mock·클라이언트) 담당자가 검토하고 동의했는가?
- [ ] **(미정)** 항목이 전부 해소되었거나 확정 담당자·기한이 지정되었는가?
- [ ] 계약 변경 절차(승인자·통보 대상)가 정해졌는가?
- [ ] SRS §8.1.1의 수치를 **반올림·요약 없이** 그대로 옮겼는가?

