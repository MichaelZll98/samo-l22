const card = {
  front: 'Origine del muscolo bicipite brachiale?',
  back: 'Capo lungo: tubercolo sovraglenoideo. Capo breve: processo coracoideo.',
}

export default function FlashcardReviewPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Review giornaliera</h1>
        <p className="page-subtitle">12 carte in scadenza oggi · algoritmo SM-2 attivo</p>
      </div>
      <div className="card" style={{ minHeight: 280, display: 'grid', placeItems: 'center', marginBottom: 14 }}>
        <div style={{ maxWidth: 640, textAlign: 'center' }}>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 10 }}>Tap per flip</div>
          <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>{card.front}</div>
          <div style={{ fontSize: 14, color: 'var(--muted)' }}>{card.back}</div>
        </div>
      </div>
      <div className="card">
        <div style={{ fontWeight: 700, marginBottom: 10 }}>Valuta richiamo (0-5)</div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {[0, 1, 2, 3, 4, 5].map((score) => (
            <button key={score} className={`btn ${score >= 4 ? 'btn-primary' : 'btn-outline'}`}>{score}</button>
          ))}
        </div>
      </div>
    </div>
  )
}