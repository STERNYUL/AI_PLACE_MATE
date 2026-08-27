import { notFound } from 'next/navigation'

import { CandidateCard } from '@/components/candidate-card'
import { GallerySection, ResultSummary, StateBlock } from '@/components/gallery-frame'
import { GateResult } from '@/components/gate-result'
import { QueryInputFallback, QueryInputIdle, QueryInputParsed } from '@/components/query-input'
import { EvidenceOmittedStatePanel } from '@/components/states/evidence-omitted'
import { EvidencePendingStatePanel } from '@/components/states/evidence-pending'
import { FallbackNoticeStatePanel } from '@/components/states/fallback-notice'
import { NoProposalStatePanel } from '@/components/states/no-proposal'
import { RetryGuideStatePanel } from '@/components/states/retry-guide'
import { SimilarDishStatePanel } from '@/components/states/similar-dish'
import { isPreviewEnabled } from '@/env'
import { runEvidenceGate } from '@/lib/evidence/gate'
import { freshnessFixture, gatePopulationFixture, queryInputFixture } from '@/lib/fixtures'
import { toCandidateViews } from '@/lib/search/client'

/**
 * 시각 스파이크 갤러리 — 화면 13상태 (PROTO-AIPLACE-LITE-001 §1).
 *
 * 앱이 아니라 갤러리다. 라우팅·상태관리·API 호출이 없고, fixture 를 넣어 컴포넌트를 나열한다.
 * 목적은 화면을 만드는 것이 아니라 §5 미정 5건을 화면 앞에서 결론 내는 것이다.
 */

const SECTIONS = ['card', 'degraded', 'input'] as const
type SectionKey = (typeof SECTIONS)[number]

/** ?scenario= 로 한 화면만 좁혀 본다. 스위처 UI 를 만들지 않는다 — 기본은 전부 동시 렌더다 */
function isVisible(section: SectionKey, scenario: string | undefined): boolean {
  return scenario === undefined || scenario === section
}

function referenceDate(isoDate: string): Date {
  return new Date(`${isoDate}T00:00:00`)
}

