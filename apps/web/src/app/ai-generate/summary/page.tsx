'use client'

import { useState } from 'react'
import Link from 'next/link'
import {
  FileText,
  ChevronLeft,
  NotebookPen,
  Sparkles,
  CheckCircle2,
  Save,
  RefreshCw,
  Copy,
  Check,
  AlertCircle,
  AlignLeft,
  AlignJustify,
  BookOpen,
} from 'lucide-react'

const MOCK_MATERIALS = [
  { id: 'm1', name: 'Anatomia_arti_superiori.pdf', type: 'PDF', subject: 'Anatomia' },
  { id: 'm2', name: 'Lezione_fisiologia_cardio.pptx', type: 'PPT', subject: 'Fisiologia' },
]

const MOCK_NOTES = [
  { id: 'n1', title: 'Appunti Anatomia - Arto superiore', subject: 'Anatomia' },
  { id: 'n2', title: 'Riassunto Fisiologia lezione 3', subject: 'Fisiologia' },
]

type SummaryStep = 'config' | 'generating' | 'preview' | 'saved'
type SummaryLevel = 'breve' | 'medio' | 'dettagliato'

const MOCK_SUMMARY_BREVE = `## Anatomia Arto Superiore — Concetti Chiave

- **Cuffia dei rotatori**: sopraspinato, infraspinato, piccolo rotondo, sottoscapolare (SITS)
- **Deltoide**: principale abduttore del braccio (fino a 90°)
- **Bicipite brachiale**: flessore del gomito e supinatore dell'avambraccio (due teste)
- **Tricipite brachiale**: estensore del gomito (tre capi: lungo, laterale, mediale)
- **Articolazione gleno-omerale**: enartrosi, massima mobilità ma minore stabilità
- **Articolazione del gomito**: flesso-estensione + prono-supinazione`

const MOCK_SUMMARY_MEDIO = `## Anatomia dell'Arto Superiore

### Articolazione della Spalla

L'articolazione gleno-omerale è una **enartrosi** (sferoidea) che permette movimenti su tutti i piani. La stabilità è garantita principalmente dai muscoli, in particolare dalla **cuffia dei rotatori** (SITS: sopraspinato, infraspinato, piccolo rotondo, sottoscapolare).

Il **deltoide** è il muscolo principale dell'abduzione: le fibre anteriori eseguono flessione e rotazione interna, quelle posteriori estensione e rotazione esterna.

### Muscolatura del Braccio

Il **bicipite brachiale** presenta due capi (lungo e breve) e svolge tre funzioni principali:
1. Flessione del gomito
2. Supinazione dell'avambraccio
3. Flessione della spalla (capo lungo)

Il **tricipite brachiale** con i suoi tre capi è l'unico estensore del gomito, fondamentale nelle attività di spinta.

### Articolazione del Gomito

Il complesso articolare del gomito comprende tre articolazioni: **omero-ulnare** (troclea), **omero-radiale** e **radio-ulnare prossimale**, permettendo flessione/estensione e prono-supinazione.`

const MOCK_SUMMARY_DETTAGLIATO = MOCK_SUMMARY_MEDIO + `

---

## Muscoli dell'Avambraccio

### Lato Anteriore (Flessori)

I muscoli anteriori dell'avambraccio si dividono in tre strati:

**Strato superficiale**: pronatore rotondo, flessore radiale del carpo, palmare lungo, flessore ulnare del carpo

**Strato intermedio**: flessore superficiale delle dita (FDS) — divide in 4 tendini per le dita 2-5

**Strato profondo**: flessore profondo delle dita (FDP), flessore lungo del pollice, pronatore quadrato

### Lato Posteriore (Estensori)

I muscoli posteriori estendono il polso e le dita. Il **supinatore** è il muscolo chiave per la supinazione passiva, mentre con il bicipite agisce nella supinazione attiva.

### Note Cliniche

L'epicondilite laterale (\"gomito del tennista\") coinvolge tipicamente il **ECRB** (estensore radiale breve del carpo). La sindrome del tunnel carpale interessa il **nervo mediano** sotto il retinacolo dei flessori.

---

## Mano e Dita

La mano contiene **19 muscoli intrinseci** divisi in tre gruppi:
- **Tenar**: pollice (opponente, abduttore breve, flessore breve)
- **Ipotenar**: mignolo (opponente, abduttore, flessore breve)
- **Medi**: lombricali (4), interossei dorsali (4) e palmari (3)`

