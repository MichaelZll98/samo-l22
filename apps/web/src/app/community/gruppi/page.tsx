'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Plus, Search, Users, Lock } from 'lucide-react'
import { GroupCard, Group } from '@/components/community/GroupCard'

const GROUPS: Group[] = [
  {
    id: 'g1',
    name: 'Anatomia Esame Giugno',
    description: 'Gruppo per prepararci insieme all\'esame di Anatomia Umana. Condividiamo schemi, note e facciamo sessioni di studio.',
    subject: 'Anatomia',
    subjectColor: '#FF6B6B',
    coverColor: '#FF6B6B',
    memberCount: 18,
    maxMembers: 30,
    isPublic: true,
    isJoined: true,
  },
  {
    id: 'g2',
    name: 'Biomeccanica Study Group',
    description: 'Studio condiviso dei capitoli di Biomeccanica. Focus su cinematica articolare e analisi del movimento.',
    subject: 'Biomeccanica',
    subjectColor: '#45B7D1',
    coverColor: '#45B7D1',
    memberCount: 12,
    maxMembers: 25,
    isPublic: true,
  },
  {
    id: 'g3',
    name: 'Fisiologia Avanzata',
    description: 'Gruppo avanzato per chi vuole approfondire Fisiologia oltre il programma. Discussioni e paper scientifici.',
    subject: 'Fisiologia',
    subjectColor: '#96CEB4',
    coverColor: '#22C55E',
    memberCount: 9,
    maxMembers: 20,
    isPublic: false,
  },
  {
    id: 'g4',
    name: 'Psicologia dello Sport — Ripasso',
    description: 'Ripasso intensivo per l\'esame di Psicologia dello Sport. Quiz, flashcard e simulazioni.',
    subject: 'Psicologia dello Sport',
    subjectColor: '#F1948A',
    coverColor: '#EC4899',
    memberCount: 21,
    maxMembers: 40,
    isPublic: true,
  },
  {
    id: 'g5',
    name: 'Biochimica L-22',
    description: 'Gruppo dedicato alla Biochimica applicata alle scienze motorie. Metabolismo, enzimi e integratori.',
    subject: 'Biochimica',
    subjectColor: '#8B5CF6',
    coverColor: '#7C3AED',
    memberCount: 14,
    maxMembers: 30,
    isPublic: true,
  },
  {
    id: 'g6',
    name: 'Nutrizione Sportiva',
    description: 'Condivisione di risorse su nutrizione e dietetica dello sportivo. Bilanciamento macronutrienti e timing.',
    subject: 'Nutrizione',
    subjectColor: '#F59E0B',
    coverColor: '#F59E0B',
    memberCount: 7,
    maxMembers: 25,
    isPublic: true,
  },
]

export default function GruppiPage() {
  const [search, setSearch] = useState('')
  const [codeModal, setCodeModal] = useState(false)
  const [inviteCode, setInviteCode] = useState('')

  const filtered = GROUPS.filter((g) =>
    g.name.toLowerCase().includes(search.toLowerCase()) ||
    g.subject.toLowerCase().includes(search.toLowerCase())
  )

  const myGroups = filtered.filter((g) => g.isJoined)
  const otherGroups = filtered.filter((g) => !g.isJoined)

  return (
    <div>
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1 className="page-title">Gruppi di studio</h1>
          <p className="page-subtitle">Collabora con altri studenti per materia o corso</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <button className="btn btn-secondary" onClick={() => setCodeModal(true)}>
            <Lock size={14} /> Entra con codice
          </button>
          <button className="btn btn-primary">
            <Plus size={14} /> Crea gruppo
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row" style={{ gridTemplateColumns: 'repeat(3,1fr)', marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-label">I miei gruppi</div>
          <div className="stat-value">{myGroups.length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Gruppi pubblici</div>
          <div className="stat-value">{GROUPS.filter((g) => g.isPublic).length}</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Studenti coinvolti</div>
          <div className="stat-value">{GROUPS.reduce((s, g) => s + g.memberCount, 0)}</div>
        </div>
      </div>

      {/* Search */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div style={{ position: 'relative' }}>
          <Search size={16} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--muted)' }} />
          <input className="form-input" placeholder="Cerca gruppi per nome o materia..." style={{ paddingLeft: 36 }} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
      </div>

      {/* My groups */}
      {myGroups.length > 0 && (
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
            <Users size={16} color="var(--primary)" /> I miei gruppi
          </h2>
          <div className="grid-3">
            {myGroups.map((g) => <GroupCard key={g.id} group={g} />)}
          </div>
        </div>
      )}

      {/* Other groups */}
      <div>
        <h2 style={{ fontSize: 17, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Users size={16} color="var(--muted)" /> Scopri gruppi
        </h2>
        {otherGroups.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>
            Nessun gruppo trovato.
          </div>
        ) : (
          <div className="grid-3">
            {otherGroups.map((g) => <GroupCard key={g.id} group={g} />)}
          </div>
        )}
      </div>

      {/* Invite code modal */}
      {codeModal && (
        <div className="report-overlay" onClick={() => setCodeModal(false)}>
          <div className="report-dialog" onClick={(e) => e.stopPropagation()}>
            <div style={{ fontWeight: 700, fontSize: 17, marginBottom: 6 }}>Entra con codice invito</div>
            <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 20 }}>Inserisci il codice condiviso dal tuo gruppo</div>
            <div className="form-group" style={{ marginBottom: 20 }}>
              <input
                className="form-input"
                placeholder="Es. AB12CD34"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value.toUpperCase())}
                style={{ fontSize: 18, letterSpacing: 4, textAlign: 'center', fontWeight: 700 }}
                maxLength={8}
              />
            </div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setCodeModal(false)}>Annulla</button>
              <button className="btn btn-primary" style={{ flex: 1 }} disabled={inviteCode.length < 6}>Entra nel gruppo</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
