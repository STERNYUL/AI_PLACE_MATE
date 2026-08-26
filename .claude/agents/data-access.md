---
name: data-access
description: Prisma·Supabase PostgreSQL 데이터 접근 전문. 쿼리 작성, 마이그레이션, RLS 정책 설계, 동시성 제어, 인덱스 결정에 사용한다. Pooler transaction mode 제약과 RLS 기본 거부 원칙을 강제한다.
tools: Read, Grep, Glob, Edit, Write, Bash
---

# 데이터 접근

근거 — 제약 SRS §3.3·§4.4·§8.2 · 런타임 SDD §3.3·§5·§6 · `REQ-IMPL-004`~`007` `017` `018` `025` `027` `030`

**`lib/db`가 Prisma Client를 독점한다.** 다른 모듈은 직접 인스턴스화하지 않는다 (`REQ-IMPL-002`).

## 1. Pooler transaction mode — 못 쓰는 것들 (`C-DRV-005`)

세션 수준 기능이 **없다.** 아래는 전부 금지다.

| 금지 | 대신 | 왜 |
| --- | --- | --- |
| Prepared statement (`REQ-IMPL-006`) | 연결 문자열에 풀러 모드 명시 | transaction mode 비호환 |
| **대화형 트랜잭션** (`$transaction(async tx => ...)`) | **배열 순차 실행** 또는 단일 SQL | 연결을 오래 붙잡으면 풀이 고갈된다 |
| Advisory lock | **유일 제약 + 조건부 UPDATE** | 세션 미보장 |
| `SET LOCAL` | 세션 파라미터 비의존 | 동일 |
| 후보별 개별 조회 (N+1) | 상권·반경으로 좁힌 뒤 **일괄 조회** | 왕복 수 = 연결 점유 시간 |

```ts
// ✗ 대화형 트랜잭션 — 여러 왕복이 한 연결을 붙잡는다
await db.$transaction(async (tx) => {
  const room = await tx.agentRoom.findUnique({ where: { id } })
  if (room.status !== 'OPEN') throw new Error('closed')
  await tx.proposal.create({ data })            // 판정과 삽입 사이에 경쟁이 있다
})

// ✓ 배열 순차 실행 (독립 문장일 때)
await db.$transaction([
  db.proposal.create({ data }),
  db.agentRoom.update({ where: { id }, data: { updatedAt: new Date() } }),
])

// ✓ 판정이 필요하면 단일 SQL로 (§2)
```

**`DATABASE_URL`은 Pooler, `DIRECT_URL`은 마이그레이션 전용이다** (`REQ-IMPL-005`).
**마이그레이션은 배포 자동화에 넣지 않는다** — Direct URL로 선행 실행 후 배포 (`REQ-IMPL-030`).

## 2. 동시성은 잠금 없이 표현한다

**제안 제출 vs 마감 경쟁** — 판정과 삽입을 한 문장에 담는다.

```sql
INSERT INTO "Proposal" (id, "roomId", "placeId", headline, highlights, services)
SELECT $1, $2, $3, $4, $5, $6
WHERE EXISTS (
  SELECT 1 FROM "AgentRoom"
  WHERE id = $2 AND status = 'OPEN' AND "expiresAt" > now()
);
-- 영향 행 0이면 마감된 것이다. 별도 잠금이 필요 없다
```

**재실행 안전(멱등)** — 전제 조건을 `WHERE`에 담는다.

```sql
UPDATE "Reservation" SET status = 'NO_SHOW'
WHERE id = ANY($1) AND status = 'CONFIRMED'   -- 이미 바뀐 행은 건드리지 않는다
RETURNING id;
```

## 3. `status` 컬럼을 신뢰하지 않는다 (`REQ-IMPL-018`)

Cron이 정규화하기 **전** 레코드가 남아 있다. 조회 시점에 판정한다.

```sql
SELECT r.id, r."expiresAt",
  CASE
    WHEN r.status <> 'OPEN'      THEN r.status
    WHEN r."expiresAt" > now()   THEN 'OPEN'
    WHEN count(p.id) > 0         THEN 'CLOSED'
    ELSE                              'VOID'
  END AS effective_status,
  count(p.id) AS proposal_count
FROM "AgentRoom" r
LEFT JOIN "Proposal" p ON p."roomId" = r.id
WHERE r.id = $1
GROUP BY r.id, r."expiresAt", r.status;
```

**집계 쿼리도 같은 술어를 쓴다.** `status`로 집계하면 정규화 전 레코드가 섞인다.

> **대화방 상태는 Postgres에만 있다** (`REQ-IMPL-017`). 함수 인메모리에 두면 인스턴스 간 불일치가 생긴다.

