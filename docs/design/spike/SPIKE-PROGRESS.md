# [진행 원장] 시각 스파이크 — 작업 추이

**문서 ID:** SPIKE-PROGRESS-AIPLACE-001
**목표문:** [`docs/goals/visual-spike-build.md`](../../goals/visual-spike-build.md) (GOAL-AIPLACE-SPIKE-001)
**실행 프롬프트 사본:** [`docs/goals/visual-spike-build-prompt-20260827-1444.md`](../../goals/visual-spike-build-prompt-20260827-1444.md)
**브랜치:** `feat/137-visual-spike` (기점 `ea4c76e` — `docs/137-spike-goal`)
**대표 이슈:** [#137](https://github.com/STERNYUL/AI_PLACE_MATE/issues/137)

> **이 문서는 상태판이다.** 결론은 [`SPIKE-FINDINGS.md`](SPIKE-FINDINGS.md) 에 있다.

---

## 0. 현재 상태

| 항목 | 값 |
| --- | --- |
| **경로** | **A — node 있음** (`v24.19.0` · npm `11.17.0`) |
| **판정 명령** | **15 / 15 통과** (§3.1 13개 + §3.2 14·15) |
| **미정 5건 판정** | **5 / 5 기록** · 판정 불가 0건 |
| **13상태 렌더** | **확인** — `GET /preview 200` · 12개 상태 라벨 HTML 확인 |
| **`aztks-agent` 라운드** | 1회차 디스패치 대기 |
| **종료 코드** | *(미확정 — `aztks-agent` GO 시 `SPIKE_ACCEPTED`)* |

---

## 1. 경로 판정 — 착수 즉시 1회

```
$ node -v            → 최초 command not found (PATH 미반영)
$ ls "C:\Program Files\nodejs\node.exe"  → 존재
$ PATH 보정 후 node -v / npm -v          → v24.19.0 / 11.17.0
```

**목표문 §2.7 이 예고한 상황 그대로였다** — 설치는 돼 있는데 셸이 설치 전에 시작돼 PATH 에 없다.
`command -v` 만으로 판정했으면 경로 B 로 잘못 내려갔을 것이다. **파일이 있으면 node 는 있는 것**이라는 규칙이 실제로 경로를 갈랐다.

---

## 2. 5단계 진행

| # | 단계 | 상태 | 커밋 | 산출 |
| --- | --- | --- | --- | --- |
| 1 | 프로젝트 초기화 + 토큰 + shadcn/ui | **완료** | `b49977e` | `package.json` · `tsconfig` · `next.config` · `postcss` · `components.json` · `env.ts` · `app/layout.tsx` · `app/globals.css` · `components/ui/**` |
| 2 | 후보 카드 + 근거 게이트 + fixture 3종 | **완료** | `7ccb3f4` | `types/draft.ts` · `lib/evidence/**` · `lib/search/**` · `lib/fixtures/**` · `components/candidate-card.tsx` · `gate-result.tsx` |
| 3 | 열화 6상태 | **완료** | `871ef26` | `components/state-panel.tsx` · `components/states/*.tsx` 6개 |
| 4 | 조건 입력 3상태 | **완료** | `61da031` | `components/query-input.tsx` |
| 5 | 갤러리 정리 + **미정 5건 판정** | **완료** | *(이 커밋)* | `app/preview/page.tsx` · `gallery-frame.tsx` · `SPIKE-FINDINGS.md` |

**3·4단계를 병렬 레인으로 돌리지 않았다.** 파일은 겹치지 않지만 두 단계가 같은 공통 골격(`state-panel.tsx` · `candidate-facts.tsx`)을 쓰게 돼, 순차로 만드는 편이 중복 구현을 안 만든다.

---

## 3. 판정 명령 현황 — 15 / 15

### §3.1 — 13개 (node 불필요)

| # | 항목 | 기대 | 실측 | |
| --- | --- | --- | --- | --- |
| 1 | 열화 6상태 컴포넌트 존재 | `= 6` | **6** | ✅ |
| 2 | 갤러리에 13상태가 걸려 있다 | `≥ 13` | **24** | ✅ |
| 3 | fixture 응답 최상위 필드 | `≥ 3` | **3** | ✅ |
| 4 | 확인 주체 열거형 4종 | `= 4` | **4** | ✅ |
| 5 | 잠정 타입 주석 `DRAFT: SPEC-008` | `≥ 1` | **1** | ✅ |
| 6 | 컴포넌트가 날짜를 직접 계산하지 않는다 | `= 0` | **0** | ✅ |
| 7 | 근거 4항목이 카드의 필수 props | `= 4` | **4** | ✅ |
| 8 | 판정형 어휘 0건 | `0 matches` | **0** | ✅ *(1회 실패 후 수정 — §5)* |
| 9 | 정렬 판매 금지 | `= 0` | **0** | ✅ |
| 10 | 잠정 타입이 한 파일에 격리 | `= 1` | **1** | ✅ |
| 11 | fixture 에 근거 누락 4종 | `≥ 4` | **4** | ✅ |
| 12 | `PREVIEW_ENABLED` 가 env 스키마에 | `≥ 1` | **3** | ✅ |
| 13 | 티켓이 하나도 닫히지 않았다 | `= 5` | **5** | ✅ |

### §3.2 — 경로 A 추가 2개

| # | 항목 | 기대 | 실측 | |
| --- | --- | --- | --- | --- |
| 14 | `npm run build` | `exit 0` | **0** | ✅ |
| 15 | `/preview` 렌더에 `STALE`·`제외` | `= 2` | **2** | ✅ |

**15번 렌더 확인 상세** — `GET /preview 200 in 792ms`. HTML 에서 확인된 상태 라벨:

```
근거 완비 · 근거대기 · 근거생략 · 유사메뉴대체 · 재시도안내 · 제안없음
제외 · 근거 누락 · 제외 · 재확인 대기 · 입력 전 · 파싱 결과 확인 · 폴백 전환 고지 · 폴백표시
```

---

## 4. `aztks-agent` 평가 라운드

**호출 예산 3회** (최초 1 + 재호출 2). 4회를 돌리지 않는다 — 3회에 못 넘으면 화면이 아니라 스파이크 문서 §1 구성이 문제다.

| 라운드 | 판정 | 지적 항목 | 대응 |
| --- | --- | --- | --- |
| 1 | *(디스패치 대기)* | — | — |

---

## 5. 도중에 걸린 것 — 무엇이 어떻게 갈렸나

| # | 상황 | 처리 |
| --- | --- | --- |
| 1 | **브랜치를 `main` 기점으로 만들었다** | 목표문 §1 이 금지한 것. `git rebase --autostash docs/137-spike-goal` 로 기점을 옮겼다. `--autostash` 없이는 untracked 스캐폴드 때문에 rebase 가 거부된다 |
| 2 | **워킹트리 브랜치가 세션 중 바뀌어 있었다** | 사용자가 목표문을 두 번 갱신(`ed89af6` · `ea4c76e`)하며 `docs/137-spike-goal` 로 돌아가 있었다. `git switch` 후 rebase |
| 3 | **판정 8번 실패 1회** | `components/states/similar-dish.tsx` 주석의 `"조용히 바꾸면"`. `"말없이"` 로 교체. **금지 목록이 카피가 아니라 주석에서 걸렸다** — grep 이 파일 전체를 본다는 뜻이다 |
| 4 | **`next dev` 가 루트 `AGENTS.md` 를 덮어썼다** | 범위 밖 파일이다. `git checkout` 으로 복원하고 `next.config.ts` 에 `agentRules: false` 를 넣어 재발을 막았다 |
| 5 | **`create-next-app` 을 쓰지 않았다** | 저장소 루트에 문서 파일이 많아 스캐폴더가 충돌한다. 설정 파일을 직접 작성 |
| 6 | **fixture 상호를 표본 표기로 뒀다** | 실제 매장을 조사할 수단이 없었다. 스파이크 문서 §3 의 파생 가드(*"실제 매장명 + 미확인 사실 = 근거 없는 정보 노출"*)를 따른 결과다. [`SPIKE-FINDINGS.md`](SPIKE-FINDINGS.md) §7.1 |

---

## 6. 종료 조건 대비

| 조건 | 현재 |
| --- | --- |
| 경로 A — `aztks-agent` GO + 15개 전부 일치 → `SPIKE_ACCEPTED` | 15/15 일치 · GO 대기 |
| `aztks-agent` NO-GO 누적 3회 → `EVAL_BUDGET` | 0회 |
| 같은 항목 3회 연속 불일치 → `VERIFY_STUCK` | 최다 1회 (8번) |
| 라운드 누적 40회(경로 A) → `TURN_CAP` | 여유 |

---

*갱신: 2026-08-27*
