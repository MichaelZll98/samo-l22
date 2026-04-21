'use client'

import Link from 'next/link'
import { useState } from 'react'
import {
  Brain,
  Layers3,
  FileText,
  MessageSquare,
  Zap,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle2,
  Clock,
  ChevronRight,
  Sparkles,
} from 'lucide-react'

// Dati mock per demo
const USAGE_TODAY = { generate: 3, qa: 7, parse: 2, limit: 20 }

const recentJobs = [
  { id: 'j1', type: 'generate_quiz',       title: 'Quiz - Anatomia Arto Superiore', status: 'completed', createdAt: '2 min fa' },
  { id: 'j2', type: 'generate_flashcards', title: 'Flashcard - Fisiologia Cardiaca', status: 'completed', createdAt: '1 ora fa' },
  { id: 'j3', type: 'generate_summary',    title: 'Riassunto - Biomeccanica Corsa',  status: 'processing', createdAt: '5 min fa' },
]

const weakTopics = [
  { topic: 'Anatomia muscoli spalla', strength: 32, subject: 'Anatomia', trend: 'down' },
  { topic: 'Fisiologia cardiopolmonare', strength: 45, subject: 'Fisiologia', trend: 'up' },
  { topic: 'Cinematica articolare', strength: 28, subject: 'Biomeccanica', trend: 'down' },
]

const generateCards = [
  {
    key: 'quiz',
    href: '/ai-generate/quiz',
    icon: Brain,
    label: 'Genera Quiz',
    description: 'Crea 10-20 domande da PDF o note. Risposta multipla, V/F e completamento.',
    color: '#5C8BFF',
    colorSoft: 'rgba(92,139,255,0.1)',
    badge: 'Popolare',
    badgeClass: 'badge-primary',
  },
  {
    key: 'flashcard',
    href: '/ai-generate/flashcard',
    icon: Layers3,
    label: 'Genera Flashcard',
    description: 'Crea un deck di flashcard con fronte/retro da qualsiasi materiale.',
    color: '#7C3AED',
    colorSoft: 'rgba(124,58,237,0.1)',
    badge: 'SM-2 Ready',
    badgeClass: 'badge-info',
  },
  {
    key: 'summary',
    href: '/ai-generate/summary',
    icon: FileText,
    label: 'Genera Riassunto',
    description: 'Sintetizza materiali lunghi in 3 livelli: breve, medio, dettagliato.',
    color: '#22C55E',
    colorSoft: 'rgba(34,197,94,0.1)',
    badge: 'Markdown',
    badgeClass: 'badge-success',
  },
  {
    key: 'qa',
    href: '/ai-generate/qa',
    icon: MessageSquare,
    label: 'Chiedi ai Documenti',
    description: 'Fai domande specifiche ai tuoi PDF e slide. Risposte con citazioni.',
    color: '#F59E0B',
    colorSoft: 'rgba(245,158,11,0.1)',
    badge: 'RAG',
    badgeClass: 'badge-warning',
  },
]

const jobTypeLabel: Record<string, string> = {
  generate_quiz:       'Quiz',
  generate_flashcards: 'Flashcard',
  generate_summary:    'Riassunto',
  document_qa:         'Q&A',
  parse_document:      'Parsing',
}

function StatusIcon({ status }: { status: string }) {
  if (status === 'completed') return <CheckCircle2 size={14} color="var(--success)" />
  if (status === 'processing') return <Clock size={14} color="var(--warning)" style={{ animation: 'spin 1s linear infinite' }} />
  if (status === 'failed')     return <AlertTriangle size={14} color="var(--error)" />
  return <Clock size={14} color="var(--muted)" />
}

