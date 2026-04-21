'use client'

import { useState } from 'react'

const FILTERS = [
  { id: 'all',       label: 'Tutto' },
  { id: 'note',      label: 'Appunti' },
  { id: 'material',  label: 'Materiali' },
  { id: 'popular',   label: 'Popolari' },
  { id: 'recent',    label: 'Recenti' },
]

const SUBJECTS = ['Tutte le materie', 'Anatomia', 'Fisiologia', 'Biomeccanica', 'Psicologia dello Sport', 'Nutrizione', 'Biochimica']

interface Props {
  onFilterChange?: (filter: string) => void
  onSubjectChange?: (subject: string) => void
}

export function FeedFilter({ onFilterChange, onSubjectChange }: Props) {
  const [active, setActive] = useState('all')
  const [subject, setSubject] = useState('Tutte le materie')

  const setFilter = (id: string) => {
    setActive(id)
    onFilterChange?.(id)
  }

  const setSubjectFilter = (s: string) => {
    setSubject(s)
    onSubjectChange?.(s)
  }

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
        <div className="filter-tabs">
          {FILTERS.map((f) => (
            <button key={f.id} className={`filter-tab ${active === f.id ? 'active' : ''}`} onClick={() => setFilter(f.id)}>
              {f.label}
            </button>
          ))}
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <select
            className="form-input"
            style={{ fontSize: 13, padding: '7px 12px', maxWidth: 200 }}
            value={subject}
            onChange={(e) => setSubjectFilter(e.target.value)}
          >
            {SUBJECTS.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}
