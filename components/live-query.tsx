'use client'

import { FormEvent, useMemo, useState } from 'react'

import { openPrototypeRoom, queryPrototype, type PrototypeRoom } from '@/app/actions/prototype'
import { AgentRoom } from '@/components/agent-room'
import { CandidateCard } from '@/components/candidate-card'
import { queryResponseSchema } from '@/lib/fixtures'
import { toCandidateViews } from '@/lib/search/client'
import type { QueryResponse } from '@/types/draft'

type Stage = 'search' | 'compare' | 'room' | 'booking'

const stages: { id: Stage; label: string }[] = [
  { id: 'search', label: '조건 입력' },
  { id: 'compare', label: '후보 비교' },
  { id: 'room', label: '제안 확인' },
  { id: 'booking', label: '예약 요청' },
]

export function LiveQuery() {
  const [query, setQuery] = useState('성수에서 1인 예산 15,000원 이하')
  const [result, setResult] = useState<QueryResponse | null>(null)
  const [room, setRoom] = useState<PrototypeRoom | null>(null)
  const [stage, setStage] = useState<Stage>('search')
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [saved, setSaved] = useState(false)
  const [consented, setConsented] = useState(false)
  const [bookingSent, setBookingSent] = useState(false)

  const candidates = useMemo(() => result ? toCandidateViews(result.candidates, new Date()) : [], [result])
  const selected = candidates.find((candidate) => candidate.id === selectedId) ?? null

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setPending(true)
    setMessage(null)
    try {
      const response = await queryPrototype({ query })
      if (!response.ok) {
        setResult(null)
        setMessage(response.message)
        return
      }
      const parsed = queryResponseSchema.safeParse(response.data)
      if (!parsed.success) {
        setResult(null)
        setMessage('조회 결과 형식을 확인하지 못했습니다. 조건을 확인해 다시 조회할 수 있습니다.')
        return
      }
      setResult(parsed.data)
      setRoom(null)
      setSelectedId(null)
      setBookingSent(false)
      setStage('compare')
    } catch {
      setResult(null)
      setMessage('조회 요청을 처리하지 못했습니다. 다시 조회할 수 있습니다.')
    } finally {
      setPending(false)
    }
  }

  async function openRoom() {
    if (!result) return
    setPending(true)
    setMessage(null)
    try {
      const response = await openPrototypeRoom({ candidates: result.candidates })
      if (!response.ok) {
        setMessage(response.message)
        return
      }
      setRoom(response.data)
      setStage('room')
    } catch {
      setMessage('대화방을 열지 못했습니다. 다시 시도할 수 있습니다.')
    } finally {
      setPending(false)
    }
  }

  async function share() {
    const shareText = selected ? `${selected.name} 후보의 확인 정보를 공유합니다.` : 'AI-Place-Mate 후보 비교 화면입니다.'
    try {
      if (navigator.share) await navigator.share({ title: 'AI-Place-Mate', text: shareText, url: window.location.href })
      else await navigator.clipboard.writeText(window.location.href)
      setMessage('공유할 수 있는 링크를 준비했습니다.')
    } catch {
      setMessage('공유를 취소했습니다. 후보는 이 화면에서 계속 확인할 수 있습니다.')
    }
  }

  function selectCandidate(id: string) {
    setSelectedId(id)
    setMessage('선택한 후보를 예약 요청 단계에서 다시 확인할 수 있습니다.')
  }

  function saveCandidate(id: string) {
    window.localStorage.setItem('ai-place-mate:saved-candidate', id)
    setSelectedId(id)
    setSaved(true)
    setMessage('후보를 이 브라우저에 저장했습니다.')
  }

  return (
    <main className="mx-auto flex min-h-dvh max-w-[720px] flex-col gap-6 px-4 py-6 sm:px-6">
      <header className="border-b border-line pb-5">
        <div className="flex items-center justify-between gap-3">
          <a href="#top" className="text-lg font-bold tracking-tight">AI-Place-Mate</a>
          <span className="rounded-chip bg-fact-soft px-3 py-1 text-xs font-semibold text-fact">근거 기반 탐색</span>
        </div>
        <div id="top" className="mt-5">
          <p className="text-sm font-medium text-fact">식당 찾기</p>
          <h1 className="mt-1 max-w-xl text-3xl font-bold tracking-tight sm:text-4xl">조건을 정하고, 확인 정보로 비교하세요.</h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-muted">선정 이유, 근거 속성, 확인 일자, 확인 주체가 있는 후보만 표시합니다. 이 프로토타입은 fixture 데이터를 사용합니다.</p>
        </div>
      </header>

      <nav className="grid grid-cols-4 gap-1 rounded-card border border-line bg-surface p-1" aria-label="탐색 단계">
        {stages.map((item, index) => <button key={item.id} type="button" onClick={() => item.id === 'search' || (item.id === 'compare' && result) ? setStage(item.id) : undefined} disabled={item.id !== 'search' && item.id !== 'compare'} aria-current={stage === item.id ? 'step' : undefined} className={`min-w-0 whitespace-nowrap rounded-card px-2 py-2 text-xs font-semibold ${stage === item.id ? 'bg-ink text-surface' : 'text-ink-muted'} disabled:cursor-default`}><span className="mr-1 text-ink-faint">{index + 1}</span>{item.label}</button>)}
      </nav>

      <section className="rounded-card border border-line bg-surface p-4 sm:p-5" aria-labelledby="query-title">
        <div className="flex items-baseline justify-between gap-3"><h2 id="query-title" className="text-lg font-bold">조건 입력</h2><span className="text-xs text-ink-faint">최대 200자</span></div>
        <form className="mt-4 flex flex-col gap-3" onSubmit={submit}>
          <label className="text-sm font-medium" htmlFor="query">어떤 식사를 찾고 있나요?</label>
          <textarea id="query" value={query} onChange={(event) => setQuery(event.target.value)} maxLength={200} className="min-h-24 rounded-card border border-line-strong bg-canvas p-3 text-sm leading-relaxed outline-none focus-visible:ring-2 focus-visible:ring-fact" />
          <div className="flex flex-wrap gap-2" aria-label="조건 예시"><button type="button" onClick={() => setQuery('성수에서 1인 예산 15,000원 이하')} className="rounded-chip border border-line px-3 py-1.5 text-xs">성수 · 15,000원 이하</button><button type="button" onClick={() => setQuery('대화 가능 여부가 확인된 한식')} className="rounded-chip border border-line px-3 py-1.5 text-xs">대화 · 한식</button><button type="button" onClick={() => setQuery('4명이 함께 갈 수 있는 점심')} className="rounded-chip border border-line px-3 py-1.5 text-xs">4명 · 점심</button></div>
          <button type="submit" disabled={pending} className="rounded-card bg-ink px-4 py-3 text-sm font-semibold text-surface disabled:opacity-60">{pending ? '후보 조회 중' : '근거가 있는 후보 찾기'}</button>
        </form>
      </section>

      {message ? <p role="status" className="rounded-card border border-notice-line bg-notice-soft p-3 text-sm text-notice">{message}</p> : null}

      {result && stage === 'compare' ? (
        <section className="flex flex-col gap-4" aria-labelledby="compare-title">
          <div className="flex flex-wrap items-end justify-between gap-3"><div><p className="text-sm font-medium text-fact">후보 비교</p><h2 id="compare-title" className="mt-1 text-2xl font-bold tracking-tight">조건에 맞는 후보 {candidates.length}곳</h2></div><button type="button" onClick={share} className="rounded-chip border border-line bg-surface px-3 py-2 text-sm font-semibold">{saved ? '저장됨' : '공유하기'}</button></div>
          <p className="text-sm leading-relaxed text-ink-muted">입력 조건: {query} · 근거 누락 제외 {result.excludedByEvidence}곳 · 재확인 대기 제외 {result.excludedByRecheck}곳</p>
          {candidates.length > 0 ? candidates.map((candidate, index) => <article key={candidate.id} className={selectedId === candidate.id ? 'rounded-card p-1 ring-2 ring-fact' : ''}><p className="mb-2 text-xs font-semibold text-ink-faint">후보 {index + 1}</p><CandidateCard candidate={candidate} /><div className="mt-3 grid grid-cols-2 gap-2"><button type="button" onClick={() => selectCandidate(candidate.id)} className="rounded-card border border-ink px-3 py-2 text-sm font-semibold">{selectedId === candidate.id ? '선택됨' : '선택하기'}</button><button type="button" onClick={() => saveCandidate(candidate.id)} className="rounded-card border border-line px-3 py-2 text-sm font-semibold">저장</button></div></article>) : <div className="rounded-card border border-line bg-surface p-4"><p className="font-semibold">통과 후보가 없습니다.</p><p className="mt-1 text-sm text-ink-muted">조건을 수정해 다시 조회할 수 있습니다.</p></div>}
          <div className="grid gap-2 sm:grid-cols-2"><button type="button" onClick={openRoom} disabled={pending || candidates.length < 3} className="rounded-card bg-ink px-4 py-3 text-sm font-semibold text-surface disabled:opacity-60">{pending ? '대화방 여는 중' : '제안 대화방 열기'}</button><button type="button" onClick={() => selected ? setStage('booking') : setMessage('예약 요청 전에 후보 하나를 선택해 주세요.')} className="rounded-card border border-ink bg-surface px-4 py-3 text-sm font-semibold">선택한 후보로 예약 요청</button></div>
        </section>
      ) : null}

      {room && stage === 'room' ? <AgentRoom room={room} selectedId={selectedId} onSelect={selectCandidate} onClose={() => setStage('compare')} /> : null}

      {stage === 'booking' ? (
        <section className="flex flex-col gap-4 rounded-card border border-line bg-surface p-4 sm:p-5" aria-labelledby="booking-title">
          <div><p className="text-sm font-medium text-fact">예약 요청</p><h2 id="booking-title" className="mt-1 text-2xl font-bold tracking-tight">선택한 후보를 확인하세요.</h2></div>
          {selected ? <><div className="rounded-card bg-canvas p-4"><p className="font-semibold">{selected.name}</p><p className="mt-1 text-sm text-ink-muted">대표 메뉴 · {selected.signatureDish}</p><p className="mt-2 text-sm">확인 일자 {selected.verifiedAt} · 확인 주체 {selected.verifiedBy}</p></div><label className="flex items-start gap-3 rounded-card border border-line p-3 text-sm"><input type="checkbox" checked={consented} onChange={(event) => setConsented(event.target.checked)} className="mt-1 size-4" /><span>예약 요청에 필요한 정보만 전달하는 방식은 <strong>(미정 — 확정 필요)</strong>입니다. 현재 데모에서는 정보를 전송하지 않습니다.</span></label><button type="button" disabled={!consented || bookingSent} onClick={() => setBookingSent(true)} className="rounded-card bg-ink px-4 py-3 text-sm font-semibold text-surface disabled:opacity-50">{bookingSent ? '예약 요청이 기록됨' : '예약 요청 기록하기'}</button>{bookingSent ? <p className="rounded-card bg-fact-soft p-3 text-sm text-fact">데모 요청을 기록했습니다. 실제 예약이나 개인정보 전송은 수행하지 않습니다.</p> : null}</> : <div className="rounded-card border border-line p-4"><p className="font-semibold">선택한 후보가 없습니다.</p><button type="button" onClick={() => setStage('compare')} className="mt-3 rounded-card border border-ink px-3 py-2 text-sm font-semibold">후보 비교로 이동</button></div>}
          <button type="button" onClick={() => setStage('compare')} className="self-start text-sm font-medium underline underline-offset-4">후보 비교로 돌아가기</button>
        </section>
      ) : null}

      <footer className="border-t border-line pt-5 text-sm text-ink-muted"><p className="font-medium text-ink">확인 가능한 정보만 표시합니다.</p><p className="mt-1 leading-relaxed">이 화면은 서비스 흐름을 검토하기 위한 데모입니다. 후보, 대화방, 예약 요청은 fixture 데이터로 동작합니다.</p></footer>
    </main>
  )
}
