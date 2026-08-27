import { StatePanel } from '@/components/state-panel'

/**
 * 재시도안내 — DB·PG 오류 (SRS §8.3 규칙 5).
 *
 * 사유와 재시도 수단을 함께 준다. 외부로 유통되는 산출물(공유 카드 이미지)의 실패도
 * 여기로 온다 — 부분 성공을 내보내지 않기 때문이다 (S2-T11).
 */
export function RetryGuideStatePanel({ reason, requestId }: { reason: string; requestId: string }) {
  return (
    <StatePanel
      stateName="재시도안내"
      headline="결과를 가져오지 못했다"
      detail={`${reason} 입력한 조건은 그대로 남아 있다.`}
      nextAction="다시 시도"
      tone="warn"
    >
      <p className="rounded-card border border-line bg-canvas px-3 py-2 font-mono text-xs text-ink-faint">
        요청 번호 {requestId}
      </p>
    </StatePanel>
  )
}
