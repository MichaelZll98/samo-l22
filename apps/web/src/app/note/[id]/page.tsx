import Link from 'next/link'
import { ArrowLeft, Pin } from 'lucide-react'

interface Params {
  id: string
}

const sample = {
  title: 'Sistema nervoso autonomo',
  content: `# Sistema nervoso autonomo

## Simpatico
- Attiva risposta fight-or-flight
- Incrementa frequenza cardiaca

## Parasimpatico
- Favorisce recupero e digestione

\`\`\`txt
Neurotrasmettitori principali:
- Noradrenalina
- Acetilcolina
\`\`\``,
  pinned: true,
}

export default function NoteEditorPage({ params }: { params: Params }) {
  const isNew = params.id === 'new'

  return (
    <div>
      <Link href="/note" style={{ display: 'inline-flex', gap: 6, alignItems: 'center', color: 'var(--muted)', marginBottom: 16 }}>
        <ArrowLeft size={16} /> Torna alle note
      </Link>
      <div className="card" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
          <h1 className="page-title" style={{ fontSize: 24 }}>{isNew ? 'Nuova nota' : sample.title}</h1>
          <button className="btn btn-secondary" style={{ gap: 6 }}>
            <Pin size={14} /> {sample.pinned ? 'Pinned' : 'Pin'}
          </button>
        </div>
        <input className="form-input" defaultValue={isNew ? '' : sample.title} placeholder="Titolo" style={{ marginBottom: 12 }} />
        <textarea className="form-input" defaultValue={isNew ? '' : sample.content} rows={18} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
        <button className="btn btn-secondary">Annulla</button>
        <button className="btn btn-primary">Salva nota</button>
      </div>
    </div>
  )
}