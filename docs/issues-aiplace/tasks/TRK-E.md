# TRK-E · 비용 및 단위 경제 지표

> **웨이브** `P2c-tracking` · **라벨** `feature, backend, tracking-service, priority:medium, phase-1`
> **원본** [`docs/issues-aiplace/P2c-tracking.md`](../P2c-tracking.md#trk-e)
> **원장** `TASKS-ai-place-v1.0.md` (TASKS-AIPLACE-MVP-001 v1.1 · 50건) · **SRS** `[SRS]ai-place -mate-SRSv1.0.md` (SRS-AIPLACE-MVP-001 v1.9)

**원문** `FR-055` `FR-056` `FR-081` `FR-082`

### 🎯 Summary
- **Task ID** `TRK-E` · **Should / M (M×4)**
- **목적** **사업이 성립하는가**를 재는 지표들. 기술 지표가 정상이어도 여기가 무너지면 사업이 실패한다.

### 🔗 References
- `REQ-FUNC-005`(결제액 피드백) · `REQ-NF-019`(추론 비용 12원) · `REQ-NF-021`(단위 경제) · `REQ-NF-022`(심사 FTE) · **R7**
- §4.5.5 · §6.3 · §8.5.4
- 선행 `TRK-B` `TRK-C` `IDX-A`

### ⚠️ `FR-082`에 Phase 모순이 있다 (원장 ¶)

| 항목 | 값 |
| --- | --- |
| `FR-082` 심사 FTE 비율 집계 | **Phase 1** |
| 선행 `FR-037` 매장 프로필 등록 | **Phase 2** (`MCH-A`) |

**Phase 2가 이월되면 `FR-082`는 Phase 1에서 착수할 수 없다.**

그런데 더 깊은 문제가 있다 — **가맹 150곳 온보딩이 Phase 1인데 매장 프로필 등록이 Phase 2**라는 배분 자체가 이상하다.
원장 v1.1은 이 사실을 표기만 하고 `TRK-E`의 선행에서 `MCH-A`를 제외했다. **PM 확정 필요.**

### ✅ Task Breakdown
- [ ] **`FR-055`** 결제액 피드백 반영 — 편차 기록 및 다음 표기 반영
- [ ] **`FR-056`** 세션당 추론 비용 집계 — **12원 상한** (`REQ-NF-019`)
- [ ] **`FR-081`** 단위 경제 — 성사 건당 **수수료 대 처리 비용 배수**
- [ ] **`FR-082`** 심사 FTE 비율 월간 집계 + **온보딩 속도 조절 경보** — **Phase 모순 확인 후**
- [ ] 12원 상한 초과 시 경보 (`IN-C` 연동)
- [ ] 결제액 편차의 `PriceProfile` 반영 경로 (`IDX-A`)

### 결제액 피드백이 가격 정확도를 개선한다

`REQ-FUNC-005`는 실제 결제액과 표기 인당가의 **편차를 기록하고 다음 표기에 반영**하라고 규정한다.
이것이 `IDX-A`의 `PriceProfile`을 실측으로 수렴시키는 유일한 경로다.

**초기 `PriceProfile`은 추정값이다.** 이 피드백 루프가 없으면 표기가 영원히 추정에 머문다.

### 🧪 Acceptance Criteria

**Scenario 1 · 정상 — 결제액 피드백**
- **Given** 표기 인당가와 실제 결제액
- **When** 편차를 기록함
- **Then** 편차가 저장되고 다음 `PriceProfile` 표기에 반영된다

**Scenario 2 · 예외 (§4.5.3) — 추론 비용 상한 초과**
- **Given** 세션당 추론 비용이 12원을 넘음
- **When** 집계함
- **Then** **경보가 발생한다.** 상한 초과 시 서비스 동작 자체를 막는지는 **(미정)**

**Scenario 3 · 경계 — 단위 경제 배수**
- **Given** 성사 건당 수수료와 처리 비용
- **When** 배수를 산출함
- **Then** `REQ-NF-021`의 목표 배수와 대비된다

**Scenario 4 · 근거 무결성 — 심사 FTE 원천**
- **Given** 매장 심사 건수와 투입 공수
- **When** 월간 집계함
- **Then** **(미정)** `MCH-A`가 Phase 2면 Phase 1에 심사 데이터가 없다. 원장 ¶ 참조

### ⚙️ Technical & Non-Functional Constraints
- **`REQ-NF-019`** 세션당 추론 비용 **12원 상한** — `SRC-A` 파싱과 `EVD-B` 문장 생성이 주요 소비처
- **`REQ-NF-021`** 단위 경제 — 수수료 대 처리 비용 배수
- **`REQ-NF-022` · R7** 심사 FTE 비율 — 온보딩 속도 조절 근거
- **`REQ-FUNC-005`** 편차 기록 및 다음 표기 반영

### 🏁 DoD
공통 DoD 5개. 추가로 —
- [ ] **`FR-082` Phase 모순이 확정되었는가?**
- [ ] 12원 상한 초과 시 동작이 확정되었는가?
- [ ] 결제액 편차가 실제로 `PriceProfile`에 반영되는가?

### 🚧 Dependencies & Blockers
- **Depends on** `TRK-B` (#125) `TRK-C` (#126) `IDX-A` (#103)
- **Blocks** 사업 판단 리포트
- **미정 — 확정 필요**
  - **`FR-082` Phase 모순** — PM (원장 부록 C 1번)
  - 추론 비용 12원 초과 시 서비스 동작
  - 심사 FTE 데이터 원천 (Phase 1에 존재하는가)

### 공통 DoD — 웨이브 `P2c-tracking` 전체

- [ ] §6.1.1의 이벤트 정의와 **건수까지** 일치하는가?
- [ ] 공통 속성 4개(`session_id` `anon_user_id` `occurred_at` `schema_version`)가 전 이벤트에 있는가?
- [ ] **누락률 5% 초과 시 미공표** 규칙이 적용되는가? (§6.1.3)
- [ ] KPI 산출식이 §6.1.2 원문과 일치하는가?
- [ ] 개인정보가 이벤트에 평문으로 실리지 않는가? (`PRV-A` 연계)

