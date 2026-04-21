'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ArrowLeft, Users, Copy, Share2, Settings } from 'lucide-react'
import { GroupBoard } from '@/components/community/GroupBoard'
import { GroupMembers } from '@/components/community/GroupMembers'
import { GroupChat } from '@/components/community/GroupChat'

const GROUP = {
  id: 'g1',
  name: 'Anatomia Esame Giugno',
  description: 'Gruppo per prepararci insieme all\'esame di Anatomia Umana. Condividiamo schemi, note e facciamo sessioni di studio online.',
  subject: 'Anatomia',
  subjectColor: '#FF6B6B',
  coverColor: '#FF6B6B',
  memberCount: 18,
  maxMembers: 30,
  isPublic: true,
  inviteCode: 'ANAT06JN',
  createdAt: '10 Apr 2026',
}

const MEMBERS = [
  { id: 'u1', name: 'Laura M.', avatar: 'LM', avatarColor: '#4ECDC4', level: 8, role: 'owner' as const },
  { id: 'u2', name: 'Giovanni R.', avatar: 'GR', avatarColor: '#96CEB4', level: 5, role: 'moderator' as const },
  { id: 'u3', name: 'Sofia B.', avatar: 'SB', avatarColor: '#F1948A', level: 11, role: 'member' as const },
  { id: 'u4', name: 'Marco T.', avatar: 'MT', avatarColor: '#A78BFA', level: 7, role: 'member' as const },
  { id: 'u5', name: 'Alessia V.', avatar: 'AV', avatarColor: '#FBD786', level: 6, role: 'member' as const },
]

type Tab = 'bacheca' | 'chat' | 'membri'

export default function GruppoDetailPage({ params }: { params: { id: string } }) {
  const [tab, setTab] = useState<Tab>('bacheca')
  const [codeCopied, setCodeCopied] = useState(false)

  const copyCode = () => {
    setCodeCopied(true)
    setTimeout(() => setCodeCopied(false), 2000)
  }

  return (
    <div>
      <Link href="/community/gruppi" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--muted)', fontSize: 14, marginBottom: 20, textDecoration: 'none' }}>
        <ArrowLeft size={16} /> Tutti i gruppi
      </Link>

      {/* Group header */}
      <div className="card" style={{ marginBottom: 24, borderTop: `4px solid ${GROUP.coverColor}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <h1 style={{ fontSize: 22, fontWeight: 800, color: 'var(--color)' }}>{GROUP.name}</h1>
              <span className="badge badge-primary" style={{ background: `${GROUP.subjectColor}20`, color: GROUP.subjectColor }}>
                {GROUP.subject}
              </span>
            </div>
            <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6, maxWidth: 580 }}>{GROUP.description}</p>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginTop: 10, fontSize: 13, color: 'var(--muted)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Users size={14} /> {GROUP.memberCount}/{GROUP.maxMembers} membri
              </span>
              <span>Creato il {GROUP.createdAt}</span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button className="btn btn-secondary" onClick={copyCode} style={{ fontSize: 13 }}>
              <Copy size={14} /> {codeCopied ? GROUP.inviteCode : 'Codice invito'}
            </button>
            <button className="btn btn-secondary" style={{ fontSize: 13 }}>
              <Share2 size={14} /> Condividi
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="filter-tabs" style={{ marginBottom: 24 }}>
        {(['bacheca', 'chat', 'membri'] as Tab[]).map((t) => (
          <button key={t} className={`filter-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)} style={{ textTransform: 'capitalize' }}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div className="card">
        {tab === 'bacheca' && <GroupBoard groupId={GROUP.id} />}
        {tab === 'chat'    && <GroupChat groupId={GROUP.id} />}
        {tab === 'membri'  && <GroupMembers members={MEMBERS} />}
      </div>
    </div>
  )
}
