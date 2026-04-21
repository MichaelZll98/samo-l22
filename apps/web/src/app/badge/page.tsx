'use client'

import { useState } from 'react'
import { BadgeGrid, BadgeUnlockToast, BADGE_DEFS, type BadgeDef } from '@/components/BadgeCard'
import { XPBar, StreakCounter } from '@/components/XPBar'
import { Trophy, Sparkles } from 'lucide-react'

// Mock: badge già sbloccati
const unlockedMap: Record<string, string> = {
  'primo_passo':   '2026-01-15T10:00:00Z',
  'maratoneta':    '2026-03-02T14:30:00Z',
  'primo_esame':   '2026-02-10T09:00:00Z',
  'pomodoro_pro':  '2026-03-20T18:00:00Z',
  'scrittore':     '2026-04-01T11:00:00Z',
  'nottambulo':    '2026-04-10T00:45:00Z',
}

const CATEGORIES = [
  { id: 'all',       label: 'Tutti' },
  { id: 'general',   label: 'Generali' },
  { id: 'study',     label: 'Studio' },
  { id: 'milestone', label: 'Traguardi' },
  { id: 'social',    label: 'Social' },
]

export default function BadgePage() {
  const [filter, setFilter] = useState('all')
  const [toastBadge, setToastBadge] = useState<BadgeDef | null>(null)

  const unlockedCount = Object.keys(unlockedMap).length
  const total = BADGE_DEFS.length
  const pct = Math.round((unlockedCount / total) * 100)

  // Demo: click su un badge locked simula sblocco
  const handleDemoUnlock = () => {
    const locked = BADGE_DEFS.filter(b => !(b.id in unlockedMap))
    if (locked.length > 0) setToastBadge(locked[Math.floor(Math.random() * locked.length)])
  }

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Badge & Achievement</h1>
        <p className="page-subtitle">Sblocca badge completando attività e mantenendo la costanza</p>
      </div>

      {/* Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <XPBar xp={1240} />
        <StreakCounter current={12} max={18} />
      </div>

      {/* Progress */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
          <div style={{
            width: 42, height: 42, borderRadius: 12,
            background: 'linear-gradient(135deg, #F59E0B30, #F59E0B10)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Trophy size={20} color="#F59E0B" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color)' }}>
              Collezione Badge
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>
              {unlockedCount} di {total} badge sbloccati
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800, color: '#F59E0B' }}>{pct}%</div>
        </div>
        <div className="progress-bar" style={{ height: 10 }}>
          <div className="progress-fill" style={{
            width: `${pct}%`,
            background: 'linear-gradient(90deg, #F59E0B80, #F59E0B)',
          }} />
        </div>

        {/* Demo button */}
        <button
          onClick={handleDemoUnlock}
          className="btn btn-outline"
          style={{ marginTop: 14, fontSize: 13, padding: '8px 16px' }}
        >
          <Sparkles size={14} /> Demo: simula sblocco badge
        </button>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`btn ${filter === cat.id ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: 13, padding: '7px 16px' }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Badge Grid */}
      <BadgeGrid
        unlockedMap={unlockedMap}
        filter={filter}
      />

      {/* Toast */}
      <BadgeUnlockToast badge={toastBadge} onClose={() => setToastBadge(null)} />
    </div>
  )
}
