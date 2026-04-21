import { FileText, Pin } from 'lucide-react'

interface BoardItem {
  id: string
  type: 'announcement' | 'resource' | 'goal'
  title: string
  description?: string
  author: string
  time: string
  pinned?: boolean
}

const SAMPLE: BoardItem[] = [
  { id: 'b1', type: 'announcement', title: 'Riunione virtuale domenica alle 18:00', description: 'Organizziamo una sessione di ripasso condiviso. Link Zoom in arrivo!', author: 'Laura M.', time: '1 giorno fa', pinned: true },
  { id: 'b2', type: 'resource', title: 'Slide complete Biomeccanica Cap. 1-6', description: 'Ho caricato tutte le slide con le mie annotazioni. Le trovate nella sezione materiali.', author: 'Giovanni R.', time: '2 giorni fa' },
  { id: 'b3', type: 'goal', title: 'Obiettivo settimana: completare Cap. 7', description: 'Questa settimana ci concentriamo sul capitolo 7. Chi finisce condivide i propri appunti!', author: 'Laura M.', time: '3 giorni fa' },
]

const typeConfig = {
  announcement: { color: 'var(--warning)', bg: 'var(--warning-soft)', label: 'Annuncio' },
  resource:     { color: 'var(--info)',    bg: 'var(--info-soft)',    label: 'Risorsa' },
  goal:         { color: 'var(--success)', bg: 'var(--success-soft)', label: 'Obiettivo' },
}

export function GroupBoard({ groupId }: { groupId: string }) {
  return (
    <div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, fontWeight: 700, fontSize: 15 }}>
        <FileText size={16} color="var(--primary)" />
        Bacheca
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {SAMPLE.map((item) => {
          const cfg = typeConfig[item.type]
          return (
            <div key={item.id} className="card" style={{ borderLeft: `3px solid ${cfg.color}`, position: 'relative' }}>
              {item.pinned && (
                <div style={{ position: 'absolute', top: 14, right: 16 }}>
                  <Pin size={14} color={cfg.color} />
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                <span className="content-tag" style={{ background: cfg.bg, color: cfg.color }}>{cfg.label}</span>
                <span style={{ fontSize: 11, color: 'var(--muted)', marginLeft: 'auto', paddingRight: item.pinned ? 24 : 0 }}>{item.author} · {item.time}</span>
              </div>
              <div style={{ fontWeight: 700, fontSize: 14, color: 'var(--color)', marginBottom: 4 }}>{item.title}</div>
              {item.description && (
                <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.5 }}>{item.description}</div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
