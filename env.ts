import { z } from 'zod'

// REQ-IMPL-033: 누락·오타 환경 변수로 배포되는 것을 빌드 시점에 차단한다.
// 스파이크 범위에는 네트워크 호출이 없어 검증 대상이 아직 하나다 —
// DATABASE_URL 등 나머지는 그것을 소비하는 경로가 도착할 때 이 스키마에 더한다.
const serverEnvSchema = z.object({
  // Grill S1-T2: 갤러리(app/preview)를 존속시키기로 했으므로 프로덕션에 라우트가 남는다.
  // fixture 에 실제 매장명이 들어가므로(S1-T7) 이 차단이 선택 장치가 아니라 필수 조건이다.
  PREVIEW_ENABLED: z.enum(['true', 'false']).default('false'),
})

export const serverEnv = serverEnvSchema.parse({
  PREVIEW_ENABLED: process.env.PREVIEW_ENABLED,
})

export const isPreviewEnabled = serverEnv.PREVIEW_ENABLED === 'true'
