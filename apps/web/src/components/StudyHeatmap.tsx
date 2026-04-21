'use client'

// Genera 365 giorni di dati mock per la heatmap
function generateHeatmapData() {
  const data: { date: string; minutes: number }[] = []
  const today = new Date()
  for (let i = 364; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().slice(0, 10)
    // Pattern realistico: giorni con studio variabile
    const rand = Math.random()
    let minutes = 0
    if (rand > 0.35) {
      if (rand > 0.9) minutes = Math.floor(Math.random() * 180 + 120) // 2-5h
      else if (rand > 0.7) minutes = Math.floor(Math.random() * 90 + 60) // 1-2.5h
      else minutes = Math.floor(Math.random() * 50 + 10) // 10min-1h
    }
    data.push({ date: dateStr, minutes })
  }
  return data
}

function getIntensity(minutes: number): number {
  if (minutes === 0) return 0
  if (minutes < 30) return 1
  if (minutes < 60) return 2
  if (minutes < 120) return 3
  return 4
}

const MONTHS = ['Gen','Feb','Mar','Apr','Mag','Giu','Lug','Ago','Set','Ott','Nov','Dic']
const DAYS_SHORT = ['','Lun','','Mer','','Ven','']

export function StudyHeatmap() {
  const data = generateHeatmapData()

  // Raggruppa per settimana (colonne)
  const firstDay = new Date(data[0].date)
  const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1 // Mon=0
  const weeks: ({ date: string; minutes: number } | null)[][] = []
  let currentWeek: ({ date: string; minutes: number } | null)[] = Array(startOffset).fill(null)

  data.forEach((d) => {
    currentWeek.push(d)
    if (currentWeek.length === 7) {
      weeks.push(currentWeek)
      currentWeek = []
    }
  })
  if (currentWeek.length > 0) {
    while (currentWeek.length < 7) currentWeek.push(null)
    weeks.push(currentWeek)
  }

  // Etichette mesi
  const monthLabels: { label: string; col: number }[] = []
  weeks.forEach((week, wi) => {
    const first = week.find(d => d !== null)
    if (first) {
      const date = new Date(first.date)
      if (date.getDate() <= 7) {
        monthLabels.push({ label: MONTHS[date.getMonth()], col: wi })
      }
    }
  })

  const totalMinutes = data.reduce((s, d) => s + d.minutes, 0)
  const activeDays = data.filter(d => d.minutes > 0).length

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700, color: 'var(--color)' }}>Attività di Studio</div>
          <div style={{ fontSize: 12, color: 'var(--muted)', marginTop: 2 }}>
            {activeDays} giorni attivi · {Math.round(totalMinutes / 60)}h totali negli ultimi 12 mesi
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--muted)' }}>
          <span>Meno</span>
          {[0,1,2,3,4].map(i => (
            <div key={i} style={{
              width: 12, height: 12, borderRadius: 3,
              background: i === 0
                ? 'var(--surface)'
                : `rgba(0,85,255,${0.15 + i * 0.2})`,
              border: '1px solid var(--border)',
            }} />
          ))}
          <span>Più</span>
        </div>
      </div>

      <div style={{ overflowX: 'auto', paddingBottom: 4 }}>
        <div style={{ display: 'flex', gap: 2, minWidth: 'fit-content' }}>
          {/* Day labels */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2, paddingTop: 20 }}>
            {DAYS_SHORT.map((d, i) => (
              <div key={i} style={{ height: 12, fontSize: 9, color: 'var(--muted)', width: 24, lineHeight: '12px' }}>
                {d}
              </div>
            ))}
          </div>

          {/* Weeks grid */}
          <div>
            {/* Month labels */}
            <div style={{ display: 'flex', gap: 2, marginBottom: 4, height: 16 }}>
              {weeks.map((_, wi) => {
                const ml = monthLabels.find(m => m.col === wi)
                return (
                  <div key={wi} style={{ width: 12, fontSize: 9, color: 'var(--muted)', whiteSpace: 'nowrap' }}>
                    {ml ? ml.label : ''}
                  </div>
                )
              })}
            </div>
            {/* Days */}
            <div style={{ display: 'flex', gap: 2 }}>
              {weeks.map((week, wi) => (
                <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  {week.map((day, di) => {
                    if (!day) return <div key={di} style={{ width: 12, height: 12 }} />
                    const intensity = getIntensity(day.minutes)
                    const title = day.minutes > 0
                      ? `${day.date}: ${Math.round(day.minutes / 60 * 10) / 10}h`
                      : day.date
                    return (
                      <div
                        key={di}
                        title={title}
                        style={{
                          width: 12, height: 12, borderRadius: 3,
                          background: intensity === 0
                            ? 'var(--surface)'
                            : `rgba(0,85,255,${0.15 + intensity * 0.2})`,
                          border: '1px solid var(--border)',
                          cursor: 'default',
                          transition: 'transform 0.1s',
                        }}
                      />
                    )
                  })}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
