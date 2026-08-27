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

export function AgentRoom({ room, onClose }: { room: PrototypeRoom; onClose: () => void }) {
  const [remaining, setRemaining] = useState(() => formatRemaining(room.expiresAt))
  const [draft, setDraft] = useState('')
  const [messages, setMessages] = useState<Message[]>(() => room.participants.map((participant, index) => ({
    id: participant.id,
    sender: participant.name,
    text: `근거 항목 4개가 포함된 제안 ${index + 1}건`,
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
    <section className="flex flex-col gap-4" aria-label="에이전트 대화방">
      <div className="rounded-card border border-line bg-surface p-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs text-ink-muted">Phase 2 데모 · fixture 데이터</p>
            <h2 className="mt-1 text-lg font-bold">제안 대화방</h2>
            <p className="mt-1 text-sm text-ink-muted">참여 {room.participants.length}곳 · 서버 기준 종료 시각 {new Date(room.expiresAt).toLocaleTimeString('ko-KR')}</p>
          </div>
          <p className="rounded-card bg-notice-soft px-3 py-2 font-mono text-sm text-notice">{formatClock(remaining)}</p>
        </div>
        <button type="button" onClick={onClose} className="mt-4 text-sm underline underline-offset-4">Top-3로 돌아가기</button>
      </div>
      <div className="flex flex-col gap-2 rounded-card border border-line p-4">
        <h3 className="text-sm font-semibold">대화</h3>
        {messages.map((message) => <div key={message.id} className="rounded-card bg-surface-muted p-3 text-sm"><p className="font-medium">{message.sender} <span className="ml-1 text-xs font-normal text-ink-muted">{message.time}</span></p><p className="mt-1 leading-relaxed">{message.text}</p></div>)}
        {remaining === 0 ? <p className="text-sm text-ink-muted">대화 시간이 종료되었습니다. 제안은 Top-3와 함께 확인할 수 있습니다.</p> : null}
        <form onSubmit={sendMessage} className="flex gap-2 pt-2">
          <input value={draft} onChange={(event) => setDraft(event.target.value)} disabled={remaining === 0} maxLength={200} placeholder="대화방 메모 입력" className="min-w-0 flex-1 rounded-card border border-line px-3 py-2 text-sm disabled:bg-surface-muted" />
          <button type="submit" disabled={!draft.trim() || remaining === 0} className="rounded-card bg-ink px-3 py-2 text-sm font-semibold text-surface disabled:opacity-50">보내기</button>
        </form>
      </div>
      <div className="flex flex-col gap-3"><p className="text-sm text-ink-muted">제안은 적합도 순서로 표시됩니다.</p>{candidates.map((candidate) => <CandidateCard key={candidate.id} candidate={candidate} />)}</div>
    </section>
  )
}
