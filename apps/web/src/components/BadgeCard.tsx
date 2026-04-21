'use client'

import { useState, useEffect } from 'react'
import {
  Play, Flame, Zap, Brain, Layers3, Timer,
  FolderOpen, NotebookPen, MessageCircle, Award,
  Target, GraduationCap, Share2, Moon, Sunrise,
  Lock, CheckCircle,
} from 'lucide-react'

export interface BadgeDef {
  id: string
  name: string
  description: string
  icon: string
  color: string
  category: string
}

export interface UserBadge {
  badge_id: string
  unlocked_at: string
}

const ICON_MAP: Record<string, any> = {
  Play, Flame, Zap, Brain, Layers3, Timer,
  FolderOpen, NotebookPen, MessageCircle, Award,
  Target, GraduationCap, Share2, Moon, Sunrise,
}

const BADGE_DEFS: BadgeDef[] = [
  { id: 'primo_passo',      name: 'Primo Passo',       description: 'Prima sessione di studio completata',              icon: 'Play',          color: '#22C55E', category: 'general'   },
  { id: 'maratoneta',       name: 'Maratoneta',        description: '7 giorni di streak consecutivi',                   icon: 'Flame',         color: '#F43F5E', category: 'general'   },
  { id: 'inarrestabile',    name: 'Inarrestabile',     description: '30 giorni di streak consecutivi',                  icon: 'Zap',           color: '#F59E0B', category: 'general'   },
  { id: 'quiz_master',      name: 'Quiz Master',       description: '100 quiz completati',                              icon: 'Brain',         color: '#7C3AED', category: 'study'     },
  { id: 'memoria_di_ferro', name: 'Memoria di Ferro',  description: '500 flashcard reviewate',                          icon: 'Layers3',       color: '#0055FF', category: 'study'     },
  { id: 'pomodoro_pro',     name: 'Pomodoro Pro',      description: '50 sessioni Pomodoro completate',                  icon: 'Timer',         color: '#EF4444', category: 'study'     },
  { id: 'bibliotecario',    name: 'Bibliotecario',     description: '20 materiali caricati',                            icon: 'FolderOpen',    color: '#8B5CF6', category: 'study'     },
  { id: 'scrittore',        name: 'Scrittore',         description: '30 note create',                                   icon: 'NotebookPen',   color: '#06B6D4', category: 'study'     },
  { id: 'amico_di_samo',    name: 'Amico di Samo',     description: '100 messaggi con AI assistant',                   icon: 'MessageCircle', color: '#5C8BFF', category: 'social'    },
  { id: 'primo_esame',      name: 'Primo Esame',       description: 'Primo esame registrato come superato',             icon: 'Award',         color: '#F59E0B', category: 'milestone' },
  { id: 'meta_traguardo',   name: 'Metà Traguardo',    description: '50% CFU completati',                               icon: 'Target',        color: '#22C55E', category: 'milestone' },
  { id: 'quasi_laureato',   name: 'Quasi Laureato',    description: '80% CFU completati',                               icon: 'GraduationCap', color: '#0055FF', category: 'milestone' },
  { id: 'condivisione',     name: 'Condivisione',      description: 'Primo appunto condiviso con la community',         icon: 'Share2',        color: '#10B981', category: 'social'    },
  { id: 'nottambulo',       name: 'Nottambulo',        description: 'Sessione di studio dopo mezzanotte',               icon: 'Moon',          color: '#6366F1', category: 'general'   },
  { id: 'mattiniero',       name: 'Mattiniero',        description: 'Sessione di studio prima delle 7',                 icon: 'Sunrise',       color: '#F59E0B', category: 'general'   },
]

export { BADGE_DEFS }

// ── Badge Card ────────────────────────────────────────────────────────────────
interface BadgeCardProps {
  badge: BadgeDef
  unlocked?: boolean
  unlockedAt?: string
  size?: 'sm' | 'md' | 'lg'
}

