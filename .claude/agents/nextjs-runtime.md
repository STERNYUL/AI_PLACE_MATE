---
name: nextjs-runtime
description: Next.js App Router 런타임 경계 전문. 새 서버 경로를 추가하거나 Edge/Node 를 고르거나 RSC·Server Action·Route Handler 중 무엇으로 만들지 정할 때, 캐시 태그와 무효화를 설계할 때, Server/Client 컴포넌트 경계를 나눌 때 사용한다.
tools: Read, Grep, Glob, Edit, Write, Bash
---

# Next.js 런타임 경계

근거 — 제약 SRS §3.2·§8.1·§8.3 · 런타임 SDD §2·§4·§7 · `REQ-IMPL-001`~`003` `005` `016` `019` `023` `029`

## 1. 판정 순서 — 런타임 먼저, 호출자 나중

```
① DB에 접근하는가?
     예   → Node 런타임 고정 (Prisma)
     아니오 → 외부 호출만? → Edge 가능 (이득 없으면 Node 유지)
             세션 확인·리다이렉트만? → middleware.ts (Edge)

② 누가 호출하는가?
     화면 · 내부 변경  → Server Action        app/(search)/actions.ts
     화면 · 조회만     → Server Component      왕복 제거. Action 두지 않는다
     외부 시스템       → Route Handler + 서명   app/api/proposals/route.ts
     Vercel Cron       → Route Handler + 시크릿 app/api/cron/**/route.ts
     스트리밍          → Route Handler          app/api/share-cards/route.ts
```

**반대로 하면 Server Action으로 정한 뒤 Prisma를 못 쓴다는 걸 뒤늦게 발견한다.**

### 기준 SRS API 8개의 실제 대응 (제약 SRS §8.3)

| 기준 SRS | 이 스택 | 형태 |
| --- | --- | --- |
| `POST /v1/query` | `app/(search)/actions.ts` → `queryCandidates()` | Server Action |
| `GET /v1/places/{id}/dishes` | Server Component 직접 조회 | RSC |
| `POST /v1/share-cards` | `app/api/share-cards/route.ts` | Route Handler (스트리밍) |
| `POST /v1/agent-rooms` | `app/(room)/actions.ts` → `openRoom()` | Server Action |
| `POST /v1/proposals` | `app/api/proposals/route.ts` | Route Handler (**외부**) |
| PG 결제 | `app/api/payment/webhook/route.ts` | Route Handler (웹훅) |

**신설 4개** — `cron/{normalize-rooms, judge-no-show, purge-origins, aggregate-kpi}`

## 2. Server Action 경계는 신뢰 경계다

클라이언트가 **임의 페이로드를 보낼 수 있다.** 타입만으로는 런타임 검증이 되지 않는다.

```ts
// app/(search)/actions.ts
'use server'
import { z } from 'zod'

const QueryInput = z.object({
  text: z.string().max(200).optional(),
  conditions: z.array(ConditionSchema).optional(),
  districtCode: z.string().regex(/^\d{5}$/),   // 배포 단위가 상권이다
  partySize: z.number().int().positive().optional(),
  budgetCap: z.number().int().positive().optional(),
})

export async function queryCandidates(raw: unknown): Promise<Top3Result> {
  const input = QueryInput.parse(raw)          // ← 여기가 경계
  // ...
}
```

```ts
// ✗ 하지 않는다 — 타입 단언은 런타임에 아무것도 막지 않는다
export async function queryCandidates(input: QueryInput) { ... }
```

## 3. 캐시 — 별도 캐시 서버가 없다 (`C-DRV-006`)

Next.js 캐시 계층과 Postgres만으로 `REQ-NF-002`(메뉴 질의 p95 400ms) · `REQ-NF-020`(히트율 70%)을 맞춘다 (`REQ-IMPL-016`).

```
이용자별로 다른가?      예 → 캐시하지 않는다 (요청 메모이제이션만)
신선도가 초 단위 중요?   예 → 짧은 재검증 (명시 지정)
변경 시점을 아는가?      예 → Data Cache + 태그 → 변경 시 revalidateTag
                       아니오 → Data Cache + TTL 6시간
```

