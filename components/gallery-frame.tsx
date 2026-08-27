import { Badge } from '@/components/ui/badge'

/**
 * 갤러리 뼈대 — 13상태를 한 페이지에 세로로 나열하기 위한 틀 (Grill S1-T5).
 *
 * 화면별 라우트를 만들지 않는 이유는 신선도 경고가 묻히는지(§5 #3)를 나란히 놓고 봐야
 * 판정되기 때문이다. 라우트로 쪼개면 그 비교 자체가 불가능해진다.
 */

export function GallerySection({
  index,
  title,
  stateCount,
  purpose,
  children,
}: {
  index: number
  title: string
  stateCount: number
  purpose: string
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-4">
      <header className="flex flex-col gap-1.5 border-t-2 border-ink pt-3">
        <div className="flex items-baseline justify-between gap-2">
          <h2 className="text-lg font-bold">
            화면 {index} · {title}
          </h2>
          <span className="text-xs text-ink-faint">{stateCount}상태</span>
        </div>
        <p className="text-sm leading-relaxed text-ink-muted">{purpose}</p>
      </header>

      {children}
    </section>
  )
}

export function StateBlock({
  code,
  name,
  note,
  children,
}: {
  code: string
  name: string
  note?: string
  children: React.ReactNode
}) {
  return (
    <article className="flex flex-col gap-2.5">
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="rounded-chip bg-ink px-2 py-0.5 text-xs font-bold text-surface">{code}</span>
        <h3 className="text-sm font-semibold">{name}</h3>
      </div>

      {note ? <p className="text-xs leading-relaxed text-ink-faint">{note}</p> : null}

      {children}
    </article>
  )
}

/**
 * 게이트 통과 건수 고지 — S2-T3·T4.
 *
 * 3 은 상한이다. 3곳이 아닐 때 화면이 답해야 하는 것은 '왜 적은가'이고, 그 답이
 * 제외 사유 둘로 나뉜다.
 */
export function ResultSummary({
  admittedCount,
  excludedByEvidence,
  excludedByRecheck,
}: {
  admittedCount: number
  excludedByEvidence: number
  excludedByRecheck: number
}) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-card border border-line bg-surface px-3 py-2.5">
      <Badge tone="fact">통과 {admittedCount}곳</Badge>
      <Badge tone="halt">근거 누락 {excludedByEvidence}곳</Badge>
      <Badge tone="halt">재확인 대기 {excludedByRecheck}곳</Badge>
      <span className="text-xs text-ink-faint">3은 상한이다 — 통과분만 나온다</span>
    </div>
  )
}
