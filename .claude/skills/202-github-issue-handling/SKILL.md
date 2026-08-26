---
name: 202-github-issue-handling
description: GitHub 이슈·마일스톤·프로젝트 보드를 gh CLI로 관리하는 규칙. 이슈를 만들거나 갱신하거나 프로젝트 필드를 채울 때 적용한다.
---

# GitHub 이슈 · 프로젝트

## 현재 상태 (2026-08-26)

- 이슈 **84건** `#94`~`#178` — 본문 원본은 `docs/issues-aiplace/tasks/<ID>.md`
- 프로젝트 **#2** `AI PLACE MATE GITHURB PROJ` — 필드 27종(기본 18 + 커스텀 9)
- 마일스톤 4개 — Phase 0/1/1말/2, 게이트 조건이 description에 있다
- 대조표 — `docs/issues-aiplace/tasks/INDEX.md`

**이미 등록된 것을 다시 만들지 않는다.** 새로 만들기 전에 `gh issue list`로 확인한다.

## 이슈 본문의 단일 원천

**파일이 원본이고 이슈가 사본이다.** 본문을 고칠 때는 —

```bash
# 파일을 먼저 고치고
gh issue edit <번호> --body-file docs/issues-aiplace/tasks/<ID>.md
```

이슈 웹에서 직접 고치면 파일과 어긋난다.

## 배치 작업은 gh를 반복 호출한다

- **셸 스크립트를 만들어 일괄 처리하지 않는다.** 건별로 성공·실패를 남긴다
- 레이트 리밋에 걸리면 호출 사이에 지연을 둔다

## 프로젝트 필드 갱신

필드 값이 많으면 `gh project item-edit`를 필드마다 부르지 말고 **GraphQL 별칭 뮤테이션으로 묶는다** — 아이템당 1회.

```bash
gh project field-list 2 --owner STERNYUL --limit 100 --format json \
  -q '.fields[] | "\(.name)\t\(.id)"'
gh project item-list 2 --owner STERNYUL --limit 300 --format json \
  -q '.items[] | "\(.content.number)\t\(.id)"'
```

`jq`가 없는 환경이므로 `gh --format json -q` 내장 쿼리를 쓴다.

## 필드 의미

| 필드 | 값 | 출처 |
| --- | --- | --- |
| `Phase` | 0 / 1 / 1말 / 2 | 원장 §5 |
| `Track` | A 계약·Mock ~ F 검증 | `EXEC` §1.2 |
| `Complexity` | H / M / L | 원장 §0.1 |
| `Start date` · `Target date` | 압축 일정 | `EXEC-compressed` |
| `Wave` | 착수 주차 | DAG ES |
| `Critical Path` | Yes(8건) / No | `EXEC-compressed` §1 |
| `Blockers` · `Successors` | 선행·후행 수 | 의존 그래프 |

**`Blockers = 0`이 지금 착수 가능한 것이다.**
