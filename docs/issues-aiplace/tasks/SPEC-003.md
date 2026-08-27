# SPEC-003 · `GET /v1/places/{id}/dishes` 계약

> **웨이브** `P1a-contracts` · **라벨** `spec, contract, backend, index-service, priority:high, phase-0`
> **원본** [`docs/issues-aiplace/P1a-contracts.md`](../P1a-contracts.md#spec-003)
> **원장** `TASKS-ai-place-v1.0.md` (TASKS-AIPLACE-MVP-001 v1.1 · 50건) · **SRS** `[SRS]ai-place -mate-SRSv1.0.md` (SRS-AIPLACE-MVP-001 v1.9)

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
- [x] **미존재 place 응답 확정** — `400` (Grill T10). 클라이언트가 보낸 id가 계약과 맞지 않는 경우이므로 `400`("계약 위반") 정의에 들어간다. **`404`를 신설하지 않는다** — 상태 코드는 `200`·`400`·`401`·`5xx` 넷 (`SPEC-001` · Grill T8)

### 캐시 6시간 ↔ 신선도 90일 충돌 — 이 계약에서 드러난다

평가서 §4가 지적한 항목이다. 두 규정이 같은 데이터를 다르게 취급한다.

| 규정 | 값 | 출처 |
| --- | --- | --- |
| 조회 캐시 TTL | **6시간** | §8.1, `REQ-NF-020` |
| 신선도 경고 임계 | **90일** | `REQ-FUNC-011`, `REQ-NF-011` |
| 경고 누락률 목표 | **0%** | `REQ-NF-011` |

**`verified_at + 90일`이 캐시 유효 구간 안에서 경과하면, 최대 6시간 동안 `STALE` 경고 없이 응답한다.**
`REQ-NF-011`의 경고 누락률 0%와 어긋나는 구간이 생긴다.

### 해소 — 응답에 `verifiedAt`을 싣고 수신 시점에 판정한다 (확정 · Grill T6)

| | 내용 |
| --- | --- |
| 캐시 TTL | **6시간 유지** — `REQ-NF-020` 히트율 70% 안전 |
| 응답 | `verifiedAt` 포함 — **근거 4항목이라 이미 실린다**(`SPEC-008` · Grill T5). 추가 비용 0 |
| 판정 시점 | **클라이언트 렌더 직전** — 캐시에서 나온 응답도 그 순간의 시각으로 다시 판정된다 |
| 판정 함수 | **`lib/evidence/freshness.ts` 하나** |

**캐시 키에 `verified_at`을 넣는 안(B)은 해소가 부분적이다** — 경과는 시간이 흘러 일어나므로 **키가 같아도 6시간 구멍이 그대로 남는다.** TTL 단축(C)은 경계 근처 항목이 많아지면 히트율이 떨어지고 동적 TTL 계산이 새 복잡도가 된다.

> **판정이 서버와 클라이언트 두 곳에 생긴다.** 두 곳이 다른 기준을 쓰면 T1의 임계값 경계 규약(90일 **이상**)이 한쪽에서 깨진다.
> **`lib/evidence`가 판정 함수를 노출하고 서버·클라이언트가 그것만 호출한다.** 각자 날짜 계산을 하지 않는다.

### 🧪 Acceptance Criteria

**Scenario 1 · 정상**
- **Given** 유효한 place id와 `canonicalKey`
- **When** 조회함
- **Then** `200`과 Dish 목록·`PriceProfile`이 반환되고 **p95 ≤ 400ms**다

**Scenario 2 · 예외 (§4.5.3) — 캐시 미스 · 색인 지연**
- **Given** 캐시가 비어 있고 색인 조회가 지연됨
- **When** 조회함
- **Then** **`200`과 정상 응답을 유지하고 지연을 계측한다** (확정 · Grill T11). 클라이언트는 그동안 `근거대기` 상태를 표시한다 (`UX-F`)
  - **p95 400ms는 성능 목표이지 실패 조건이 아니다.** 초과했다고 응답을 버리면 가진 데이터를 버리는 것이라 §8.3 규칙 5(빈 화면 금지)의 취지에 반한다
  - `REQ-NF-008` 오류율 분자에 **들어가지 않는다** — `5xx`가 아니다

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
- [x] **캐시 6h ↔ 신선도 90일 충돌이 계약 수준에서 해소되었는가?** — **응답의 `verifiedAt`으로 수신 시점 판정** · 판정 함수 단일 (Grill T6)
- [ ] `PriceProfile` 구조가 `IDX-A`(FR-005)와 일치하는가?

### 🚧 Dependencies & Blockers
- **Depends on** `SPEC-001` (#94)
- **Blocks** `IDX-E` (#107)(FR-008) · `IDX-E` (#107)(FR-009)
- **확정 완료 (Grill T6 · 2026-08-27)**
  - **캐시 6h ↔ 신선도 90일 충돌** — TTL 6h 유지 · 응답의 `verifiedAt`으로 **수신 시점 판정** · 판정 함수는 `lib/evidence/freshness.ts` 단일
  - **p95 400ms 초과 시 동작** (T11) — `200`과 응답 유지 + 지연 계측. `REQ-NF-008` 오류율 분자 제외
  - **미존재 place 응답** (T10) — `400`. `404`를 신설하지 않는다

### 공통 DoD — 웨이브 `P1a-contracts` 전체

- [ ] 계약이 `docs/api-aiplace.yaml`(OpenAPI)에 반영되었는가?
- [ ] 소비 측(구현·Mock·클라이언트) 담당자가 검토하고 동의했는가?
- [x] **(미정)** 항목이 전부 해소되었거나 확정 담당자·기한이 지정되었는가? — **Grill 세션 2에서 전건 해소** (`docs/grill/GRILL_LEDGER.md`)
- [ ] 계약 변경 절차(승인자·통보 대상)가 정해졌는가?
- [ ] SRS §8.1.1의 수치를 **반올림·요약 없이** 그대로 옮겼는가?

