---
name: GitHub Project 용 TASK 템플릿 (Feature Task)
about: SRS 기반의 구체적인 개발 태스크 명세
title: "[Feature] FR-XXX: {기능 요약}"
labels: 'feature, backend, priority:high'
assignees: ''
---

<!--
  GitHub Project 용 TASK 템플릿 · v1.0
  근거 문서: reference/SRS-example-AD-Core-Platform.md (SRS-ADTECH-MVP-001 v1.0)
  태스크 원장: TASKS-adtech-mvp-v1.0.md

  작성 규칙
  1. Task ID는 태스크 원장의 ID를 그대로 쓴다. 새 ID를 임의로 만들지 않는다.
  2. labels는 태스크 성격에 맞게 교체한다.
     관점  : backend / frontend / infra / security / qa / design
     우선도: priority:high(Must) / priority:medium(Should) / priority:low(Could)
  3. Acceptance Criteria에 판정 수치를 넣을 수 없으면 착수하지 않는다.
     TASKS 문서 부록 D에 해당 항목이 있으면 Blockers에 반드시 기재한다.
  4. 채우지 못한 항목은 지우지 말고 "미정 — 확정 필요"로 남긴다. 빈칸은 합의된 것처럼 보인다.
-->

## 🎯 Summary
- **Task ID**: FR-XXX
- **Epic (도메인)**: {Foundation / Audience / Campaign / Ad Serving / Tracking / Client / External / Infra / QA / UI-UX}
- **기능명**: [FR-XXX] {기능명}
- **목적**: {이 기능이 없으면 무엇이 불가능한지 한 문장으로}
- **우선순위 / 복잡도**: {Must · Should · Could} / {H · M · L}

## 🔗 References (Spec & Context)
> 💡 AI Agent & Dev Note: 작업 시작 전 아래 문서를 반드시 먼저 Read/Evaluate 할 것.
- SRS 요구사항: `reference/SRS-example-AD-Core-Platform.md` §4.1 REQ-FUNC-XXX
- SRS 부속 명세: 동 문서 §6.1 API 목록 / §6.2 데이터 모델 / §6.3 비즈니스 규칙 / §6.4 스키마 개요
- 태스크 원장: `TASKS-adtech-mvp-v1.0.md#EPIC-X` (선행 태스크 · 복잡도 · 커버리지)
- 의존 관계도: `TASKS-adtech-mvp-v1.0.md#부록-a--의존-관계도`
- 학습 · 배경 해설: `SRS-READER.html` {해당 장}
- 데이터 모델 (ERD): `docs/erd.md#{테이블}` <!-- 미생성 — FR-006~009에서 산출 -->
- API 명세: `docs/api_v1.yaml#{메서드-경로}` <!-- 미생성 — API 태스크에서 산출 -->

## ✅ Task Breakdown (실행 계획)
- [ ] {데이터 계층 — 스키마 · 마이그레이션 · enum 반영}
- [ ] {DTO 및 검증(Validation) 로직}
- [ ] {비즈니스 로직(Service) 및 예외 처리}
- [ ] {소프트 삭제 필터 적용 — REQ-FUNC-007 대상 조회 전부}
- [ ] {API Controller 연동 · 계약(요청·응답·상태 코드) 확정}
- [ ] {단위 · 통합 테스트 작성}
- [ ] {계측 — 로그 · 메트릭 · 요청 추적 ID}

## 🧪 Acceptance Criteria (BDD/GWT)
> SRS §4.1·§4.2의 인수 기준 열을 시나리오로 전개한다. **불합격을 낼 수 없는 기준은 기준이 아니다.**

**Scenario 1: {정상 경로}**
- **Given**: {선행 상태와 입력 데이터}
- **When**: {호출하는 API 또는 실행하는 동작}
- **Then**: {저장 결과 + 상태 코드 + 응답 본문}

**Scenario 2: {예외 경로}**
- **Given**: {예외를 유발하는 상태}
- **When**: {동일 동작}
- **Then**: {실패 처리 + 상태 코드 + 에러 응답}

**Scenario 3: {경계값 또는 동시성}**
- **Given**: {경계 조건 — 값의 상·하한, 데이터 미상, 동시 요청}
- **When**: {동작}
- **Then**: {판정 결과}

## ⚙️ Technical & Non-Functional Constraints
- **성능**: 이 태스크에 배분된 응답 시간 예산 {N}ms 이내 (전체 목표 REQ-NF-001 p95 ≤ 100ms)
- **처리량**: 1,000 RPS 부하에서 위 예산 유지 (REQ-NF-002)
- **가용성**: 단일 장애점 없음 · 외부 호출에 타임아웃 설정 (REQ-NF-003)
- **보안**: 전 API 인증 필수 · 타 광고주 자원 접근 차단 · 개인정보(연령·소득·지역) 로깅 시 마스킹 (REQ-NF-004)
- **유지보수성**: 신규 enum 값 추가 시 변경 파일 최소화 · 스키마 변경 불필요 (REQ-NF-005)
- **데이터**: 물리 삭제 금지 · `deleted_at` 사용 · 모든 조회에 제외 필터 (REQ-FUNC-007, §6.3 규칙 5)

## 🏁 Definition of Done (DoD)
- [ ] 모든 Acceptance Criteria를 충족하는가?
- [ ] 정상 경로뿐 아니라 **예외 경로 테스트**가 추가되었고 통과하는가?
- [ ] 단위 테스트 및 통합 테스트가 통과하는가?
- [ ] 정적 분석(Linter · SonarQube 등) 경고가 없는가?
- [ ] API 명세(Swagger/OpenAPI)가 최신화되었는가?
- [ ] 소프트 삭제 제외 필터가 이번에 추가한 모든 조회에 적용되었는가?
- [ ] 인증·인가가 적용되었고, 타 광고주 자원 접근이 차단됨을 확인했는가?
- [ ] 성능 측정값이 배분된 예산 안에 있는가?
- [ ] **SRS 원문과 어긋난 부분이 있으면 문서를 갱신했는가?**
- [ ] 태스크 원장(`TASKS-adtech-mvp-v1.0.md`)의 상태를 갱신했는가?

## 🚧 Dependencies & Blockers
- **Depends on**: #{이슈번호} ({선행 Task ID — 태스크 원장의 선행 태스크 열})
- **Blocks**: #{이슈번호} ({이 태스크를 기다리는 후행 Task ID})
- **SRS 미정의 (착수 전 확정 필요)**: {`TASKS-adtech-mvp-v1.0.md` 부록 D의 해당 항목. 없으면 "없음"}
  <!-- 여기에 항목이 있으면 Acceptance Criteria에 판정 수치를 넣을 수 없다.
       착수는 가능해도 완료 판정은 불가능하므로, 확정 담당자와 기한을 함께 적을 것. -->
