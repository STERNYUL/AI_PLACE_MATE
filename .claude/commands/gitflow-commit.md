---
description: 이슈 연동 커밋·푸시·PR
argument-hint: [선택: 이슈번호]
allowed-tools: Read, Grep, Bash
---

# 커밋 · 푸시 · PR

## 1. 상태 확인 (건너뛰지 않는다)

```bash
git branch --show-current
git status --short
git diff --stat
```

**`main`이면 여기서 멈춘다.** 브랜치를 먼저 만든다 — `<type>/<이슈번호>-<설명>`.

## 2. 원자적 스테이징

한 커밋에 **한 목적**만 담는다. 무관한 변경이 섞였으면 나눈다.

```bash
git add -p    # 선택적 스테이징
```

각 커밋 시점에서 빌드가 되어야 한다.

## 3. 커밋 메시지

Conventional Commits — `<type>(<scope>): <subject>`

- `type` — `feat` `fix` `docs` `refactor` `test` `chore` `style` `perf`
- `subject` — 명령형, 소문자 시작, 마침표 없음, 50자 이내
- 본문 — **WHY**를 적는다. WHAT은 diff가 말한다
- 꼬리말 — `Closes #123` / `Refs #456`

**태스크 작업이면 인수 기준 중 무엇을 만족시켰는지 본문에 적는다.**

## 4. 푸시

```bash
git ls-remote >/dev/null || echo "원격 인증 확인 필요"
git push -u origin "$(git branch --show-current)"
```

**`--force`는 사용자가 명시적으로 요청할 때만.** `--no-verify`도 마찬가지다.

## 5. Draft PR

```bash
gh pr create --draft --base main
```

PR 본문에 담을 것 —

- **변경 요약** — `git diff main...HEAD` 전체를 읽고 **의미**를 요약한다. 파일 나열은 하지 않는다
- 연결 이슈 (`Closes #NNN`)
- **불변 규칙 중 이 변경이 건드린 것**과 어떻게 지켰는지
- 인수 기준 충족 여부

## 6. 프로젝트 보드

이슈의 `Status`를 `In review`로 옮긴다.

```bash
gh issue edit <번호> --add-label "needs-review" 2>/dev/null || true
```
