# P1c · 모킹 서버 — `MOCK-001` ~ `MOCK-008`

**웨이브:** 제작 순서 3번 · **Phase 0~1**
**근거:** 평가서 `docs/task-extraction-assessment-aiplace.md` §1 Step 1
**공유 계약:** [`P1a-contracts.md`](P1a-contracts.md) — `SPEC-001`~`SPEC-007`

> **⚠️ 이 8건은 SRS에 직접 근거가 없다.** 개발 방법론상 필요해 신설한 태스크이며,
> `SPEC` 계약을 입력으로 삼으므로 SRS와 무관하지는 않으나 **원문이 요구한 기능은 아니다.**
> 원장 §0.1의 *"근거 강제"* 원칙에 대한 **의도적 예외**이며, 그 사실을 여기 명시한다.

## 이 웨이브가 푸는 문제

평가서 §0이 지적한 결함 2번이다.

```
현재   CLI-C(FR-068 Top-3 카드) ──기다림──> SRC-D(FR-019 API 구현)
       프론트엔드가 백엔드를 기다리는 직렬 구조
```

**§4.3.3은 Phase 1 8주 안에 3스트림 병행을 전제한다.** 직렬 구조로는 성립하지 않는다.
Mock이 들어오면 클라이언트의 선행이 백엔드 구현에서 **`MOCK-00x`로 바뀐다.**

## 수록 이슈 8건

| 이슈 | 대응 계약 | 소비 주체 | 복잡도 |
| --- | --- | --- | --- |
| `MOCK-001` | 공통 | 전 Mock의 기반 | M |
| `MOCK-002` | `SPEC-002` | `CLI-B` `CLI-C` | M |
| `MOCK-003` | `SPEC-002` · `SPEC-008` | `CLI-C` `UX-C` | M |
| `MOCK-004` | `SPEC-002` | `CLI-C` `UX-C` | M |
| `MOCK-005` | `SPEC-004` | `CLI-C` `UX-D` | L |
| `MOCK-006` | `SPEC-005` | `CLI-F` `UX-G` | M |
| `MOCK-007` | `SPEC-007` | `CLI-D` `UX-E` | M |
| `MOCK-008` | `SPEC-004`(콘솔 계약 미정) | `CLI-G` `UX-H` | M |

## 공통 DoD — 8건 전체

- [ ] 응답이 `docs/api-aiplace.yaml` 스키마 검증을 **자동으로** 통과하는가? (수동 대조는 반드시 어긋난다)
- [ ] 정상·예외·경계 시나리오를 **스위치로 전환**할 수 있는가?
- [ ] **지연 주입**이 가능한가? (p95 초과·타임아웃 경로 검증용)
- [ ] 계약 변경 시 Mock 갱신을 강제하는 절차가 있는가?
- [ ] 소비 측 팀이 실제로 이 Mock으로 착수했음을 확인했는가?
- [ ] 실구현 완료 후 **폐기 시점**이 정해져 있는가?

---
---

## MOCK-001 · Mock 서버 기반 구성 {#mock-001}

**labels** `mock, backend, priority:high, phase-0, blocks-mock`

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

---

## MOCK-002 · Top-3 조회 Mock {#mock-002}

**labels** `mock, backend, search-service, priority:high, phase-1`

### 🎯 Summary
- **Task ID** `MOCK-002` · **Must / M**
- **목적** `CLI-B`·`CLI-C`가 `SRC-A`~`SRC-D` 완성을 기다리지 않게 한다. **직렬 구조가 풀리는 핵심 지점.**

### 🔗 References
- 계약 **`SPEC-002`** · 소비 `CLI-B`(FR-066·067) · `CLI-C`(FR-068)

### ✅ Task Breakdown
- [ ] 성공 응답 — 후보 **정확히 3개** · 여섯 필드 완비
- [ ] **폴백 전환 신호** 응답 (`REQ-FUNC-009`)
- [ ] 빈 결과 응답 — `SPEC-002` Scenario 4 확정 결과 반영
- [ ] '예산 초과 N곳' 요약 포함 응답 (`REQ-FUNC-003`)
- [ ] 유사 메뉴 대체 명시 응답 (`REQ-FUNC-007`)
- [ ] p95 1,000ms 초과 지연 응답

### 필요한 시나리오

