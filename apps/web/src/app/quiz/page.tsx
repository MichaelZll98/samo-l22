import Link from 'next/link'

const quizSets = [
  { id: 'q-anat-1', title: 'Quiz Anatomia - Arto superiore', subject: 'Anatomia', topic: 'Arto superiore', difficulty: 'medio', questions: 10, mode: 'practice' },
  { id: 'q-anat-2', title: 'Simulazione Anatomia completa', subject: 'Anatomia', topic: 'Completo', difficulty: 'difficile', questions: 30, mode: 'simulation' },
]

export default function QuizHubPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Quiz</h1>
        <p className="page-subtitle">Filtra per materia, argomento, difficolta e scegli pratica o simulazione.</p>
      </div>
      <div className="card" style={{ marginBottom: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <select className="form-input" style={{ maxWidth: 220 }}><option>Tutte le materie</option><option>Anatomia</option></select>
        <select className="form-input" style={{ maxWidth: 220 }}><option>Tutti gli argomenti</option><option>Arto superiore</option></select>
        <select className="form-input" style={{ maxWidth: 220 }}><option>Tutte le difficolta</option><option>facile</option><option>medio</option><option>difficile</option></select>
      </div>
      <div className="grid-2">
        {quizSets.map((q) => (
          <Link key={q.id} href={`/quiz/${q.id}`} style={{ textDecoration: 'none' }}>
            <div className="card">
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>{q.title}</div>
              <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
                <span className="badge badge-info">{q.subject}</span>
                <span className="badge badge-primary">{q.topic}</span>
                <span className={`badge ${q.difficulty === 'difficile' ? 'badge-error' : q.difficulty === 'medio' ? 'badge-warning' : 'badge-success'}`}>{q.difficulty}</span>
              </div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{q.questions} domande · {q.mode === 'simulation' ? 'Modalita simulazione (timer)' : 'Modalita pratica'}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}