function SummaryProgress({ step, material, level }: { step: number; material: string; level: SummaryLevel }) {
  const steps = ['Analisi del materiale...', 'Identificazione struttura...', 'Sintesi dei contenuti...', 'Formattazione markdown...', 'Revisione finale...']
  const color = level === 'breve' ? 'var(--success)' : level === 'medio' ? 'var(--primary)' : '#7C3AED'
  return (
    <div className="ai-gen-progress-wrap">
      <div className="samo-welcome-avatar" style={{ width: 80, height: 80, margin: '0 auto 16px' }}>
        <svg width="56" height="56" viewBox="0 0 80 80" fill="none">
          <circle cx="40" cy="40" r="38" fill="rgba(34,197,94,0.1)" />
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
          <span key={i} className={`samo-dot samo-dot-${i+1}`} style={{ width: 8, height: 8, borderRadius: '50%', background: color, display: 'inline-block' }} />
        ))}
      </div>
      <h3 style={{ fontSize: 16, fontWeight: 700, color: 'var(--color)', marginBottom: 8 }}>Samo sta scrivendo il riassunto...</h3>
      <p style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>Da: <strong>{material}</strong></p>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8, width: '100%', maxWidth: 400 }}>
        {steps.map((s, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: i < step ? color : i === step ? 'var(--primary)' : 'var(--surface)', transition: 'background 0.3s' }}>
              {i < step && <CheckCircle2 size={12} color="white" />}
            </div>
            <span style={{ fontSize: 13, color: i <= step ? 'var(--color)' : 'var(--muted)', fontWeight: i === step ? 600 : 400 }}>{s}</span>
          </div>
        ))}
      </div>
      <div className="progress-bar" style={{ width: '100%', maxWidth: 400, marginTop: 20, height: 8 }}>
        <div className="progress-fill" style={{ width: `${(step / (steps.length - 1)) * 100}%`, background: color }} />
      </div>
    </div>
  )
}

// Render markdown semplice
function MarkdownPreview({ content }: { content: string }) {
  const rendered = content
    .split('\n')
    .map((line, i) => {
      if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize: 18, fontWeight: 800, color: 'var(--color)', margin: '20px 0 8px' }}>{line.slice(3)}</h2>
      if (line.startsWith('### ')) return <h3 key={i} style={{ fontSize: 15, fontWeight: 700, color: 'var(--color)', margin: '14px 0 6px' }}>{line.slice(4)}</h3>
      if (line.startsWith('---')) return <hr key={i} style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '16px 0' }} />
      if (line.startsWith('- ')) {
        const text = line.slice(2).replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        return <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'flex-start' }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)', marginTop: 7, flexShrink: 0 }} />
          <span style={{ fontSize: 14, color: 'var(--color)', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: text }} />
        </div>
      }
      if (line.startsWith('**') && line.endsWith('**')) {
        return <p key={i} style={{ fontSize: 14, fontWeight: 700, color: 'var(--color)', margin: '8px 0' }}>{line.slice(2, -2)}</p>
      }
      if (line.match(/^\d+\./)) {
        const num = line.match(/^(\d+)\./)?.[1]
        const text = line.replace(/^\d+\.\s*/, '').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        return <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, alignItems: 'flex-start' }}>
          <span style={{ width: 20, height: 20, borderRadius: '50%', background: 'var(--primary-soft)', color: 'var(--primary)', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{num}</span>
          <span style={{ fontSize: 14, color: 'var(--color)', lineHeight: 1.6 }} dangerouslySetInnerHTML={{ __html: text }} />
        </div>
      }
      if (!line.trim()) return <div key={i} style={{ height: 8 }} />
      const text = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/_(.*?)_/g, '<em>$1</em>')
      return <p key={i} style={{ fontSize: 14, color: 'var(--color)', lineHeight: 1.7, margin: '4px 0' }} dangerouslySetInnerHTML={{ __html: text }} />
    })
  return <div>{rendered}</div>
}

