# RSV-B · 결제 금액 산출 및 확정 통보

> **웨이브** `P2d-reservation-privacy` · **라벨** `feature, backend, payment-service, priority:high, phase-1-late`
> **원본** [`docs/issues-aiplace/P2d-reservation-privacy.md`](../P2d-reservation-privacy.md#rsv-b)
> **원장** `TASKS-ai-place-v1.0.md` (TASKS-AIPLACE-MVP-001 v1.1 · 50건) · **SRS** `SRS-ai-place-v1.0.md` (SRS-AIPLACE-MVP-001 v1.9)

**원문** `FR-030` `FR-032` `FR-036`

### 🎯 Summary
- **Task ID** `RSV-B` · **Must / M (M×2+L×1)**
- **목적** 주문량으로 금액을 정하고 매장에 알린다. **결제 오류율 0.1% 계측이 여기 붙는다.**

### 🔗 References
- `REQ-FUNC-016`(주문량 기반 결제 · 확정 통보 ≤30s) · `REQ-NF-008`(오류율 ≤0.1% 분리 계측)
- §4.5.5 · §6.3 · 계약 `SPEC-001`(오류율 분모·분자) · `SPEC-007`

### ✅ Task Breakdown
- [ ] **`FR-030`** 주문량 기반 결제 금액 산출
- [ ] **`FR-032`** 매장 확정 통보 **(≤30s)**
- [ ] **`FR-036`** 결제 API 오류율 **분리 계측** (`IN-C` 연동)
- [ ] 통보 실패 시 재시도 (§4.5.3)
- [ ] 금액 산출과 `PriceProfile` 표기의 편차 기록 (`TRK-E` FR-055)

### 🧪 Acceptance Criteria

**Scenario 1 · 정상 — 금액 산출 및 통보**
- **Given** 승계된 메뉴 구성과 인원
- **When** 금액을 산출하고 결제가 승인됨
- **Then** 매장에 **30초 이내** 확정이 통보된다

**Scenario 2 · 예외 (§4.5.3) — 통보 실패**
- **Given** 매장 통보 채널이 응답하지 않음
- **When** 통보를 시도함
- **Then** **(미정 — 확정 필요)** 재시도 정책과, 통보 실패한 예약의 상태가 SRS에 없다. **결제는 됐는데 매장이 모르는 상태**가 된다

**Scenario 3 · 경계 — 30초 경계**
- **Given** 결제 승인 시각
- **When** 통보 완료 시각을 측정함
- **Then** **30초 이내**다 (`REQ-FUNC-016`)

**Scenario 4 · 근거 무결성 — 오류율 분리**
- **Given** 결제 API 호출 1,000건 중 `5xx` 1건
- **When** `REQ-NF-008` 오류율을 산정함
- **Then** **0.1%** 로 계산되고 **다른 API 오류와 섞이지 않는다** (분리 계측)

### ⚙️ Technical & Non-Functional Constraints
- **`REQ-FUNC-016`** 확정 통보 **≤ 30s**
- **`REQ-NF-008`** 결제 API 오류율 **≤ 0.1%** · **분리 계측**
- 통보 실패는 **매장 신뢰 문제**다 — 결제만 되고 준비가 안 되면 방문 시 사고

### 🏁 DoD
공통 DoD 5개. 추가로 —
- [ ] 30초 통보가 실측되는가?
- [ ] **통보 실패 시 예약 상태가 확정되었는가?**
- [ ] 오류율이 다른 API와 분리되어 계측되는가?

### 🚧 Dependencies & Blockers
- **Depends on** `RSV-A` `RSV-C` `IN-C`
- **Blocks** `RSV-D` `CLI-D`
- **미정 — 확정 필요** **매장 통보 실패 시 예약 상태** — 신규 발견

### 공통 DoD — 웨이브 `P2d-reservation-privacy` 전체

- [ ] **카드 정보가 어느 경로로도 저장되지 않는가?** (`REQ-NF-016`)
- [ ] 상태 전이가 §8.2 · §8.6.3과 일치하는가?
- [ ] 개인정보가 로그·이벤트에 평문으로 남지 않는가?
- [ ] `MOCK-007`로 PG 미선정 상태에서도 검증했는가?
- [ ] SRS 수치를 반올림·요약 없이 옮겼는가?

