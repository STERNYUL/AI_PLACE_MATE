import { Badge } from '@/components/ui/badge'
import { formatKrw } from '@/lib/search/format'
import type { ParsedCondition } from '@/types/draft'

/**
 * 조건 입력 3상태 — 입력 전 · 파싱 결과 확인 · 폴백 전환 고지.
 *
 * 입력은 문장 하나뿐이고 필수 입력이 0개다 (REQ-FUNC-008). 그래서 이 화면이 하는 일의 절반은
 * '무엇으로 알아들었는지'를 되돌려 보여주는 것이다.
 */

const SLOT_LABEL = {
  budget: '예산',
  party: '인원',
  dish: '메뉴',
  context: '맥락',
} as const

function InputBox({ value, muted }: { value: string; muted?: boolean }) {
  return (
    <div
      className={[
        'rounded-card border border-line-strong bg-surface px-3.5 py-3 text-sm',
        muted ? 'text-ink-faint' : 'text-ink',
      ].join(' ')}
    >
      {value}
    </div>
  )
}

function Slot({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex items-center justify-between gap-2 py-1.5 text-sm">
      <span className="text-ink-faint">{label}</span>
      {value ? (
        <span className="font-medium text-ink">{value}</span>
      ) : (
        <span className="text-ink-faint">미지정</span>
      )}
    </div>
  )
}

function ConditionSlots({ condition }: { condition: ParsedCondition }) {
  return (
    <div className="divide-y divide-line rounded-card border border-line bg-canvas px-3 py-1">
      <Slot
        label={SLOT_LABEL.budget}
        value={condition.budgetPerPerson === null ? null : `인당 ${formatKrw(condition.budgetPerPerson)} 이하`}
      />
      <Slot
        label={SLOT_LABEL.party}
        value={condition.partySize === null ? null : `${condition.partySize}명`}
      />
      <Slot label={SLOT_LABEL.dish} value={condition.dish} />
      <Slot
        label={SLOT_LABEL.context}
        value={condition.contexts.length > 0 ? condition.contexts.join(' · ') : null}
      />
    </div>
  )
}

function Shell({
  stateName,
  tone,
  children,
}: {
  stateName: string
  tone: 'neutral' | 'notice'
  children: React.ReactNode
}) {
  return (
    <section className="flex flex-col gap-3 rounded-card border border-line bg-surface p-4">
      <Badge tone={tone}>{stateName}</Badge>
      {children}
    </section>
  )
}

/** 입력 전 — 필수 입력이 없다는 것을 예시로 보여준다 */
export function QueryInputIdle({
  placeholder,
  examples,
}: {
  placeholder: string
  examples: string[]
}) {
  return (
    <Shell stateName="입력 전" tone="neutral">
      <InputBox value={placeholder} muted />

      <div className="flex flex-wrap gap-1.5">
        {examples.map((example) => (
          <span
            key={example}
            className="rounded-chip border border-line px-2.5 py-1 text-xs text-ink-muted"
          >
            {example}
          </span>
        ))}
      </div>

      <p className="text-xs text-ink-faint">채워야 하는 칸은 없다. 문장 하나면 된다.</p>
    </Shell>
  )
}

/** 파싱 결과 확인 — 무엇으로 알아들었는지 되돌려 보여준다 */
export function QueryInputParsed({
  rawText,
  condition,
}: {
  rawText: string
  condition: ParsedCondition
}) {
  return (
    <Shell stateName="파싱 결과 확인" tone="neutral">
      <InputBox value={rawText} />
      <ConditionSlots condition={condition} />

      <button
        type="button"
        className="w-full rounded-card bg-ink px-4 py-2.5 text-sm font-semibold text-surface"
      >
        이 조건으로 찾기
      </button>
    </Shell>
  )
}

/**
 * 폴백 전환 고지 — 오류로 읽히면 안 된다 (§1 판정 항목).
 *
 * carriedOver 가 §5 #5 판정 대상이다. 부분 파싱으로 얻은 슬롯을 구조화 화면에 이월할 것인가,
 * 아니면 비운 채로 넘길 것인가.
 */
export function QueryInputFallback({
  rawText,
  condition,
  carriedOver,
}: {
  rawText: string
  condition: ParsedCondition
  carriedOver: boolean
}) {
  const emptyCondition: ParsedCondition = {
    budgetPerPerson: null,
    partySize: null,
    dish: null,
    contexts: [],
  }

  return (
    <Shell stateName={carriedOver ? '폴백 전환 고지 · 이월' : '폴백 전환 고지 · 미이월'} tone="notice">
      <InputBox value={rawText} />

      <p className="rounded-card border border-notice-line bg-notice-soft px-3 py-2.5 text-sm text-notice">
        문장을 조건으로 다 옮기지 못했다. 아래에서 직접 고르면 그대로 찾는다.
      </p>

      <ConditionSlots condition={carriedOver ? condition : emptyCondition} />

      <p className="text-xs text-ink-faint">
        {carriedOver
          ? '알아들은 슬롯은 그대로 옮겨 두었다. 나머지만 고르면 된다.'
          : '옮겨 둔 슬롯은 없다. 처음부터 고르면 된다.'}
      </p>
    </Shell>
  )
}
