export interface SM2CardState {
  easiness: number
  interval: number
  repetitions: number
}

export interface SM2ReviewResult extends SM2CardState {
  dueAt: string
}

const MIN_EASINESS = 1.3

export function calculateSM2(state: SM2CardState, quality: number, now = new Date()): SM2ReviewResult {
  const safeQuality = Math.max(0, Math.min(5, quality))
  let { easiness, interval, repetitions } = state

  if (safeQuality < 3) {
    repetitions = 0
    interval = 1
  } else {
    repetitions += 1
    if (repetitions === 1) interval = 1
    else if (repetitions === 2) interval = 6
    else interval = Math.round(interval * easiness)
  }

  easiness = Math.max(
    MIN_EASINESS,
    easiness + (0.1 - (5 - safeQuality) * (0.08 + (5 - safeQuality) * 0.02)),
  )

  const dueDate = new Date(now)
  dueDate.setDate(dueDate.getDate() + interval)

  return {
    easiness: Number(easiness.toFixed(2)),
    interval,
    repetitions,
    dueAt: dueDate.toISOString(),
  }
}