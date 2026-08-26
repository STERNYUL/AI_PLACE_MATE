---
name: 200-git-commit-push-pr
description: Git 커밋·푸시·PR 규칙. 브랜치 전략, 원자적 커밋, Conventional Commits, AI 에이전트 안전 규칙을 다룬다. 커밋하거나 PR을 만들 때 적용한다.
---

# 커밋 · 푸시 · PR

## 원자적 커밋
- 한 커밋에 **한 논리 변경**. 각 커밋 시점에서 빌드·테스트가 통과해야 한다
- `git add -p`로 선택적 스테이징. 무관한 변경을 섞지 않는다
- 메시지는 **WHY**를 적는다. WHAT은 diff가 말한다

## 메시지 형식
Conventional Commits — `<type>(<scope>): <subject>`
- `type` — `feat` `fix` `docs` `refactor` `test` `chore` `style` `perf`
- `subject` — 명령형, 소문자, 마침표 없음, 50자 이내
- 본문 72자 줄바꿈 · 꼬리말 `Closes #123`

## 브랜치
- **작업 전 이슈별 브랜치를 만든다** — `<type>/<이슈번호>-<설명>` (예 `feat/103-index-schema`)
- `main`·`master`·`dev`에 직접 커밋하지 않는다
- 첫 푸시 즉시 Draft PR을 만든다

## AI 에이전트 안전 규칙
- 커밋 전 `git status`·`git diff`를 본다
- `git branch --show-current`로 브랜치를 확인한다
- **`--force`·`--no-verify`는 사용자가 명시 요청할 때만**
- 푸시 전 `git ls-remote`로 원격 인증을 확인한다

## 이 프로젝트 추가 규칙
- 태스크 작업이면 **충족한 인수 기준**을 커밋 본문에 적는다
- **4대 불변 규칙**(CLAUDE.md §2)을 건드린 변경은 PR 본문에 어떻게 지켰는지 명시한다
- PR 요약은 `git diff main...HEAD`의 **의미**를 쓴다. 파일 나열은 하지 않는다
