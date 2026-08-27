'use client'

import { FormEvent, useEffect, useState } from 'react'

import type { PrototypeRoom } from '@/app/actions/prototype'
import { CandidateCard } from '@/components/candidate-card'
import { toCandidateViews } from '@/lib/search/client'

type Message = { id: string; sender: string; text: string; time: string }

function formatRemaining(expiresAt: string) {
  return Math.max(0, Math.ceil((new Date(expiresAt).getTime() - Date.now()) / 1_000))
}

function formatClock(seconds: number) {
  return `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`
}

export function AgentRoom({ room, selectedId, onSelect, onClose }: { room: PrototypeRoom; selectedId: string | null; onSelect: (id: string) => void; onClose: () => void }) {
  const [remaining, setRemaining] = useState(() => formatRemaining(room.expiresAt))
  const [tab, setTab] = useState<'conversation' | 'proposals'>('conversation')
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<Message[]>(() => room.participants.map((participant, index) => ({
    id: participant.id,
    sender: participant.name,
    text: `근거 항목 4개가 포함된 제안 ${index + 1}건을 보냈습니다.`,
    time: new Date(room.createdAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }),
  })))

  useEffect(() => {
    const timer = window.setInterval(() => setRemaining(formatRemaining(room.expiresAt)), 1_000)
    return () => window.clearInterval(timer)
  }, [room.expiresAt])

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const text = draft.trim()
    if (!text || remaining === 0) return
    setMessages((current) => [...current, { id: crypto.randomUUID(), sender: '나', text, time: new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }) }])
    setDraft('')
  }

  const candidates = toCandidateViews(room.participants, new Date(room.createdAt))
  return (
    <section className="flex flex-col gap-4" aria-label="제안 대화방">
      <header className="rounded-card border border-line bg-surface p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-xs font-medium text-fact">제안 대화방</p>
            <h2 className="mt-1 text-xl font-bold tracking-tight">조건을 확인한 {room.participants.length}곳</h2>
            <p className="mt-1 text-sm leading-relaxed text-ink-muted">서버 기준 종료 시각 {new Date(room.expiresAt).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <p aria-label={`남은 시간 ${formatClock(remaining)}`} className="shrink-0 rounded-chip bg-notice-soft px-3 py-2 font-mono text-sm font-semibold text-notice">{formatClock(remaining)}</p>
        </div>
        <div className="mt-4 grid grid-cols-2 gap-2" role="tablist" aria-label="대화방 보기">
          <button type="button" role="tab" aria-selected={tab === 'conversation'} onClick={() => setTab('conversation')} className={`rounded-chip px-3 py-2 text-sm font-semibold ${tab === 'conversation' ? 'bg-ink text-surface' : 'border border-line bg-surface'}`}>대화 {messages.length}</button>
          <button type="button" role="tab" aria-selected={tab === 'proposals'} onClick={() => setTab('proposals')} className={`rounded-chip px-3 py-2 text-sm font-semibold ${tab === 'proposals' ? 'bg-ink text-surface' : 'border border-line bg-surface'}`}>제안 비교 {candidates.length}</button>
        </div>
      </header>

      {tab === 'conversation' ? (
        <div className="flex flex-col gap-3 rounded-card border border-line bg-surface p-4">
          <p className="text-sm text-ink-muted">참여 상태</p>
          <ul className="flex flex-col gap-2" aria-label="참여 매장 상태">
            {room.participants.map((participant) => <li key={participant.id} className="flex items-center justify-between gap-3 border-b border-line pb-2 text-sm last:border-0 last:pb-0"><span>{participant.name}</span><span className="shrink-0 text-fact">제안 도착</span></li>)}
          </ul>
          <div className="border-t border-line pt-3">
            <p className="mb-2 text-sm font-semibold">대화</p>
            <div className="flex max-h-64 flex-col gap-2 overflow-y-auto" aria-live="polite">
              {messages.map((message) => <div key={message.id} className="rounded-card bg-canvas p-3 text-sm"><p className="font-medium">{message.sender} <span className="ml-1 text-xs font-normal text-ink-muted">{message.time}</span></p><p className="mt-1 leading-relaxed">{message.text}</p></div>)}
            </div>
            {remaining === 0 ? <p className="mt-3 text-sm text-ink-muted">대화 시간이 종료되었습니다. 받은 제안은 비교 탭에서 확인할 수 있습니다.</p> : <form onSubmit={sendMessage} className="mt-3 flex gap-2"><input value={draft} onChange={(event) => setDraft(event.target.value)} maxLength={200} placeholder="대화방 메모 입력" className="min-w-0 flex-1 rounded-card border border-line px-3 py-2 text-sm" /><button type="submit" disabled={!draft.trim()} className="rounded-card bg-ink px-3 py-2 text-sm font-semibold text-surface disabled:opacity-50">메모 보내기</button></form>}
            <p className="mt-2 text-xs text-ink-faint">데모의 메모는 현재 브라우저에만 표시됩니다.</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          <p className="text-sm text-ink-muted">제안은 적합도 순서로 표시됩니다. 가격이나 거리 순서로 바꾸지 않습니다.</p>
          {candidates.map((candidate) => <article key={candidate.id} className={selectedId === candidate.id ? 'rounded-card p-1 ring-2 ring-fact' : ''}><CandidateCard candidate={candidate} /><button type="button" onClick={() => onSelect(candidate.id)} className="mt-3 w-full rounded-card border border-ink px-4 py-3 text-sm font-semibold">{selectedId === candidate.id ? '선택한 제안' : '이 제안 선택'}</button></article>)}
        </div>
      )}

      <button type="button" onClick={onClose} className="self-start text-sm font-medium underline underline-offset-4">후보 비교로 돌아가기</button>
      <p className="text-xs text-ink-faint">Phase 2 데모 · fixture 데이터 · 실제 매장과 연결되지 않습니다.</p>
    </section>
  )
}