| 시나리오 | 응답 | 소비 측이 검증할 것 |
| --- | --- | --- |
| 정상 3개 | 후보 3 · 여섯 필드 | Top-3 카드 렌더 |
| 폴백 전환 | 전환 신호 + 구조화 후보군 | 전환 고지 UI (`UX-B`) |
| 예산 초과 요약 | 'N곳 초과' 포함 | 요약 표기 |
| 유사 대체 | 대체 사실 명시 | 대체 고지 표기 |
| **후보 없음** | `SPEC-002` 확정안 | **빈 화면 금지 처리 (`UX-F`)** |
| 지연 1,500ms | 정상 응답 + 지연 | 로딩·레이아웃 안정 |

**"후보 없음"이 `UX-F`(빈 화면 금지)의 유일한 검증 수단이다.** 이 응답이 없으면 그 태스크를 그릴 수 없다.

### 🧪 Acceptance Criteria

**Scenario 1 · 정상** — 3개 후보 응답이 계약 스키마를 통과하고 `CLI-C`가 렌더한다
**Scenario 2 · 예외** — 폴백 전환 신호를 반환하면 `CLI-B`가 구조화 필터 UI로 전환한다
**Scenario 3 · 경계** — 지연 1,500ms 주입 시 클라이언트 로딩 처리와 레이아웃 안정성이 검증된다
**Scenario 4 · 근거 무결성** — 여섯 필드 중 **근거 문장·확인 일자·주체가 빠진 응답은 생성 불가**하다 (계약 검증)

### ⚙️ Technical & Non-Functional Constraints
- `SPEC-002` 계약 준수 · 후보 **정확히 3개**
- **`SPEC-002` Scenario 4 미확정** — "3개 고정 ↔ 근거 없는 후보 제외" 충돌이 정해져야 빈 결과 응답을 만들 수 있다

### 🏁 DoD
공통 DoD 6개. 추가로 —
- [ ] 6종 시나리오가 모두 동작하는가?
- [ ] `CLI-B`·`CLI-C` 담당자가 이 Mock으로 착수했는가?

### 🚧 Dependencies & Blockers
- **Depends on** `MOCK-001` `SPEC-002`
- **Blocks** `CLI-B` `CLI-C` `UX-F`
- **미정** `SPEC-002` Scenario 4 (3개 고정 ↔ 근거 제외 충돌)

---

## MOCK-003 · 근거 4항목 완비/누락 Mock {#mock-003}

**labels** `mock, backend, evidence-service, priority:high, phase-1`

### 🎯 Summary
- **Task ID** `MOCK-003` · **Must / M**
- **목적** **근거 무결성 동작을 검증하는 유일한 수단.** 실제 데이터로는 누락 케이스를 만들기 어렵다.

### 🔗 References
- 계약 **`SPEC-002`** · **`SPEC-008`(근거 4항목)** · 소비 `CLI-C` · `UX-C`

### ✅ Task Breakdown
- [ ] 4항목 완비 응답
- [ ] **항목별 누락 응답 4종** — 선정 이유 / 근거 속성 / 확인 일자 / 확인 주체 각각
- [ ] 누락 시 제외 동작 검증용 조합 응답
- [ ] `SPEC-008` 확정 결과 반영 (제외인지 표기인지)

### 누락 4종이 각각 필요한 이유

`SPEC-008`은 4항목을 **동등하게** 취급한다. 그런데 구현이 실수로 3개만 검사할 수 있다.
**항목별로 하나씩 빼본 응답이 있어야 그 실수가 드러난다.**

### 🧪 Acceptance Criteria

**Scenario 1 · 정상** — 4항목 완비 후보가 정상 렌더된다
**Scenario 2 · 예외** — 확인 주체만 빠진 응답에서 **그 후보가 제외되거나 정의된 표기**가 나타난다
**Scenario 3 · 경계** — 4항목 중 1개씩 빠진 4종 응답 각각에서 **동일한 처리**가 일어난다
**Scenario 4 · 근거 무결성** — **이 Mock 자체가 근거 무결성 검증 도구다.** 4종 누락 케이스가 모두 재현된다

### ⚙️ Technical & Non-Functional Constraints
- `SPEC-008`의 정의를 **재정의하지 않고 재현만** 한다
- `EVD-A`·`EVD-C`·`AGT-C`·`CLI-C` 네 소비처가 같은 결론을 내는지 확인하는 데 쓰인다

