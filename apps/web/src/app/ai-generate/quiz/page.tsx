'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  Brain,
  ChevronLeft,
  FileText,
  NotebookPen,
  Settings2,
  Sparkles,
  CheckCircle2,
  Edit3,
  Save,
  Plus,
  Trash2,
  RefreshCw,
  AlertCircle,
} from 'lucide-react'

// Dati mock materiali e note
const MOCK_MATERIALS = [
  { id: 'm1', name: 'Anatomia_arti_superiori.pdf', type: 'PDF', subject: 'Anatomia' },
  { id: 'm2', name: 'Lezione_fisiologia_cardio.pptx', type: 'PPT', subject: 'Fisiologia' },
  { id: 'm3', name: 'Schema_muscoli_spalla.png', type: 'IMG', subject: 'Anatomia' },
]

const MOCK_NOTES = [
  { id: 'n1', title: 'Appunti Anatomia - Arto superiore', subject: 'Anatomia' },
  { id: 'n2', title: 'Riassunto Fisiologia lezione 3', subject: 'Fisiologia' },
]

type QuizStep = 'config' | 'generating' | 'preview' | 'saved'

interface Question {
  id: string
  type: 'multiple_choice' | 'true_false' | 'fill_blank'
  prompt: string
  options?: string[]
  correct_answer: string
  explanation: string
  editing?: boolean
}

// Domande mock per la preview
const MOCK_QUESTIONS: Question[] = [
  {
    id: 'q1',
    type: 'multiple_choice',
    prompt: 'Quale muscolo è il principale abduttore del braccio?',
    options: ['A) Bicipite brachiale', 'B) Deltoide', 'C) Tricipite brachiale', 'D) Sopraspinato'],
    correct_answer: 'B) Deltoide',
    explanation: 'Il deltoide è il muscolo principale responsabile dell\'abduzione del braccio a livello della spalla, portando il braccio lontano dal corpo fino a circa 90°.',
  },
  {
    id: 'q2',
    type: 'true_false',
    prompt: 'La cuffia dei rotatori è composta da 4 muscoli.',
    options: ['Vero', 'Falso'],
    correct_answer: 'Vero',
    explanation: 'La cuffia dei rotatori è formata da 4 muscoli: sopraspinato, infraspinato, piccolo rotondo e sottoscapolare (acronimo SITS).',
  },
  {
    id: 'q3',
    type: 'multiple_choice',
    prompt: 'Il tendine del bicipite lungo si inserisce su quale struttura?',
    options: ['A) Epicondilo mediale', 'B) Processo coracoideo', 'C) Tubercolo sovraglenoidale', 'D) Grande tubercolo dell\'omero'],
    correct_answer: 'C) Tubercolo sovraglenoidale',
    explanation: 'Il tendine della testa lunga del bicipite origina dal tubercolo sovraglenoidale della scapola, decorrendo nella doccia bicipitale dell\'omero.',
  },
]

