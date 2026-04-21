import Link from 'next/link'
import { ArrowLeft, BookOpen, FileText, Brain, StickyNote, Calendar, TrendingUp } from 'lucide-react'

const subjectData: Record<string, {
  name: string; cfu: number; color: string; progress: number;
  description: string; grade?: number; status: string;
}> = {
  '1': { name: 'Anatomia Umana', cfu: 9, color: '#FF6B6B', progress: 100, description: 'Studio dell\'anatomia del corpo umano con focus sul sistema muscolo-scheletrico e apparato locomotore.', grade: 29, status: 'completed' },
  '2': { name: 'Fisiologia Applicata', cfu: 9, color: '#4ECDC4', progress: 55, description: 'Fisiologia dei sistemi cardiovascolare, respiratorio e muscolare in contesti sportivi.', status: 'studying' },
  '3': { name: 'Biomeccanica', cfu: 6, color: '#45B7D1', progress: 30, description: 'Principi meccanici applicati al movimento umano e all\'analisi del gesto sportivo.', status: 'studying' },
  '4': { name: 'Teoria e Metodologia dell\'Allenamento', cfu: 12, color: '#96CEB4', progress: 72, description: 'Principi scientifici della programmazione e periodizzazione dell\'allenamento sportivo.', status: 'studying' },
}

const quickActions = [
  { label: 'Note', icon: StickyNote, desc: 'Appunti e mappe concettuali', color: '#0055FF', href: '#' },
  { label: 'Flashcard', icon: Brain, desc: 'Studio attivo con carte', color: '#7C3AED', href: '#' },
  { label: 'Quiz', icon: BookOpen, desc: 'Domande di pratica', color: '#22C55E', href: '#' },
  { label: 'File', icon: FileText, desc: 'Slide e materiali', color: '#F59E0B', href: '#' },
  { label: 'Esame', icon: Calendar, desc: 'Pianifica la data', color: '#F43F5E', href: '#' },
  { label: 'Statistiche', icon: TrendingUp, desc: 'Progresso dettagliato', color: '#4ECDC4', href: '#' },
]

interface Params {
  id: string
}

export default function SubjectDetailPage({ params }: { params: Params }) {
  const subject = subjectData[params.id] ?? {
    name: 'Materia', cfu: 6, color: '#85C1E9', progress: 0,
    description: 'Dettaglio materia.', status: 'planned',
  }

  return (
    <div>
      {/* Back */}
      <Link href="/materie" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 14, color: 'var(--muted)', marginBottom: 20 }}>
        <ArrowLeft size={16} /> Tutte le materie
      </Link>

      {/* Hero */}
      <div style={{
        background: `linear-gradient(135deg, ${subject.color}22, ${subject.color}08)`,
        border: `1px solid ${subject.color}30`,
        borderRadius: 20,
        padding: '28px 32px',
        marginBottom: 24,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <div style={{
              width: 56, height: 56, borderRadius: 16,
              background: `${subject.color}25`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 26,
            }}>
              {subject.name[0]}
            </div>
            <div>
              <div style={{ fontSize: 22, fontWeight: 800, color: 'var(--color)', letterSpacing: -0.5 }}>
                {subject.name}
              </div>
              <div style={{ fontSize: 14, color: 'var(--muted)', marginTop: 4 }}>
                {subject.cfu} CFU
                {subject.grade && ` · Voto: ${subject.grade}/30`}
              </div>
            </div>
          </div>
          <span className={`badge ${subject.status === 'completed' ? 'badge-success' : subject.status === 'studying' ? 'badge-info' : 'badge-primary'}`}>
            {subject.status === 'completed' ? 'Completata' : subject.status === 'studying' ? 'In corso' : 'Pianificata'}
          </span>
        </div>

        <p style={{ fontSize: 14, color: 'var(--muted)', marginTop: 16, lineHeight: 1.6 }}>
          {subject.description}
        </p>

        {/* Progress */}
        <div style={{ marginTop: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: 'var(--muted)' }}>Progresso complessivo</span>
            <span style={{ fontSize: 13, fontWeight: 700, color: subject.color }}>{subject.progress}%</span>
          </div>
          <div className="progress-bar" style={{ height: 8 }}>
            <div className="progress-fill" style={{ width: `${subject.progress}%`, background: subject.color }} />
          </div>
        </div>
      </div>

      {/* Quick actions */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color)', marginBottom: 16 }}>Strumenti di studio</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {quickActions.map(({ label, icon: Icon, desc, color }) => (
            <div
              key={label}
              style={{
                padding: '16px',
                borderRadius: 12,
                background: 'var(--surface)',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                transition: 'border-color 0.15s',
              }}
            >
              <div style={{
                width: 36, height: 36, borderRadius: 10,
                background: `${color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                marginBottom: 10,
              }}>
                <Icon size={18} color={color} />
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color)', marginBottom: 2 }}>{label}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>{desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Coming soon */}
      <div className="card" style={{
        textAlign: 'center', padding: '48px 32px',
        background: 'linear-gradient(135deg, var(--primary-soft), transparent)',
        border: '1px dashed var(--primary)',
      }}>
        <div style={{ fontSize: 32, marginBottom: 12 }}>🚧</div>
        <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color)', marginBottom: 6 }}>
          Contenuti in arrivo
        </div>
        <div style={{ fontSize: 14, color: 'var(--muted)' }}>
          Note, flashcard e quiz saranno disponibili presto
        </div>
      </div>
    </div>
  )
}
