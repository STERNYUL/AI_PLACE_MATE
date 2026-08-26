# 태스크 개별 파일 · GitHub 이슈 대조표

**생성일:** 2026-08-26 · **총 81건** (GitHub 이슈 `#94` ~ `#174`)
**원장:** `TASKS-ai-place-v1.0.md` (TASKS-AIPLACE-MVP-001 v1.1 · 50건)
**웨이브 문서:** `docs/issues-aiplace/P1a` ~ `P4a` (14건) · 의존 분석 `P4b-dependency.md`

> 이 디렉터리의 `.md` 1개 = GitHub 이슈 1건. 파일 본문이 이슈 본문의 원본이다.
> 본문을 고치면 해당 이슈도 갱신해야 대조가 유지된다.

## `P1a-contracts`

| 태스크 | 파일 | 이슈 | 라벨 |
| --- | --- | --- | --- |
| `SPEC-001` | [공통 응답 · 에러 규약](SPEC-001.md) | [#94](https://github.com/STERNYUL/AI_PLACE_MATE/issues/94) | `spec, contract, backend, priority:high, phase-0, blocks-all` |
| `SPEC-002` | [`POST /v1/query` 계약](SPEC-002.md) | [#95](https://github.com/STERNYUL/AI_PLACE_MATE/issues/95) | `spec, contract, backend, search-service, priority:high, phase-0, critical-path` |
| `SPEC-003` | [`GET /v1/places/{id}/dishes` 계약](SPEC-003.md) | [#96](https://github.com/STERNYUL/AI_PLACE_MATE/issues/96) | `spec, contract, backend, index-service, priority:high, phase-0` |
| `SPEC-004` | [`POST /v1/share-cards` 계약](SPEC-004.md) | [#97](https://github.com/STERNYUL/AI_PLACE_MATE/issues/97) | `spec, contract, backend, evidence-service, priority:high, phase-0` |
| `SPEC-005` | [`POST /v1/agent-rooms` 계약](SPEC-005.md) | [#98](https://github.com/STERNYUL/AI_PLACE_MATE/issues/98) | `spec, contract, backend, agent-room, priority:medium, phase-2` |
| `SPEC-006` | [`POST /v1/proposals` 계약](SPEC-006.md) | [#99](https://github.com/STERNYUL/AI_PLACE_MATE/issues/99) | `spec, contract, backend, agent-room, priority:medium, phase-2` |
| `SPEC-007` | [PG 연동 계약](SPEC-007.md) | [#100](https://github.com/STERNYUL/AI_PLACE_MATE/issues/100) | `spec, contract, backend, payment-service, priority:high, phase-0, external` |
| `SPEC-008` | [근거 4항목 계약](SPEC-008.md) | [#101](https://github.com/STERNYUL/AI_PLACE_MATE/issues/101) | `spec, contract, backend, evidence-service, priority:high, phase-0, blocks-all` |
| `SPEC-009` | [계측 이벤트 스키마](SPEC-009.md) | [#102](https://github.com/STERNYUL/AI_PLACE_MATE/issues/102) | `spec, contract, backend, tracking-service, priority:high, phase-0` |

## `P1b-data`

| 태스크 | 파일 | 이슈 | 라벨 |
| --- | --- | --- | --- |
| `IDX-A` | [색인 스키마 및 데이터 모델](IDX-A.md) | [#103](https://github.com/STERNYUL/AI_PLACE_MATE/issues/103) | `db, backend, index-service, priority:high, phase-0, blocks-many` |
| `IDX-B` | [`canonical_key` 메뉴명 정규화](IDX-B.md) | [#104](https://github.com/STERNYUL/AI_PLACE_MATE/issues/104) | `db, backend, index-service, priority:high, phase-0, accuracy-target` |
| `IDX-C` | [색인 파이프라인 및 초기 적재](IDX-C.md) | [#105](https://github.com/STERNYUL/AI_PLACE_MATE/issues/105) | `db, backend, index-service, priority:high, phase-0` |
| `IDX-D` | [`Verification` 엔터티 및 상태 전이](IDX-D.md) | [#106](https://github.com/STERNYUL/AI_PLACE_MATE/issues/106) | `db, backend, index-service, priority:high, phase-1, adr-002` |
| `IDX-E` | [dishes 조회 API 및 캐시](IDX-E.md) | [#107](https://github.com/STERNYUL/AI_PLACE_MATE/issues/107) | `feature, query, backend, index-service, priority:high, phase-1` |

## `P1c-mock`

| 태스크 | 파일 | 이슈 | 라벨 |
| --- | --- | --- | --- |
| `MOCK-001` | [Mock 서버 기반 구성](MOCK-001.md) | [#108](https://github.com/STERNYUL/AI_PLACE_MATE/issues/108) | `mock, backend, priority:high, phase-0, blocks-mock` |
| `MOCK-002` | [Top-3 조회 Mock](MOCK-002.md) | [#109](https://github.com/STERNYUL/AI_PLACE_MATE/issues/109) | `mock, backend, search-service, priority:high, phase-1` |
| `MOCK-003` | [근거 4항목 완비/누락 Mock](MOCK-003.md) | [#110](https://github.com/STERNYUL/AI_PLACE_MATE/issues/110) | `mock, backend, evidence-service, priority:high, phase-1` |
| `MOCK-004` | [신선도 3상태 Mock](MOCK-004.md) | [#111](https://github.com/STERNYUL/AI_PLACE_MATE/issues/111) | `mock, backend, evidence-service, priority:high, phase-1` |
| `MOCK-005` | [공유 카드 Mock](MOCK-005.md) | [#112](https://github.com/STERNYUL/AI_PLACE_MATE/issues/112) | `mock, backend, evidence-service, priority:medium, phase-1` |
| `MOCK-006` | [대화방 Mock](MOCK-006.md) | [#113](https://github.com/STERNYUL/AI_PLACE_MATE/issues/113) | `mock, backend, agent-room, priority:medium, phase-2` |
| `MOCK-007` | [예약·결제 Mock](MOCK-007.md) | [#114](https://github.com/STERNYUL/AI_PLACE_MATE/issues/114) | `mock, backend, payment-service, priority:high, phase-1` |
| `MOCK-008` | [매장 콘솔 Mock](MOCK-008.md) | [#115](https://github.com/STERNYUL/AI_PLACE_MATE/issues/115) | `mock, backend, merchant-console, priority:medium, phase-2` |

## `P2a-search`

| 태스크 | 파일 | 이슈 | 라벨 |
| --- | --- | --- | --- |
| `SRC-A` | [조건 파싱 · 폴백 · 실패율 경보](SRC-A.md) | [#116](https://github.com/STERNYUL/AI_PLACE_MATE/issues/116) | `feature, backend, search-service, priority:high, phase-1` |
| `SRC-B` | [예산 필터 및 조건 카테고리 필터](SRC-B.md) | [#117](https://github.com/STERNYUL/AI_PLACE_MATE/issues/117) | `feature, query, backend, search-service, priority:high, phase-1` |
| `SRC-C` | [메뉴 질의 및 유사 대체](SRC-C.md) | [#118](https://github.com/STERNYUL/AI_PLACE_MATE/issues/118) | `feature, query, backend, search-service, priority:high, phase-1, accuracy-target` |
| `SRC-D` | [Top-3 정렬 및 `POST /v1/query`](SRC-D.md) | [#119](https://github.com/STERNYUL/AI_PLACE_MATE/issues/119) | `feature, backend, search-service, priority:high, phase-1, critical-path` |

## `P2b-evidence`

| 태스크 | 파일 | 이슈 | 라벨 |
| --- | --- | --- | --- |
| `EVD-A` | [근거 4항목 검증기](EVD-A.md) | [#120](https://github.com/STERNYUL/AI_PLACE_MATE/issues/120) | `feature, backend, evidence-service, priority:high, phase-1, blocks-many` |
| `EVD-B` | [문장 생성 · 신선도 경고 · 판정형 차단](EVD-B.md) | [#121](https://github.com/STERNYUL/AI_PLACE_MATE/issues/121) | `feature, backend, evidence-service, priority:high, phase-1` |
| `EVD-C` | [공유 카드 생성](EVD-C.md) | [#122](https://github.com/STERNYUL/AI_PLACE_MATE/issues/122) | `feature, backend, evidence-service, priority:high, phase-1` |
| `EVD-D` | [불일치 신고 및 재확인 큐](EVD-D.md) | [#123](https://github.com/STERNYUL/AI_PLACE_MATE/issues/123) | `feature, command, backend, evidence-service, priority:high, phase-1` |

## `P2c-tracking`

| 태스크 | 파일 | 이슈 | 라벨 |
| --- | --- | --- | --- |
| `TRK-A` | [이벤트 스키마 22종](TRK-A.md) | [#124](https://github.com/STERNYUL/AI_PLACE_MATE/issues/124) | `feature, backend, tracking-service, priority:high, phase-0, blocks-all-kpi` |
| `TRK-B` | [수집 파이프라인](TRK-B.md) | [#125](https://github.com/STERNYUL/AI_PLACE_MATE/issues/125) | `feature, backend, tracking-service, priority:high, phase-0` |
| `TRK-C` | [KPI 배치 집계 및 파생 지표](TRK-C.md) | [#126](https://github.com/STERNYUL/AI_PLACE_MATE/issues/126) | `feature, backend, tracking-service, priority:high, phase-1` |
| `TRK-D` | [결측 처리 및 리포트](TRK-D.md) | [#127](https://github.com/STERNYUL/AI_PLACE_MATE/issues/127) | `feature, backend, tracking-service, priority:medium, phase-1` |
| `TRK-E` | [비용 및 단위 경제 지표](TRK-E.md) | [#128](https://github.com/STERNYUL/AI_PLACE_MATE/issues/128) | `feature, backend, tracking-service, priority:medium, phase-1` |

## `P2d-reservation-privacy`

| 태스크 | 파일 | 이슈 | 라벨 |
| --- | --- | --- | --- |
| `RSV-A` | [Reservation 엔터티 및 조건 승계](RSV-A.md) | [#129](https://github.com/STERNYUL/AI_PLACE_MATE/issues/129) | `feature, backend, reservation-service, priority:high, phase-1-late` |
| `RSV-B` | [결제 금액 산출 및 확정 통보](RSV-B.md) | [#130](https://github.com/STERNYUL/AI_PLACE_MATE/issues/130) | `feature, backend, payment-service, priority:high, phase-1-late` |
| `RSV-C` | [PG 결제 승인 연동](RSV-C.md) | [#131](https://github.com/STERNYUL/AI_PLACE_MATE/issues/131) | `feature, command, backend, payment-service, priority:high, phase-1-late, external` |
| `RSV-D` | [취소·환불 및 노쇼 정산](RSV-D.md) | [#132](https://github.com/STERNYUL/AI_PLACE_MATE/issues/132) | `feature, command, backend, reservation-service, priority:high, phase-1-late` |
| `PRV-A` | [서버 측 개인정보 처리](PRV-A.md) | [#133](https://github.com/STERNYUL/AI_PLACE_MATE/issues/133) | `feature, backend, privacy, priority:high, phase-1-late` |
| `PRV-B` | [개인 제약 정보 단말 저장 및 옵트인](PRV-B.md) | [#134](https://github.com/STERNYUL/AI_PLACE_MATE/issues/134) | `feature, frontend, privacy, priority:high, phase-1-late` |

## `P2e-client`

| 태스크 | 파일 | 이슈 | 라벨 |
| --- | --- | --- | --- |
| `CLI-A` | [앱 셸 · 라우팅 · 지도 내 탭 진입](CLI-A.md) | [#135](https://github.com/STERNYUL/AI_PLACE_MATE/issues/135) | `feature, frontend, client, priority:high, phase-1, foundation` |
| `CLI-B` | [조건 입력 및 폴백 필터 UI](CLI-B.md) | [#136](https://github.com/STERNYUL/AI_PLACE_MATE/issues/136) | `feature, frontend, client, priority:high, phase-1` |
| `CLI-C` | [Top-3 카드 · 신선도 경고 · 공유 · 신고](CLI-C.md) | [#137](https://github.com/STERNYUL/AI_PLACE_MATE/issues/137) | `feature, frontend, client, evidence, priority:high, phase-1` |
| `CLI-D` | [예약·결제 및 취소·환불 화면](CLI-D.md) | [#138](https://github.com/STERNYUL/AI_PLACE_MATE/issues/138) | `feature, frontend, client, payment, priority:high, phase-1-late` |
| `CLI-E` | [성능 최적화 · RUM · 이벤트 계측](CLI-E.md) | [#139](https://github.com/STERNYUL/AI_PLACE_MATE/issues/139) | `feature, frontend, client, performance, tracking, priority:high, phase-1` |

## `P2f-ux`

| 태스크 | 파일 | 이슈 | 라벨 |
| --- | --- | --- | --- |
| `UX-A` | [디자인 시스템 및 모바일 성능 가이드](UX-A.md) | [#140](https://github.com/STERNYUL/AI_PLACE_MATE/issues/140) | `design, ux, foundation, priority:high, phase-0, needs-pm-approval` |
| `UX-B` | [조건 입력 및 폴백 필터 설계](UX-B.md) | [#141](https://github.com/STERNYUL/AI_PLACE_MATE/issues/141) | `design, ux, priority:high, phase-1` |
| `UX-C` | [Top-3 카드 · 신선도 경고 · 근거 라이팅 가이드](UX-C.md) | [#142](https://github.com/STERNYUL/AI_PLACE_MATE/issues/142) | `design, ux, evidence, priority:high, phase-1, identity` |
| `UX-D` | [공유 카드 템플릿 및 신고 플로우](UX-D.md) | [#143](https://github.com/STERNYUL/AI_PLACE_MATE/issues/143) | `design, ux, evidence, priority:medium, phase-1` |
| `UX-E` | [예약·결제 플로우 및 옵트인 동의](UX-E.md) | [#144](https://github.com/STERNYUL/AI_PLACE_MATE/issues/144) | `design, ux, payment, privacy, priority:high, phase-1-late` |
| `UX-F` | [빈 화면 금지 상태 설계](UX-F.md) | [#145](https://github.com/STERNYUL/AI_PLACE_MATE/issues/145) | `design, ux, resilience, priority:high, phase-1` |

## `P2g-phase2`

| 태스크 | 파일 | 이슈 | 라벨 |
| --- | --- | --- | --- |
| `UX-G` | [대화방 및 제안 비교 화면 설계](UX-G.md) | [#146](https://github.com/STERNYUL/AI_PLACE_MATE/issues/146) | `design, ux, agent-room, priority:high, phase-2, conditional` |
| `UX-H` | [매장 콘솔 설계](UX-H.md) | [#147](https://github.com/STERNYUL/AI_PLACE_MATE/issues/147) | `design, ux, merchant, priority:high, phase-2, conditional` |
| `MCH-A` | [매장 프로필 및 수용 조건 매칭](MCH-A.md) | [#148](https://github.com/STERNYUL/AI_PLACE_MATE/issues/148) | `feature, backend, merchant-service, priority:high, phase-2, conditional, gateway` |
| `AGT-A` | [대화방 개시 및 소환](AGT-A.md) | [#149](https://github.com/STERNYUL/AI_PLACE_MATE/issues/149) | `feature, command, backend, agent-service, priority:high, phase-2, conditional` |
| `AGT-B` | [대화방 수명주기 및 단방향 채널](AGT-B.md) | [#150](https://github.com/STERNYUL/AI_PLACE_MATE/issues/150) | `feature, backend, agent-service, priority:high, phase-2, conditional` |
| `AGT-C` | [제안 등록 · 정렬 · 회귀 · 불이행 기록](AGT-C.md) | [#151](https://github.com/STERNYUL/AI_PLACE_MATE/issues/151) | `feature, command, backend, agent-service, evidence, priority:high, phase-2, conditional` |
| `CLI-F` | [대화방 및 제안 비교 화면](CLI-F.md) | [#152](https://github.com/STERNYUL/AI_PLACE_MATE/issues/152) | `feature, frontend, client, agent-room, priority:high, phase-2, conditional` |
| `CLI-G` | [매장 콘솔 화면](CLI-G.md) | [#153](https://github.com/STERNYUL/AI_PLACE_MATE/issues/153) | `feature, frontend, merchant, priority:high, phase-2, conditional` |

## `P3a-tests-search`

| 태스크 | 파일 | 이슈 | 라벨 |
| --- | --- | --- | --- |
| `TEST-001` | [색인·정규화 검증](TEST-001.md) | [#154](https://github.com/STERNYUL/AI_PLACE_MATE/issues/154) | `test, verification, indexing, priority:high, phase-0` |
| `TEST-002` | [가격 표기·예산 필터 검증](TEST-002.md) | [#155](https://github.com/STERNYUL/AI_PLACE_MATE/issues/155) | `test, verification, pricing, priority:high, phase-1` |
| `TEST-003` | [조건 필터 검증](TEST-003.md) | [#156](https://github.com/STERNYUL/AI_PLACE_MATE/issues/156) | `test, verification, search, priority:high, phase-1` |
| `TEST-004` | [메뉴 질의·유사 대체 검증](TEST-004.md) | [#157](https://github.com/STERNYUL/AI_PLACE_MATE/issues/157) | `test, verification, search, priority:high, phase-1` |
| `TEST-005` | [파싱·폴백·무조건 검색 검증](TEST-005.md) | [#158](https://github.com/STERNYUL/AI_PLACE_MATE/issues/158) | `test, verification, search, priority:high, phase-1` |

## `P3b-tests-evidence`

| 태스크 | 파일 | 이슈 | 라벨 |
| --- | --- | --- | --- |
| `TEST-006` | [근거 4항목 무결성 검증](TEST-006.md) | [#159](https://github.com/STERNYUL/AI_PLACE_MATE/issues/159) | `test, verification, evidence, priority:critical, phase-1, identity` |
| `TEST-007` | [신선도 경고 및 판정형 문구 검증](TEST-007.md) | [#160](https://github.com/STERNYUL/AI_PLACE_MATE/issues/160) | `test, verification, evidence, priority:critical, phase-1, identity` |
| `TEST-008` | [공유 카드·불일치 신고 검증](TEST-008.md) | [#161](https://github.com/STERNYUL/AI_PLACE_MATE/issues/161) | `test, verification, evidence, priority:high, phase-1` |
| `TEST-009` | [예약 승계·주문량 결제 검증](TEST-009.md) | [#162](https://github.com/STERNYUL/AI_PLACE_MATE/issues/162) | `test, verification, payment, priority:high, phase-1-late` |
| `TEST-010` | [취소·환불·노쇼 정산 검증](TEST-010.md) | [#163](https://github.com/STERNYUL/AI_PLACE_MATE/issues/163) | `test, verification, payment, priority:high, phase-1-late` |

## `P3c-tests-phase2-nf`

| 태스크 | 파일 | 이슈 | 라벨 |
| --- | --- | --- | --- |
| `TEST-011` | [콘솔 및 근거 없는 문구 차단 검증](TEST-011.md) | [#164](https://github.com/STERNYUL/AI_PLACE_MATE/issues/164) | `test, verification, merchant, priority:high, phase-2, conditional` |
| `TEST-012` | [소환·180초 마감·0건 회귀 검증](TEST-012.md) | [#165](https://github.com/STERNYUL/AI_PLACE_MATE/issues/165) | `test, verification, agent-room, priority:high, phase-2, conditional` |
| `TEST-013` | [제안 정렬·불이행 검증](TEST-013.md) | [#166](https://github.com/STERNYUL/AI_PLACE_MATE/issues/166) | `test, verification, agent-room, priority:high, phase-2, conditional` |
| `TEST-014` | [비기능 검증 스크립트](TEST-014.md) | [#167](https://github.com/STERNYUL/AI_PLACE_MATE/issues/167) | `test, verification, non-functional, priority:critical, phase-1, oversized` |

## `P4a-infra`

| 태스크 | 파일 | 이슈 | 라벨 |
| --- | --- | --- | --- |
| `IN-A` | [API Gateway 구축](IN-A.md) | [#168](https://github.com/STERNYUL/AI_PLACE_MATE/issues/168) | `infra, platform, priority:critical, phase-0, blocks-all` |
| `IN-B` | [보안 공통 계층](IN-B.md) | [#169](https://github.com/STERNYUL/AI_PLACE_MATE/issues/169) | `infra, security, priority:critical, phase-0` |
| `IN-C` | [관측성 계층](IN-C.md) | [#170](https://github.com/STERNYUL/AI_PLACE_MATE/issues/170) | `infra, observability, priority:critical, phase-0` |
| `IN-D` | [수평 확장 구성](IN-D.md) | [#171](https://github.com/STERNYUL/AI_PLACE_MATE/issues/171) | `infra, scalability, priority:high, phase-1` |
| `IN-E` | [이중화·장애 복구 및 백업](IN-E.md) | [#172](https://github.com/STERNYUL/AI_PLACE_MATE/issues/172) | `infra, reliability, priority:high, phase-1` |
| `IN-F` | [캐시 계층 및 파티셔닝](IN-F.md) | [#173](https://github.com/STERNYUL/AI_PLACE_MATE/issues/173) | `infra, data, performance, priority:high, phase-0` |
| `IN-G` | [부하 테스트 환경](IN-G.md) | [#174](https://github.com/STERNYUL/AI_PLACE_MATE/issues/174) | `infra, verification, priority:high, phase-1, early-start` |
