# SPEC-009 · 계측 이벤트 스키마

> **웨이브** `P1a-contracts` · **라벨** `spec, contract, backend, tracking-service, priority:high, phase-0`
> **원본** [`docs/issues-aiplace/P1a-contracts.md`](../P1a-contracts.md#spec-009)
> **원장** `TASKS-ai-place-v1.0.md` (TASKS-AIPLACE-MVP-001 v1.1 · 50건) · **SRS** `SRS-ai-place-v1.0.md` (SRS-AIPLACE-MVP-001 v1.9)

### 🎯 Summary
- **Task ID** `SPEC-009` · **Epic** Contract · **Must / H**
- **목적** 이벤트 22종과 공통 속성 4개를 확정한다. **`TRK-A`(FR-049)를 대체**하며, 미가동 시 모든 KPI 판정이 불가능하다.

### 🔗 References
- SRS §6.1.1 이벤트 정의 — "모든 이벤트는 `session_id`, `anon_user_id`, `occurred_at`, `schema_version`을 공통 속성으로 갖는다"
- §6.1.2 KPI 산출식 · §6.1.3 세션·결측·`schema_version` · §6.1.4 Phase 0 산출물
- `REQ-NF-030` KPI · 원장 `TRK-B`(FR-050 · 수집 파이프라인)

### ⚠️ `TRK-A`(FR-049) 대체 — 원장 수정이 따라온다

평가서 §1이 지시한 대로 **`TRK-A`(FR-049 · 이벤트 스키마 정의 22종)를 이 태스크로 이관**한다.
같은 일을 두 ID로 관리하면 어느 쪽이 정본인지 갈린다.

**원장 수정 필요** — `TASKS-ai-place-v1.0.md`에서 `TRK-A`(FR-049) 행을 제거하고,
`TRK-B`(FR-050)·`TRK-B`(FR-053)·`CLI-E`(FR-079)의 선행을 `TRK-A`(FR-049) → `SPEC-009`로 교체한다. **이 문서 확정과 함께 처리한다.**

### ✅ Task Breakdown
- [ ] 이벤트 **22종** 목록 확정 — §6.1.1에서 그대로
- [ ] 공통 속성 **4개** 확정 — `session_id` · `anon_user_id` · `occurred_at` · `schema_version`
- [ ] 이벤트별 고유 속성 확정
- [ ] `schema_version` 부여·증가 규칙 (§6.1.3)
- [ ] 세션 정의 · 중복 제거 기준 (§6.1.3) — `TRK-B`(FR-051)과 계약 공유
- [ ] 제외 트래픽 규칙 (§6.1.3)
- [ ] KPI 산출식 12건이 요구하는 속성 역산 검증 (§6.1.2)

### 22종을 KPI에서 역산해야 하는 이유

§6.1.2는 KPI 산출식 12건(북극성 WEBD + 보조 1~11)을 규정한다.
**이벤트 스키마가 KPI 산출에 필요한 속성을 담지 못하면, 파이프라인을 다 만들고 나서 KPI를 못 뽑는다.**

계약 단계에서 **12개 산출식 → 필요 속성 → 22종 이벤트** 순으로 역산 검증해야 한다.
이것이 이 태스크가 `TRK-B`(FR-050 · 파이프라인)보다 먼저 오는 이유다.

### 🧪 Acceptance Criteria

**Scenario 1 · 정상 — 공통 속성 완비**
- **Given** 22종 중 임의의 이벤트
- **When** 스키마를 검증함
- **Then** `session_id` · `anon_user_id` · `occurred_at` · `schema_version` **4개가 모두** 있다

**Scenario 2 · 예외 (§4.5.3) — 결측 발생**
- **Given** 공통 속성 중 하나가 누락된 이벤트가 유입됨
- **When** 수집 파이프라인이 처리함
- **Then** 결측으로 기록되고, **누락률 5% 초과 시 해당 지표는 미공표**된다 (§6.1.3)

**Scenario 3 · 경계 — `schema_version` 전환**
- **Given** 스키마가 변경되어 `schema_version`이 증가함
- **When** 시계열을 조회함
- **Then** **버전별로 분리**되어 집계된다 (§6.1.3)

**Scenario 4 · 근거 무결성 — KPI 역산**
- **Given** §6.1.2의 KPI 산출식 12건
- **When** 각 식이 요구하는 속성을 22종 스키마에서 찾음
- **Then** **12건 모두 필요한 속성을 찾을 수 있다.** 하나라도 없으면 스키마를 보강한다

### ⚙️ Technical & Non-Functional Constraints
- **§6.1.4** Phase 0 산출물 — **기준선 실측 전환의 전제**
- **§6.1.3** 누락률 **5% 초과 시 미공표** · `schema_version` 시계열 분리
- **`REQ-NF-030`** KPI 요구사항
- 원장 §4 순위 4 — *"미가동 시 모든 KPI 판정 불가"*

### 🏁 DoD
공통 DoD 5개. 추가로 —
- [ ] **KPI 12건 역산 검증이 통과했는가?**
- [ ] `TRK-A`(FR-049)가 원장에서 제거되고 후행 선행 관계가 `SPEC-009`로 교체되었는가?
- [ ] 22종 목록이 §6.1.1 원문과 **건수까지** 일치하는가?

### 🚧 Dependencies & Blockers
- **Depends on** `SPEC-001` · `IDX-A`(FR-001 · 색인 스키마 — 이벤트가 참조하는 엔터티)
- **Blocks** `TRK-B`(FR-050) · `TRK-B`(FR-051) · `TRK-B`(FR-053) · `TRK-C`(FR-054) · `CLI-E`(FR-079) · 전 KPI 태스크
- **원장 수정 필요** `TRK-A`(FR-049) 제거 및 선행 관계 교체

### 공통 DoD — 웨이브 `P1a-contracts` 전체

- [ ] 계약이 `docs/api-aiplace.yaml`(OpenAPI)에 반영되었는가?
- [ ] 소비 측(구현·Mock·클라이언트) 담당자가 검토하고 동의했는가?
- [ ] **(미정)** 항목이 전부 해소되었거나 확정 담당자·기한이 지정되었는가?
- [ ] 계약 변경 절차(승인자·통보 대상)가 정해졌는가?
- [ ] SRS §8.1.1의 수치를 **반올림·요약 없이** 그대로 옮겼는가?

