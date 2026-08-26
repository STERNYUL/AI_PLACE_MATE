---
description: 빌드·환경변수·에이전트 스킬 설치 점검
argument-hint: [선택: dev | preview | prod]
allowed-tools: Read, Edit, Write, Grep, Glob, Bash
---

# 환경 점검 — **$ARGUMENTS** (미지정 시 `dev`)

## 1. 전제 도구

```bash
node --version   # Next.js 프로젝트의 하드 전제
pnpm --version   # 또는 npm
gh --version     # 이슈·프로젝트 연동에 필요
```

**Node가 없으면 여기서 멈추고 설치 안내를 한다.** 이후 단계가 전부 막힌다.

## 2. 에이전트 스킬 설치

마켓플레이스에서 채택한 스킬 목록과 채택 사유는 [`docs/harness/skills-marketplace.md`](../../docs/harness/skills-marketplace.md)에 있다.

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

설치 후 `.claude/skills/`에 들어간 것을 확인한다. **프로젝트 자체 스킬(`1xx`·`2xx`·`3xx`)과 이름이 겹치지 않는지 본다.**

## 3. 환경변수

| 구분 | 키 | 비고 |
| --- | --- | --- |
| DB | `DATABASE_URL` | **Pooler(transaction mode)** URL |
| DB | `DIRECT_URL` | 마이그레이션 전용 직결 |
| Supabase | `NEXT_PUBLIC_SUPABASE_URL` · `NEXT_PUBLIC_SUPABASE_ANON_KEY` | 클라이언트 노출 |
| Supabase | `SUPABASE_SERVICE_ROLE_KEY` | **서버 전용.** 클라이언트로 넘어가면 RLS 전체가 무력해진다 |
| AI | `AI_PROVIDER` · `AI_MODEL` · `AI_TIMEOUT_MS` | 모델 교체가 환경변수만으로 끝나야 한다 |
| Cron | `CRON_SECRET` | Route Handler에서 검증 |
| PG | PG사 키 | **미확정** — `RSV-C` 블로커 |

**점검**
- `NEXT_PUBLIC_` 접두가 붙은 키에 비밀 값이 없는가
- `.env*`가 `.gitignore`에 있는가
- Preview 환경이 운영 데이터를 보지 않는가 (`REQ-IMPL-032`)

## 4. DB 연결 확인

```bash
# 풀러는 앱용, 직결은 마이그레이션용 — 둘이 다른 URL이어야 한다
echo "$DATABASE_URL" | grep -q 'pgbouncer\|pooler' || echo "경고: DATABASE_URL이 풀러가 아닐 수 있다"
```

## 5. 산출물

누락 키, 설정 불일치, 클라이언트 노출 위험을 보고한다. 필요하면 `.env.example`을 갱신한다.
