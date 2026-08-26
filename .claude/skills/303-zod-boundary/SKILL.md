---
name: 303-zod-boundary
description: 런타임 입력 검증 규칙. Server Action·Route Handler·환경 변수 경계에서 zod 로 파싱하는 방법과 하지 말아야 할 것을 다룬다. 서버 경로를 만들 때 적용한다.
---

# 경계 검증 — zod

근거 — 런타임 SDD §3.1 · 제약 SRS §8.4 · `REQ-IMPL-003`·`033`

## 신뢰 경계가 셋이다

| 경계 | 위험 | 처리 |
| --- | --- | --- |
| **Server Action** | 클라이언트가 임의 페이로드를 보낸다 | `schema.parse(raw)` |
| **Route Handler** | 외부 시스템이 호출한다 | **서명 검증 + 파싱** |
| **환경 변수** | 누락된 채 배포된다 | `env.ts`에서 **빌드 시점 차단** |

## 타입은 런타임에 아무것도 막지 않는다

```ts
// ✗ 타입 단언 — 런타임에 검증이 0이다
export async function queryCandidates(input: QueryInput) { ... }

// ✓ 파싱 — 여기가 경계다
export async function queryCandidates(raw: unknown): Promise<Top3Result> {
  const input = QueryInput.parse(raw)
  ...
}
```

**`as` 캐스팅을 경계에서 쓰지 않는다.**

## 도메인 제약을 스키마에 담는다

스키마가 곧 문서다. SRS의 유효 범위를 여기에 옮긴다.

```ts
const QueryInput = z.object({
  text: z.string().max(200).optional(),
  districtCode: z.string().regex(/^\d{5}$/),        // 배포 단위가 상권 (SRS 3.1.6)
  partySize: z.number().int().positive().optional(),
  budgetCap: z.number().int().positive().optional(), // 금액 단위는 원 (SRS 8.1.1)
})
.refine(v => v.text || v.conditions?.length, {
  message: '조건 2개 미만이면 400',                  // SRS 8.1.1 계약 위반
})
```

**단위를 지킨다** — 금액 원 · 거리 m · 지연 ms · 인원 명 · 만료 s. 반올림하지 않는다.

## 파싱 실패와 계약 위반을 구분한다

| 상황 | 응답 | 이유 |
| --- | --- | --- |
| **자연어 파싱 실패** | `200` + 폴백 | **오류가 아니다.** 정상 경로의 분기 (불변 규칙 2) |
| 스키마 위반 (필수 누락·형식 오류) | `400` | 계약 위반 |
| 구조 자체가 파싱 불가 | `422` | 폴백 전환과 구분해야 한다 |

**zod 실패를 그대로 500으로 흘리지 않는다.**

## 환경 변수는 빌드 시점에 막는다 (`REQ-IMPL-033`)

```ts
// env.ts
const server = z.object({
  DATABASE_URL: z.string().url(),
  DIRECT_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  AI_TIMEOUT_MS: z.coerce.number().int().positive(),
  CRON_SECRET: z.string().min(16),
})
// NEXT_PUBLIC_ 접두어 목록을 화이트리스트로 고정한다
```

**비밀 값에 `NEXT_PUBLIC_`을 붙이면 클라이언트로 나간다.** 특히 `SUPABASE_SERVICE_ROLE_KEY`는 넘어가는 순간 RLS 전체가 무력해진다.
