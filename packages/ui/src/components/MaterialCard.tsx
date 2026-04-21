import { Text, XStack, YStack } from 'tamagui'
import { Badge } from './Badge'

interface MaterialCardProps {
  title: string
  subject: string
  fileType: 'pdf' | 'ppt' | 'image'
  sizeLabel: string
  uploadedAt: string
}

export function MaterialCard({ title, subject, fileType, sizeLabel, uploadedAt }: MaterialCardProps) {
  return (
    <YStack backgroundColor="$card" borderWidth={1} borderColor="$cardBorder" borderRadius="$5" padding="$4" gap="$2">
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize={14} fontWeight="700" color="$color">{title}</Text>
        <Badge variant="info" size="sm">{fileType.toUpperCase()}</Badge>
      </XStack>
      <Text fontSize={12} color="$muted">{subject}</Text>
      <XStack justifyContent="space-between">
        <Text fontSize={11} color="$muted">{sizeLabel}</Text>
        <Text fontSize={11} color="$muted">{uploadedAt}</Text>
      </XStack>
    </YStack>
  )
}