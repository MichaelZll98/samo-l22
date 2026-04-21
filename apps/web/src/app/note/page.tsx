import Link from 'next/link'
import { Search, Pin } from 'lucide-react'

const notes = [
  { id: 'n1', title: 'Sistema nervoso autonomo', excerpt: 'Simpatico e parasimpatico: differenze funzionali...', subject: 'Anatomia', tags: ['neuro', 'ripasso'], pinned: true, updatedAt: 'Oggi' },
  { id: 'n2', title: 'Metabolismo aerobico', excerpt: 'Vie energetiche durante esercizio prolungato...', subject: 'Fisiologia', tags: ['energia'], pinned: false, updatedAt: 'Ieri' },
]

export default function NotesPage() {
  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1 className="page-title">Note</h1>
          <p className="page-subtitle">Organizza appunti per materia, cerca e pinnale.</p>
        </div>
        <Link href="/note/new" className="btn btn-primary">Nuova nota</Link>
      </div>
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input className="form-input" placeholder="Ricerca full-text..." style={{ paddingLeft: 36 }} />
        </div>
      </div>
      <div className="grid-2">
        {notes.map((n) => (
          <Link key={n.id} href={`/note/${n.id}`} style={{ textDecoration: 'none' }}>
            <div className="card">
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ fontWeight: 700 }}>{n.title}</div>
                {n.pinned ? <Pin size={14} color="var(--primary)" /> : null}
              </div>
              <div style={{ color: 'var(--muted)', fontSize: 13, marginBottom: 10 }}>{n.excerpt}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
                <span className="badge badge-info">{n.subject}</span>
                <span style={{ color: 'var(--muted)' }}>{n.updatedAt}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}