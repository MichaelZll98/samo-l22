import { StudyHeatmap } from '@/components/StudyHeatmap'
import { BarChart, LineChart, RadarChart, PerformanceChart } from '@/components/PerformanceChart'
import { TrendCard } from '@/components/TrendCard'
import { BarChart2, TrendingUp, Target, Zap } from 'lucide-react'

// Mock data
const weeklyHours = [
  { label: 'Lun', value: 2.5 },
  { label: 'Mar', value: 3.0 },
  { label: 'Mer', value: 1.5 },
  { label: 'Gio', value: 4.0 },
  { label: 'Ven', value: 2.0 },
  { label: 'Sab', value: 1.0 },
  { label: 'Dom', value: 0.5 },
]

const monthlyHours = [
  { label: 'Gen', value: 38 },
  { label: 'Feb', value: 42 },
  { label: 'Mar', value: 35 },
  { label: 'Apr', value: 51 },
]

const quizAccuracy = [
  { label: 'Anatomia',    value: 78, color: '#FF6B6B', sub: '78 quiz completati' },
  { label: 'Fisiologia',  value: 62, color: '#4ECDC4', sub: '45 quiz completati' },
  { label: 'Biomeccanica',value: 85, color: '#45B7D1', sub: '30 quiz completati' },
  { label: 'Pedagogia',   value: 71, color: '#DDA0DD', sub: '22 quiz completati' },
  { label: 'Nutrizione',  value: 68, color: '#96CEB4', sub: '18 quiz completati' },
]

const flashRetention = [
  { label: 'Anatomia',     value: 82, color: '#FF6B6B', sub: '210 card totali' },
  { label: 'Fisiologia',   value: 70, color: '#4ECDC4', sub: '180 card totali' },
  { label: 'Biomeccanica', value: 91, color: '#45B7D1', sub: '95 card totali'  },
]

const radarData = [
  { label: 'Quiz',       value: 74 },
  { label: 'Flashcard',  value: 81 },
  { label: 'Note',       value: 65 },
  { label: 'Pomodoro',   value: 70 },
  { label: 'Materiali',  value: 55 },
  { label: 'Costanza',   value: 88 },
]

const weeklyTrend = [
  { label: 'S-4', value: 12 },
  { label: 'S-3', value: 15 },
  { label: 'S-2', value: 10 },
  { label: 'Sett', value: 14 },
]

export default function AnalyticsPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Analytics</h1>
        <p className="page-subtitle">Monitora le tue performance e i progressi di studio</p>
      </div>

      {/* Trend Cards */}
      <div className="stats-row" style={{ marginBottom: 24 }}>
        <TrendCard label="Ore questa settimana" current={14} previous={10} unit="h" color="#0055FF" />
        <TrendCard label="Quiz completati" current={8} previous={5} color="#7C3AED" />
        <TrendCard label="Flashcard reviewate" current={120} previous={95} color="#22C55E" />
        <TrendCard label="XP guadagnati" current={380} previous={250} color="#F59E0B" />
      </div>

      {/* Heatmap */}
      <div className="card" style={{ marginBottom: 20 }}>
        <StudyHeatmap />
      </div>

      {/* Row: Bar charts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <BarChart2 size={18} color="var(--primary)" />
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color)' }}>Ore per giorno (settimana)</div>
          </div>
          <BarChart data={weeklyHours} color="#0055FF" height={130} unit="h" />
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <TrendingUp size={18} color="#22C55E" />
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color)' }}>Ore per mese</div>
          </div>
          <BarChart data={monthlyHours} color="#22C55E" height={130} unit="h" />
        </div>
      </div>

      {/* Row: Performance + Radar */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 280px', gap: 20, marginBottom: 20 }}>
        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Target size={18} color="#7C3AED" />
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color)' }}>Quiz Accuracy per Materia</div>
          </div>
          <PerformanceChart items={quizAccuracy} />
        </div>

        <div className="card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <Zap size={18} color="#F59E0B" />
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color)' }}>Flashcard Retention</div>
          </div>
          <PerformanceChart items={flashRetention} />
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color)', marginBottom: 12, alignSelf: 'flex-start' }}>
            Performance Globale
          </div>
          <RadarChart data={radarData} color="#0055FF" size={220} />
        </div>
      </div>

      {/* Weekly trend line */}
      <div className="card">
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color)', marginBottom: 16 }}>
          Trend Ore di Studio (ultime 4 settimane)
        </div>
        <LineChart data={weeklyTrend} color="#0055FF" height={100} />
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginTop: 12 }}>
          {weeklyTrend.map((d, i) => (
            <div key={i} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 16, fontWeight: 800, color: 'var(--primary)' }}>{d.value}h</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>{d.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
