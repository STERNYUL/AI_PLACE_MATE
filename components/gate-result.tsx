import { Badge } from '@/components/ui/badge'
import { EVIDENCE_ITEM_LABEL, type ExcludedEntry } from '@/lib/evidence/gate'

/**
 * 게이트 결과 패널 — 제외 2종 (Grill S4-T1).
 *
 * 제외된 후보를 카드로 그리지 않는다. 카드는 '반환된 후보'의 형식이고 이들은 반환되지 않았다.
 * 그러나 3곳이 안 되는 이유는 화면이 사실로 고지해야 하므로(S2-T3·T4) 사유를 나눠 보여준다.
 */

const COPY = {
  EVIDENCE_MISSING: {
    badge: '제외 · 근거 누락',
    headline: '근거 4항목이 채워지지 않아 후보에서 빠졌다',
    detail: '근거 게이트는 정렬보다 앞에 있다. 3곳을 채우려고 기준을 낮추지 않는다.',
  },
  RECHECK_REQUIRED: {
    badge: '제외 · 재확인 대기',
    headline: '불일치 신고가 접수돼 재확인 전까지 빠졌다',
    detail: '확인 일자가 오래된 것과는 다른 상태다. 재확인이 끝나면 다시 후보에 든다.',
  },
} as const

export function GateResult({
  reason,
  entries,
}: {
  reason: keyof typeof COPY
  entries: ExcludedEntry[]
}) {
  const copy = COPY[reason]

  return (
    <section className="flex flex-col gap-3 rounded-card border border-halt-line bg-halt-soft p-4">
      <div className="flex items-center justify-between gap-2">
        <Badge tone="halt">{copy.badge}</Badge>
        <span className="text-xs font-medium text-halt">{entries.length}곳</span>
      </div>

      <div className="flex flex-col gap-1">
        <p className="text-sm leading-tight font-semibold text-halt">{copy.headline}</p>
        <p className="text-sm leading-relaxed text-ink-muted">{copy.detail}</p>
      </div>

      <ul className="flex flex-col gap-1.5 border-t border-halt-line pt-3">
        {entries.map((entry) => (
          <li key={entry.id} className="flex flex-wrap items-center gap-2 text-sm">
            <span className="text-ink">{entry.name}</span>
            {entry.missingItems.map((item) => (
              <span
                key={item}
                className="rounded-chip border border-halt-line bg-surface px-2 py-0.5 text-xs text-halt"
              >
                {EVIDENCE_ITEM_LABEL[item]} 없음
              </span>
            ))}
          </li>
        ))}
      </ul>
    </section>
  )
}
