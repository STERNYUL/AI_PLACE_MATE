# RSV-C · PG 결제 승인 연동

> **웨이브** `P2d-reservation-privacy` · **라벨** `feature, command, backend, payment-service, priority:high, phase-1-late, external`
> **원본** [`docs/issues-aiplace/P2d-reservation-privacy.md`](../P2d-reservation-privacy.md#rsv-c)
> **원장** `TASKS-ai-place-v1.0.md` (TASKS-AIPLACE-MVP-001 v1.1 · 50건) · **SRS** `SRS-ai-place-v1.0.md` (SRS-AIPLACE-MVP-001 v1.9)

**원문** `FR-031`

### 🎯 Summary
- **Task ID** `RSV-C` · **Must / H**
- **목적** **외부 계약이 선행**인 유일한 태스크. 후행 8건이 대기하고 일정이 자사 통제 밖이다.

### 🔗 References
- 계약 **`SPEC-007`** · `REQ-FUNC-016` · **`REQ-NF-016`(카드 정보 비보관)** · §3.1.1 · §8.1
- 선행 `IN-B`(TLS · AES-256) · `MOCK-007`
- 원장 §0.4 — **PCI-DSS 준수 PG 위탁**, 자체 구축하지 않는다

### ✅ Task Breakdown
- [ ] **PG사 선정** — **외부 계약 (미정)**
- [ ] 승인 연동 구현 — `SPEC-007` 계약 준수
- [ ] **거래 토큰만 저장** — 카드 정보 비보관 (`REQ-NF-016`)
- [ ] 예약 id ↔ 거래 토큰 매핑
- [ ] PG 장애 시 예약 상태 처리 (`SPEC-007` 확정 결과)
- [ ] 저장 암호화 연동 (`IN-B` AES-256 · `REQ-NF-017`)

### ⚠️ 이 태스크의 절반은 지금 확정할 수 없다

`SPEC-007`이 구분한 그대로다.

| 확정 가능 (지금) | 확정 불가 (PG 선정 후) |
| --- | --- |
| 카드 정보 비보관 원칙 | 실제 API 형식·필드명 |
| 거래 토큰만 저장 | 토큰 형식·수명 |
| 환불 ≤ 24h 요구 | PG의 실제 환불 SLA |
| 오류율 ≤ 0.1% 측정 방법 | PG 측 오류 코드 체계 |

**`MOCK-007`이 이 불확실성을 흡수한다** — `CLI-D`·`UX-E`는 PG 계약을 기다리지 않는다.

### 🧪 Acceptance Criteria

**Scenario 1 · 정상 — 승인**
- **Given** 산출된 금액과 예약 id
- **When** 승인을 요청함
- **Then** 거래 토큰이 반환되고 **카드 정보가 우리 저장소에 남지 않는다**

**Scenario 2 · 예외 (§4.5.3) — PG 장애**
- **Given** PG가 응답하지 않음
- **When** 승인을 요청함
- **Then** **(미정 — 확정 필요)** 예약을 어느 상태에 두는지 SRS에 없다

**Scenario 3 · 경계 — 승인 중 타임아웃**
- **Given** 승인 요청 후 응답이 유실됨
- **When** 재시도함
- **Then** **(미정)** 중복 승인 방지 장치가 필요하다. 멱등키 규약이 `SPEC-007`에 없다

**Scenario 4 · 근거 무결성 — 카드 정보 비보관 검증**
- **Given** 결제 전 과정
- **When** 저장소·로그·이벤트를 전수 점검함
- **Then** **카드 정보가 어디에도 없다.** 이것이 이 태스크의 불변 규칙이다

### ⚙️ Technical & Non-Functional Constraints
- **`REQ-NF-016`** 카드 정보 **비보관**, 거래 토큰만
- **`REQ-NF-017`** 결제·정산 데이터 저장 암호화 **AES-256**
- **`REQ-NF-008`** 오류율 ≤ 0.1%
- **PCI-DSS 준수 PG 위탁** — 자체 구축 금지
- **외부 계약 선행** — 일정이 자사 통제 밖 (원장 §6)

### 🏁 DoD
공통 DoD 5개. 추가로 —
- [ ] **카드 정보 비보관이 전수 점검으로 확인되었는가?**
- [ ] PG 장애·타임아웃 시 동작이 확정되었는가?
- [ ] 중복 승인 방지 장치가 있는가?

### 🚧 Dependencies & Blockers
- **Depends on** `SPEC-007` `RSV-A` `IN-B`
- **Blocks** `RSV-B` `RSV-D` `CLI-D` — **후행 8건**
- **미정 — 확정 필요**
  - **PG사 선정** — 사업 계약. 이 태스크의 절반
  - PG 장애 시 예약 상태 · **중복 승인 방지(멱등키)** — 신규 발견

### 공통 DoD — 웨이브 `P2d-reservation-privacy` 전체

- [ ] **카드 정보가 어느 경로로도 저장되지 않는가?** (`REQ-NF-016`)
- [ ] 상태 전이가 §8.2 · §8.6.3과 일치하는가?
- [ ] 개인정보가 로그·이벤트에 평문으로 남지 않는가?
- [ ] `MOCK-007`로 PG 미선정 상태에서도 검증했는가?
- [ ] SRS 수치를 반올림·요약 없이 옮겼는가?

