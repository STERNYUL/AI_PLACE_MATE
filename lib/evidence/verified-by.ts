import type { VerifiedBy } from '@/types/draft'

/**
 * 확인 주체 열거값 → 표시명 (Grill S3-T2).
 *
 * 표시 문구를 스키마에 넣지 않는 이유는 둘이다 — 자유 텍스트면 확인 주체 사칭을
 * 스키마가 막지 못하고, 판정형 어휘 검사가 DB 값까지 쫓아가야 한다.
 * 네 경로(콘솔 저장·초기 적재·재확인·운영 수정)가 이 한 곳을 통과한다.
 */
const VERIFIED_BY_LABEL: Record<VerifiedBy, string> = {
  MERCHANT: '매장 확인',
  INTERNAL_SURVEY: '내부 조사',
  USER_REPORT: '신고 경유 재확인',
  OPERATOR: '운영 수정',
}

export function verificationSubjectLabel(subject: VerifiedBy): string {
  return VERIFIED_BY_LABEL[subject]
}
