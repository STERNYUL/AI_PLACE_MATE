# AI-Place-Mate

Claude Code가 작업 시작 시 자동 로드하는 프로젝트 컨텍스트다.

---

## 1. 이 프로젝트가 무엇인가

**조건에 맞는 식당 후보 3곳을 근거와 함께 제시하는 서비스.** 네이버 지도 내 탭으로 진입하는 모바일 웹이다.

핵심은 **"판정하지 않고 근거를 준다"** 는 것이다. 시스템은 "조용한 편"처럼 평가하지 않고, 확인된 사실과 그 출처·일자만 제시한다.

| 문서 | 역할 | ID |
| --- | --- | --- |
| [`[PRD]ai-place-prd-v0.1.html`](%5BPRD%5Dai-place-prd-v0.1.html) | 제품 정의 | — |
| [`[SRS]ai-place -mate-SRSv1.0.md`](%5BSRS%5Dai-place%20-mate-SRSv1.0.md) | **무엇을** 만족하나 — 요구사항 59건 | `SRS-AIPLACE-MVP-001` v1.9 |
| [`[DIAGRAMS]DESIGN-ai-place-v1.0.md`](%5BDIAGRAMS%5DDESIGN-ai-place-v1.0.md) | **어떻게** 실현하나 — 플랫폼 비종속 | `SDD-AIPLACE-MVP-001` |
| [`SRS-ai-place-nextjs-v1.0.md`](SRS-ai-place-nextjs-v1.0.md) | **구현 제약** `REQ-IMPL` 34건 · 충돌 해소 11건 | `SRS-AIPLACE-NEXT-001` |
| [`DESIGN-ai-place-nextjs-v1.0.md`](DESIGN-ai-place-nextjs-v1.0.md) | 런타임 설계 — 경계·캐시·RLS·Cron | `SDD-AIPLACE-NEXT-001` |
| [`TASKS-ai-place-v1.0.md`](TASKS-ai-place-v1.0.md) | 태스크 원장 50건 | `TASKS-AIPLACE-MVP-001` v1.1 |
| [`EXEC-ai-place-v1.0.md`](EXEC-ai-place-v1.0.md) · [`-compressed`](EXEC-ai-place-compressed-v1.0.md) | 의존 DAG · 임계 경로 16주 / 압축 12주 | `EXEC-AIPLACE-*` |

