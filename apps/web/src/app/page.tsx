'use client'

import {
  BookOpen, Award, TrendingUp,
  ArrowRight, Clock, Zap, Target, BarChart2, Trophy, Sparkles,
} from 'lucide-react'
import Link from 'next/link'
import { StreakCounter, XPBar } from '@/components/XPBar'
import { WeeklyGoals } from '@/components/WeeklyGoals'
import { PlannerWidget } from '@/components/DailyPlan'
import { BadgeCard, BADGE_DEFS } from '@/components/BadgeCard'

const stats = [
  { label: 'CFU Ottenuti',   value: '81',   sub: 'su 180 totali',      icon: Award,      color: '#0055FF' },
  { label: 'Esami Superati', value: '9',    sub: 'su 14 materie',      icon: BookOpen,   color: '#22C55E' },
  { label: 'Media Voti',     value: '27.4', sub: 'su 30',              icon: TrendingUp, color: '#F59E0B' },
  { label: 'XP Totali',      value: '1240', sub: 'Livello: Studente',  icon: Zap,        color: '#7C3AED' },
]

const upcomingExams = [
  { subject: 'Anatomia Umana',       date: '15 Mag 2026', days: 24, color: '#FF6B6B' },
  { subject: 'Fisiologia Applicata', date: '28 Mag 2026', days: 37, color: '#4ECDC4' },
  { subject: 'Biomeccanica',         date: '10 Giu 2026', days: 50, color: '#45B7D1' },
]

const recentSubjects = [
  { name: 'Teoria e Metodologia', progress: 72, color: '#96CEB4', cfu: 12 },
  { name: 'Fisiologia Applicata', progress: 55, color: '#4ECDC4', cfu: 9  },
  { name: 'Pedagogia dello Sport', progress: 40, color: '#DDA0DD', cfu: 6  },
]

const quickActions = [
  { label: 'Analytics',  icon: BarChart2, href: '/analytics', color: '#0055FF' },
  { label: 'Badge',      icon: Trophy,    href: '/badge',      color: '#F59E0B' },
  { label: 'Planner',   icon: Sparkles,  href: '/planner',    color: '#7C3AED' },
  { label: 'CFU',       icon: Target,    href: '/cfu',         color: '#22C55E' },
]

// Badge recenti sbloccati (mock)
const recentBadges = [
  BADGE_DEFS.find(b => b.id === 'maratoneta')!,
  BADGE_DEFS.find(b => b.id === 'primo_esame')!,
  BADGE_DEFS.find(b => b.id === 'scrittore')!,
]

