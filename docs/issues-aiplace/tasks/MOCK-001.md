# MOCK-001 · Mock 서버 기반 구성

> **웨이브** `P1c-mock` · **라벨** `mock, backend, priority:high, phase-0, blocks-mock`
> **원본** [`docs/issues-aiplace/P1c-mock.md`](../P1c-mock.md#mock-001)
> **원장** `TASKS-ai-place-v1.0.md` (TASKS-AIPLACE-MVP-001 v1.1 · 50건) · **SRS** `SRS-ai-place-v1.0.md` (SRS-AIPLACE-MVP-001 v1.9)

### 🎯 Summary
- **Task ID** `MOCK-001` · **Epic** Mock · **Must / M**
- **목적** 나머지 7건의 기반. **계약 기반 응답 스위칭**이 이 태스크의 산출물이다.

### 🔗 References
- 공유 계약 `SPEC-001` (공통 응답·에러 규약) · `docs/api-aiplace.yaml`
- **SRS 근거 없음 — 방법론 파생**

### ✅ Task Breakdown
- [ ] Mock 서버 기반 구성 및 배포 경로
- [ ] **계약(OpenAPI) 기반 응답 검증** — 스키마 위반 응답을 만들 수 없게
- [ ] 시나리오 스위칭 방식 (헤더 · 쿼리 · 관리 API 중 택1)
- [ ] 지연 주입 공통 기능
- [ ] `SPEC-001` 오류 본문·추적 ID 헤더 공통 적용
- [ ] 폐기 절차 문서화

### 🧪 Acceptance Criteria

**Scenario 1 · 정상 — 계약 검증**
- **Given** `docs/api-aiplace.yaml`
- **When** Mock이 응답을 생성함
- **Then** 스키마 검증을 통과한다. **위반 응답은 생성 자체가 불가능하다**

**Scenario 2 · 예외 — 계약과 어긋난 응답 정의 시도**
- **Given** 스키마에 없는 필드를 담은 Mock 응답 정의
- **When** 등록을 시도함
- **Then** 거부된다 — Mock이 계약을 앞서 나가는 것을 막는다

**Scenario 3 · 경계 — 지연 주입**
- **Given** 500ms 지연 설정
- **When** 소비 측이 호출함
- **Then** 실제로 500ms 후 응답하고, 타임아웃 경로가 검증 가능해진다

**Scenario 4 · 근거 무결성 — 해당 없음**
- 이 태스크는 후보·제안을 반환하지 않는다

### ⚙️ Technical & Non-Functional Constraints
- **계약이 단일 진실 원천.** Mock이 계약을 앞서면 실구현과 어긋난 채 개발이 진행된다
- 실구현 완료 후 **폐기 대상** — 영구 자산으로 취급하지 않는다
- 스테이징·로컬 양쪽에서 접근 가능해야 함

### 🏁 DoD
공통 DoD 6개. 추가로 —
- [ ] 스키마 위반 응답이 **구조적으로 불가능**한가?

### 🚧 Dependencies & Blockers
- **Depends on** `SPEC-001`
- **Blocks** `MOCK-002`~`MOCK-008`
- **위험** 계약 변경 시 Mock이 뒤처지면 **실구현과 어긋난 채 개발이 진행된다**

### 공통 DoD — 웨이브 `P1c-mock` 전체

- [ ] 응답이 `docs/api-aiplace.yaml` 스키마 검증을 **자동으로** 통과하는가? (수동 대조는 반드시 어긋난다)
- [ ] 정상·예외·경계 시나리오를 **스위치로 전환**할 수 있는가?
- [ ] **지연 주입**이 가능한가? (p95 초과·타임아웃 경로 검증용)
- [ ] 계약 변경 시 Mock 갱신을 강제하는 절차가 있는가?
- [ ] 소비 측 팀이 실제로 이 Mock으로 착수했음을 확인했는가?
- [ ] 실구현 완료 후 **폐기 시점**이 정해져 있는가?

