---
description: 이슈 번호로 태스크 착수 — 선행 완료 검증 후 브랜치 생성
argument-hint: <이슈번호> (예 103)
allowed-tools: Read, Grep, Glob, Bash
---

# 태스크 착수 — `#$ARGUMENTS`

**선행이 안 끝난 태스크에 착수하면 재작업이 된다.** 착수 전에 기계적으로 검증한다.

## 1. 태스크 식별

```bash
gh issue view $ARGUMENTS --json number,title,labels,milestone,body -q '"#\(.number) \(.title)\n\(.labels|map(.name)|join(", "))\n\(.milestone.title // "마일스톤 없음")"'
```

Task ID를 뽑아 본문 파일을 연다 — `docs/issues-aiplace/tasks/<ID>.md`.

## 2. 선행 완료 검증 (필수)

본문의 `- **Depends on**` 줄에서 `#번호`를 전부 뽑아 상태를 확인한다.

```bash
gh issue view $ARGUMENTS --json body -q .body | grep -m1 '^- \*\*Depends on' | grep -oE '#[0-9]+' | tr -d '#' | while read n; do
  gh issue view "$n" --json number,state,title -q '"  #\(.number) \(.state)  \(.title)"'
done
```

**하나라도 `OPEN`이면 착수하지 않는다.** 사용자에게 어느 선행이 남았는지 보고하고 멈춘다.
선행 없음(`IN-A` 등)이면 그대로 진행한다.

## 3. 블로커 확인

본문의 `**미정 — 확정 필요**` 항목을 읽는다. **확정 없이 착수하면 인수 판정이 불가능한 항목**이 있으면 사용자에게 먼저 알린다.

특히 — 정규화 평가셋(`IDX-C`·`TEST-001`), 판정형 어휘 기준(`EVD-B`), 세션 정의(`TRK-B`), PG 선정(`RSV-C`)은 **외부 확정이 필요**하다.

## 4. 컨텍스트 로드

| 읽을 것 | 왜 |
| --- | --- |
| 본문의 `🔗 References` | SRS 조항·요구사항 ID |
| 본문의 `✅ Task Breakdown` | 실제 할 일 |
| 본문의 `🧪 검증 시나리오` | 인수 기준 — **네 번째가 불변 규칙이다** |
| 본문의 `⚙️ Constraints` | 지키지 못하면 착수가 무의미한 제약 |

## 5. 브랜치 생성

```bash
git checkout main && git pull -q origin main
git checkout -b <type>/$ARGUMENTS-<short-description>
```

`<type>` — `feat` · `fix` · `docs` · `test` · `chore` · `refactor`

## 6. 착수 표시

```bash
gh issue edit $ARGUMENTS --add-assignee @me
```

프로젝트 보드의 `Status`를 `In progress`로 옮긴다.

## 7. 보고

착수 전 사용자에게 한 화면으로 정리한다 — 태스크 ID·제목, 선행 상태, 미해소 블로커, 불변 규칙 중 걸리는 것, 브랜치명.
