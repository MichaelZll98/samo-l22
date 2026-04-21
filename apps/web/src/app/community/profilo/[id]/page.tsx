import Link from 'next/link'
import { ArrowLeft, FileText, Flame, Trophy, Star } from 'lucide-react'
import { StarRating } from '@/components/community/StarRating'

const PROFILE = {
  id: 'user1',
  name: 'Laura M.',
  avatar: 'LM',
  avatarColor: '#4ECDC4',
  level: 8,
  levelName: 'Ricercatore',
  xp: 3240,
  xpToNext: 4000,
  streak: 15,
  badgesCount: 9,
  publicStats: true,
  bio: 'Studentessa magistrale L-22, appassionata di neuroscienze e biomeccanica del movimento.',
  sharedNotes: [
    { id: 'sn1', title: 'Sistema nervoso autonomo — Riassunto', subject: 'Anatomia', rating: 4.7, ratingCount: 19 },
    { id: 'sn3', title: 'Riflessi spinali e integrazione midollare', subject: 'Fisiologia', rating: 4.5, ratingCount: 11 },
    { id: 'sn5', title: 'Giunzione neuromuscolare', subject: 'Anatomia', rating: 4.8, ratingCount: 6 },
  ],
  badges: [
    { id: 'maratoneta', name: 'Maratoneta', icon: '🔥' },
    { id: 'quiz_master', name: 'Quiz Master', icon: '🧠' },
    { id: 'scrittore', name: 'Scrittore', icon: '✍️' },
    { id: 'condivisione', name: 'Condivisione', icon: '🤝' },
  ],
}

export default function ProfiloPubblicoPage({ params }: { params: { id: string } }) {
  const xpPercent = Math.round((PROFILE.xp / PROFILE.xpToNext) * 100)

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>
      <Link href="/community" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: 'var(--muted)', fontSize: 14, marginBottom: 20, textDecoration: 'none' }}>
        <ArrowLeft size={16} /> Community
      </Link>

      {/* Profile card */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, marginBottom: 20 }}>
          <div className="author-avatar" style={{ background: PROFILE.avatarColor, width: 72, height: 72, fontSize: 22, borderRadius: '50%' }}>
            {PROFILE.avatar}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
              <span style={{ fontSize: 22, fontWeight: 800, color: 'var(--color)' }}>{PROFILE.name}</span>
              <span className="author-level-badge">Lv {PROFILE.level} · {PROFILE.levelName}</span>
            </div>
            {PROFILE.bio && (
              <p style={{ fontSize: 14, color: 'var(--muted)', lineHeight: 1.6 }}>{PROFILE.bio}</p>
            )}
          </div>
        </div>

        {/* XP bar */}
        <div style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>
            <span>XP: {PROFILE.xp.toLocaleString('it-IT')}</span>
            <span>{xpPercent}% al livello {PROFILE.level + 1}</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${xpPercent}%`, background: 'linear-gradient(90deg, var(--primary), #7C3AED)' }} />
          </div>
        </div>

        {/* Stats */}
        {PROFILE.publicStats && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
            {[
              { icon: <Flame size={18} color="#F43F5E" />, label: 'Streak', value: `${PROFILE.streak} gg` },
              { icon: <Trophy size={18} color="#F59E0B" />, label: 'Badge', value: PROFILE.badgesCount },
              { icon: <FileText size={18} color="var(--primary)" />, label: 'Note condivise', value: PROFILE.sharedNotes.length },
            ].map((s, i) => (
              <div key={i} style={{ background: 'var(--surface)', borderRadius: 'var(--r)', padding: '14px', textAlign: 'center', border: '1px solid var(--border)' }}>
                <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--color)' }}>{s.value}</div>
                <div style={{ fontSize: 11, color: 'var(--muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Badges */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <Trophy size={15} color="var(--warning)" /> Badge sbloccati
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          {PROFILE.badges.map((b) => (
            <div key={b.id} title={b.name} style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
              padding: '12px 16px', borderRadius: 'var(--r)', background: 'var(--surface)', border: '1px solid var(--border)', cursor: 'default',
            }}>
              <span style={{ fontSize: 24 }}>{b.icon}</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--muted)' }}>{b.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Shared notes */}
      <div className="card">
        <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 14, display: 'flex', alignItems: 'center', gap: 8 }}>
          <FileText size={15} color="var(--primary)" /> Appunti condivisi
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {PROFILE.sharedNotes.map((n) => (
            <Link key={n.id} href={`/community/note/${n.id}`} style={{ textDecoration: 'none' }}>
              <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 16px' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--color)', marginBottom: 2 }}>{n.title}</div>
                  <span className="badge badge-info" style={{ fontSize: 10 }}>{n.subject}</span>
                </div>
                <StarRating rating={n.rating} count={n.ratingCount} size={12} />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  )
}
