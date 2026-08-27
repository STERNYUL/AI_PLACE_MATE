# [경량 스파이크] AI-Place-Mate — 로컬 시각 확인 최소 범위

**문서 ID:** PROTO-AIPLACE-LITE-001
**개정 버전:** 1.0
**날짜:** 2026-08-26
**상위 문서:** [`prototype-suggestion.md`](prototype-suggestion.md) (PROTO-AIPLACE-001 · 정식 선별 18건 · 7주)
**기준 일정:** [`EXEC-ai-place-compressed-v1.0.md`](../EXEC-ai-place-compressed-v1.0.md)

> **이 문서가 상위 문서와 다른 점** — 상위 문서는 **"프로토타입을 본 코드베이스의 첫 층으로 삼는"** 범위다(18건 · 20.6 인·주 · 7주).
> 이 문서는 그중 **"로컬에서 눈으로 보는 것"만** 남긴 범위다(**5건 부분 착수 · 0건 종료 · 4일**).
> **계약·Mock 서버·게이트웨이·배포를 전부 뺐다.** 남은 것은 화면과 fixture뿐이다.
>
> 착수 전 결정은 [`docs/grill/GRILL_LEDGER.md`](grill/GRILL_LEDGER.md)에서 해소한다.

---

## 0. 한 장 요약

| 항목 | 정식 (상위 문서) | **경량 (이 문서)** |
| --- | --- | --- |
| 티켓 | 18건 선택 · 12건 종료 | **5건 부분 착수 · 종료 0건** |
| 공수 | 20.6 인·주 | **4일 · 1명** |
| 임계 사슬 | **7주** (계약 5주가 지배) | **1주** |
| 계약 (`SPEC-`) | 5건 확정 | **0건** — `types/draft.ts` 잠정 타입 1파일로 대체 |
| Mock 서버 (`MOCK-001`) | OpenAPI 자동 검증 | **없음** — `lib/fixtures/*.json` 직접 |
| 백엔드·플랫폼 | Route Handler + Vercel Preview | **없음** — 네트워크 호출 자체가 없다 |
| 배포 | Vercel Preview URL | **로컬 dev 서버만** |
| 착수 전 확정 | 4건 | **2건** |
| 해소되는 미정 | 9건 | **5건** — §5 |

**한 문장** — **화면 13상태를 한 페이지에 나열해, 이 제품이 어떻게 보이는지 4일 안에 결론 낸다.**

---

## 1. 무엇을 만드는가 — 화면 3종 · 상태 13개 *(T4 · 2026-08-26)*

**산출물은 앱이 아니라 갤러리 한 페이지다.** 라우팅·상태관리·API 호출 없이, fixture를 넣고 컴포넌트를 나열한다.

| # | 화면 | 상태 | 무엇을 눈으로 판정하나 |
| --- | --- | --- | --- |
| **1** | **Top-3 후보 카드** | 4 — 근거 완비 · `STALE` · **제외: 근거 누락** · **제외: 재확인 대기** | 근거 4항목이 카드에 다 들어가는가. **경고가 묻히지 않는가.** 게이트가 실제로 거르는가 |
| **2** | **열화 상태** | 6 — `폴백표시` `근거대기` `근거생략` `유사메뉴대체` `제안없음` `재시도안내` | 어느 상태에도 빈 화면이 없는가. **각 상태에 다음 행동이 있는가** |
| **3** | **조건 입력** | 3 — 입력 전 · 파싱 결과 확인 · **폴백 전환 고지** | 전환 고지가 **오류로 읽히지 않는가** |
| | | **13** | |

### 카드 4상태 중 둘은 '제외'다 — 게이트 결과 패널 (확정 · Grill S4-T1)

**세션 2 T2가 `RECHECK_REQUIRED`를 정렬 이전 제외로 확정**했으므로 카드로 렌더될 일이 없다. 세션 2 T3은 제외 사유가 **둘**임을 응답 최상위에 실었다.

