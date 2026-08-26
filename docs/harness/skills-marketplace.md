# 마켓플레이스 스킬 채택안

**출처:** [skills.sh](https://www.skills.sh/) · **조사일:** 2026-08-26
**설치 전제:** Node.js — 이 프로젝트는 Next.js라 어차피 필수다. `/setup-env` 1단계 참조

> **채택 기준 세 가지** — ① 이 프로젝트의 실제 스택과 일치할 것 ② 공식 퍼블리셔(vendor-official)일 것 ③ 설치 수가 많아 검증되었을 것.
> 스택이 안 맞으면 설치 수가 많아도 채택하지 않았다.

---

## 채택 9종

```bash
npx skills add supabase/agent-skills supabase-postgres-best-practices
npx skills add supabase/agent-skills supabase
npx skills add prisma/skills prisma-client-api
npx skills add prisma/skills prisma-postgres
npx skills add vercel-labs/next-skills next-best-practices
npx skills add vercel-labs/next-skills next-cache-components
npx skills add vercel/ai ai-sdk
npx skills add mattpocock/skills tdd
npx skills add mattpocock/skills code-review
```

| 스킬 | 퍼블리셔 | 설치 수 | 왜 이 프로젝트에 필요한가 |
| --- | --- | --- | --- |
| **supabase-postgres-best-practices** | `supabase/agent-skills` | 369.6K | **RLS가 유일한 방어선**이다(`C-DRV-004`). 클라이언트가 Realtime으로 직접 구독하므로 정책 실수가 곧 데이터 유출이다 |
| **supabase** | `supabase/agent-skills` | 238.9K | Auth·MFA·Realtime·Storage를 전부 쓴다 |
| **prisma-client-api** | `prisma/skills` | 237.3K | Pooler transaction mode 제약 아래 쿼리를 짜야 한다 |
| **prisma-postgres** | `prisma/skills` | 231.4K | 스키마·마이그레이션. `IDX-A`가 후행 11건을 막는 임계 경로다 |
| **next-best-practices** | `vercel-labs/next-skills` | — | RSC 경계·async API·파일 규약. 런타임 경계가 이 프로젝트 설계의 축이다 |
| **next-cache-components** | `vercel-labs/next-skills` | — | **별도 캐시 서버가 없다**(`C-DRV-006`). `cacheTag`·`revalidateTag`만으로 히트율 70%를 맞춰야 한다 |
| **ai-sdk** | `vercel/ai` | — | 조건 파싱(구조화 출력)과 근거 문장(스트리밍) 둘 다 AI SDK다 |
| **tdd** | `mattpocock/skills` | 768.4K | 검증 태스크가 **17건**이고 인수 기준이 GWT로 쓰여 있다 |
| **code-review** | `mattpocock/skills` | 415.1K | 4대 불변 규칙 위반을 리뷰에서 잡아야 한다 |

---

## 보류 3종 — 필요해지면 추가

| 스킬 | 왜 지금은 아닌가 |
| --- | --- |
| `vercel-react-best-practices` (663.6K) | 프론트엔드 성능 규칙 69개. **`CLI-E`(LCP 2.5s) 착수 시점**에 추가한다. 지금 넣으면 백엔드 작업에 노이즈다 |
| `vercel-composition-patterns` (305.6K) | 컴포넌트 합성. `CLI-A`~`C` 화면 구현 단계에서 |
| `deploy-to-vercel` | `IN-A`~`IN-G` 인프라 태스크 착수 시점에 |

## 미채택 — 스택 불일치

`turborepo`(모노레포 아님) · `improve-codebase-architecture`(795.2K, 범용이나 이 프로젝트는 SDD가 구조를 이미 고정) · `test-driven-development`(`obra/superpowers` — `mattpocock/skills tdd`와 중복)

---

## 프로젝트 자체 스킬과의 경계

마켓플레이스 스킬은 **일반 지식**이고, `.claude/skills/`의 자체 스킬은 **이 프로젝트의 결정**이다. 충돌하면 자체 스킬이 우선이다.

| 겹치는 영역 | 마켓플레이스 | 자체 |
| --- | --- | --- |
| Prisma 쿼리 | `prisma-client-api` — 일반 API 사용법 | `data-access` §1 — **Pooler transaction mode 금지 항목** |
| Next.js 캐시 | `next-cache-components` — 캐시 API | `nextjs-runtime` §2 — **무엇을 캐시하지 않는지** |
| 테스트 | `tdd` — TDD 절차 | 태스크 본문의 GWT 인수 기준 |
| 코드 리뷰 | `code-review` — 일반 관점 | `domain-invariants` — **4대 불변 규칙** |

> 예 — `next-cache-components`는 "캐시하라"고 하지만, 이 프로젝트에서 **확인 상태는 캐시하면 안 된다**(60초 반영 요구). 자체 스킬이 이긴다.