export default function GeneraSummaryPage() {
  const [sourceType, setSourceType]   = useState<'material' | 'note'>('material')
  const [selectedId, setSelectedId]   = useState('')
  const [level, setLevel]             = useState<SummaryLevel>('medio')
  const [step, setStep]               = useState<SummaryStep>('config')
  const [genProgress, setGenProgress] = useState(0)
  const [summary, setSummary]         = useState('')
  const [summaryTitle, setSummaryTitle] = useState('')
  const [editing, setEditing]         = useState(false)
  const [editContent, setEditContent] = useState('')
  const [copied, setCopied]           = useState(false)
  const [error, setError]             = useState('')

  const selectedMaterial = MOCK_MATERIALS.find(m => m.id === selectedId)
  const selectedNote     = MOCK_NOTES.find(n => n.id === selectedId)
  const sourceName       = selectedMaterial?.name ?? selectedNote?.title ?? ''

  const levelInfo = {
    breve: { label: 'Breve', desc: 'Bullet points essenziali (5-10 punti)', icon: AlignLeft, color: 'var(--success)' },
    medio: { label: 'Medio', desc: 'Paragrafi organizzati per sezioni (300-500 parole)', icon: AlignJustify, color: 'var(--primary)' },
    dettagliato: { label: 'Dettagliato', desc: 'Riassunto completo con esempi (600-1000+ parole)', icon: BookOpen, color: '#7C3AED' },
  }

  const handleGenerate = async () => {
    if (!selectedId) { setError('Seleziona una sorgente'); return }
    setError('')
    setStep('generating')
    setGenProgress(0)

    for (let i = 1; i <= 5; i++) {
      await new Promise(r => setTimeout(r, 650))
      setGenProgress(i)
    }

    const mockSummary = level === 'breve' ? MOCK_SUMMARY_BREVE : level === 'medio' ? MOCK_SUMMARY_MEDIO : MOCK_SUMMARY_DETTAGLIATO
    setSummary(mockSummary)
    setSummaryTitle(`Riassunto AI - ${sourceName}`)
    setEditContent(mockSummary)
    setStep('preview')
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(summary)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleSave = () => setStep('saved')

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
        <Link href="/ai-generate" style={{ display: 'flex', alignItems: 'center', gap: 4, color: 'var(--muted)', fontSize: 13, textDecoration: 'none' }}>
          <ChevronLeft size={14} />AI Studio
        </Link>
        <span style={{ color: 'var(--border)' }}>/</span>
        <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color)' }}>Genera Riassunto</span>
      </div>

      <div className="page-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 40, height: 40, borderRadius: 12, background: 'rgba(34,197,94,0.1)', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <FileText size={20} />
          </div>
          <div>
            <h1 className="page-title">Genera Riassunto</h1>
            <p className="page-subtitle">Sintesi automatica in 3 livelli di dettaglio</p>
          </div>
        </div>
      </div>

      {step === 'config' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
          <div className="card" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="form-group">
              <label className="form-label">Sorgente</label>
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

            <div>
              <label className="form-label" style={{ marginBottom: 12, display: 'block' }}>Livello di dettaglio</label>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {(Object.entries(levelInfo) as [SummaryLevel, typeof levelInfo.breve][]).map(([key, info]) => (
                  <div key={key}
                    onClick={() => setLevel(key)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px',
                      borderRadius: 10, cursor: 'pointer',
                      border: `1.5px solid ${level === key ? info.color : 'var(--border)'}`,
                      background: level === key ? `rgba(${key === 'breve' ? '34,197,94' : key === 'medio' ? '0,85,255' : '124,58,237'},0.06)` : 'var(--card)',
                      transition: 'all 0.15s',
                    }}>
                    <div style={{ width: 36, height: 36, borderRadius: 8, background: level === key ? `rgba(${key === 'breve' ? '34,197,94' : key === 'medio' ? '0,85,255' : '124,58,237'},0.12)` : 'var(--surface)', color: info.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <info.icon size={18} />
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--color)' }}>{info.label}</div>
                      <div style={{ fontSize: 12, color: 'var(--muted)' }}>{info.desc}</div>
                    </div>
                    {level === key && <CheckCircle2 size={16} color={info.color} style={{ marginLeft: 'auto' }} />}
                  </div>
                ))}
              </div>
            </div>

            {error && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '10px 14px', borderRadius: 8, background: 'var(--error-soft)', color: 'var(--error)', fontSize: 13 }}>
                <AlertCircle size={14} /> {error}
              </div>
            )}

            <button className="btn btn-primary" onClick={handleGenerate} style={{ justifyContent: 'center', padding: '12px' }}>
              <Sparkles size={16} /> Genera riassunto con Samo
            </button>
          </div>

          <div className="card-glass">
            <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color)', marginBottom: 10 }}>Output</div>
            <p style={{ fontSize: 12, color: 'var(--muted)', lineHeight: 1.5 }}>
              Il riassunto viene generato in formato <strong>Markdown</strong> e può essere salvato come nota nella tua raccolta.
              Puoi modificarlo prima di salvare.
            </p>
          </div>
        </div>
      )}

      {step === 'generating' && (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '40px 0' }}>
          <SummaryProgress step={genProgress} material={sourceName} level={level} />
        </div>
      )}

      {step === 'preview' && (
        <div>
          <div className="card" style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <input className="form-input" value={summaryTitle} onChange={e => setSummaryTitle(e.target.value)}
                style={{ fontWeight: 700, fontSize: 16, border: 'none', padding: '4px 0', background: 'none', width: 360 }} />
              <div style={{ fontSize: 13, color: 'var(--muted)' }}>
                Livello: <strong>{levelInfo[level].label}</strong> · da <strong>{sourceName}</strong>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button className="btn btn-secondary" onClick={handleCopy}>
                {copied ? <><Check size={14} color="var(--success)" /> Copiato</> : <><Copy size={14} /> Copia</>}
              </button>
              <button className="btn btn-secondary" onClick={() => { setEditing(e => !e) }}>
                {editing ? 'Anteprima' : 'Modifica'}
              </button>
              <button className="btn btn-secondary" onClick={() => setStep('config')}><RefreshCw size={14} /> Rigenera</button>
              <button className="btn btn-primary" onClick={handleSave}><Save size={14} /> Salva come nota</button>
            </div>
          </div>

          <div className="card">
            {editing ? (
              <textarea
                className="form-input"
                value={editContent}
                onChange={e => { setEditContent(e.target.value); setSummary(e.target.value) }}
                style={{ minHeight: 500, resize: 'vertical', fontFamily: 'monospace', fontSize: 13, lineHeight: 1.6 }}
              />
            ) : (
              <MarkdownPreview content={summary} />
            )}
          </div>
        </div>
      )}

      {step === 'saved' && (
        <div style={{ textAlign: 'center', padding: '60px 0' }}>
          <CheckCircle2 size={56} color="var(--success)" style={{ marginBottom: 16 }} />
          <h2 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color)', marginBottom: 8 }}>Riassunto salvato!</h2>
          <p style={{ fontSize: 15, color: 'var(--muted)', marginBottom: 28 }}>{summaryTitle}</p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
            <Link href="/note"><button className="btn btn-primary"><NotebookPen size={16} /> Vai alle Note</button></Link>
            <button className="btn btn-secondary" onClick={() => { setStep('config'); setSelectedId(''); setSummary('') }}>
              <Sparkles size={16} /> Genera un altro
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