**작업 단위는 GitHub 이슈 84건**(`#94`~`#178`) · 본문 `docs/issues-aiplace/tasks/<ID>.md` · [프로젝트 보드 #2](https://github.com/users/STERNYUL/projects/2)

---

## 2. 절대 깨지 않는 4가지 (SRS §8.3)

**어떤 태스크에서도 예외가 없다.** 각 태스크의 검증 시나리오 네 번째가 이것이다.

| # | 규칙 | 구현상 의미 |
| --- | --- | --- |
| **1** | **근거 4항목 없는 후보는 반환하지 않는다** | 선정 이유 · 근거 속성 · 확인 일자 · 확인 주체. `EvidenceGate`가 **정렬보다 앞** (`REQ-IMPL-010`) |
| **2** | **어느 경로에서도 빈 화면을 반환하지 않는다** | 파싱 실패는 예외가 아니라 **정상 경로의 분기** (`REQ-IMPL-013`) |
| **3** | **주관적 판정을 내리지 않는다** | 사실 값만. `STALE`은 **제외 사유가 아니라 경고** |
| **4** | **노출 순서를 판매하지 않는다** | 적합도가 1순위 정렬 키. 가격은 정렬 키가 아니다 (ADR-004) |

---

## 3. 기술 스택 — 서버리스가 전제다

**상주 프로세스 · 별도 캐시 서버 · 별도 로그 저장소가 없다.** 이 셋이 설계 곳곳을 규정한다.

| 층 | 채택 | 결정적 제약 |
| --- | --- | --- |
| 프레임워크 | Next.js App Router · TypeScript | 단일 배포 단위. 별도 백엔드 프로세스 없음 (`C-TEC-001`) |
| 배포 | Vercel — Edge(middleware) + Node(Functions) | **DB에 닿는 경로는 전부 Node.** Prisma가 Edge에서 안 돈다 |
| DB | Supabase PostgreSQL + **RLS** | 클라이언트가 Realtime 직접 구독 → **RLS가 유일한 방어선** (`C-DRV-004`) |
| ORM | Prisma — **Pooler transaction mode** | prepared statement · 대화형 트랜잭션 · advisory lock **금지** (`C-DRV-005`) |
| 인증 | Supabase Auth + MFA(TOTP) | 콘솔은 MFA 필수 (`C-DRV-008`) |
| 캐시 | Next.js Data Cache | **별도 캐시 서버 없음** (`C-DRV-006`). TTL 6h + 태그 |
| AI | Vercel AI SDK + Gemini | provider 고유 API 직접 호출 금지 (`C-TEC-005`·`006`) |
| 배치 | Vercel Cron | **부분 완료 가능**해야 한다. 실행 시간 상한 미상 (`C-DRV-002`) |
| UI | Tailwind + shadcn/ui | 임의 CSS 파일 금지 (`C-TEC-004`) |
| 검증 | zod (`env.ts` 포함) | 누락 환경 변수로 배포되는 것을 **빌드 시점에 차단** |

---

## 4. 디렉터리 — 도메인 로직이 어디 사는가

```
app/
  (search)/actions.ts        queryCandidates()      ← POST /v1/query
  (room)/[roomId]/           openRoom()             ← POST /v1/agent-rooms   [Phase 2]
  (booking)/actions.ts       예약·결제
  console/actions.ts         매장 콘솔               [MFA 보호]
  api/
    proposals/route.ts       ← POST /v1/proposals   [외부 호출 · 서명 검증]
    payment/webhook/route.ts ← PG 웹훅              [멱등 필수]
    share-cards/route.ts     ← POST /v1/share-cards [스트리밍]
    cron/_auth.ts            CRON_SECRET 검증
    cron/{normalize-rooms,judge-no-show,purge-origins,aggregate-kpi}/route.ts
lib/
  db/        Prisma Client 독점 · 감사 래퍼
  index/     색인 · canonicalKey · 캐시
  search/    파싱 · 필터 · 정렬
  evidence/  근거 게이트 · 공유 카드
  room/      대화방 · 제안 · 지연 평가
  merchant/  프로필 · 수용 조건 매칭
  booking/   예약 · 결제 · 노쇼
  tracking/  이벤트 · KPI
  ai/        AI SDK 래퍼 (단일 창구)
  auth/      Supabase Auth · MFA
components/ui/               shadcn/ui
components/candidate-card.tsx 근거 4항목 필수 props
prisma/schema.prisma         데이터 구조 단일 원천
env.ts · vercel.json
```

### 모듈 의존 — 이 방향만 허용한다 (`REQ-IMPL-002`)

```
app ──→ search ──→ evidence ──→ index ──→ db
 │        └──────→ index         └────→ ai
 ├──→ room ──→ merchant ──→ db
 │      └────→ evidence
 ├──→ booking ──→ room
 └──→ tracking ──→ db
```

| 규칙 | 내용 |
| --- | --- |
| **단방향** | 역방향 import 금지. **순환 의존 0건** |
| **`lib/db` 독점** | Prisma Client는 `lib/db`만 노출. 다른 모듈이 직접 인스턴스화하지 않는다 |
| **`lib/ai` 독점** | Gemini 호출은 `lib/ai`만 수행 |
| **`lib/evidence` 공유** | `search`·`room` 양쪽이 쓴다. **중복 구현 금지** |
| **`app/` 순수성** | 라우팅·검증·직렬화만. **도메인 판정 로직을 두지 않는다** |

---

## 5. Server Action vs Route Handler (`REQ-IMPL-003`)

**섞으면 인증·검증이 이중화된다.** 기준은 하나다.

| 조건 | 선택 | 실제 위치 |
| --- | --- | --- |
| 화면에서 발생하는 **내부 변경** | **Server Action** | `app/(search)/actions.ts` 등 |
| **외부 시스템**이 호출 | **Route Handler** + 서명 검증 | `app/api/proposals` · `payment/webhook` |
| **Vercel Cron**이 호출 | **Route Handler** | `app/api/cron/**` — Cron은 URL만 호출한다 |
| **스트리밍** 응답 | **Route Handler** | `app/api/share-cards` |
| **조회만** 하는 초기 렌더 | **Server Component 직접 조회** | Action·Handler를 두지 않는다 |

> **판정 순서** — 런타임(Node/Edge)을 **먼저** 정하고 호출자를 나중에 정한다. 반대로 하면 Server Action으로 정한 뒤 Prisma를 못 쓴다는 걸 뒤늦게 발견한다.

---

## 6. 환경 변수 (`REQ-IMPL-033`)

**`NEXT_PUBLIC_` 접두는 공개다.** 비밀 값에 붙이면 클라이언트로 나간다.

| 서버 전용 | 공개 |
| --- | --- |
| `DATABASE_URL`(Pooler) · `DIRECT_URL`(마이그레이션 전용) | `NEXT_PUBLIC_SUPABASE_URL` |
| `SUPABASE_SERVICE_ROLE_KEY` — **넘어가면 RLS 전체 무력** | `NEXT_PUBLIC_SUPABASE_ANON_KEY` |
| `AI_PROVIDER` · `AI_MODEL` · `AI_TIMEOUT_MS` · `GOOGLE_GENERATIVE_AI_API_KEY` | |
| `CRON_SECRET` · `PG_API_KEY` · `PG_WEBHOOK_SECRET` · `FEATURE_AGENT_ROOM` | |

---

## 7. Phase 게이트

| Phase | 게이트 | 미달 시 |
| --- | --- | --- |
| **0** 내부 드라이런 | 파싱 실패율 ≤ 3% · Top-3 p95 ≤ 1.5s | Phase 1 보류 |
| **1** 클로즈드 베타 | WEBD ≥ 60% · 불일치 신고 ≤ 15% · 가맹 LOI ≥ 30곳 | Phase 2 미착수 |
| **1 말** | 선택 제안 노쇼율 계측 개시 | — |
| **2** 오픈 베타 *(조건부)* | 제안 도착률 ≥ 70% · 노쇼 ≤ 8% | **15건 통째로 v0.2 이월** |

> **Phase 2 태스크에 Phase 1 태스크를 의존시키지 않는다.** 이월 단위가 깨진다.
> Phase 2 노출은 `FEATURE_AGENT_ROOM` 플래그로 가린다.

---

## 8. 서브에이전트 · 커맨드 라우팅

수동 호출은 `> use the <name> subagent` 또는 `/<command>`.

| 서브에이전트 | 언제 | 대응 태스크 |
| --- | --- | --- |
| `nextjs-runtime` | 서버 경로 추가 · Edge/Node · 캐시 태그 · Server/Client 경계 | `CLI-*` `IN-A` |
| `data-access` | Prisma 쿼리 · 마이그레이션 · RLS · 동시성 · 인덱스 | `IDX-*` `RSV-*` `MCH-A` |
| `domain-invariants` | 근거 게이트 · 빈 화면 · 판정 금지 · 정렬 | `EVD-*` `SRC-D` `CLI-C` |
| `ai-provider` | 파싱 · 근거 문장 · provider 추상화 · 비용 | `SRC-A` `EVD-B` `TRK-E` |
| `testing-verification` | GWT 시나리오 · 커버리지 대조표 · 판정 불가 | `TEST-*` 17건 |
| `security-privacy` | 파기 · 옵트인 · 감사 · MFA · 결제 | `PRV-*` `IN-B` `TEST-014c` |
| `tracking-observability` | 이벤트 22종 · KPI · 누락률 게이트 · SLO | `TRK-*` `IN-C` |
| `ux-design-system` | 토큰 · 화면 설계 · 라이팅 · 열화 상태 | `UX-*` 8건 |

| 커맨드 | 목적 |
| --- | --- |
| `/task-start <이슈번호>` | 선행 완료 **기계 검증** 후 착수 |
| `/task-done <이슈번호>` | 인수 기준 검증 후 종료 · 보드 갱신 |
| `/deps` | 지금 착수 가능한 것 · 임계 경로 · 막힌 것 |
| `/review-invariants` | 4대 불변 규칙 감사 |
| `/spec-trace` | 요구사항 ↔ 코드 ↔ 테스트 추적성 |
| `/fix-error` | 에러 7단계 구조화 진단 |
| `/setup-env` | 빌드 · 환경변수 · 스킬 설치 |
| `/gitflow-commit` | 이슈 연동 커밋 · PR |

### 스킬 (`.claude/skills/`) — 자동 적용

| 번호 | 스킬 | 무엇을 막나 |
| --- | --- | --- |
| `102` | **UX 단계 산출물** | 문서 경로·6절 구조·판정형 어휘 금지 목록 이탈 |
| `200` `201` `202` | git · 주석 · 이슈/보드 | 협업 규칙 |
| `300` | API 계약 | 단위 반올림 · 임의 상태 코드 · 페이지네이션 신설 |
| `301` | 서버리스 멱등 | 실행 시간 상한 의존 · 재실행 중복 부수효과 |
| `302` | Mock 서버 | 계약과 어긋난 Mock · 자동 검증 부재 |
| `303` | zod 경계 | 타입 단언으로 넘어가는 미검증 입력 |
| `304` | 오류 열화 | 빈 화면 반환 경로 |
| `305` | 개인정보 | 서버로 새는 개인 제약 · 감사 누락 |

외부 도입 — `goal-setting` · `grill-it` · `review-merge`

### 장기 실행 목표 (`docs/goals/`)

| 파일 | 단계 | 호출 |
| --- | --- | --- |
| `ux-design-stage.md` | UX 설계 6건 (`#140`~`#145`) | `/goal 지금부터 docs/goals/ux-design-stage.md 에 명시된 목표를 달성하기 위한 작업을 시작하라` |

`goal-setting` 스킬로 설계했다. Required 4섹션 + Three Pillars를 만족하며, **검증 명령이 `gh`·`git`·텍스트 도구만 쓴다** — 이 환경에 Node가 없기 때문이다.

---

## 9. 작업 규칙

- **착수 전 태스크 본문을 읽는다** — `Depends on` · 인수 기준 · `⚙️ Constraints`.
- **선행이 안 끝났으면 착수하지 않는다.** 본문의 `Depends on`에 `#번호`가 달려 있다.
- **`main`에 직접 커밋하지 않는다** (`REQ-IMPL-031`). 브랜치는 `<type>/<이슈번호>-<설명>`.
- **마이그레이션은 배포 자동화에 넣지 않는다** (`REQ-IMPL-030`). Direct URL로 선행 실행 후 배포.
- 주석은 **WHY**만. **요구사항 ID를 적는다** — `// REQ-NF-002: p95 400ms`.
- 새 규칙의 자리 — 항상 적용은 이 파일, 도메인 지식은 `agents/`, 절차는 `commands/`, 코딩 규칙은 `skills/`.
