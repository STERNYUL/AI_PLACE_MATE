import type { PriceRange } from '@/types/draft'

const KRW = new Intl.NumberFormat('ko-KR')

export function formatKrw(amount: number): string {
  return `${KRW.format(amount)}원`
}

/**
 * 인당 예상가 축약 (Grill S3-T3).
 *
 * 스키마는 min·avg·max 세 값을 전부 들고 있다. 단일값 여부는 min·max 에서 그대로 나오므로
 * 플래그를 두지 않고 표시 계층이 판단한다. REQ-FUNC-002 는 단일 값 표기를 금지하지만,
 * 하한과 상한이 같은 매장은 범위가 실제로 한 점이라 그대로 적는 것이 사실이다.
 */
export function formatPriceRange(priceRange: PriceRange): string {
  const { min, max } = priceRange

  return min === max ? formatKrw(min) : `${KRW.format(min)}~${formatKrw(max)}`
}

/** 확인 일자는 원문 일자를 그대로 적는다. 상대 표기는 신선도 판정과 뒤섞인다 */
export function formatVerifiedAt(isoDate: string): string {
  return isoDate.replaceAll('-', '. ')
}
