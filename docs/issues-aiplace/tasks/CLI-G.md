# CLI-G · 매장 콘솔 화면

> **웨이브** `P2g-phase2` · **라벨** `feature, frontend, merchant, priority:high, phase-2, conditional`
> **원본** [`docs/issues-aiplace/P2g-phase2.md`](../P2g-phase2.md#cli-g)
> **원장** `TASKS-ai-place-v1.0.md` (TASKS-AIPLACE-MVP-001 v1.1 · 50건) · **SRS** `[SRS]ai-place -mate-SRSv1.0.md` (SRS-AIPLACE-MVP-001 v1.9)

**원문** `FR-076`

### 🎯 Summary
- **Task ID** `CLI-G` · **Should / H**
- **목적** `UX-H` 설계의 구현. **설정 3화면 · 필수 5항목 · 1회 클릭 수정.**

### 🔗 References
- `REQ-FUNC-019` · `REQ-FUNC-027` · §3.1.2
- 선행 `MCH-A` `UX-H` · **계약 `SPEC-010` 미신설**
- 인증 — `IN-B`(FR-041 콘솔 2FA)

### ⚠️ 계약이 없으면 `MCH-A`를 기다리게 된다

`SPEC-010`이 없으면 `CLI-G`는 `MCH-A` 완료를 기다려야 한다.
**Phase 1에서 `MOCK-`으로 깬 직렬 구조가 Phase 2에서 되살아난다.**

Phase 2 착수 시 **가장 먼저 할 일이 `SPEC-010` 확정**이며,
`UX-H`가 그 초안 입력을 제공한다.

### ✅ Task Breakdown
- [ ] **`FR-076`** 매장 콘솔 화면 — **설정 3화면**
- [ ] 필수 5항목 입력 UI
- [ ] **1회 클릭 수정** 구현 (`REQ-FUNC-027`)
- [ ] 근거 없는 문구 입력 차단 UI (`MCH-A` 서버 검증과 이중)
- [ ] **콘솔 2FA 연동** (`IN-B` FR-041)
- [ ] `SPEC-010` 계약 기반 API 클라이언트

### 🧪 Acceptance Criteria

**Scenario 1 · 정상 — 3화면 완주**
- **Given** 가맹 매장 계정
- **When** 설정 3화면을 통과함
- **Then** 필수 5항목이 등록된다 (`REQ-FUNC-019`)

**Scenario 2 · 예외 (§4.5.3) — 판정형 입력**
- **Given** 매장이 판정형 문구를 입력함
- **When** 저장을 시도함
- **Then** **클라이언트에서 안내하고 서버(`MCH-A`)에서도 차단**된다. 이중 방어

**Scenario 3 · 경계 — 1회 클릭 수정**
- **Given** 로그인 상태의 매장
- **When** 항목 수정을 시도함
- **Then** **1회 클릭으로 수정 가능**하다 (`REQ-FUNC-027`)

**Scenario 4 · 근거 무결성 — 확인 정보 자동 기록**
- **Given** 매장이 값을 저장함
- **When** 저장 결과를 확인함
- **Then** **확인 주체·일자가 자동 기록**되고 매장에게도 보인다

### ⚙️ Technical & Non-Functional Constraints
- **`REQ-FUNC-019`** 3화면 · 5항목 · **`REQ-FUNC-027`** 1회 클릭
- **`FR-041`** 콘솔 **2FA** (`IN-B`)
- 콘솔은 **데스크톱 사용 가능성**이 높다 — 사용자 앱과 다른 환경 대응 **(미정)**

### 🏁 DoD
공통 DoD 5개. 추가로 —
- [ ] **`SPEC-010` 계약 기반으로 구현되었는가?**
- [ ] 2FA가 적용되었는가?
- [ ] 1회 클릭 수정이 실측되는가?
- [ ] 콘솔 대상 환경(데스크톱/모바일)이 확정되었는가?

### 🚧 Dependencies & Blockers
- **Depends on** `MCH-A` (#148) `UX-H` (#147) `IN-B` (#169) · **`SPEC-010`**
- **Blocks** 없음
- **미정 — 확정 필요** **`SPEC-010` 신설** · 콘솔 대상 환경

### 공통 DoD — 웨이브 `P2g-phase2` 전체

- [ ] **Phase 1 게이트 통과가 확인된 뒤 착수했는가?**
- [ ] 근거 없는 문구가 매장 입력 경로로도 들어오지 않는가? (§8.3 규칙 7)
- [ ] 제안에도 근거 4항목이 적용되는가? (`SPEC-008` · `EVD-A`)
- [ ] **180초 수명이 서버 시각 기준**인가? (§8.3 규칙 13)
- [ ] 제안 0건 시 Top-3 회귀가 동작하는가? (`REQ-FUNC-025` · `UX-F`)

