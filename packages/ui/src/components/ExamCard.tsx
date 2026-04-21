import { Text, XStack, YStack, Stack } from 'tamagui'
import { Badge } from './Badge'

interface ExamCardProps {
  subjectName: string
  date: string
  daysLeft?: number
  grade?: number
  status?: 'planned' | 'passed' | 'failed'
  subjectColor?: string
  onPress?: () => void
}

export function ExamCard({
  subjectName,
  date,
  daysLeft,
  grade,
  status = 'planned',
  subjectColor = '#0055FF',
  onPress,
}: ExamCardProps) {
  const badgeVariantMap = {
    planned: 'info' as const,
    passed: 'success' as const,
    failed: 'error' as const,
  }
  const badgeLabelMap = {
    planned: 'Pianificato',
    passed: 'Superato',
    failed: 'Non superato',
  }

  return (
    <XStack
      backgroundColor="$card"
      borderWidth={1}
      borderColor="$cardBorder"
      borderRadius="$4"
      padding="$4"
      gap="$4"
      alignItems="center"
      pressStyle={{ scale: 0.98, backgroundColor: '$surfaceHover' }}
      hoverStyle={{ borderColor: subjectColor }}
      onPress={onPress}
      cursor="pointer"
      shadowColor="$shadowColor"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={1}
      shadowRadius={8}
      animation="quick"
    >
      {/* Color bar */}
      <Stack
        width={4}
        height={48}
        borderRadius="$full"
        backgroundColor={subjectColor}
        flexShrink={0}
      />

      {/* Content */}
      <YStack flex={1} gap="$1">
        <Text fontSize={14} fontWeight="700" color="$color" numberOfLines={1}>
          {subjectName}
        </Text>
        <Text fontSize={12} color="$muted">{date}</Text>
      </YStack>

      {/* Right side */}
      <YStack alignItems="flex-end" gap="$2">
        <Badge variant={badgeVariantMap[status]} size="sm">
          {badgeLabelMap[status]}
        </Badge>
        {status === 'planned' && daysLeft !== undefined && (
          <XStack alignItems="center" gap="$1">
            <Text fontSize={20} fontWeight="800" color={daysLeft <= 7 ? '$error' : daysLeft <= 14 ? '$warning' : '$primary'}>
              {daysLeft}
            </Text>
            <Text fontSize={11} color="$muted">giorni</Text>
          </XStack>
        )}
        {status === 'passed' && grade !== undefined && (
          <XStack alignItems="center" gap="$1">
            <Text fontSize={20} fontWeight="800" color="$success">{grade}</Text>
            <Text fontSize={11} color="$muted">/30</Text>
          </XStack>
        )}
      </YStack>
    </XStack>
  )
}
