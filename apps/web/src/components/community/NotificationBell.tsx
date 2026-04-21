'use client'

import { Bell } from 'lucide-react'
import { useState } from 'react'

interface Notification {
  id: string
  message: string
  read: boolean
  time: string
  type: 'like' | 'comment' | 'save' | 'group_invite'
}

const SAMPLE: Notification[] = [
  { id: 'n1', message: 'Laura M. ha messo mi piace ai tuoi appunti di Anatomia', read: false, time: '10 min fa', type: 'like' },
  { id: 'n2', message: 'Giovanni R. ha commentato la tua nota "Sistema nervoso"', read: false, time: '1 ora fa', type: 'comment' },
  { id: 'n3', message: 'Sofia B. ha salvato il tuo materiale PDF', read: false, time: '3 ore fa', type: 'save' },
]

export function NotificationBell() {
  const [open, setOpen] = useState(false)
  const [notifs, setNotifs] = useState<Notification[]>(SAMPLE)

  const unread = notifs.filter((n) => !n.read).length

  const markAll = () => setNotifs((prev) => prev.map((n) => ({ ...n, read: true })))

  const typeColors: Record<string, string> = {
    like: '#F43F5E',
    comment: '#3B82F6',
    save: '#F59E0B',
    group_invite: '#22C55E',
  }

  return (
    <div style={{ position: 'relative' }}>
      <button
        className="samo-icon-btn"
        onClick={() => setOpen((v) => !v)}
        style={{ width: 36, height: 36 }}
        aria-label="Notifiche"
      >
        <div className="notif-bell-wrap">
          <Bell size={16} />
          {unread > 0 && (
            <div className="notif-badge">{unread > 9 ? '9+' : unread}</div>
          )}
        </div>
      </button>

      {open && (
        <>
          <div style={{ position: 'fixed', inset: 0, zIndex: 999 }} onClick={() => setOpen(false)} />
          <div style={{
            position: 'absolute',
            top: '100%',
            right: 0,
            marginTop: 8,
            width: 320,
            background: 'var(--card)',
            border: '1px solid var(--card-border)',
            borderRadius: 'var(--r-md)',
            boxShadow: 'var(--shadow-md)',
            zIndex: 1000,
            overflow: 'hidden',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 16px', borderBottom: '1px solid var(--border)' }}>
              <div style={{ fontWeight: 700, fontSize: 15 }}>Notifiche</div>
              {unread > 0 && (
                <button style={{ fontSize: 12, color: 'var(--primary)', fontWeight: 600, cursor: 'pointer', fontFamily: 'var(--font)', border: 'none', background: 'none' }} onClick={markAll}>
                  Segna tutte come lette
                </button>
              )}
            </div>
            {notifs.length === 0 ? (
              <div style={{ padding: 32, textAlign: 'center', color: 'var(--muted)', fontSize: 14 }}>Nessuna notifica</div>
            ) : (
              notifs.map((n) => (
                <div key={n.id} style={{
                  display: 'flex',
                  gap: 12,
                  padding: '12px 16px',
                  background: n.read ? 'transparent' : 'var(--primary-soft)',
                  borderBottom: '1px solid var(--border)',
                  cursor: 'pointer',
                  transition: 'background 0.15s',
                }}
                  onClick={() => setNotifs((prev) => prev.map((x) => x.id === n.id ? { ...x, read: true } : x))}
                >
                  <div style={{
                    width: 8, height: 8, borderRadius: '50%',
                    background: n.read ? 'transparent' : typeColors[n.type] ?? 'var(--primary)',
                    marginTop: 6, flexShrink: 0,
                  }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, color: 'var(--color)', lineHeight: 1.4 }}>{n.message}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 3 }}>{n.time}</div>
                  </div>
                </div>
              ))
            )}
          </div>
        </>
      )}
    </div>
  )
}
