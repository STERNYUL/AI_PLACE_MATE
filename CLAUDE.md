# AI-Place-Mate

Claude Code가 작업 시작 시 자동 로드하는 프로젝트 컨텍스트다.

---

## 1. 이 프로젝트가 무엇인가

**조건에 맞는 식당 후보 3곳을 근거와 함께 제시하는 서비스.** 네이버 지도 내 탭으로 진입하는 모바일 웹이다.

핵심은 **"판정하지 않고 근거를 준다"** 는 것이다. 시스템은 "조용한 편"처럼 평가하지 않고, 확인된 사실과 그 출처·일자만 제시한다.

| 문서 | 역할 |
| --- | --- |
| [`[PRD]ai-place-prd-v0.1.html`](%5BPRD%5Dai-place-prd-v0.1.html) | 제품 정의 |
| [`[SRS]ai-place -mate-SRSv1.0.md`](%5BSRS%5Dai-place%20-mate-SRSv1.0.md) | **무엇을** 만족해야 하나 — 요구사항 59건 (ISO/IEC/IEEE 29148) |
| [`[DIAGRAMS]DESIGN-ai-place-v1.0.md`](%5BDIAGRAMS%5DDESIGN-ai-place-v1.0.md) | **어떻게** 실현하나 — 플랫폼 비종속 설계 |
| [`SRS-ai-place-nextjs-v1.0.md`](SRS-ai-place-nextjs-v1.0.md) | 구현 제약 `REQ-IMPL` 34건 · 충돌 해소 11건 |
| [`DESIGN-ai-place-nextjs-v1.0.md`](DESIGN-ai-place-nextjs-v1.0.md) | 런타임 설계 — 경계·캐시·RLS·Cron |
| [`TASKS-ai-place-v1.0.md`](TASKS-ai-place-v1.0.md) | 태스크 원장 50건 |
| [`EXEC-ai-place-v1.0.md`](EXEC-ai-place-v1.0.md) | 실행 총괄 — 의존 DAG · 임계 경로 16주 |
| [`EXEC-ai-place-compressed-v1.0.md`](EXEC-ai-place-compressed-v1.0.md) | 압축 일정 12주 |

**작업 단위는 GitHub 이슈 84건**(`#94`~`#178`)이고 본문은 `docs/issues-aiplace/tasks/<ID>.md`에 있다.
프로젝트 보드: https://github.com/users/STERNYUL/projects/2

---

## 2. 절대 깨지 않는 4가지 (SRS §8.3)

**이 넷은 어떤 태스크에서도 예외가 없다.** 코드 리뷰에서 가장 먼저 본다.

| # | 규칙 | 구현상 의미 |
| --- | --- | --- |
| **1** | **근거 4항목이 없는 후보는 반환하지 않는다** | 선정 이유 · 근거 속성 · 확인 일자 · 확인 주체. `EvidenceGate`가 **정렬보다 앞**에 있어야 한다 |
| **2** | **어느 경로에서도 빈 화면을 반환하지 않는다** | 파싱 실패는 예외가 아니라 **정상 경로의 분기**다. 폴백·유사 메뉴·Top-3 회귀로 항상 무언가를 준다 |
| **3** | **시스템은 주관적 판정을 내리지 않는다** | 사실 값만 표시. 평가 문구 생성 금지. `STALE`은 **제외 사유가 아니라 경고**다 |
| **4** | **노출 순서를 판매하지 않는다** | 적합도가 1순위 정렬 키. 가격·광고는 정렬 키가 아니다 (ADR-004) |

---

## 3. 기술 스택

**서버리스 Next.js다.** 상주 프로세스·별도 캐시 서버·별도 로그 저장소가 **없다** — 이 전제가 설계 곳곳을 규정한다.