### 🏁 DoD
공통 DoD 6개. 추가로 —
- [ ] 4종 누락 응답이 각각 생성되는가?
- [ ] `SPEC-008` 확정 후 동작이 갱신되었는가?

### 🚧 Dependencies & Blockers
- **Depends on** `MOCK-001` `SPEC-002` `SPEC-008`
- **Blocks** `CLI-C` `UX-C`
- **미정** `SPEC-008`의 누락 시 동작 (제외 vs 표기)

---

## MOCK-004 · 신선도 3상태 Mock {#mock-004}

**labels** `mock, backend, evidence-service, priority:high, phase-1`

### 🎯 Summary
- **Task ID** `MOCK-004` · **Must / M**
- **목적** `VERIFIED` / `STALE` / `RECHECK_REQUIRED` 세 상태의 표기를 UI에서 미리 그린다.

### 🔗 References
- 계약 `SPEC-002` · SRS §8.2 상태 전이 · `REQ-FUNC-011` · `REQ-NF-011`
- 소비 `CLI-C`(FR-069 신선도 표기) · `UX-C`

### ✅ Task Breakdown
- [ ] `VERIFIED` 응답 — 경고 없음
- [ ] `STALE` 응답 — **90일 초과 경고 병기**
- [ ] `RECHECK_REQUIRED` 응답 — 재확인 중 표기
- [ ] 경계 응답 — `verified_at + 89일` / `+90일` / `+91일`
- [ ] **판정형 문구가 섞이지 않은** 문안 (§8.3 규칙 3)

### 🧪 Acceptance Criteria

**Scenario 1 · 정상** — `VERIFIED` 후보에 경고 표기가 없다
**Scenario 2 · 예외** — `RECHECK_REQUIRED` 후보의 표기가 정의된 대로 나타난다
**Scenario 3 · 경계** — 89일 / 90일 / 91일 세 응답에서 경고 전환 지점이 확인된다
**Scenario 4 · 근거 무결성** — 세 상태 어디에도 **판정형 문구가 없다** (§8.3 규칙 3 · `UX-C` 라이팅 가이드)

### ⚙️ Technical & Non-Functional Constraints
- **`REQ-NF-011`** 경고 누락률 **0%** — Mock이 경고 없는 `STALE`을 만들 수 있으면 안 된다
- **§8.3 규칙 3** 판정 금지 — 표기 문안이 사실 진술이어야 한다

### 🏁 DoD
공통 DoD 6개. 추가로 —
- [ ] 3상태 + 경계 3종이 모두 동작하는가?
- [ ] `UX-C` 담당자가 세 상태 표기를 실제로 그렸는가?

### 🚧 Dependencies & Blockers
- **Depends on** `MOCK-001` `SPEC-002`
- **Blocks** `CLI-C` `UX-C`

---

## MOCK-005 · 공유 카드 Mock {#mock-005}

**labels** `mock, backend, evidence-service, priority:medium, phase-1`

### 🎯 Summary
- **Task ID** `MOCK-005` · **Should / L**
- **목적** 공유 카드 생성 성공과 **근거 누락 `400`** 두 경로를 재현한다.

### 🔗 References
- 계약 **`SPEC-004`** · 소비 `CLI-C`(FR-070) · `UX-D`

### ✅ Task Breakdown
- [ ] 성공 응답 — 이미지 URL + 딥링크
- [ ] **근거 누락 `400`** 응답
- [ ] 이미지 생성 실패 응답 (`SPEC-004` Scenario 2 확정 후)
- [ ] p95 3,000ms 초과 지연 응답

### 🧪 Acceptance Criteria

**Scenario 1 · 정상** — 이미지 URL·딥링크가 반환되고 공유 UI가 동작한다
**Scenario 2 · 예외** — 근거 누락 시 `400`이 반환되고 **클라이언트가 카드 생성을 시도하지 않는다**
**Scenario 3 · 경계** — 3,000ms 지연 시 로딩 처리가 검증된다
**Scenario 4 · 근거 무결성** — **근거 없는 카드가 생성되는 응답을 만들 수 없다** (계약이 금지)

### ⚙️ Technical & Non-Functional Constraints
- 생성된 카드는 **외부로 유통**된다. 근거 없는 카드가 나가면 회수 불가
- `SPEC-004` p95 ≤ 3,000ms

