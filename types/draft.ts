/*
 * DRAFT: SPEC-008 확정 시 교체 — 잠정 타입은 이 파일 하나로 격리한다 (Grill S1-T3).
 *
 * 계약(SPEC-001·002·008)이 확정되면 이 파일만 교체된다. wire 표기가 바뀌어도
 * 컴포넌트는 흔들리지 않는다 — 변환은 lib/search/client.ts 단일 함수에서만 한다.
 */

/** S3-T2: 확인 주체는 열거형 4종. 자유 텍스트면 스키마가 사칭을 막지 못한다 */
export type VerifiedBy = 'MERCHANT' | 'INTERNAL_SURVEY' | 'USER_REPORT' | 'OPERATOR'

/** S3-T3: 세 값 모두 NOT NULL. 단일 가격이면 셋이 같다. 축약은 lib/search/format.ts */
export type PriceRange = { min: number; avg: number; max: number }

/** 근거 속성 — Attribute.name · value (S2-T5) */
export type EvidenceAttribute = { name: string; value: string }

/**
 * 응답 후보 항목 — SRS §3.1.2 여섯 항목이 JSON 키 7개로 펼쳐진 형상 (S2-T4).
 * name 은 여섯 항목 밖의 식별 표시다. 여기에 질의 결과 전체의 속성을 넣지 않는다.
 */
export type WireCandidate = {
  id: string
  name: string
  priceRange: PriceRange
  signatureDish: string
  contextAttributes: EvidenceAttribute[]
  /** 파생값 — EVD-B 가 매 응답 생성한다. 저장 대상이 아니다 (S2-T5) */
  selectionReason: string
  /** S2-T6: 상태가 아니라 일자를 싣는다. 판정은 수신 시점에 freshness.ts 가 한다 */
  verifiedAt: string
  verifiedBy: VerifiedBy
}

/** 응답 최상위 — 후보 하나의 속성이 아니라 질의 결과 전체의 속성이다 (S2-T4) */
export type QueryResponse = {
  candidates: WireCandidate[]
  /** S2-T8: 파싱 실패는 오류가 아니라 200 + 이 신호다. 422 를 만들지 않는다 */
  fallbackApplied: boolean
  overBudgetCount: number
  substitutedDish: string | null
  /** S2-T3: 3 은 상한이다. 3 개가 아닌 이유를 화면이 이 둘로 고지한다 */
  excludedByEvidence: number
  excludedByRecheck: number
}

/** 근거 4항목이 대응하는 wire 키. 게이트가 검사하는 대상이 이 넷뿐이다 */
type EvidenceBearingKey = 'selectionReason' | 'contextAttributes' | 'verifiedAt' | 'verifiedBy'

/**
 * 게이트 입력 — 정렬 이전 모집단.
 *
 * 근거 4항목만 결락될 수 있다. 인당가·대표 메뉴 같은 필수 필드가 빠진 레코드는
 * 애초에 색인에 적재되지 않는다 (S3-T8 — 결락은 거부한다. 채우려 기준을 낮추지 않는다).
 * recheckRequired 는 Verification 3상태 중 RECHECK_REQUIRED 를 뜻한다 (S2-T2).
 */
export type IncomingCandidate = Omit<WireCandidate, EvidenceBearingKey> &
  Partial<Pick<WireCandidate, EvidenceBearingKey>> & { recheckRequired?: boolean }

export type EvidenceItemKey = 'selectionReason' | 'evidenceAttribute' | 'verifiedAt' | 'verifiedBy'

export type GateOutcome =
  | { admitted: true; candidate: WireCandidate }
  | { admitted: false; reason: 'EVIDENCE_MISSING'; missingItems: EvidenceItemKey[] }
  | { admitted: false; reason: 'RECHECK_REQUIRED'; missingItems: [] }

/** 신선도 판정 결과 — lib/evidence/freshness.ts 만 만든다 (S2-T6) */
export type FreshnessResult = {
  elapsedDays: number
  thresholdDays: number
  isStale: boolean
}

/**
 * 카드가 받는 형상. wire 가 아니다 — 컴포넌트는 wire 를 직접 읽지 않는다 (S1-T3).
 * 근거 4항목이 필수라 옵셔널이 하나도 없다: 빠진 후보는 게이트가 이미 걸렀다.
 */
export type CandidateView = {
  id: string
  name: string
  priceLabel: string
  signatureDish: string
  selectionReason: string
  evidenceAttribute: EvidenceAttribute[]
  verifiedAt: string
  verifiedBy: VerifiedBy
  freshness: FreshnessResult
}

/** 조건 입력 파싱 결과 — 부분 파싱이면 채워지지 않은 슬롯이 null 로 남는다 */
export type ParsedCondition = {
  budgetPerPerson: number | null
  partySize: number | null
  dish: string | null
  contexts: string[]
}
