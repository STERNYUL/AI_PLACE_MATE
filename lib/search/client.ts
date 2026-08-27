import { evaluateFreshness } from '@/lib/evidence/freshness'
import { formatPriceRange } from '@/lib/search/format'
import type { CandidateView, WireCandidate } from '@/types/draft'

/**
 * wire → 카드 props 변환의 단일 지점 (Grill S1-T3).
 *
 * 컴포넌트가 wire 형식을 직접 읽지 않게 하는 것이 목적이다. 계약(SPEC-001)이 어느 표기로
 * 확정되든 고치는 곳은 이 함수 하나다.
 *
 * receivedAt 을 인자로 받는 이유 — 신선도는 수신 시점 판정이고(S2-T6), 그 시점을 여기서
 * 만들어 버리면 화면이 같은 응답을 서로 다른 기준으로 렌더한다.
 */
export function toCandidateView(candidate: WireCandidate, receivedAt: Date): CandidateView {
  return {
    id: candidate.id,
    name: candidate.name,
    priceLabel: formatPriceRange(candidate.priceRange),
    signatureDish: candidate.signatureDish,
    selectionReason: candidate.selectionReason,
    evidenceAttribute: candidate.contextAttributes,
    verifiedAt: candidate.verifiedAt,
    verifiedBy: candidate.verifiedBy,
    freshness: evaluateFreshness(candidate.verifiedAt, receivedAt),
  }
}

/** 순서를 바꾸지 않는다 — 노출 순서는 적합도 정렬의 결과이지 표시 계층이 정할 것이 아니다 */
export function toCandidateViews(candidates: WireCandidate[], receivedAt: Date): CandidateView[] {
  return candidates.map((candidate) => toCandidateView(candidate, receivedAt))
}
