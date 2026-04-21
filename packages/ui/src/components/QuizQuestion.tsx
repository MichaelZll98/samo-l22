import { Text, XStack, YStack } from 'tamagui'
import { Button } from './Button'

interface QuizOption {
  id: string
  label: string
}

interface QuizQuestionProps {
  index: number
  total: number
  question: string
  type: 'multiple' | 'boolean'
  options: QuizOption[]
  selectedOptionId?: string
  explanation?: string
  onSelect: (optionId: string) => void
}

export function QuizQuestion({
  index,
  total,
  question,
  type,
  options,
  selectedOptionId,
  explanation,
  onSelect,
}: QuizQuestionProps) {
  return (
    <YStack backgroundColor="$card" borderWidth={1} borderColor="$cardBorder" borderRadius="$6" padding="$4" gap="$3">
      <XStack justifyContent="space-between">
        <Text fontSize={12} color="$muted">Domanda {index} / {total}</Text>
        <Text fontSize={12} color="$muted">{type === 'boolean' ? 'Vero/Falso' : 'Multipla'}</Text>
      </XStack>
      <Text fontSize={16} fontWeight="700" color="$color">{question}</Text>
      <YStack gap="$2">
        {options.map((option) => (
          <Button
            key={option.id}
            variant={selectedOptionId === option.id ? 'secondary' : 'outline'}
            onPress={() => onSelect(option.id)}
          >
            {option.label}
          </Button>
        ))}
      </YStack>
      {explanation ? (
        <Text fontSize={13} color="$muted" backgroundColor="$surface" borderRadius="$4" padding="$3">
          Spiegazione: {explanation}
        </Text>
      ) : null}
    </YStack>
  )
}