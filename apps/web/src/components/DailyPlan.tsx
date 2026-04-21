'use client'

import { useState } from 'react'
import { Check, X, Clock, Brain, Layers3, BookOpen, ChevronRight, Sparkles } from 'lucide-react'

interface PlanItem {
  id: string
  title: string
  subject: string
  subjectColor: string
  duration: number
  type: 'study' | 'quiz' | 'flashcard' | 'review'
  priority: 'low' | 'medium' | 'high'
  reason: string
  status: 'suggested' | 'accepted' | 'done' | 'skipped'
}

const TYPE_ICON: Record<string, any> = {
  study: BookOpen,
  quiz: Brain,
  flashcard: Layers3,
  review: BookOpen,
}

const PRIORITY_COLOR: Record<string, string> = {
  low: '#22C55E',
  medium: '#F59E0B',
  high: '#F43F5E',
}

const mockPlan: PlanItem[] = [
  {
    id: '1', title: 'Ripasso Anatomia — Sistemi',
    subject: 'Anatomia Umana', subjectColor: '#FF6B6B',
    duration: 45, type: 'study', priority: 'high',
    reason: 'Esame tra 24 giorni — priorità alta',
    status: 'suggested',
  },
  {
    id: '2', title: 'Quiz Fisiologia (10 domande)',
    subject: 'Fisiologia Applicata', subjectColor: '#4ECDC4',
    duration: 20, type: 'quiz', priority: 'medium',
    reason: 'Accuracy bassa questa settimana (62%)',
    status: 'suggested',
  },
  {
    id: '3', title: 'Flashcard Biomeccanica',
    subject: 'Biomeccanica', subjectColor: '#45B7D1',
    duration: 15, type: 'flashcard', priority: 'medium',
    reason: '18 card in scadenza oggi (SM-2)',
    status: 'suggested',
  },
  {
    id: '4', title: 'Note Pedagogia dello Sport',
    subject: 'Pedagogia dello Sport', subjectColor: '#DDA0DD',
    duration: 30, type: 'study', priority: 'low',
    reason: 'Progresso basso (40%)',
    status: 'suggested',
  },
]

// ── Plan Suggestion Card ───────────────────────────────────────────────────────
interface PlanSuggestionProps {
  item: PlanItem
  onAccept: () => void
  onSkip: () => void
}

export function PlanSuggestion({ item, onAccept, onSkip }: PlanSuggestionProps) {
  const Icon = TYPE_ICON[item.type]
  const priorityColor = PRIORITY_COLOR[item.priority]

  return (
    <div style={{
      padding: '14px 16px',
      borderRadius: 12,
      background: 'var(--surface)',
      border: `1px solid var(--border)`,
      borderLeft: `3px solid ${priorityColor}`,
      display: 'flex', alignItems: 'center', gap: 12,
      transition: 'all 0.2s',
    }}>
      <div style={{
        width: 38, height: 38, borderRadius: 10,
        background: `${item.subjectColor}18`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        flexShrink: 0,
      }}>
        <Icon size={18} color={item.subjectColor} />
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color)', marginBottom: 2 }}>
          {item.title}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: 'var(--muted)' }}>
            <div style={{ width: 6, height: 6, borderRadius: 3, background: item.subjectColor }} />
            {item.subject}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontSize: 11, color: 'var(--muted)' }}>
            <Clock size={10} /> {item.duration} min
          </div>
        </div>
        <div style={{ fontSize: 11, color: priorityColor, marginTop: 3, fontWeight: 600 }}>
          {item.reason}
        </div>
      </div>

      <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
        <button
          onClick={onSkip}
          style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'var(--error-soft)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--error)',
          }}>
          <X size={14} />
        </button>
        <button
          onClick={onAccept}
          style={{
            width: 30, height: 30, borderRadius: 8,
            background: 'var(--success-soft)',
            border: 'none', cursor: 'pointer',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'var(--success)',
          }}>
          <Check size={14} />
        </button>
      </div>
    </div>
  )
}

