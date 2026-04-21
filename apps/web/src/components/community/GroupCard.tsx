import Link from 'next/link'
import { Users, BookOpen, Lock } from 'lucide-react'

export interface Group {
  id: string
  name: string
  description: string
  subject: string
  subjectColor: string
  coverColor: string
  memberCount: number
  maxMembers: number
  isPublic: boolean
  isJoined?: boolean
}

export function GroupCard({ group }: { group: Group }) {
  return (
    <Link href={`/community/gruppi/${group.id}`} style={{ textDecoration: 'none' }}>
      <div className="group-card">
        <div className="group-card-cover" style={{ background: group.coverColor }} />
        <div className="group-card-body">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
            <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--color)', lineHeight: 1.3 }}>
              {group.name}
            </div>
            {!group.isPublic && (
              <Lock size={14} color="var(--muted)" style={{ flexShrink: 0, marginLeft: 8, marginTop: 2 }} />
            )}
          </div>
          <div style={{ fontSize: 13, color: 'var(--muted)', marginBottom: 12, lineHeight: 1.5 }}>
            {group.description}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="badge badge-primary" style={{ background: `${group.subjectColor}20`, color: group.subjectColor }}>
                <BookOpen size={10} /> {group.subject}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 12, color: 'var(--muted)' }}>
              <Users size={13} />
              <span>{group.memberCount}/{group.maxMembers}</span>
            </div>
          </div>
          <div style={{ marginTop: 14 }}>
            {group.isJoined ? (
              <div className="btn btn-secondary" style={{ textAlign: 'center', fontSize: 13, width: '100%' }}>
                Membro
              </div>
            ) : (
              <div className="btn btn-outline" style={{ textAlign: 'center', fontSize: 13, width: '100%' }}>
                Unisciti
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  )
}
