import { CandidateFacts } from '@/components/candidate-facts'
import { StatePanel } from '@/components/state-panel'
import { VerificationTrace } from '@/components/verification-trace'
import type { CandidateView } from '@/types/draft'

/**
 * 근거대기 — 근거 문장 스트림 지연 (REQ-IMPL-015).
 *
 * 카드 골격과 사실 값은 이미 있다. 비는 것은 문장 한 줄뿐이므로 그 자리만 로딩으로 둔다.
 * p95 초과도 여기로 온다 — 목표 초과는 실패가 아니라서 응답을 버리지 않는다 (S2-T11).
 */
export function EvidencePendingStatePanel({ candidate }: { candidate: CandidateView }) {
  return (
    <StatePanel
      stateName="근거대기"
      headline="선정 이유 문장을 기다리는 중이다"
      detail="사실 값과 확인 정보는 이미 도착했다. 문장만 아직이다."
      nextAction="문장 없이 사실만 보기"
    >
      <div className="flex flex-col gap-3 rounded-card border border-line bg-canvas p-3">
        <CandidateFacts
          name={candidate.name}
          priceLabel={candidate.priceLabel}
          signatureDish={candidate.signatureDish}
          attributes={candidate.evidenceAttribute}
        />

        <div className="flex flex-col gap-1.5" aria-label="선정 이유 문장 대기 중">
          <span className="h-3 w-full animate-pulse rounded-chip bg-line" />
          <span className="h-3 w-2/3 animate-pulse rounded-chip bg-line" />
        </div>

        <VerificationTrace
          verifiedAt={candidate.verifiedAt}
          verifiedBy={candidate.verifiedBy}
          freshness={candidate.freshness}
        />
      </div>
    </StatePanel>
  )
}