function GenerationProgress({ step, material }: { step: number; material: string }) {
  const steps = [
    'Lettura del materiale...',
    'Analisi dei contenuti...',
    'Generazione delle domande...',
    'Aggiunta delle spiegazioni...',
    'Finalizzazione...',
  ]
  return (
    <div className="ai-gen-progress-wrap">
      {/* Samo animato */}
      <div className="ai-gen-samo-anim">
        <div className="samo-welcome-avatar" style={{ width: 80, height: 80, margin: '0 auto 16px' }}>
          <svg width="56" height="56" viewBox="0 0 80 80" fill="none">
            <circle cx="40" cy="40" r="38" fill="rgba(92,139,255,0.1)" />
            <ellipse cx="40" cy="52" rx="22" ry="16" fill="white" />
            <ellipse cx="40" cy="36" rx="18" ry="17" fill="white" />
            <ellipse cx="31" cy="26" rx="10" ry="13" fill="white" transform="rotate(-15 31 26)" />
            <ellipse cx="49" cy="26" rx="10" ry="13" fill="white" transform="rotate(15 49 26)" />
            <ellipse cx="33.5" cy="36.5" rx="4.5" ry="5" fill="#1C1C2E" />
            <ellipse cx="46.5" cy="36.5" rx="4.5" ry="5" fill="#1C1C2E" />
            <circle cx="35" cy="35" r="1.5" fill="white" />
            <circle cx="48" cy="35" r="1.5" fill="white" />
            <ellipse cx="40" cy="43" rx="5" ry="3.5" fill="#FFB3BA" />
          </svg>
        </div>
        <div style={{ display: 'flex', gap: 5, justifyContent: 'center', marginBottom: 20 }}>
          {[0,1,2].map(i => (
            <span key={i} className={`samo-dot samo-dot-${i+1}`} style={{
              width: 8, height: 8, borderRadius: '50%',
              background: 'var(--primary)', display: 'inline-block',
            }} />
          ))}
        </div>
      </div>

      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color)', marginBottom: 8 }}>
        Samo sta generando il quiz...
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
              background: i < step ? 'var(--success)' : i === step ? 'var(--primary)' : 'var(--surface)',
              transition: 'background 0.3s',
            }}>
              {i < step
                ? <CheckCircle2 size={12} color="white" />
                : i === step
                  ? <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'white', animation: 'samo-pulse 1s ease-in-out infinite', display: 'block' }} />
                  : null}
            </div>
            <span style={{
              fontSize: 13,
              color: i <= step ? 'var(--color)' : 'var(--muted)',
              fontWeight: i === step ? 600 : 400,
            }}>{s}</span>
          </div>
        ))}
      </div>

      <div className="progress-bar" style={{ width: '100%', maxWidth: 400, marginTop: 20, height: 8 }}>
        <div className="progress-fill" style={{ width: `${(step / (steps.length - 1)) * 100}%` }} />
      </div>
    </div>
  )
}

function QuestionCard({
  q,
  index,
  onEdit,
  onDelete,
  onSave,
}: {
  q: Question
  index: number
  onEdit: (id: string) => void
  onDelete: (id: string) => void
  onSave: (id: string, updated: Partial<Question>) => void
}) {
  const [localPrompt, setLocalPrompt] = useState(q.prompt)
  const [localExpl, setLocalExpl]     = useState(q.explanation)
  const [localAnswer, setLocalAnswer] = useState(q.correct_answer)

  const typeLabel = q.type === 'multiple_choice' ? 'Risposta multipla'
    : q.type === 'true_false' ? 'Vero / Falso' : 'Completamento'

  return (
    <div className="card ai-question-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            width: 26, height: 26, borderRadius: 8,
            background: 'var(--primary-soft)', color: 'var(--primary)',
            fontWeight: 700, fontSize: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>{index + 1}</span>
          <span className="badge badge-info" style={{ fontSize: 10 }}>{typeLabel}</span>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          {q.editing ? (
            <button className="btn btn-primary" style={{ padding: '4px 10px', fontSize: 12 }}
              onClick={() => onSave(q.id, { prompt: localPrompt, explanation: localExpl, correct_answer: localAnswer, editing: false })}>
              <Save size={12} /> Salva
            </button>
          ) : (
            <button className="samo-icon-btn" onClick={() => onEdit(q.id)} title="Modifica">
              <Edit3 size={14} />
            </button>
          )}
          <button className="samo-icon-btn" style={{ color: 'var(--error)' }} onClick={() => onDelete(q.id)} title="Elimina">
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {q.editing ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div className="form-group">
            <label className="form-label">Domanda</label>
            <textarea className="form-input" rows={3} value={localPrompt}
              onChange={e => setLocalPrompt(e.target.value)} style={{ resize: 'vertical' }} />
          </div>
          <div className="form-group">
            <label className="form-label">Risposta corretta</label>
            <input className="form-input" value={localAnswer}
              onChange={e => setLocalAnswer(e.target.value)} />
          </div>
          <div className="form-group">
            <label className="form-label">Spiegazione</label>
            <textarea className="form-input" rows={3} value={localExpl}
              onChange={e => setLocalExpl(e.target.value)} style={{ resize: 'vertical' }} />
          </div>
        </div>
      ) : (
        <>
          <p style={{ fontSize: 14, fontWeight: 600, color: 'var(--color)', marginBottom: 10, lineHeight: 1.5 }}>
            {q.prompt}
          </p>

          {q.options && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 10 }}>
              {q.options.map((opt) => (
                <div key={opt} style={{
                  padding: '8px 12px', borderRadius: 8,
                  background: opt === q.correct_answer ? 'var(--success-soft)' : 'var(--surface)',
                  border: `1px solid ${opt === q.correct_answer ? 'rgba(34,197,94,0.3)' : 'var(--border)'}`,
                  fontSize: 13,
                  color: opt === q.correct_answer ? 'var(--success)' : 'var(--color)',
                  fontWeight: opt === q.correct_answer ? 600 : 400,
                  display: 'flex', alignItems: 'center', gap: 8,
                }}>
                  {opt === q.correct_answer && <CheckCircle2 size={13} />}
                  {opt}
                </div>
              ))}
            </div>
          )}

          <div style={{
            padding: '10px 12px', borderRadius: 8,
            background: 'var(--info-soft)', border: '1px solid rgba(59,130,246,0.2)',
          }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--info)', marginBottom: 4, textTransform: 'uppercase' }}>
              Spiegazione
            </div>
            <p style={{ fontSize: 13, color: 'var(--color)', lineHeight: 1.5, margin: 0 }}>
              {q.explanation}
            </p>
          </div>
        </>
      )}
    </div>
  )
}

