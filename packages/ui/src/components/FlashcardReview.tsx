import { Text, XStack, YStack } from 'tamagui'
import { Button } from './Button'
import { FlashcardItem } from './FlashcardItem'

interface FlashcardReviewProps {
  front: string
  back: string
  onRate: (value: number) => void
}

export function FlashcardReview({ front, back, onRate }: FlashcardReviewProps) {
  return (
    <YStack gap="$4">
      <FlashcardItem front={front} back={back} />
      <YStack gap="$2">
        <Text fontSize={13} color="$muted">
          Valuta il richiamo (SM-2): 0 = blackout, 5 = perfetto
        </Text>
        <XStack gap="$2" flexWrap="wrap">
          {[0, 1, 2, 3, 4, 5].map((score) => (
            <Button key={score} variant={score >= 4 ? 'secondary' : 'outline'} onPress={() => onRate(score)}>
              {score}
            </Button>
          ))}
        </XStack>
      </YStack>
    </YStack>
  )
}