import type { NextConfig } from 'next'

// C-TEC-001: 단일 배포 단위 — 별도 백엔드 프로세스를 두지 않는다
const nextConfig: NextConfig = {
  reactStrictMode: true,

  // next dev 가 루트 AGENTS.md 에 자기 안내 블록을 덧붙인다. 이 저장소의 AGENTS.md 는
  // 스파이크 범위 밖 파일이라 매 실행마다 워킹트리가 더러워진다
  agentRules: false,
}

export default nextConfig
