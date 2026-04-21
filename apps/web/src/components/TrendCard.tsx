'use client'

import { TrendingUp, TrendingDown, Minus } from 'lucide-react'

interface TrendCardProps {
  label: string
  current: number
  previous: number
  unit?: string
  color?: string
  format?: (v: number) => string
}

export function TrendCard({ label, current, previous, unit = '', color = '#0055FF', format }: TrendCardProps) {
  const diff = current - previous
  const pct = previous > 0 ? Math.round((diff / previous) * 100) : 0
  const isUp = diff > 0
  const isDown = diff < 0

  const fmt = format ?? ((v: number) => `${v}${unit}`)

  return (
    <div className="card" style={{ padding: '16px 20px' }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 28, fontWeight: 800, color, letterSpacing: -1, lineHeight: 1 }}>
          {fmt(current)}
        </div>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 4,
          padding: '4px 10px',
          borderRadius: 20,
          background: isUp ? 'var(--success-soft)' : isDown ? 'var(--error-soft)' : 'var(--surface)',
          color: isUp ? 'var(--success)' : isDown ? 'var(--error)' : 'var(--muted)',
          fontSize: 12, fontWeight: 700,
        }}>
          {isUp ? <TrendingUp size={14} /> : isDown ? <TrendingDown size={14} /> : <Minus size={14} />}
          {pct > 0 ? '+' : ''}{pct}%
        </div>
      </div>
      <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>
        Settimana scorsa: {fmt(previous)}
      </div>
    </div>
  )
}
