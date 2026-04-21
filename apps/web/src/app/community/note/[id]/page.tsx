'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Eye, Star, Copy, Check } from 'lucide-react'
import { LikeButton } from '@/components/community/LikeButton'
import { SaveButton } from '@/components/community/SaveButton'
import { StarRating } from '@/components/community/StarRating'
import { CommentSection } from '@/components/community/CommentSection'
import { ReportButton } from '@/components/community/ReportButton'

// Static demo data — in a real app this would come from Supabase
const NOTE = {
  id: 'sn1',
  title: 'Sistema nervoso autonomo — Riassunto completo',
  content: `## Sistema nervoso autonomo

Il sistema nervoso autonomo (SNA) è la divisione del sistema nervoso periferico che controlla le funzioni viscerali dell'organismo.

### Divisioni principali

**Sistema simpatico ("fight or flight")**
- Ganglio paravertebrale (catena del simpatico)
- Neurotrasmettitore pregangliare: acetilcolina
- Neurotrasmettitore postgangliare: **noradrenalina** (NA)
- Eccezione: ghiandole sudoripare (acetilcolina)

**Sistema parasimpatico ("rest and digest")**
- Nervo vago (X NC) → organi toracici e addominali
- Neurotrasmettitore pre- e postgangliare: **acetilcolina**
- Recettori: muscarinici (M1-M5)

### Effetti fisiologici

| Organo | Simpatico | Parasimpatico |
|--------|-----------|---------------|
| Cuore | ↑ FC, ↑ contrattilità | ↓ FC |
| Bronchi | Broncodilatazione | Broncocostrizione |
| Pupilla | Midriasi | Miosi |
| Stomaco | ↓ motilità | ↑ motilità |
| Vescica | Rilassamento | Contrazione |

### Neurotrasmettitori e recettori

**Recettori adrenergici:**
- α1: vasocostrizione periferica
- α2: feedback negativo (pre-sinaptico)
- β1: ↑ FC e contrattilità cardiaca
- β2: broncodilatazione, vasodilatazione

**Recettori colinergici:**
- Nicotinici: gangli autonomi, placca neuromuscolare
- Muscarinici: effettori parasimpatici

### Punti chiave per l'esame

1. La doppia innervazione è la regola (eccetto le ghiandole sudoripare, i vasi cutanei e la midollare del surrene)
2. Il simpatico mobilizza le risorse energetiche; il parasimpatico le conserva
3. Il tono vagale a riposo mantiene la FC bassa (60-80 bpm)
`,
  subject: 'Anatomia Umana',
  subjectColor: '#FF6B6B',
  author: 'Laura M.',
  authorAvatar: 'LM',
  authorAvatarColor: '#4ECDC4',
  authorLevel: 8,
  time: '21 Apr 2026',
  tags: ['neuro', 'anatomia', 'sistema-nervoso', 'ripasso'],
  likes: 47,
  saves: 23,
  comments: 8,
  views: 312,
  rating: 4.7,
  ratingCount: 19,
}