export default function AIGenerateHub() {
  const usagePercent = Math.round((USAGE_TODAY.generate / USAGE_TODAY.limit) * 100)

  return (
    <div>
      {/* Header */}
      <div className="gradient-header" style={{ background: 'linear-gradient(135deg, #5C8BFF 0%, #7C3AED 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'rgba(255,255,255,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Sparkles size={22} color="white" />
          </div>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: 'white', margin: 0 }}>AI Studio</h1>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)', margin: 0 }}>
              Samo genera quiz, flashcard e riassunti dai tuoi materiali
            </p>
          </div>
        </div>

        {/* Usage bar */}
        <div style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '10px 14px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: 600 }}>
              Generazioni oggi
            </span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.85)', fontWeight: 700 }}>
              {USAGE_TODAY.generate}/{USAGE_TODAY.limit}
            </span>
          </div>
          <div style={{ height: 6, background: 'rgba(255,255,255,0.25)', borderRadius: 9999, overflow: 'hidden' }}>
            <div style={{
              height: '100%', borderRadius: 9999,
              background: usagePercent > 80 ? '#F43F5E' : 'rgba(255,255,255,0.9)',
              width: `${usagePercent}%`,
              transition: 'width 0.4s ease',
            }} />
          </div>
        </div>
      </div>

      {/* Generate Cards */}
      <div style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color)', marginBottom: 14 }}>
          Cosa vuoi generare?
        </h2>
        <div className="grid-2" style={{ gap: 14 }}>
          {generateCards.map((card) => (
            <Link key={card.key} href={card.href} style={{ textDecoration: 'none' }}>
              <div className="ai-gen-card">
                <div className="ai-gen-card-icon" style={{ background: card.colorSoft, color: card.color }}>
                  <card.icon size={22} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--color)' }}>{card.label}</span>
                    <span className={`badge ${card.badgeClass}`}>{card.badge}</span>
                  </div>
                  <p style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5, margin: 0 }}>
                    {card.description}
                  </p>
                </div>
                <ChevronRight size={16} color="var(--muted)" style={{ flexShrink: 0 }} />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Bottom row: weak topics + recent jobs */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>

        {/* Argomenti deboli */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <AlertTriangle size={16} color="var(--warning)" />
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color)' }}>Argomenti Deboli</span>
            <span className="badge badge-warning" style={{ marginLeft: 'auto' }}>Da ripassare</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {weakTopics.map((t) => (
              <div key={t.topic} style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color)' }}>{t.topic}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{t.subject}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                    {t.trend === 'up'
                      ? <TrendingUp size={12} color="var(--success)" />
                      : <TrendingDown size={12} color="var(--error)" />}
                    <span style={{
                      fontSize: 13, fontWeight: 700,
                      color: t.strength < 40 ? 'var(--error)' : t.strength < 60 ? 'var(--warning)' : 'var(--success)',
                    }}>
                      {t.strength}%
                    </span>
                  </div>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{
                    width: `${t.strength}%`,
                    background: t.strength < 40 ? 'var(--error)' : t.strength < 60 ? 'var(--warning)' : 'var(--success)',
                  }} />
                </div>
              </div>
            ))}
          </div>
          <Link href="/ai-generate/quiz" style={{ textDecoration: 'none' }}>
            <button className="btn btn-outline" style={{ width: '100%', marginTop: 14, justifyContent: 'center' }}>
              <Zap size={14} />
              Genera quiz su questi argomenti
            </button>
          </Link>
        </div>

        {/* Job recenti */}
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Clock size={16} color="var(--muted)" />
            <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color)' }}>Generazioni Recenti</span>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {recentJobs.map((job) => (
              <div key={job.id} className="ai-job-item">
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                  <StatusIcon status={job.status} />
                  <div style={{ minWidth: 0 }}>
                    <div style={{
                      fontSize: 13, fontWeight: 600, color: 'var(--color)',
                      overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                    }}>
                      {job.title}
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                      {jobTypeLabel[job.type]} · {job.createdAt}
                    </div>
                  </div>
                </div>
                <span className={`badge ${
                  job.status === 'completed' ? 'badge-success' :
                  job.status === 'processing' ? 'badge-warning' : 'badge-error'
                }`}>
                  {job.status === 'completed' ? 'Fatto' : job.status === 'processing' ? 'In corso' : 'Errore'}
                </span>
              </div>
            ))}
          </div>
          {recentJobs.length === 0 && (
            <div style={{ textAlign: 'center', padding: '20px 0', color: 'var(--muted)', fontSize: 13 }}>
              Nessuna generazione ancora. Inizia da una delle opzioni sopra!
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
