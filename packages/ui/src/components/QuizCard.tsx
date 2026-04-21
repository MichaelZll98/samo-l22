import { Text, XStack, YStack } from 'tamagui'
import { Clock3, Filter } from '@tamagui/lucide-icons'
import { Badge } from './Badge'

interface QuizCardProps {
  title: string
  subject: string
  topic: string
  difficulty: 'facile' | 'medio' | 'difficile'
  questions: number
  timed?: boolean
  onPress?: () => void
}

const variantByDifficulty = {
  facile: 'success' as const,
  medio: 'warning' as const,
  difficile: 'error' as const,
}

export function QuizCard({
  title,
  subject,
  topic,
  difficulty,
  questions,
  timed = false,
  onPress,
}: QuizCardProps) {
  return (
    <YStack
      backgroundColor="$card"
      borderWidth={1}
      borderColor="$cardBorder"
      borderRadius="$5"
      padding="$4"
      gap="$3"
      onPress={onPress}
      cursor="pointer"
    >
      <Text fontSize={16} fontWeight="700" color="$color">{title}</Text>
      <XStack gap="$2" flexWrap="wrap">
        <Badge variant="info" size="sm">{subject}</Badge>
        <Badge variant="default" size="sm">
          <XStack alignItems="center" gap="$1"><Filter size={12} /> <Text>{topic}</Text></XStack>
        </Badge>
        <Badge variant={variantByDifficulty[difficulty]} size="sm">{difficulty}</Badge>
      </XStack>
      <XStack justifyContent="space-between">
        <Text fontSize={12} color="$muted">{questions} domande</Text>
        <XStack alignItems="center" gap="$1">
          <Clock3 size={12} color="currentColor" />
          <Text fontSize={12} color="$muted">{timed ? 'Simulazione' : 'Pratica'}</Text>
        </XStack>
      </XStack>
    </YStack>
  )
}