---
name: 301-serverless-idempotency
description: 서버리스 배치·Cron 설계 규칙. 부분 완료, 멱등성, 중복 실행 회피, 시간 예산을 다룬다. Vercel Cron 작업이나 재시도되는 처리를 만들 때 적용한다.
---

# 서버리스 배치 · 멱등

근거 — `DESIGN-ai-place-nextjs-v1.0.md` §6.2·§6.3 · `C-DRV-002` · `REQ-IMPL-021`·`022`·`024`

## 전제 — 실행 시간 상한을 모른다

`C-DRV-002`. 함수 실행 시간 상한은 플랜·버전에 따라 다르다.
**그 값에 의존하지 않는 구조로 만든다.** 모든 배치는 **부분 완료 가능**하고 **다음 트리거가 이어받는다.**

## 실행 흐름

```
트리거 → CRON_SECRET 검증 (실패 401)   ← REQ-IMPL-022
      → 이미 실행 중인가 (조건부 UPDATE로 클레임) → 예: 200 반환하고 종료
      → 처리 대상을 청크로 분할
      → 청크 처리(멱등) → 진행 지점 기록 → 반복
      → 시간 예산 소진: 부분 완료로 종료 (다음 트리거가 이어받는다)
      → 대상 없음: 완료 표시
```

## 멱등 수단은 조건부 UPDATE다

```sql
UPDATE "Reservation" SET status = 'NO_SHOW'
WHERE id = ANY($1) AND status = 'CONFIRMED'   -- 전제 조건을 WHERE에 담는다
RETURNING id;
```

**재실행이 중복 정산을 만들지 않는다.** 이미 바뀐 행은 건드리지 않는다.

## 작업별 설계

| 작업 | 청크 기준 | 멱등 수단 | 부분 완료 시 |
| --- | --- | --- | --- |
| `normalize-rooms` | `expiresAt` 오래된 순 N건 | 조건부 UPDATE (`status='OPEN'` 전제) | 조회는 이미 지연 평가로 정확하다 |
| `judge-no-show` | `reservedAt` 오래된 순 N건 | 조건부 UPDATE (`status='CONFIRMED'` 전제) | 정산이 다음 회차로 |
| `purge-origins` | 30일 경과 N건 | DELETE는 자연히 멱등 | **파기 지연이 규제 위반이 되지 않게 여유를 두고 실행** |
| `aggregate-kpi` | 집계 구간 | 구간별 upsert + 완료 표시 | 미완 구간만 다음 회차 |
| `audit-reconcile` | 점검 구간 | 읽기 전용 | 불일치 1건도 즉시 알림 |

## Cron이 안 돌아도 화면은 맞아야 한다

**조회 시 같은 술어로 판정한다.** Cron은 정규화와 부수 효과(정산·파기)만 담당한다.
`status` 컬럼을 화면 판정 근거로 쓰지 않는다 — `data-access` §3.

## 체크리스트

- [ ] `CRON_SECRET`을 검증하는가
- [ ] 중복 실행을 조건부 UPDATE로 회피하는가
- [ ] 청크로 나뉘고 진행 지점을 기록하는가
- [ ] 재실행이 부수 효과를 두 번 일으키지 않는가
- [ ] Cron이 멈춰도 조회 결과가 정확한가
