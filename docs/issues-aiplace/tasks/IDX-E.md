# IDX-E · dishes 조회 API 및 캐시

> **웨이브** `P1b-data` · **라벨** `feature, query, backend, index-service, priority:high, phase-1`
> **원본** [`docs/issues-aiplace/P1b-data.md`](../P1b-data.md#idx-e)
> **원장** `TASKS-ai-place-v1.0.md` (TASKS-AIPLACE-MVP-001 v1.1 · 50건) · **SRS** `SRS-ai-place-v1.0.md` (SRS-AIPLACE-MVP-001 v1.9)

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

### 공통 DoD — 웨이브 `P1b-data` 전체

- [ ] **마이그레이션 스크립트**가 작성되고 롤백이 검증되었는가?
- [ ] 스키마 변경이 ADR-001의 재색인 비용 경고와 상충하지 않는가?
- [ ] `SPEC-001` 공통 규약(단위·오류 형식)을 준수하는가?
- [ ] SRS 수치를 반올림·요약 없이 옮겼는가?
- [ ] 후행 태스크 담당자가 스키마 계약을 검토했는가?

