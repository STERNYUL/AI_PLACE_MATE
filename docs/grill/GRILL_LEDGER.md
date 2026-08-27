# Grill Ledger — AI-Place-Mate

| 세션 | 범위 | 상태 |
| --- | --- | --- |
| **1** | 경량 시각 스파이크 착수 전 결정 | **CLOSED** — 8/8 · `ALL_RESOLVED` |
| **2** | **계약 5건 착수 전 결정** (`SPEC-001`·`002`·`003`·`004`·`008`) | **ACTIVE** — §세션 2 |

**활성 카운터는 §세션 2에 있다.** 세션 1의 카운터는 `SESSION-1` 접두로 구분한다.

---

## 세션 1 — 경량 시각 스파이크 착수 전 결정 (CLOSED)

**세션 개시:** 2026-08-26
**참조 범위:** [`docs/prototype-visual-spike.md`](../prototype-visual-spike.md) (PROTO-AIPLACE-LITE-001) · [`docs/prototype-suggestion.md`](../prototype-suggestion.md) (PROTO-AIPLACE-001) · `EXEC-ai-place-compressed-v1.0.md` · 선별 티켓 본문 6건 (`UX-A` `UX-B` `UX-C` `UX-D` `UX-F` `CLI-C`)
**관심 방향:** 경량 스파이크 착수 전에 **에이전트가 임의로 정하게 되는 것**을 전건 해소
**완료 조건:** 아래 토픽 전부 RESOLVED
**OUTPUT 대상:** `docs/prototype-visual-spike.md` · `CLAUDE.md` · `.claude/skills/` · 이 원장

---

## ⚠️ Grill 대상이 아닌 것 — 스파이크가 화면으로 판정할 6건

**아래는 질문하지 않는다.** 문서 검토로 결론이 나지 않고, **스파이크의 산출물이 곧 이 판정**이기 때문이다
(`prototype-visual-spike.md` §5).

```
신선도 경고의 시각 위계 · 후보 3개 미만 화면 · 부분 파싱 필드 이월
후보 0건 시 조건 완화 제안 여부 · STALE 후보의 근거 유효성 · 판정형 어휘 기준(부분)
```

---

## 토픽 원장

```markdown
SESSION-1 RESOLVED: 8 / TOTAL: 8   (CORE 4/4 · MINOR 4/4)
SESSION-1 STOP REASON: ALL_RESOLVED
- [x] T1 | CORE  | 실행 형태 — Next.js(Node 설치) vs 단일 HTML 목업 vs Vite   | depends:-  | status:RESOLVED
- [x] T2 | CORE  | 스파이크 코드의 지위 — 본 코드베이스 흡수 vs 판정 후 폐기   | depends:T1 | status:RESOLVED
- [x] T3 | CORE  | 잠정 타입 범위 — 근거 4항목 필드명 지금 확정 vs 계약 시 교체 | depends:T2 | status:RESOLVED
- [x] T4 | CORE  | fixture 시나리오 집합 — 15상태 전부 vs 카드+열화 10상태만    | depends:T3 | status:RESOLVED
- [x] T5 | MINOR | 산출물 배치 — /preview 갤러리 1페이지 vs 화면별 라우트        | depends:T1 | status:RESOLVED (T1 흡수)
- [x] T6 | MINOR | 열화 6상태 명칭 — 102 스킬의 6개 채택 여부                    | depends:T4 | status:RESOLVED (하네스 강제)
- [x] T7 | MINOR | fixture 데이터 출처 — 실제 매장 조사 vs 가상                   | depends:T4 | status:RESOLVED
- [x] T8 | MINOR | 브랜치·커밋 처리 — 스파이크 브랜치명 · PR 여부                | depends:T2 | status:RESOLVED
```

---

## 토픽 배경

| ID | 왜 지금 정해야 하나 | 정하지 않으면 |
| --- | --- | --- |
| **T1** | 이 환경에 `node`·`npm`·`pnpm`이 없다. 스파이크는 돌아가야 의미가 있다 | 착수 자체가 불가능 |
| **T2** | `MOCK-` 계열은 "폐기 대상 — 영구 자산 아님"이 제약이다. 스파이크는 그 제약을 받는가 | 폐기 경계가 코드에 안 그어진다 |
| **T3** | `SPEC-008` 근거 4항목이 `EVD-A`·`EVD-C`·`AGT-C`·`CLI-C` 4곳 공유 계약이다. 스파이크가 필드명을 임의로 정하면 4곳이 그것을 따라간다 | 계약이 코드에서 역산되는 역전 |
| **T4** | `UX-D`(공유 카드)를 포함하면 4.5일, 빼면 4일. `SPEC-004` 없이 템플릿을 그리는 값의 판단 | 범위가 작업 중 늘어난다 |
| **T5** | 상위 문서 §9의 디렉터리 규약과 CLAUDE.md §4 모듈 경계에 걸린다 | 정식 `CLI-C1` 이관 시 재배치 |
| **T6** | `docs/goals/ux-design-stage.md`의 완료 판정 grep이 6개 이름을 그대로 센다 | 판정 명령이 0을 반환 |
| **T7** | 불변 규칙 3(판정 금지) grep이 fixture 카피까지 검사한다 | 자리표시자에 판정형 어휘가 섞인다 |
| **T8** | CLAUDE.md §9 — `main`에 직접 커밋하지 않는다 (`REQ-IMPL-031`) | 규칙 위반 |

---

## 해소 기록

### T1 · CORE · 실행 형태 — RESOLVED (2026-08-26)

- **decision:** **Next.js App Router + `app/preview/page.tsx` 갤러리 1페이지.** Node 설치가 선행 조건(`/setup-env`). 단일 HTML 목업·Vite 단독 안은 폐기.
- **근거:** 저장소 코드가 0줄이고 `C-TEC-001`이 Next.js App Router 단일 배포 단위를 규정한다. 어차피 세울 것을 지금 세우면 초기화 비용이 한 번뿐이고, `components/`·`lib/evidence/`가 재작업 없이 `CLI-C1` 산출물이 된다.
- **applied:**
  - `docs/prototype-visual-spike.md` §4.1 제목 "권고" → "확정", §7 표 1행 결정 기록
  - `CLAUDE.md` §4 디렉터리 — `app/preview/page.tsx` 한 줄 추가 (fixture 기반 · 네트워크 호출 없음)
  - `docs/grill/GRILL_LEDGER.md` 카운터 `RESOLVED: 1 / TOTAL: 8`