export default function Home() {
  const cfuPercent = Math.round((81 / 180) * 100)

  return (
    <div>
      {/* Header gradient */}
      <div className="gradient-header" style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 6 }}>
          Lunedì, 21 Aprile 2026
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, marginBottom: 4 }}>
          Ciao, Marco! 👋
        </div>
        <div style={{ fontSize: 15, opacity: 0.85 }}>
          Hai 3 esami nelle prossime settimane. Continua così!
        </div>
      </div>

      {/* Stats row */}
      <div className="stats-row">
        {stats.map(({ label, value, sub, icon: Icon, color }) => (
          <div key={label} className="stat-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="stat-label">{label}</span>
              <div style={{
                width: 32, height: 32, borderRadius: 8,
                background: `${color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <Icon size={16} color={color} />
              </div>
            </div>
            <div className="stat-value" style={{ color }}>{value}</div>
            <div className="stat-sub">{sub}</div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 20 }}>
        {/* Left column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Streak + XP */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <StreakCounter current={12} max={18} />
            <div className="card" style={{ background: 'linear-gradient(135deg,#7C3AED18,#0055FF12)', borderColor: '#7C3AED25' }}>
              <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 8 }}>Livello & XP</div>
              <XPBar xp={1240} compact />
            </div>
          </div>

          {/* CFU Progress */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color)' }}>Progresso CFU</div>
                <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>
                  81 di 180 CFU completati
                </div>
              </div>
              <Link href="/cfu" className="btn btn-secondary" style={{ fontSize: 13, padding: '6px 14px' }}>
                Dettaglio <ArrowRight size={14} />
              </Link>
            </div>
            <div className="progress-bar" style={{ height: 10, marginBottom: 10 }}>
              <div className="progress-fill" style={{ width: `${cfuPercent}%` }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, color: 'var(--muted)' }}>
              <span>{cfuPercent}% completato</span>
              <span>99 CFU rimanenti</span>
            </div>
          </div>

          {/* Materie recenti */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color)' }}>Materie recenti</div>
              <Link href="/materie" style={{ fontSize: 13, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                Vedi tutte <ArrowRight size={14} />
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recentSubjects.map(({ name, progress, color, cfu }) => (
                <div key={name}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 4, background: color, flexShrink: 0 }} />
                      <span style={{ fontSize: 14, fontWeight: 500, color: 'var(--color)' }}>{name}</span>
                      <span style={{ fontSize: 12, color: 'var(--muted)' }}>{cfu} CFU</span>
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color }}>{progress}%</span>
                  </div>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%`, background: color }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Obiettivi settimanali mini */}
          <div className="card">
            <WeeklyGoals compact />
          </div>

          {/* Quick actions */}
          <div className="card">
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color)', marginBottom: 14 }}>Azioni rapide</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 10 }}>
              {quickActions.map(({ label, icon: Icon, href, color }) => (
                <Link key={label} href={href} style={{ textDecoration: 'none' }}>
                  <div style={{
                    display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
                    padding: '16px 8px', borderRadius: 12,
                    background: 'var(--surface)', border: '1px solid var(--border)',
                    cursor: 'pointer', transition: 'border-color 0.15s',
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: 10,
                      background: `${color}18`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Icon size={18} color={color} />
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--color)', textAlign: 'center' }}>{label}</span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Right column */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Prossimi esami */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color)' }}>Prossimi esami</div>
              <Link href="/cfu" style={{ fontSize: 13, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                Tutti <ArrowRight size={14} />
              </Link>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {upcomingExams.map(({ subject, date, days, color }) => (
                <div key={subject} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 14px', borderRadius: 10,
                  background: 'var(--surface)', border: '1px solid var(--border)',
                }}>
                  <div style={{ width: 4, height: 40, borderRadius: 2, background: color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color)', marginBottom: 2 }}>{subject}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                      <Clock size={11} /> {date}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{
                      fontSize: 18, fontWeight: 800, lineHeight: 1,
                      color: days <= 14 ? 'var(--error)' : days <= 21 ? 'var(--warning)' : 'var(--primary)',
                    }}>
                      {days}
                    </div>
                    <div style={{ fontSize: 10, color: 'var(--muted)' }}>giorni</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Badge recenti */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color)' }}>Badge recenti</div>
              <Link href="/badge" style={{ fontSize: 13, color: 'var(--primary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                Tutti <ArrowRight size={14} />
              </Link>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 8 }}>
              {recentBadges.map(badge => (
                <BadgeCard key={badge.id} badge={badge} unlocked size="sm" />
              ))}
            </div>
          </div>

          {/* Planner widget */}
          <div className="card" style={{ background: 'linear-gradient(135deg,#0055FF08,#7C3AED06)', borderColor: '#0055FF15' }}>
            <PlannerWidget />
            <Link href="/planner" className="btn btn-outline" style={{ marginTop: 12, fontSize: 13, padding: '7px 14px', width: '100%', justifyContent: 'center' }}>
              Vedi piano completo <ArrowRight size={13} />
            </Link>
          </div>

          {/* Suggerimento del giorno */}
          <div className="card" style={{ background: 'linear-gradient(135deg,#0055FF11,#7C3AED11)', borderColor: '#0055FF22' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--primary)', letterSpacing: 0.5, textTransform: 'uppercase', marginBottom: 8 }}>
              Suggerimento
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color)', lineHeight: 1.5, marginBottom: 8 }}>
              Ripeti le ultime 3 slide di Anatomia prima dell&apos;esame
            </div>
            <div style={{ fontSize: 13, color: 'var(--muted)' }}>
              Hai un esame tra 24 giorni. Inizia a ripassare adesso!
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
