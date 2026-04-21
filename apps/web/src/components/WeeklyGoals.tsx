'use client'

import { useState } from 'react'
import { Target, Clock, Brain, Layers3, Timer, Edit3, Check, X } from 'lucide-react'

interface Goal {
  id: string
  label: string
  icon: any
  color: string
  current: number
  target: number
  unit: string
}

const defaultGoals: Goal[] = [
  { id: 'hours',     label: 'Ore di Studio',         icon: Clock,   color: '#0055FF', current: 6,  target: 10, unit: 'h'  },
  { id: 'quiz',      label: 'Quiz Completati',        icon: Brain,   color: '#7C3AED', current: 3,  target: 5,  unit: ''   },
  { id: 'flashcard', label: 'Flashcard Reviewate',    icon: Layers3, color: '#22C55E', current: 28, target: 50, unit: ''   },
  { id: 'pomodoro',  label: 'Sessioni Pomodoro',      icon: Timer,   color: '#F43F5E', current: 5,  target: 10, unit: ''   },
]

// ── Goal Progress Bar ─────────────────────────────────────────────────────────
interface GoalProgressBarProps {
  goal: Goal
  compact?: boolean
}

export function GoalProgressBar({ goal, compact = false }: GoalProgressBarProps) {
  const pct = Math.min(Math.round((goal.current / goal.target) * 100), 100)
  const done = pct >= 100
  const Icon = goal.icon

  if (compact) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Icon size={12} color={goal.color} />
            <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color)' }}>{goal.label}</span>
          </div>
          <span style={{ fontSize: 12, fontWeight: 700, color: done ? 'var(--success)' : goal.color }}>
            {goal.current}/{goal.target}{goal.unit}
          </span>
        </div>
        <div className="progress-bar" style={{ height: 5 }}>
          <div className="progress-fill" style={{
            width: `${pct}%`,
            background: done
              ? 'var(--success)'
              : `linear-gradient(90deg, ${goal.color}80, ${goal.color})`,
          }} />
        </div>
      </div>
    )
  }

  return (
    <div style={{
      padding: '14px 16px',
      borderRadius: 12,
      background: done ? 'var(--success-soft)' : 'var(--surface)',
      border: `1px solid ${done ? 'var(--success)' : 'var(--border)'}30`,
      transition: 'all 0.2s',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: done ? '#22C55E20' : `${goal.color}15`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={18} color={done ? 'var(--success)' : goal.color} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color)' }}>{goal.label}</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>
            {goal.current} di {goal.target}{goal.unit} · {pct}%
          </div>
        </div>
        {done && (
          <div style={{
            padding: '3px 10px', borderRadius: 20,
            background: 'var(--success)', color: 'white',
            fontSize: 11, fontWeight: 700,
          }}>
            ✓ Completato
          </div>
        )}
      </div>
      <div className="progress-bar" style={{ height: 8 }}>
        <div className="progress-fill" style={{
          width: `${pct}%`,
          background: done
            ? 'var(--success)'
            : `linear-gradient(90deg, ${goal.color}80, ${goal.color})`,
          transition: 'width 0.6s cubic-bezier(0.16,1,0.3,1)',
        }} />
      </div>
    </div>
  )
}

// ── Goal Editor ───────────────────────────────────────────────────────────────
interface GoalEditorProps {
  goals: Goal[]
  onSave: (goals: Goal[]) => void
  onCancel: () => void
}

export function GoalEditor({ goals, onSave, onCancel }: GoalEditorProps) {
  const [targets, setTargets] = useState(goals.map(g => g.target))

  return (
    <div className="card" style={{ border: '2px solid var(--primary)' }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color)', marginBottom: 14 }}>
        Modifica Obiettivi Settimanali
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {goals.map((goal, i) => {
          const Icon = goal.icon
          return (
            <div key={goal.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Icon size={16} color={goal.color} />
              <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: 'var(--color)' }}>
                {goal.label}
              </div>
              <input
                type="number"
                value={targets[i]}
                min={1}
                onChange={e => {
                  const next = [...targets]
                  next[i] = parseInt(e.target.value) || 1
                  setTargets(next)
                }}
                className="form-input"
                style={{ width: 70, padding: '6px 10px', fontSize: 14, textAlign: 'right' }}
              />
              <span style={{ fontSize: 12, color: 'var(--muted)', width: 20 }}>{goal.unit || '#'}</span>
            </div>
          )
        })}
      </div>
      <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
        <button className="btn btn-primary" style={{ flex: 1, fontSize: 13, padding: '8px 0' }}
          onClick={() => onSave(goals.map((g, i) => ({ ...g, target: targets[i] })))}>
          <Check size={14} /> Salva
        </button>
        <button className="btn btn-secondary" style={{ fontSize: 13, padding: '8px 14px' }} onClick={onCancel}>
          <X size={14} />
        </button>
      </div>
    </div>
  )
}

// ── Weekly Goals Widget ───────────────────────────────────────────────────────
interface WeeklyGoalsProps {
  compact?: boolean
}

export function WeeklyGoals({ compact = false }: WeeklyGoalsProps) {
  const [goals, setGoals] = useState(defaultGoals)
  const [editing, setEditing] = useState(false)

  const completed = goals.filter(g => g.current >= g.target).length

  if (compact) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color)' }}>Obiettivi Settimanali</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>{completed}/{goals.length} completati</div>
        </div>
        {goals.map(g => <GoalProgressBar key={g.id} goal={g} compact />)}
      </div>
    )
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color)' }}>Obiettivi Settimanali</div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>
            {completed}/{goals.length} completati · Reset lunedì
          </div>
        </div>
        <button className="btn btn-secondary" style={{ fontSize: 12, padding: '6px 12px', gap: 6 }}
          onClick={() => setEditing(true)}>
          <Edit3 size={13} /> Modifica
        </button>
      </div>

      {editing ? (
        <GoalEditor
          goals={goals}
          onSave={updated => { setGoals(updated); setEditing(false) }}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {goals.map(g => <GoalProgressBar key={g.id} goal={g} />)}
        </div>
      )}

      {/* Weekly suggestion */}
      <div style={{
        marginTop: 16, padding: '10px 14px', borderRadius: 10,
        background: 'var(--primary-soft)',
        border: '1px solid rgba(0,85,255,0.12)',
        fontSize: 12, color: 'var(--primary)', fontWeight: 600,
      }}>
        💡 Suggerimento: completa 2 quiz oggi per raggiungere il tuo obiettivo settimanale
      </div>
    </div>
  )
}
