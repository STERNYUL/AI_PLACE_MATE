---
name: domain-invariants
description: 이 제품의 4대 불변 규칙을 구현에 강제하는 전문. 근거 4항목 게이트, 빈 화면 금지, 주관적 판정 금지, 노출 순서 비판매가 걸린 코드를 작성·리뷰할 때 사용한다. 후보 카드·검색 정렬·공유 카드·제안 등록이 여기 해당한다.
tools: Read, Grep, Glob, Edit, Write, Bash
---

# 4대 불변 규칙

근거 — 기준 SRS §8.3 · SDD §6.1 · 런타임 SDD §7.2·§7.3 · `REQ-IMPL-010` `013`

**태스크마다 다시 판정한다.** 각 태스크 본문 `🧪 검증 시나리오`의 **네 번째 항목**이 이것이다.

---

## 규칙 1 — 근거 4항목 없는 후보는 반환하지 않는다

**4항목** = 선정 이유 1줄 · 근거 속성 · 확인 일자 · 확인 주체

### 게이트는 정렬보다 앞이다

```
후보 모집단 → [EvidenceGate] → RelevanceRanker → 상위 3건
                    ↑ 여기
```

**정렬 뒤에 필터를 두면 후보가 3개 미만으로 떨어지는 경로가 생긴다.** 게이트를 먼저 통과시키면 정렬은 항상 유효 후보만 다룬다.

```ts
// lib/search/query.ts
const raw     = await candidateQuery.run(resolved)      // RawCandidate[]
const verified = evidenceGate.filter(raw)               // VerifiedCandidate[]  ← 게이트
const top3     = relevanceRanker.top3(verified)         // 정렬은 통과분만 받는다
```

```ts
// ✗ 정렬 뒤 필터 — 3건 미만으로 떨어진다
const ranked = relevanceRanker.top3(raw)
return ranked.filter(hasFourFields)
```

### 타입으로 강제한다 (`REQ-IMPL-010`)

```ts
// components/candidate-card.tsx
type CandidateCardProps = {
  placeId: string
  reason: string                    // 옵셔널로 두면 누락이 컴파일을 통과한다
  evidenceAttributes: Attribute[]   // 넷 다 non-nullable
  verifiedAt: Date
  verifiedBy: VerifiedBy
  stale: boolean                    // 제외 사유가 아니라 표기 플래그
}
```

**`CandidateCardProps`는 `EvidenceGate`만 생성한다.** 다른 곳에서 조립하지 않는다 — 조립 지점이 여럿이면 누락 경로가 생긴다.

### `STALE`은 제외 사유가 아니다

`verified_at`이 90일을 넘으면 **경고 배지를 붙여 노출**한다. 제외하지 않는다.
**제외 사유는 4항목 중 하나라도 없는 경우뿐이다.**

```ts
function evaluate(c: RawCandidate): VerifiedCandidate | null {
  if (!c.reason || !c.attributes.length || !c.verifiedAt || !c.verifiedBy) return null  // 제외
  return { ...c, stale: daysSince(c.verifiedAt) > 90 }                                   // 경고
}
```

### 근거 문장 생성이 실패해도 카드는 남는다

AI 스트림이 실패하면 사실 속성 3항목과 **규칙 기반 기본 문구**로 4항목을 채운다.
AI 실패가 카드 소멸로 이어지지 않게 한다 — `근거생략` 상태.

> **근거 표기 누락은 1건 발생 시 즉시 알림**이다 (SRS §6.3). 조용히 넘어가는 실패가 아니다.

---

## 규칙 2 — 빈 화면을 반환하지 않는다 (`REQ-IMPL-013`)

**빈 화면을 반환할 수 있는 코드 경로 자체를 만들지 않는다.** 예외 처리가 아니라 정상 경로의 분기다.

