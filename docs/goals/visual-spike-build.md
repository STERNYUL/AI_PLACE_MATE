# [목표] 시각 스파이크 프로토타입 — 갤러리 13상태 · aztks GO 게이트

**문서 ID:** GOAL-AIPLACE-SPIKE-001
**날짜:** 2026-08-27
**범위 근거:** [`docs/prototype-visual-spike.md`](../prototype-visual-spike.md) (PROTO-AIPLACE-LITE-001) · 상위 [`docs/prototype-suggestion.md`](../prototype-suggestion.md) (PROTO-AIPLACE-001)
**착수 전 결정:** [`docs/grill/GRILL_LEDGER.md`](../grill/GRILL_LEDGER.md) — 4세션 31건 전건 `ALL_RESOLVED`
**대표 이슈:** [#137](https://github.com/STERNYUL/AI_PLACE_MATE/issues/137) (`CLI-C`)

> **이 목표의 산출물은 앱이 아니라 갤러리 한 페이지다.** 라우팅·상태관리·네트워크 호출 없이 fixture를 넣고 컴포넌트를 나열해, **이 제품이 어떻게 보이는지** 결론 낸다.
> **완료 판정은 사람의 눈이 아니라 `aztks-agent`의 GO 와 기계 명령 13개다.**

---

## 1) 작업 핵심 목표 및 범위

- **목표:** `app/preview/page.tsx` 갤러리 1페이지에 **화면 3종·상태 13개**를 렌더하는 Next.js 소스를 완성하고, `aztks-agent` EVALUATE 가 **GO** 를 반환한다.
- **시작 지점:** `main` (커밋 `e0c74b5`) 에서 **`feat/137-visual-spike`** 브랜치를 새로 만든다 (Grill S1-T8 확정).
- **작업 대상 — 이 경로만 생성·수정한다:**

  | 경로 | 내용 | 지위 |
  | --- | --- | --- |
  | `app/preview/page.tsx` | 갤러리 1페이지 — 13상태 전부 | 존속 |
  | `components/candidate-card.tsx` | 후보 카드 — 근거 4항목 필수 props | 존속 |
  | `components/gate-result.tsx` | 제외 패널 — 근거 누락 · 재확인 대기 2사유 | 존속 |
  | `components/states/*.tsx` | 열화 6상태 — **파일 6개** | 존속 |
  | `components/query-input.tsx` | 조건 입력 3상태 | 존속 |
  | `components/ui/**` | shadcn/ui 원시 컴포넌트 | 존속 |
  | `lib/evidence/gate.ts` | 클라이언트 근거 게이트 | 존속 |
  | `lib/evidence/freshness.ts` | **신선도 판정 함수 1개** — 90일 경계 | 존속 |
  | `lib/evidence/verified-by.ts` | 확인 주체 열거형 4종 | 존속 |
  | `lib/search/client.ts` | wire ↔ props 변환 단일 함수 | 존속 |
  | `types/draft.ts` | 잠정 타입 — `// DRAFT: SPEC-008` | 계약 확정 시 교체 |
  | `lib/fixtures/*.json` | `top3` · `evidence-missing` · `freshness` | **폐기 대상** |
  | `env.ts` · `package.json` · `tsconfig.json` · `next.config.*` · `tailwind.config.*` · `postcss.config.*` · `components.json` · `.gitignore` | 초기화 설정 | 존속 |
  | `docs/design/ux/SPIKE-FINDINGS.md` | **미정 5건 판정 기록** | 존속 — 이 목표의 실질 산출물 |

- **작업 자율성:** 위 경로 안에서는 **사용자 확인 없이 끝까지 진행한다.** 아래 넷만 사용자 확인을 받는다 — `main` 머지 · **node 설치** · GitHub 이슈 상태 변경 · 외부 배포(Vercel).

---

## 2) 작업 세부 규칙

### 2.1 순서 — 5단계 (스파이크 문서 §8)

| # | 작업 | 산출 |
| --- | --- | --- |
| 1 | 프로젝트 초기화 + 토큰 + shadcn/ui | `app/preview/page.tsx` 골격 |
| 2 | 후보 카드 + 근거 게이트 + fixture 3종 | **카드 4상태** |
| 3 | 열화 6상태 | **6상태** |
| 4 | 조건 입력 3상태 | **3상태** |
| 5 | 갤러리 정리 + **미정 5건 판정 기록** | `SPIKE-FINDINGS.md` |

**5번이 실질 산출물이다.** 화면을 만드는 것이 목적이 아니라 **스파이크 문서 §5의 미정 5건을 화면 앞에서 결론 내는 것**이 목적이다. 3·4단계는 파일이 겹치지 않으므로 `aztks-agent` `MODE: EXECUTE` 레인 2개로 병렬 처리해도 된다.

### 2.2 화면 3종 · 13상태 — 이 구성을 바꾸지 않는다

| 화면 | 상태 | 수 |
| --- | --- | --- |
| Top-3 후보 카드 | 근거 완비 · `STALE`(경고 병기) · **제외: 근거 누락** · **제외: 재확인 대기** | 4 |
| 열화 상태 | `폴백표시` `근거대기` `근거생략` `유사메뉴대체` `제안없음` `재시도안내` | 6 |
| 조건 입력 | 입력 전 · 파싱 결과 확인 · 폴백 전환 고지 | 3 |

**열화 6상태 명칭에 새 이름을 만들지 않는다** — `.claude/skills/102-ux-stage-deliverables` 와 `docs/goals/ux-design-stage.md` 의 판정 grep 이 이 6개 문자열을 그대로 센다.

**제외 2상태는 카드가 아니라 패널로 그린다** (Grill S4-T1). 근거 누락·재확인 대기는 정렬 이전에 제외되므로 카드로 렌더될 일이 없고, 사유를 구분해야 **후보 3개 미만 화면**을 판정할 수 있다.

### 2.3 grill 결정 준수 — 임의로 다시 정하지 않는다

세부 규격은 **`docs/prototype-visual-spike.md` §1·§3·§7 과 `docs/grill/GRILL_LEDGER.md` 를 읽고 그대로 적용한다.** 특히 아래 7건은 이미 확정이다.

| 결정 | 내용 |
| --- | --- |
| 근거 4항목 props | `selectionReason` `evidenceAttribute` `verifiedAt` `verifiedBy` — **camelCase 4개 필수** (S1-T3) |
| wire ↔ props 변환 | `lib/search/client.ts` **단일 함수**에서만. 컴포넌트가 wire 형식을 직접 읽지 않는다 |
| 신선도 판정 | **`lib/evidence/freshness.ts` 함수 1개.** 컴포넌트가 `Date.now()`·`new Date()` 를 쓰지 않는다 (S2-T6) |
| 확인 주체 | 열거형 4종 `MERCHANT` `INTERNAL_SURVEY` `USER_REPORT` `OPERATOR` (S3-T2) |
| 가격 | `priceRange: { min, avg, max }` **셋 다 필수** (S3-T3) |
| 선정 이유 | **파생값.** 엔터티로 저장하지 않는다 — 주석 필수 (S2-T5) |
| 응답 최상위 | `fallbackApplied` `overBudgetCount` `substitutedDish` `excludedByEvidence` `excludedByRecheck` (S2-T3·T4) |

### 2.4 fixture — 실제 매장을 쓸 때 확인 주체를 사칭하지 않는다

`top3.json` 은 **실제 매장 3곳의 공개 정보**로 채운다 (S1-T7). `evidence-missing.json`·`freshness.json` 은 가상이다 — 인위적 케이스를 만드는 것이 목적이다.

**`verifiedBy` 는 `INTERNAL_SURVEY`(내부 조사)로 명시한다.** "사장 확인" 등 확인 주체를 사칭하면 **실제 매장명 + 미확인 사실 = 근거 없는 정보 노출**이며 SRS §8.3 규칙 1 위반이다. `PREVIEW_ENABLED` 서버 전용 플래그(프로덕션 기본 `false`)를 `env.ts` 에 반드시 둔다 — 이 결정으로 인해 선택이 아니라 **필수 조건**이다.

### 2.5 4대 불변 규칙 — "프로토타입이니까"는 예외 사유가 아니다

| # | 이 스파이크에서의 구현 |
| --- | --- |
| **1 근거 4항목** | 서버 `EvidenceGate` 가 없으므로 `lib/evidence/gate.ts` 에 **클라이언트 게이트를 먼저 둔다.** 근거 누락 후보가 카드로 렌더되지 않아야 한다 |
| **2 빈 화면 금지** | **주 검증 대상.** 열화 6상태 각각에 **다음 행동**이 있어야 한다 |
| **3 판정 금지** | 화면 카피·fixture 전체에 판정형 어휘 **grep 0건** |
| **4 순서 비판매** | **가격순·거리순 정렬 토글을 UI에 두지 않는다.** 스파이크에서 만든 UI는 지워지지 않는다 |

### 2.6 브랜치·커밋

- 브랜치 **`feat/137-visual-spike`** · 대표 이슈 **`#137`** (`CLAUDE.md` §9 명명 규칙).
- **티켓별로 쪼개지 않는다** — `components/candidate-card.tsx` 하나가 `UX-A`·`UX-C`·`CLI-C` 세 티켓에 동시에 걸려 분리가 성립하지 않는다.
- 5단계마다 커밋한다. 첫 푸시 즉시 **draft PR** 을 열고, PR 본문에 걸친 티켓 5건과 각각의 잔여 항목을 적는다.
- **`main` 머지는 하지 않는다** (`REQ-IMPL-031`).

### 2.7 node 유무에 따라 범위가 갈린다 — **가장 먼저 판정한다**

**착수 즉시 `command -v node npm` 을 실행해 결과를 대화에 남긴다.** 이 한 줄이 아래 두 경로 중 하나를 고정한다. 작업 도중에 경로를 바꾸지 않는다.

| | **경로 A — node 있음** | **경로 B — node 없음** |
| --- | --- | --- |
| 목표 | 소스 완성 + **`npm run build` 성공** + 렌더 확인 | **소스 완성까지** |
| 판정 명령 | 13개 + **§3.2 의 14·15번** | 13개 |
| `npm install` | **실행한다** | 시도하지 않는다 |
| shadcn/ui | `npx shadcn@latest add` 로 필요한 것만 | CLI 를 못 쓰므로 **`components/ui/` 에 직접 작성** |
| 렌더 확인 | `npm run dev` 후 **`/preview` 스크린샷 1장**을 `docs/design/ux/` 에 남긴다 | `/setup-env` 이후 별도 단계 |
| `aztks-agent` 입력 | 소스 + **스크린샷** | 소스만 |

**경로 A 가 사용자의 원래 요구에 부합한다** — 요구는 *"시각적인 프로토타입"* 이고, 화면을 실제로 본 뒤라야 `aztks-agent` 가 *"경고가 묻히는가"* · *"전환 고지가 오류로 읽히는가"* 를 판정할 수 있다. **경로 B 는 node 가 없을 때의 대체안이지 동등한 선택지가 아니다.**

경로 B 로 끝났다면 종료 보고에 **"렌더 미확인 — 경로 B"** 를 명시한다. 렌더를 본 것처럼 적지 않는다.

**두 경로 공통**
- `package.json`·`tsconfig.json`·`next.config` 등 설정 파일은 **작성한다.**
- 임의 CSS 파일을 만들지 않는다 — Tailwind 유틸리티로 (`C-TEC-004`).
- `npm install` 이 실패하면 **경로 B 로 내려가 소스를 완성하고**, 실패 출력을 종료 보고에 남긴다. 설치를 고치려 시도하지 않는다 (사용자의 `/setup-env` 영역).

---

## 3) 종료 조건 및 종료 방법

- **종료 조건 (아래 중 하나라도 충족되는 순간 루프를 즉시 멈춘다):**
  - `aztks-agent` EVALUATE 가 **GO** 를 반환하고, **§3.1 판정 명령 13개**(경로 A 는 **§3.2 의 14·15 포함 15개**)가 전부 기대값과 일치 → **STOP REASON: SPIKE_ACCEPTED**
  - `aztks-agent` EVALUATE 가 **NO-GO 를 누적 3회** 반환 → **STOP REASON: EVAL_BUDGET**
  - 판정 명령이 **같은 항목에서 3회 연속 불일치** → **STOP REASON: VERIFY_STUCK**
  - 평가-진행 라운드(turn = `/goal` 평가자가 진행 상태를 한 번 점검하는 메인 에이전트 응답 사이클)가 **누적 30회** 도달 → **STOP REASON: TURN_CAP** (= or stop after 30 turns)

- **종료 방법:**
  1. `docs/design/ux/SPIKE-FINDINGS.md` 마지막 줄에 `STOP REASON: <원인 코드>` 한 줄을 덧붙인다.
  2. **§3.1 판정 명령 13개**(경로 A 는 **§3.2 포함 15개**)**를 실행해 출력 전부를 대화에 남긴다.** 어느 경로였는지 한 줄로 밝힌다.
  3. `aztks-agent` 의 **최종 스코어카드(5축 · GO/NO-GO)를 대화에 그대로 남긴다.**
  4. `git status --short` · `git log --oneline main..HEAD` · `gh pr list` 를 실행해 출력을 대화에 남긴다.

### 3.1 판정 명령 13개 — 전부 텍스트·`gh` 도구다 (node 불필요)

```bash
# 1. 열화 6상태 컴포넌트 존재
ls components/states/*.tsx | wc -l                                       # equals 6

# 2. 갤러리에 13상태가 걸려 있다
grep -cE 'CandidateCard|GateResult|StatePanel|QueryInput' app/preview/page.tsx   # at least 13

# 3. 세션 2·3 결정이 fixture 형상에 들어갔다
grep -c 'excludedByEvidence\|excludedByRecheck\|fallbackApplied' lib/fixtures/top3.json   # at least 3

# 4. 확인 주체 열거형 4종
grep -cE 'MERCHANT|INTERNAL_SURVEY|USER_REPORT|OPERATOR' lib/evidence/verified-by.ts     # equals 4

# 5. 잠정 타입 주석
grep -c 'DRAFT: SPEC-008' types/draft.ts                                 # at least 1

# 6. 신선도 판정이 함수 1개 — 컴포넌트가 날짜를 직접 계산하지 않는다
grep -rlE 'Date\.now|new Date' components/ | wc -l                       # equals 0

# 7. 근거 4항목이 카드의 필수 props (불변 규칙 1)
grep -cE 'selectionReason|evidenceAttribute|verifiedAt|verifiedBy' \
  components/candidate-card.tsx                                          # equals 4

# 8. 판정형 어휘 0건 (불변 규칙 3)
grep -rniE '조용|아늑|분위기 (좋|나쁨)|추천|최고|훌륭|괜찮|무난|가성비|인기|핫한|강추|별로' \
  app/ components/ lib/fixtures/                                         # returns 0 matches

# 9. 정렬 판매 금지 (불변 규칙 4)
grep -rniE '가격순|거리순|sortByPrice|sortByDistance' app/ components/ | wc -l   # equals 0

# 10. 잠정 타입이 한 파일에 격리
grep -rl 'DRAFT: SPEC-008' types/ | wc -l                                # equals 1

# 11. fixture 에 근거 누락 4종 (게이트 증명의 전제)
grep -c 'missing' lib/fixtures/evidence-missing.json                     # at least 4

# 12. PREVIEW_ENABLED 가 env 스키마에 있다 (프로덕션 노출 차단)
grep -c 'PREVIEW_ENABLED' env.ts                                         # at least 1

# 13. 티켓이 하나도 닫히지 않았다
#     --limit 300 필수 — gh 기본 페이지 크기가 30이라 열린 이슈 84건 중 앞 30건만 조회된다.
#     빠뜨리면 티켓이 열려 있어도 0을 반환한다 (2026-08-27 실측)
gh issue list --state open --limit 300 --json number \
  -q '[.[].number] | map(select(IN(137,140,141,142,145))) | length'      # equals 5
```

> **`--limit` 누락은 원본 3곳에서도 함께 고쳤다** (2026-08-27) — 스파이크 문서 §9 1건 · 상위 문서 §11 2건.
> 따라서 `§6` 의 *"판정 명령은 스파이크 문서 §9 의 것이 정본"* 은 그대로 유효하며, 13개 전부가 원본과 일치한다.

### 3.2 경로 A 추가 판정 2개 — node 가 있을 때만

```bash
# 14. 빌드가 통과한다
npm run build                                                            # exits 0

# 15. 렌더 확인 증거가 남았다 — /preview 스크린샷
ls docs/design/ux/spike-preview*.png | wc -l                             # at least 1
```

**경로 B 에서는 이 둘을 실행하지 않고, 종료 보고에 `경로 B — 렌더 미확인` 을 적는다.** 실행하지 않은 명령을 통과로 처리하지 않는다.

---

## 4) 기타 제약조건

- **금지 행동**
  - `main` 에 직접 커밋·머지하지 않는다 (`REQ-IMPL-031`).
  - `--force` 푸시·`--no-verify` 를 쓰지 않는다.
  - **node·npm 런타임 자체를 설치하지 않는다.** 사용자의 `/setup-env` 영역이다. *(경로 A 의 `npm install` 은 프로젝트 의존성 설치이며 이에 해당하지 않는다 — 허용된다.)*
  - **티켓 5건(`#137` `#140` `#141` `#142` `#145`)을 닫지 않는다.** 스파이크는 종료 0건이다 — 산출물은 인수 기준을 만족하는 완성품이 아니라 정식 티켓의 **입력**이다.
  - Vercel 배포·외부 네트워크 호출을 만들지 않는다. **갤러리는 네트워크 호출이 0건이다.**
  - 가격순·거리순 정렬 토글 UI 를 만들지 않는다.

- **수정 금지 파일·디렉터리**
  - `docs/prototype-suggestion.md` · `docs/prototype-visual-spike.md` · `docs/grill/**` — **결정의 원천이다. 읽고 따르되 고치지 않는다.**
  - `EXEC-ai-place-*.md` · `TASKS-ai-place-v1.0.md` · `[SRS]*` · `SRS-ai-place-nextjs-v1.0.md` · `[PRD]*` · `[DIAGRAMS]*`
  - `docs/issues-aiplace/tasks/**` · `docs/goals/ux-design-stage.md`
  - `.claude/**` — 하네스 규칙은 이미 grill 이 반영했다.
  - `CLAUDE.md` — §4 디렉터리에 `app/preview` 가 이미 등재돼 있다.

- **활성 범위 외 변경 금지** — §1 표의 경로만 만든다. 예외는 `docs/design/ux/SPIKE-FINDINGS.md` 하나다.

- **`docs/design/ux/` 의 정식 UX 문서를 만들지 않는다.** `UX-{A,B,C,F}-*.md` 는 `docs/goals/ux-design-stage.md` 목표의 산출물이다. 두 목표가 같은 파일을 쓰면 충돌한다 — 스파이크는 **판정 기록 1건만** 남기고 정식 문서화는 넘긴다.

---

## 5) `aztks-agent` 평가 규칙 — 이 목표의 합격 게이트

**메인 에이전트가 스스로 통과를 선언하지 않는다.** GO 판정은 `aztks-agent` 만 내린다.

### 5.1 디스패치

- **호출 시점:** 5단계가 전부 끝난 뒤 1회. NO-GO 시 지적 항목을 고치고 재호출 (최대 3회).
- **모드:** `MODE: EVALUATE` — 읽기 전용. 결정적 GO/NO-GO 스코어카드를 받는다.
- **평가 입력으로 넘길 것:** `app/preview/page.tsx` · `components/**` · `lib/fixtures/**` · `lib/evidence/**` · `docs/prototype-visual-spike.md` §1·§5 · `CLAUDE.md` §2(4대 불변 규칙).

### 5.2 무엇을 판정하게 하는가 — 3질문을 5축에 싣는다

**사용자의 판정 요구는 "UX 흐름이 서비스의 형태·고객 경험·가치 전달을 담고 있는가" 다.** 이것을 화면에서 확인 가능한 형태로 환원한다.

| 사용자 질문 | 이 갤러리에서 무엇을 보는가 |
| --- | --- |
| **서비스의 형태** | 13상태가 *"판정하지 않고 근거를 준다"* 를 **화면 언어로** 구현하는가. 카피가 사실 값과 출처·일자만 말하는가 |
| **고객 경험** | 열화 6상태 각각에 **다음 행동**이 있는가. 폴백 전환 고지가 **오류로 읽히지 않는가.** 후보가 3개 미만일 때 화면이 무엇을 말하는가 |
| **가치 전달** | 근거 4항목이 카드에서 **실제로 읽히는가.** `STALE` 경고가 **묻히지 않는가.** 제외 2사유가 구분돼 보이는가 |

### 5.3 GO 조건

- **5축 전부 통과.** 한 축이라도 미달이면 NO-GO 다 — 평균으로 상쇄하지 않는다.
- 스코어카드에 **축별 근거와 지적 항목**이 있어야 한다. 근거 없는 GO 는 채택하지 않고 재호출한다.
- NO-GO 스코어카드의 지적 항목은 **`SPIKE-FINDINGS.md` 에 라운드별로 기록**하고, 무엇을 고쳤는지 함께 남긴다.

### 5.4 평가 대상이 아닌 것

**스파이크가 화면으로 판정할 미정 5건은 평가 대상이 아니다.** 답이 없는 상태로 화면이 존재하는 것이 정상이고, 그 판정 자체가 산출물이다.

```
신선도 경고의 시각 위계 · 후보 3개 미만 화면 · 부분 파싱 필드 이월
후보 0건 시 조건 완화 제안 여부 · 판정형 어휘 기준(부분)
```

`aztks-agent` 는 **이 5건에 결론이 기록돼 있는지**(`SPIKE-FINDINGS.md`)만 확인하고, 결론의 내용이 옳은지는 판정하지 않는다.

---

## 6) 실패 시 회복 절차

| 상황 | 처리 |
| --- | --- |
| `aztks-agent` NO-GO 3회 | **STOP REASON: EVAL_BUDGET 으로 종료한다.** 4회를 돌리지 않는다 — 3회에 못 넘으면 화면이 아니라 스파이크 문서 §1 구성이 문제다 |
| 판정 명령이 같은 항목에서 3회 연속 불일치 | **STOP REASON: VERIFY_STUCK.** 명령을 고쳐 통과시키지 않는다 — 판정 명령은 스파이크 문서 §9 의 것이 정본이다 |
| grill 결정과 구현이 충돌 | **grill 결정이 이긴다.** 결정을 바꾸려면 멈추고 사용자에게 보고한다 |
| 미정 5건 중 화면으로도 결론이 안 나는 것 | `SPIKE-FINDINGS.md` 에 **"판정 불가 + 무엇이 더 필요한가"** 로 기록한다. 통과로 처리하지 않는다 |

---

*근거: PROTO-AIPLACE-LITE-001 §1·§3·§5·§7·§8·§9 · PROTO-AIPLACE-001 §7·§9 · GRILL_LEDGER 4세션 31건 · SRS-AIPLACE-MVP-001 v1.9 §8.3 · CLAUDE.md §2·§4·§9*
