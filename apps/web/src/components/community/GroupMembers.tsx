import { Users } from 'lucide-react'

interface Member {
  id: string
  name: string
  avatar: string
  avatarColor: string
  level: number
  role: 'owner' | 'moderator' | 'member'
}

interface Props {
  members: Member[]
}

export function GroupMembers({ members }: Props) {
  const roleLabel: Record<string, string> = {
    owner: 'Fondatore',
    moderator: 'Moderatore',
    member: 'Membro',
  }
  const roleBadge: Record<string, string> = {
    owner: 'badge-warning',
    moderator: 'badge-info',
    member: 'badge-success',
  }

  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontWeight: 700, fontSize: 15 }}>
        <Users size={16} color="var(--primary)" />
        Membri ({members.length})
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {members.map((m) => (
          <div key={m.id} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="author-avatar" style={{ background: m.avatarColor, width: 36, height: 36 }}>
              {m.avatar}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color)' }}>{m.name}</div>
              <div style={{ fontSize: 11, color: 'var(--muted)' }}>Livello {m.level}</div>
            </div>
            <span className={`badge ${roleBadge[m.role]}`}>{roleLabel[m.role]}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
