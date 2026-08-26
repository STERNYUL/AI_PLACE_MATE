# Grill Ledger — 경량 시각 스파이크 착수 전 결정

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
RESOLVED: 6 / TOTAL: 8   (CORE 4/4 · MINOR 2/4) — **CORE 전건 해소**
- [x] T1 | CORE  | 실행 형태 — Next.js(Node 설치) vs 단일 HTML 목업 vs Vite   | depends:-  | status:RESOLVED
- [x] T2 | CORE  | 스파이크 코드의 지위 — 본 코드베이스 흡수 vs 판정 후 폐기   | depends:T1 | status:RESOLVED
- [x] T3 | CORE  | 잠정 타입 범위 — 근거 4항목 필드명 지금 확정 vs 계약 시 교체 | depends:T2 | status:RESOLVED
- [x] T4 | CORE  | fixture 시나리오 집합 — 15상태 전부 vs 카드+열화 10상태만    | depends:T3 | status:RESOLVED
- [x] T5 | MINOR | 산출물 배치 — /preview 갤러리 1페이지 vs 화면별 라우트        | depends:T1 | status:RESOLVED (T1 흡수)
- [x] T6 | MINOR | 열화 6상태 명칭 — 102 스킬의 6개 채택 여부                    | depends:T4 | status:RESOLVED (하네스 강제)
- [ ] T7 | MINOR | fixture 카피 — 실제 카피 초안 vs 자리표시자                   | depends:T4 | status:UNRESOLVED
- [ ] T8 | MINOR | 브랜치·커밋 처리 — 스파이크 브랜치명 · PR 여부                | depends:T2 | status:UNRESOLVED
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
