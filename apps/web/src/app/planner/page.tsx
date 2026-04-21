import { DailyPlan } from '@/components/DailyPlan'
import { WeeklyGoals } from '@/components/WeeklyGoals'
import { RankingList } from '@/components/LeaderboardCard'
import { Trophy } from 'lucide-react'

export default function PlannerPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Planner Intelligente</h1>
        <p className="page-subtitle">Sessioni suggerite in base agli esami imminenti e alle tue performance</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
        {/* Main: piano giornaliero */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="card">
            <DailyPlan />
          </div>
        </div>

        {/* Right: goals + ranking */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <WeeklyGoals />

          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <Trophy size={18} color="#F59E0B" />
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color)' }}>Classifica del Corso</div>
            </div>
            <div style={{
              padding: '8px 12px', borderRadius: 10,
              background: 'var(--info-soft)',
              fontSize: 12, color: 'var(--info)',
              marginBottom: 12, fontWeight: 600,
            }}>
              Classifica basata sulla costanza, non sulla competizione. Dati anonimi opzionali.
            </div>
            <RankingList />
          </div>
        </div>
      </div>
    </div>
  )
}
