'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { Search, FileText, FolderOpen, Brain, Layers3, User } from 'lucide-react'

interface Result {
  id: string
  type: 'note' | 'material' | 'quiz' | 'flashcard' | 'user'
  title: string
  subtitle: string
  href: string
}

const ALL_RESULTS: Result[] = [
  { id: 'sn1', type: 'note', title: 'Sistema nervoso autonomo — Riassunto', subtitle: 'Anatomia · Laura M.', href: '/community/note/sn1' },
  { id: 'sn2', type: 'note', title: 'Metabolismo aerobico completo', subtitle: 'Fisiologia · Sofia B.', href: '/community/note/sn2' },
  { id: 'sn3', type: 'note', title: 'Goal setting e motivazione nello sport', subtitle: 'Psicologia · Alessia V.', href: '/community/note/sn3' },
  { id: 'sm1', type: 'material', title: 'Slide Biomeccanica Cap. 1-6', subtitle: 'Biomeccanica · Giovanni R. · PPTX', href: '/community/materiali' },
  { id: 'sm2', type: 'material', title: 'Schema muscoli arto inferiore', subtitle: 'Anatomia · Marco T. · PDF', href: '/community/materiali' },
  { id: 'q1', type: 'quiz', title: 'Quiz Anatomia — Muscoli del tronco', subtitle: '20 domande · Difficoltà media', href: '/quiz/q1' },
  { id: 'q2', type: 'quiz', title: 'Fisiologia Cardiovascolare — Test', subtitle: '15 domande · Difficoltà alta', href: '/quiz/q2' },
  { id: 'f1', type: 'flashcard', title: 'Flashcard Sistema Nervoso', subtitle: '50 carte · Anatomia', href: '/flashcard' },
  { id: 'u1', type: 'user', title: 'Laura M.', subtitle: 'Livello 8 · 3 note condivise', href: '/community/profilo/user1' },
  { id: 'u2', type: 'user', title: 'Sofia B.', subtitle: 'Livello 11 · 5 note condivise', href: '/community/profilo/user2' },
]

const TYPE_LABELS: Record<string, string> = { note: 'Appunti', material: 'Materiali', quiz: 'Quiz', flashcard: 'Flashcard', user: 'Studenti' }
const TYPE_ORDER: Result['type'][] = ['note', 'material', 'quiz', 'flashcard', 'user']

const ICON: Record<string, React.ReactNode> = {
  note:      <FileText size={16} color="var(--info)" />,
  material:  <FolderOpen size={16} color="var(--success)" />,
  quiz:      <Brain size={16} color="#7C3AED" />,
  flashcard: <Layers3 size={16} color="var(--primary)" />,
  user:      <User size={16} color="var(--warning)" />,
}

const ICON_BG: Record<string, string> = {
  note:      'var(--info-soft)',
  material:  'var(--success-soft)',
  quiz:      'rgba(124,58,237,0.1)',
  flashcard: 'var(--primary-soft)',
  user:      'var(--warning-soft)',
}

export default function CercaPage() {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    if (!query.trim()) return []
    const q = query.toLowerCase()
    return ALL_RESULTS.filter(
      (r) => r.title.toLowerCase().includes(q) || r.subtitle.toLowerCase().includes(q)
    )
  }, [query])

  const grouped = useMemo(() => {
    return TYPE_ORDER.map((type) => ({
      type,
      label: TYPE_LABELS[type],
      items: results.filter((r) => r.type === type),
    })).filter((g) => g.items.length > 0)
  }, [results])

  return (
    <div>
      <div className="page-header">
        <h1 className="page-title">Ricerca</h1>
        <p className="page-subtitle">Cerca note, materiali, quiz, flashcard e studenti</p>
      </div>

      {/* Search input */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ position: 'relative' }}>
          <Search size={20} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input
            className="form-input"
            placeholder="Cerca qualcosa..."
            style={{ paddingLeft: 44, fontSize: 17, fontWeight: 500 }}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
        {query && results.length > 0 && (
          <div style={{ marginTop: 8, fontSize: 13, color: 'var(--muted)' }}>
            {results.length} risultat{results.length === 1 ? 'o' : 'i'} per <strong style={{ color: 'var(--color)' }}>"{query}"</strong>
          </div>
        )}
      </div>

      {/* Empty state */}
      {!query && (
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <Search size={40} style={{ color: 'var(--border)', marginBottom: 12 }} />
          <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>Inizia a cercare</div>
          <div style={{ fontSize: 14, color: 'var(--muted)' }}>
            Prova a cercare "anatomia", "fisiologia", "quiz muscoli"...
          </div>
          <div style={{ display: 'flex', gap: 8, justifyContent: 'center', marginTop: 16, flexWrap: 'wrap' }}>
            {['sistema nervoso', 'biomeccanica', 'quiz anatomia', 'flashcard fisiologia'].map((s) => (
              <button key={s} className="filter-tab" style={{ fontSize: 12 }} onClick={() => setQuery(s)}>
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* No results */}
      {query && results.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: 48 }}>
          <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 8 }}>Nessun risultato</div>
          <div style={{ fontSize: 14, color: 'var(--muted)' }}>
            Nessun contenuto trovato per "{query}". Prova con termini diversi.
          </div>
        </div>
      )}

      {/* Grouped results */}
      {grouped.map((group) => (
        <div key={group.type} style={{ marginBottom: 24 }}>
          <div className="search-section-header" style={{ borderRadius: 'var(--r) var(--r) 0 0', borderTop: '1px solid var(--border)', borderLeft: '1px solid var(--border)', borderRight: '1px solid var(--border)' }}>
            {group.label}
          </div>
          <div style={{ border: '1px solid var(--border)', borderTop: 'none', borderRadius: '0 0 var(--r) var(--r)', overflow: 'hidden' }}>
            {group.items.map((item, i) => (
              <Link key={item.id} href={item.href} style={{ textDecoration: 'none' }}>
                <div
                  className="search-result-item"
                  style={{ borderBottom: i < group.items.length - 1 ? undefined : 'none', background: 'var(--card)' }}
                >
                  <div className="search-result-icon" style={{ background: ICON_BG[item.type] }}>
                    {ICON[item.type]}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color)', marginBottom: 1 }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: 12, color: 'var(--muted)' }}>{item.subtitle}</div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
