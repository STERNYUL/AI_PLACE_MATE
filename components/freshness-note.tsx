import type { FreshnessResult } from '@/types/draft'

/**
 * 신선도 표기 — 시각 위계가 이 스파이크의 판정 대상이다 (§5 #3).
 *
 * 날짜를 여기서 계산하지 않는다. 판정은 lib/evidence/freshness.ts 한 곳이 하고
 * 이 컴포넌트는 그 결과만 그린다 (Grill S2-T6).
 */

/** 임계를 넘은 경우에만 나온다. 카드 위쪽 띠라 목록에서 훑어도 걸린다 */
export function FreshnessWarning({ freshness }: { freshness: FreshnessResult }) {
  if (!freshness.isStale) return null

  return (
    <p className="-mx-4 -mt-4 rounded-t-card border-b border-warn-line bg-warn-soft px-4 py-2 text-sm font-semibold text-warn">
      확인 후 {freshness.elapsedDays}일 경과 · {freshness.thresholdDays}일 임계를 넘었다
    </p>
  )
}

/** 임계 안이든 밖이든 항상 나오는 경과 표기. 경고와 달리 사실 값 톤이다 */
export function FreshnessTrace({ freshness }: { freshness: FreshnessResult }) {
  return <span className="text-xs text-ink-faint">{freshness.elapsedDays}일 경과</span>
}
