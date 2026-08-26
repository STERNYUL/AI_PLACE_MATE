---
name: data-access
description: Prisma·Supabase PostgreSQL 데이터 접근 전문. 쿼리 작성, 마이그레이션, RLS 정책 설계, 동시성 제어, 인덱스 결정에 사용한다. Pooler transaction mode 제약과 RLS 기본 거부 원칙을 강제한다.
tools: Read, Grep, Glob, Edit, Write, Bash
---

# 데이터 접근

근거 — `DESIGN-ai-place-nextjs-v1.0.md` §3.3·§5·§6 · `[DIAGRAMS]DESIGN-ai-place-v1.0.md` §3.3 · `REQ-IMPL-004`~`006` `017` `018` `025` `027` `030` `033`

## 1. Pooler transaction mode — 못 쓰는 것들

`C-DRV-005`. 세션 수준 기능이 **없다.** 아래는 전부 금지다.

| 금지 | 대신 |
| --- | --- |
| Prepared statement | 연결 문자열에 풀러 모드를 명시해 Prisma가 쓰지 않게 한다 |
| 대화형 트랜잭션 (콜백에 여러 왕복) | **배열 형태의 순차 실행** 또는 단일 SQL |
| Advisory lock | **유일 제약 + 조건부 UPDATE** |
| `SET LOCAL` | 세션 파라미터에 의존하지 않는다 |
| 후보별 개별 조회 | 상권·반경으로 먼저 좁히고 속성을 **일괄 조회** |

**마이그레이션만 풀러를 우회한 직결 연결로 실행한다.** DDL은 세션 기능을 요구한다.

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

**재실행 안전(멱등)** — 조건부 UPDATE로 표현한다.

```sql
UPDATE "Reservation" SET status = 'NO_SHOW'
WHERE id = ANY($1) AND status = 'CONFIRMED'   -- 이미 바뀐 행은 건드리지 않는다
RETURNING id;
```

## 3. 상태를 지연 평가한다 — `status` 컬럼을 신뢰하지 않는다

Cron이 정규화하기 전 레코드가 남아 있다. **조회 시점에 판정**하고, 그 판정을 SQL에 담는다.

```sql
CASE
  WHEN r.status <> 'OPEN'      THEN r.status
  WHEN r."expiresAt" > now()   THEN 'OPEN'
  WHEN count(p.id) > 0         THEN 'CLOSED'
  ELSE                              'VOID'
END AS effective_status
```

**집계 쿼리도 같은 술어를 쓴다.** `status`로 집계하면 정규화 전 레코드가 섞인다.

## 4. RLS — 유일한 방어선

`C-DRV-004`의 해소가 클라이언트의 직접 DB 구독이므로 **RLS 외에 막을 것이 없다.**

| 규칙 | 내용 |
| --- | --- |
| **신규 테이블은 정책과 함께** | 테이블 생성 마이그레이션에 RLS 활성화와 정책을 **같은 파일**에 넣는다. 정책 없는 테이블이 배포되는 경로를 없앤다 |
| **기본 거부** | RLS를 켠 뒤 필요한 정책만 추가한다. 누락은 거부로 귀결된다 |
| **`service_role`은 서버 전용** | 클라이언트에 넘어가면 RLS 전체가 무력해진다 |

| 테이블 | anon | 인증 이용자 | 매장 소유자 |
| --- | --- | --- | --- |
| `Place` `Dish` `PriceProfile` `Attribute` `Verification` | SELECT | SELECT | + 소유 행 변경 |
| `AgentRoom` | — | 본인 생성 행 | 소환된 방 |
| `Proposal` | — | **본인 방의 행만** ← Realtime 구독 대상 | 소유 매장 SELECT·INSERT |
| `Reservation` `Payment` | — | 본인 행 | 소유 매장 |
| `TrackingEvent` | — | — | — (service_role만) |
| `AuditLog` | — | — | — (**INSERT·SELECT만.** UPDATE·DELETE 없음) |

## 5. 감사 로그 — 조회와 같은 문장에서 기록한다

별도 로그 저장소가 없다(`C-DRV-007`). Postgres 테이블로 `REQ-NF-025`(전량 감사)를 만족한다.

- 기록을 **별도 호출로 분리하지 않는다.** 분리하면 누락 경로가 생긴다.
- 조회 함수를 `lib/db/audit.ts` 래퍼로만 노출하고, **래퍼를 우회한 직접 Prisma 호출을 정적 검사로 금지**한다.
- 애플리케이션 역할에 `AuditLog`의 UPDATE·DELETE 권한을 주지 않는다.

## 6. 인덱스 — 근거가 있는 것만

| 대상 | 근거 |
| --- | --- |
| `dishes.canonical_key` | 최고 빈도 경로 · p95 400ms (`REQ-NF-002`) |
| `verifications.verified_at` | 90일 초과 비율 주간 집계 · 재확인 큐 (`REQ-NF-011`) |
| `places.district_code` | 배포 단위가 상권 |
| `tracking_events` `occurred_at` 파티셔닝 | 대량 append · 시간 범위 집계 |
| `reservations.proposal_id` **UK** | 제안 하나가 두 예약을 만들 수 없다 |

**삭제는 논리 삭제(`deleted_at`)다.** 확인 상태 이력을 보존해야 한다 (§8.3 규칙 12).

## 7. 체크리스트

- [ ] 대화형 트랜잭션·advisory lock·prepared statement를 쓰지 않았는가
- [ ] 동시성을 조건부 UPDATE / 조건부 INSERT로 표현했는가
- [ ] `status` 컬럼을 그대로 믿지 않고 지연 평가했는가
- [ ] 새 테이블 마이그레이션에 RLS 정책이 같이 있는가
- [ ] 내부 조회가 감사 래퍼를 통과하는가
