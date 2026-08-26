# SPEC-005 · `POST /v1/agent-rooms` 계약

> **웨이브** `P1a-contracts` · **라벨** `spec, contract, backend, agent-room, priority:medium, phase-2`
> **원본** [`docs/issues-aiplace/P1a-contracts.md`](../P1a-contracts.md#spec-005)
> **원장** `TASKS-ai-place-v1.0.md` (TASKS-AIPLACE-MVP-001 v1.1 · 50건) · **SRS** `SRS-ai-place-v1.0.md` (SRS-AIPLACE-MVP-001 v1.9)

### 🎯 Summary
- **Task ID** `SPEC-005` · **Epic** Contract · **Should / M**
- **목적** 대화방 개시 계약. **180초 만료와 미개시 응답**이 여기서 확정된다.
- **⚠️ Phase 2 조건부** — SRS §6.2 게이트 1 통과 후에만 후행 구현이 착수된다

### 🔗 References
- SRS §8.1.1 `POST /v1/agent-rooms` 행 · §8.1 "만료 180s, 소환 3~5곳, 0곳이면 즉시 미개시, 조건 2개 이상 필수"
- `REQ-FUNC-022` 소환 · `REQ-FUNC-023` 수명주기 · §8.3 규칙 13 · §3.1.4 서버 시각 기준

### ✅ Task Breakdown
- [ ] 요청 DTO — 카테고리·지역·조건 json
- [ ] **조건 2개 이상 필수** 검증 규격
- [ ] 응답 DTO — room id · 소환 매장 수 · `expiresAt`
- [ ] **0곳 미개시 응답** 규격 — 오류인지 정상 응답인지 확정
- [ ] `expiresAt` 산출 기준 — **서버 시각** (§3.1.4)

### 🧪 Acceptance Criteria

**Scenario 1 · 정상**
- **Given** 카테고리·지역·조건 2개 이상이 주어지고 수용 매장이 3~5곳 존재함
- **When** 호출함
- **Then** `200`과 room id·소환 매장 수·`expiresAt`(생성 + **180초**)이 반환되고 **p95 ≤ 2,000ms**다

**Scenario 2 · 예외 (§4.5.3) — 소환 0곳**
- **Given** 조건을 수용하는 매장이 **0곳**
- **When** 호출함
- **Then** **즉시 미개시 응답**을 반환한다. **(미정 — 확정 필요)** `200` + 미개시 플래그인지 `4xx`인지 SRS에 없다

**Scenario 3 · 경계 — 조건 1개**
- **Given** 조건이 **1개만** 주어짐
- **When** 호출함
- **Then** `400`이 반환된다 (§8.1.1 "조건 2개 이상")

**Scenario 4 · 근거 무결성 — 수용 조건 밖 소환 배제**
- **Given** 조건을 수용하지 않는 매장이 후보군에 있음
- **When** 호출함
- **Then** **그 매장은 소환되지 않는다** (`REQ-FUNC-020`, §4.5.1)

### ⚙️ Technical & Non-Functional Constraints
- **§8.1.1** 소환 **3~5곳** · 조건 **2개 이상** · 만료 **180s** · p95 **≤ 2,000ms** · 단위: 인원 **명**, 만료 **s**
- **§3.1.4** 만료 판정은 **서버 시각 기준**. 클라이언트 시각을 신뢰하지 않는다
- **§8.3 규칙 13** 수명주기 규칙

### 🏁 DoD
공통 DoD 5개. 추가로 —
- [ ] 0곳 미개시 응답 형태가 확정되었는가?
- [ ] `expiresAt`이 서버 시각 기준임이 계약에 명시되었는가?

### 🚧 Dependencies & Blockers
- **Depends on** `SPEC-001` (#94)
- **Blocks** `AGT-A` (#149)(FR-042) · `CLI-F` (#152)(FR-074) · `MOCK-006` (#113)
- **⚠️ Phase 게이트** SRS §6.2 게이트 1 미통과 시 후행 구현이 v0.2로 이월된다
- **미정 — 확정 필요** 0곳 미개시 응답 형태 (`200` + 플래그 vs `4xx`)

### 공통 DoD — 웨이브 `P1a-contracts` 전체

- [ ] 계약이 `docs/api-aiplace.yaml`(OpenAPI)에 반영되었는가?
- [ ] 소비 측(구현·Mock·클라이언트) 담당자가 검토하고 동의했는가?
- [ ] **(미정)** 항목이 전부 해소되었거나 확정 담당자·기한이 지정되었는가?
- [ ] 계약 변경 절차(승인자·통보 대상)가 정해졌는가?
- [ ] SRS §8.1.1의 수치를 **반올림·요약 없이** 그대로 옮겼는가?

