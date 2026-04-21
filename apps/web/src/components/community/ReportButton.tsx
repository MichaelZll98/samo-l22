'use client'

import { useState } from 'react'
import { Flag, X } from 'lucide-react'

const REASONS = [
  { id: 'spam',          label: 'Spam o pubblicità' },
  { id: 'inappropriate', label: 'Contenuto inappropriato' },
  { id: 'copyright',     label: 'Violazione copyright' },
  { id: 'other',         label: 'Altro' },
]

interface Props {
  contentType: string
  contentId: string
}

function ReportModal({ onClose }: { onClose: () => void }) {
  const [reason, setReason] = useState('')
  const [description, setDescription] = useState('')
  const [sent, setSent] = useState(false)

  const submit = () => {
    if (!reason) return
    // In a real app: call Supabase insert into reports
    setSent(true)
    setTimeout(onClose, 1800)
  }

  return (
    <div className="report-overlay" onClick={onClose}>
      <div className="report-dialog" onClick={(e) => e.stopPropagation()}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div>
            <div style={{ fontWeight: 700, fontSize: 17 }}>Segnala contenuto</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 2 }}>Aiutaci a mantenere la community sicura</div>
          </div>
          <button className="samo-icon-btn" onClick={onClose}><X size={18} /></button>
        </div>

        {sent ? (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>✓</div>
            <div style={{ fontWeight: 700 }}>Segnalazione inviata</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginTop: 4 }}>Il nostro team la esaminerà a breve.</div>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
              {REASONS.map((r) => (
                <label key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer', padding: '10px 14px', borderRadius: 'var(--r)', background: reason === r.id ? 'var(--primary-soft)' : 'var(--surface)', border: `1px solid ${reason === r.id ? 'var(--primary)' : 'var(--border)'}`, transition: 'all 0.15s' }}>
                  <input type="radio" name="reason" value={r.id} checked={reason === r.id} onChange={() => setReason(r.id)} style={{ accentColor: 'var(--primary)' }} />
                  <span style={{ fontSize: 14, fontWeight: 500, color: reason === r.id ? 'var(--primary)' : 'var(--color)' }}>{r.label}</span>
                </label>
              ))}
            </div>
            <div className="form-group" style={{ marginBottom: 20 }}>
              <label className="form-label">Dettagli (opzionale)</label>
              <textarea
                className="form-input"
                rows={3}
                placeholder="Descrivi il problema..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                style={{ resize: 'vertical' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={onClose}>Annulla</button>
              <button className="btn btn-primary" style={{ flex: 1 }} onClick={submit} disabled={!reason}>Invia segnalazione</button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

export function ReportButton({ contentType, contentId }: Props) {
  const [open, setOpen] = useState(false)

  return (
    <>
      <button
        className="samo-icon-btn"
        onClick={(e) => { e.stopPropagation(); e.preventDefault(); setOpen(true) }}
        title="Segnala contenuto"
        style={{ marginLeft: 'auto' }}
      >
        <Flag size={14} />
      </button>
      {open && <ReportModal onClose={() => setOpen(false)} />}
    </>
  )
}
