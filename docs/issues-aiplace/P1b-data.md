# P1b · 데이터 기반 — `IDX-A` ~ `IDX-E`

**웨이브:** 제작 순서 2번 · **Phase 0~1**
**템플릿:** `.github/ISSUE_TEMPLATE/aiplace_feature_task.md`
**근거:** `[SRS]ai-place -mate-SRSv1.0.md` (SRS-AIPLACE-MVP-001 v1.9)
**원장:** `TASKS-ai-place-v1.0.md` v1.1 · 50건
**공유 계약:** [`P1a-contracts.md`](P1a-contracts.md) — `SPEC-001` · `SPEC-003`

> **ID 표기** — `IDX-A`(FR-001 · 005 · 006 · 010) 형식. 괄호 안이 원장 v1.0 원문 태스크 ID다.

## 수록 이슈 5건

| 이슈 | 원문 | Feature | 복잡도 | Phase |
| --- | --- | --- | --- | --- |
| `IDX-A` | FR-001 · 005 · 006 · 010 | 색인 스키마 + PriceProfile + Attribute.scope + 조건 카테고리 | H (H×1+M×3) | 0 |
| `IDX-B` | FR-002 | `canonical_key` 정규화 규칙·사전 | H | 0 |
| `IDX-C` | FR-003 · 004 | 색인 파이프라인 + 초기 300건 적재 | H (H×1+M×1) | 0 |
| `IDX-D` | FR-007 | `Verification` 엔터티·상태 전이 | H | 1 |
| `IDX-E` | FR-008 · 009 | dishes 조회 API + 캐시·계측 | M (M×2) | 1 |

## 공통 DoD — 5건 전체

- [ ] **마이그레이션 스크립트**가 작성되고 롤백이 검증되었는가?
- [ ] 스키마 변경이 ADR-001의 재색인 비용 경고와 상충하지 않는가?
- [ ] `SPEC-001` 공통 규약(단위·오류 형식)을 준수하는가?
- [ ] SRS 수치를 반올림·요약 없이 옮겼는가?
- [ ] 후행 태스크 담당자가 스키마 계약을 검토했는가?

---
---

## IDX-A · 색인 스키마 및 데이터 모델 {#idx-a}

**labels** `db, backend, index-service, priority:high, phase-0, blocks-many`
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
- **Depends on** `IN-A`(IN-001)
- **Blocks** `IDX-B` `IDX-C` `IDX-D` `SRC-B` `RSV-A` `TRK-A` `PRV-A` — **후행 12건**
- **미정 — 확정 필요** `PriceProfile` 단일값 표기 · 조건 카테고리 어휘의 상권별 관리 주체

---

## IDX-B · `canonical_key` 메뉴명 정규화 {#idx-b}

**labels** `db, backend, index-service, priority:high, phase-0, accuracy-target`
**원문** `FR-002`

### 🎯 Summary
- **Task ID** `IDX-B` · **Epic** Index Service · **Must / H**
- **목적** 서로 다른 표기의 같은 메뉴를 하나로 묶는다. **정확도 92% 목표가 걸려 공수 예측이 가장 어려운 부류**다.

### 🔗 References
- SRS §1.3 정의 · §8.2 · `REQ-FUNC-001`
- 원장 §6 — *"정확도 튜닝: 목표 수치를 만족할 때까지 반복. 공수 예측이 가장 어려운 부류"*

### ✅ Task Breakdown
- [ ] 정규화 규칙 정의 — 표기 변형·띄어쓰기·외래어·수식어 처리
- [ ] 정규화 사전 초기 구축
- [ ] 정확도 측정 방법 확정 **(미정 — 평가셋이 SRS에 없다)**
- [ ] 사전 갱신 절차 — 운영 중 신규 표기 유입 대응
- [ ] `IDX-C` 파이프라인 연동 지점 정의

### ⚠️ 정확도 92%를 판정할 평가셋이 없다

SRS는 목표 수치를 제시하지만 **무엇으로 측정하는지가 없다.**
정답 레이블이 붙은 평가셋 없이는 92%를 주장할 수도 반박할 수도 없다.

**착수와 동시에 평가셋 구축을 시작해야 한다.** 상권 1곳 300건(`IDX-C`)이 그 모집단이 될 수 있다.

### 🧪 Acceptance Criteria

**Scenario 1 · 정상 — 표기 변형 통합**
- **Given** 같은 메뉴의 서로 다른 표기 (예: 띄어쓰기·외래어 표기 차이)
- **When** 정규화를 수행함
- **Then** 동일한 `canonical_key`로 매핑된다

**Scenario 2 · 예외 — 사전 미등재 표기**
- **Given** 정규화 사전에 없는 신규 표기
- **When** 정규화를 시도함
- **Then** **(미정 — 확정 필요)** 원문 보존인지 추정 매핑인지 SRS에 없다. 추정 매핑은 오분류 위험

