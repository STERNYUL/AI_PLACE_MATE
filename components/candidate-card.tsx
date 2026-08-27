import { CandidateFacts } from '@/components/candidate-facts'
import { FreshnessWarning } from '@/components/freshness-note'
import { Card } from '@/components/ui/card'
import { VerificationTrace } from '@/components/verification-trace'
import type { CandidateView } from '@/types/draft'

/**
 * Top-3 후보 카드.
 *
 * 근거 4항목(선정 이유 · 근거 속성 · 확인 일자 · 확인 주체)이 필수 props 다 — 넷 중 하나도
 * 옵셔널이 아닌 것이 불변 규칙 1 의 구현이다. 빠진 후보는 게이트가 정렬 이전에 이미
 * 걸렀으므로 여기까지 오지 않는다 (REQ-IMPL-010).
 *
 * wire 형식을 직접 읽지 않는다. 변환은 lib/search/client.ts 한 곳이다 (Grill S1-T3).
 */
export function CandidateCard({ candidate }: { candidate: CandidateView }) {
  return (
    <Card>
      <FreshnessWarning freshness={candidate.freshness} />

      <CandidateFacts
        name={candidate.name}
        priceLabel={candidate.priceLabel}
        signatureDish={candidate.signatureDish}
        attributes={candidate.evidenceAttribute}
      />

      <p className="text-sm leading-relaxed text-ink">{candidate.selectionReason}</p>

      <VerificationTrace
        verifiedAt={candidate.verifiedAt}
        verifiedBy={candidate.verifiedBy}
        freshness={candidate.freshness}
      />
    </Card>
  )
}
