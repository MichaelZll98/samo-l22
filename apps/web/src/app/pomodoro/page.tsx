export default function PomodoroPage() {
  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Pomodoro Timer</h1>
        <p className="page-subtitle">Configura focus/break, traccia sessioni e collega materia-attivita.</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 16 }}>
        <div className="card" style={{ textAlign: 'center', padding: 28 }}>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 10 }}>Modalita focus</div>
          <div style={{ fontSize: 64, fontWeight: 800, color: 'var(--primary)', lineHeight: 1, marginBottom: 12 }}>24:59</div>
          <div className="progress-bar" style={{ height: 10, marginBottom: 14 }}>
            <div className="progress-fill" style={{ width: '12%' }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
            <button className="btn btn-primary">Avvia</button>
            <button className="btn btn-secondary">Pausa</button>
            <button className="btn btn-outline">Reset</button>
          </div>
        </div>
        <div className="card">
          <div style={{ fontWeight: 700, marginBottom: 10 }}>Impostazioni</div>
          <div className="form-group" style={{ marginBottom: 10 }}>
            <label className="form-label">Focus (min)</label>
            <input className="form-input" defaultValue="25" />
          </div>
          <div className="form-group" style={{ marginBottom: 10 }}>
            <label className="form-label">Short break (min)</label>
            <input className="form-input" defaultValue="5" />
          </div>
          <div className="form-group" style={{ marginBottom: 10 }}>
            <label className="form-label">Long break (min)</label>
            <input className="form-input" defaultValue="15" />
          </div>
          <div style={{ fontSize: 12, color: 'var(--muted)' }}>Sessioni concluse oggi: 4</div>
        </div>
      </div>
    </div>
  )
}