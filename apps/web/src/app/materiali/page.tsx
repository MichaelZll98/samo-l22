const materials = [
  { id: 'm1', name: 'Anatomia_arti_superiori.pdf', type: 'PDF', subject: 'Anatomia', uploadedAt: '21 Apr 2026' },
  { id: 'm2', name: 'Lezione_fisiologia_cardio.pptx', type: 'PPT', subject: 'Fisiologia', uploadedAt: '20 Apr 2026' },
  { id: 'm3', name: 'Schema_muscoli_spalla.png', type: 'IMG', subject: 'Anatomia', uploadedAt: '19 Apr 2026' },
]

export default function MaterialiPage() {
  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Materiali</h1>
          <p className="page-subtitle">Upload e preview di PDF, slide e immagini per materia.</p>
        </div>
        <button className="btn btn-primary">Carica file</button>
      </div>
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          <select className="form-input" style={{ maxWidth: 240 }}>
            <option>Tutte le materie</option>
            <option>Anatomia</option>
            <option>Fisiologia</option>
          </select>
          <select className="form-input" style={{ maxWidth: 240 }}>
            <option>Tutti i formati</option>
            <option>PDF</option>
            <option>PPT</option>
            <option>IMG</option>
          </select>
        </div>
      </div>
      <div style={{ display: 'grid', gap: 10 }}>
        {materials.map((m) => (
          <div key={m.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <div style={{ fontSize: 14, fontWeight: 700 }}>{m.name}</div>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{m.subject} · {m.uploadedAt}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="badge badge-info">{m.type}</span>
              <button className="btn btn-secondary">Preview</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}