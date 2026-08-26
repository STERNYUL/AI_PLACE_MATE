# EVD-C · 공유 카드 생성

> **웨이브** `P2b-evidence` · **라벨** `feature, backend, evidence-service, priority:high, phase-1`
> **원본** [`docs/issues-aiplace/P2b-evidence.md`](../P2b-evidence.md#evd-c)
> **원장** `TASKS-ai-place-v1.0.md` (TASKS-AIPLACE-MVP-001 v1.1 · 50건) · **SRS** `SRS-ai-place-v1.0.md` (SRS-AIPLACE-MVP-001 v1.9)

**원문** `FR-025`

### 🎯 Summary
- **Task ID** `EVD-C` · **Must / H**
- **목적** 근거가 붙은 카드를 외부로 내보낸다. **한 번 나가면 회수할 수 없으므로 근거 검증이 가장 엄격한 지점**이다.

### 🔗 References
- 계약 **`SPEC-004`** · **`SPEC-008`**
- `REQ-FUNC-012` · `REQ-NF-003`(p95 ≤ 3,000ms) · §4.5.1
- `MOCK-005` · 소비 `CLI-C`(FR-070) · `UX-D`

### ✅ Task Breakdown
- [ ] `POST /v1/share-cards` 구현 — `SPEC-004` 계약 준수
- [ ] **근거 4항목 누락 시 `400`** — §8.1 명시
- [ ] 이미지 URL + 딥링크 생성
- [ ] 후보 id ↔ `SRC-D` 응답 연결 검증 (§8.1.1 상호 관계)
- [ ] 이미지 생성 실패 처리 (`SPEC-004` 확정 결과)
- [ ] 카드 유효기간 **(미정)**

### 🧪 Acceptance Criteria

**Scenario 1 · 정상**
- **Given** 근거 4항목 완비 후보 id와 조건 요약
- **When** 호출함
- **Then** `200`과 이미지 URL·딥링크가 반환되고 **p95 ≤ 3,000ms**다

**Scenario 2 · 예외 (§4.5.3) — 이미지 생성 실패**
- **Given** 카드 이미지 생성이 실패함
- **When** 호출함
- **Then** **(미정 — 확정 필요)** 딥링크만 반환인지 전체 실패인지

**Scenario 3 · 경계 — 유효하지 않은 후보 id**
- **Given** `SRC-D` 응답에 없던 후보 id
- **When** 호출함
- **Then** **(제안)** `400`. 임의 id로 카드를 만들 수 없어야 한다

**Scenario 4 · 근거 무결성 — 이 태스크의 핵심**
- **Given** 근거 4항목 중 **확인 주체가 누락**된 후보 id
- **When** 호출함
- **Then** **`400`이 반환되고 카드가 생성되지 않는다.** 근거 없는 카드는 외부로 나가지 않는다

### ⚙️ Technical & Non-Functional Constraints
- **§8.1** 근거 4항목 누락 시 **`400`** · p95 **≤ 3,000ms**
- **§4.5.1** 근거 무결성이 생성의 전제
- **외부 유통** — 회수 불가. 검증 실패 시 생성하지 않는 것이 유일한 방어
- `EVD-B`의 판정형 차단을 통과한 문장만 카드에 실린다

### 🏁 DoD
공통 DoD 5개. 추가로 —
- [ ] 4항목 각각의 누락 케이스에서 `400`이 반환되는가? (`MOCK-003` 4종)
- [ ] 카드에 실린 문장이 판정형 검증을 통과했는가?
- [ ] 이미지 생성 실패 동작이 확정되었는가?

### 🚧 Dependencies & Blockers
- **Depends on** `SPEC-004` (#97) `SPEC-008` (#101) `EVD-A` (#120) `EVD-B` (#121)
- **Blocks** `CLI-C` (#137)(FR-070)
- **미정 — 확정 필요** 이미지 생성 실패 시 동작 · 카드 유효기간

### 공통 DoD — 웨이브 `P2b-evidence` 전체

- [ ] **`SPEC-008` 4항목 정의를 재정의하지 않고 참조만** 했는가?
- [ ] **판정형 문구가 0건**인가? (§8.3 규칙 3 · `UX-C` 라이팅 가이드)
- [ ] 확인 일자·주체가 없는 정보가 외부로 나가지 않는가?
- [ ] `MOCK-003`·`MOCK-004`의 누락·상태 케이스로 검증했는가?
- [ ] SRS 수치를 반올림·요약 없이 옮겼는가?

