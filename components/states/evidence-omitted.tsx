import { CandidateFacts } from '@/components/candidate-facts'
import { StatePanel } from '@/components/state-panel'
import { VerificationTrace } from '@/components/verification-trace'
import type { CandidateView } from '@/types/draft'

/**
 * 근거생략 — 근거 문장 스트림 실패 (REQ-FUNC-010).
 *
 * 카드를 숨기지 않는다. 규칙 1 이 요구하는 4항목 중 사실 3항목은 그대로 있고,
 * 선정 이유는 규칙 기반 기본 문구로 채운다. AI 실패가 카드 소멸로 이어지지 않게 하는 것이
 * 설계 의도다.
 */
export function EvidenceOmittedStatePanel({
  candidate,
  ruleBasedReason,
}: {
  candidate: CandidateView
  ruleBasedReason: string
}) {
  return (
    <StatePanel
      stateName="근거생략"
      headline="선정 이유 문장 대신 조건 대조만 적었다"
      detail="문장 생성이 끝나지 않았다. 사실 값과 확인 정보는 그대로 있다."
      nextAction="이 조건으로 다시 찾기"
    >
      <div className="flex flex-col gap-3 rounded-card border border-line bg-canvas p-3">
        <CandidateFacts
          name={candidate.name}
          priceLabel={candidate.priceLabel}
          signatureDish={candidate.signatureDish}
          attributes={candidate.evidenceAttribute}
        />

        <p className="text-sm leading-relaxed text-ink-muted">{ruleBasedReason}</p>

        <VerificationTrace
          verifiedAt={candidate.verifiedAt}
          verifiedBy={candidate.verifiedBy}
          freshness={candidate.freshness}
        />
      </div>
    </StatePanel>
  )
}
