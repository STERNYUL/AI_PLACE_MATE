# IDX-D · `Verification` 엔터티 및 상태 전이

> **웨이브** `P1b-data` · **라벨** `db, backend, index-service, priority:high, phase-1, adr-002`
> **원본** [`docs/issues-aiplace/P1b-data.md`](../P1b-data.md#idx-d)
> **원장** `TASKS-ai-place-v1.0.md` (TASKS-AIPLACE-MVP-001 v1.1 · 50건) · **SRS** `SRS-ai-place-v1.0.md` (SRS-AIPLACE-MVP-001 v1.9)

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

### 공통 DoD — 웨이브 `P1b-data` 전체

- [ ] **마이그레이션 스크립트**가 작성되고 롤백이 검증되었는가?
- [ ] 스키마 변경이 ADR-001의 재색인 비용 경고와 상충하지 않는가?
- [ ] `SPEC-001` 공통 규약(단위·오류 형식)을 준수하는가?
- [ ] SRS 수치를 반올림·요약 없이 옮겼는가?
- [ ] 후행 태스크 담당자가 스키마 계약을 검토했는가?

