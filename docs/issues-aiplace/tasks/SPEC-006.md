# SPEC-006 · `POST /v1/proposals` 계약

> **웨이브** `P1a-contracts` · **라벨** `spec, contract, backend, agent-room, priority:medium, phase-2`
> **원본** [`docs/issues-aiplace/P1a-contracts.md`](../P1a-contracts.md#spec-006)
> **원장** `TASKS-ai-place-v1.0.md` (TASKS-AIPLACE-MVP-001 v1.1 · 50건) · **SRS** `SRS-ai-place-v1.0.md` (SRS-AIPLACE-MVP-001 v1.9)

### 🎯 Summary
- **Task ID** `SPEC-006` · **Epic** Contract · **Should / M**
- **목적** 제안 등록 계약. **가격 협상 필드가 없다는 사실**이 계약으로 고정되는 지점이다.
- **⚠️ Phase 2 조건부**

### 🔗 References
- SRS §8.1.1 `POST /v1/proposals` 행 · §8.1 "등록 속성으로 뒷받침되지 않는 문구는 400 반환. 가격 협상 필드 없음"
- `REQ-FUNC-023` 제안 등록 · `REQ-FUNC-021` 근거 없는 문구 차단 · §4.5.1 · §8.3 규칙 7

### ✅ Task Breakdown
- [ ] 요청 DTO — room id · headline · highlights · services
- [ ] **가격 필드 부재** 명시 — 계약에 "없음"을 적는다
- [ ] **등록 속성 미참조 문구 `400`** 규격 — `Attribute` 참조 검증 기준
- [ ] 마감 180초 이후 등록 시 동작 **(미정)**
- [ ] room id 필수 검증 (§8.1.1 상호 관계)

### 가격 필드 부재를 계약에 적는 이유

SRS §8.1이 *"가격 협상 필드 없음"* 을 인터페이스 규격에 **명시적으로** 적었다.
이것은 누락이 아니라 **설계 의도**다 — `REQ-FUNC-024`가 적합도 1순위 정렬을 요구하고 §8.3 규칙 6이 가격을 정렬 키에서 제외한다.

**계약에 "이 필드는 없다"를 적어두지 않으면 나중에 누군가 추가한다.**

### 🧪 Acceptance Criteria

**Scenario 1 · 정상**
- **Given** 유효한 room id와 등록 속성으로 뒷받침되는 headline·highlights·services
- **When** 마감 **180초 이내**에 등록함
- **Then** `200`이 반환되고 제안이 등록된다

**Scenario 2 · 예외 (§4.5.3) — 마감 후 등록**
- **Given** `expiresAt`이 경과한 room id
- **When** 등록함
- **Then** **(미정 — 확정 필요)** 거부 코드가 SRS에 없다. 서버 시각 기준 판정은 §3.1.4가 규정

**Scenario 3 · 경계 — 존재하지 않는 room id**
- **Given** 발급되지 않은 room id
- **When** 등록함
- **Then** **(제안)** `400`

**Scenario 4 · 근거 무결성 — 이 태스크의 핵심**
- **Given** 매장 `Attribute`에 등록되지 않은 표현이 포함된 headline
- **When** 등록함
- **Then** **`400`이 반환되고 제안이 저장되지 않는다** (§8.1, `REQ-FUNC-021`, §8.3 규칙 7)

### ⚙️ Technical & Non-Functional Constraints
- **§8.1.1** 비동기 · 마감 **180s 이내** · 등록 속성 미참조 문구 **`400`** · **가격 필드 없음**
- **§8.3 규칙 6** 가격은 정렬 키가 아니다
- **§3.1.4** 마감 판정은 서버 시각 기준

### 🏁 DoD
공통 DoD 5개. 추가로 —
- [ ] 가격 필드 부재가 계약에 **명시적으로** 적혔는가?
- [ ] `Attribute` 참조 검증 기준이 `MCH-A`(FR-040)과 일치하는가?

### 🚧 Dependencies & Blockers
- **Depends on** `SPEC-001` · `SPEC-005`(room id)
- **Blocks** `AGT-C`(FR-044) · `MOCK-006`
- **⚠️ Phase 게이트** Phase 2 조건부
- **미정 — 확정 필요** 마감 후 등록 시 거부 코드

### 공통 DoD — 웨이브 `P1a-contracts` 전체

- [ ] 계약이 `docs/api-aiplace.yaml`(OpenAPI)에 반영되었는가?
- [ ] 소비 측(구현·Mock·클라이언트) 담당자가 검토하고 동의했는가?
- [ ] **(미정)** 항목이 전부 해소되었거나 확정 담당자·기한이 지정되었는가?
- [ ] 계약 변경 절차(승인자·통보 대상)가 정해졌는가?
- [ ] SRS §8.1.1의 수치를 **반올림·요약 없이** 그대로 옮겼는가?