| 층 | 채택 | 비고 |
| --- | --- | --- |
| 프레임워크 | Next.js App Router · TypeScript | RSC 기본, `'use client'`는 상태·구독·타이머일 때만 |
| 배포 | Vercel — Edge(middleware) + Node(Functions) | **DB에 닿는 경로는 전부 Node.** Prisma가 Edge에서 안 돈다 |
| DB | Supabase PostgreSQL + **RLS** | 클라이언트가 Realtime으로 직접 구독하므로 **RLS가 유일한 방어선** |
| ORM | Prisma — **Pooler transaction mode** | prepared statement·대화형 트랜잭션·advisory lock **전부 금지** |
| 인증 | Supabase Auth + MFA(TOTP) | 콘솔은 MFA 필수 |
| 캐시 | Next.js Data Cache (**별도 캐시 서버 없음**) | TTL 6h + 태그 무효화. 확인 상태는 캐시하지 않는다 |
| AI | Vercel AI SDK + Google Gemini | provider 결정은 `ModelFactory` 한 곳 |
| 배치 | Vercel Cron | **부분 완료 가능 · 다음 트리거가 이어받는** 구조 필수 |
| UI | Tailwind + shadcn/ui | 임의 CSS 추가 금지 |
| 검증 | zod | Server Action 경계는 런타임 검증 필수 |

---

## 4. Phase 게이트

| Phase | 게이트 | 미달 시 |
| --- | --- | --- |
| **0** 내부 드라이런 | 파싱 실패율 ≤ 3% · Top-3 p95 ≤ 1.5s | Phase 1 보류 |
| **1** 클로즈드 베타 | WEBD ≥ 60% · 불일치 신고 ≤ 15% · 가맹 LOI ≥ 30곳 | Phase 2 미착수 |
| **1 말** | 선택 제안 노쇼율 계측 개시 | — |
| **2** 오픈 베타 *(조건부)* | 제안 도착률 ≥ 70% · 노쇼 ≤ 8% | **15건 통째로 v0.2 이월** |

> **Phase 2 태스크에 Phase 1 태스크를 의존시키지 않는다.** 이월 단위가 깨진다.

---

## 5. 서브에이전트 · 커맨드 라우팅

작업 성격에 따라 위임된다. 수동 호출은 `> use the <name> subagent` 또는 `/<command>`.

### 서브에이전트 (`.claude/agents/`)

| 에이전트 | 언제 |
| --- | --- |
| `nextjs-runtime` | 새 서버 경로 추가, Edge/Node 선택, RSC·Action·Handler 결정, 캐시 태그 설계 |
| `data-access` | Prisma 쿼리, 마이그레이션, RLS 정책, 동시성 제어 |
| `domain-invariants` | 근거 게이트·빈 화면 금지·판정 금지·정렬 규칙이 걸린 구현 |
| `tracking-observability` | 이벤트 22종 계측, KPI 집계, SLO 알림 |

### 슬래시 커맨드 (`.claude/commands/`)

| 커맨드 | 목적 |
| --- | --- |
| `/task-start <이슈번호>` | 태스크 착수 — 선행 완료 여부 검증 후 브랜치 생성 |
| `/fix-error` | 에러 7단계 구조화 진단 |
| `/setup-env` | 빌드·환경변수·스킬 설치 점검 |
| `/gitflow-commit` | 이슈 연동 커밋·PR |

---

## 6. 작업 규칙

- **착수 전 태스크 본문을 읽는다** — `docs/issues-aiplace/tasks/<ID>.md`의 `Depends on`·인수 기준·불변 규칙 항목.
- **선행이 안 끝났으면 착수하지 않는다.** 이슈 본문의 `Depends on`에 `#번호`가 달려 있다.
- **`main`에 직접 커밋하지 않는다.** `<type>/<이슈번호>-<설명>` 브랜치를 만든다.
- 주석은 **WHY**만 쓴다. WHAT은 코드로 표현한다.
- 새 규칙을 추가할 때 — 항상 적용은 이 파일, 도메인 지식은 서브에이전트, 절차는 커맨드, 코딩 규칙은 스킬.
