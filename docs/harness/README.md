# 에이전트 하네스 — 구성과 판정 근거

**출처 하네스:** [`wild-mental/AI-multivender-harness-sample`](https://github.com/wild-mental/AI-multivender-harness-sample)
**마켓플레이스:** [skills.sh](https://www.skills.sh/) — 채택안은 [`skills-marketplace.md`](skills-marketplace.md)
**최종 갱신:** 2026-08-26

---

## 1. 원본을 거의 못 쓴 이유

원본은 **Java · Spring Boot · Gradle · JPA/QueryDSL · Kafka · MySQL · Redis · React(Vite) · Flutter** 기준이다.
이 프로젝트는 **Next.js · TypeScript · Vercel · Supabase(PostgreSQL) · Prisma** 다.

겹치지 않는 게 스택만이 아니다. **원본은 상주 프로세스 · 3계층 · `@Transactional` 경계를 전제**하는데, 여기는 서버리스라 셋 다 성립하지 않는다.

| 원본 전제 | 이 프로젝트 |
| --- | --- |
| Service 계층에서 트랜잭션 관리 | **대화형 트랜잭션 금지** (`C-DRV-005`). 조건부 UPDATE/INSERT로 동시성 표현 |
| Redis 분산락 | **advisory lock 금지.** 유일 제약으로 대체 |
| 배치 = 상주 스케줄러 | **부분 완료 + 다음 트리거 이어받기** (`C-DRV-002`) |
| Repository가 DB 접근 통제 | **RLS가 유일한 방어선** (`C-DRV-004` — 클라이언트 직접 구독) |
| 별도 캐시 서버(Redis) | **Next.js Data Cache만** (`C-DRV-006`) |

이 차이를 모르고 원본 규칙을 그대로 쓰면 **런타임에서 깨진다.** 각색이 아니라 폐기한 항목이 많은 이유다.

---

## 2. 판정 결과 — 원본 50파일

| 판정 | 건수 |
| --- | --- |
| 재사용 (스택 무관 프로세스) | 8 |
| 각색 (뼈대 유지, 내용 교체) | 6 |
| **폐기 (스택 불일치)** | **25** |
| 신규 (설계 문서에서 도출) | 27 |

### 폐기 25

| 원본 | 사유 |
| --- | --- |
| `agents/java-spring` `gradle` `jpa-querydsl` | Java·Spring·Gradle·JPA 미사용 |
| `agents/spring-redis` `skills/303-spring-redis-*` | **별도 캐시 서버 없음** (`C-DRV-006`) |
| `agents/kafka-pipeline` `kafka-saga` `skills/304-kafka-*` `305-kafka-msa-saga-*` | Kafka 없음. 이벤트는 큐 → Postgres 파티션 |
| `agents/react-frontend` `skills/306-react-vite-tailwind-*` | **Vite 아니라 App Router.** RSC 경계 규칙이 정반대 |
| `agents/flutter-app` `skills/307-flutter-riverpod-*` | 모바일 앱이 아니라 모바일 **웹** |
| `skills/300-java-spring-*` `301-gradle-groovy-*` `302-jpa-querydsl-*` | 상동 |
| `skills/302-python-fastapi-*` | Python 미사용 |
| `skills/303-database-mysql-jpa-*` | MySQL 아니라 **PostgreSQL + RLS** |
| `skills/305-api-swagger-testing-*` | 계약은 `SPEC-001`~`009`가 정본 |
| `skills/306-three-tier-architecture-*` (425행) | **`@Transactional` 3계층 전제.** 서버리스에서 성립 안 함 |
| `.cursor/**` (17 스킬 + 3 rules + 1 agent) | 벤더 중복. `AGENTS.md`가 Cursor·Antigravity를 커버 |
| `.gemini/agents/readme-architect` | Gemini 미사용 |
| `README-*-harness.md` 4종 | 원본 사용법. 이 문서로 대체 |

### 재사용 8 · 각색 6

`100-error-fixing-process`→`/fix-error` · `101-build-and-env-setup`→`/setup-env` · `102-gitflow-agent`→`/gitflow-commit` ·
`200-git-commit-push-pr` · `201-code-commenting` · `202-github-issue-handling` · `304-api-rest-design`→`300-api-contract-rules` ·
`CLAUDE.md`·`AGENTS.md` 구조 · 스킬 번호 체계

---

## 3. 구성 — 최종

```
CLAUDE.md        203행    항상 적용 · 4대 불변 규칙 · 디렉터리 · 모듈 의존 · 환경변수 · 라우팅
AGENTS.md         41행    크로스툴 요약 (Cursor · Antigravity)

.claude/agents/     8종 · 988행   도메인 지식 — 위임 대상
.claude/commands/   8종 · 553행   절차
.claude/skills/    14종           코딩 규칙 — 자동 적용 (외부 3종 포함)
docs/goals/         1종           장기 실행 /goal 프롬프트

docs/harness/README.md · skills-marketplace.md
```

### 에이전트 8종 — 태스크 84건을 나눠 덮는다

| 에이전트 | 덮는 태스크 | 핵심 강제 사항 |
| --- | --- | --- |
| `nextjs-runtime` | `CLI-*` `IN-A` | 런타임 판정 순서 · 캐시 금지 4종 · `'use client'` 4종 제한 |
| `data-access` | `IDX-*` `RSV-*` `MCH-A` | Pooler 금지 5종 · 지연 평가 · RLS 기본 거부 |
| `domain-invariants` | `EVD-*` `SRC-D` `CLI-C` | 게이트가 정렬 앞 · 타입 수준 4항목 강제 |
| `ai-provider` | `SRC-A` `EVD-B` `TRK-E` | `ModelFactory` 단일 · Port 격리 · 시한 · 12원 상한 |
| `testing-verification` | `TEST-*` 17건 | 시나리오 4종 · **판정 불가를 통과로 접지 않기** |
| `security-privacy` | `PRV-*` `IN-B` `TEST-014c` | 수집 안 함 · 감사 래퍼 · 법령 3건 블로커 |
| `tracking-observability` | `TRK-*` `IN-C` | 누락률 5% 게이트 · 시각 기반 집계 |
| `ux-design-system` | `UX-*` 8건 | 라이팅 = 요구사항 · 열화 6상태 · 토큰 하드코딩 0건 |

### 커맨드 8종

| 커맨드 | 하는 일 |
| --- | --- |
| `/task-start` | 선행 이슈 상태를 `gh`로 **기계 검증** 후 브랜치 생성 |
| `/task-done` | 인수 기준 4종 대조 → 이슈 종료 → 보드 → **해제된 후행 보고** |
| `/deps` | `Blockers=0` 착수 가능 · 임계 경로 8건 · Phase 게이트 진행률 |
| `/review-invariants` | 4대 불변 규칙을 `grep`으로 감사. 애매하면 실패 처리 |
| `/spec-trace` | SRS → 설계 → 태스크 → 코드 4층 추적. 커버리지 59/58 확인 |
| `/fix-error` | 7단계 + **이 프로젝트에서 자주 걸리는 6증상 표** |
| `/setup-env` | Node · Supabase · Prisma · **마켓플레이스 스킬 설치** |
| `/gitflow-commit` | 이슈 연동 · 불변 규칙 PR 기재 |

### 스킬 12종

`102` UX 단계 산출물 · `103` 단계 오케스트레이션 · `200`~`202` 협업 · `300`~`305` 기술 · 외부 3종(`goal-setting` `grill-it` `review-merge`)

**번호 체계** — 100–199 프로세스 · 200–299 협업 · 300–399 기술 종속. 원본 하네스의 de-facto 관행을 따랐다.

---

## 4. 설계 문서 → 하네스 매핑

하네스의 신규 27건은 **설계 문서에 흩어져 있던 제약을 규칙으로 고정**한 것이다.

| 출처 | 옮긴 곳 |
| --- | --- |
| 제약 SRS §3.2 Action/Handler 기준 | `CLAUDE.md` §5 · `nextjs-runtime` §1 |
| 제약 SRS §4.4 모듈 의존 규칙 | `CLAUDE.md` §4 |
| 제약 SRS §8.1 디렉터리 | `CLAUDE.md` §4 |
| 제약 SRS §8.3 Action/Handler 목록 | `nextjs-runtime` §1 |
| 제약 SRS §8.4 환경 변수 | `CLAUDE.md` §6 · `303-zod-boundary` |
| 런타임 SDD §3.3 Pooler 제약 | `data-access` §1 |
| 런타임 SDD §4.2 캐시 매트릭스 | `nextjs-runtime` §3 |
| 런타임 SDD §5.1 RLS 매트릭스 | `data-access` §4 |
| 런타임 SDD §6.3 Cron 설계 | `301-serverless-idempotency` |
| 런타임 SDD §7.3 열화 상태 | `304-error-degradation` |
| 기준 SRS §8.3 비즈니스 규칙 | `domain-invariants` |
| 기준 SRS §6.1·6.3 계측·알림 | `tracking-observability` |

**`REQ-IMPL` 34건이 하네스에 반영됐는지는 `/spec-trace`로 확인한다.**

---

## 5. 새 규칙을 넣을 자리

| 성격 | 위치 |
| --- | --- |
| 항상 적용 · 라우팅 | `CLAUDE.md` |
| 도메인 지식 (위임 대상) | `.claude/agents/` |
| 절차 (사람이 부르는 것) | `.claude/commands/` |
| 코딩 규칙 (자동 적용) | `.claude/skills/` |

**중복을 만들지 않는다.** 같은 규칙이 두 곳에 있으면 한쪽만 갱신되는 순간 어긋난다.
겹치면 한 곳에 두고 다른 곳은 **참조만** 한다 — 예: RLS 매트릭스는 `data-access` §4에만 있고 `security-privacy`는 가리키기만 한다.

---

## 6. 단계 통합 — `docs/goals/`

하네스 자산을 엮어 **한 단계를 끝까지 도는 `/goal` 프롬프트**로 만든 것이다.
`goal-setting` 스킬의 Required 4섹션 + Three Pillars를 따른다.

| 단계 | 파일 | 범위 | 엮은 하네스 자산 |
| --- | --- | --- | --- |
| **UX 설계** (오케스트레이션) | `ux-design-stage.md` | `UX-A`~`UX-H` 8건 (`#140`~`#147`) · 웨이브 3 · 최대 병렬 5레인 | 스킬 `102`·`103` · 에이전트 `ux-design-system`·`domain-invariants` · 커맨드 `/task-start`·`/task-done`·`/review-invariants` |

**검증 명령이 `gh`·`git`·텍스트 도구만 쓴다.** 이 환경에 Node가 없어 `pnpm test exits 0` 류를 증명 명령으로 쓸 수 없기 때문이다.
UX 산출물이 코드가 아니라 **문서**라서 이 제약 아래에서도 완료 판정이 성립한다.

**Phase 2 격리** — `UX-G`(#146) · `UX-H`(#147)는 조건부 이월 단위다. `W1` 레인으로 병렬 실행하되 산출물을 `docs/design/ux/phase2/` 에 격리해, 게이트 미통과 시 그 디렉터리만 통째로 이월한다. 최대 병렬 폭(5레인)을 얻으면서 이월 단위를 깨지 않는 편성이다.