### 🏁 DoD
공통 DoD 6개. 추가로 —
- [ ] `400` 경로가 `UX-D` 플로우에 반영되었는가?

### 🚧 Dependencies & Blockers
- **Depends on** `MOCK-001` `SPEC-004`
- **Blocks** `CLI-C`(FR-070) `UX-D`
- **미정** `SPEC-004` 이미지 생성 실패 시 동작

---

## MOCK-006 · 대화방 Mock {#mock-006}

**labels** `mock, backend, agent-room, priority:medium, phase-2`

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
- **Depends on** `MOCK-001` `SPEC-005` `SPEC-006`
- **Blocks** `CLI-F` `UX-G`
- **⚠️ Phase 게이트** SRS §6.2 게이트 1 미통과 시 이월
- **미정** `SPEC-005` 0곳 미개시 응답 형태

---

## MOCK-007 · 예약·결제 Mock {#mock-007}

**labels** `mock, backend, payment-service, priority:high, phase-1`

### 🎯 Summary
- **Task ID** `MOCK-007` · **Must / M**
- **목적** **PG사 선정 전에도 결제 화면을 만들 수 있게** 한다. `SPEC-007`의 절반이 미확정인 상태를 우회한다.

### 🔗 References
- 계약 **`SPEC-007`** · 소비 `CLI-D`(FR-072·073) · `UX-E`

### ✅ Task Breakdown
- [ ] 승인 성공 응답 — 거래 토큰
- [ ] 승인 실패 응답 (카드 거절 · 한도 초과 등)
- [ ] **PG 장애 응답** (`SPEC-007` Scenario 2)
- [ ] 취소·환불 접수 응답
- [ ] 환불 완료 응답 (비동기)
- [ ] 2시간 전 시한 경과 취소 거부 응답

### ⚠️ PG사 미선정 상태를 Mock이 흡수한다

`SPEC-007`은 **실제 API 형식·토큰 형식·오류 코드 체계가 PG 선정 후에만 확정**된다.
Mock은 **우리 쪽 요구사항**(카드 정보 비보관 · 환불 ≤ 24h · 거래 토큰만)만으로 만들 수 있다.

**따라서 `CLI-D`·`UX-E`는 PG 계약을 기다리지 않는다.** PG 선정 후 Mock을 실제 규격으로 갱신한다.

### 🧪 Acceptance Criteria

**Scenario 1 · 정상** — 승인 성공 시 거래 토큰이 반환되고 예약 확정 화면이 렌더된다
**Scenario 2 · 예외** — PG 장애 응답 시 **예약이 미확정 상태로 남고** 재시도 경로가 동작한다
**Scenario 3 · 경계** — 2시간 전 시한을 지난 취소 요청이 거부된다 (`REQ-FUNC-017`)
**Scenario 4 · 근거 무결성 — 해당 없음** — 후보·제안을 반환하지 않는다

### ⚙️ Technical & Non-Functional Constraints
- **`REQ-NF-016`** 카드 정보 비보관 — **Mock도 카드 정보를 받지 않는다**
- **`REQ-FUNC-017`** 환불 ≤ 24h · 2시간 전 시한
- PG 선정 후 **갱신 필수**

### 🏁 DoD
공통 DoD 6개. 추가로 —
- [ ] Mock이 카드 정보를 요구하지 않는가?
- [ ] PG 선정 후 갱신 절차가 문서화되었는가?

### 🚧 Dependencies & Blockers
- **Depends on** `MOCK-001` `SPEC-007`
- **Blocks** `CLI-D` `UX-E`
- **미정** `SPEC-007` PG 장애 시 예약 상태 처리

---

## MOCK-008 · 매장 콘솔 Mock {#mock-008}

**labels** `mock, backend, merchant-console, priority:medium, phase-2`

### 🎯 Summary
- **Task ID** `MOCK-008` · **Should / M**
- **목적** 매장 콘솔 화면(`CLI-G`·`UX-H`)이 `MCH-A` 구현을 기다리지 않게 한다.
- **⚠️ Phase 2 조건부**

### 🔗 References
- 소비 `CLI-G`(FR-076) · `UX-H` · 대상 `MCH-A`(FR-037~040)
- **⚠️ 콘솔 API 계약이 `SPEC-`에 없다** — 아래 참조

### ⚠️ 콘솔 API 계약이 누락돼 있다

