import { StatePanel } from '@/components/state-panel'

/**
 * 폴백표시 — AI 파싱 실패·시한 초과 (REQ-FUNC-009).
 *
 * 파싱 실패는 오류가 아니라 정상 경로의 분기다 (S2-T8 — 422 를 만들지 않는다).
 * 그래서 Top-3 는 계속 표시되고, 화면이 하는 일은 '무엇으로 찾았는지'를 고지하는 것뿐이다.
 */
export function FallbackNoticeStatePanel({ filters }: { filters: string[] }) {
  return (
    <StatePanel
      stateName="폴백표시"
      headline="문장 대신 아래 조건으로 찾았다"
      detail="입력한 문장을 조건으로 옮기지 못했다. 아래 조건은 그대로 쓰였고 결과도 그대로 있다."
      nextAction="조건 고쳐서 다시 찾기"
    >
      <ul className="flex flex-wrap gap-1.5">
        {filters.map((filter) => (
          <li
            key={filter}
            className="rounded-chip border border-notice-line bg-notice-soft px-2.5 py-1 text-xs font-medium text-notice"
          >
            {filter}
          </li>
        ))}
      </ul>
    </StatePanel>
  )
}
