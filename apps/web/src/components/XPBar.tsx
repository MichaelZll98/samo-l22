'use client'

import { Flame, Star } from 'lucide-react'

// ── Level config ───────────────────────────────────────────────────────────────
export const LEVELS = [
  { level: 1, name: 'Matricola',    minXP: 0,    color: '#6B7280' },
  { level: 2, name: 'Studente',     minXP: 500,  color: '#22C55E' },
  { level: 3, name: 'Veterano',     minXP: 1500, color: '#0055FF' },
  { level: 4, name: 'Laureando',    minXP: 3500, color: '#7C3AED' },
  { level: 5, name: 'Dottore',      minXP: 7000, color: '#F59E0B' },
]

export function getLevelInfo(xp: number) {
  let current = LEVELS[0]
  let next = LEVELS[1]
  for (let i = LEVELS.length - 1; i >= 0; i--) {
    if (xp >= LEVELS[i].minXP) {
      current = LEVELS[i]
      next = LEVELS[i + 1] ?? null
      break
    }
  }
  const progress = next
    ? Math.round(((xp - current.minXP) / (next.minXP - current.minXP)) * 100)
    : 100
  return { current, next, progress }
}

// ── XP Bar ────────────────────────────────────────────────────────────────────
interface XPBarProps {
  xp: number
  compact?: boolean
}

export function XPBar({ xp, compact = false }: XPBarProps) {
  const { current, next, progress } = getLevelInfo(xp)

  if (compact) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)' }}>
          <span style={{ fontWeight: 700, color: current.color }}>{current.name}</span>
          <span>{xp} XP{next ? ` / ${next.minXP}` : ''}</span>
        </div>
        <div className="progress-bar" style={{ height: 6 }}>
          <div
            className="progress-fill"
            style={{ width: `${progress}%`, background: `linear-gradient(90deg, ${current.color}80, ${current.color})` }}
          />
        </div>
      </div>
    )
  }

  return (
    <div className="card" style={{ background: `linear-gradient(135deg, ${current.color}12, ${current.color}06)`, borderColor: `${current.color}25` }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 14 }}>
        <LevelBadge xp={xp} size={52} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--color)' }}>{current.name}</div>
          <div style={{ fontSize: 13, color: 'var(--muted)' }}>
            {xp.toLocaleString('it')} XP totali
          </div>
        </div>
        {next && (
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 2 }}>Prossimo livello</div>
            <div style={{ fontSize: 13, fontWeight: 700, color: next.color }}>{next.name}</div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>{next.minXP - xp} XP mancanti</div>
          </div>
        )}
      </div>
      <div className="progress-bar" style={{ height: 8, marginBottom: 6 }}>
        <div
          className="progress-fill"
          style={{
            width: `${progress}%`,
            background: `linear-gradient(90deg, ${current.color}70, ${current.color})`,
            transition: 'width 0.8s cubic-bezier(0.16,1,0.3,1)',
          }}
        />
      </div>
      {next && (
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--muted)' }}>
          <span>{progress}%</span>
          <span>{next.minXP.toLocaleString('it')} XP per {next.name}</span>
        </div>
      )}
    </div>
  )
}

// ── Level Badge ────────────────────────────────────────────────────────────────
interface LevelBadgeProps {
  xp: number
  size?: number
}

export function LevelBadge({ xp, size = 40 }: LevelBadgeProps) {
  const { current } = getLevelInfo(xp)

  return (
    <div style={{
      width: size, height: size, borderRadius: size / 4,
      background: `linear-gradient(135deg, ${current.color}, ${current.color}aa)`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      boxShadow: `0 4px 12px ${current.color}40`,
      flexShrink: 0,
    }}>
      <Star size={size * 0.4} color="white" fill="white" />
    </div>
  )
}

// ── Streak Counter ─────────────────────────────────────────────────────────────
interface StreakCounterProps {
  current: number
  max: number
  compact?: boolean
}

export function StreakCounter({ current, max, compact = false }: StreakCounterProps) {
  if (compact) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: 'linear-gradient(135deg, #F43F5E, #F59E0B)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Flame size={16} color="white" />
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: '#F43F5E', lineHeight: 1 }}>
            {current}
          </div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>giorni streak</div>
        </div>
      </div>
    )
  }

  return (
    <div className="card" style={{
      background: 'linear-gradient(135deg,#F43F5E18,#F59E0B18)',
      borderColor: '#F43F5E28',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div style={{
          width: 52, height: 52, borderRadius: 14,
          background: 'linear-gradient(135deg,#F43F5E,#F59E0B)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: '0 4px 16px #F43F5E40',
          animation: current > 0 ? 'streak-glow 2s ease-in-out infinite' : 'none',
        }}>
          <Flame size={26} color="white" />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 2 }}>Streak attuale</div>
          <div style={{ fontSize: 32, fontWeight: 800, color: '#F43F5E', letterSpacing: -1, lineHeight: 1 }}>
            {current} {current === 1 ? 'giorno' : 'giorni'}
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 4 }}>
            Record personale: {max} giorni
          </div>
        </div>
        {current >= 7 && (
          <div style={{
            padding: '6px 12px', borderRadius: 20,
            background: 'linear-gradient(135deg,#F43F5E,#F59E0B)',
            color: 'white', fontSize: 12, fontWeight: 700,
          }}>
            🔥 In fiamma!
          </div>
        )}
      </div>
    </div>
  )
}
