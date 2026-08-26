# MOCK-006 · 대화방 Mock

> **웨이브** `P1c-mock` · **라벨** `mock, backend, agent-room, priority:medium, phase-2`
> **원본** [`docs/issues-aiplace/P1c-mock.md`](../P1c-mock.md#mock-006)
> **원장** `TASKS-ai-place-v1.0.md` (TASKS-AIPLACE-MVP-001 v1.1 · 50건) · **SRS** `[SRS]ai-place -mate-SRSv1.0.md` (SRS-AIPLACE-MVP-001 v1.9)

### 🎯 Summary
- **Task ID** `MOCK-006` · **Should / M**
- **목적** 대화방 개시·미개시·카운트다운·제안 0건을 재현한다.
- **⚠️ Phase 2 조건부** — 소비 태스크가 이월되면 이 Mock도 함께 이월

### 🔗 References
- 계약 **`SPEC-005`** · `SPEC-006` · 소비 `CLI-F`(FR-074·075) · `UX-G`

### ✅ Task Breakdown
- [ ] 개시 응답 — room id · 소환 매장 수 · `expiresAt`(+180초)
- [ ] **0곳 미개시 응답** (`SPEC-005` 확정 결과)
- [ ] 카운트다운 진행 — 단방향 채널 재현
- [ ] 제안 도착 응답 — 1건 · 다건
- [ ] **제안 0건 마감** 응답 → `UX-F` Top-3 회귀 검증
- [ ] 마감 후 제안 등록 거부 응답

### 필요한 시나리오

| 시나리오 | 검증 대상 |
| --- | --- |
| 개시 + 소환 3곳 | 대화방 화면 (`UX-G`) |
| **0곳 미개시** | 미개시 안내 UI |
| 카운트다운 180→0 | 카운트다운 표시 |
| 제안 1건 / 다건 도착 | 제안 비교 화면 |
| **제안 0건 마감** | **Top-3 회귀** (`REQ-FUNC-025` · `UX-F`) |
| 마감 후 등록 | 거부 처리 |

### 🧪 Acceptance Criteria

**Scenario 1 · 정상** — 개시 후 제안이 도착하고 비교 화면이 렌더된다
**Scenario 2 · 예외** — 소환 0곳 시 미개시 응답이 반환되고 정의된 안내가 표시된다
**Scenario 3 · 경계** — 카운트다운이 0에 도달하는 순간의 UI 전환이 검증된다
**Scenario 4 · 근거 무결성** — 제안 응답의 headline이 **등록 속성으로 뒷받침되지 않으면 생성 불가**하다 (`SPEC-006`)

### ⚙️ Technical & Non-Functional Constraints
- **§3.1.4** 만료 판정은 **서버 시각 기준** — Mock도 서버 시각을 흉내내야 한다
- **§8.3 규칙 6** 가격은 정렬 키가 아니다 — Mock 응답에 **가격 필드가 없어야** 한다

### 🏁 DoD
공통 DoD 6개. 추가로 —
- [ ] 6종 시나리오가 모두 동작하는가?
- [ ] **제안 0건 → Top-3 회귀**가 `UX-F`에서 검증되었는가?

### 🚧 Dependencies & Blockers
- **Depends on** `MOCK-001` (#108) `SPEC-005` (#98) `SPEC-006` (#99)
- **Blocks** `CLI-F` (#152) `UX-G` (#146)
- **⚠️ Phase 게이트** SRS §6.2 게이트 1 미통과 시 이월
- **미정** `SPEC-005` 0곳 미개시 응답 형태

### 공통 DoD — 웨이브 `P1c-mock` 전체

- [ ] 응답이 `docs/api-aiplace.yaml` 스키마 검증을 **자동으로** 통과하는가? (수동 대조는 반드시 어긋난다)
- [ ] 정상·예외·경계 시나리오를 **스위치로 전환**할 수 있는가?
- [ ] **지연 주입**이 가능한가? (p95 초과·타임아웃 경로 검증용)
- [ ] 계약 변경 시 Mock 갱신을 강제하는 절차가 있는가?
- [ ] 소비 측 팀이 실제로 이 Mock으로 착수했음을 확인했는가?
- [ ] 실구현 완료 후 **폐기 시점**이 정해져 있는가?

