import { Text, XStack, YStack } from 'tamagui'
import { Badge } from './Badge'

interface FlashcardDeckProps {
  title: string
  subject: string
  topic: string
  total: number
  dueToday: number
  onPress?: () => void
}

export function FlashcardDeck({
  title,
  subject,
  topic,
  total,
  dueToday,
  onPress,
}: FlashcardDeckProps) {
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
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize={16} fontWeight="700" color="$color">{title}</Text>
        <Badge variant={dueToday > 0 ? 'warning' : 'success'}>
          {dueToday > 0 ? `${dueToday} in scadenza` : 'In pari'}
        </Badge>
      </XStack>
      <Text fontSize={13} color="$muted">{subject} · {topic}</Text>
      <Text fontSize={12} color="$muted">{total} carte totali</Text>
    </YStack>
  )
}