**Scenario 3 · 경계 — 동음이의 메뉴**
- **Given** 표기는 같지만 실제로 다른 메뉴
- **When** 정규화함
- **Then** **(미정)** 과잉 통합 방지 규칙이 필요하다

**Scenario 4 · 근거 무결성 — 정확도 측정**
- **Given** 정답 레이블이 붙은 평가셋
- **When** 정규화 정확도를 측정함
- **Then** **92% 이상**이다 — **평가셋 구축이 선행 조건**

### ⚙️ Technical & Non-Functional Constraints
- **정확도 92%** — 목표 달성까지 반복이 필요하며 **공수 예측이 어렵다**
- `SRC-C`(FR-016) 메뉴 질의가 이 키에 의존한다 — 정규화가 틀리면 검색이 틀린다
- 사전은 **운영 중에도 갱신**되어야 한다

### 🏁 DoD
공통 DoD 5개. 추가로 —
- [ ] **평가셋이 구축되고 92% 측정이 재현 가능한가?**
- [ ] 사전 미등재·동음이의 처리 규칙이 확정되었는가?
- [ ] 사전 갱신 절차가 운영 문서에 있는가?

### 🚧 Dependencies & Blockers
- **Depends on** `IDX-A`
- **Blocks** `IDX-C` `IDX-E` `SRC-C`
- **미정 — 확정 필요** **정확도 평가셋** (담당: 개발팀 리드 + PM) · 사전 미등재 처리 · 동음이의 방지 규칙

---

## IDX-C · 색인 파이프라인 및 초기 적재 {#idx-c}

**labels** `db, backend, index-service, priority:high, phase-0`
**원문** `FR-003` `FR-004`

### 🎯 Summary
- **Task ID** `IDX-C` · **Epic** Index Service · **Must / H (H×1+M×1)**
- **목적** 데이터를 넣고 갱신하고 다시 넣는 경로를 만든다. **Phase 0 게이트(상권 1곳 300건)의 산출물**이다.

### 🔗 References
- SRS `REQ-FUNC-001` · §4.3.3 · §3.1.6 · §1.5.2 · **R2**
- Phase 0 게이트 — 상권 1곳 · 가맹 20곳

### ✅ Task Breakdown
- [ ] **`FR-003`** 적재 · 갱신 · **재색인** 파이프라인
- [ ] **`FR-004`** 상권 1곳 **300건** 초기 적재 — **필수 필드 5개**
- [ ] 재색인 절차 문서화 — ADR-001의 되돌리기 경로
- [ ] 적재 실패 처리 및 재시도
- [ ] 필수 필드 5개 검증 게이트

### 🧪 Acceptance Criteria

**Scenario 1 · 정상 — 300건 적재**
- **Given** 상권 1곳의 원천 데이터
- **When** 초기 적재를 실행함
- **Then** **300건**이 적재되고 각 건의 **필수 필드 5개**가 채워져 있다

**Scenario 2 · 예외 — 필수 필드 결락**
- **Given** 필수 5개 중 일부가 없는 원천 레코드
- **When** 적재를 시도함
- **Then** **(미정 — 확정 필요)** 거부인지 부분 적재인지. 거부하면 300건을 못 채울 수 있다

**Scenario 3 · 경계 — 재색인**
- **Given** 스키마 변경이 발생함
- **When** 전면 재색인을 실행함
- **Then** 300건이 무손실로 재구성되고 소요 시간이 측정된다 (ADR-001 비용 실측)

**Scenario 4 · 근거 무결성 — 적재 시점 확인 상태**
- **Given** 적재된 레코드
- **When** `IDX-D`(FR-007)가 `Verification`을 부여함
- **Then** **확인 일자·주체가 없는 레코드가 후보로 나가지 않는다**

### ⚙️ Technical & Non-Functional Constraints
- **Phase 0 게이트** — 이 태스크의 산출물이 게이트 판정 대상
- **ADR-001** 재색인 비용을 여기서 **실측**한다 — 이후 스키마 변경 판단의 근거
- 필수 필드 5개는 §3.1.6이 규정

### 🏁 DoD
공통 DoD 5개. 추가로 —
- [ ] 300건이 필수 필드 5개를 모두 채운 상태로 적재되었는가?
- [ ] **재색인 소요 시간이 실측되어 기록되었는가?**
- [ ] 필수 필드 결락 처리가 확정되었는가?

### 🚧 Dependencies & Blockers
- **Depends on** `IDX-A` `IDX-B`
- **Blocks** Phase 0 게이트 판정
- **미정 — 확정 필요** 필수 필드 결락 시 적재 정책

---

