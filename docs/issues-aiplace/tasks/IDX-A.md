# IDX-A · 색인 스키마 및 데이터 모델

> **웨이브** `P1b-data` · **라벨** `db, backend, index-service, priority:high, phase-0, blocks-many`
> **원본** [`docs/issues-aiplace/P1b-data.md`](../P1b-data.md#idx-a)
> **원장** `TASKS-ai-place-v1.0.md` (TASKS-AIPLACE-MVP-001 v1.1 · 50건) · **SRS** `SRS-ai-place-v1.0.md` (SRS-AIPLACE-MVP-001 v1.9)

**원문** `FR-001` `FR-005` `FR-006` `FR-010`

### 🎯 Summary
- **Task ID** `IDX-A` · **Epic** Index Service · **Must / H (H×1+M×3)**
- **목적** **후행 12건이 대기하는 최상위 선행.** 사후 변경 비용이 전면 재색인이라 되돌릴 수 없다.

### 🔗 References
- SRS §8.2 데이터 모델 · §8.4 · §8.6.3 정합성 제약 · §3.1.6 · §9.2
- `REQ-FUNC-001`(색인) · `REQ-FUNC-002`(인당가 범위) · `REQ-FUNC-004`(조건 카테고리) · `REQ-NF-024`(필드 사전 확보)
- **ADR-001** — 사후 스키마 변경 = 전면 재색인
- 공유 계약 `SPEC-001`

### ✅ Task Breakdown
- [ ] **`FR-001`** 공통 색인 스키마 — `place` · `dish` · `attribute` · `price_profile` · `verification`
- [ ] **`FR-005`** `PriceProfile` — 하한 / 평균 / 상한 및 조건 태그
- [ ] **`FR-006`** `Attribute.scope` 구현 + **성분(F1a)·접근성(F1b) 필드 사전 확보** (`REQ-NF-024`)
- [ ] **`FR-010`** 조건 카테고리 사전 — 상권별 운영 조건 어휘
- [ ] `Proposal` 참조 계약 고정 — 아래 참조
- [ ] 마이그레이션 스크립트 + 롤백 검증

### `Proposal` 참조 계약을 여기서 고정하는 이유

원장 v1.0 ‡ 주석이 경고한 항목이다. §8.6.3은 `Reservation.proposalId`가 `Proposal`을 참조하도록 규정하지만,
§4.3.1과 **ADR-005**는 예약·결제(F9)를 제안(F7)보다 **먼저** 배치한다 — *"선결제 없이 제안을 열면 첫 노쇼에서 가맹점이 이탈"* 하기 때문이다.

**따라서 `RSV-A`(FR-029)는 `Proposal` 스키마 계약만 확정된 상태에서 착수하고, 실제 참조 연결은 `AGT-C`(FR-044) 완료 시점에 결선된다.**
**이 계약을 여기서 고정하지 않으면 Phase 2에서 예약 도메인을 다시 손대게 된다.**

### 🧪 Acceptance Criteria

**Scenario 1 · 정상 — 5개 엔터티 정의**
- **Given** §8.2의 데이터 모델 정의
- **When** 스키마를 생성하고 마이그레이션을 실행함
- **Then** `place` · `dish` · `attribute` · `price_profile` · `verification` 5개가 §8.6.3 정합성 제약과 함께 생성된다

**Scenario 2 · 예외 — 마이그레이션 롤백**
- **Given** 마이그레이션 중 오류 발생
- **When** 롤백을 실행함
- **Then** 이전 상태로 완전히 복원되고 **부분 적용이 남지 않는다**

**Scenario 3 · 경계 — `PriceProfile` 하한 = 상한**
- **Given** 단일 가격만 확인된 메뉴 (하한 = 평균 = 상한)
- **When** 저장하고 조회함
- **Then** `REQ-FUNC-002`의 인당가 **범위** 표기가 성립한다. 단일값 표기 방식 **(미정 — 확정 필요)**

**Scenario 4 · 근거 무결성 — `Attribute` 참조 가능성**
- **Given** 근거 속성이 될 `attribute` 레코드
- **When** `EVD-A`(FR-021)가 근거 4항목을 검증함
- **Then** **`attribute`를 참조해 근거 속성을 확인할 수 있다.** 참조 불가면 근거 4항목이 성립하지 않는다

### ⚙️ Technical & Non-Functional Constraints
- **ADR-001** 사후 스키마 변경 = **전면 재색인**. 되돌리기 비용 최대
- **`REQ-NF-024`** 성분·접근성은 **v0.1에서 필드만 사전 확보** — 데이터 적재는 하지 않는다 (§0.4 제외)
- **§8.6.3** 정합성 제약을 스키마 수준에서 강제
- 후행 12건이 이 스키마의 필드명을 인용한다

### 🏁 DoD
공통 DoD 5개. 추가로 —
- [ ] `Proposal` 참조 계약이 고정되고 `RSV-A` 담당자가 동의했는가?
- [ ] 성분·접근성 필드가 **적재 없이 정의만** 되었는가?
- [ ] `PriceProfile` 단일값 표기가 확정되었는가?

### 🚧 Dependencies & Blockers
- **Depends on** `IN-A` (#168)(IN-001)
- **Blocks** `IDX-B` (#104) `IDX-C` (#105) `IDX-D` (#106) `SRC-B` (#117) `RSV-A` (#129) `TRK-A` (#124) `PRV-A` (#133) — **후행 12건**
- **미정 — 확정 필요** `PriceProfile` 단일값 표기 · 조건 카테고리 어휘의 상권별 관리 주체

### 공통 DoD — 웨이브 `P1b-data` 전체

- [ ] **마이그레이션 스크립트**가 작성되고 롤백이 검증되었는가?
- [ ] 스키마 변경이 ADR-001의 재색인 비용 경고와 상충하지 않는가?
- [ ] `SPEC-001` 공통 규약(단위·오류 형식)을 준수하는가?
- [ ] SRS 수치를 반올림·요약 없이 옮겼는가?
- [ ] 후행 태스크 담당자가 스키마 계약을 검토했는가?

