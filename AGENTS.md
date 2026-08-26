# AI-Place-Mate — Agent Instructions

크로스툴 규칙 파일이다 (Cursor · Google Antigravity · Claude Code 공통).
**상세는 [`CLAUDE.md`](CLAUDE.md)에 있고 이 파일은 요약이다.** 둘이 어긋나면 `CLAUDE.md`가 정본이다.

---

## 프로젝트

조건에 맞는 식당 후보 3곳을 **근거와 함께** 제시하는 모바일 웹. 네이버 지도 내 탭으로 진입한다.
요구사항은 `[SRS]ai-place -mate-SRSv1.0.md` 59건, 작업 단위는 GitHub 이슈 84건(`#94`~`#178`)이다.

## 절대 규칙 4가지

1. **근거 4항목**(선정 이유·근거 속성·확인 일자·확인 주체)이 없는 후보는 반환하지 않는다. 검증 게이트는 **정렬보다 앞**이다.
2. **빈 화면을 반환하지 않는다.** 파싱 실패는 정상 경로의 분기로 처리한다.
3. **주관적 판정을 하지 않는다.** 사실 값만 표시하고 평가 문구를 만들지 않는다.
4. **노출 순서를 판매하지 않는다.** 적합도가 1순위 정렬 키다.

## 스택

Next.js App Router · TypeScript · Vercel(Edge+Node) · Supabase(PostgreSQL+RLS+Auth/MFA+Realtime+Storage) ·
Prisma(Pooler transaction mode) · Vercel AI SDK + Gemini · Tailwind + shadcn/ui · zod

**서버리스다.** 상주 프로세스·별도 캐시 서버·별도 로그 저장소가 없다.

## 코드 규칙

- **DB에 닿는 경로는 전부 Node 런타임.** Prisma는 Edge에서 동작하지 않는다.
- **Pooler transaction mode 제약** — prepared statement, 대화형 트랜잭션, advisory lock, `SET LOCAL` 전부 금지. 동시성은 유일 제약과 조건부 UPDATE로 표현한다.
- **RLS가 유일한 방어선.** 테이블 생성 마이그레이션에 정책을 같은 파일로 넣는다. 기본 거부.
- **Server Action 경계는 zod로 런타임 검증.** 타입만으로는 부족하다.
- **Cron은 부분 완료 가능해야 한다.** 함수 실행 시간 상한에 의존하지 않는다.
- 기본은 Server Component. `'use client'`는 상태·구독·타이머가 필요할 때만.
- 주석은 WHY만. WHAT은 코드로 표현한다.

## Git

- `main`에 직접 커밋하지 않는다. 브랜치는 `<type>/<이슈번호>-<설명>`.
- Conventional Commits. 한 커밋에 한 목적.
- 착수 전 `docs/issues-aiplace/tasks/<ID>.md`의 `Depends on`을 확인한다. 선행 미완료면 착수하지 않는다.
