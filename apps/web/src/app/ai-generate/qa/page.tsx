'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import {
  MessageSquare,
  ChevronLeft,
  Send,
  FileText,
  Plus,
  X,
  BookOpen,
  Quote,
  Sparkles,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'

const MOCK_MATERIALS = [
  { id: 'm1', name: 'Anatomia_arti_superiori.pdf', type: 'PDF', subject: 'Anatomia', hasChunks: true },
  { id: 'm2', name: 'Lezione_fisiologia_cardio.pptx', type: 'PPT', subject: 'Fisiologia', hasChunks: false },
  { id: 'm3', name: 'Schema_muscoli_spalla.png', type: 'IMG', subject: 'Anatomia', hasChunks: true },
]

interface Citation {
  source_index: number
  topic: string
  page_ref: string
  excerpt: string
}

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  citations?: Citation[]
  timestamp: Date
}

const WELCOME_MESSAGE: Message = {
  id: 'welcome',
  role: 'assistant',
  content: 'Ciao! Sono Samo 🐾 Seleziona uno o più materiali e fammi una domanda sul loro contenuto. Risponderò basandomi solo su quello che hai studiato, citando le fonti!',
  timestamp: new Date(),
}

const MOCK_ANSWERS: Record<string, { content: string; citations: Citation[] }> = {
  default: {
    content: `Ottima domanda! Basandomi sul materiale selezionato, ti spiego:\n\n**La cuffia dei rotatori** [Fonte 1] è composta da 4 muscoli fondamentali per la stabilità della spalla:\n\n1. **Sopraspinato** — abduzione iniziale (0-15°)\n2. **Infraspinato** — rotazione esterna\n3. **Piccolo rotondo** — rotazione esterna\n4. **Sottoscapolare** — rotazione interna\n\nQuesti muscoli formano una "cuffia" attorno alla testa dell'omero, mantenendo l'articolazione gleno-omerale in posizione durante i movimenti [Fonte 2].`,
    citations: [
      { source_index: 1, topic: 'Anatomia spalla', page_ref: 'Sezione 1', excerpt: 'La cuffia dei rotatori è formata da quattro muscoli: sopraspinato, infraspinato, piccolo rotondo e sottoscapolare, che circondano la testa dell\'omero...' },
      { source_index: 2, topic: 'Biomeccanica spalla', page_ref: 'Sezione 3', excerpt: 'La funzione principale della cuffia dei rotatori è stabilizzare l\'articolazione gleno-omerale durante i movimenti del braccio...' },
    ],
  },
}

function CitationBlock({ citation, expanded, onToggle }: {
  citation: Citation
  expanded: boolean
  onToggle: () => void
}) {
  return (
    <div style={{
      marginTop: 8, borderRadius: 8,
      border: '1px solid rgba(59,130,246,0.2)',
      overflow: 'hidden',
    }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '8px 12px', background: 'var(--info-soft)', border: 'none', cursor: 'pointer',
          fontFamily: 'var(--font)',
        }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Quote size={12} color="var(--info)" />
          <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--info)' }}>
            Fonte {citation.source_index} — {citation.topic}
          </span>
          <span style={{ fontSize: 11, color: 'var(--muted)' }}>{citation.page_ref}</span>
        </div>
        {expanded ? <ChevronUp size={14} color="var(--muted)" /> : <ChevronDown size={14} color="var(--muted)" />}
      </button>
      {expanded && (
        <div style={{ padding: '10px 12px', background: 'var(--card)', borderTop: '1px solid rgba(59,130,246,0.1)' }}>
          <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.6, margin: 0, fontStyle: 'italic' }}>
            "{citation.excerpt}"
          </p>
        </div>
      )}
    </div>
  )
}