export function BadgeCard({ badge, unlocked = false, unlockedAt, size = 'md' }: BadgeCardProps) {
  const Icon = ICON_MAP[badge.icon] ?? Award
  const iconSize = size === 'sm' ? 20 : size === 'lg' ? 32 : 26
  const containerSize = size === 'sm' ? 44 : size === 'lg' ? 64 : 54

  return (
    <div className="card" style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      padding: size === 'sm' ? '12px 10px' : '18px 14px',
      gap: size === 'sm' ? 8 : 12,
      opacity: unlocked ? 1 : 0.5,
      transition: 'all 0.2s',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {unlocked && (
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: 3,
          background: `linear-gradient(90deg, ${badge.color}, ${badge.color}80)`,
        }} />
      )}
      <div style={{
        width: containerSize, height: containerSize,
        borderRadius: containerSize / 3,
        background: unlocked
          ? `linear-gradient(135deg, ${badge.color}25, ${badge.color}10)`
          : 'var(--surface)',
        border: `2px solid ${unlocked ? badge.color + '40' : 'var(--border)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        position: 'relative',
        boxShadow: unlocked ? `0 4px 16px ${badge.color}20` : 'none',
      }}>
        {unlocked
          ? <Icon size={iconSize} color={badge.color} />
          : <Lock size={iconSize - 4} color="var(--muted)" />
        }
      </div>
      <div style={{ textAlign: 'center' }}>
        <div style={{ fontSize: size === 'sm' ? 12 : 13, fontWeight: 700, color: unlocked ? 'var(--color)' : 'var(--muted)' }}>
          {badge.name}
        </div>
        {size !== 'sm' && (
          <div style={{ fontSize: 11, color: 'var(--muted)', lineHeight: 1.4, marginTop: 2 }}>
            {badge.description}
          </div>
        )}
        {unlocked && unlockedAt && (
          <div style={{ fontSize: 10, color: badge.color, marginTop: 4, fontWeight: 600 }}>
            <CheckCircle size={10} style={{ display: 'inline', marginRight: 3 }} />
            {new Date(unlockedAt).toLocaleDateString('it')}
          </div>
        )}
      </div>
    </div>
  )
}

// ── Badge Grid ────────────────────────────────────────────────────────────────
interface BadgeGridProps {
  unlockedIds?: string[]
  unlockedMap?: Record<string, string> // badge_id -> unlocked_at
  filter?: string
}

export function BadgeGrid({ unlockedIds = [], unlockedMap = {}, filter = 'all' }: BadgeGridProps) {
  const filtered = filter === 'all'
    ? BADGE_DEFS
    : BADGE_DEFS.filter(b => b.category === filter)

  return (
    <div className="grid-3" style={{ gap: 12 }}>
      {filtered.map(badge => (
        <BadgeCard
          key={badge.id}
          badge={badge}
          unlocked={unlockedIds.includes(badge.id) || badge.id in unlockedMap}
          unlockedAt={unlockedMap[badge.id]}
        />
      ))}
    </div>
  )
}

// ── Badge Unlock Toast ────────────────────────────────────────────────────────
interface BadgeUnlockToastProps {
  badge: BadgeDef | null
  onClose: () => void
}

export function BadgeUnlockToast({ badge, onClose }: BadgeUnlockToastProps) {
  useEffect(() => {
    if (!badge) return
    const t = setTimeout(onClose, 4000)
    return () => clearTimeout(t)
  }, [badge, onClose])

  if (!badge) return null
  const Icon = ICON_MAP[badge.icon] ?? Award

  return (
    <div style={{
      position: 'fixed', bottom: 100, right: 24,
      background: 'var(--card)',
      border: `1px solid ${badge.color}40`,
      borderRadius: 16,
      padding: '14px 18px',
      boxShadow: `0 8px 32px ${badge.color}25, var(--shadow-md)`,
      display: 'flex', alignItems: 'center', gap: 14,
      zIndex: 2000,
      animation: 'badge-toast-in 0.4s cubic-bezier(0.16,1,0.3,1)',
      maxWidth: 320,
    }}>
      <div style={{
        width: 44, height: 44, borderRadius: 12,
        background: `linear-gradient(135deg, ${badge.color}30, ${badge.color}15)`,
        border: `2px solid ${badge.color}50`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={22} color={badge.color} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: badge.color, textTransform: 'uppercase', letterSpacing: 0.5 }}>
          Badge Sbloccato!
        </div>
        <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color)', marginTop: 2 }}>{badge.name}</div>
        <div style={{ fontSize: 12, color: 'var(--muted)' }}>{badge.description}</div>
      </div>
      <button onClick={onClose} style={{ color: 'var(--muted)', fontSize: 18, lineHeight: 1, padding: 4, background: 'none', border: 'none', cursor: 'pointer' }}>
        ×
      </button>
    </div>
  )
}
