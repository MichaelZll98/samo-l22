import { Star } from 'lucide-react'

interface Props {
  rating: number   // 0–5, can be decimal
  count?: number
  size?: number
}

export function StarRating({ rating, count, size = 14 }: Props) {
  const full = Math.floor(rating)
  const hasHalf = rating - full >= 0.5

  return (
    <span className="stars-row" aria-label={`Valutazione: ${rating.toFixed(1)} su 5`}>
      {Array.from({ length: 5 }, (_, i) => (
        <Star
          key={i}
          size={size}
          className={`star ${i < full ? 'filled' : i === full && hasHalf ? 'half' : ''}`}
          fill={i < full ? '#F59E0B' : i === full && hasHalf ? '#F59E0B' : 'none'}
          stroke={i < full || (i === full && hasHalf) ? '#F59E0B' : '#D1D5DB'}
        />
      ))}
      {count !== undefined && (
        <span style={{ fontSize: 12, color: 'var(--muted)', marginLeft: 4 }}>
          ({count})
        </span>
      )}
    </span>
  )
}
