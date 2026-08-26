---
description: 의존 그래프 조회 — 지금 착수 가능한 것, 임계 경로 상태, 막힌 것
argument-hint: [선택: 태스크 ID 또는 이슈번호]
allowed-tools: Read, Grep, Glob, Bash
---

# 의존 상태 — **$ARGUMENTS**

인자가 없으면 **전체 현황**, 있으면 **그 태스크 주변**을 본다.

## 인자 없음 — 지금 뭘 시작할 수 있나

프로젝트 보드의 `Blockers` 필드가 선행 수다. **`Blockers = 0`이 착수 가능**이다.

```bash
gh project item-list 2 --owner STERNYUL --limit 300 --format json \
  -q '.items[] | select(.blockers == 0) | "\(.["task ID"])\t#\(.content.number)\t\(.status)\tW\(.wave)\t\(.title)"'
```

**이미 열린 선행이 있으면 착수 불가다.** `Blockers`는 정적 선행 수이므로, 실제 착수 가능 여부는 선행 이슈의 `state`로 확인한다.

```bash
# 모든 열린 이슈에 대해 선행이 전부 닫혔는지 판정
gh issue list --state open --limit 200 --json number,title -q '.[] | "\(.number)\t\(.title)"' | while IFS=$'\t' read n t; do
  pre=$(gh issue view "$n" --json body -q .body | grep -m1 '^- \*\*Depends on' | grep -oE '#[0-9]+' | tr -d '#')
  open=0; for p in $pre; do [ "$(gh issue view "$p" --json state -q .state)" = "OPEN" ] && open=$((open+1)); done
  [ "$open" -eq 0 ] && echo "착수가능  #$n  $t"
done
```

호출이 많으므로 **필요할 때만 전수 실행**한다. 평소엔 `Blockers` 필드로 좁힌 뒤 그것만 확인한다.

## 임계 경로 상태

`Critical Path = Yes` 8건이 전체 일정을 결정한다. **여기가 밀리면 전부 밀린다.**

```bash
gh project item-list 2 --owner STERNYUL --limit 300 --format json \
  -q '.items[] | select(.["critical Path"] == "Yes") | "\(.["task ID"])\t\(.status)\t\(.["start date"])~\(.["target date"])\t\(.title)"'
```

압축 일정 기준 임계 경로 —
`IN-A` → `IDX-A` → `IDX-D` → `EVD-A` → `EVD-B` → `EVD-C` → `CLI-C` → `TEST-007`

## 인자 있음 — 그 태스크 주변

```bash
# 선행
gh issue view <번호> --json body -q .body | grep -m1 '^- \*\*Depends on'
# 후행 — 이 태스크를 선행으로 가진 것들
grep -l "Depends on.*\`<TASK-ID>\`" docs/issues-aiplace/tasks/*.md | xargs -n1 basename | sed 's/.md//'
```

**후행이 5건 이상이면 지연이 증폭된다.** 원장 §0.2 병합 원칙 4가 그래서 단독 유지를 요구한 자리다.

## Phase 게이트 진행률

```bash
gh api repos/STERNYUL/AI_PLACE_MATE/milestones \
  -q '.[] | "\(.title): 열림 \(.open_issues) / 닫힘 \(.closed_issues)"'
```

| Phase | 게이트 |
| --- | --- |
| 0 | 파싱 실패율 ≤ 3% · Top-3 p95 ≤ 1.5s |
| 1 | WEBD ≥ 60% · 불일치 신고 ≤ 15% · 가맹 LOI ≥ 30곳 |
| 1 말 | 선택 제안 노쇼율 계측 개시 |
| 2 *(조건부)* | 제안 도착률 ≥ 70% · 노쇼 ≤ 8% |

## 보고 형식

한 화면으로 — **지금 착수 가능한 것 N건**, **임계 경로에서 진행 중인 것**, **막혀 있는 것과 그 이유**.
막힌 이유가 선행 미완료인지 **미정 항목**인지 구분한다. 후자는 사람이 결정해야 풀린다.
