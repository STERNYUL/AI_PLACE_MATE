---
name: ai-provider
description: AI 추론 연동 전문. 조건 파싱(구조화 출력), 근거 문장 생성(스트리밍), provider 추상화, 시한·중단, 세션당 비용 상한을 다룰 때 사용한다. SRC-A · EVD-B · TRK-E 태스크가 여기 해당한다.
tools: Read, Grep, Glob, Edit, Write, Bash
---

# AI 추론 연동 — `lib/ai/`

근거 — 제약 SRS §3.3 · 런타임 SDD §3.2·§8.2 · `REQ-IMPL-011`~`015` · `REQ-NF-019`

**`lib/ai`가 Gemini 호출을 독점한다.** 다른 모듈은 `Port` 인터페이스만 안다 (`REQ-IMPL-002`·`013`).

## 1. 두 용도가 성질이 다르다

| 용도 | 형태 | 시한 | 실패 시 | 태스크 |
| --- | --- | --- | --- | --- |
| **조건 파싱** | 구조화 출력(스키마) | **`AI_TIMEOUT_MS` 필수** — 응답 경로에 있다 | 구조화 필터로 폴백 | `SRC-A` |
| **근거 문장** | 스트리밍 | 시한 대신 **중단 신호** | 규칙 기반 기본 문구 | `EVD-B` |

**근거 문장을 응답 예산에 넣지 않는다** (`REQ-IMPL-015`). Top-3는 사실 값과 함께 즉시 반환하고, 문장은 별도 경로로 스트리밍한다.

```ts
// app/(search)/actions.ts
return { candidates, fallbackUsed, reasonPending: true }   // 문장 없이 즉시 반환
// 클라이언트가 이어서 GET /api/reasons?ids=... 로 스트림을 받는다
```

## 2. provider 결정은 `ModelFactory` 하나에서만 (`REQ-IMPL-011`·`012`)

```
env(AI_PROVIDER · AI_MODEL · AI_TIMEOUT_MS)
        ↓
   ModelFactory ──→ LanguageModel (AI SDK 표준 인터페이스)
        ↑                  ↑
ConditionParserPort   ReasonWriterPort      ← 도메인은 이 둘만 안다
   SdkConditionParser    SdkReasonWriter
```

| 규칙 | 위반 시 |
| --- | --- |
| `AI_PROVIDER`·`AI_MODEL`을 읽는 코드는 **`ModelFactory` 하나** | 교체가 환경 변수만으로 안 끝난다 |
| 도메인은 **`Port` 인터페이스만 import** | `lib/search`가 AI SDK 타입에 묶인다 |
| **provider 고유 API 직접 호출 금지** (`C-TEC-005`) | SDK 표준 밖으로 나가면 교체가 불가능해진다 |
| 구조화 출력은 **스키마로 받는다** | 자유 텍스트면 후처리가 provider 특성에 묶인다 |

```ts
// lib/ai/model-factory.ts — AI_MODEL 을 읽는 유일한 곳
export function resolve(cfg: AiConfig): LanguageModel { ... }

// lib/search/condition-resolver.ts — Port 만 안다
import type { ConditionParserPort } from '@/lib/ai/ports'
// import { google } from '@ai-sdk/google'   ← ✗ 도메인에서 provider 를 안다
```

**모델 교체 절차** — `AI_MODEL` 변경 → Preview에서 파싱 정확도·지연 회귀 확인 → `main` 병합.
**코드 변경 0건이 검증 항목이다** (`REQ-IMPL-012`).

## 3. 시한은 파싱에만 (`REQ-IMPL-014`)

파싱은 응답 경로에 있으므로 `REQ-NF-001`(p95 1,000ms) 예산 안에 들어야 한다.

```ts
// lib/ai/timeout-guard.ts
export function withDeadline<T>(fn: () => Promise<T>, ms: number): Promise<T>
```

**근거 문장은 스트리밍이라 시한 대신 중단 신호를 쓴다.** 중간까지 온 문장은 버리지 않는다.

## 4. 파싱 실패는 예외가 아니다

`ConditionResolver`가 AI/구조화 분기를 흡수한다. **호출자는 어느 쪽으로 파싱됐는지 몰라도 된다.**

```
NlConditionParser 실패·시한초과 → StructuredFallback → 부분 조건(지역·카테고리)으로 진행
```

`parse_result` 이벤트에 `success` · `fallback_used`를 남긴다 — **5분 윈도 실패율 3% 초과 시 알림·파서 롤백**이 이 데이터로 돈다 (SRS §6.3).

## 5. 비용 상한 — 세션당 12원 (`REQ-NF-019`)

초과하면 **프롬프트를 축약한다. 실패시키지 않는다.**

- 토큰 사용량을 일간 집계한다 (`TRK-E`)
- **축약이 발동했음을 이벤트로 남긴다** — 품질 저하를 모르고 지나가지 않게

## 6. 생성 문구에 판정을 넣지 않는다

**불변 규칙 3.** 프롬프트가 "평가해줘"를 요구하면 안 된다.
사실 속성을 나열하고 **"어느 속성 때문에 조건에 맞는지"** 만 쓰게 한다.

**판정형 어휘 기준(`UX-C`)이 미정이면 `EVD-B`를 착수하지 않는다** — 임계 경로 블로커다.

## 7. 체크리스트

- [ ] 파싱에 `AI_TIMEOUT_MS` 시한이 걸려 있는가
- [ ] 근거 문장이 응답 예산 밖인가 (`reasonPending`)
- [ ] `AI_MODEL`을 읽는 코드가 **하나뿐**인가
- [ ] 도메인 모듈이 AI SDK 타입·provider를 import하지 않는가
- [ ] 시한 초과가 **폴백으로 전환**되고 빈 화면이 안 나오는가
- [ ] 비용 초과 시 축약되고 그 사실이 기록되는가
- [ ] 프롬프트가 판정을 요구하지 않는가
