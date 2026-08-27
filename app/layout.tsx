import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'AI-Place-Mate',
  description: '조건에 맞는 식당 후보를 근거와 함께 제시한다',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      {/* 지도 내 탭 진입이라 뷰포트 폭이 곧 화면 폭이다 (ADR-006) */}
      <body className="font-sans antialiased">{children}</body>
    </html>
  )
}
