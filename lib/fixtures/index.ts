import { z } from 'zod'

import evidenceMissingJson from '@/lib/fixtures/evidence-missing.json'
import freshnessJson from '@/lib/fixtures/freshness.json'
import queryInputJson from '@/lib/fixtures/query-input.json'
import top3Json from '@/lib/fixtures/top3.json'
import type { IncomingCandidate, ParsedCondition, QueryResponse } from '@/types/draft'

/**
 * fixture 로더 — MOCK-002~004 이관 후 이 디렉터리와 함께 삭제된다 (Grill S1-T2 §7.1).
 *
 * JSON 을 타입 단언으로 통과시키지 않는다. 형상이 어긋나면 빌드가 아니라 이 자리에서 깨져야
 * 어긋난 fixture 가 화면까지 올라가지 않는다.
 */

const verificationSubjectSchema = z.enum(['MERCHANT', 'INTERNAL_SURVEY', 'USER_REPORT', 'OPERATOR'])

const priceRangeSchema = z.object({ min: z.number(), avg: z.number(), max: z.number() })

const attributeSchema = z.object({ name: z.string(), value: z.string() })

const wireCandidateSchema = z.object({
  id: z.string(),
  name: z.string(),
  priceRange: priceRangeSchema,
  signatureDish: z.string(),
  contextAttributes: z.array(attributeSchema),
  selectionReason: z.string(),
  verifiedAt: z.string(),
  verifiedBy: verificationSubjectSchema,
})

/** 게이트 입력은 근거 4항목만 결락될 수 있다 (S3-T8) */
const incomingCandidateSchema = z.object({
  id: z.string(),
  name: z.string(),
  priceRange: priceRangeSchema,
  signatureDish: z.string(),
  contextAttributes: z.array(attributeSchema).optional(),
  selectionReason: z.string().optional(),
  verifiedAt: z.string().optional(),
  verifiedBy: verificationSubjectSchema.optional(),
  recheckRequired: z.boolean().optional(),
})

export const queryResponseSchema = z.object({
  candidates: z.array(wireCandidateSchema),
  fallbackApplied: z.boolean(),
  overBudgetCount: z.number(),
  substitutedDish: z.string().nullable(),
  excludedByEvidence: z.number(),
  excludedByRecheck: z.number(),
})

const evidenceMissingSchema = z.object({
  cases: z.array(z.object({ missing: z.string(), candidate: incomingCandidateSchema })),
  recheck: z.array(incomingCandidateSchema),
})

const freshnessSchema = z.object({
  referenceNow: z.string(),
  samples: z.array(z.object({ label: z.string(), candidate: wireCandidateSchema })),
})

const conditionSchema = z.object({
  budgetPerPerson: z.number().nullable(),
  partySize: z.number().nullable(),
  dish: z.string().nullable(),
  contexts: z.array(z.string()),
})

const queryInputSchema = z.object({
  placeholder: z.string(),
  examples: z.array(z.string()),
  parsed: z.object({ rawText: z.string(), condition: conditionSchema }),
  partial: z.object({ rawText: z.string(), condition: conditionSchema }),
})

export const top3Fixture: QueryResponse = queryResponseSchema.parse(top3Json)

export const evidenceMissingFixture = evidenceMissingSchema.parse(evidenceMissingJson)

export const freshnessFixture = freshnessSchema.parse(freshnessJson)

export const queryInputFixture = queryInputSchema.parse(queryInputJson)

/** 게이트에 넣을 모집단 — 통과 3곳 + 근거 누락 4곳 + 재확인 대기 1곳 */
export const gatePopulationFixture: IncomingCandidate[] = [
  ...top3Fixture.candidates,
  ...evidenceMissingFixture.cases.map((entry) => entry.candidate),
  ...evidenceMissingFixture.recheck,
]

export type QueryInputCondition = ParsedCondition
