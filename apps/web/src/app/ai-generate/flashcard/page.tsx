'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Layers3,
  ChevronLeft,
  FileText,
  NotebookPen,
  Sparkles,
  CheckCircle2,
  Edit3,
  Save,
  Plus,
  Trash2,
  RefreshCw,
  RotateCcw,
  AlertCircle,
} from 'lucide-react'

const MOCK_MATERIALS = [
  { id: 'm1', name: 'Anatomia_arti_superiori.pdf', type: 'PDF', subject: 'Anatomia' },
  { id: 'm2', name: 'Lezione_fisiologia_cardio.pptx', type: 'PPT', subject: 'Fisiologia' },
  { id: 'm3', name: 'Schema_muscoli_spalla.png', type: 'IMG', subject: 'Anatomia' },
]

const MOCK_NOTES = [
  { id: 'n1', title: 'Appunti Anatomia - Arto superiore', subject: 'Anatomia' },
  { id: 'n2', title: 'Riassunto Fisiologia lezione 3', subject: 'Fisiologia' },
]

const MOCK_FLASHCARDS = [
  { id: 'f1', front: 'Cos\'è la cuffia dei rotatori?', back: 'Gruppo di 4 muscoli che stabilizzano l\'articolazione gleno-omerale: sopraspinato, infraspinato, piccolo rotondo e sottoscapolare (SITS).', topic: 'Anatomia spalla' },
  { id: 'f2', front: 'Qual è la funzione principale del deltoide?', back: 'Il deltoide è il principale muscolo abduttore del braccio. Le fibre anteriori flettono e ruotano internamente, quelle posteriori estendono e ruotano esternamente.', topic: 'Anatomia spalla' },
  { id: 'f3', front: 'Dove origina il tendine della testa lunga del bicipite?', back: 'Dal tubercolo sovraglenoidale della scapola. Il tendine scorre nella doccia bicipitale dell\'omero ed è tenuto in posizione dal legamento trasverso dell\'omero.', topic: 'Anatomia braccio' },
  { id: 'f4', front: 'Definisci il piano sagittale', back: 'Il piano sagittale (o mediano) divide il corpo in metà destra e sinistra. I movimenti in questo piano sono flessione ed estensione.', topic: 'Anatomia generale' },
]

type FlashcardStep = 'config' | 'generating' | 'preview' | 'saved'

interface Flashcard {
  id: string
  front: string
  back: string
  topic?: string
  editing?: boolean
  flipped?: boolean
}

function FlashcardProgress({ step, material }: { step: number; material: string }) {
  const steps = ['Analisi contenuto...', 'Estrazione concetti chiave...', 'Creazione fronti...', 'Scrittura retri...', 'Finalizzazione...']
  return (
    <div className="ai-gen-progress-wrap">
      <div className="samo-welcome-avatar" style={{ width: 80, height: 80, margin: '0 auto 16px' }}>
        <svg width="56" height="56" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="38" fill="rgba(124,58,237,0.1)" />
          <ellipse cx="40" cy="52" rx="22" ry="16" fill="white" />
          <ellipse cx="40" cy="36" rx="18" ry="17" fill="white" />
          <ellipse cx="31" cy="26" rx="10" ry="13" fill="white" transform="rotate(-15 31 26)" />
          <ellipse cx="49" cy="26" rx="10" ry="13" fill="white" transform="rotate(15 49 26)" />
          <ellipse cx="33.5" cy="36.5" rx="4.5" ry="5" fill="#1C1C2E" />
          <ellipse cx="46.5" cy="36.5" rx="4.5" ry="5" fill="#1C1C2E" />
          <ellipse cx="40" cy="43" rx="5" ry="3.5" fill="#FFB3BA" />
        </svg>
      </div>
      <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginBottom: 20 }}>
        {[0,1,2].map(i => (
          <span key={i} className={`samo-dot samo-dot-${i+1}`} style={{
            width: 8, height: 8, borderRadius: '50%', background: '#7C3AED', display: 'inline-block',
          }} />
        ))}
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color)', marginBottom: 8 }}>
        Samo sta creando le flashcard...
      </h3>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>
        Da: <strong>{material}</strong>
      </p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 400 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: i < step ? '#7C3AED' : i === step ? 'var(--primary)' : 'var(--surface)',
              transition: 'background 0.3s',
            }}>
              {i < step && <CheckCircle2 size={12} color="white" />}
            </div>
            <span style={{ fontSize: 13, color: i <= step ? 'var(--color)' : 'var(--muted)', fontWeight: i === step ? 600 : 400 }}>{s}</span>
          </div>
        ))}
      </div>
      <div className="progress-bar" style={{ width: '100%', maxWidth: 400, marginTop: 20, height: 8 }}>
        <div className="progress-fill" style={{ width: `${(step / (steps.length - 1)) * 100}%`, background: '#7C3AED' }} />
      </div>
    </div>
  )
}

