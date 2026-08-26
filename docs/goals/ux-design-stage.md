/goal

## 1) 작업 핵심 목표 및 범위
- 목표: UX 설계 태스크 6건(`UX-A`~`UX-F`)의 산출물을 `docs/design/ux/` 아래 문서로 완성하고 해당 GitHub 이슈를 종료한다.
- 시작 지점: `main` 브랜치. 코드는 아직 0줄이며 이 단계는 문서만 만든다.
- 작업 대상: GitHub 이슈 `#140`(UX-A) `#141`(UX-B) `#142`(UX-C) `#143`(UX-D) `#144`(UX-E) `#145`(UX-F).
  본문은 `docs/issues-aiplace/tasks/UX-{A..F}.md` 에 있다.
  **`#146`(UX-G) · `#147`(UX-H)은 Phase 2 조건부 이월 단위이므로 이번 범위에서 제외한다.**
- 작업 자율성: 사용자 승인 없이 문서 작성·커밋·브랜치 생성·draft PR 생성·이슈 종료까지 진행한다.
  **`main` 머지, force push, 이슈 신규 생성, 프로젝트 필드 스키마 변경은 사용자 확인이 필요하다.**

## 2) 작업 세부 규칙
- 산출물 규격은 `.claude/skills/102-ux-stage-deliverables/SKILL.md` 를 읽고 그대로 적용한다 — 파일 경로, 6개 절 구조, 판정형 어휘 금지 목록, 완료 판정 명령이 거기에 고정돼 있다.
- 설계 판단은 `ux-design-system` 서브에이전트에 위임한다. 근거 규칙은 `domain-invariants` 에 있다.
- 의존 순서를 지킨다: `UX-A` → (`UX-B`, `UX-C`, `UX-E`) → (`UX-D` ← UX-C, `UX-F` ← UX-B·UX-C).
  각 태스크 착수 전 `/task-start <이슈번호>` 로 선행 이슈가 CLOSED 인지 기계 검증한다.
- 태스크 1건 = 브랜치 1개 = draft PR 1개. 브랜치명은 `docs/<이슈번호>-ux-<slug>`.
- 각 태스크 종료 전 `/review-invariants docs/design/ux/` 를 실행해 4대 불변 규칙 위반이 0건임을 확인한다.
- 종료는 `/task-done <이슈번호>` 절차를 따른다 — 인수 기준 4종 대조 후 이슈 종료, 프로젝트 보드 `Status`를 `Done` 으로 이동.
- 확정되지 않은 항목(`UX-001` 인정 여부, 접근성 기준, 판정형 어휘 기준, 개인정보 보존 기간)은 문서에 `(미정 — 확정 필요)` 로 명시하고 진행한다. 임의로 정하지 않는다.
- 미정 항목을 만나 임의 결정이 필요해질 때마다 `docs/design/ux/DECISIONS.md` 에 한 줄로 기록하고, 파일 안에 `DECISIONS: N` 카운터 줄을 유지한다.

## 3) 종료 조건 및 종료 방법
- 종료 조건 (아래 중 하나라도 충족되는 순간 루프를 즉시 멈춘다):
  - 이슈 `#140`~`#145` 6건이 전부 CLOSED → STOP REASON: ALL_UX_CLOSED
  - `DECISIONS: N` 카운터가 8에 도달 → STOP REASON: DECISION_BUDGET
  - 선행이 해소된 UX 이슈가 더 없는데 남은 열린 이슈가 있음 → STOP REASON: BLOCKED
  - 평가-진행 라운드(turn = /goal 평가자가 진행 상태를 한 번 점검하는 메인 에이전트 응답 사이클)가 누적 25회에 도달 → STOP REASON: TURN_CAP (= or stop after 25 turns)
- 종료 방법:
  1) `docs/design/ux/DECISIONS.md` 마지막 줄에 `STOP REASON: <원인 코드>` 한 줄을 덧붙인다.
  2) `find docs/design/ux -maxdepth 1 -name 'UX-*.md' | wc -l` 을 실행해 `6` 이 보이는 출력을 대화에 남긴다.
  3) `grep -rniE '조용|아늑|분위기 (좋|나쁨)|추천|최고|훌륭|괜찮|무난|가성비|인기|핫한|강추|별로' docs/design/ux/ --include='*.md' | grep -v WRITING-GUIDE | wc -l` 을 실행해 `0` 이 보이는 출력을 대화에 남긴다.
  4) `grep -cE '^\| (폴백표시|근거대기|근거생략|유사메뉴대체|제안없음|재시도안내)' docs/design/ux/UX-F-empty-states.md` 를 실행해 `6` 이 보이는 출력을 대화에 남긴다.
  5) `for f in docs/design/ux/UX-*.md; do echo "$f $(grep -cE '^## [1-6]\. ' "$f")"; done` 을 실행해 각 파일이 `6` 인 출력을 대화에 남긴다.
  6) `gh issue list --state open --json number -q '[.[].number] | map(select(. >= 140 and . <= 145)) | length'` 을 실행해 `0` 이 보이는 출력을 대화에 남긴다.
  7) `cat docs/design/ux/DECISIONS.md` 를 실행해 `DECISIONS: N` 카운터 줄과 `STOP REASON:` 줄이 보이는 출력을 대화에 남긴다.
  8) `gh pr list --state open` 을 실행해 이번 루프가 연 draft PR 목록을 대화에 남긴다.

## 4) 기타 제약조건
- 어떤 PR도 `main` 에 머지하지 않는다. force push 하지 않는다.
- 새 GitHub 이슈를 만들지 않는다. 기존 이슈 본문은 `docs/issues-aiplace/tasks/<ID>.md` 를 고친 뒤 `gh issue edit --body-file` 로만 반영한다.
- 다음 파일·디렉터리를 수정하지 않는다:
  `[SRS]ai-place -mate-SRSv1.0.md`, `SRS-ai-place-nextjs-v1.0.md`, `[DIAGRAMS]DESIGN-ai-place-v1.0.md`, `DESIGN-ai-place-nextjs-v1.0.md`, `TASKS-ai-place-v1.0.md`, `EXEC-ai-place-v1.0.md`, `EXEC-ai-place-compressed-v1.0.md`, `docs/issues-aiplace/P*.md`
- `docs/design/ux/` 와 `docs/issues-aiplace/tasks/UX-*.md` 밖의 파일을 수정하지 않는다.
  단 `.claude/skills/102-ux-stage-deliverables/SKILL.md` 는 규격 보완이 필요할 때 수정할 수 있다.
- `npm`·`pnpm`·`node` 를 호출하지 않는다. 이 환경에 설치돼 있지 않으며 이 단계는 코드를 만들지 않는다.
- 판정형 어휘를 화면 카피에 쓰지 않는다 (§8.3 규칙 3). 어떤 상태에서도 빈 화면을 설계하지 않는다 (§8.3 규칙 5).

## 5) 보고 형식
- 각 draft PR 본문에 다음을 포함한다:
  - 이 태스크가 만든 문서와 다루는 화면 목록
  - 4대 불변 규칙 중 이 변경이 건드린 것과 어떻게 지켰는지
  - `(미정 — 확정 필요)` 로 남긴 항목과 확정 담당자
  - 대응 `CLI-` 태스크에 인계할 사항 (`## 6. CLI 인계` 절 요약)
