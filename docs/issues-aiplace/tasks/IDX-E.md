# IDX-E · dishes 조회 API 및 캐시

> **웨이브** `P1b-data` · **라벨** `feature, query, backend, index-service, priority:high, phase-1`
> **원본** [`docs/issues-aiplace/P1b-data.md`](../P1b-data.md#idx-e)
> **원장** `TASKS-ai-place-v1.0.md` (TASKS-AIPLACE-MVP-001 v1.1 · 50건) · **SRS** `[SRS]ai-place -mate-SRSv1.0.md` (SRS-AIPLACE-MVP-001 v1.9)

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
- [ ] **캐시 6h ↔ 신선도 90일 충돌 해소안 구현** — 응답에 `verifiedAt` 포함 · 판정은 `lib/evidence/freshness.ts` (세션 2 T6)
- [x] **캐시 무효화 경로** — **`place:{id}` 단일 태그** (확정 · Grill S3-T10)

### 캐시 무효화 — `place:{id}` 단일 태그 (확정 · Grill S3-T10)

별도 캐시 서버가 없으므로(`C-DRV-006`) **Next.js Data Cache 태그가 곧 무효화 설계**다.

| | 내용 |
| --- | --- |
| 태그 | **`place:{id}`** 하나 |
| 무효화 시점 | 매장 메뉴·가격 갱신 · 콘솔 저장(`MCH-A`) · 재색인 |
| **무효화 대상이 아닌 것** | **신선도 경과** — 세션 2 T6이 `verifiedAt` 수신 시점 판정으로 처리한다 |

**`GET /v1/places/{id}/dishes`가 매장 단위 조회라 캐시 항목도 매장 단위다.** 태그를 `dish:{canonicalKey}`까지 쪼개도 **무효화 대상은 결국 그 매장의 항목 하나**라 이득이 없고, S3-T7에서 `canonical_key`가 **사전 갱신으로 바뀔 수 있다**고 정했으므로 **옛 메뉴 태그가 고아로 남는다.**

**전역 태그를 기각한 이유** — 매장 1곳 갱신이 전체 캐시를 날려 `REQ-NF-020` 히트율 70%를 지킬 수 없다.

### 🧪 Acceptance Criteria

**Scenario 1 · 정상**
- **Given** 유효한 place id와 `canonicalKey`
- **When** 조회함
- **Then** `200`과 Dish 목록·`PriceProfile`이 반환되고 **p95 ≤ 400ms**다

**Scenario 2 · 예외 — 캐시 미스 + 색인 지연**
- **Given** 캐시가 비어 있고 색인 조회가 지연됨
- **When** 조회함
- **Then** **`200`과 정상 응답을 유지하고 지연을 계측한다** (세션 2 T11). 화면은 `근거대기` · `REQ-NF-008` 오류율 분자 제외

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
- [ ] **캐시 6h ↔ 신선도 90일 충돌이 구현 수준에서 해소되었는가?** — 방식은 확정(세션 2 T6). 구현이 남음
- [ ] 히트/미스 계측이 `IN-C` 관측성에 연결되었는가?
- [ ] 색인 갱신 시 캐시 무효화가 동작하는가? — 태그는 `place:{id}` 확정(S3-T10). 구현이 남음

### 🚧 Dependencies & Blockers
- **Depends on** `SPEC-003` (#96) `IDX-B` (#104) `IN-F` (#173)(IN-012 캐시 계층)
- **Blocks** `SRC-C` (#118)
- **확정 완료**
  - **캐시 6h ↔ 신선도 90일 충돌** (세션 2 T6) — TTL 유지 · 응답 `verifiedAt`으로 수신 시점 판정 · 판정 함수 `lib/evidence/freshness.ts` 단일
  - **p95 400ms 초과 시 동작** (세션 2 T11) — `200`과 응답 유지 + 지연 계측 · `REQ-NF-008` 오류율 분자 제외
  - **캐시 무효화 태그** (S3-T10) — `place:{id}` 단일 태그

### 공통 DoD — 웨이브 `P1b-data` 전체

- [ ] **마이그레이션 스크립트**가 작성되고 롤백이 검증되었는가?
- [ ] 스키마 변경이 ADR-001의 재색인 비용 경고와 상충하지 않는가?
- [ ] `SPEC-001` 공통 규약(단위·오류 형식)을 준수하는가?
- [ ] SRS 수치를 반올림·요약 없이 옮겼는가?
- [ ] 후행 태스크 담당자가 스키마 계약을 검토했는가?