`SPEC-001`~`009` 어디에도 **매장 콘솔 CRUD 계약이 없다.**
평가서 §1의 신규 9건은 §8.1의 5개 엔드포인트 + PG + 근거 + 이벤트를 덮었는데,
**콘솔은 §8.1의 엔드포인트 목록 자체에 없다.**

**이 Mock을 만들려면 콘솔 계약을 먼저 정해야 한다.** `SPEC-010`(가칭) 신설이 필요할 수 있다 —
**확정 필요.** 그 전까지 이 Mock은 `MCH-A`의 Task Breakdown을 근거로 잠정 구성한다.

### ✅ Task Breakdown
- [ ] **콘솔 API 계약 확정 또는 `SPEC-010` 신설 판단**
- [ ] 프로필 조회 응답 — 기존 항목 1회 클릭 로드 (`REQ-FUNC-027`)
- [ ] 프로필 등록·갱신 응답
- [ ] **근거 없는 문구 저장 차단** `400` 응답 (`REQ-FUNC-021`)
- [ ] 수용 조건 설정 응답
- [ ] 설정 3화면 · 필수 5항목 구조 재현 (`REQ-FUNC-019`)

### 🧪 Acceptance Criteria

**Scenario 1 · 정상** — 프로필 조회 시 기존 항목이 1회 클릭으로 로드된다 (`REQ-FUNC-027`)
**Scenario 2 · 예외** — `Attribute` 미참조 문구 저장 시 `400`이 반환된다 (`REQ-FUNC-021`)
**Scenario 3 · 경계** — 필수 항목 5개 미만 입력 시 저장이 거부된다 (`REQ-FUNC-019`)
**Scenario 4 · 근거 무결성** — **근거 없는 문구가 저장되는 응답을 만들 수 없다**

### ⚙️ Technical & Non-Functional Constraints
- **`REQ-FUNC-019`** 설정 화면 **3개 이하** · 필수 항목 **5개 이하**
- **`REQ-FUNC-027`** 기존 항목 **1회 클릭** 로드
- **§8.3 규칙 7** 근거 없는 문구 저장 차단

### 🏁 DoD
공통 DoD 6개. 추가로 —
- [ ] **콘솔 API 계약이 확정되었는가?** (`SPEC-010` 신설 여부 포함)
- [ ] `UX-H`가 설정 3화면·필수 5항목 제약을 이 Mock으로 검증했는가?

### 🚧 Dependencies & Blockers
- **Depends on** `MOCK-001` · **콘솔 API 계약 (미정)**
- **Blocks** `CLI-G` `UX-H`
- **⚠️ Phase 게이트** Phase 2 조건부
- **미정 — 확정 필요** **콘솔 API 계약 부재** — `SPEC-010` 신설 판단 (담당: 개발팀 리드)

---

## 이 웨이브가 끝나면 풀리는 것

| 이전 | 이후 |
| --- | --- |
| `CLI-B` `CLI-C` → `SRC-D` 대기 | → **`MOCK-002` `MOCK-003` `MOCK-004`** |
| `CLI-D` → `RSV-C`(PG 계약) 대기 | → **`MOCK-007`** |
| `CLI-F` → `AGT-B` `AGT-C` 대기 | → **`MOCK-006`** |
| `CLI-G` → `MCH-A` 대기 | → **`MOCK-008`** |
| `UX-C` `UX-D` `UX-E` `UX-F` `UX-G` `UX-H` | → Mock으로 상태 전수 렌더 가능 |

**§4.3.3이 전제한 3스트림 병행이 비로소 성립한다.**

## 이 웨이브에서 새로 드러난 미정 항목

| # | 항목 | 담당 | 막힌 이슈 |
| --- | --- | --- | --- |
| 1 | **매장 콘솔 API 계약 부재** — `SPEC-` 9건이 §8.1의 5개 엔드포인트만 덮었고 콘솔은 §8.1에 없다 | 개발팀 리드 | `MOCK-008` `CLI-G` `UX-H` |

**1번이 이 웨이브의 실질적 발견이다.** 평가서가 계약 9건을 도출할 때 §8.1을 원천으로 삼았는데,
**§8.1에 콘솔이 없어서 계약도 없다.** 그런데 `MCH-A`·`CLI-G`·`UX-H`는 콘솔을 만든다.