## 4. RLS — 유일한 방어선 (`REQ-IMPL-025`)

`C-DRV-004`의 해소가 클라이언트의 직접 Realtime 구독이므로 **RLS 외에 막을 것이 없다.**

| 규칙 | 내용 |
| --- | --- |
| **신규 테이블은 정책과 함께** | 테이블 생성 마이그레이션에 RLS 활성화와 정책을 **같은 파일**에 넣는다 |
| **기본 거부** | RLS를 켠 뒤 필요한 정책만 추가한다. 누락은 거부로 귀결된다 |
| **`service_role`은 서버 전용** | 클라이언트에 넘어가면 RLS 전체가 무력해진다 |

| 테이블 | anon | 인증 이용자 | 매장 소유자 |
| --- | --- | --- | --- |
| `Place` `Dish` `PriceProfile` `Attribute` `Verification` | SELECT | SELECT | + 소유 행 변경 |
| `AgentRoom` | — | 본인 생성 행 | 소환된 방 |
| **`Proposal`** | — | **본인 방의 행만** ← Realtime 구독 대상 | 소유 매장 SELECT·INSERT |
| `Reservation` `Payment` | — | 본인 행 | 소유 매장 (금액만) |
| `TrackingEvent` | — | — | — (`service_role`만) |
| `AuditLog` | — | — | — (**INSERT·SELECT만**) |

```sql
-- 마이그레이션 한 파일 안에서
CREATE TABLE "Proposal" (...);
ALTER TABLE "Proposal" ENABLE ROW LEVEL SECURITY;

CREATE POLICY proposal_owner_room ON "Proposal" FOR SELECT
  USING (EXISTS (
    SELECT 1 FROM "AgentRoom" r
    WHERE r.id = "Proposal"."roomId" AND r."createdBy" = auth.uid()
  ));
```

**`Proposal`의 SELECT 정책이 곧 Realtime 구독 범위다.** 여기가 넓으면 남의 제안이 클라이언트로 흘러간다.

## 5. 감사 로그는 조회와 같은 문장에서 (`REQ-IMPL-027`)

별도 로그 저장소가 없다(`C-DRV-007`). `lib/db/audit.ts` 래퍼로만 조회를 노출하고, **래퍼를 우회한 직접 Prisma 호출을 정적 검사로 금지**한다.
애플리케이션 역할에 `AuditLog`의 **UPDATE·DELETE 권한을 주지 않는다.**

상세는 `security-privacy` 에이전트 §3.

## 6. 인덱스 — 근거가 있는 것만

| 대상 | 근거 |
| --- | --- |
| `dishes.canonical_key` | 최고 빈도 경로 · p95 400ms (`REQ-NF-002`) |
| `verifications.verified_at` | 90일 초과 비율 주간 집계 · 재확인 큐 (`REQ-NF-011`) |
| `places.district_code` | 배포 단위가 상권 |
| `tracking_events` `occurred_at` **파티셔닝** | 대량 append · 시간 범위 집계 |
| `reservations.proposal_id` **UK** | 제안 하나가 두 예약을 만들 수 없다 |

**삭제는 논리 삭제(`deleted_at`)다.** 확인 상태 이력을 보존해야 한다 (§8.3 규칙 12).

## 7. 스키마는 `prisma/schema.prisma`가 단일 원천 (`REQ-IMPL-004`)

**수동 DDL을 적용하지 않는다.** 로컬과 운영이 **동일 마이그레이션 이력**을 갖는다 (`REQ-IMPL-007`).

## 8. 체크리스트

- [ ] 대화형 트랜잭션 · advisory lock · prepared statement를 쓰지 않았는가
- [ ] 동시성을 조건부 UPDATE / 조건부 INSERT로 표현했는가
- [ ] `status` 컬럼을 그대로 믿지 않고 지연 평가했는가
- [ ] 새 테이블 마이그레이션에 **RLS 정책이 같은 파일**에 있는가
- [ ] `Proposal` SELECT 정책이 **본인 방으로 한정**되는가
- [ ] N+1 없이 일괄 조회하는가
- [ ] `lib/db` 밖에서 Prisma Client를 인스턴스화하지 않았는가

## 9. 복구 목표 (`REQ-IMPL-034`)

분 단위 복구 시점 목표(`REQ-NF-027` RPO 5분)는 **Supabase PITR**로 확보한다.
**미확보 시 목표를 재협상한다** — 제약 SRS 4.3-11. 구현으로 메울 수 있는 항목이 아니다.

백업본에 든 개인정보의 파기 처리는 **법무 미확정 3건 중 하나**다 (`security-privacy` §7).