export default function GeneraQuizPage() {
  const [sourceType, setSourceType]       = useState<'material' | 'note'>('material')
  const [selectedId, setSelectedId]       = useState('')
  const [numQuestions, setNumQuestions]   = useState(10)
  const [difficulty, setDifficulty]       = useState<'facile' | 'medio' | 'difficile'>('medio')
  const [qTypes, setQTypes]               = useState<string[]>(['multiple_choice', 'true_false'])
  const [step, setStep]                   = useState<QuizStep>('config')
  const [genProgress, setGenProgress]     = useState(0)
  const [questions, setQuestions]         = useState<Question[]>([])
  const [quizTitle, setQuizTitle]         = useState('')
  const [error, setError]                 = useState('')

  const selectedMaterial = MOCK_MATERIALS.find(m => m.id === selectedId)
  const selectedNote     = MOCK_NOTES.find(n => n.id === selectedId)
  const sourceName       = selectedMaterial?.name ?? selectedNote?.title ?? ''

  const toggleQType = (t: string) => {
    setQTypes(prev => prev.includes(t) ? prev.filter(x => x !== t) : [...prev, t])
  }

  const handleGenerate = async () => {
    if (!selectedId) { setError('Seleziona un materiale o una nota'); return }
    if (qTypes.length === 0) { setError('Seleziona almeno un tipo di domanda'); return }

    setError('')
    setStep('generating')
    setGenProgress(0)

    // Simulazione progresso (in produzione chiama l'edge function)
    for (let i = 1; i <= 5; i++) {
      await new Promise(r => setTimeout(r, 700))
      setGenProgress(i)
    }

    // In produzione: chiama /functions/v1/ai-job-processor
    // const res = await fetch(...)
    // Mock result:
    setQuestions(MOCK_QUESTIONS.map((q, i) => ({ ...q, id: `q${i}` })))
    setQuizTitle(`Quiz AI - ${sourceName}`)
    setStep('preview')
  }

  const handleSave = async () => {
    // In produzione: salva quiz_set + quiz_questions nel DB
    setStep('saved')
  }

  const handleEditQuestion  = (id: string) =>
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, editing: true } : q))

  const handleDeleteQuestion = (id: string) =>
    setQuestions(prev => prev.filter(q => q.id !== id))

  const handleSaveQuestion  = (id: string, upd: Partial<Question>) =>
    setQuestions(prev => prev.map(q => q.id === id ? { ...q, ...upd } : q))

  return (
    <div>
      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <Link href="/ai-generate" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--muted)', fontSize: 13, textDecoration: 'none' }}>
          <ChevronLeft size={14} />
          AI Studio
        </Link>
        <span style={{ color: 'var(--border)' }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color)' }}>Genera Quiz</span>
      </div>

      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 40, height: 40, borderRadius: 12,
            background: 'rgba(92,139,255,0.1)', color: 'var(--primary)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Brain size={20} />
          </div>
          <div>
            <h1 className="page-title">Genera Quiz</h1>
            <p className="page-subtitle">Samo crea domande personalizzate dai tuoi materiali</p>
          </div>
        </div>
      </div>

      {/* Step: Config */}
      {step === 'config' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: 24, alignItems: 'start' }}>
          {/* Form */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {/* Sorgente */}
            <div>
              <div className="form-label" style={{ marginBottom: 8 }}>Tipo di sorgente</div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                {(['material', 'note'] as const).map(t => (
                  <button key={t}
                    className={sourceType === t ? 'btn btn-primary' : 'btn btn-secondary'}
                    style={{ fontSize: 13, padding: '7px 14px' }}
                    onClick={() => { setSourceType(t); setSelectedId('') }}>
                    {t === 'material' ? <><FileText size={14} /> Materiale</> : <><NotebookPen size={14} /> Nota</>}
                  </button>
                ))}
              </div>

              <div className="form-group">
                <label className="form-label">
                  {sourceType === 'material' ? 'Seleziona materiale' : 'Seleziona nota'}
                </label>
                <select className="form-input" value={selectedId} onChange={e => setSelectedId(e.target.value)}>
                  <option value="">-- Scegli --</option>
                  {sourceType === 'material'
                    ? MOCK_MATERIALS.map(m => <option key={m.id} value={m.id}>{m.name} ({m.subject})</option>)
                    : MOCK_NOTES.map(n => <option key={n.id} value={n.id}>{n.title} ({n.subject})</option>)
                  }
                </select>
              </div>
            </div>

            {/* Configurazione */}
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <Settings2 size={16} color="var(--muted)" />
                <span style={{ fontSize: 14, fontWeight: 700, color: 'var(--color)' }}>Configurazione</span>
              </div>

              <div className="grid-2" style={{ gap: 14 }}>
                <div className="form-group">
                  <label className="form-label">Numero domande</label>
                  <select className="form-input" value={numQuestions} onChange={e => setNumQuestions(+e.target.value)}>
                    {[5, 10, 15, 20].map(n => <option key={n} value={n}>{n} domande</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Difficoltà</label>
                  <select className="form-input" value={difficulty} onChange={e => setDifficulty(e.target.value as any)}>
                    <option value="facile">Facile</option>
                    <option value="medio">Medio</option>
                    <option value="difficile">Difficile</option>
                  </select>
                </div>
              </div>

              <div className="form-group" style={{ marginTop: 14 }}>
                <label className="form-label">Tipi di domande</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 6 }}>
                  {[
                    { key: 'multiple_choice', label: 'Risposta multipla' },
                    { key: 'true_false',      label: 'Vero / Falso' },
                    { key: 'fill_blank',      label: 'Completamento' },
                  ].map(({ key, label }) => (
                    <button key={key}
                      onClick={() => toggleQType(key)}
                      className={qTypes.includes(key) ? 'btn btn-primary' : 'btn btn-secondary'}
                      style={{ fontSize: 12, padding: '6px 12px' }}>
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 8, background: 'var(--error-soft)', color: 'var(--error)', fontSize: 13 }}>
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <button className="btn btn-primary" onClick={handleGenerate} style={{ justifyContent: 'center', padding: '12px' }}>
              <Sparkles size={16} />
              Genera {numQuestions} domande con Samo
            </button>
          </div>

          {/* Sidebar info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <div className="card-glass">
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color)', marginBottom: 10 }}>
                Come funziona
              </div>
              {[
                'Samo legge il materiale selezionato',
                'Analizza i concetti chiave',
                'Genera domande contestualizzate',
                'Aggiunge spiegazioni dettagliate',
                'Puoi modificare prima di salvare',
              ].map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'flex-start', marginBottom: 8 }}>
                  <span style={{
                    width: 18, height: 18, borderRadius: '50%',
                    background: 'var(--primary-soft)', color: 'var(--primary)',
                    fontSize: 10, fontWeight: 700,
                    display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                    marginTop: 1,
                  }}>{i + 1}</span>
                  <span style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.4 }}>{s}</span>
                </div>
              ))}
            </div>

            <div className="card" style={{ background: 'var(--warning-soft)', borderColor: 'rgba(245,158,11,0.2)' }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--warning)', marginBottom: 6 }}>
                Nota sui materiali
              </div>
              <p style={{ fontSize: 12, color: 'var(--color)', lineHeight: 1.5, margin: 0 }}>
                Per risultati migliori, assicurati di aver effettuato il parsing del materiale prima della generazione.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Step: Generating */}
      {step === 'generating' && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
          <GenerationProgress step={genProgress} material={sourceName} />
        </div>
      )}

      {/* Step: Preview */}
      {step === 'preview' && (
        <div>
          <div className="card" style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <input
                className="form-input"
                value={quizTitle}
                onChange={e => setQuizTitle(e.target.value)}
                style={{ fontWeight: 700, fontSize: 16, border: 'none', padding: '4px 0', background: 'none', width: 340 }}
                placeholder="Titolo del quiz..."
              />
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                {questions.length} domande · da <strong>{sourceName}</strong>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn-secondary" onClick={() => setStep('config')}>
                <RefreshCw size={14} /> Rigenera
              </button>
              <button className="btn btn-primary" onClick={handleSave}>
                <Save size={14} /> Salva Quiz
              </button>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {questions.map((q, i) => (
              <QuestionCard
                key={q.id}
                q={q}
                index={i}
                onEdit={handleEditQuestion}
                onDelete={handleDeleteQuestion}
                onSave={handleSaveQuestion}
              />
            ))}
          </div>

          <div style={{ marginTop: 16, textAlign: 'center' }}>
            <button className="btn btn-secondary" onClick={() => setQuestions(prev => [
              ...prev,
              {
                id: `q-new-${Date.now()}`,
                type: 'multiple_choice',
                prompt: 'Nuova domanda...',
                options: ['A) Opzione 1', 'B) Opzione 2', 'C) Opzione 3', 'D) Opzione 4'],
                correct_answer: 'A) Opzione 1',
                explanation: 'Spiegazione...',
                editing: true,
              },
            ])}>
              <Plus size={14} /> Aggiungi domanda
            </button>
          </div>
        </div>
      )}

      {/* Step: Saved */}
      {step === 'saved' && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <CheckCircle2 size={56} color="var(--success)" style={{ marginBottom: 16 }} />
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color)', marginBottom: 8 }}>
            Quiz salvato!
          </h2>
          <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 28 }}>
            {quizTitle} ({questions.length} domande)
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link href="/quiz">
              <button className="btn btn-primary"><Brain size={16} /> Vai ai Quiz</button>
            </Link>
            <button className="btn btn-secondary" onClick={() => { setStep('config'); setSelectedId(''); setQuestions([]) }}>
              <Plus size={16} /> Genera un altro
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
