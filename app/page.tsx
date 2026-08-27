import Link from 'next/link'
import { isPreviewEnabled } from '@/env'

// 스파이크 범위에는 검색 화면 구현이 없다. 빈 화면을 두지 않기 위한 최소 안내만 둔다
export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-dvh max-w-[430px] flex-col justify-center gap-3 px-5 py-10">
      <h1 className="text-lg font-semibold">AI-Place-Mate</h1>
      <p className="text-sm leading-relaxed text-ink-muted">
        조건에 맞는 식당 후보를 근거와 함께 제시한다. 이 배포에는 검색 경로가 아직 없다.
      </p>
      {isPreviewEnabled ? (
        <Link
          href="/preview"
          className="w-fit rounded-chip border border-line-strong px-4 py-2 text-sm font-medium"
        >
          화면 13상태 갤러리 열기
        </Link>
      ) : (
        <p className="text-sm text-ink-faint">
          시각 스파이크 갤러리는 이 환경에서 꺼져 있다 (PREVIEW_ENABLED).
        </p>
      )}
    </main>
  )
}
