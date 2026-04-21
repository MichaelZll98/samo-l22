import { Calendar as CalIcon, ChevronLeft, ChevronRight, Plus } from 'lucide-react'

const days = ['Lun', 'Mar', 'Mer', 'Gio', 'Ven', 'Sab', 'Dom']
const calDays = [
  [null, 1, 2, 3, 4, 5, 6],
  [7, 8, 9, 10, 11, 12, 13],
  [14, 15, 16, 17, 18, 19, 20],
  [21, 22, 23, 24, 25, 26, 27],
  [28, 29, 30, null, null, null, null],
]

const events = [
  { day: 15, label: 'Anatomia Umana', color: '#FF6B6B', time: '09:00' },
  { day: 28, label: 'Fisiologia Appl.', color: '#4ECDC4', time: '14:00' },
  { day: 3, label: 'Studio: TMA', color: '#96CEB4', time: '10:00' },
  { day: 21, label: 'Riunione studio', color: '#0055FF', time: '16:00' },
]

export default function CalendarioPage() {
  return (
    <div>
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1 className="page-title">Calendario</h1>
            <p className="page-subtitle">Esami, sessioni di studio ed eventi</p>
          </div>
          <button className="btn btn-primary" style={{ fontSize: 13 }}>
            <Plus size={16} /> Nuovo evento
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: 20 }}>
        {/* Calendar */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <button className="btn btn-secondary" style={{ padding: '6px 10px' }}>
              <ChevronLeft size={16} />
            </button>
            <div style={{ fontSize: 16, fontWeight: 700, color: 'var(--color)' }}>Maggio 2026</div>
            <button className="btn btn-secondary" style={{ padding: '6px 10px' }}>
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Day headers */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 8 }}>
            {days.map(d => (
              <div key={d} style={{ textAlign: 'center', fontSize: 11, fontWeight: 600, color: 'var(--muted)', padding: '4px 0' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          {calDays.map((week, wi) => (
            <div key={wi} style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, marginBottom: 4 }}>
              {week.map((day, di) => {
                const dayEvents = events.filter(e => e.day === day)
                const isToday = day === 21
                return (
                  <div
                    key={di}
                    style={{
                      minHeight: 52,
                      padding: '6px 4px',
                      borderRadius: 8,
                      background: day === null ? 'transparent' : isToday ? 'var(--primary)' : 'var(--surface)',
                      cursor: day !== null ? 'pointer' : 'default',
                      opacity: day === null ? 0 : 1,
                      border: '1px solid transparent',
                      transition: 'border-color 0.15s',
                    }}
                  >
                    {day !== null && (
                      <>
                        <div style={{
                          fontSize: 12, fontWeight: isToday ? 800 : 500,
                          color: isToday ? 'white' : 'var(--color)',
                          textAlign: 'center', marginBottom: 4,
                        }}>
                          {day}
                        </div>
                        {dayEvents.map((ev, i) => (
                          <div
                            key={i}
                            style={{
                              fontSize: 9, fontWeight: 600,
                              background: ev.color,
                              color: 'white',
                              borderRadius: 3,
                              padding: '1px 3px',
                              marginBottom: 2,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {ev.label}
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          ))}
        </div>

        {/* Sidebar: upcoming events */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          <div className="card">
            <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color)', marginBottom: 14 }}>
              Prossimi eventi
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {events.sort((a, b) => a.day - b.day).map((ev, i) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '10px 12px',
                  borderRadius: 10,
                  background: 'var(--surface)',
                  border: '1px solid var(--border)',
                }}>
                  <div style={{
                    width: 36, height: 36, borderRadius: 10,
                    background: `${ev.color}20`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <CalIcon size={16} color={ev.color} />
                  </div>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--color)' }}>{ev.label}</div>
                    <div style={{ fontSize: 11, color: 'var(--muted)' }}>Mag {ev.day} · {ev.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
