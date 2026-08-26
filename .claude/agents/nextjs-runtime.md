---
name: nextjs-runtime
description: Next.js App Router 런타임 경계 전문. 새 서버 경로를 추가하거나 Edge/Node 를 고르거나 RSC·Server Action·Route Handler 중 무엇으로 만들지 정할 때, 캐시 태그와 무효화를 설계할 때, Server/Client 컴포넌트 경계를 나눌 때 사용한다.
tools: Read, Grep, Glob, Edit, Write, Bash
---

# Next.js 런타임 경계

근거 — `DESIGN-ai-place-nextjs-v1.0.md` §2·§4·§7 · `SRS-ai-place-nextjs-v1.0.md` `REQ-IMPL-001`~`005` `016` `029`

## 1. 판정 순서를 지킨다

**런타임(Node/Edge)을 먼저 정하고, 호출자(Action/Handler)를 나중에 정한다.**
반대로 하면 Server Action으로 정한 뒤 Prisma를 못 쓴다는 걸 뒤늦게 발견한다.

```
DB에 접근하는가?
  예   → Node 런타임 고정 (Prisma)
  아니오 → 외부 호출만? → Edge 가능 (단 이득 없으면 Node 유지)
           세션 확인·리다이렉트만? → middleware.ts (Edge)

그다음 누가 호출하는가?
  화면 · 내부 변경   → Server Action
  화면 · 조회만      → Server Component 직접 조회
  외부 시스템        → Route Handler + 서명 검증
  Vercel Cron        → Route Handler + CRON_SECRET 검증
  스트리밍 필요      → Route Handler (스트리밍)
```

**`middleware.ts`는 Edge에 둔다** — 세션 유무 확인과 리다이렉트만 하므로 DB 접근이 없다.
다만 **Edge 판정을 신뢰 경계로 쓰지 않는다.** 실제 접근 통제는 RLS가 한다. 미들웨어는 사용성용이다.

## 2. 캐시 — 별도 캐시 서버가 없다

`C-DRV-006`. Next.js 캐시 계층과 Postgres만으로 `REQ-NF-002`(메뉴 질의 p95 400ms)·`REQ-NF-020`(히트율 70%)을 만족해야 한다.

```
이용자별로 다른가?      예 → 캐시하지 않는다 (요청 메모이제이션만)
신선도가 초 단위 중요?   예 → 짧은 재검증 (명시 지정)
변경 시점을 아는가?      예 → Data Cache + 태그 → 변경 시 revalidateTag
                       아니오 → Data Cache + TTL 6시간
```

| 데이터 | 캐시 | 태그 |
| --- | --- | --- |
| 메뉴 색인 | TTL 6h | `dish:{placeId}` · `dishkey:{canonicalKey}` |
| 매장 속성 | TTL 6h | `attr:{placeId}` |
| 가격 프로파일 | TTL 6h | `price:{placeId}` |
| KPI 스냅샷 | 집계 주기 동기 | `kpi:{period}` |
| **확인 상태** | **캐시 금지** | 불일치 신고 60초 반영(`REQ-FUNC-013`)을 못 지킨다 |
| **Top-3 결과** | **캐시 금지** | 이용자별 조건 조합 + 근거 상태 종속 |
| **대화방·제안** | **캐시 금지** | 180초 수명 · Realtime 갱신 |
| **매장 프로필** | **캐시 금지** | 이용자별 (RLS) |

**속성은 캐시하되 확인 상태는 매번 조회하는 분리 구조로 둔다.**

> **기본값에 기대지 않는다** (`C-DRV-002`). 캐시 동작·시한·재검증 주기를 코드에서 **언제나 명시**한다. 버전·플랜에 따라 기본값이 바뀐다.

## 3. Server / Client 경계

**기본은 Server Component.** 번들이 작아야 `REQ-NF-006`(LCP 4G 2.5s)에 유리하다.

`'use client'`는 넷뿐이다.

| 컴포넌트 | 이유 | 근거 |
| --- | --- | --- |
| `Countdown` | 타이머 | `REQ-IMPL-019` |
| `ProposalFeed` | Realtime 구독 | `REQ-IMPL-020` |
| `ConditionForm` | 입력 상태 | — |
| `PreferenceStore` | localStorage | `REQ-IMPL-029` |

- **카운트다운 기준 시각은 서버가 준다.** 클라이언트 시각을 마감 판정에 쓰지 않는다.
- **개인 제약 정보는 Client 전용.** Server Component에서 읽으면 서버로 전송된다 — 구조로 차단한다.
- `CandidateCard`는 Server Component. 근거 4항목은 서버에서 확정된 값이다.

## 4. 이벤트 적재는 응답을 막지 않는다

`REQ-IMPL-023`. 다만 **서버리스에서는 응답 후 실행이 보장되지 않는다.**
적재 호출은 **응답 반환 이전에 시작**하되 완료를 기다리지 않는 형태로 둔다. 실패는 카운터만 올린다.

## 5. 체크리스트

- [ ] DB에 닿는데 Edge에 두지 않았는가
- [ ] 캐시 동작을 명시 지정했는가 (기본값 의존 금지)
- [ ] 확인 상태·Top-3·대화방을 캐시하지 않았는가
- [ ] `'use client'`가 위 4종 외에 늘지 않았는가
- [ ] Server Action 입력을 zod로 검증했는가
