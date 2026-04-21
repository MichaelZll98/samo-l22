import Link from 'next/link'
import { Search, Filter } from 'lucide-react'

const subjects = [
  { id: '1', name: 'Anatomia Umana', cfu: 9, color: '#FF6B6B', progress: 100, status: 'completed', exams: 1, grade: 29 },
  { id: '2', name: 'Fisiologia Applicata', cfu: 9, color: '#4ECDC4', progress: 55, status: 'studying', exams: 0 },
  { id: '3', name: 'Biomeccanica', cfu: 6, color: '#45B7D1', progress: 30, status: 'studying', exams: 0 },
  { id: '4', name: 'Teoria e Metodologia dell\'Allenamento', cfu: 12, color: '#96CEB4', progress: 72, status: 'studying', exams: 0 },
  { id: '5', name: 'Nutrizione e Integrazione Sportiva', cfu: 6, color: '#FFEAA7', progress: 100, status: 'completed', exams: 1, grade: 28 },
  { id: '6', name: 'Patologie dello Sport', cfu: 6, color: '#DDA0DD', progress: 15, status: 'studying', exams: 0 },
  { id: '7', name: 'Farmacologia e Doping', cfu: 6, color: '#98D8C8', progress: 0, status: 'planned', exams: 0 },
  { id: '8', name: 'Radiologia e Diagnostica', cfu: 6, color: '#F7DC6F', progress: 0, status: 'planned', exams: 0 },
  { id: '9', name: 'Chirurgia Ortopedica', cfu: 9, color: '#BB8FCE', progress: 100, status: 'completed', exams: 1, grade: 27 },
  { id: '10', name: 'Riabilitazione Funzionale', cfu: 12, color: '#82E0AA', progress: 40, status: 'studying', exams: 0 },
  { id: '11', name: 'Psicologia dello Sport', cfu: 6, color: '#F1948A', progress: 100, status: 'completed', exams: 1, grade: 30 },
  { id: '12', name: 'Statistica e Metodologia Ricerca', cfu: 6, color: '#85C1E9', progress: 0, status: 'planned', exams: 0 },
  { id: '13', name: 'Etica e Deontologia', cfu: 6, color: '#FAD7A0', progress: 0, status: 'planned', exams: 0 },
  { id: '14', name: 'Tesi di Laurea Magistrale', cfu: 15, color: '#A9CCE3', progress: 5, status: 'studying', exams: 0 },
]

const statusLabel: Record<string, string> = {
  completed: 'Completata',
  studying: 'In corso',
  planned: 'Pianificata',
}
const statusVariant: Record<string, string> = {
  completed: 'badge-success',
  studying: 'badge-info',
  planned: 'badge-primary',
}

export default function MaterieListPage() {
  const cfuTotali = subjects.reduce((acc, s) => acc + s.cfu, 0)
  const cfuCompletati = subjects.filter(s => s.status === 'completed').reduce((acc, s) => acc + s.cfu, 0)

  return (
    <div>
      {/* Page header */}
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-title">Materie</h1>
            <p className="page-subtitle">
              {subjects.filter(s => s.status === 'completed').length} completate su {subjects.length} totali · {cfuCompletati}/{cfuTotali} CFU
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button className="btn btn-secondary" style={{ padding: '8px 14px', fontSize: 13 }}>
              <Filter size={15} /> Filtri
            </button>
          </div>
        </div>

        {/* Search */}
        <div style={{ position: 'relative', marginTop: 16 }}>
          <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input
            type="text"
            className="form-input"
            placeholder="Cerca materia..."
            style={{ paddingLeft: 40 }}
          />
        </div>
      </div>

      {/* Filter tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 20 }}>
        {['Tutte', 'In corso', 'Completate', 'Pianificate'].map((filter) => (
          <button
            key={filter}
            className="btn"
            style={{
              padding: '6px 14px', fontSize: 13,
              background: filter === 'Tutte' ? 'var(--primary)' : 'var(--surface)',
              color: filter === 'Tutte' ? 'white' : 'var(--muted)',
              borderRadius: 8,
            }}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid-3">
        {subjects.map(({ id, name, cfu, color, progress, status, grade }) => (
          <Link key={id} href={`/materie/${id}`} style={{ textDecoration: 'none' }}>
            <div className="subject-card" style={{ height: '100%' }}>
              {/* Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div style={{
                  width: 42, height: 42, borderRadius: 12,
                  background: `${color}20`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 20,
                }}>
                  {name[0]}
                </div>
                <span className={`badge ${statusVariant[status]}`}>
                  {statusLabel[status]}
                </span>
              </div>

              {/* Name */}
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color)', lineHeight: 1.4, marginBottom: 4 }}>
                  {name}
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>
                  {cfu} CFU
                  {grade && ` · Voto: ${grade}/30`}
                </div>
              </div>

              {/* Progress */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>Progresso</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color }}>{progress}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${progress}%`, background: color }} />
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