| 상태 | 렌더 | 대응 필드 |
| --- | --- | --- |
| 근거 완비 | 정상 카드 | — |
| `STALE` | 정상 카드 + **경고 병기** | `verifiedAt` (수신 시점 판정) |
| **제외: 근거 누락** | **패널** — *제외됨 + 사유* | `excludedByEvidence` |
| **제외: 재확인 대기** | **패널** — *제외됨 + 사유* | `excludedByRecheck` |

**스파이크의 목적이 게이트가 실제로 거르는지 눈으로 보는 것**이다. 두 사유를 구분해 보여줘야 **§5 #4(후보 3개 미만 화면)** 를 판정할 수 있다 — 3개가 안 되는 이유가 무엇인지에 따라 화면 카피가 달라진다.

**카드로 그대로 렌더하는 안을 기각한 이유** — 세션 2 T2가 제외로 확정했으므로 **실제로 존재하지 않는 화면**을 그리게 되고, 나중에 그 컴포넌트를 지워야 한다.

### 공유 카드를 뺀 이유 (T4)

**공유 카드 2상태는 §5 미정 항목 어느 것에도 기여하지 않는다.** 미정 해소는 위 3종에서 전부 나온다.

| 미정 | 필요한 화면 |
| --- | --- |
| #3 신선도 위계 · #4 후보 3개 미만 화면 · #1 판정형(부분) | 카드 4상태 |
| #6 후보 0건 조건 완화 | 열화 6상태 |
| #5 부분 파싱 필드 이월 | 입력 3상태 |

**같은 판정력을 0.5일 싸게 산다.** 공유 카드는 `SPEC-004` 계약과 `MOCK-005`의 근거 누락 `400` 경로가 함께 있을 때 그리는 것이 순서상 맞다 — `UX-D` 정식 착수 시점이다.

> **열화 6상태 명칭은 이미 정해져 있다.** [`.claude/skills/102-ux-stage-deliverables`](../.claude/skills/102-ux-stage-deliverables/SKILL.md)와 `docs/goals/ux-design-stage.md`의 완료 판정 grep이 이 6개를 그대로 센다. **새 이름을 만들지 않는다.**

---

## 2. 티켓 대응 — 5건 부분 착수 · 종료 0건

**티켓을 하나도 닫지 않는다.** 스파이크의 산출물은 인수 기준을 만족하는 완성품이 아니라, **정식 티켓의 입력**이다.

