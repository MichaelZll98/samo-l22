import { Award, Plus, TrendingUp, Calendar } from 'lucide-react'

const exams = [
  { subject: 'Anatomia Umana', date: '20 Gen 2026', grade: 29, cfu: 9, status: 'passed', color: '#FF6B6B' },
  { subject: 'Chirurgia Ortopedica', date: '15 Feb 2026', grade: 27, cfu: 9, status: 'passed', color: '#BB8FCE' },
  { subject: 'Psicologia dello Sport', date: '10 Mar 2026', grade: 30, cfu: 6, status: 'passed', color: '#F1948A' },
  { subject: 'Nutrizione Sportiva', date: '18 Mar 2026', grade: 28, cfu: 6, status: 'passed', color: '#FFEAA7' },
  { subject: 'Riabilitazione Funzionale', date: '05 Apr 2026', grade: 26, cfu: 12, status: 'passed', color: '#82E0AA' },
  { subject: 'Anatomia II', date: '20 Apr 2026', grade: 30, cfu: 9, status: 'passed', color: '#FF6B6B' },
  { subject: 'Etica e Deontologia', date: '18 Mar 2026', grade: 28, cfu: 6, status: 'passed', color: '#FAD7A0' },
  { subject: 'Statistica', date: '18 Apr 2026', grade: 25, cfu: 6, status: 'passed', color: '#85C1E9' },
  { subject: 'TMA I', date: '29 Apr 2026', grade: 28, cfu: 6, status: 'passed', color: '#96CEB4' },
  { subject: 'Anatomia Umana', date: '15 Mag 2026', cfu: 9, status: 'planned', color: '#FF6B6B', days: 24 },
  { subject: 'Fisiologia Applicata', date: '28 Mag 2026', cfu: 9, status: 'planned', color: '#4ECDC4', days: 37 },
  { subject: 'Biomeccanica', date: '10 Giu 2026', cfu: 6, status: 'planned', color: '#45B7D1', days: 50 },
]

const passedExams = exams.filter(e => e.status === 'passed')
const plannedExams = exams.filter(e => e.status === 'planned')
const cfuEarned = passedExams.reduce((acc, e) => acc + e.cfu, 0)
const cfuTotal = 180
const average = (passedExams.reduce((acc, e) => acc + (e.grade ?? 0), 0) / passedExams.length).toFixed(1)

const cfuByExam = [
  { label: 'I Anno', cfu: 54, color: '#0055FF' },
  { label: 'II Anno', cfu: 27, color: '#22C55E' },
  { label: 'Tesi', cfu: 0, color: '#7C3AED' },
]

export default function CfuPage() {
  const cfuPercent = Math.round((cfuEarned / cfuTotal) * 100)

  return (
    <div>
      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-title">Tracker CFU</h1>
            <p className="page-subtitle">Monitora il tuo percorso verso i 180 CFU</p>
          </div>
          <button className="btn btn-primary" style={{ fontSize: 13 }}>
            <Plus size={16} /> Aggiungi esame
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="stats-row" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <span className="stat-label">CFU ottenuti</span>
          <span className="stat-value" style={{ color: 'var(--primary)' }}>{cfuEarned}</span>
          <span className="stat-sub">su {cfuTotal} totali</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Esami superati</span>
          <span className="stat-value" style={{ color: '#22C55E' }}>{passedExams.length}</span>
          <span className="stat-sub">su {exams.length} pianificati</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Media voti</span>
          <span className="stat-value" style={{ color: '#F59E0B' }}>{average}</span>
          <span className="stat-sub">su 30</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">CFU rimanenti</span>
          <span className="stat-value" style={{ color: '#7C3AED' }}>{cfuTotal - cfuEarned}</span>
          <span className="stat-sub">per la laurea</span>
        </div>
      </div>

      {/* Main layout */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 20 }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>

          {/* Progress bar */}
          <div className="card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color)' }}>Progresso totale CFU</div>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--primary)' }}>{cfuPercent}%</span>
            </div>
            <div className="progress-bar" style={{ height: 12, marginBottom: 12 }}>
              <div className="progress-fill" style={{ width: `${cfuPercent}%` }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
              {cfuByExam.map(({ label, cfu, color }) => (
                <div key={label} style={{
                  padding: '12px 14px',
                  borderRadius: 10,
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                    <div style={{ width: 8, height: 8, borderRadius: 4, background: color }} />
                    <span style={{ fontSize: 12, color: 'var(--muted)' }}>{label}</span>
                  </div>
                  <span style={{ fontSize: 22, fontWeight: 800, color }}>{cfu}</span>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}> CFU</span>
                </div>
              ))}
            </div>
          </div>

          {/* Esami superati */}
          <div className="card">
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color)', marginBottom: 14 }}>
              Esami superati
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {passedExams.map(({ subject, date, grade, cfu, color }) => (
                <div key={`${subject}-${date}`} className="exam-card">
                  <div style={{ width: 4, height: 40, borderRadius: 2, background: color, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color)', marginBottom: 2 }}>{subject}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{date} · {cfu} CFU</div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: 20, fontWeight: 800, color: (grade ?? 0) >= 28 ? 'var(--success)' : 'var(--warning)' }}>
                      {grade}
                    </span>
                    <span style={{ fontSize: 11, color: 'var(--muted)' }}>/30</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: upcoming exams */}
        <div className="card" style={{ alignSelf: 'flex-start' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color)', marginBottom: 14 }}>
            Prossimi esami
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {plannedExams.map(({ subject, date, cfu, color, days }) => (
              <div key={`${subject}-${date}`} style={{
                padding: '14px',
                borderRadius: 10,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
              }}>
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                  <div style={{ width: 4, height: '100%', borderRadius: 2, background: color, flexShrink: 0, alignSelf: 'stretch', minHeight: 40 }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color)', marginBottom: 4 }}>{subject}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 8 }}>{date} · {cfu} CFU</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <Calendar size={12} color={color} />
                      <span style={{
                        fontSize: 12, fontWeight: 700,
                        color: (days ?? 0) <= 14 ? 'var(--error)' : (days ?? 0) <= 21 ? 'var(--warning)' : 'var(--primary)',
                      }}>
                        {days} giorni
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
