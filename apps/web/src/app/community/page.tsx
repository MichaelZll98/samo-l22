import { Users, FileText, FolderOpen, Star } from 'lucide-react'
import { FeedList } from '@/components/community/FeedList'

export default function CommunityPage() {
  return (
    <div>
      {/* Banner */}
      <div className="community-banner" style={{ position: 'relative' }}>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 6, letterSpacing: -0.5 }}>Community</h1>
          <p style={{ fontSize: 15, opacity: 0.85, marginBottom: 16 }}>
            Condividi appunti, scopri materiali e studia insieme agli altri studenti di L-22.
          </p>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a href="/community/gruppi" className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)', fontSize: 14 }}>
              <Users size={15} /> Gruppi di studio
            </a>
            <a href="/community/materiali" className="btn" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.3)', fontSize: 14 }}>
              <FolderOpen size={15} /> Materiali
            </a>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-row" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-label">Note condivise</div>
          <div className="stat-value">1.4k</div>
          <div className="stat-sub">+32 questa settimana</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Materiali</div>
          <div className="stat-value">847</div>
          <div className="stat-sub">PDF, slide, schemi</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Gruppi attivi</div>
          <div className="stat-value">24</div>
          <div className="stat-sub">12 aperti a tutti</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">Studenti</div>
          <div className="stat-value">1.2k</div>
          <div className="stat-sub">nella community</div>
        </div>
      </div>

      {/* Feed */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' }}>
        <div>
          <FeedList />
        </div>

        {/* Sidebar destra */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {/* Top appunti */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, fontWeight: 700 }}>
              <Star size={15} color="var(--warning)" />
              Top appunti
            </div>
            {[
              { title: 'Metabolismo aerobico completo', subject: 'Fisiologia', rating: 4.9 },
              { title: 'Schema sistema nervoso', subject: 'Anatomia', rating: 4.8 },
              { title: 'Goal setting e motivazione', subject: 'Psicologia', rating: 4.7 },
            ].map((n, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ width: 24, height: 24, borderRadius: 6, background: 'var(--primary-soft)', color: 'var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 800, flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color)' }}>{n.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--muted)' }}>{n.subject} · {n.rating}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Gruppi suggeriti */}
          <div className="card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14, fontWeight: 700 }}>
              <Users size={15} color="var(--primary)" />
              Gruppi suggeriti
            </div>
            {[
              { name: 'Anatomia Esame Giugno', members: 18, color: '#FF6B6B' },
              { name: 'Biomeccanica Study Group', members: 12, color: '#45B7D1' },
              { name: 'Fisiologia Avanzata', members: 9, color: '#96CEB4' },
            ].map((g, i) => (
              <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: i < 2 ? '1px solid var(--border)' : 'none' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 8, height: 8, borderRadius: '50%', background: g.color, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color)' }}>{g.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>{g.members} membri</div>
                  </div>
                </div>
                <a href="/community/gruppi" className="btn btn-outline" style={{ fontSize: 11, padding: '5px 10px' }}>Entra</a>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