function MessageBubble({ msg }: { msg: Message }) {
  const [expandedCitations, setExpandedCitations] = useState<Set<number>>(new Set())

  const toggleCitation = (idx: number) => {
    setExpandedCitations(prev => {
      const next = new Set(prev)
      if (next.has(idx)) next.delete(idx)
      else next.add(idx)
      return next
    })
  }

  if (msg.role === 'user') {
    return (
      <div style={{ alignSelf: 'flex-end', maxWidth: '80%' }}>
        <div style={{
          padding: '10px 14px', borderRadius: 16, borderBottomRightRadius: 4,
          background: 'var(--primary)', color: 'white', fontSize: 14, lineHeight: 1.5,
        }}>
          {msg.content}
        </div>
        <div style={{ fontSize: 10, color: 'var(--muted)', textAlign: 'right', marginTop: 4 }}>
          {msg.timestamp.toLocaleTimeString('it', { hour: '2-digit', minute: '2-digit' })}
        </div>
      </div>
    )
  }

  return (
    <div style={{ alignSelf: 'flex-start', maxWidth: '88%' }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8 }}>
        <div style={{
          width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, rgba(92,139,255,0.15), rgba(124,58,237,0.1))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <svg width="18" height="18" viewBox="0 0 80 80" fill="none">
            <ellipse cx="40" cy="50" rx="20" ry="14" fill="white" />
            <ellipse cx="40" cy="35" rx="16" ry="15" fill="white" />
            <ellipse cx="30" cy="25" rx="9" ry="11" fill="white" transform="rotate(-15 30 25)" />
            <ellipse cx="50" cy="25" rx="9" ry="11" fill="white" transform="rotate(15 50 25)" />
            <ellipse cx="33" cy="35" rx="4" ry="4.5" fill="#1C1C2E" />
            <ellipse cx="47" cy="35" rx="4" ry="4.5" fill="#1C1C2E" />
          </svg>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            padding: '10px 14px', borderRadius: 16, borderBottomLeftRadius: 4,
            background: 'var(--surface)', border: '1px solid var(--border)', fontSize: 14, lineHeight: 1.6, color: 'var(--color)',
          }}>
            {msg.content.split('\n').map((line, i) => {
              if (!line.trim()) return <br key={i} />
              const bold = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
              return <span key={i} dangerouslySetInnerHTML={{ __html: bold }} style={{ display: 'block' }} />
            })}
          </div>
          {msg.citations && msg.citations.length > 0 && (
            <div style={{ marginTop: 6 }}>
              {msg.citations.map((c, i) => (
                <CitationBlock
                  key={i}
                  citation={c}
                  expanded={expandedCitations.has(i)}
                  onToggle={() => toggleCitation(i)}
                />
              ))}
            </div>
          )}
          <div style={{ fontSize: 10, color: 'var(--muted)', marginTop: 4 }}>
            {msg.timestamp.toLocaleTimeString('it', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function DocumentQAPage() {
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>(['m1'])
  const [messages, setMessages]                   = useState<Message[]>([WELCOME_MESSAGE])
  const [input, setInput]                         = useState('')
  const [loading, setLoading]                     = useState(false)
  const [showMaterialSelect, setShowMaterialSelect] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const toggleMaterial = (id: string) => {
    setSelectedMaterials(prev =>
      prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
    )
  }

  const handleSend = async () => {
    if (!input.trim() || loading) return
    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    // Simula risposta (in produzione: chiama document-qa edge function)
    await new Promise(r => setTimeout(r, 1800))

    const aiMsg: Message = {
      id: (Date.now() + 1).toString(),
      role: 'assistant',
      content: MOCK_ANSWERS.default.content,
      citations: MOCK_ANSWERS.default.citations,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, aiMsg])
    setLoading(false)
  }

  const selectedMatNames = MOCK_MATERIALS
    .filter(m => selectedMaterials.includes(m.id))
    .map(m => m.name.split('.')[0])

  const noChunksMaterials = MOCK_MATERIALS.filter(m => selectedMaterials.includes(m.id) && !m.hasChunks)

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <Link href="/ai-generate" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--muted)', fontSize: 13, textDecoration: 'none' }}>
          <ChevronLeft size={14} />AI Studio
        </Link>
        <span style={{ color: 'var(--border)' }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color)' }}>Chiedi ai Documenti</span>
      </div>

      <div className="page-header" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(245,158,11,0.1)', color: 'var(--warning)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <MessageSquare size={20} />
          </div>
          <div>
            <h1 className="page-title">Chiedi ai Documenti</h1>
            <p className="page-subtitle">Fai domande ai tuoi materiali di studio con citazioni</p>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr', gap: 20, height: 'calc(100vh - 220px)', minHeight: 500 }}>

        {/* Sidebar materiali */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div className="card" style={{ flex: 1, overflow: 'auto' }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color)', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <BookOpen size={14} color="var(--muted)" />
              Materiali selezionati
            </div>

            {noChunksMaterials.length > 0 && (
              <div style={{ padding: '8px 10px', borderRadius: 8, background: 'var(--warning-soft)', border: '1px solid rgba(245,158,11,0.2)', marginBottom: 12 }}>
                <div style={{ display: 'flex', gap: 6, alignItems: 'flex-start' }}>
                  <AlertCircle size={13} color="var(--warning)" style={{ flexShrink: 0, marginTop: 1 }} />
                  <p style={{ fontSize: 11, color: 'var(--color)', margin: 0, lineHeight: 1.5 }}>
                    Alcuni materiali non hanno ancora il testo estratto. Esegui il parsing prima.
                  </p>
                </div>
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {MOCK_MATERIALS.map(m => {
                const isSelected = selectedMaterials.includes(m.id)
                return (
                  <div key={m.id}
                    onClick={() => toggleMaterial(m.id)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '9px 10px', borderRadius: 8, cursor: 'pointer',
                      border: `1.5px solid ${isSelected ? 'var(--primary)' : 'var(--border)'}`,
                      background: isSelected ? 'var(--primary-soft)' : 'var(--card)',
                      transition: 'all 0.15s',
                    }}>
                    <div style={{
                      width: 28, height: 28, borderRadius: 6, flexShrink: 0,
                      background: isSelected ? 'var(--primary)' : 'var(--surface)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <FileText size={13} color={isSelected ? 'white' : 'var(--muted)'} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--color)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                        {m.name.split('.')[0]}
                      </div>
                      <div style={{ fontSize: 10, color: 'var(--muted)', display: 'flex', alignItems: 'center', gap: 4 }}>
                        {m.subject} · {m.type}
                        {!m.hasChunks && <span style={{ color: 'var(--warning)', fontWeight: 600 }}>· No parsing</span>}
                      </div>
                    </div>
                    {isSelected && (
                      <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <X size={10} color="white" />
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>

          {/* Suggerimenti domande */}
          <div className="card-glass">
            <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              Idee di domande
            </div>
            {[
              'Spiega la funzione della cuffia dei rotatori',
              'Quali muscoli flettono il gomito?',
              'Differenza tra enartrosi e trocleartrosi',
            ].map((q, i) => (
              <button key={i}
                onClick={() => setInput(q)}
                style={{
                  width: '100%', textAlign: 'left', padding: '8px 10px', borderRadius: 8,
                  background: 'var(--surface)', border: '1px solid var(--border)',
                  fontSize: 12, color: 'var(--muted)', cursor: 'pointer',
                  marginBottom: 6, display: 'flex', alignItems: 'center', gap: 6,
                  fontFamily: 'var(--font)', transition: 'all 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'var(--primary-soft)'; (e.currentTarget as HTMLElement).style.color = 'var(--primary)' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--surface)'; (e.currentTarget as HTMLElement).style.color = 'var(--muted)' }}>
                <Sparkles size={11} /> {q}
              </button>
            ))}
          </div>
        </div>

        {/* Chat area */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', padding: 0, overflow: 'hidden' }}>
          {/* Chat header */}
          <div style={{
            padding: '12px 16px', borderBottom: '1px solid var(--border)',
            background: 'linear-gradient(135deg, rgba(245,158,11,0.05), rgba(245,158,11,0.02))',
            display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0,
          }}>
            <MessageSquare size={16} color="var(--warning)" />
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color)' }}>Chat con i documenti</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>
                {selectedMaterials.length > 0
                  ? `${selectedMaterials.length} materiale${selectedMaterials.length > 1 ? 'i' : ''} selezionato${selectedMaterials.length > 1 ? 'i' : ''}`
                  : 'Nessun materiale selezionato'}
              </div>
            </div>
          </div>

          {/* Messages */}
          <div style={{
            flex: 1, overflowY: 'auto', padding: 16,
            display: 'flex', flexDirection: 'column', gap: 12,
            background: 'linear-gradient(180deg, var(--bg), var(--card))',
          }}>
            {messages.map(msg => <MessageBubble key={msg.id} msg={msg} />)}

            {loading && (
              <div style={{ alignSelf: 'flex-start', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, rgba(92,139,255,0.15), rgba(124,58,237,0.1))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="16" height="16" viewBox="0 0 80 80" fill="none">
                    <ellipse cx="40" cy="50" rx="20" ry="14" fill="white" />
                    <ellipse cx="40" cy="35" rx="16" ry="15" fill="white" />
                    <ellipse cx="33" cy="35" rx="4" ry="4.5" fill="#1C1C2E" />
                    <ellipse cx="47" cy="35" rx="4" ry="4.5" fill="#1C1C2E" />
                  </svg>
                </div>
                <div style={{ display: 'flex', gap: 4, padding: '10px 14px', background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 16, borderBottomLeftRadius: 4 }}>
                  {[0,1,2].map(i => (
                    <span key={i} className={`samo-dot samo-dot-${i+1}`} style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--muted)', display: 'inline-block' }} />
                  ))}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '12px 14px', borderTop: '1px solid var(--border)', background: 'var(--card)', flexShrink: 0 }}>
            {selectedMaterials.length === 0 && (
              <div style={{ marginBottom: 10, padding: '8px 12px', borderRadius: 8, background: 'var(--warning-soft)', border: '1px solid rgba(245,158,11,0.2)', fontSize: 12, color: 'var(--color)', display: 'flex', alignItems: 'center', gap: 6 }}>
                <AlertCircle size={13} color="var(--warning)" />
                Seleziona almeno un materiale per iniziare la chat
              </div>
            )}
            <div style={{
              display: 'flex', alignItems: 'flex-end', gap: 6,
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 14, padding: '4px 6px',
            }}
              onFocus={() => {}} onBlur={() => {}}>
              <textarea
                className="samo-input"
                placeholder="Fai una domanda sui tuoi documenti..."
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() } }}
                rows={1}
                disabled={selectedMaterials.length === 0}
                style={{ flex: 1, background: 'none', border: 'none', outline: 'none', fontFamily: 'var(--font)', fontSize: 14, color: 'var(--color)', padding: '8px 4px', resize: 'none', maxHeight: 100, lineHeight: 1.4 }}
              />
              <button
                onClick={handleSend}
                disabled={!input.trim() || loading || selectedMaterials.length === 0}
                className={`samo-send-btn ${input.trim() && !loading && selectedMaterials.length > 0 ? 'active' : ''}`}>
                <Send size={16} />
              </button>
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)', marginTop: 6, textAlign: 'center' }}>
              Invio per mandare · Shift+Invio per andare a capo
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