// ── Daily Plan ─────────────────────────────────────────────────────────────────
export function DailyPlan() {
  const [items, setItems] = useState(mockPlan)

  const accept = (id: string) => setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'accepted' } : i))
  const skip   = (id: string) => setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'skipped' } : i))
  const done   = (id: string) => setItems(prev => prev.map(i => i.id === id ? { ...i, status: 'done' } : i))

  const suggested = items.filter(i => i.status === 'suggested')
  const accepted  = items.filter(i => i.status === 'accepted')
  const skipped   = items.filter(i => i.status === 'skipped')
  const doneItems = items.filter(i => i.status === 'done')

  const totalMin = accepted.reduce((s, i) => s + i.duration, 0) + suggested.reduce((s, i) => s + i.duration, 0)

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {/* Header */}
      <div style={{
        padding: '14px 18px', borderRadius: 14,
        background: 'linear-gradient(135deg, var(--primary)12, #7C3AED10)',
        border: '1px solid var(--primary)20',
        display: 'flex', alignItems: 'center', gap: 12,
      }}>
        <Sparkles size={20} color="var(--primary)" />
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color)' }}>Piano Intelligente di Oggi</div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>
            {items.filter(i => i.status !== 'skipped').length} sessioni · ~{totalMin} min totali
          </div>
        </div>
      </div>

      {/* Suggested */}
      {suggested.length > 0 && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
            Suggeriti
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {suggested.map(item => (
              <PlanSuggestion key={item.id} item={item} onAccept={() => accept(item.id)} onSkip={() => skip(item.id)} />
            ))}
          </div>
        </div>
      )}

      {/* Accepted */}
      {accepted.length > 0 && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--success)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
            Nel Piano
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {accepted.map(item => {
              const Icon = TYPE_ICON[item.type]
              return (
                <div key={item.id} style={{
                  padding: '12px 16px', borderRadius: 12,
                  background: 'var(--success-soft)',
                  border: '1px solid rgba(34,197,94,0.2)',
                  display: 'flex', alignItems: 'center', gap: 10,
                }}>
                  <Icon size={16} color="var(--success)" />
                  <div style={{ flex: 1, fontSize: 13, fontWeight: 600, color: 'var(--color)' }}>{item.title}</div>
                  <button onClick={() => done(item.id)} className="btn btn-primary" style={{ fontSize: 11, padding: '5px 12px' }}>
                    Fatto
                  </button>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Done */}
      {doneItems.length > 0 && (
        <div>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
            Completati oggi
          </div>
          {doneItems.map(item => (
            <div key={item.id} style={{
              padding: '10px 16px', borderRadius: 12,
              background: 'var(--surface)',
              display: 'flex', alignItems: 'center', gap: 8,
              opacity: 0.7, marginBottom: 6,
            }}>
              <Check size={14} color="var(--success)" />
              <span style={{ fontSize: 13, color: 'var(--muted)', textDecoration: 'line-through' }}>{item.title}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Planner Widget (mini per la home) ─────────────────────────────────────────
export function PlannerWidget() {
  const topItem = mockPlan[0]
  const Icon = TYPE_ICON[topItem.type]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color)', marginBottom: 2 }}>
        Suggerimento del Planner
      </div>
      <div style={{
        padding: '12px 14px', borderRadius: 10,
        background: 'var(--surface)',
        border: `1px solid ${PRIORITY_COLOR[topItem.priority]}30`,
        borderLeft: `3px solid ${PRIORITY_COLOR[topItem.priority]}`,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>
        <Icon size={16} color={topItem.subjectColor} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--color)' }}>{topItem.title}</div>
          <div style={{ fontSize: 11, color: 'var(--muted)' }}>{topItem.duration} min · {topItem.subject}</div>
        </div>
        <ChevronRight size={14} color="var(--muted)" />
      </div>
    </div>
  )
}
