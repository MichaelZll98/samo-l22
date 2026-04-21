import { Text, XStack, YStack, Stack } from 'tamagui'
import { Pin } from '@tamagui/lucide-icons'

interface NoteCardProps {
  title: string
  excerpt: string
  subject: string
  tags?: string[]
  pinned?: boolean
  updatedAt: string
  onPress?: () => void
}

export function NoteCard({
  title,
  excerpt,
  subject,
  tags = [],
  pinned = false,
  updatedAt,
  onPress,
}: NoteCardProps) {
  return (
    <YStack
      backgroundColor="$card"
      borderWidth={1}
      borderColor="$cardBorder"
      borderRadius="$5"
      padding="$4"
      gap="$3"
      pressStyle={{ scale: 0.98, backgroundColor: '$surfaceHover' }}
      hoverStyle={{ borderColor: '$primary' }}
      cursor="pointer"
      onPress={onPress}
    >
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize={15} fontWeight="700" color="$color" numberOfLines={1} flex={1}>
          {title}
        </Text>
        {pinned && (
          <Stack
            width={28}
            height={28}
            borderRadius="$3"
            alignItems="center"
            justifyContent="center"
            backgroundColor="$primarySoft"
          >
            <Pin size={14} color="currentColor" />
          </Stack>
        )}
      </XStack>
      <Text fontSize={13} color="$muted" numberOfLines={2}>
        {excerpt}
      </Text>
      <XStack justifyContent="space-between" alignItems="center">
        <XStack gap="$2" flexWrap="wrap">
          <Text fontSize={11} color="$primary" backgroundColor="$primarySoft" paddingHorizontal="$2" paddingVertical="$1" borderRadius="$full">
            {subject}
          </Text>
          {tags.slice(0, 2).map((tag) => (
            <Text key={tag} fontSize={11} color="$muted" backgroundColor="$surface" paddingHorizontal="$2" paddingVertical="$1" borderRadius="$full">
              #{tag}
            </Text>
          ))}
        </XStack>
        <Text fontSize={11} color="$muted">{updatedAt}</Text>
      </XStack>
    </YStack>
  )
}