import type {
  EvidenceItemKey,
  GateOutcome,
  IncomingCandidate,
  WireCandidate,
} from '@/types/draft'

/**
 * 근거 게이트 — 불변 규칙 1 · REQ-IMPL-010.
 *
 * 정렬보다 앞에 둔다. 서버 게이트(EVD-A)가 도착한 뒤에도 이중 방어선으로 남는다.
 * 통과분만 반환한다 — 3 은 상한이지 채워야 할 수가 아니다 (S2-T3).
 */

export const EVIDENCE_ITEM_LABEL: Record<EvidenceItemKey, string> = {
  selectionReason: '선정 이유',
  evidenceAttribute: '근거 속성',
  verifiedAt: '확인 일자',
  verifiedBy: '확인 주체',
}

/** 4항목을 동등하게 검사한다. 항목명을 남기지 않으면 3개만 검사하는 실수가 드러나지 않는다 (S2-T10) */
function findMissingItems(input: IncomingCandidate): EvidenceItemKey[] {
  const missing: EvidenceItemKey[] = []

  if (!input.selectionReason) missing.push('selectionReason')
  if (!input.contextAttributes?.length) missing.push('evidenceAttribute')
  if (!input.verifiedAt) missing.push('verifiedAt')
  if (!input.verifiedBy) missing.push('verifiedBy')

  return missing
}

function hasCompleteEvidence(input: IncomingCandidate): input is IncomingCandidate & WireCandidate {
  return findMissingItems(input).length === 0
}

export function applyEvidenceGate(input: IncomingCandidate): GateOutcome {
  // S2-T2: RECHECK_REQUIRED 는 STALE 과 성격이 다르다. STALE 은 시간이 지난 것이고
  // 이쪽은 사용자가 틀렸다고 신고한 것이다 — 재확인 전 노출은 규칙 1 위반이다
  if (input.recheckRequired) {
    return { admitted: false, reason: 'RECHECK_REQUIRED', missingItems: [] }
  }

  if (!hasCompleteEvidence(input)) {
    return { admitted: false, reason: 'EVIDENCE_MISSING', missingItems: findMissingItems(input) }
  }

  return { admitted: true, candidate: input }
}

export type ExcludedEntry = {
  id: string
  name: string
  missingItems: EvidenceItemKey[]
}

export type GateSummary = {
  admitted: WireCandidate[]
  excludedByEvidence: ExcludedEntry[]
  excludedByRecheck: ExcludedEntry[]
}

/** 모집단 전체를 통과시킨다. 제외 사유마다 나눠 담는다 — 화면 카피가 사유에 따라 달라진다 */
export function runEvidenceGate(population: IncomingCandidate[]): GateSummary {
  const summary: GateSummary = { admitted: [], excludedByEvidence: [], excludedByRecheck: [] }

  for (const input of population) {
    const outcome = applyEvidenceGate(input)

    if (outcome.admitted) {
      summary.admitted.push(outcome.candidate)
      continue
    }

    const entry: ExcludedEntry = {
      id: input.id,
      name: input.name,
      missingItems: outcome.missingItems,
    }

    if (outcome.reason === 'RECHECK_REQUIRED') summary.excludedByRecheck.push(entry)
    else summary.excludedByEvidence.push(entry)
  }

  return summary
}
