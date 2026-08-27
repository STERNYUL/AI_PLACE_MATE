import type { FreshnessResult } from '@/types/draft'

/**
 * 신선도 판정의 단일 원천 (Grill S2-T6).
 *
 * 서버·클라이언트가 이 함수만 호출한다. 각자 날짜를 계산하면 90일 경계가 한쪽에서 갈린다.
 * 캐시 TTL 6h 구간 안에서 경과가 일어나므로 응답에 실린 상태가 아니라
 * 수신 시점의 verifiedAt 으로 매번 다시 판정한다.
 */

// REQ-FUNC-011: 신선도 임계 90일
export const FRESHNESS_THRESHOLD_DAYS = 90

const MS_PER_DAY = 24 * 60 * 60 * 1000

/** 시각 성분을 버리고 날짜만 남긴다 — 같은 날 안에서 경과일이 흔들리지 않게 한다 */
function toUtcDayIndex(value: Date): number {
  return Math.floor(Date.UTC(value.getFullYear(), value.getMonth(), value.getDate()) / MS_PER_DAY)
}

function parseIsoDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(year, (month ?? 1) - 1, day ?? 1)
}

export function evaluateFreshness(verifiedAt: string, receivedAt: Date): FreshnessResult {
  const elapsedDays = toUtcDayIndex(receivedAt) - toUtcDayIndex(parseIsoDate(verifiedAt))

  return {
    elapsedDays,
    thresholdDays: FRESHNESS_THRESHOLD_DAYS,
    // Grill S2-T1: 임계값은 경계를 포함한다 — 90일 당일부터 경고를 붙인다
    isStale: elapsedDays >= FRESHNESS_THRESHOLD_DAYS,
  }
}
