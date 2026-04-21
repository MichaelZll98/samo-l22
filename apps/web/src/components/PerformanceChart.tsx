'use client'

// ── Bar Chart SVG puro ────────────────────────────────────────────────────────
interface BarChartProps {
  data: { label: string; value: number }[]
  color?: string
  height?: number
  unit?: string
}

export function BarChart({ data, color = '#0055FF', height = 120, unit = '' }: BarChartProps) {
  const max = Math.max(...data.map(d => d.value), 1)
  const barWidth = 100 / data.length
  const pad = barWidth * 0.2

  return (
    <svg viewBox={`0 0 100 ${height}`} style={{ width: '100%', height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`bar-grad-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.9" />
          <stop offset="100%" stopColor={color} stopOpacity="0.4" />
        </linearGradient>
      </defs>
      {data.map((d, i) => {
        const barH = (d.value / max) * (height - 20)
        const x = i * barWidth + pad
        const w = barWidth - pad * 2
        const y = height - 16 - barH
        return (
          <g key={i}>
            <rect
              x={x} y={y} width={w} height={barH}
              rx="2" ry="2"
              fill={`url(#bar-grad-${color.replace('#', '')})`}
            />
            <text
              x={x + w / 2} y={height - 4}
              textAnchor="middle"
              fontSize="5"
              fill="var(--muted)"
            >
              {d.label}
            </text>
            {d.value > 0 && (
              <text
                x={x + w / 2} y={y - 2}
                textAnchor="middle"
                fontSize="4.5"
                fill={color}
                fontWeight="600"
              >
                {d.value}{unit}
              </text>
            )}
          </g>
        )
      })}
    </svg>
  )
}

// ── Line Chart SVG puro ───────────────────────────────────────────────────────
interface LineChartProps {
  data: { label: string; value: number }[]
  color?: string
  height?: number
}

export function LineChart({ data, color = '#0055FF', height = 100 }: LineChartProps) {
  if (data.length < 2) return null
  const max = Math.max(...data.map(d => d.value), 1)
  const W = 100
  const H = height
  const padY = 12
  const padX = 4

  const points = data.map((d, i) => ({
    x: padX + (i / (data.length - 1)) * (W - padX * 2),
    y: H - padY - ((d.value / max) * (H - padY * 2 - 10)),
  }))

  const polyline = points.map(p => `${p.x},${p.y}`).join(' ')

  // Fill area below line
  const fillPath = [
    `M${points[0].x},${H - padY}`,
    ...points.map(p => `L${p.x},${p.y}`),
    `L${points[points.length - 1].x},${H - padY}`,
    'Z',
  ].join(' ')

  return (
    <svg viewBox={`0 0 ${W} ${H}`} style={{ width: '100%', height }} preserveAspectRatio="none">
      <defs>
        <linearGradient id={`line-fill-${color.replace('#', '')}`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillPath} fill={`url(#line-fill-${color.replace('#', '')})`} />
      <polyline
        points={polyline}
        fill="none"
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
        strokeLinecap="round"
      />
      {points.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="2" fill={color} />
      ))}
      {data.map((d, i) => (
        <text
          key={i}
          x={points[i].x} y={H - 2}
          textAnchor="middle"
          fontSize="5"
          fill="var(--muted)"
        >
          {d.label}
        </text>
      ))}
    </svg>
  )
}

// ── Radar Chart SVG puro ──────────────────────────────────────────────────────
interface RadarChartProps {
  data: { label: string; value: number; max?: number }[]
  color?: string
  size?: number
}

export function RadarChart({ data, color = '#0055FF', size = 200 }: RadarChartProps) {
  const N = data.length
  if (N < 3) return null
  const cx = size / 2
  const cy = size / 2
  const r = size * 0.38
  const levels = 4

  const angleStep = (Math.PI * 2) / N
  const getAngle = (i: number) => -Math.PI / 2 + i * angleStep

  // Grid circles
  const circles = Array.from({ length: levels }, (_, li) => {
    const pr = (r * (li + 1)) / levels
    const pts = Array.from({ length: N }, (_, i) => {
      const a = getAngle(i)
      return `${cx + pr * Math.cos(a)},${cy + pr * Math.sin(a)}`
    }).join(' ')
    return <polygon key={li} points={pts} fill="none" stroke="var(--border)" strokeWidth="0.5" />
  })

  // Axis lines
  const axes = Array.from({ length: N }, (_, i) => {
    const a = getAngle(i)
    return (
      <line
        key={i}
        x1={cx} y1={cy}
        x2={cx + r * Math.cos(a)}
        y2={cy + r * Math.sin(a)}
        stroke="var(--border)" strokeWidth="0.5"
      />
    )
  })

  // Data polygon
  const dataPoints = data.map((d, i) => {
    const max = d.max ?? 100
    const pct = Math.min(d.value / max, 1)
    const a = getAngle(i)
    return { x: cx + r * pct * Math.cos(a), y: cy + r * pct * Math.sin(a) }
  })
  const polyline = dataPoints.map(p => `${p.x},${p.y}`).join(' ')

  // Labels
  const labels = data.map((d, i) => {
    const a = getAngle(i)
    const lx = cx + (r + 14) * Math.cos(a)
    const ly = cy + (r + 14) * Math.sin(a)
    return (
      <text
        key={i} x={lx} y={ly}
        textAnchor="middle"
        dominantBaseline="central"
        fontSize="6"
        fill="var(--muted)"
        fontWeight="600"
      >
        {d.label}
      </text>
    )
  })

  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: size, height: size }}>
      {circles}
      {axes}
      <polygon
        points={polyline}
        fill={`${color}25`}
        stroke={color}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {dataPoints.map((p, i) => (
        <circle key={i} cx={p.x} cy={p.y} r="2.5" fill={color} />
      ))}
      {labels}
    </svg>
  )
}

// ── Performance Bars ───────────────────────────────────────────────────────────
interface PerformanceBarProps {
  items: { label: string; value: number; color: string; sub?: string }[]
}

export function PerformanceChart({ items }: PerformanceBarProps) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      {items.map(({ label, value, color, sub }) => (
        <div key={label}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color)' }}>{label}</span>
              {sub && <span style={{ fontSize: 11, color: 'var(--muted)' }}>{sub}</span>}
            </div>
            <span style={{ fontSize: 14, fontWeight: 700, color }}>{value}%</span>
          </div>
          <div className="progress-bar" style={{ height: 8 }}>
            <div
              className="progress-fill"
              style={{
                width: `${value}%`,
                background: `linear-gradient(90deg, ${color}99, ${color})`,
              }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
