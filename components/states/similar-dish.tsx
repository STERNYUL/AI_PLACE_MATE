import { StatePanel } from '@/components/state-panel'

/**
 * 유사메뉴대체 — 색인 미등재 (REQ-FUNC-007).
 *
 * 대체했다는 사실을 문구로 명시한다. 말없이 바꾸면 사용자는 요청한 메뉴를 찾은 줄로 읽는다.
 * 정규화가 확신하지 못한 표기는 원문을 그대로 두므로(S3-T7), 여기서 바뀐 것은 '질의 메뉴'가
 * 아니라 '무엇으로 찾았는지'다.
 */
export function SimilarDishStatePanel({
  requestedDish,
  substitutedDish,
}: {
  requestedDish: string
  substitutedDish: string
}) {
  return (
    <StatePanel
      stateName="유사메뉴대체"
      headline={`'${requestedDish}' 대신 '${substitutedDish}'로 찾았다`}
      detail={`'${requestedDish}'는 색인에 아직 없다. 아래 결과는 대체 메뉴 기준이다.`}
      nextAction={`'${requestedDish}' 그대로 다시 찾기`}
    >
      <div className="flex items-center gap-2 rounded-card border border-line bg-canvas px-3 py-2.5 text-sm">
        <span className="text-ink-faint line-through">{requestedDish}</span>
        <span className="text-ink-faint">→</span>
        <span className="font-semibold text-ink">{substitutedDish}</span>
      </div>
    </StatePanel>
  )
}