| 티켓 | 이슈 | 이 스파이크에서 하는 것 | 정식 티켓에 남는 것 |
| --- | --- | --- | --- |
| `UX-A` | [#140](https://github.com/STERNYUL/AI_PLACE_MATE/issues/140) | 토큰(색·타이포·간격) + **후보 카드 컴포넌트 골격을 코드로** | LCP 숫자 예산 · 지도 내 탭 안전 영역 실측 · 접근성 기준 · 문서화 |
| `UX-B` | [#141](https://github.com/STERNYUL/AI_PLACE_MATE/issues/141) | 조건 입력 3상태 + **전환 고지 카피 초안** | 부분 파싱 이월 확정 · 입력 예시 설계 · 문서화 |
| `UX-C` | [#142](https://github.com/STERNYUL/AI_PLACE_MATE/issues/142) | 카드 레이아웃 · 근거 4항목 배치 · **신선도 3상태 표기 위계** | 라이팅 가이드 정본(`WRITING-GUIDE.md`) · `EVD-B` 판정형 사전 통합 |
| `UX-F` | [#145](https://github.com/STERNYUL/AI_PLACE_MATE/issues/145) | **열화 6상태 화면** | 각 상태의 다음 행동 확정 · `UX-A` 상태 컴포넌트로 환원 |
| `CLI-C1` | [#137](https://github.com/STERNYUL/AI_PLACE_MATE/issues/137) | 카드 렌더 컴포넌트 + **클라이언트 근거 게이트** | 실 API 통합 · Mock 서버 연동 · 공유·신고 · 4G 실측 |

**뺀 것** — `SPEC-001`·`002`·`003`·`004`·`008`(계약 5건) · `MOCK-001`~`005`(Mock 5건) · `CLI-A`(앱 셸) · `CLI-B`(입력 UI 정식 구현) · **`UX-D`(#143 공유 카드 — T4에서 제외)**.
`CLI-A`를 뺀 부수 효과가 하나 있다 — **상위 문서 §4의 `CLI-A` ← `IN-A` 절단 문제가 사라진다.** `/task-start`를 쓰지 않으므로 기계 검증에 걸릴 것이 없다.

---

## 3. 대체물 — 무엇을 무엇으로 바꾸나

| 정식 | 경량 대체 | 나중에 어떻게 승격되나 |
| --- | --- | --- |
| `SPEC-002`·`008` 응답 계약 | **`types/draft.ts` 한 파일** — `// DRAFT: SPEC-008 확정 시 교체` 주석 필수. 근거 4항목 props는 **camelCase 4개 필수** (T3) | 계약 확정 시 **이 파일만 교체된다.** wire 표기가 바뀌면 `lib/search/client.ts`의 변환 함수 1개만 고친다 |
| `MOCK-001` OpenAPI 자동 검증 | **없음** | `MOCK-001` 착수 시 fixture를 Mock 응답 정의로 이관 |
| `MOCK-002` Top-3 6시나리오 | `lib/fixtures/top3.json` — **실제 매장 3곳 공개 정보** (T4·T7) · **응답 형상은 세션 2 T4** | 시나리오 이름이 그대로 `MOCK-002`의 스위치 키가 된다 |
| `MOCK-003` 근거 누락 4종 | `lib/fixtures/evidence-missing.json` — 가상 | 동일 |
| `MOCK-004` 신선도 3상태 + 경계 3종 | `lib/fixtures/freshness.json` — 가상 | 동일 |
| `IN-A` API Gateway | **없음** — 네트워크 호출이 없다 | — |
| Vercel Preview 배포 | 로컬 dev 서버 | 인앱 브라우저 실측 시점에 필요해진다 |

### fixture 형상 — 세션 2·3 결정이 그대로 들어간다

계약 세션(2)과 데이터 세션(3)이 이 형상을 이미 확정했다. **스파이크가 다른 형상을 쓰면 `MOCK-00x` 이관 때 다시 만진다.**

```
top3.json
  candidates: [                      ← SRS 여섯 항목 · JSON 키 7개
    { id, priceRange: { min, avg, max },   ← 셋 다 필수 (S3-T3)
      signatureDish, contextAttributes,
      selectionReason,                     ← 파생값 (S2-T5) · 주석 필수
      verifiedAt,                          ← 판정은 freshness.ts (S2-T6)
      verifiedBy: "INTERNAL_SURVEY" }      ← 열거형 4종 (S3-T2)
  ],
  fallbackApplied, overBudgetCount,        ← 응답 최상위 (S2-T4)
  substitutedDish,
  excludedByEvidence, excludedByRecheck    ← 제외 사유별 건수 (S2-T3)
}
```

| 결정 | 스파이크에 미치는 영향 |
| --- | --- |
| **S3-T2** `verifiedBy` 열거형 | fixture는 `"INTERNAL_SURVEY"` · **표시명 매핑 함수가 `lib/evidence`에 필요** |
| **S2-T6** 신선도 수신 시점 판정 | **`lib/evidence/freshness.ts`가 스파이크 산출물에 포함**된다 |
| **S3-T3** `PriceProfile` 3필드 | 셋 다 채우고 **축약은 `lib/search` 표시 함수** |
| **S2-T5** `selectionReason` 파생 | fixture에 값을 넣되 **`// 파생값 — EVD-B 생성. 저장 대상 아님`** 주석 필수 |
| **S2-T8** `422` 불채택 | 폴백은 오류가 아니라 `fallbackApplied: true` |

### ⚠️ 실제 매장명을 쓰면 확인 주체를 사칭하지 않아야 한다 (T7 · S3-T2로 형상 갱신)

판정형 어휘 grep이 `lib/fixtures/`까지 검사하므로 **자리표시자를 쓸 수 없다.** 그래서 실제 공개 정보를 넣는데, 여기에 함정이 있다.

| 하는 것 | 하지 않는 것 |
| --- | --- |
| 실제 매장명 · 공개된 좌석수·가격 | 확인하지 않은 사실을 단정 |
| `verifiedBy` = **`INTERNAL_SURVEY`** (열거형 · S3-T2) | `verifiedBy` = `MERCHANT` — **사칭이다** |
| `verifiedAt` = 조사한 날 | 조사하지 않은 날짜 |

**실제 매장명 + 미확인 사실 = 근거 없는 정보 노출**이고, 이것이 §8.3 규칙 1이 금지하는 바로 그것이다.
**T2의 `PREVIEW_ENABLED` 차단이 여기서 필수 조건이 된다** — 차단이 없으면 미확인 사실이 사용자에게 나간다.

**얻는 것** — 실제 3곳을 채워 보면 **어느 항목이 현실에서 비는지**가 즉시 드러난다. 누락 4종과 신선도 경계는 인위적으로 만드는 것이 목적이므로 가상으로 둔다.

> `SPEC-008`의 *"4항목 데이터 출처 확정"* 은 **세션 3 T5가 이미 해소**했다 — `selectionReason`만 파생, 나머지 셋은 `Attribute`·`Verification`. 스파이크는 그 형상이 화면에서 실제로 채워지는지를 본다.

### ⚠️ 이것이 상위 문서 §10의 '안 B'다 — 다만 대가를 통제한 형태

상위 문서는 계약 초안 선행(안 B)을 **권장하지 않는다**고 적었다. 사유는 *"계약 확정 시 `CLI-C1` 재작업"* 이었다.
**경량 스파이크에서는 그 대가가 세 가지로 통제된다.**

| 통제 | 방법 |
| --- | --- |
| **재작업 범위** | 잠정 타입을 `types/draft.ts` **한 파일**에 격리. 컴포넌트는 그 타입만 참조한다 |
| **잘못된 완료 판정** | **티켓을 하나도 닫지 않는다.** 스파이크는 인수 대상이 아니다 |
| **Mock 오염** | Mock 서버를 만들지 않는다. fixture는 `MOCK-00x`의 **입력**이지 대체물이 아니다 |

---

## 4. 실행 형태 — 로컬에서 어떻게 보나

### 4.1 확정 — Next.js + `/preview` 갤러리 1페이지 *(T1 · 2026-08-26)*

```
app/preview/page.tsx           13상태를 세로로 나열. 라우팅·상태관리 없음
components/candidate-card.tsx  근거 4항목 필수 props
components/gate-result.tsx     제외 2종 패널 (S4-T1)
components/states/*.tsx        열화 6상태
lib/evidence/gate.ts           클라이언트 근거 게이트
lib/evidence/freshness.ts      신선도 판정 단일 원천 (S2-T6)
lib/evidence/verified-by.ts    verified_by 열거값 → 표시명 (S3-T2)
lib/search/format.ts           priceRange 축약 (S3-T3)
lib/fixtures/*.json            top3 · evidence-missing · freshness
types/draft.ts                 잠정 타입 — 계약 확정 시 교체
```

**`?scenario=` 쿼리 하나로 전환한다.** 스위처 UI를 만들지 않는다 — 갤러리에 전부 동시 렌더하는 것이 더 빠르고, 비교 판정이 쉽다.

| 왜 이 형태인가 | |
| --- | --- |
| **코드가 이어진다** | `components/`·`lib/evidence/`가 그대로 `CLI-C1`의 산출물이 된다. CLAUDE.md §4 디렉터리 규약과 일치 |
| **가볍다** | 라우팅·API 클라이언트·세션·계측 전부 없음. 한 페이지 |
| **판정이 쉽다** | 13상태가 한 화면에 있으면 **신선도 경고가 묻히는지**를 나란히 비교해 볼 수 있다 |

### 4.2 전제 — Node 툴체인

**이 환경에 `node`·`npm`·`pnpm`이 없다.** 스파이크는 돌아가야 의미가 있으므로 이것이 유일한 하드 전제다. `/setup-env`.

**Node 설치가 막히면 대안** — 단일 HTML 파일 목업(`docs/design/ux/preview.html`)으로 같은 13상태를 그린다. 브라우저로 바로 열린다.
**대가는 코드가 이어지지 않는 것이다** — 판정 근거는 얻지만 `CLI-C1`을 다시 만든다.

---

## 5. 이 스파이크가 사는 것 — 미정 5건 (세션 2가 1건을 먼저 해소)

상위 문서 §6의 9건 중 **5건이 로컬 화면만으로 판정된다.** #7(`STALE` 유효성)은 세션 2 T2가 이미 확정했다.

| # | 미정 항목 | 경량으로 판정 가능? | 무엇을 보고 판정하나 |
| --- | --- | --- | --- |
| **3** | 신선도 경고의 시각 위계 | **가능** | 3상태 + 경계 3종을 나란히 놓고 경고가 묻히는지 본다. `REQ-NF-011` 누락률 0%의 실질 근거 |
| **4** | 후보 3개 미만 **화면** | **가능** | **동작은 세션 2 T3이 확정**(3은 상한 · 통과분만 반환). 남은 건 **화면 표현** — 3곳/2곳/0곳 + **제외 사유 둘을 구분해** 비교 |
| **5** | 부분 파싱 시 필드 이월 | **가능** | 이월 / 미이월 두 입력 화면을 나란히 |
| **6** | 후보 0건 시 조건 완화 제안 여부 | **가능** | `제안없음` 상태 화면 2안 비교 |
| ~~**7**~~ | ~~`STALE` 후보의 근거 유효성~~ | **해소됨** | **세션 2 T2가 확정** — 노출 + 경고 병기 · `RECHECK_REQUIRED`는 제외. 스파이크는 **표기 위계만** 본다(#3) |
| **1** | 판정형 어휘 기준 | **부분** | 카피 후보를 카드에 올려 본다. **정본 문서(`WRITING-GUIDE.md`)는 `UX-C` 본작업** |
| **2** | 인앱 브라우저 제약 실측 | **불가** | 실기기 + 배포 URL 필요 |
| **8** | LCP 숫자 예산 | **불가** | 4G 프로파일 실측 필요 |
| **9** | 신고 사유 분류 체계 | **범위 밖** | `UX-D`가 T4에서 제외됐다. `SPEC-004`·`MOCK-005`와 함께 정식 착수 |

> **`EXEC` §6.2의 임계 경로 블로커 2건 중 #5(판정형 어휘)만 부분 진전하고, #8(인앱 실측)은 손대지 못한다.**
> 인앱 실측은 배포 URL이 필요하므로, **경량 스파이크로 화면을 확정한 뒤 그 화면을 배포해 실측하는 순서**가 된다.

---

## 6. 4대 불변 규칙 — 경량에서도 예외가 없다

**스파이크에서 만든 컴포넌트는 지워지지 않는다.** 그래서 여기서 규칙을 어기면 그대로 남는다.

| # | 규칙 | 경량 스파이크에서 |
| --- | --- | --- |
| **1** | 근거 4항목 없는 후보는 반환하지 않는다 | 카드 컴포넌트의 **필수 props 4개** + `lib/evidence/gate.ts`. **fixture에 누락 4종이 있어야 게이트가 증명된다** |
| **2** | 어느 경로에서도 빈 화면을 반환하지 않는다 | **열화 6상태가 이 규칙의 산출물이다.** 6개 중 하나라도 빠지면 스파이크 미완 |
| **3** | 주관적 판정을 내리지 않는다 | 카피에 판정형 어휘 **grep 0건**. fixture의 근거 문장도 사실 진술로 쓴다 |
| **4** | 노출 순서를 판매하지 않는다 | **가격순·거리순 정렬 토글을 만들지 않는다.** fixture 순서를 화면이 재정렬하지 않는다 |

---

## 7. 착수 전 확정 — 2건

정식 4건 중 둘이 사라졌다. `CLI-A`←`IN-A` 절단은 `CLI-A`를 뺐으므로 무효, `UX-001` PM 승인은 **스파이크가 승인 대상 산출물이 아니라 승인 판단 재료**이므로 선행이 아니다(단 `UX-A` 티켓은 닫지 않는다).

해소 이력은 [`docs/grill/GRILL_LEDGER.md`](grill/GRILL_LEDGER.md)에 있다.

| # | 항목 | 상태 | 결정 |
| --- | --- | --- | --- |
| **1** | **실행 형태** | **확정** (T1 · 2026-08-26) | **Next.js App Router + `/preview` 갤러리 1페이지.** Node 설치가 선행 조건 — `/setup-env`. 단일 HTML·Vite 안은 폐기 |
| **2** | **스파이크 코드의 지위** | **확정** (T2 · 2026-08-26) | **`lib/fixtures/`만 폐기 · 나머지 전부 존속.** 갤러리(`app/preview/`)는 원천을 `MOCK-00x`로 갈아끼워 살린다. **`PREVIEW_ENABLED` 플래그로 프로덕션 노출을 막는다 — 필수** |

### 7.1 존속·폐기 경계 (T2 확정)

```
존속
  components/candidate-card.tsx   → CLI-C1 산출물
  components/states/*.tsx         → CLI-C1 산출물
  lib/evidence/gate.ts            → 서버 게이트(EVD-A) 도착 시 이중 방어
  lib/evidence/freshness.ts       → 신선도 판정 단일 원천 (S2-T6). 서버도 이걸 쓴다
  lib/evidence/verified-by.ts     → verified_by 열거값 → 표시명 매핑 (S3-T2)
  types/draft.ts                  → 계약 확정 시 교체
  app/preview/page.tsx            → 원천만 MOCK-00x 로 교체

폐기
  lib/fixtures/*.json             → MOCK-002~004 이관 후 삭제
```

**`PREVIEW_ENABLED`는 선택 장치가 아니다.** 갤러리를 존속시키기로 했으므로 **프로덕션에 시각 스파이크 라우트가 남는다.**
기존 `FEATURE_AGENT_ROOM` 패턴과 같이 서버 전용 환경 변수로 두고, `env.ts`의 zod 스키마에 넣어 **누락 상태로 배포되는 것을 빌드 시점에 차단한다.** 프로덕션 기본값은 `false`.

---

## 8. 일정 — 4일 *(T4 · 2026-08-26)*

| 순서 | 작업 | 소요 | 산출 |
| --- | --- | --- | --- |
| 1 | 프로젝트 초기화 + 토큰 + shadcn/ui 도입 | 1일 | `app/preview/page.tsx` 골격 |
| 2 | 후보 카드 컴포넌트 + 근거 게이트 + fixture 3종 | 1일 | 카드 4상태 |
| 3 | 열화 6상태 | 1일 | 6상태 |
| 4 | 조건 입력 3상태 | 0.5일 | 3상태 |
| 5 | 갤러리 정리 + 판정 세션 | 0.5일 | **미정 5건 판정 기록** |
| | **합계** | **4일** | 13상태 |

**5번이 이 스파이크의 실제 산출물이다.** 화면을 만드는 것이 목적이 아니라, **§5의 미정 5건을 화면 앞에서 결론 내는 것**이 목적이다.
판정 결과는 `UX-B`·`UX-C`·`UX-F` 정식 착수의 입력이 된다.

### 8.1 브랜치 — 문서와 코드를 분리한다 *(T8 · 2026-08-26)*

| 브랜치 | 담는 것 | 시점 |
| --- | --- | --- |
| **`docs/prototype-scope`** | `docs/prototype-*.md` · `docs/grill/GRILL_LEDGER.md` · `CLAUDE.md` · 스킬 `300`·`302` | **지금** |
| **`feat/137-visual-spike`** | `app/preview/` · `components/` · `lib/` · `types/` · `env.ts` | Node 설치 후 |

**대표 이슈는 `#137`(`CLI-C`)이다.** `UX-A`·`B`·`C`·`F` 4건은 문서 티켓이고 스파이크는 그 **코드적 선반영**이므로, 실제 코드 티켓 하나를 브랜치명에 쓴다 (`CLAUDE.md` §9 명명 규칙 준수).
**티켓별로 쪼개지 않는다** — `components/candidate-card.tsx` 하나가 `UX-A`(컴포넌트 규격)·`UX-C`(레이아웃)·`CLI-C`(렌더) 세 티켓에 동시에 걸려 분리가 성립하지 않는다.

**둘 다 draft PR로 열고 `main` 머지는 사용자 확인을 받는다** (`REQ-IMPL-031`).

---

## 9. 완료 판정 명령

```bash
# 열화 6상태가 전부 렌더되는가 — 컴포넌트 존재
ls components/states/*.tsx | wc -l                                # equals 6

# 갤러리에 13상태가 다 걸려 있는가
grep -cE 'CandidateCard|GateResult|StatePanel|QueryInput' app/preview/page.tsx   # at least 13

# 세션 2·3 결정이 fixture 형상에 들어갔는가
grep -c 'excludedByEvidence\|excludedByRecheck\|fallbackApplied' lib/fixtures/top3.json  # at least 3
grep -cE 'MERCHANT|INTERNAL_SURVEY|USER_REPORT|OPERATOR' lib/evidence/verified-by.ts     # equals 4
grep -c 'DRAFT: SPEC-008' types/draft.ts                          # at least 1

# 신선도 판정이 함수 1개인가 (S2-T6) — 컴포넌트가 직접 날짜 계산하지 않는다
grep -rlE 'Date\.now|new Date' components/ | wc -l                # equals 0

# 근거 4항목이 카드의 필수 props (불변 규칙 1)
grep -cE 'selectionReason|evidenceAttribute|verifiedAt|verifiedBy' \
  components/candidate-card.tsx                                   # equals 4

# 판정형 어휘 0건 (불변 규칙 3)
grep -rniE '조용|아늑|분위기 (좋|나쁨)|추천|최고|훌륭|괜찮|무난|가성비|인기|핫한|강추|별로' \
  app/ components/ lib/fixtures/                                  # returns 0 matches

# 정렬 판매 금지 (불변 규칙 4)
grep -rniE '가격순|거리순|sortByPrice|sortByDistance' app/ components/ | wc -l   # equals 0

# 잠정 타입이 한 파일에 격리돼 있는가
grep -rl 'DRAFT: SPEC-008' types/ | wc -l                         # equals 1

# fixture에 근거 누락 4종이 있는가 (게이트 증명의 전제)
grep -c 'missing' lib/fixtures/evidence-missing.json              # at least 4

# PREVIEW_ENABLED 가 env 스키마에 있는가 (T2 — 프로덕션 노출 차단)
grep -c 'PREVIEW_ENABLED' env.ts                                  # at least 1

# 티켓은 하나도 닫히지 않았는가 (UX-D #143 은 T4 에서 범위 밖)
gh issue list --state open --json number \
  -q '[.[].number] | map(select(IN(137,140,141,142,145))) | length'   # equals 5
```

---

## 10. 이 스파이크 다음

| 순서 | 다음 단계 |
| --- | --- |
| 1 | **§5의 미정 5건 판정을 기록한다** — `docs/design/ux/` 정식 문서의 입력 |
| 2 | `docs/goals/ux-design-stage.md`로 **UX 문서 5건 정식 착수** — 스파이크 화면이 근거가 된다 |
| 2.5 | **공유 카드** — `SPEC-004` → `MOCK-005` → `UX-D`(#143) 순서. T4에서 미룬 2상태를 여기서 그린다 |
| 3 | `/task-start 94` → `SPEC-001` **계약 5건 착수** — 잠정 타입을 계약으로 교체 |
| 4 | 스파이크 화면을 배포해 **인앱 브라우저 실측**(`EXEC` §6.2 #8) |
| 5 | `MOCK-001`~`004` — fixture를 Mock 응답 정의로 이관 |
| 6 | 상위 문서 [`prototype-suggestion.md`](prototype-suggestion.md)의 정식 18건 범위로 복귀 |

---

*작성: Technical Project Manager / System Architect*
*근거: PROTO-AIPLACE-001 §2·§6·§10 · EXEC-AIPLACE-COMPRESSED-001 §2.3·§5 · SRS-AIPLACE-MVP-001 v1.9 §8.3 · `.claude/skills/102-ux-stage-deliverables`*
*선별 방법: 정식 18건 → "로컬 · 네트워크 없음 · 1주" 필터 → 부분 착수 6건 · 종료 0건*
