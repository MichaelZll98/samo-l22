import { Text, XStack, YStack } from 'tamagui'
import { Badge } from './Badge'

interface QuizErrorItem {
  question: string
  explanation: string
}

interface QuizResultProps {
  score: number
  correct: number
  total: number
  mode: 'practice' | 'simulation'
  durationLabel: string
  errors?: QuizErrorItem[]
}

export function QuizResult({
  score,
  correct,
  total,
  mode,
  durationLabel,
  errors = [],
}: QuizResultProps) {
  return (
    <YStack backgroundColor="$card" borderWidth={1} borderColor="$cardBorder" borderRadius="$6" padding="$4" gap="$3">
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize={18} fontWeight="800" color="$color">Risultato quiz</Text>
        <Badge variant={mode === 'simulation' ? 'warning' : 'info'}>{mode === 'simulation' ? 'Simulazione' : 'Pratica'}</Badge>
      </XStack>
      <XStack gap="$4">
        <YStack>
          <Text fontSize={11} color="$muted">Punteggio</Text>
          <Text fontSize={28} fontWeight="800" color="$primary">{score}%</Text>
        </YStack>
        <YStack>
          <Text fontSize={11} color="$muted">Corrette</Text>
          <Text fontSize={22} fontWeight="700" color="$success">{correct}/{total}</Text>
        </YStack>
        <YStack>
          <Text fontSize={11} color="$muted">Tempo</Text>
          <Text fontSize={22} fontWeight="700" color="$color">{durationLabel}</Text>
        </YStack>
      </XStack>
      {errors.length > 0 ? (
        <YStack gap="$2">
          <Text fontSize={14} fontWeight="700" color="$color">Review errori</Text>
          {errors.map((item) => (
            <YStack key={item.question} borderWidth={1} borderColor="$borderColor" borderRadius="$4" padding="$3" backgroundColor="$surface" gap="$1">
              <Text fontSize={13} fontWeight="600" color="$color">{item.question}</Text>
              <Text fontSize={12} color="$muted">{item.explanation}</Text>
            </YStack>
          ))}
        </YStack>
      ) : null}
    </YStack>
  )
}