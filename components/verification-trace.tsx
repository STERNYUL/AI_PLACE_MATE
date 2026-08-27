import { FreshnessTrace } from '@/components/freshness-note'
import { verificationSubjectLabel } from '@/lib/evidence/verified-by'
import { formatVerifiedAt } from '@/lib/search/format'
import type { FreshnessResult, VerifiedBy } from '@/types/draft'

/**
 * 확인 일자 · 확인 주체 표기 — 근거 4항목 중 둘.
 *
 * 근거 문장이 없는 상태(근거대기·근거생략)에도 이 표기는 남는다. 문장이 사라져도
 * 사실 값과 출처는 그대로 있어야 규칙 1 이 성립한다.
 */
export function VerificationTrace({
  verifiedAt,
  verifiedBy,
  freshness,
}: {
  verifiedAt: string
  verifiedBy: VerifiedBy
  freshness: FreshnessResult
}) {
  return (
    <div className="flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3">
      <span className="text-xs text-ink-muted">
        확인 {formatVerifiedAt(verifiedAt)} · {verificationSubjectLabel(verifiedBy)}
      </span>
      <FreshnessTrace freshness={freshness} />
    </div>
  )
}
