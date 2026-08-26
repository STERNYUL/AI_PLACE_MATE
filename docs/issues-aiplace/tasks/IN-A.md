# IN-A · API Gateway 구축

> **웨이브** `P4a-infra` · **라벨** `infra, platform, priority:critical, phase-0, blocks-all`
> **원본** [`docs/issues-aiplace/P4a-infra.md`](../P4a-infra.md#in-a)
> **원장** `TASKS-ai-place-v1.0.md` (TASKS-AIPLACE-MVP-001 v1.1 · 50건) · **SRS** `SRS-ai-place-v1.0.md` (SRS-AIPLACE-MVP-001 v1.9)

**원문** `IN-001`

### 🎯 Summary
- **Task ID** `IN-A` · **Must / H** · **최선행**
- **목적** **모든 것의 입구.** 원장 §4 순위 1 — 없으면 어떤 백엔드 태스크도 착수할 수 없다.

### 🔗 References
- §3.1(시스템 구성) · §5.1 · 선행 **없음**
- 후행 `IN-B` `IN-C` `IN-D` `IN-F` `IDX-A` `SRC-A` `CLI-A` — **사실상 전부**

### ✅ Task Breakdown
- [ ] **`IN-001`** API Gateway 구축 — 인증·라우팅 공통 계층
- [ ] 라우팅 규칙 — `SPEC-` 계약의 엔드포인트 체계 반영
- [ ] 인증 진입점 — `IN-B` 미들웨어 연결 지점
- [ ] 요청 식별자 전파 — `requestId` (`SRC-D` 동점 tie-break에 사용)
- [ ] 레이트 리밋 **(미정 — SRS에 값이 없다)**
- [ ] `MOCK-` 서버 라우팅 경로 (`P1c` 연동)

### ⚠️ `requestId` 전파가 여기서 정해진다

`SRC-D`의 정렬 동점 처리(`P2a` 2번)가 `requestId` 해시를 tie-break로 쓰는 방안을 검토 중이다.
**게이트웨이가 요청마다 안정적인 식별자를 부여하고 하위 서비스에 전파해야** 그 방안이 성립한다.

`TRK-B`의 세션 식별자, `RSV-C`의 결제 멱등키와도 연결된다 —
**"같은 요청인지 어떻게 아는가"** 가 세 곳에서 반복되는 질문이며, 게이트웨이가 그 기반이다.

### 🧪 Acceptance Criteria

**Scenario 1 · 정상 — 라우팅**
- **Given** `SPEC-` 계약의 엔드포인트로 요청이 옴
- **When** 게이트웨이가 처리함
- **Then** 해당 서비스로 라우팅되고 `requestId`가 전파된다

**Scenario 2 · 예외 (§4.5.3) — 하위 서비스 장애**
- **Given** 대상 서비스가 응답하지 않음
- **When** 요청이 들어옴
- **Then** **정의된 오류 응답**이 반환된다. 게이트웨이가 함께 멈추지 않는다

**Scenario 3 · 경계 — 레이트 리밋**
- **Given** 단일 클라이언트의 급증 요청
- **When** 처리함
- **Then** **(미정 — SRS에 값이 없다)** 제한 정책이 필요하다

**Scenario 4 · 근거 무결성 — 식별자 안정성**
- **Given** 하나의 요청이 여러 서비스를 거침
- **When** 로그를 추적함
- **Then** **동일 `requestId`로 전 구간이 연결**된다 (`IN-C` 관측성의 전제)

### ⚙️ Technical & Non-Functional Constraints
- **원장 §4 순위 1** — 후행이 사실상 전부
- **Phase 0 최선행** — 이 태스크의 지연이 전체 일정 지연
- `SPEC-` 계약의 엔드포인트 체계와 정합

### 🏁 DoD
공통 4개. 추가로 —
- [ ] `requestId` 전파가 전 구간에서 유지되는가?
- [ ] 하위 서비스 장애가 게이트웨이를 멈추지 않는가?
- [ ] 레이트 리밋 정책이 확정되었는가?

### 🚧 Dependencies & Blockers
- **Depends on** 없음
- **Blocks** **전 백엔드 태스크**
- **미정 — 확정 필요** 레이트 리밋 정책 (SRS 미정 · 신규 발견)

### 공통 DoD — 웨이브 `P4a-infra` 전체

- [ ] SRS의 **수치 요구를 반올림 없이** 구성에 반영했는가? (3,000 RPS · RTO 30분 · RPO 5분 · TTL 6h · 70%)
- [ ] 해당 항목이 **`TEST-014` 비기능 검증**으로 판정 가능한 형태인가?
- [ ] 설정이 코드로 관리되는가? (수기 구성이면 그 사실을 명시)
- [ ] 개인정보 관련 구성이 §8.6.4 · `PRV-A`와 정합하는가?