### T2 · CORE · 스파이크 코드의 지위 — RESOLVED (2026-08-26)

- **decision:** **`lib/fixtures/`만 폐기 대상.** `components/`·`lib/evidence/`·`types/draft.ts`·`app/preview/`는 전부 존속하고, 갤러리는 원천을 `MOCK-002`~`004` 응답으로 교체해 살린다. **`PREVIEW_ENABLED` 서버 전용 플래그로 프로덕션 노출을 차단한다 — 필수.**
- **근거:** `MOCK-` 계열 제약이 *"실구현 완료 후 폐기 대상 — 영구 자산으로 취급하지 않는다"* 이므로 fixture는 폐기가 맞다. 갤러리는 원천만 갈아끼우면 시각 회귀 도구로 계속 쓰이고, 이중 원천(안 C)의 *"계약이 단일 진실 원천"* 위반을 피한다.
- **applied:**
  - `docs/prototype-visual-spike.md` §7 표 2행 결정 기록 · **§7.1 존속·폐기 경계 신설**
  - `CLAUDE.md` §4 — `app/preview/page.tsx` 주석을 `PREVIEW_ENABLED 로 차단`으로 갱신
  - `CLAUDE.md` §6 환경 변수 — 서버 전용에 `PREVIEW_ENABLED` 행 추가 (프로덕션 기본 `false`)
  - `docs/grill/GRILL_LEDGER.md` 카운터 `RESOLVED: 2 / TOTAL: 8`

### T3 · CORE · 잠정 타입 범위 — RESOLVED (2026-08-26)

- **decision:** 카드 컴포넌트 props는 **camelCase 4개 필수** — `selectionReason` `evidenceAttribute` `verifiedAt` `verifiedBy`. API wire format은 `SPEC-001`에 위임하고, 변환은 **`lib/search/client.ts` 단일 함수**에서만 한다. 컴포넌트는 wire 형식을 직접 읽지 않는다.
- **근거:** 매핑 계층을 두면 계약이 어느 표기로 확정돼도 컴포넌트가 흔들리지 않아 **역산 위험이 사라진다.** 표시 슬롯 배열(안 C)은 4항목 중 어느 것이 빠졌는지 구분하지 못해 `MOCK-003` 항목별 누락 4종 검증과 불변 규칙 1 검증이 성립하지 않는다.
- **부수 발견:** `300-api-contract-rules` 스킬이 이미 *"JSON 속성명 camelCase"* 를 규정하고 있었다. **wire와 props가 같은 표기가 되어 위험이 애초에 더 작다.** 매핑 함수는 DB snake_case ↔ API camelCase 경계로 남는다.
- **applied:**
  - `.claude/skills/300-api-contract-rules/SKILL.md` — **§JSON 하위에 "근거 4항목 필드명" · "wire ↔ props 변환은 한 곳에서" 2절 신설.** 네 소비처(`EVD-A`·`EVD-C`·`AGT-C`·`CLI-C`)가 같은 이름을 쓰도록 하네스에 고정
  - `docs/prototype-visual-spike.md` §3 대체물 표 — `types/draft.ts` 행에 camelCase 4개 필수 · 교체 범위 명시
  - `docs/grill/GRILL_LEDGER.md` 카운터 `RESOLVED: 3 / TOTAL: 8`

### T4 · CORE · fixture 시나리오 집합 — RESOLVED (2026-08-26)