## IDX-D · `Verification` 엔터티 및 상태 전이 {#idx-d}

**labels** `db, backend, index-service, priority:high, phase-1, adr-002`
**원문** `FR-007`

### 🎯 Summary
- **Task ID** `IDX-D` · **Epic** Index Service · **Must / H**
- **목적** **근거 4항목 중 두 개(확인 일자·확인 주체)의 원천.** 없으면 `EVD-A`가 성립하지 않는다.

### 🔗 References
- SRS §8.2 상태 전이 · §8.6.3 정합성 제약 · **ADR-002**
- `REQ-FUNC-011`(90일 신선도) · `REQ-FUNC-013`(불일치 신고) · `REQ-NF-011`(경고 누락률 0%)
- 공유 계약 **`SPEC-008`(근거 4항목)**

### 상태 전이 — §8.2 원문

```
[*] --> VERIFIED          : 최초 확인 등록
VERIFIED --> STALE        : verified_at + 90일 경과
VERIFIED/STALE --> RECHECK_REQUIRED : 불일치 신고 수신 (REQ-FUNC-013)
```

### ✅ Task Breakdown
- [ ] `Verification` **독립 엔터티** 구현 (ADR-002)
- [ ] 3상태 정의 및 전이 규칙
- [ ] `verified_at + 90일` 경과 판정 — 배치인지 조회 시점 계산인지 확정
- [ ] 불일치 신고 수신 시 `RECHECK_REQUIRED` 전이 (≤60s, `EVD-D`와 연동)
- [ ] 확인 주체 필드 정의
- [ ] `SPEC-008`의 `STALE` 유효성 판정 반영

### ⚠️ `STALE` 후보의 유효성이 `SPEC-008`에서 미정이다

`REQ-FUNC-011`은 90일 초과 시 **경고 병기**만 규정하고, §8.1은 *"근거 없는 후보 반환 금지"* 다.
**`STALE`이 "근거 없음"인지 "근거 있으나 오래됨"인지 SRS가 구분하지 않는다.**

이 태스크는 **상태를 만들 뿐 그 해석은 `SPEC-008`이 정한다.** 확정 전에는 후행 `EVD-A`·`SRC-D`가 판정 불가다.

### 🧪 Acceptance Criteria

**Scenario 1 · 정상 — 최초 확인 등록**
- **Given** 신규 확인 정보 (일자 + 주체)
- **When** 등록함
- **Then** `VERIFIED` 상태로 생성되고 근거 4항목 중 2개가 채워진다

**Scenario 2 · 예외 — 불일치 신고 수신**
- **Given** `VERIFIED` 또는 `STALE` 상태의 확인 정보
- **When** 조건 불일치 신고가 수신됨 (`REQ-FUNC-013`)
- **Then** **60초 이내**에 `RECHECK_REQUIRED`로 전이한다

**Scenario 3 · 경계 — `verified_at + 90일` 당일**
- **Given** 확인 일자로부터 **정확히 90일**이 경과한 시점
- **When** 상태를 판정함
- **Then** `STALE`로 전이하고 경고가 병기된다 (`REQ-FUNC-011`)

**Scenario 4 · 근거 무결성 — 확인 주체 결락 차단**
- **Given** 확인 일자만 있고 주체가 없는 등록 시도
- **When** 저장함
- **Then** **거부된다.** 근거 4항목이 성립하지 않는 확인 정보는 만들 수 없다

### ⚙️ Technical & Non-Functional Constraints
- **ADR-002** 독립 엔터티 — 사후 변경 시 **근거 표기 전면 재설계**
- **`REQ-NF-011`** 경고 누락률 **0%** — `IDX-E` 캐시 6h와 충돌 (`SPEC-003` 참조)
- **`REQ-FUNC-013`** 신고 → 전이 **≤60s**
- 상태 판정 시점(배치 vs 조회 시점)이 **캐시 충돌 해소안과 연결**된다

### 🏁 DoD
공통 DoD 5개. 추가로 —
- [ ] 3상태 전이가 §8.2 도식과 **문자 단위로** 일치하는가?
- [ ] 90일 판정 시점이 확정되고 캐시 충돌 해소안과 정합한가?
- [ ] 확인 주체 없는 등록이 차단되는가?

### 🚧 Dependencies & Blockers
- **Depends on** `IDX-A`
- **Blocks** `EVD-A` `EVD-D` `SRC-D`(경유)
- **미정 — 확정 필요** **`STALE` 후보 유효성** (`SPEC-008` · 최우선) · 90일 판정 시점 · 캐시 6h 충돌 해소

---

## IDX-E · dishes 조회 API 및 캐시 {#idx-e}

**labels** `feature, query, backend, index-service, priority:high, phase-1`
**원문** `FR-008` `FR-009`

