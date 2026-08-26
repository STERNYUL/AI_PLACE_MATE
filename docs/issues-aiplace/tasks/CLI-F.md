# CLI-F · 대화방 및 제안 비교 화면

> **웨이브** `P2g-phase2` · **라벨** `feature, frontend, client, agent-room, priority:high, phase-2, conditional`
> **원본** [`docs/issues-aiplace/P2g-phase2.md`](../P2g-phase2.md#cli-f)
> **원장** `TASKS-ai-place-v1.0.md` (TASKS-AIPLACE-MVP-001 v1.1 · 50건) · **SRS** `[SRS]ai-place -mate-SRSv1.0.md` (SRS-AIPLACE-MVP-001 v1.9)

**원문** `FR-074` `FR-075`

### 🎯 Summary
- **Task ID** `CLI-F` · **Should / H (H×1+M×1)**
- **목적** `UX-G` 설계의 구현. **카운트다운이 서버 시각과 어긋나면 사용자가 제안을 놓친다.**

### 🔗 References
- `REQ-FUNC-022`~`024` · §3.1.2 · §8.3 규칙 13
- 선행 `AGT-B` `AGT-C` `UX-G` · 계약 `SPEC-005` `SPEC-006`

### ✅ Task Breakdown
- [ ] **`FR-074`** 대화방 화면 · **카운트다운**
- [ ] **`FR-075`** 제안 비교 · **적합도 정렬** 화면
- [ ] 단방향 채널 연결 (`AGT-B` 방식)
- [ ] 채널 끊김·재연결 UI
- [ ] 제안 0건 → Top-3 회귀 화면 (`UX-F` `UX-G`)
- [ ] 제안 카드의 근거 4항목 렌더 (`CLI-C` 컴포넌트 재사용)

### 🧪 Acceptance Criteria

**Scenario 1 · 정상 — 제안 수신**
- **Given** 대화방이 열려 있음
- **When** 제안이 도착함
- **Then** 적합도 순으로 삽입되고 **근거 4항목이 표시**된다

**Scenario 2 · 예외 (§4.5.3) — 채널 끊김**
- **Given** 인앱 브라우저에서 채널이 끊김
- **When** 복구됨
- **Then** 누락 제안이 복구되고 **남은 시간이 서버 기준으로 재계산**된다

**Scenario 3 · 경계 — 카운트다운 종료**
- **Given** 클라이언트 카운트다운이 0에 도달
- **When** 서버 `expiresAt`과 대조함
- **Then** **서버 판정을 따른다.** 클라이언트가 먼저 닫지 않는다

**Scenario 4 · 근거 무결성 — 근거 없는 제안 미표시**
- **Given** 어떤 이유로 근거 없는 제안이 응답에 섞임
- **When** 렌더함
- **Then** **표시하지 않는다.** `CLI-C`와 동일한 클라이언트 방어

### ⚙️ Technical & Non-Functional Constraints
- **§8.3 규칙 13** 서버 시각 기준
- **인앱 브라우저 채널 유지** — R6
- `CLI-C` 근거 카드 컴포넌트 재사용 — 두 화면이 다른 규격을 쓰면 안 된다

### 🏁 DoD
공통 DoD 5개. 추가로 —
- [ ] 카운트다운이 서버 시각과 어긋나지 않는가?
- [ ] 채널 끊김 후 제안이 복구되는가?
- [ ] 근거 카드가 `CLI-C`와 같은 컴포넌트인가?

### 🚧 Dependencies & Blockers
- **Depends on** `AGT-B` (#150) `AGT-C` (#151) `UX-G` (#146) `SPEC-005` (#98) `SPEC-006` (#99)
- **Blocks** 없음
- **미정 — 확정 필요** 채널 방식 (`AGT-B` 확정 대기)

### 공통 DoD — 웨이브 `P2g-phase2` 전체

- [ ] **Phase 1 게이트 통과가 확인된 뒤 착수했는가?**
- [ ] 근거 없는 문구가 매장 입력 경로로도 들어오지 않는가? (§8.3 규칙 7)
- [ ] 제안에도 근거 4항목이 적용되는가? (`SPEC-008` · `EVD-A`)
- [ ] **180초 수명이 서버 시각 기준**인가? (§8.3 규칙 13)
- [ ] 제안 0건 시 Top-3 회귀가 동작하는가? (`REQ-FUNC-025` · `UX-F`)