export default async function PreviewPage({
  searchParams,
}: {
  searchParams: Promise<{ scenario?: string }>
}) {
  // Grill S1-T2: 갤러리는 존속시키되 프로덕션 노출은 막는다. fixture 에 표본 사실이 들어 있다
  if (!isPreviewEnabled) notFound()

  const { scenario } = await searchParams

  const receivedAt = new Date()
  const gate = runEvidenceGate(gatePopulationFixture)
  const admitted = toCandidateViews(gate.admitted, receivedAt)

  // 경계 3종은 기준 시점 대비로만 성립한다. 오늘 날짜로 재면 89·90·91 이 매일 밀린다
  const freshnessBaseline = referenceDate(freshnessFixture.referenceNow)
  const freshnessLadder = toCandidateViews(
    freshnessFixture.samples.map((sample) => sample.candidate),
    freshnessBaseline,
  )

  const [firstAdmitted, , thirdAdmitted] = admitted

  return (
    <main className="mx-auto flex max-w-[430px] flex-col gap-10 px-4 py-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-xl font-bold">화면 13상태</h1>
        <p className="text-sm leading-relaxed text-ink-muted">
          Top-3 후보 카드 4 · 열화 6 · 조건 입력 3. 네트워크 호출이 없고 값은 전부 fixture 다.
        </p>
        <p className="text-xs text-ink-faint">
          신선도 경계 기준 시점 {freshnessFixture.referenceNow} · 그 밖의 카드는 오늘 기준
        </p>
      </header>

      {isVisible('card', scenario) ? (
        <GallerySection
          index={1}
          title="Top-3 후보 카드"
          stateCount={4}
          purpose="근거 4항목이 카드에 다 들어가는가. 경고가 묻히지 않는가. 게이트가 실제로 거르는가."
        >
          <ResultSummary
            admittedCount={gate.admitted.length}
            excludedByEvidence={gate.excludedByEvidence.length}
            excludedByRecheck={gate.excludedByRecheck.length}
          />

          <StateBlock
            code="1-1"
            name="근거 완비"
            note="선정 이유 · 근거 속성 · 확인 일자 · 확인 주체가 모두 있다. 둘째 카드는 하한과 상한이 같아 한 값으로 축약됐다."
          >
            <div className="flex flex-col gap-3">
              {admitted.map((candidate) => (
                <CandidateCard key={candidate.id} candidate={candidate} />
              ))}
            </div>
          </StateBlock>

          <StateBlock
            code="1-2"
            name="STALE — 경고 병기"
            note="90일 당일부터 경고가 붙는다. 임계 하루 전 · 당일 · 하루 뒤를 나란히 놓고 위계를 본다."
          >
            <div className="flex flex-col gap-3">
              {freshnessLadder.map((candidate, index) => (
                <div key={candidate.id} className="flex flex-col gap-1.5">
                  <span className="text-xs font-medium text-ink-faint">
                    {freshnessFixture.samples[index]?.label}
                  </span>
                  <CandidateCard candidate={candidate} />
                </div>
              ))}
            </div>
          </StateBlock>

          <StateBlock
            code="1-3"
            name="제외 · 근거 누락"
            note="카드로 그리지 않는다. 반환되지 않은 후보이기 때문이다. 어느 항목이 비었는지를 항목명으로 적는다."
          >
            <GateResult reason="EVIDENCE_MISSING" entries={gate.excludedByEvidence} />
          </StateBlock>

          <StateBlock
            code="1-4"
            name="제외 · 재확인 대기"
            note="확인 일자가 오래된 것과 다른 상태다. 신고가 접수돼 재확인 전까지 정렬 이전에 빠진다."
          >
            <GateResult reason="RECHECK_REQUIRED" entries={gate.excludedByRecheck} />
          </StateBlock>
        </GallerySection>
      ) : null}

      {isVisible('degraded', scenario) ? (
        <GallerySection
          index={2}
          title="열화 상태"
          stateCount={6}
          purpose="어느 상태에도 빈 화면이 없는가. 각 상태에 다음 행동이 있는가."
        >
          <StateBlock
            code="2-1"
            name="폴백표시"
            note="파싱 실패는 오류가 아니라 정상 경로의 분기다. Top-3 는 계속 나온다."
          >
            <FallbackNoticeStatePanel filters={['성수', '인당 15,000원 이하', '1인', '저녁']} />
          </StateBlock>

          <StateBlock
            code="2-2"
            name="근거대기"
            note="사실 값은 이미 도착했다. 비는 것은 문장 한 줄뿐이라 그 자리만 로딩으로 둔다."
          >
            {firstAdmitted ? <EvidencePendingStatePanel candidate={firstAdmitted} /> : null}
          </StateBlock>

          <StateBlock
            code="2-3"
            name="근거생략"
            note="문장 생성이 실패해도 카드를 숨기지 않는다. 규칙 기반 기본 문구가 넷째 항목을 채운다."
          >
            {thirdAdmitted ? (
              <EvidenceOmittedStatePanel
                candidate={thirdAdmitted}
                ruleBasedReason="인당 예상가 상한이 입력한 예산과 같고, 1인 좌석이 확인된 곳이다."
              />
            ) : null}
          </StateBlock>

          <StateBlock
            code="2-4"
            name="유사메뉴대체"
            note="바꿔 찾았다는 사실을 문구로 명시한다. 말없이 바꾸면 요청한 메뉴를 찾은 줄로 읽힌다."
          >
            <SimilarDishStatePanel requestedDish="냉메밀" substitutedDish="냉모밀" />
          </StateBlock>

          <StateBlock
            code="2-5"
            name="제안없음 — 안 A · 완화안을 먼저 내민다"
            note="§5 #6 판정 대상. 아래 안 B 와 나란히 놓고 고른다."
          >
            <NoProposalStatePanel
              blockedBy="인당 8,000원 이하"
              relaxedConditions={['인당 12,000원 이하로 올리기', '저녁 조건 빼기']}
            />
          </StateBlock>

          <StateBlock
            code="2-5"
            name="제안없음 — 안 B · 무엇이 걸렸는지만 알린다"
            note="같은 상태의 두 번째 안이다. 열화 상태 수는 6 그대로다."
          >
            <NoProposalStatePanel blockedBy="인당 8,000원 이하" />
          </StateBlock>

          <StateBlock
            code="2-6"
            name="재시도안내"
            note="사유와 재시도 수단을 함께 준다. 입력한 조건은 그대로 남는다."
          >
            <RetryGuideStatePanel
              reason="데이터를 읽는 중 연결이 끊겼다."
              requestId="req_01J9F3K2QW"
            />
          </StateBlock>
        </GallerySection>
      ) : null}

      {isVisible('input', scenario) ? (
        <GallerySection
          index={3}
          title="조건 입력"
          stateCount={3}
          purpose="전환 고지가 오류로 읽히지 않는가. 부분 파싱 결과를 이월할 것인가."
        >
          <StateBlock code="3-1" name="입력 전" note="필수 입력이 0개다. 예시로 그 사실을 보여준다.">
            <QueryInputIdle
              placeholder={queryInputFixture.placeholder}
              examples={queryInputFixture.examples}
            />
          </StateBlock>

          <StateBlock
            code="3-2"
            name="파싱 결과 확인"
            note="무엇으로 알아들었는지 되돌려 보여준다. 못 채운 슬롯은 미지정으로 남는다."
          >
            <QueryInputParsed
              rawText={queryInputFixture.parsed.rawText}
              condition={queryInputFixture.parsed.condition}
            />
          </StateBlock>

          <StateBlock
            code="3-3"
            name="폴백 전환 고지 — 이월"
            note="§5 #5 판정 대상. 부분 파싱으로 얻은 슬롯을 구조화 화면에 그대로 옮긴다."
          >
            <QueryInputFallback
              rawText={queryInputFixture.partial.rawText}
              condition={queryInputFixture.partial.condition}
              carriedOver
            />
          </StateBlock>

          <StateBlock
            code="3-3"
            name="폴백 전환 고지 — 미이월"
            note="같은 상태의 두 번째 안이다. 옮기지 않고 비운 채로 넘긴다."
          >
            <QueryInputFallback
              rawText={queryInputFixture.partial.rawText}
              condition={queryInputFixture.partial.condition}
              carriedOver={false}
            />
          </StateBlock>
        </GallerySection>
      ) : null}

      <footer className="border-t border-line pt-4 text-xs leading-relaxed text-ink-faint">
        값은 전부 fixture 다. 실제 매장의 확인된 사실이 아니며, PREVIEW_ENABLED 로 프로덕션 노출을
        막는다.
      </footer>
    </main>
  )
}
