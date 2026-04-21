const questions = [
  {
    id: '1',
    text: 'Quale osso appartiene al cingolo scapolare?',
    options: ['Scapola', 'Ulna', 'Radio', 'Femore'],
    answer: 0,
    explanation: 'Il cingolo scapolare e formato da clavicola e scapola.',
  },
  {
    id: '2',
    text: 'La diartrosi e una articolazione mobile.',
    options: ['Vero', 'Falso'],
    answer: 0,
    explanation: 'Le diartrosi consentono ampio movimento tra i capi articolari.',
  },
]

export default function QuizSessionPage() {
  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Sessione quiz</h1>
          <p className="page-subtitle">Modalita simulazione · Timer 18:42</p>
        </div>
        <div className="badge badge-warning">In corso</div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {questions.map((q, i) => (
          <div key={q.id} className="card">
            <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>
              Domanda {i + 1}/{questions.length}
            </div>
            <div style={{ fontWeight: 700, marginBottom: 10 }}>{q.text}</div>
            <div style={{ display: 'grid', gap: 8 }}>
              {q.options.map((opt) => (
                <button key={opt} className="btn btn-outline" style={{ justifyContent: 'flex-start' }}>{opt}</button>
              ))}
            </div>
            <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 10 }}>
              Spiegazione: {q.explanation}
            </div>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 16 }}>
        <button className="btn btn-secondary">Termina</button>
        <button className="btn btn-primary">Invia risposte</button>
      </div>
    </div>
  )
}