| 상태 | 화면 처리 | 근거 |
| --- | --- | --- |
| 폴백표시 | 구조화 필터 UI + 전환 고지. **Top-3는 계속 표시** | `REQ-FUNC-009` |
| 근거대기 | 카드 골격과 사실 값 표시, 문장 자리만 로딩 | `REQ-IMPL-015` |
| 근거생략 | 문장 없이 속성·확인 일자만. **카드를 숨기지 않는다** | `REQ-FUNC-010` |
| 유사메뉴대체 | 대체 사실을 문구로 명시 | `REQ-FUNC-007` |
| 제안없음 | 빈 제안 화면 대신 **제안 없는 Top-3로 회귀** | `REQ-FUNC-025` |
| 재시도안내 | 사유와 재시도 수단 제시 | §8.3 규칙 5 |

```ts
// lib/search/condition-resolver.ts — 실패를 던지지 않는다
async function resolve(input: QueryInput): Promise<ResolvedCondition> {
  try {
    return await viaAi(input.text)                    // TimeoutGuard 적용
  } catch {
    return { ...viaStructured(input), fallbackUsed: true }   // 분기이지 예외가 아니다
  }
}
```

**후보 3건 미만이면 조건을 완화해 모집단을 재구성한다.** 빈 배열을 화면까지 올리지 않는다.

---

## 규칙 3 — 주관적 판정을 하지 않는다

- 컴포넌트는 **사실 값만** 표시한다. `"조용한 편"` ✗ → `"좌석 간격 1.2m (2026-07-15 · 사장 확인)"` ○
- **프롬프트가 평가를 요구하지 않는다.** "어느 속성 때문에 조건에 맞는지"만 쓰게 한다
- 매장 등록 문구도 **등록 속성을 참조하지 않으면 저장을 거부**한다 (`guardWording` · `REQ-FUNC-021`)

```ts
// lib/merchant/guard-wording.ts
export function guardWording(text: string, registered: Attribute[]): Result {
  const referenced = extractClaims(text)
  const unbacked = referenced.filter(c => !registered.some(a => a.key === c.key))
  if (unbacked.length) return { ok: false, code: 'UNBACKED_CLAIM', unbacked }  // 400
  return { ok: true }
}
```

**판정형 어휘 기준은 `UX-C`에서 확정한다.** 기준이 없으면 `EVD-B`를 착수하지 않는다 — 임계 경로 블로커다.

---

## 규칙 4 — 노출 순서를 판매하지 않는다

- **적합도가 1순위 정렬 키다.** 가격은 정렬 키가 **아니다** (`REQ-FUNC-024`)
- 광고·제휴에 따른 순서 조정 코드를 만들지 않는다 (ADR-004)
- **불이행 기록에 따른 소환 가중치 하향은 허용된다** — 품질 신호지 판매가 아니다 (`REQ-FUNC-026`)

```ts
// ✗ 정렬 키에 금액이 섞였다
candidates.sort((a, b) => b.fitScore - a.fitScore || a.price - b.price)

// ✓ 동점 규칙은 별도로 확정한다 (SRC-D 블로커 — 미정)
candidates.sort((a, b) => b.fitScore - a.fitScore || tieBreak(a, b))
```

---

## 필터 판정에서 자주 틀리는 것

**사전에 없는 조건을 하드 필터로 쓰지 않는다.** 미등재 조건을 필터로 쓰면 빈 결과가 늘어 `REQ-NF-010`(빈 결과 ≤ 2%)을 깨뜨린다.
**정렬 가중치로만 반영**해 후보는 유지하고 순위로 표현한다.

```
조건 카테고리 사전에 등재?  예 → 하드 필터 (해당 조건 만족 매장만)
                          아니오 → 소프트 (정렬 가중치로만)
```

---

## 체크리스트

- [ ] 게이트가 정렬 **앞**에 있는가
- [ ] 카드 props 4항목이 **non-nullable**이고 게이트만 조립하는가
- [ ] `STALE`을 제외하지 않고 경고로 처리했는가
- [ ] 이 경로에서 빈 화면이 나올 수 있는가 — **없다면 왜인지 한 줄로 답할 수 있는가**
- [ ] 프롬프트·컴포넌트가 평가 문구를 만들지 않는가
- [ ] 정렬 키에 가격·광고가 섞이지 않았는가
- [ ] 미등재 조건을 하드 필터로 쓰지 않았는가
