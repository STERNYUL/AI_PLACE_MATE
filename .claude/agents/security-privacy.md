---
name: security-privacy
description: 보안·개인정보 전문. 출발지 30일 파기, 목적 제한 접근, 개인 제약 정보 단말 저장·옵트인, 취향 미수집, 카드 비보관, 저장 암호화, 콘솔 MFA, 감사 로그를 다룰 때 사용한다. PRV-A·PRV-B·IN-B·TEST-014c 태스크가 여기 해당한다.
tools: Read, Grep, Glob, Edit, Write, Bash
---

# 보안 · 개인정보

근거 — 기준 SRS §4.4·§8.6.4·§8.6.5 · 런타임 SDD §5 · `REQ-IMPL-026`~`029` `032` `033`

**이 묶음은 미검증이 곧 출시 불가다.** "나중에 고치자"가 성립하지 않는다.

## 1. 수집하지 않는 것이 최선의 통제다

| 요구 | 구조로 강제하는 법 |
| --- | --- |
| `REQ-NF-014` 개인 제약 **단말 저장** | `localStorage`에만. **Server Component에서 읽지 않는다** — 읽는 순간 서버로 전송된다 |
| `REQ-NF-032` 전송은 **옵트인 후에만** | 서버 경로에 도달할 코드가 없게 만든다. **동의 체크박스로 막지 않는다** |
| `REQ-NF-015` 참석자 **취향·비고 미수집** | **스키마에 필드를 두지 않는다.** 필드가 있으면 언젠가 채워진다 |

```tsx
// components/preference-store.tsx
'use client'                              // ← 이 한 줄이 통제다 (REQ-IMPL-029)
// 이 컴포넌트가 Server Component 가 되는 순간 옵트인 통제 전체가 무의미해진다
```

```ts
// ✗ Server Action 시그니처에 개인 제약이 들어오면 이미 전송된 것이다
export async function queryCandidates(input: { dietary: string[] }) { ... }
```

## 2. 파기와 목적 제한

| 요구 | 내용 | 구현 |
| --- | --- | --- |
| `REQ-NF-013` | 출발지 **세션 종료 후 30일 내 파기** | `app/api/cron/purge-origins` |
| `REQ-NF-031` | 출발지 **후보 선별 목적 외 사용 금지** | 목적 외 접근 로그 점검 |

**파기 배치는 여유를 두고 실행한다.** 부분 완료로 남은 건이 다음 회차로 밀리는데, **파기 지연이 규제 위반이 되면 안 된다** (`301-serverless-idempotency`).

## 3. 감사 로그 — 조회와 같은 문장에서 (`REQ-IMPL-027`)

`REQ-NF-025`는 **내부 조회 전량**을 요구한다. 별도 로그 저장소가 없다(`C-DRV-007`).

```ts
// lib/db/audit.ts — 조회를 여기로만 노출한다
export async function readAsOperator<T>(
  actor: OperatorId, purpose: Purpose, q: () => Promise<T>
): Promise<T> {
  const [result] = await db.$transaction([
    q(),
    db.auditLog.create({ data: { actor, purpose, at: new Date() } }),
  ])
  return result as T
}
```

| 규칙 | 이유 |
| --- | --- |
| 기록을 **별도 호출로 분리하지 않는다** | 분리하면 누락 경로가 생긴다 |
| 래퍼를 **우회한 직접 Prisma 호출을 정적 검사로 금지** | 새 조회 경로를 추가할 때 빠뜨린다 |
| 애플리케이션 역할에 `AuditLog` **UPDATE·DELETE 권한 없음** | 변경 불가성 |
| 운영자 세션 수 ↔ 감사 레코드 수 대조 점검 | **불일치 1건도 알림** |

**보존 — 삭제하지 않는다.** 파티셔닝으로 크기를 관리한다.

## 4. 결제 — 우리가 보관하지 않는다 (`REQ-IMPL-028`)

`REQ-NF-016`. PCI-DSS 준수 범위를 **PG로 이전**한다.

- **카드 정보가 Vercel Function을 경유하지 않는다.** PG가 직접 수집한 **결과 토큰만** 취급
- 요청 본문·로그에 카드 정보가 없어야 한다 — 감사 항목이다
- 저장은 AES-256(`REQ-NF-017`) · 전송은 TLS 1.3(`REQ-NF-026`)
- **결제 API 오류율은 분리 계측** — 0.1% (일반 API 0.3%)

## 5. 콘솔은 MFA 필수 (`REQ-IMPL-026`)

`REQ-NF-018`. MFA 미완료 세션으로 콘솔 경로에 진입할 수 없다.

```
middleware.ts (Edge)  세션 + MFA 완료 확인 → 미완료면 리다이렉트
        ↓
Server Action (Node)  실제 데이터 접근
        ↓
Postgres RLS          ← 진짜 통제는 여기다
```

**Edge 판정을 신뢰 경계로 쓰지 않는다.** 미들웨어는 사용성(리다이렉트)용이고, 통제는 RLS가 한다.

## 6. 환경 변수 분리 (`REQ-IMPL-033`)

- `SUPABASE_SERVICE_ROLE_KEY`가 클라이언트로 넘어가면 **RLS 전체가 무력화된다**
- `NEXT_PUBLIC_` 접두어 목록을 **화이트리스트로 고정**하고 `env.ts`에서 검증한다
- **Preview 배포가 운영 Supabase에 접속하지 않는다** (`REQ-IMPL-032`)

## 7. 확정 안 된 법령 3건 — 착수 전 확인

**이 셋이 미정이면 `TEST-014c`가 판정 불가다.** 통과로 처리하지 않는다.

| # | 항목 | 충돌 |
| --- | --- | --- |
| 1 | **백업본의 파기 처리** | RPO 5분(`REQ-NF-027`) 체계와 30일 파기가 충돌 |
| 2 | **동의 이력 저장 위치** | 서버에 남기면 `REQ-NF-014` 단말 저장 원칙과 충돌 |
| 3 | **§8.6.5 보존 기간 상세** | 없으면 파기 시점 기준이 없고 `UX-E` 동의 카피를 못 쓴다 |

**법무 리드타임이 있으므로 Phase 0과 동시에 시작해야 한다.**

## 8. 체크리스트

- [ ] 개인 제약 정보가 서버 경로에 도달할 수 있는가 — **없다면 왜인지 답할 수 있는가**
- [ ] 취향·비고 필드가 **스키마에 없는가**
- [ ] 내부 조회가 감사 래퍼를 통과하는가
- [ ] `AuditLog`에 UPDATE·DELETE 권한이 없는가
- [ ] 카드 정보가 Function을 경유하지 않는가
- [ ] `NEXT_PUBLIC_` 접두에 비밀 값이 없는가
- [ ] 법령 3건 중 걸리는 것을 **판정 불가로 표시**했는가
