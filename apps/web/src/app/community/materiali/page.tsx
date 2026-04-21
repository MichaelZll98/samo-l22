'use client'

import { useState } from 'react'
import { Download, Filter, FolderOpen, Tag } from 'lucide-react'
import { LikeButton } from '@/components/community/LikeButton'
import { SaveButton } from '@/components/community/SaveButton'
import { ReportButton } from '@/components/community/ReportButton'

const MATERIALS = [
  {
    id: 'm1',
    title: 'Slide Biomeccanica Cap. 1-6',
    description: 'Slide complete con annotazioni del Prof. Martini. Coprono cinematica, dinamica e analisi del movimento.',
    type: 'pptx',
    subject: 'Biomeccanica',
    subjectColor: '#45B7D1',
    author: 'Giovanni R.',
    authorAvatar: 'GR',
    authorAvatarColor: '#96CEB4',
    authorLevel: 5,
    time: '5 ore fa',
    downloads: 67,
    likes: 31,
    saves: 44,
    tags: ['slide', 'biomeccanica', 'cinematica'],
    size: '4.2 MB',
  },
  {
    id: 'm2',
    title: 'Schema muscoli arto inferiore — Annotato',
    description: 'PDF con schemi dettagliati di origine, inserzione, innervazione e funzione di ciascun muscolo.',
    type: 'pdf',
    subject: 'Anatomia',
    subjectColor: '#FF6B6B',
    author: 'Marco T.',
    authorAvatar: 'MT',
    authorAvatarColor: '#A78BFA',
    authorLevel: 7,
    time: '2 giorni fa',
    downloads: 143,
    likes: 64,
    saves: 91,
    tags: ['muscoli', 'arto-inferiore', 'schema'],
    size: '1.8 MB',
  },
  {
    id: 'm3',
    title: 'Dispense Fisiologia Cardiovascolare',
    description: 'Dispense complete sul ciclo cardiaco, regolazione della pressione arteriosa e fisiopatologia.',
    type: 'pdf',
    subject: 'Fisiologia',
    subjectColor: '#96CEB4',
    author: 'Sofia B.',
    authorAvatar: 'SB',
    authorAvatarColor: '#F1948A',
    authorLevel: 11,
    time: '4 giorni fa',
    downloads: 89,
    likes: 52,
    saves: 38,
    tags: ['fisiologia', 'cardiovascolare', 'dispense'],
    size: '2.6 MB',
  },
]

const TYPE_COLORS: Record<string, string> = {
  pdf:  '#EF4444',
  pptx: '#F59E0B',
  docx: '#3B82F6',
  img:  '#22C55E',
}

export default function MaterialiCommunityPage() {
  const [typeFilter, setTypeFilter] = useState('all')
  const [subjectFilter, setSubjectFilter] = useState('Tutte')

  const filtered = MATERIALS.filter((m) => {
    if (typeFilter !== 'all' && m.type !== typeFilter) return false
    if (subjectFilter !== 'Tutte' && m.subject !== subjectFilter) return false
    return true
  })

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Materiali condivisi</h1>
          <p className="page-subtitle">PDF, slide e dispense condivisi dalla community</p>
        </div>
        <button className="btn btn-primary">
          <FolderOpen size={15} /> Condividi materiale
        </button>
      </div>

      {/* Filters */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--muted)', fontSize: 14 }}>
            <Filter size={14} /> Filtri:
          </div>
          <div className="filter-tabs">
            {['all', 'pdf', 'pptx', 'docx'].map((t) => (
              <button key={t} className={`filter-tab ${typeFilter === t ? 'active' : ''}`} onClick={() => setTypeFilter(t)}>
                {t === 'all' ? 'Tutti' : t.toUpperCase()}
              </button>
            ))}
          </div>
          <select className="form-input" style={{ maxWidth: 200, fontSize: 13, padding: '7px 12px', marginLeft: 'auto' }} value={subjectFilter} onChange={(e) => setSubjectFilter(e.target.value)}>
            {['Tutte', 'Anatomia', 'Fisiologia', 'Biomeccanica', 'Psicologia dello Sport'].map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Material list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {filtered.map((m) => (
          <div key={m.id} className="feed-card" style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 16, alignItems: 'start' }}>
            <div>
              {/* Header */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div className="author-avatar" style={{ background: m.authorAvatarColor }}>
                  {m.authorAvatar}
                </div>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                    <span style={{ fontSize: 13, fontWeight: 700 }}>{m.author}</span>
                    <span className="author-level-badge">Lv {m.authorLevel}</span>
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>{m.time}</div>
                </div>
                <span className="badge badge-primary" style={{ marginLeft: 'auto', background: `${m.subjectColor}20`, color: m.subjectColor }}>
                  {m.subject}
                </span>
              </div>

              {/* Title + desc */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                <div className="content-tag" style={{ background: `${TYPE_COLORS[m.type] ?? '#999'}20`, color: TYPE_COLORS[m.type] ?? '#999' }}>
                  {m.type.toUpperCase()}
                </div>
                <span style={{ fontWeight: 700, fontSize: 15, color: 'var(--color)' }}>{m.title}</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 10 }}>{m.description}</div>

              {/* Tags */}
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
                {m.tags.map((tag) => (
                  <span key={tag} style={{ fontSize: 11, color: 'var(--muted)', background: 'var(--surface)', borderRadius: 6, padding: '2px 8px', border: '1px solid var(--border)' }}>
                    <Tag size={9} style={{ verticalAlign: 'middle' }} /> {tag}
                  </span>
                ))}
              </div>

              {/* Actions */}
              <div className="feed-actions">
                <LikeButton count={m.likes} />
                <SaveButton count={m.saves} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, color: 'var(--muted)', padding: '6px 12px' }}>
                  <Download size={14} /> {m.downloads}
                </div>
                <ReportButton contentType="shared_material" contentId={m.id} />
              </div>
            </div>

            {/* Download button */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8, minWidth: 120, paddingTop: 4 }}>
              <div style={{ fontSize: 12, color: 'var(--muted)' }}>{m.size}</div>
              <button className="btn btn-primary" style={{ fontSize: 13, whiteSpace: 'nowrap' }}>
                <Download size={14} /> Scarica
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
