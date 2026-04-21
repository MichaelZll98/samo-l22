import Link from 'next/link'

const decks = [
  { id: 'd1', title: 'Anatomia - Arto superiore', subject: 'Anatomia', topic: 'Arto superiore', total: 45, due: 12 },
  { id: 'd2', title: 'Fisiologia - Sistema cardio', subject: 'Fisiologia', topic: 'Cardiovascolare', total: 30, due: 4 },
]

export default function FlashcardHubPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Flashcard</h1>
        <p className="page-subtitle">Ripetizione spaziata SM-2 con review giornaliera.</p>
      </div>
      <div className="grid-2">
        {decks.map((deck) => (
          <Link key={deck.id} href="/flashcard/review" style={{ textDecoration: 'none' }}>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontWeight: 700 }}>{deck.title}</div>
                <span className={`badge ${deck.due > 0 ? 'badge-warning' : 'badge-success'}`}>
                  {deck.due > 0 ? `${deck.due} in scadenza` : 'In pari'}
                </span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>{deck.subject} · {deck.topic}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 6 }}>{deck.total} carte</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}