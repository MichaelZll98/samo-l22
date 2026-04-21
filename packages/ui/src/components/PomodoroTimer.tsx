import { useEffect, useMemo, useState } from 'react'
import { Text, XStack, YStack } from 'tamagui'
import { Button } from './Button'

interface PomodoroTimerProps {
  focusMinutes?: number
  shortBreakMinutes?: number
  longBreakMinutes?: number
  subject?: string
  activity?: string
}

type Mode = 'focus' | 'short' | 'long'

const modeLabel: Record<Mode, string> = {
  focus: 'Focus',
  short: 'Short break',
  long: 'Long break',
}

export function PomodoroTimer({
  focusMinutes = 25,
  shortBreakMinutes = 5,
  longBreakMinutes = 15,
  subject,
  activity,
}: PomodoroTimerProps) {
  const durationByMode = useMemo(
    () => ({
      focus: focusMinutes * 60,
      short: shortBreakMinutes * 60,
      long: longBreakMinutes * 60,
    }),
    [focusMinutes, shortBreakMinutes, longBreakMinutes],
  )
  const [mode, setMode] = useState<Mode>('focus')
  const [secondsLeft, setSecondsLeft] = useState(durationByMode.focus)
  const [running, setRunning] = useState(false)
  const [cycles, setCycles] = useState(0)

  useEffect(() => {
    setSecondsLeft(durationByMode[mode])
  }, [mode, durationByMode])

  useEffect(() => {
    if (!running) return
    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setRunning(false)
          if (mode === 'focus') setCycles((c) => c + 1)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [running, mode])

  const total = durationByMode[mode] || 1
  const progress = Math.round(((total - secondsLeft) / total) * 100)
  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const ss = String(secondsLeft % 60).padStart(2, '0')

  return (
    <YStack backgroundColor="$card" borderWidth={1} borderColor="$cardBorder" borderRadius="$6" padding="$5" gap="$4">
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize={18} fontWeight="800" color="$color">Pomodoro</Text>
        <Text fontSize={12} color="$muted">{modeLabel[mode]}</Text>
      </XStack>
      <YStack alignItems="center" gap="$2">
        <Text fontSize={48} fontWeight="800" color="$primary">{mm}:{ss}</Text>
        <Text fontSize={12} color="$muted">Progresso: {progress}% · Sessioni concluse: {cycles}</Text>
        {(subject || activity) ? (
          <Text fontSize={12} color="$muted">
            {subject ?? 'Materia libera'} · {activity ?? 'Studio'}
          </Text>
        ) : null}
      </YStack>
      <XStack gap="$2" justifyContent="center" flexWrap="wrap">
        <Button variant={mode === 'focus' ? 'secondary' : 'outline'} onPress={() => setMode('focus')}>Focus</Button>
        <Button variant={mode === 'short' ? 'secondary' : 'outline'} onPress={() => setMode('short')}>Short</Button>
        <Button variant={mode === 'long' ? 'secondary' : 'outline'} onPress={() => setMode('long')}>Long</Button>
      </XStack>
      <XStack gap="$2" justifyContent="center">
        <Button onPress={() => setRunning((prev) => !prev)}>{running ? 'Pausa' : 'Avvia'}</Button>
        <Button variant="outline" onPress={() => setSecondsLeft(durationByMode[mode])}>Reset</Button>
      </XStack>
    </YStack>
  )
}