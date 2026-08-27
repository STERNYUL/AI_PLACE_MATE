'use server'

import { z } from 'zod'

import { runEvidenceGate } from '@/lib/evidence/gate'
import { gatePopulationFixture, queryResponseSchema } from '@/lib/fixtures'

const queryInputSchema = z.object({
  query: z.string().trim().min(1, '조회할 조건을 입력해 주세요.').max(200),
})

const roomInputSchema = z.object({
  candidates: queryResponseSchema.shape.candidates.min(3).max(5),
})

export type PrototypeQueryResult = z.infer<typeof queryResponseSchema>

export type PrototypeRoom = {
  roomId: string
  createdAt: string
  expiresAt: string
  participants: z.infer<typeof queryResponseSchema>['candidates']
  excludedByEvidence: number
  excludedByRecheck: number
}

export async function queryPrototype(raw: unknown): Promise<{ ok: true; data: PrototypeQueryResult } | { ok: false; message: string }> {
  const input = queryInputSchema.safeParse(raw)
  if (!input.success) return { ok: false, message: input.error.issues[0]?.message ?? '조회할 조건을 입력해 주세요.' }

  // REQ-IMPL-010: fixture candidates pass the evidence gate before display.
  const gate = runEvidenceGate(gatePopulationFixture)
  return {
    ok: true,
    data: {
      candidates: gate.admitted.slice(0, 3),
      fallbackApplied: false,
      overBudgetCount: 0,
      substitutedDish: null,
      excludedByEvidence: gate.excludedByEvidence.length,
      excludedByRecheck: gate.excludedByRecheck.length,
    },
  }
}

export async function openPrototypeRoom(raw: unknown): Promise<{ ok: true; data: PrototypeRoom } | { ok: false; message: string }> {
  const input = roomInputSchema.safeParse(raw)
  if (!input.success) return { ok: false, message: '대화방에 표시할 제안이 3건 미만입니다.' }

  const createdAt = new Date()
  return {
    ok: true,
    data: {
      roomId: crypto.randomUUID(),
      createdAt: createdAt.toISOString(),
      expiresAt: new Date(createdAt.getTime() + 180_000).toISOString(),
      participants: input.data.candidates,
      excludedByEvidence: 0,
      excludedByRecheck: 0,
    },
  }
}