export default function SharedNotePage({ params }: { params: { id: string } }) {
  const [copied, setCopied] = useState(false)
  const [userRating, setUserRating] = useState(0)

  const copyNote = () => {
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      {/* Back */}
      <Link href="/community" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--muted)', fontSize: 14, marginBottom: 20, textDecoration: 'none' }}>
        <ArrowLeft size={16} /> Torna al feed
      </Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 260px', gap: 24, alignItems: 'start' }}>
        {/* Main content */}
        <div>
          <div className="card" style={{ marginBottom: 16 }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
              <div className="author-avatar" style={{ background: NOTE.authorAvatarColor, width: 44, height: 44, fontSize: 14 }}>
                {NOTE.authorAvatar}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ fontWeight: 700, fontSize: 15 }}>{NOTE.author}</span>
                  <span className="author-level-badge">Lv {NOTE.authorLevel}</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--muted)' }}>{NOTE.time}</div>
              </div>
              <span className="badge badge-primary" style={{ background: `${NOTE.subjectColor}20`, color: NOTE.subjectColor }}>
                {NOTE.subject}
              </span>
            </div>

            <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color)', marginBottom: 8, lineHeight: 1.3 }}>{NOTE.title}</h1>

            {/* Tags */}
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
              {NOTE.tags.map((t) => (
                <span key={t} style={{ fontSize: 12, color: 'var(--muted)', background: 'var(--surface)', borderRadius: 6, padding: '3px 10px', border: '1px solid var(--border)' }}>
                  #{t}
                </span>
              ))}
            </div>

            {/* Stats row */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, paddingBottom: 16, borderBottom: '1px solid var(--border)', marginBottom: 16 }}>
              <StarRating rating={NOTE.rating} count={NOTE.ratingCount} />
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 13, color: 'var(--muted)' }}>
                <Eye size={14} /> {NOTE.views} visualizzazioni
              </div>
            </div>

            {/* Markdown-like content */}
            <div style={{
              fontSize: 15,
              lineHeight: 1.8,
              color: 'var(--color)',
              whiteSpace: 'pre-wrap',
              fontFamily: 'inherit',
            }}>
              {NOTE.content.split('\n').map((line, i) => {
                if (line.startsWith('## ')) return <h2 key={i} style={{ fontSize: 20, fontWeight: 800, margin: '20px 0 8px', color: 'var(--color)' }}>{line.replace('## ', '')}</h2>
                if (line.startsWith('### ')) return <h3 key={i} style={{ fontSize: 17, fontWeight: 700, margin: '16px 0 6px', color: 'var(--color)' }}>{line.replace('### ', '')}</h3>
                if (line.startsWith('**') && line.endsWith('**')) return <div key={i} style={{ fontWeight: 700, margin: '8px 0 4px' }}>{line.replace(/\*\*/g, '')}</div>
                if (line.startsWith('- ')) return <div key={i} style={{ paddingLeft: 20, position: 'relative', marginBottom: 2 }}><span style={{ position: 'absolute', left: 8 }}>•</span>{line.replace('- ', '').replace(/\*\*(.*?)\*\*/g, '$1')}</div>
                if (line.startsWith('| ')) return <div key={i} style={{ fontFamily: 'monospace', fontSize: 13, borderBottom: '1px solid var(--border)', padding: '6px 0', color: 'var(--muted)' }}>{line}</div>
                if (line.match(/^\d+\./)) return <div key={i} style={{ paddingLeft: 20, marginBottom: 4 }}>{line}</div>
                return <div key={i} style={{ minHeight: line ? undefined : 8 }}>{line}</div>
              })}
            </div>
          </div>

          {/* Actions */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
              <LikeButton count={NOTE.likes} />
              <SaveButton count={NOTE.saves} />
              <ReportButton contentType="shared_note" contentId={NOTE.id} />
              <button className="btn btn-primary" style={{ marginLeft: 'auto', fontSize: 13 }} onClick={copyNote}>
                {copied ? <><Check size={14} /> Copiata</>  : <><Copy size={14} /> Copia nel mio workspace</>}
              </button>
            </div>
            <div style={{ marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 16 }}>
              <CommentSection contentType="shared_note" contentId={NOTE.id} initialCount={NOTE.comments} />
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {/* Valuta */}
          <div className="card">
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Valuta questo appunto</div>
            <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 8 }}>
              {Array.from({ length: 5 }, (_, i) => (
                <Star
                  key={i}
                  size={28}
                  className={`star ${i < userRating ? 'filled' : ''}`}
                  fill={i < userRating ? '#F59E0B' : 'none'}
                  stroke={i < userRating ? '#F59E0B' : '#D1D5DB'}
                  style={{ cursor: 'pointer' }}
                  onClick={() => setUserRating(i + 1)}
                />
              ))}
            </div>
            {userRating > 0 && (
              <div style={{ textAlign: 'center', fontSize: 13, color: 'var(--success)' }}>Grazie per la valutazione!</div>
            )}
          </div>

          {/* Info autore */}
          <div className="card">
            <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 12 }}>Sull'autore</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
              <div className="author-avatar" style={{ background: NOTE.authorAvatarColor, width: 44, height: 44, fontSize: 14 }}>
                {NOTE.authorAvatar}
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{NOTE.author}</div>
                <div className="author-level-badge" style={{ display: 'inline-flex' }}>Livello {NOTE.authorLevel}</div>
              </div>
            </div>
            <Link href={`/community/profilo/user1`} className="btn btn-outline" style={{ width: '100%', textAlign: 'center', fontSize: 13 }}>
              Vedi profilo
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