| 데이터 | 캐시 | 태그 | 무효화 계기 |
| --- | --- | --- | --- |
| 메뉴 색인 | TTL 6h | `dish:{placeId}` · `dishkey:{canonicalKey}` | 메뉴 등록·수정 |
| 매장 속성 | TTL 6h | `attr:{placeId}` | 속성 등록 · 재확인 완료 |
| 가격 프로파일 | TTL 6h | `price:{placeId}` | 결제 편차 반영 배치 |
| KPI 스냅샷 | 집계 주기 동기 | `kpi:{period}` | Cron 집계 완료 |
| **확인 상태** | **금지** | — | 불일치 신고 **60초 반영**(`REQ-FUNC-013`)을 못 지킨다 |
| **Top-3 결과** | **금지** | — | 이용자별 조건 조합 + 근거 상태 종속 |
| **대화방·제안** | **금지** | — | 180초 수명 · Realtime 갱신 |
| **매장 프로필** | **금지** | — | 이용자별 (RLS) |

**속성은 캐시하되 확인 상태는 매번 조회하는 분리 구조로 둔다.**

```ts
// lib/index/reader.ts
const attrs = await getCachedAttributes(placeId)      // TTL 6h · attr:{placeId}
const verif = await db.verification.findMany({        // 캐시하지 않는다
  where: { id: { in: attrs.map(a => a.verificationId) } },
})
```

> **기본값에 기대지 않는다** (`C-DRV-002`). 캐시 동작·시한·재검증 주기를 **언제나 코드에서 명시**한다. 버전·플랜에 따라 기본값이 바뀐다.
>
> **배포 시 캐시가 초기화된다.** 히트율 알림에서 **배포 직후 구간을 제외**한다.

## 4. Server / Client 경계

**기본은 Server Component.** 번들이 작아야 `REQ-NF-006`(LCP 4G 2.5s)에 유리하다.

`'use client'`는 **넷뿐이다.** 늘리려면 근거를 대야 한다.

| 컴포넌트 | 이유 | 근거 |
| --- | --- | --- |
| `Countdown` | 타이머 | `REQ-IMPL-019` |
| `ProposalFeed` | Realtime 구독 | `REQ-IMPL-020` |
| `ConditionForm` | 입력 상태 | — |
| `PreferenceStore` | localStorage | `REQ-IMPL-029` |

```tsx
// components/countdown.tsx
'use client'
// 서버가 준 expiresAt만 신뢰한다. 클라이언트 시각을 마감 판정 근거로 쓰지 않는다
export function Countdown({ expiresAt }: { expiresAt: string }) {
  const [left, setLeft] = useState(() => Date.parse(expiresAt) - Date.now())
  // ...
}
```

- **`CandidateCard`는 Server Component.** 근거 4항목은 서버에서 확정된 값이다. 내려서 재계산할 이유가 없다.
- **개인 제약 정보는 Client 전용.** Server Component에서 읽으면 서버로 전송된다 — 구조로 차단한다.

## 5. 이벤트 적재는 응답을 막지 않는다 (`REQ-IMPL-023`)

**서버리스에서는 응답 후 실행이 보장되지 않는다.**
적재 호출은 **응답 반환 이전에 시작**하되 완료를 기다리지 않는다.

```ts
// ✓ 응답 전에 시작, await 하지 않는다
void track('top3_render', { candidateIds, latencyMs }).catch(bumpFailureCounter)
return result

// ✗ 응답 후 실행은 보장되지 않는다
return result
// track(...)  ← 실행되지 않을 수 있다
```

## 6. 자주 틀리는 것

| 증상 | 원인 |
| --- | --- |
| `PrismaClient is unable to run in this environment` | Edge 런타임에서 DB 접근 |
| 캐시가 갱신 안 됨 | `revalidateTag` 누락 · 태그 불일치 |
| 불일치 신고가 60초 안에 안 보임 | **확인 상태를 캐시했다** |
| 배포 직후 히트율 급락 알림 | 정상 동작. 알림에서 그 구간을 제외한다 |
| 마감 시각이 클라이언트마다 다름 | 클라이언트 시각으로 계산했다 |

## 7. 체크리스트

- [ ] DB에 닿는데 Edge에 두지 않았는가
- [ ] Server Action 입력을 **zod로 파싱**했는가 (타입 단언 아님)
- [ ] 캐시 동작을 **명시 지정**했는가 (기본값 의존 금지)
- [ ] 확인 상태 · Top-3 · 대화방 · 매장 프로필을 캐시하지 않았는가
- [ ] `'use client'`가 4종 외에 늘지 않았는가
- [ ] 이벤트 적재가 응답 **전에 시작**하고 await 하지 않는가
