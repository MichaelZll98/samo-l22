'use client'

import { useState, useRef, useEffect } from 'react'
import { Send, MessageCircle } from 'lucide-react'

interface Message {
  id: string
  author: string
  avatar: string
  avatarColor: string
  text: string
  time: string
  isOwn?: boolean
}

const INITIAL: Message[] = [
  { id: '1', author: 'Laura M.', avatar: 'LM', avatarColor: '#4ECDC4', text: 'Ciao a tutti! Qualcuno ha già studiato il capitolo 4?', time: '10:30', isOwn: false },
  { id: '2', author: 'Giovanni R.', avatar: 'GR', avatarColor: '#96CEB4', text: 'Sì, ho finito ieri. Vi consiglio di concentrarsi sulla parte sulle articolazioni.', time: '10:32', isOwn: false },
  { id: '3', author: 'Tu', avatar: 'TU', avatarColor: '#0055FF', text: 'Perfetto grazie! Sapete se c\'è materiale extra?', time: '10:35', isOwn: true },
]

export function GroupChat({ groupId }: { groupId: string }) {
  const [messages, setMessages] = useState<Message[]>(INITIAL)
  const [text, setText] = useState('')
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const send = () => {
    if (!text.trim()) return
    setMessages((prev) => [...prev, {
      id: Date.now().toString(),
      author: 'Tu',
      avatar: 'TU',
      avatarColor: '#0055FF',
      text: text.trim(),
      time: new Date().toLocaleTimeString('it-IT', { hour: '2-digit', minute: '2-digit' }),
      isOwn: true,
    }])
    setText('')
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontWeight: 700, fontSize: 15 }}>
        <MessageCircle size={16} color="var(--primary)" />
        Chat gruppo
      </div>
      <div style={{
        height: 340,
        overflowY: 'auto',
        border: '1px solid var(--border)',
        borderRadius: 'var(--r)',
        background: 'var(--surface)',
        padding: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        marginBottom: 12,
      }}>
        {messages.map((m) => (
          <div key={m.id} style={{ display: 'flex', gap: 8, justifyContent: m.isOwn ? 'flex-end' : 'flex-start' }}>
            {!m.isOwn && (
              <div className="author-avatar" style={{ background: m.avatarColor, width: 30, height: 30, fontSize: 10, flexShrink: 0 }}>
                {m.avatar}
              </div>
            )}
            <div style={{ maxWidth: '70%' }}>
              {!m.isOwn && (
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--muted)', marginBottom: 3 }}>{m.author}</div>
              )}
              <div style={{
                padding: '9px 13px',
                borderRadius: m.isOwn ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                background: m.isOwn ? 'var(--primary)' : 'var(--card)',
                border: m.isOwn ? 'none' : '1px solid var(--border)',
                color: m.isOwn ? 'white' : 'var(--color)',
                fontSize: 14,
                lineHeight: 1.5,
              }}>
                {m.text}
              </div>
              <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 3, textAlign: m.isOwn ? 'right' : 'left' }}>{m.time}</div>
            </div>
            {m.isOwn && (
              <div className="author-avatar" style={{ background: m.avatarColor, width: 30, height: 30, fontSize: 10, flexShrink: 0 }}>
                {m.avatar}
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <input
          className="form-input"
          placeholder="Scrivi un messaggio..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          style={{ fontSize: 14 }}
        />
        <button className="btn btn-primary" style={{ padding: '10px 16px', flexShrink: 0 }} onClick={send} disabled={!text.trim()}>
          <Send size={16} />
        </button>
      </div>
    </div>
  )
}