### 🎯 Summary
- **Task ID** `IDX-E` · **Epic** Index Service · **Must / M (M×2)**
- **목적** 메뉴·가격 조회 경로. **캐시 TTL 6시간이 실제로 동작하는 유일한 지점**이다.

### 🔗 References
- 계약 **`SPEC-003`** · SRS §8.1 · §8.1.1 · §8.6.2
- `REQ-NF-002`(p95 ≤ 400ms) · `REQ-NF-020`(히트율 70% 이상)

### ✅ Task Breakdown
- [ ] **`FR-008`** `GET /v1/places/{id}/dishes` 구현 — `SPEC-003` 계약 준수
- [ ] **`FR-009`** 조회 캐시 적용 (TTL 6h) + **히트/미스 계측**
- [ ] `canonicalKey` 필터 처리
- [ ] `PriceProfile` 응답 조립
- [ ] **캐시 6h ↔ 신선도 90일 충돌 해소안 구현** (`SPEC-003`)
- [ ] 캐시 무효화 경로 — 색인 갱신 시

### 🧪 Acceptance Criteria

**Scenario 1 · 정상**
- **Given** 유효한 place id와 `canonicalKey`
- **When** 조회함
- **Then** `200`과 Dish 목록·`PriceProfile`이 반환되고 **p95 ≤ 400ms**다

**Scenario 2 · 예외 — 캐시 미스 + 색인 지연**
- **Given** 캐시가 비어 있고 색인 조회가 지연됨
- **When** 조회함
- **Then** **(미정 — 확정 필요)** p95 400ms 초과 시 동작이 SRS에 없다

**Scenario 3 · 경계 — 캐시 히트율**
- **Given** 동일 place를 6시간 내 반복 조회
- **When** 히트/미스를 계측함
- **Then** 히트율 **70% 이상** (`REQ-NF-020`)

**Scenario 4 · 근거 무결성 — 신선도 경계**
- **Given** `verified_at + 90일`이 캐시 유효 구간 안에서 경과하는 항목
- **When** 조회함
- **Then** **경고 누락이 발생하지 않는다** (`REQ-NF-011` 0%) — `SPEC-003` 해소안 적용

### ⚙️ Technical & Non-Functional Constraints
- **§8.1** p95 **≤ 400ms** · 캐시 TTL **6시간**
- **`REQ-NF-020`** 히트율 **70% 이상**
- **`REQ-NF-011`** 경고 누락률 **0%** — 캐시와 정면으로 부딪히는 지점
- 상태 비저장 — `IN-D` 수평 확장의 전제

### 🏁 DoD
공통 DoD 5개. 추가로 —
- [ ] **캐시 6h ↔ 신선도 90일 충돌이 구현 수준에서 해소되었는가?**
- [ ] 히트/미스 계측이 `IN-C` 관측성에 연결되었는가?
- [ ] 색인 갱신 시 캐시 무효화가 동작하는가?

### 🚧 Dependencies & Blockers
- **Depends on** `SPEC-003` `IDX-B` `IN-F`(IN-012 캐시 계층)
- **Blocks** `SRC-C`
- **미정 — 확정 필요** 캐시 6h ↔ 신선도 90일 충돌 · p95 초과 시 동작

---

## 이 웨이브가 끝나면 확정되는 것

| 산출물 | 내용 |
| --- | --- |
| 색인 스키마 + 마이그레이션 | 5개 엔터티 · `Proposal` 참조 계약 포함 |
| 정규화 사전 + **평가셋** | `canonical_key` 92% 판정 기준 |
| 상권 1곳 300건 | Phase 0 게이트 산출물 |
| `Verification` 3상태 | 근거 4항목 중 2개의 원천 |
| dishes 조회 + 캐시 | 히트율 70% 계측 |

## 이 웨이브에서 드러난 미정 항목

| # | 항목 | 담당 | 막힌 이슈 |
| --- | --- | --- | --- |
| 1 | **`STALE` 후보 유효성** (`SPEC-008` 연계) | PM + 개발팀 리드 | `IDX-D` |
| 2 | **캐시 6h ↔ 신선도 90일 충돌** | 개발팀 리드 | `IDX-E` · `IDX-D` |
| 3 | **정규화 정확도 평가셋 부재** | 개발팀 리드 + PM | `IDX-B` |
| 4 | 필수 필드 결락 시 적재 정책 | PM | `IDX-C` |
| 5 | `PriceProfile` 단일값 표기 | 개발팀 리드 | `IDX-A` |
| 6 | 사전 미등재·동음이의 처리 | 개발팀 리드 | `IDX-B` |

**3번이 새로 드러난 것이다.** 평가서 §4의 7건에 없었다 — **92%라는 목표는 있는데 그것을 재는 자가 없다.**
