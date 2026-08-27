import { Badge } from '@/components/ui/badge'

/**
 * 열화 상태의 공통 껍데기 — 6상태가 전부 이것을 쓴다 (REQ-IMPL-013 · 규칙 2).
 *
 * 상태마다 반드시 있어야 하는 것이 셋이다: 무슨 상태인지 · 무엇이 일어났는지 ·
 * 다음에 무엇을 할 수 있는지. 셋째가 빠지면 화면이 비지 않아도 막다른 길이 된다.
 */
export function StatePanel({
  stateName,
  headline,
  detail,
  nextAction,
  tone = 'notice',
  children,
}: {
  stateName: string
  headline: string
  detail: string
  nextAction: string
  tone?: 'notice' | 'warn'
  children?: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-3 rounded-card border border-line bg-surface p-4">
      <Badge tone={tone}>{stateName}</Badge>

      <div className="flex flex-col gap-1">
        <p className="text-base leading-tight font-semibold">{headline}</p>
        <p className="text-sm leading-relaxed text-ink-muted">{detail}</p>
      </div>

      {children}

      <button
        type="button"
        className="w-full rounded-card bg-ink px-4 py-2.5 text-sm font-semibold text-surface"
      >
        {nextAction}
      </button>
    </section>
  )
}
