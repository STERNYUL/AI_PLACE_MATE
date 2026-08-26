---
description: 인수 기준 검증 후 태스크 종료 — 이슈 닫기·보드 갱신
argument-hint: <이슈번호>
allowed-tools: Read, Grep, Glob, Bash
---

# 태스크 종료 — `#$ARGUMENTS`

**"다 했다"는 판정이 아니다.** 인수 기준을 하나씩 대조하고, 못 채운 것은 못 채웠다고 적는다.

## 1. 태스크 본문 대조

```bash
gh issue view $ARGUMENTS --json title,body -q .title
```

Task ID로 `docs/issues-aiplace/tasks/<ID>.md`를 열고 아래를 순서대로 판정한다.

| 항목 | 판정 |
| --- | --- |
| `✅ Task Breakdown` | 체크박스 전부 완료했는가. 남았으면 **왜 남았는지** |
| `🧪 검증 시나리오` | 정상 · 예외 · 경계 · **불변 규칙** 넷 다 통과했는가 |
| `🏁 DoD` | 공통 DoD + 태스크별 추가 항목 |
| `⚙️ Constraints` | 제약을 지켰는가. 못 지켰으면 그 사실을 남긴다 |
| `**미정 — 확정 필요**` | 여전히 미정인가. **미정인 채 닫으면 안 되는 것**이 있는가 |

## 2. 불변 규칙 감사

```
/review-invariants
```

**위반이 있으면 닫지 않는다.**

## 3. 판정 불가 항목 처리

기준선 미실측·법령 대기·Phase 2 미통과로 **판정할 수 없는 항목은 통과로 접지 않는다.**

- 판정 불가 항목을 이슈 코멘트에 **사유와 함께** 남긴다
- 해당 항목이 게이트 판정에 필요하면 **이슈를 닫지 않고** 사용자에게 보고한다

## 4. 커밋·PR 확인

```bash
git log --oneline main..HEAD
gh pr view --json number,state,isDraft -q '"#\(.number) \(.state) draft=\(.isDraft)"' 2>/dev/null
```

PR이 Draft면 **Ready로 전환**한다. 자가 병합하지 않는다 (`REQ-IMPL-031` — `main`은 승인 필요).

## 5. 이슈 종료

```bash
gh issue comment $ARGUMENTS --body "$(cat <<'EOC'
## 인수 판정

| 시나리오 | 결과 |
| --- | --- |
| 정상 | PASS |
| 예외 | PASS |
| 경계 | PASS |
| **불변 규칙** | PASS |

**판정 불가** — (없으면 "없음")
**남은 미정 항목** — (없으면 "없음")
EOC
)"
gh issue close $ARGUMENTS --reason completed
```

## 6. 보드 갱신

`Status`를 `Done`으로 옮긴다.

```bash
# 아이템 ID 확인
gh project item-list 2 --owner STERNYUL --limit 300 --format json \
  -q '.items[] | select(.content.number == '"$ARGUMENTS"') | .id'
```

## 7. 후행 태스크 알림

이 태스크를 선행으로 갖던 것들이 **이제 착수 가능**해졌다.

```bash
ID=$(gh issue view $ARGUMENTS --json title -q .title | sed 's/ ·.*//')
grep -l "Depends on.*\`$ID\`" docs/issues-aiplace/tasks/*.md | xargs -n1 basename | sed 's/.md//'
```

**해제된 후행을 사용자에게 보고한다.** 임계 경로 상의 것이면 그 사실도 함께.