function FlashcardPreviewItem({
  card, index, onEdit, onDelete, onSave,
}: { card: Flashcard; index: number; onEdit: (id: string) => void; onDelete: (id: string) => void; onSave: (id: string, upd: Partial<Flashcard>) => void }) {
  const [localFront, setLocalFront] = useState(card.front)
  const [localBack, setLocalBack]   = useState(card.back)
  const [localTopic, setLocalTopic] = useState(card.topic ?? '')
  const [flipped, setFlipped]       = useState(false)

  return (
    <div className="card ai-flashcard-preview">
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            width: 24, height: 24, borderRadius: 6, background: 'rgba(124,58,237,0.1)', color: '#7C3AED',
            fontWeight: 700, fontSize: 11, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{index + 1}</span>
          {card.topic && <span className="badge badge-info" style={{ fontSize: 10 }}>{card.topic}</span>}
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {card.editing ? (
            <button className="btn btn-primary" style={{ padding: '4px 10px', fontSize: 12 }}
              onClick={() => onSave(card.id, { front: localFront, back: localBack, topic: localTopic, editing: false })}>
              <Save size={12} /> Salva
            </button>
          ) : (
            <>
              <button className="samo-icon-btn" onClick={() => setFlipped(f => !f)} title="Gira">
                <RotateCcw size={14} />
              </button>
              <button className="samo-icon-btn" onClick={() => onEdit(card.id)} title="Modifica">
                <Edit3 size={14} />
              </button>
            </>
          )}
          <button className="samo-icon-btn" style={{ color: 'var(--error)' }} onClick={() => onDelete(card.id)}>
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {card.editing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="form-group">
            <label className="form-label">Fronte (domanda/concetto)</label>
            <textarea className="form-input" rows={2} value={localFront} onChange={e => setLocalFront(e.target.value)} style={{ resize: 'vertical' }} />
          </div>
          <div className="form-group">
            <label className="form-label">Retro (risposta/definizione)</label>
            <textarea className="form-input" rows={4} value={localBack} onChange={e => setLocalBack(e.target.value)} style={{ resize: 'vertical' }} />
          </div>
          <div className="form-group">
            <label className="form-label">Argomento</label>
            <input className="form-input" value={localTopic} onChange={e => setLocalTopic(e.target.value)} placeholder="es. Anatomia spalla" />
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div style={{
            padding: 14, borderRadius: 10,
            background: !flipped ? 'var(--primary-soft)' : 'var(--surface)',
            border: `1px solid ${!flipped ? 'rgba(92,139,255,0.2)' : 'var(--border)'}`,
            cursor: 'pointer', transition: 'all 0.2s',
          }} onClick={() => setFlipped(false)}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: !flipped ? 'var(--primary)' : 'var(--muted)', marginBottom: 6 }}>Fronte</div>
            <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color)', lineHeight: 1.5 }}>{card.front}</div>
          </div>
          <div style={{
            padding: 14, borderRadius: 10,
            background: flipped ? 'rgba(124,58,237,0.1)' : 'var(--surface)',
            border: `1px solid ${flipped ? 'rgba(124,58,237,0.2)' : 'var(--border)'}`,
            cursor: 'pointer', transition: 'all 0.2s',
          }} onClick={() => setFlipped(true)}>
            <div style={{ fontSize: 10, fontWeight: 700, textTransform: 'uppercase', color: flipped ? '#7C3AED' : 'var(--muted)', marginBottom: 6 }}>Retro</div>
            <div style={{ fontSize: 13, color: 'var(--color)', lineHeight: 1.5 }}>{card.back}</div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function GeneraFlashcardPage() {
  const [sourceType, setSourceType]   = useState<'material' | 'note'>('material')
  const [selectedId, setSelectedId]   = useState('')
  const [numCards, setNumCards]       = useState(15)
  const [step, setStep]               = useState<FlashcardStep>('config')
  const [genProgress, setGenProgress] = useState(0)
  const [cards, setCards]             = useState<Flashcard[]>([])
  const [deckTitle, setDeckTitle]     = useState('')
  const [error, setError]             = useState('')

  const selectedMaterial = MOCK_MATERIALS.find(m => m.id === selectedId)
  const selectedNote     = MOCK_NOTES.find(n => n.id === selectedId)
  const sourceName       = selectedMaterial?.name ?? selectedNote?.title ?? ''

  const handleGenerate = async () => {
    if (!selectedId) { setError('Seleziona una sorgente'); return }
    setError('')
    setStep('generating')
    setGenProgress(0)

    for (let i = 1; i <= 5; i++) {
      await new Promise(r => setTimeout(r, 650))
      setGenProgress(i)
    }

    setCards(MOCK_FLASHCARDS.map((f, i) => ({ ...f, id: `fc${i}` })))
    setDeckTitle(`Flashcard AI - ${sourceName}`)
    setStep('preview')
  }

  const handleSave = () => setStep('saved')
  const handleEdit = (id: string) => setCards(prev => prev.map(c => c.id === id ? { ...c, editing: true } : c))
  const handleDelete = (id: string) => setCards(prev => prev.filter(c => c.id !== id))
  const handleSaveCard = (id: string, upd: Partial<Flashcard>) =>
    setCards(prev => prev.map(c => c.id === id ? { ...c, ...upd } : c))

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <Link href="/ai-generate" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--muted)', fontSize: 13, textDecoration: 'none' }}>
          <ChevronLeft size={14} />AI Studio
        </Link>
        <span style={{ color: 'var(--border)' }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color)' }}>Genera Flashcard</span>
      </div>

      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(124,58,237,0.1)', color: '#7C3AED', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Layers3 size={20} />
          </div>
          <div>
            <h1 className="page-title">Genera Flashcard</h1>
            <p className="page-subtitle">Crea un deck completo per la revisione spaced-repetition</p>
          </div>
        </div>
      </div>

      {step === 'config' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="form-group">
              <label className="form-label">Tipo sorgente</label>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                {(['material', 'note'] as const).map(t => (
                  <button key={t}
                    className={sourceType === t ? 'btn btn-primary' : 'btn btn-secondary'}
                    style={{ fontSize: 13, padding: '7px 14px' }}
                    onClick={() => { setSourceType(t); setSelectedId('') }}>
                    {t === 'material' ? <><FileText size={14} /> Materiale</> : <><NotebookPen size={14} /> Nota</>}
                  </button>
                ))}
              </div>
              <select className="form-input" value={selectedId} onChange={e => setSelectedId(e.target.value)}>
                <option value="">-- Scegli --</option>
                {sourceType === 'material'
                  ? MOCK_MATERIALS.map(m => <option key={m.id} value={m.id}>{m.name} ({m.subject})</option>)
                  : MOCK_NOTES.map(n => <option key={n.id} value={n.id}>{n.title} ({n.subject})</option>)
                }
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Numero di flashcard</label>
              <select className="form-input" value={numCards} onChange={e => setNumCards(+e.target.value)}>
                {[10, 15, 20, 30].map(n => <option key={n} value={n}>{n} flashcard</option>)}
              </select>
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 8, background: 'var(--error-soft)', color: 'var(--error)', fontSize: 13 }}>
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <button className="btn btn-primary" onClick={handleGenerate} style={{ justifyContent: 'center', padding: '12px' }}>
              <Sparkles size={16} /> Genera {numCards} flashcard con Samo
            </button>
          </div>

          <div className="card-glass">
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color)', marginBottom: 10 }}>
              Compatibile con SM-2
            </div>
            <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5, marginBottom: 12 }}>
              Le flashcard generate vengono salvate nel sistema di spaced repetition. Saranno disponibili nella sezione Flashcard per la revisione giornaliera.
            </p>
            <div style={{ padding: '10px 12px', borderRadius: 8, background: 'rgba(124,58,237,0.08)', border: '1px solid rgba(124,58,237,0.15)' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#7C3AED', marginBottom: 4 }}>Tip</div>
              <p style={{ fontSize: 12, color: 'var(--muted)', margin: 0 }}>
                Puoi modificare fronte e retro di ogni flashcard prima di salvare il deck.
              </p>
            </div>
          </div>
        </div>
      )}

      {step === 'generating' && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
          <FlashcardProgress step={genProgress} material={sourceName} />
        </div>
      )}

      {step === 'preview' && (
        <div>
          <div className="card" style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <input className="form-input" value={deckTitle} onChange={e => setDeckTitle(e.target.value)}
                style={{ fontWeight: 700, fontSize: 16, border: 'none', padding: '4px 0', background: 'none', width: 340 }} />
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                {cards.length} flashcard · da <strong>{sourceName}</strong>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary" onClick={() => setStep('config')}><RefreshCw size={14} /> Rigenera</button>
              <button className="btn btn-primary" onClick={handleSave}><Save size={14} /> Salva Deck</button>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 12 }}>
            {cards.map((c, i) => (
              <FlashcardPreviewItem key={c.id} card={c} index={i} onEdit={handleEdit} onDelete={handleDelete} onSave={handleSaveCard} />
            ))}
          </div>

          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <button className="btn btn-secondary" onClick={() => setCards(prev => [
              ...prev,
              { id: `fc-new-${Date.now()}`, front: 'Nuova domanda...', back: 'Risposta...', topic: '', editing: true },
            ])}>
              <Plus size={14} /> Aggiungi flashcard
            </button>
          </div>
        </div>
      )}

      {step === 'saved' && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <CheckCircle2 size={56} color="var(--success)" style={{ marginBottom: 16 }} />
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color)', marginBottom: 8 }}>Deck salvato!</h2>
          <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 28 }}>
            {deckTitle} ({cards.length} flashcard)
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link href="/flashcard"><button className="btn btn-primary"><Layers3 size={16} /> Vai alle Flashcard</button></Link>
            <button className="btn btn-secondary" onClick={() => { setStep('config'); setSelectedId(''); setCards([]) }}>
              <Plus size={16} /> Genera un altro
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
