import { StatePanel } from '@/components/state-panel'

/**
 * 제안없음 — 유효 제안 0건 (REQ-FUNC-025).
 *
 * 빈 제안 화면 대신 '제안 없는 Top-3'로 돌아간다. 근거 게이트 통과분이 0곳인 경우도
 * 여기로 온다 (S2-T3 — 3 은 상한이다).
 *
 * relaxedConditions 유무가 §5 #6 판정 대상이다 — 조건 완화안을 화면이 먼저 내밀 것인가,
 * 아니면 무엇이 걸렸는지만 알리고 사용자가 고르게 할 것인가.
 */
export function NoProposalStatePanel({
  blockedBy,
  relaxedConditions,
}: {
  blockedBy: string
  relaxedConditions?: string[]
}) {
  const offersRelaxation = Boolean(relaxedConditions?.length)

  return (
    <StatePanel
      stateName="제안없음"
      headline="이 조건을 전부 만족하는 곳이 없다"
      detail={`${blockedBy} 조건에서 후보가 0곳이 됐다. 조건을 뺀 결과는 아래에서 볼 수 있다.`}
      nextAction={offersRelaxation ? '완화한 조건으로 다시 찾기' : '조건 없이 Top-3 보기'}
    >
      {offersRelaxation ? (
        <ul className="flex flex-col gap-1.5">
          {relaxedConditions?.map((condition) => (
            <li
              key={condition}
              className="rounded-card border border-notice-line bg-notice-soft px-3 py-2 text-sm text-notice"
            >
              {condition}
            </li>
          ))}
        </ul>
      ) : (
        <p className="rounded-card border border-line bg-canvas px-3 py-2 text-sm text-ink-muted">
          걸린 조건은 {blockedBy} 하나다. 무엇을 뺄지는 고르는 쪽이 정한다.
        </p>
      )}
    </StatePanel>
  )
}
