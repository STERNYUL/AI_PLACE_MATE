'use client'

import { FormEvent, useState } from 'react'

import { openPrototypeRoom, queryPrototype, type PrototypeRoom } from '@/app/actions/prototype'
import { AgentRoom } from '@/components/agent-room'
import { CandidateCard } from '@/components/candidate-card'
import { queryResponseSchema } from '@/lib/fixtures'
import { toCandidateViews } from '@/lib/search/client'
import type { QueryResponse } from '@/types/draft'

export function LiveQuery() {
  const [query, setQuery] = useState('성수에서 1인 예산 15,000원 이하')
  const [result, setResult] = useState<QueryResponse | null>(null)
  const [message, setMessage] = useState<string | null>(null)
  const [pending, setPending] = useState(false)
  const [room, setRoom] = useState<PrototypeRoom | null>(null)

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
        setMessage('조회 결과 형식을 확인하지 못했습니다. 다시 조회할 수 있습니다.')
        return
      }
      setRoom(null)
      setResult(parsed.data)
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
    } catch {
      setMessage('대화방을 열지 못했습니다. 다시 시도할 수 있습니다.')
    } finally {
      setPending(false)
    }
  }

  const candidates = result ? toCandidateViews(result.candidates, new Date()) : []
  return (
    <main className="mx-auto flex min-h-dvh max-w-[430px] flex-col gap-6 px-4 py-8">
      <header className="flex flex-col gap-2">
        <h1 className="text-xl font-bold">AI-Place-Mate</h1>
        <p className="text-sm leading-relaxed text-ink-muted">조건을 입력하면 근거 4항목을 갖춘 후보만 표시합니다.</p>
      </header>
      <form className="flex flex-col gap-3" onSubmit={submit}>
        <label className="text-sm font-medium" htmlFor="query">조건</label>
        <textarea id="query" value={query} onChange={(event) => setQuery(event.target.value)} className="min-h-24 rounded-card border border-line-strong bg-surface p-3 text-sm" />
        <button type="submit" disabled={pending} className="rounded-card bg-ink px-4 py-3 text-sm font-semibold text-surface disabled:opacity-60">{pending ? '조회 중' : '후보 찾기'}</button>
      </form>
      {message ? <p className="rounded-card border border-notice-line bg-notice-soft p-3 text-sm text-notice">{message}</p> : null}
      {room ? <AgentRoom room={room} onClose={() => setRoom(null)} /> : null}
      {result && !room ? (
        <section className="flex flex-col gap-3">
          <p className="text-sm text-ink-muted">입력 조건: {query} · 근거 누락 제외 {result.excludedByEvidence}곳 · 재확인 대기 제외 {result.excludedByRecheck}곳</p>
          {candidates.length > 0 ? candidates.map((candidate) => <CandidateCard key={candidate.id} candidate={candidate} />) : <p className="rounded-card border border-line p-4 text-sm">통과 후보가 없습니다. 조건을 수정해 다시 조회할 수 있습니다.</p>}
          {candidates.length >= 3 ? <button type="button" onClick={openRoom} disabled={pending} className="rounded-card border border-ink px-4 py-3 text-sm font-semibold disabled:opacity-60">{pending ? '대화방 여는 중' : '제안 대화방 열기'}</button> : null}
        </section>
      ) : null}
    </main>
  )
}
