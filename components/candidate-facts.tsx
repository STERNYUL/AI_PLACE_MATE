import { Badge } from '@/components/ui/badge'
import type { EvidenceAttribute } from '@/types/draft'

/**
 * 후보의 사실 값 블록 — 매장 표기 · 인당 예상가 · 대표 메뉴 · 근거 속성.
 *
 * 근거 문장이 없는 상태(근거대기·근거생략)도 이 블록은 그대로 보인다.
 * 문장 생성 실패가 카드 소멸로 이어지지 않게 하는 것이 설계 의도다 (REQ-FUNC-010).
 */
export function CandidateFacts({
  name,
  priceLabel,
  signatureDish,
  attributes,
}: {
  name: string
  priceLabel: string
  signatureDish: string
  attributes: EvidenceAttribute[]
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <p className="text-base leading-tight font-semibold">{name}</p>
        <Badge tone="fact">{priceLabel}</Badge>
      </div>

      <p className="text-sm text-ink-muted">대표 메뉴 · {signatureDish}</p>

      <dl className="flex flex-col gap-1 border-t border-line pt-3">
        {attributes.map((attribute) => (
          <div key={attribute.name} className="flex gap-3 text-sm">
            <dt className="w-16 shrink-0 text-ink-faint">{attribute.name}</dt>
            <dd className="text-ink">{attribute.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  )
}