- **decision:** **13상태 — 카드 4 + 열화 6 + 입력 3.** 공유 카드 2상태를 제외해 **4일**로 확정. `UX-D`(#143)는 스파이크 범위 밖.
- **근거:** 공유 카드 2상태는 §5 미정 6건 중 **어느 것에도 기여하지 않는다** — 미정 해소는 카드·열화·입력 3종에서 전부 나온다. 같은 판정력을 0.5일 싸게 산다. 10상태 안(입력 제외)은 #5 부분 파싱 이월을 판정할 화면이 없어 해소가 6건 → 5건으로 줄어든다.
- **applied:**
  - `docs/prototype-visual-spike.md` 전면 갱신 — §0 요약(5건·4일·13상태) · **§1 화면 3종/13상태 + "공유 카드를 뺀 이유" 절 신설** · §2 티켓 5건(`UX-D` 제거) · §4.1·4.2 상태 수 · §5 #9 범위 밖 · **§8 일정 4일** · §9 판정 명령(티켓 5건 · 갤러리 13상태 grep · `PREVIEW_ENABLED` env 확인 추가) · §10 공유 카드 순서 2.5 삽입
  - `docs/grill/GRILL_LEDGER.md` 카운터 `RESOLVED: 4 / TOTAL: 8` — **CORE 4건 전건 해소**

### T5 · MINOR · 산출물 배치 — RESOLVED (2026-08-26 · T1 흡수 · 질문 없음)

- **decision:** `app/preview/page.tsx` **갤러리 1페이지.** 화면별 라우트를 만들지 않는다.
- **근거:** T1 결정에 이미 포함돼 선택지가 남아 있지 않다. 13상태가 한 화면에 있어야 **신선도 경고가 묻히는지(§5 #3)** 를 나란히 비교할 수 있고, 라우트로 쪼개면 그 판정 자체가 불가능해진다.
- **applied:** `docs/prototype-visual-spike.md` §4.1 (T1 반영 시 함께 확정) · 원장 카운터 `RESOLVED: 5`

### T6 · MINOR · 열화 6상태 명칭 — RESOLVED (2026-08-26 · 하네스 강제 · 질문 없음)

- **decision:** `폴백표시` `근거대기` `근거생략` `유사메뉴대체` `제안없음` `재시도안내` **그대로 채택.** 새 이름을 만들지 않는다.
- **근거:** `.claude/skills/102-ux-stage-deliverables`와 `docs/goals/ux-design-stage.md` §3의 완료 판정 grep이 이 6개 문자열을 그대로 센다. 다른 이름을 쓰면 **판정 명령이 0을 반환해 UX 단계가 완료 판정을 받지 못한다.** 선택지가 존재하지 않는다.
- **applied:** `docs/prototype-visual-spike.md` §1 표 · §1 말미 각주("새 이름을 만들지 않는다") · 원장 카운터 `RESOLVED: 6`

### T7 · MINOR · fixture 데이터 출처 — RESOLVED (2026-08-26)

- **decision:** `top3.json`은 **실제 매장 3곳의 공개 정보**로 채운다. `evidence-missing.json`·`freshness.json`은 가상 — 인위적 케이스를 만드는 것이 목적이므로 실제 매장에서 재현할 이유가 없다.
- **근거:** 판정형 어휘 grep이 `lib/fixtures/`까지 검사하므로 자리표시자를 쓸 수 없다. 실제 3곳을 채우면 `SPEC-008`의 미해소 쟁점(*"4항목 각각의 데이터 출처를 엔터티·필드 수준에서 확정"*)에 직접 기여한다 — **어느 항목이 현실에서 비는지, `verifiedBy`가 매장인지 운영자인지**가 드러난다. 조사 비용 1시간.
- **파생 가드 (중요):** **실제 매장명 + 미확인 사실 = 근거 없는 정보 노출**이며 §8.3 규칙 1 위반이다. `verifiedBy`는 **"내부 조사"** 로 명시하고 "사장 확인" 등 확인 주체를 사칭하지 않는다. **T2의 `PREVIEW_ENABLED` 차단이 이 결정으로 인해 선택이 아니라 필수 조건이 된다.**
- **applied:**
  - `.claude/skills/302-mock-contract-server/SKILL.md` — **§"실제 매장명을 쓸 때 — 확인 주체를 사칭하지 않는다" 신설.** 하는 것/하지 않는 것 대조표 + `PREVIEW_ENABLED` 차단 요구
  - `docs/prototype-visual-spike.md` §3 fixture 3행에 출처 표기 · **§3 하위에 사칭 금지 경고 절 신설**
  - `docs/grill/GRILL_LEDGER.md` 카운터 `RESOLVED: 7 / TOTAL: 8`

### T8 · MINOR · 브랜치·커밋 처리 — RESOLVED (2026-08-26)

- **decision:** **`docs/prototype-scope`** (문서·하네스 — 지금) + **`feat/137-visual-spike`** (코드 — Node 설치 후). 대표 이슈는 `#137`(`CLI-C`). 둘 다 draft PR로 열고 **`main` 머지는 사용자 확인**.
- **근거:** `UX-A`·`B`·`C`·`F` 4건은 문서 티켓이고 스파이크는 그 코드적 선반영이므로, 실제 코드 티켓 하나를 대표로 쓰는 것이 사실에 맞다(`CLAUDE.md` §9 명명 규칙 준수). 티켓별 5개 브랜치는 `components/candidate-card.tsx` 하나가 `UX-A`·`UX-C`·`CLI-C` 세 티켓에 동시에 걸려 **분리가 성립하지 않는다.**
- **applied:**
  - `.claude/skills/200-git-commit-push-pr/SKILL.md` — **§"여러 티켓에 걸치는 작업 — 대표 이슈 하나를 쓴다" 신설.** 문서 브랜치 분리 · PR 본문에 걸친 티켓 전체와 잔여 항목 명시
  - `docs/prototype-visual-spike.md` — **§8.1 브랜치 절 신설**
  - `docs/grill/GRILL_LEDGER.md` 카운터 `RESOLVED: 8 / TOTAL: 8` · `STOP REASON: ALL_RESOLVED`

---

## Closeout — 2026-08-26

**STOP REASON: ALL_RESOLVED** · RESOLVED 8 / TOTAL 8 (CORE 4/4 · MINOR 4/4)

질문한 것 6건 · 기존 결정·하네스가 강제해 질문 없이 기록한 것 2건(T5·T6).

### 이번 세션에 반영된 것

| 대상 | 변경 |
| --- | --- |
| `docs/prototype-visual-spike.md` | 범위 재확정(**5건 부분 착수 · 13상태 · 4일**) · §1 공유 카드 제외 근거 · §3 사칭 금지 가드 · §4.1 실행 형태 확정 · §7 확정 2건 · §7.1 존속·폐기 경계 · §8.1 브랜치 · §9 판정 명령 갱신 |
| `docs/prototype-suggestion.md` | §12에 경량 스파이크 진입 경로 추가 |
| `CLAUDE.md` | §4 `app/preview/page.tsx` · §6 `PREVIEW_ENABLED` |
| `.claude/skills/200-git-commit-push-pr` | 여러 티켓에 걸치는 작업의 브랜치 규칙 |
| `.claude/skills/300-api-contract-rules` | 근거 4항목 필드명 고정 · wire ↔ props 변환은 한 곳 |
| `.claude/skills/302-mock-contract-server` | 실제 매장명 사용 시 확인 주체 사칭 금지 |

### 스파이크가 판정할 것 — 질문하지 않은 6건

`신선도 경고 위계` · `후보 3개 미만 화면` · `부분 파싱 필드 이월` · `후보 0건 조건 완화` · `STALE 근거 유효성` · `판정형 어휘 기준(부분)`

**판정 결과를 이 원장 아래에 이어 기록한다.** `UX-B`·`UX-C`·`UX-F` 정식 착수의 입력이 된다.

---

## 세션 2 — 계약 5건 착수 전 결정 (ACTIVE)

**세션 개시:** 2026-08-26
**참조 범위:** `docs/issues-aiplace/tasks/SPEC-001.md` `SPEC-002.md` `SPEC-003.md` `SPEC-004.md` `SPEC-008.md` · `EXEC-ai-place-v1.0.md` §6 · `.claude/skills/300-api-contract-rules`
**관심 방향:** 계약 5건에 남은 미정 전건
**완료 조건:** 아래 토픽 전부 RESOLVED
**OUTPUT 대상:** 태스크 본문 5건 · `.claude/skills/300-api-contract-rules` · `CLAUDE.md` · 이 원장

---

### 질문 없이 기록 — 이미 확정돼 있던 4건

범위를 읽는 중 **이미 하네스나 태스크 본문이 확정적으로 서술한** 항목이 넷 나왔다. 토픽으로 세지 않는다.

| # | 항목 | 어디서 확정돼 있나 |
| --- | --- | --- |
| F1 | 오류 본문 형식 · 추적 ID 헤더명 | `300` 스킬 — `{ code, message, requestId }` · `X-Request-Id` |
| F2 | 근거 누락 판정 시점 | SRS §4.5.2 **정렬 이전**. `SPEC-008` Scenario 2가 확정적으로 서술 |
| F3 | 오류율 분자에서 `4xx` 제외 | `SPEC-001` Scenario 3 — 4xx 100건·5xx 1건/1,000건 = **0.1%** |
| F4 | 페이지네이션 부재 | `300` 스킬 · SRS §8.3 규칙 2 · `REQ-FUNC-014` Top-3 고정 |

---

### 토픽 원장

```markdown
RESOLVED: 12 / TOTAL: 12   (CORE 9/9 · MINOR 3/3)
STOP REASON: ALL_RESOLVED
- [x] T1  | CORE  | 임계값 경계 규약 — 이하/이상 포함 여부 (1건이 7건 대체)  | depends:-     | status:RESOLVED
- [x] T2  | CORE  | Verification 3상태와 근거 유효성 (STALE·RECHECK)        | depends:T1    | status:RESOLVED
- [x] T3  | CORE  | 3개 고정 ↔ 근거 미비 제외 충돌 시 동작                  | depends:T2    | status:RESOLVED
- [x] T4  | CORE  | 응답 필드 경계 — 폴백 신호·예산 요약·유사 대체를 어디에  | depends:T3    | status:RESOLVED
- [x] T5  | CORE  | 근거 4항목의 데이터 출처 (엔터티·필드 수준)              | depends:T2    | status:RESOLVED
- [x] T6  | CORE  | 캐시 6h ↔ 신선도 90일 충돌 해소 방식                    | depends:T1 T2 | status:RESOLVED
- [x] T7  | CORE  | 인증 방식 — Bearer / 세션 / 기타                        | depends:-     | status:RESOLVED
- [x] T8  | CORE  | 422 채택 여부 — 파싱 실패를 오류로 볼 것인가             | depends:-     | status:RESOLVED
- [x] T9  | CORE  | REQ-NF-001 측정 조건 — 데이터량·RPS·캐시 상태           | depends:-     | status:RESOLVED
- [x] T10 | MINOR | 오류 응답 3건 — 미존재 place·무효 후보 id·누락 항목 표기 | depends:T8    | status:RESOLVED
- [x] T11 | MINOR | 열화 동작 2건 — p95 초과 · 이미지 생성 실패             | depends:T8    | status:RESOLVED
- [x] T12 | MINOR | 공유 카드 유효기간                                      | depends:-     | status:RESOLVED
```

---

### 토픽 배경

| ID | 출처 | 왜 계약 단계에서 정해야 하나 |
| --- | --- | --- |
| **T1** | `EXEC` §6.3 | **1건이 7건을 대체한다** — 파싱 실패율 3% · 누락률 5% · 신선도 90일 · 취소 2시간 · 예산 기준값 · 수용 조건 상한 · 유사도 기준. 비용 대비 효과가 가장 크다 |
| **T2** | `SPEC-008` ②③ · `EXEC` §6.2 #4 | **평가서 §4가 최우선으로 지목.** SRS가 `STALE`을 "근거 없음"인지 "근거 있으나 오래됨"인지 구분하지 않는다. 소비처 4곳이 갈린다 |
| **T3** | `SPEC-002` Scenario 4 · `SPEC-008` | §8.1이 "후보 정확히 3개"와 "근거 없는 후보 반환 금지"를 **동시에** 요구한다. 충돌 구간 동작이 SRS에 없다 |
| **T4** | `SPEC-002` | 본문이 *"여섯 필드가 SRS 원문 그대로다. 임의로 추가하지 않는다"* 라면서 Task Breakdown은 **폴백 신호·예산 요약·유사 대체 필드를 확정하라고 한다.** 모순이다 |
| **T5** | `SPEC-008` DoD | 세션 1 T3이 **필드명**은 고정했으나 **출처 엔터티·필드**는 미정이다 |
| **T6** | `SPEC-003` | `verified_at + 90일`이 캐시 6h 구간 안에서 경과하면 **최대 6시간 경고 없이 응답**한다. `REQ-NF-011` 0%와 어긋난다 |
| **T7** | `SPEC-001` | `REQ-NF-018` 전 API 인증 필수인데 **방식이 SRS에 없다.** `IN-B` 보안 계층이 이걸 기다린다 |
| **T8** | `SPEC-001` | 파싱 실패는 §4.5.3 **정상 분기**다. `400`이면 클라이언트가 폴백을 트리거할 수 없고 `REQ-NF-009` 분모가 오염된다 |
| **T9** | `SPEC-002` · `EXEC` §4 | p95 1,000ms를 **어떤 조건에서** 재는지 없으면 `TEST-014a` 판정이 불가능하다 |
| **T10** | `SPEC-003`·`SPEC-004` | 셋 다 본문에 `(제안)`이 있다. 확정만 하면 된다 |
| **T11** | `SPEC-003`·`SPEC-004` | `304-error-degradation` 6상태와 연결된다 |
| **T12** | `SPEC-004` | 카드는 외부로 유통되고 **회수가 불가능하다** |

---

### 해소 기록 — 세션 2

#### T1 · CORE · 임계값 경계 규약 — RESOLVED (2026-08-26)

- **decision:** **모든 임계값은 경계값을 포함한다 — `≤` / `≥`.** 코드·계약·테스트·문서 전부에 적용. `<`/`>`를 쓰려면 그 자리에 근거를 남긴다.
- **근거:** `EXEC` §6.3이 비용 대비 효과 최대로 지목한 항목이며 **최소 7건**(신선도 90일 · 파싱 실패율 3% · 누락률 · 취소 2시간 · 예산 기준값 · 수용 조건 상한 · 유사도 기준)을 하나로 정리한다. 결정적으로 **`SPEC-008` Scenario 3이 이미 *"정확히 90일 경과 → `STALE` 전이"* 로 서술해 경계 포함을 전제**하고 있어, 경계 배제로 정하면 이미 쓰인 인수 기준을 고쳐야 한다.
- **의도된 비대칭:** 항목마다 방향이 다르다 — 신선도는 경고를 **이르게** 붙이는 보수적 방향(`REQ-NF-011` 0%에 안전), 게이트는 **관대한** 방향. 관용 표기(`≤`/`≥`)와 일치하며 `MOCK-004`의 89/90/91일 경계 3종이 화면에서 검증한다.
- **applied:**
  - `CLAUDE.md` **§7에 "임계값 경계 규약 — 예외 없다" 절 신설** — 5개 임계값 읽는 법 표 + 비대칭이 의도된 것임 + 이탈 시 근거 요구
  - `.claude/skills/300-api-contract-rules/SKILL.md` — **§단위 하위에 "임계값은 경계를 포함한다" 절 신설.** OpenAPI description·테스트 경계값이 어긋나면 계약이 틀린 것
  - `docs/issues-aiplace/tasks/SPEC-001.md` — 확정할 규약 표에 행 추가 · **임계값 경계 규약 절 신설**(7건 소비처 대조표) · Task Breakdown 체크
  - `docs/grill/GRILL_LEDGER.md` 세션 2 카운터 `RESOLVED: 1 / TOTAL: 12`

#### T2 · CORE · Verification 3상태와 근거 유효성 — RESOLVED (2026-08-26)

- **decision:** `VERIFIED`·`STALE` **정렬 참여·노출** (`STALE`은 **경고 병기 필수**) · `RECHECK_REQUIRED` **정렬 이전 제외**.
- **근거:** `CLAUDE.md` §2 불변 규칙 3이 **"`STALE`은 제외 사유가 아니라 경고"** 라고 이미 못박아 노출이 하네스 강제다. 반면 `RECHECK_REQUIRED`는 성격이 다르다 — `STALE`은 *시간이 지났다*이고 `RECHECK_REQUIRED`는 *사용자가 틀렸다고 신고했다*다. 재확인 전 노출은 §8.3 규칙 1 위반이며 `EVD-D` 재확인 큐의 존재 의미가 사라진다.
- **여파 (T3으로 전가):** 제외 사유가 둘(4항목 결락 · 재확인 대기)로 늘어 **Top-3 3개 미만 구간이 실제로 발생한다.** `SPEC-002` Scenario 4 충돌 처리의 공기가 커졌다.
- **applied:**
  - `CLAUDE.md` §2 불변 규칙 3 — `STALE` 노출 + **`RECHECK_REQUIRED`는 제외**를 명시
  - `.claude/skills/300-api-contract-rules/SKILL.md` — **§"`Verification` 3상태 — 소비처 4곳이 같은 표를 따른다" 신설**
  - `docs/issues-aiplace/tasks/SPEC-008.md` — 핵심 ②③ **(미정) → 확정**으로 재작성 · **§"`Verification` 3상태 취급" 표 신설** · Scenario 3 후보 포함 확정 + **Scenario 5 신설**(`RECHECK_REQUIRED` 제외) · Blockers를 확정 완료/미정으로 분리
  - `docs/grill/GRILL_LEDGER.md` 세션 2 카운터 `RESOLVED: 2 / TOTAL: 12`

#### T3 · CORE · 3개 고정 ↔ 근거 미비 제외 충돌 — RESOLVED (2026-08-27)

- **decision:** **`REQ-FUNC-014`의 Top-3에서 3은 상한이다.** 근거 게이트 통과분만 반환한다(0~3개) + 통과 건수를 응답에 실어 화면이 사실로 고지한다. 0개는 열화 상태 `제안없음`으로 간다 — 빈 화면이 아니다.
- **근거:** 3개를 채우려 기준을 낮추면 불변 규칙 1과 `REQ-IMPL-010`(`EvidenceGate`가 정렬보다 앞)을 정면으로 깬다. 반대로 못 채웠다고 0건 반환하면 통과한 2곳을 버리는 것이라 불변 규칙 2 취지에 반한다. **상한 해석이 네 규칙 중 셋을 지키는 유일한 경로다** — `REQ-FUNC-014` "정확히 3개" 문언만 상한으로 재해석한다.
- **T2와의 연쇄:** 제외 사유가 둘로 늘었다 — ① 근거 4항목 결락 ② `RECHECK_REQUIRED`. 둘 다 정렬 이전 단계에서 걸러지므로 **3개 미만 구간이 이론이 아니라 실제로 발생한다.**
- **하네스 모순 1건 발견·수정:** `300` 스킬이 *"`REQ-FUNC-014`는 **Top-3 고정**이다"* 라고 적혀 있어 이 결정과 어긋났다. 함께 고쳤다.
- **applied:**
  - `CLAUDE.md` §2 불변 규칙 1 — **"Top-3의 3은 상한이다"** 추가
  - `.claude/skills/300-api-contract-rules/SKILL.md` — §제목 "페이지네이션 없음" → **"페이지네이션 없음 · Top-3는 상한이다"**, "Top-3 고정" 문구 수정 + 0개→`제안없음` 매핑
  - `docs/issues-aiplace/tasks/SPEC-002.md` — Scenario 4 확정 · **§"3개 고정 ↔ 근거 미비 제외 충돌 — 해소" 신설**(통과 건수별 응답·화면 표) · Blockers 분리
  - `docs/issues-aiplace/tasks/SPEC-008.md` — Blockers의 마지막 미정 해소
  - `docs/grill/GRILL_LEDGER.md` 세션 2 카운터 `RESOLVED: 3 / TOTAL: 12`

#### T4 · CORE · 응답 필드 경계 — RESOLVED (2026-08-27)

- **decision:** **후보 항목은 SRS 여섯 항목 그대로**(JSON 키 7개 — "확인 일자·주체"가 `verifiedAt`·`verifiedBy` 둘로 분리). 나머지는 **응답 최상위**에 둔다 — `fallbackApplied` · `overBudgetCount` · `substitutedDish` · `excludedByEvidence` · `excludedByRecheck`.
- **근거:** `SPEC-002` 안의 모순을 해소한다 — 응답 항목 표는 *"여섯 필드에 임의 추가 금지"* 인데 Task Breakdown은 세 필드를 확정하라고 한다. **넷 다 후보 하나의 속성이 아니라 질의 결과 전체의 속성**이므로 최상위가 의미상 맞고, 두 규정이 문자 그대로 둘 다 지켜진다. 항목에 넣으면 같은 값이 후보 수만큼 중복되고 **후보 0개일 때 실을 곳이 사라진다** — T3으로 0개 응답이 실제 경로가 됐으므로 이게 결정적이다.
- **조정 1건:** 사용자가 고른 안의 `passedCount`는 **`candidates.length`와 항상 같아 중복**이다. 화면이 실제로 필요한 것은 *"왜 3개가 아닌가"* 이므로 **제외 사유별 건수 둘**(`excludedByEvidence`·`excludedByRecheck`)로 대체했다. 계층 결정(최상위)은 그대로다. `UX-F`의 `근거생략` 상태 카피가 이 값을 쓴다.
- **applied:**
  - `docs/issues-aiplace/tasks/SPEC-002.md` — **§"응답 최상위 필드" 신설**(스키마 + 최상위 배치의 실질 이유) · 여섯 항목 표에 **JSON 키 7개 각주**(합치는 방향으로 고치지 말 것)
  - `.claude/skills/300-api-contract-rules/SKILL.md` — **§"항목의 속성인가, 결과 전체의 속성인가" 신설.** 배열 길이로 알 수 있는 값은 싣지 않는다
  - `docs/grill/GRILL_LEDGER.md` 세션 2 카운터 `RESOLVED: 4 / TOTAL: 12`

#### T5 · CORE · 근거 4항목의 데이터 출처 — RESOLVED (2026-08-27)

- **decision:** `evidenceAttribute` = `Attribute.name`·`value` · `verifiedAt` = `Verification.verified_at` · `verifiedBy` = `Verification.verified_by` · **`selectionReason` = 없음. 파생이며 저장하지 않는다** — `EVD-B`가 매 응답 생성한다. **`Evidence` 엔터티를 만들지 않는다.**
- **근거:** 셋은 저장된 사실이고 선정 이유는 **그 사실을 조건에 맞춰 진술한 것**이다. 저장하면 `UX-C` 판정형 차단 사전이 갱신돼도 **과거 문장이 그대로 남아** `CLI-C`가 요구하는 *"서버가 통과시킨 문장이 화면에서 판정형이 되면 안 된다"* 가 그 시점에 깨진다. 파생으로 두면 사전 갱신이 즉시 전역 반영된다.
- **대가 (T9로 전가):** 매 응답 생성이므로 `REQ-NF-001` p95 1,000ms 예산을 소모한다. **측정 조건에 이 생성 비용이 포함돼야 한다.**
- **applied:**
  - `docs/issues-aiplace/tasks/SPEC-008.md` — 근거 4항목 표에 **JSON 키·데이터 출처·성격 열 추가** · **§"선정 이유만 파생인 이유" 신설**
  - `.claude/skills/300-api-contract-rules/SKILL.md` — 근거 4항목 절을 **출처 표로 확장** · `Evidence` 엔터티 금지 명시
  - `CLAUDE.md` §4 모듈 규칙 표 — **"선정 이유는 파생" 행 추가** (`Evidence` 엔터티를 만들지 않는다)
  - `docs/grill/GRILL_LEDGER.md` 세션 2 카운터 `RESOLVED: 5 / TOTAL: 12`

#### T6 · CORE · 캐시 6h ↔ 신선도 90일 충돌 — RESOLVED (2026-08-27)

- **decision:** **캐시 TTL 6시간 유지.** 응답에 `verifiedAt`을 싣고 **클라이언트 렌더 직전에 경과를 판정**한다. 판정 함수는 **`lib/evidence/freshness.ts` 하나**이며 서버·클라이언트가 그것만 호출한다.
- **근거:** `verifiedAt`은 근거 4항목이라 **이미 응답에 실린다**(T5) — 추가 비용 0이고 `REQ-NF-020` 히트율 70%가 안전하다. 캐시 키에 `verified_at`을 넣는 안은 **해소가 부분적**이다: 경과는 시간이 흘러 일어나므로 키가 같아도 6시간 구멍이 남는다. TTL 단축은 경계 근처 항목이 많아지면 히트율이 떨어지고 동적 TTL 계산이 새 복잡도가 된다.
- **T1·T2와의 연쇄:** 경계가 포함(T1)이고 `STALE`도 노출(T2)이라 **경고가 더 이르게, 더 자주 붙는다** — 이 구멍이 더 자주 열리므로 해소가 더 급했다.
- **파생 제약:** 판정이 서버·클라이언트 두 곳에 생긴다. 다른 기준을 쓰면 T1 경계 규약이 한쪽에서 깨지므로 **함수 1개로 강제**한다. 응답에는 **상태가 아니라 `verifiedAt`이 실린다** — 서버가 붙인 상태는 캐시 구간에서 이미 낡는다.
- **applied:**
  - `docs/issues-aiplace/tasks/SPEC-003.md` — 해소안 (제안) → **§"해소 — 응답에 `verifiedAt`을 싣고 수신 시점에 판정한다" 확정 절로 재작성**(안 B·C 기각 사유 포함) · Blockers 분리
  - `CLAUDE.md` §4 모듈 규칙 표 — **"신선도 판정은 함수 1개" 행 추가**
  - `.claude/skills/300-api-contract-rules/SKILL.md` — `Verification` 3상태 절에 **"캐시된 응답도 수신 시점에 다시 판정한다"** 추가
  - `docs/grill/GRILL_LEDGER.md` 세션 2 카운터 `RESOLVED: 6 / TOTAL: 12`

#### T7 · CORE · 인증 방식 — RESOLVED (2026-08-27)

- **decision:** **Supabase 익명 세션 + `Authorization: Bearer <JWT>`.** 진입 시 `signInAnonymously()`로 발급하고 로그인을 요구하지 않는다. 미인증은 `401`. **매장 콘솔만 정식 로그인 + MFA(TOTP) 승격.**
- **근거:** 세 요구가 동시에 성립하는 유일한 경로다 — `REQ-FUNC-008`(필수 입력 0개)은 로그인 화면을 금지하고, `REQ-NF-018`(전 API 인증)은 주체를 요구하며, `C-DRV-004`(RLS가 유일한 방어선)는 `auth.uid()`를 요구한다. **쿠키가 아니라 헤더인 이유**는 진입이 지도 앱 내 탭(ADR-006 · R6)이라 인앱 브라우저의 쿠키·스토리지 정책에 걸릴 수 있고(`CLI-A` 실측 미완), `Authorization` 헤더는 그 제한과 무관하기 때문이다. API 키 안은 클라이언트 번들에서 공개되고 `auth.uid()`가 없어 `C-DRV-004`를 무력화한다.
- **이월 (범위 밖):** **익명 사용자 id ↔ `TRK-B` `session_id` 중 어느 쪽이 KPI 분모인가.** 계약이 아니라 `CLI-A`·`TRK-B` 사안이므로 여기서 정하지 않는다. `CLI-A` DoD의 *"`session_id`가 `TRK-B` 세션 정의와 일치하는가"* 에서 함께 정한다.
- **applied:**
  - `docs/issues-aiplace/tasks/SPEC-001.md` — 확정할 규약 표 인증 행 **(미정) → 확정** · Task Breakdown 체크 · **§"인증 규약" 신설**(세 요구 대조표 · 헤더인 이유 · 이월 항목)
  - `CLAUDE.md` §3 스택 표 인증 행 — 익명 세션 + Bearer JWT 명시
  - `.claude/skills/300-api-contract-rules/SKILL.md` — **§"인증 — 전 API 필수" 신설**
  - `docs/grill/GRILL_LEDGER.md` 세션 2 카운터 `RESOLVED: 7 / TOTAL: 12`

#### T8 · CORE · `422` 채택 여부 — RESOLVED (2026-08-27)

- **decision:** **`422`를 만들지 않는다.** 상태 코드는 `200`·`400`·`401`·`5xx` 넷. 파싱 실패는 `200` + 응답 최상위 `fallbackApplied: true`.
- **근거:** `REQ-FUNC-009`의 파싱 실패는 §4.5.3 **정상 분기**이지 오류가 아니다. **`422`도 `4xx`라 `400`과 같은 문제를 그대로 갖는다** — 클라이언트가 오류 경로(catch)에서 화면을 전환해야 하고 `REQ-NF-009` 파싱 실패율 분모가 오염된다. `SPEC-001` Scenario 2가 이미 *"`422`가 아니라 폴백 전환 신호를 반환"* 이라고 서술해 이 결정을 전제하고 있었다.
- **T4와의 연쇄:** 폴백 전환 신호를 응답 최상위에 두기로 한 T4가 **`200`으로 실어 보낼 자리를 이미 만들었다.** `422`는 쓸 데가 없다.
- **하네스 모순 2건째 발견·수정:** `300` 스킬 상태 코드 표에 `422` 행이 살아 있었다 (T3의 "Top-3 고정"에 이어 두 번째).
- **applied:**
  - `.claude/skills/300-api-contract-rules/SKILL.md` — 상태 코드 표 `422` 행을 **불채택 + 사유**로 교체
  - `docs/issues-aiplace/tasks/SPEC-001.md` — 상태 코드 표에서 `422` 제거 · **§"상태 코드는 이 넷뿐이다" 확정 서술로 재작성** · Task Breakdown·DoD 체크 · **Blockers를 확정 완료(T1·T7·T8) / 미정으로 재편**
  - `docs/grill/GRILL_LEDGER.md` 세션 2 카운터 `RESOLVED: 8 / TOTAL: 12`

#### T9 · CORE · `REQ-NF-001` 측정 조건 — RESOLVED (2026-08-27)

- **decision:** **`IN-C`(#170) 관측성 계층에 위임한다.** 계약에는 위임 사실과 **위임 항목 5종**만 명시 — 데이터량 · RPS · 캐시 상태 · 측정 지점 · **선정 이유 생성 비용 포함 여부**.
- **근거:** 측정 조건은 계약이 아니라 **관측 체계의 속성**이다. 계약에 숫자를 박으면 관측 체계가 다른 조건으로 재기 시작할 때 계약을 고쳐야 한다. `CLI-E`가 이미 *"측정 방법이 요구의 일부 — `IN-C`와 같은 자리에서 정해야 한다"* 고 적었고 `TEST-014a`의 선행이 `IN-C`·`IN-D`·`IN-E`·`IN-G`다.
- **T5가 만든 새 항목:** 위임 항목 5번은 원래 없던 것이다. **선정 이유를 저장하지 않기로 해 매 응답 생성 비용이 p95 예산을 소모한다** — 측정에서 빼면 실제와 다른 수치가 나온다.
- **주의:** 위임은 방치가 아니다. **목록을 명시하지 않으면 `IN-C`가 빠뜨리고 `TEST-014a`가 판정 불가가 된다.**
- **applied:**
  - `docs/issues-aiplace/tasks/SPEC-002.md` — 제약 항목의 (미정) → **`IN-C` 위임**으로 교체 · **§"`REQ-NF-001` 측정 조건 — `IN-C`에 위임한다" 신설**(위임 항목 5종 표) · Blockers 확정 완료로 이동
  - `docs/grill/GRILL_LEDGER.md` 세션 2 카운터 `RESOLVED: 9 / TOTAL: 12` — **CORE 9건 전건 해소**

#### T10 · MINOR · 오류 응답 3건 — RESOLVED (2026-08-27)

- **decision:** 미존재 place · 유효하지 않은 후보 id · 근거 4항목 누락 **셋 다 `400`.** 누락 항목명은 오류 본문 `message`에 넣는다 — `{ code: "EVIDENCE_MISSING", message: "확인 주체 누락", requestId }`. **`404`를 신설하지 않는다.**
- **근거:** T8이 상태 코드를 `200`·`400`·`401`·`5xx` 넷으로 확정했으므로 `404` 신설은 T8을 되돌리는 셈이다. 미존재 place도 **클라이언트가 보낸 id가 계약과 맞지 않는 경우**라 `400`("계약 위반") 정의에 들어간다. `SPEC-004` Scenario 3이 이미 `400`을 제안했다.
- **항목명을 넣는 이유:** `SPEC-008`의 4항목은 **동등하게** 취급되므로 구현이 실수로 3개만 검사할 수 있다. 항목명이 없으면 그 실수가 드러나지 않고 `MOCK-003`의 항목별 누락 4종 검증이 무의미해진다.
- **기각한 안:** 미존재 place를 `200` + 빈 목록으로 두면 **id 오타와 실제 부재를 구분하지 못해** 클라이언트가 안내 문구를 고를 근거가 없다.
- **applied:**
  - `docs/issues-aiplace/tasks/SPEC-003.md` — 미존재 place 응답 **(미정) → `400` 확정** (`404` 미신설 사유 포함)
  - `docs/issues-aiplace/tasks/SPEC-004.md` — Task Breakdown 체크 · **§"근거 누락 `400`의 본문" 신설**(JSON 예시 + `MOCK-003` 검증 연결)
  - `.claude/skills/300-api-contract-rules/SKILL.md` — §오류 응답에 **리소스 부재도 `400`** · **누락 항목명 표기** 규칙 추가
  - `docs/grill/GRILL_LEDGER.md` 세션 2 카운터 `RESOLVED: 10 / TOTAL: 12`

#### T11 · MINOR · 열화 동작 2건 — RESOLVED (2026-08-27)

- **decision:** **p95 초과** → `200`과 응답 유지 + 지연 계측 · 화면은 `근거대기` · `REQ-NF-008` 오류율 분자 제외. **이미지 생성 실패** → `5xx` 전체 실패 · 카드 미생성 · 화면은 `재시도안내`. **딥링크만 반환하지 않는다.**
- **근거:** **p95는 성능 목표이지 실패 조건이 아니다** — 초과했다고 응답을 버리면 가진 데이터를 버리는 것이라 §8.3 규칙 5에 반하고, 오류로 잡으면 `REQ-NF-008` 오류율 분자가 오염된다. 반면 **외부로 유통되는 산출물은 다르다**: 딥링크만 내보내면 **근거 4항목이 이미지 안에 없는 채로 나가고 회수가 불가능**하다. `UX-D` Scenario 2의 *"누락 시 대체 템플릿을 두지 않는다"* 를 우회하는 경로가 되고 `EVD-C`의 근거 누락 `400`이 무력해진다.
- **하네스 정합화 3건째:** `304` 스킬 "후보가 부족할 때"가 조건 완화 이후를 명시하지 않아 **T3(3은 상한)과 어긋난 채였다.** 함께 정합화했다.
- **applied:**
  - `docs/issues-aiplace/tasks/SPEC-003.md` — Scenario 2 **(미정) → `200` 유지 확정** (오류율 분자 제외 명시)
  - `docs/issues-aiplace/tasks/SPEC-004.md` — Scenario 2 **(미정) → `5xx` 전체 실패 확정** (딥링크 단독 반환 금지 사유)
  - `.claude/skills/304-error-degradation/SKILL.md` — "후보가 부족할 때"에 **T3 상한 해석 · 제외 사유 둘 · 최상위 필드 연결** 추가 · **§"성능 목표 초과는 실패가 아니다" 신설**(외부 유통물은 부분 성공 금지)
  - `docs/grill/GRILL_LEDGER.md` 세션 2 카운터 `RESOLVED: 11 / TOTAL: 12`

#### T12 · MINOR · 공유 카드 유효기간 — RESOLVED (2026-08-27)

- **decision:** **딥링크는 `verifiedAt + 90일` 이상 경과 시 만료** (만료 시 `근거대기` 상태로 보낸다). **이미지는 만료 없음.**
- **근거:** **이미지 만료는 물리적으로 불가능하다** — 메신저에 저장된 파일은 회수할 수 없다. 그래서 `UX-D`가 *"확인 일자와 주체가 이미지 안에 읽히는 크기로"* 를 요구하는 것이고, **카드가 스스로 자기 나이를 말하는 것**이 유일한 방어다. 통제 가능한 건 딥링크뿐이니 거기에 만료를 건다. 둘 다 만료시키는 안은 **계약이 지킬 수 없는 약속**이 된다.
- **새 임계값을 만들지 않았다:** 90일은 `REQ-FUNC-011` 신선도 임계 재사용. **T1 경계 규약이 그대로 적용된다** — 90일 당일부터 만료.
- **applied:**
  - `docs/issues-aiplace/tasks/SPEC-004.md` — Task Breakdown 체크 · **§"카드 유효기간" 신설**(딥링크/이미지 대조표 + 지킬 수 없는 약속 경계) · **Blockers를 확정 완료(T10·T11·T12)로 재편**
  - `docs/grill/GRILL_LEDGER.md` 세션 2 카운터 `RESOLVED: 12 / TOTAL: 12` · `STOP REASON: ALL_RESOLVED`

---

## Closeout — 세션 2 · 2026-08-27

**STOP REASON: ALL_RESOLVED** · RESOLVED 12 / TOTAL 12 (CORE 9/9 · MINOR 3/3)

질문 12건 · 범위를 읽는 중 이미 확정돼 있어 질문하지 않은 것 4건(F1~F4).

### 부수 성과 — 하네스 모순 3건 발견·수정

**결정을 반영하는 과정에서 하네스가 이미 틀린 값을 들고 있던 것이 셋 드러났다.**

| # | 어디 | 무엇이 틀렸나 | 어느 결정에서 |
| --- | --- | --- | --- |
| 1 | `300` 스킬 | *"`REQ-FUNC-014`는 **Top-3 고정**"* — 3은 상한이다 | T3 |
| 2 | `300` 스킬 | 상태 코드 표에 `422` 행이 살아 있었다 | T8 |
| 3 | `304` 스킬 | "후보가 부족할 때"가 조건 완화 이후를 명시하지 않아 T3과 어긋남 | T11 |

**셋 다 그대로 뒀으면 에이전트가 틀린 규칙을 강제했을 것이다.**

### 결정이 서로를 바꾼 연쇄

```
T1 경계 포함 ─→ T2 STALE 노출 ─→ T3 3개 미만 실제 발생 ─→ T4 최상위 필드가 0개 응답에서 필수
                     └──→ T6 캐시 구멍이 더 자주 열림
T5 선정 이유 파생 ─→ T9 측정 조건에 생성 비용 포함 (없던 항목)
T4 fallbackApplied ─→ T8 422 가 쓸 데 없어짐
T8 상태 코드 넷 ─→ T10 404 신설 안 함
```

### 범위 밖으로 이월 1건

**익명 사용자 id ↔ `TRK-B` `session_id` 중 어느 쪽이 KPI 분모인가** (T7 파생). 계약이 아니라 `CLI-A`·`TRK-B` 사안이다.

### 남은 작업 — GitHub 이슈 본문 동기화

이 세션이 고친 태스크 본문 5건은 **로컬 파일만 갱신됐다.** `INDEX.md`의 대조 규칙에 따라 이슈 본문도 갱신해야 한다.

```
#94  SPEC-001   #95 SPEC-002   #96 SPEC-003   #97 SPEC-004   #101 SPEC-008
gh issue edit <번호> --body-file docs/issues-aiplace/tasks/<ID>.md
```
