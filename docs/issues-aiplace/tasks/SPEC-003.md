# SPEC-003 · `GET /v1/places/{id}/dishes` 계약

> **웨이브** `P1a-contracts` · **라벨** `spec, contract, backend, index-service, priority:high, phase-0`
> **원본** [`docs/issues-aiplace/P1a-contracts.md`](../P1a-contracts.md#spec-003)
> **원장** `TASKS-ai-place-v1.0.md` (TASKS-AIPLACE-MVP-001 v1.1 · 50건) · **SRS** `SRS-ai-place-v1.0.md` (SRS-AIPLACE-MVP-001 v1.9)

### 🎯 Summary
- **Task ID** `SPEC-003` · **Epic** Contract · **Must / M**
- **목적** 메뉴·가격 조회 계약. **캐시 TTL 6시간이 계약에 박히는 유일한 지점**이다.

### 🔗 References
- SRS §8.1.1 `GET /v1/places/{id}/dishes` 행 · §8.1 "p95 ≤ 400ms, 캐시 TTL 6시간"
- `REQ-NF-002` 응답 시간 · `REQ-NF-020` 캐시 히트율 70% 이상 · §8.6.2
- `IDX-B`(FR-002) `canonical_key` 정규화 · `IDX-A`(FR-005) `PriceProfile`

### ✅ Task Breakdown
- [ ] 경로 변수 `{id}` · 쿼리 파라미터 `canonicalKey` 확정
- [ ] 응답 DTO — Dish 목록 + `PriceProfile`
- [ ] `PriceProfile` 구조 확정 — 하한·평균·상한 및 조건 태그
- [ ] 캐시 헤더 규약 — TTL 6h
- [ ] 미존재 place 응답 확정 **(미정)**

### 캐시 6시간 ↔ 신선도 90일 충돌 — 이 계약에서 드러난다

평가서 §4가 지적한 항목이다. 두 규정이 같은 데이터를 다르게 취급한다.

| 규정 | 값 | 출처 |
| --- | --- | --- |
| 조회 캐시 TTL | **6시간** | §8.1, `REQ-NF-020` |
| 신선도 경고 임계 | **90일** | `REQ-FUNC-011`, `REQ-NF-011` |
| 경고 누락률 목표 | **0%** | `REQ-NF-011` |

**`verified_at + 90일`이 캐시 유효 구간 안에서 경과하면, 최대 6시간 동안 `STALE` 경고 없이 응답한다.**
`REQ-NF-011`의 경고 누락률 0%와 어긋나는 구간이 생긴다.

**해소안 (제안)** — 캐시 키에 `verified_at`을 포함하거나, 응답에 `verified_at`을 실어 **클라이언트가 경과를 판정**하게 한다.
후자가 캐시 효율을 해치지 않는다. **확정 필요.**

### 🧪 Acceptance Criteria

**Scenario 1 · 정상**
- **Given** 유효한 place id와 `canonicalKey`
- **When** 조회함
- **Then** `200`과 Dish 목록·`PriceProfile`이 반환되고 **p95 ≤ 400ms**다

**Scenario 2 · 예외 (§4.5.3) — 캐시 미스 · 색인 지연**
- **Given** 캐시가 비어 있고 색인 조회가 지연됨
- **When** 조회함
- **Then** **(미정 — 확정 필요)** p95 400ms 초과 시 동작이 SRS에 없다

**Scenario 3 · 경계 — 캐시 히트율**
- **Given** 동일 place를 6시간 내 반복 조회
- **When** 히트/미스를 계측함
- **Then** 히트율이 **70% 이상**이다 (`REQ-NF-020`)

**Scenario 4 · 근거 무결성 — 신선도 경계**
- **Given** `verified_at + 90일`이 캐시 유효 구간(6h) 안에서 경과하는 항목
- **When** 조회함
- **Then** **경고 누락이 발생하지 않아야 한다** (`REQ-NF-011` 누락률 0%) — 위 해소안 적용

### ⚙️ Technical & Non-Functional Constraints
- **§8.1** p95 **≤ 400ms** · 캐시 TTL **6시간**
- **`REQ-NF-020`** 캐시 히트율 **70% 이상**
- **`REQ-NF-011`** 신선도 경고 누락률 **0%**

### 🏁 DoD
공통 DoD 5개. 추가로 —
- [ ] **캐시 6h ↔ 신선도 90일 충돌이 계약 수준에서 해소되었는가?**
- [ ] `PriceProfile` 구조가 `IDX-A`(FR-005)와 일치하는가?

### 🚧 Dependencies & Blockers
- **Depends on** `SPEC-001`
- **Blocks** `IDX-E`(FR-008) · `IDX-E`(FR-009)
- **미정 — 확정 필요**
  - **캐시 6h ↔ 신선도 90일 충돌** — 개발팀 리드 (평가서 §4 항목)
  - p95 400ms 초과 시 동작 · 미존재 place 응답

### 공통 DoD — 웨이브 `P1a-contracts` 전체

- [ ] 계약이 `docs/api-aiplace.yaml`(OpenAPI)에 반영되었는가?
- [ ] 소비 측(구현·Mock·클라이언트) 담당자가 검토하고 동의했는가?
- [ ] **(미정)** 항목이 전부 해소되었거나 확정 담당자·기한이 지정되었는가?
- [ ] 계약 변경 절차(승인자·통보 대상)가 정해졌는가?
- [ ] SRS §8.1.1의 수치를 **반올림·요약 없이** 그대로 옮겼는가?

