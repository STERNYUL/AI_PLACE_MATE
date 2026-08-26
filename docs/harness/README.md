# 에이전트 하네스 — 구성과 판정 근거

**출처 하네스:** [`wild-mental/AI-multivender-harness-sample`](https://github.com/wild-mental/AI-multivender-harness-sample)
**이식일:** 2026-08-26

원본 하네스는 **Java · Spring Boot · Gradle · JPA/QueryDSL · Kafka · MySQL · Redis · React(Vite) · Flutter** 기준이다.
이 프로젝트는 **Next.js · TypeScript · Vercel · Supabase(PostgreSQL) · Prisma** 라서 **스택 종속 규칙이 거의 전부 무효**였다.

---

## 판정 결과

원본 50개 파일 중 **재사용 8 · 각색 6 · 폐기 25 · 신규 12**.

### 폐기 — 스택 불일치 (25)

| 원본 | 폐기 사유 |
| --- | --- |
| `agents/java-spring` `agents/gradle` `agents/jpa-querydsl` | Java·Spring·Gradle·JPA를 쓰지 않는다 |
| `agents/spring-redis` `skills/303-spring-redis-*` | **별도 캐시 서버가 없다** (`C-DRV-006`). Next.js Data Cache만 쓴다 |
| `agents/kafka-pipeline` `agents/kafka-saga` `skills/304-kafka-*` `skills/305-kafka-msa-saga-*` | Kafka가 없다. 이벤트는 큐 → Postgres 파티션 테이블이다 |
| `agents/react-frontend` `skills/306-react-vite-tailwind-*` | **Vite가 아니라 Next.js App Router**다. RSC 경계 규칙이 정반대다 |
| `agents/flutter-app` `skills/307-flutter-riverpod-*` | 모바일 앱이 아니라 모바일 **웹**이다 |
| `skills/300-java-spring-*` `skills/301-gradle-groovy-*` `skills/302-jpa-querydsl-*` | 상동 |
| `skills/302-python-fastapi-*` | Python을 쓰지 않는다 |
| `skills/303-database-mysql-jpa-*` | MySQL이 아니라 **PostgreSQL + RLS**다 |
| `skills/305-api-swagger-testing-*` | Swagger/SpringDoc이 아니다. 계약은 `SPEC-001`~`009`가 정본 |
| `skills/306-three-tier-architecture-*` (425행) | Controller/Service/Repository 3계층 + `@Transactional` 전제. **서버리스라 트랜잭션 경계가 다르다** |
| `.cursor/**` (17 스킬 + 3 rules + 1 agent) | 벤더 중복. `AGENTS.md`가 Cursor·Antigravity를 커버한다 |
| `.gemini/agents/readme-architect` | Gemini를 쓰지 않는다 |
| `README-*-harness.md` 4종 | 원본 하네스 사용법. 이 문서로 대체 |

### 재사용 — 스택 무관 프로세스 (8)

`100-error-fixing-process`(→ `/fix-error`) · `200-git-commit-push-pr` · `201-code-commenting` · `202-github-issue-handling` ·
`102-gitflow-agent`(→ `/gitflow-commit`) · `101-build-and-env-setup`(→ `/setup-env`) · `generate-tasks-from-srs` · `AGENTS.md` 구조

### 각색 — 뼈대는 살리고 내용 교체 (6)

| 원본 | 이 프로젝트 |
| --- | --- |
| `CLAUDE.md` (Spring 템플릿) | 스택·4대 불변 규칙·Phase 게이트·라우팅으로 전면 재작성 |
| `AGENTS.md` (사업계획 템플릿) | 요약본으로 재작성. `CLAUDE.md`가 정본 |
| `commands/setup-env` (Gradle) | Node·pnpm·Supabase·Prisma·**마켓플레이스 스킬 설치** |
| `commands/fix-error` | 7단계 유지 + **이 프로젝트에서 자주 걸리는 6증상** 표 추가 |
| `commands/gitflow-commit` | 이슈 84건 연동 · 불변 규칙 PR 기재 |
| `skills/304-api-rest-design` | `300-api-contract-rules` — SRS §8.1.1 단위·상태 코드·**Top-3 고정(페이지네이션 없음)** |

### 신규 — 이 프로젝트에만 있는 제약 (12)

원본에 대응물이 없다. **설계 문서에서 뽑아 규칙으로 고정**한 것이다.

| 신규 | 무엇을 고정하나 |
| --- | --- |
| `agents/nextjs-runtime` | Edge/Node 판정 순서 · 캐시 태그 매트릭스 · Server/Client 경계 4종 |
| `agents/data-access` | **Pooler transaction mode 금지 5종** · 지연 평가 · RLS 매트릭스 · 감사 래퍼 |
| `agents/domain-invariants` | **4대 불변 규칙**의 구현 강제 방법 |
| `agents/tracking-observability` | 이벤트 22종 · **누락률 5% 게이트** · 알림 임계 4종 |
| `commands/task-start` | **선행 완료 기계 검증** 후 착수 |
| `skills/301-serverless-idempotency` | **실행 시간 상한에 의존하지 않는** 배치 설계 |
| `docs/harness/skills-marketplace.md` | 마켓플레이스 채택 9종 + 보류 3종 |

---

## 구조

```
CLAUDE.md                          항상 적용 · 라우팅
AGENTS.md                          크로스툴 요약 (Cursor · Antigravity)
.claude/
  agents/       4종                도메인 지식 — 위임 대상
  commands/     4종                절차 — /task-start /fix-error /setup-env /gitflow-commit
  skills/       5종                코딩 규칙 — 자동 적용
docs/harness/
  README.md                        이 문서
  skills-marketplace.md            마켓플레이스 채택안
```

**새 규칙을 넣을 자리** — 항상 적용은 `CLAUDE.md`, 도메인 지식은 `agents/`, 절차는 `commands/`, 코딩 규칙은 `skills/`.

---

## 원본과 갈라진 가장 큰 지점

원본은 **상주 프로세스 · 3계층 · `@Transactional` 경계**를 전제한다.
이 프로젝트는 **서버리스**라 셋 다 성립하지 않는다.

| 원본 전제 | 이 프로젝트 |
| --- | --- |
| Service 계층에서 트랜잭션 관리 | **대화형 트랜잭션 금지.** 조건부 UPDATE/INSERT로 동시성 표현 |
| Redis 분산락 | **advisory lock 금지.** 유일 제약으로 대체 |
| 배치 = 상주 스케줄러 | **부분 완료 + 다음 트리거 이어받기** |
| Repository가 DB 접근 통제 | **RLS가 유일한 방어선** (클라이언트 직접 구독) |

이 차이를 모르고 원본 규칙을 그대로 쓰면 **런타임에서 깨진다.** 그래서 각색이 아니라 폐기한 항목이 많다.
