import { Text, XStack, YStack, Stack } from 'tamagui'
import { ProgressRing } from './ProgressRing'
import { Badge } from './Badge'

interface SubjectCardProps {
  name: string
  cfu: number
  progress: number // 0-100
  color?: string
  icon?: React.ReactNode
  status?: 'studying' | 'completed' | 'planned'
  onPress?: () => void
}

const statusConfig = {
  studying: { label: 'In corso', variant: 'info' as const },
  completed: { label: 'Completata', variant: 'success' as const },
  planned: { label: 'Pianificata', variant: 'default' as const },
}

export function SubjectCard({
  name,
  cfu,
  progress,
  color = '#0055FF',
  icon,
  status = 'planned',
  onPress,
}: SubjectCardProps) {
  const sc = statusConfig[status]

  return (
    <YStack
      backgroundColor="$card"
      borderWidth={1}
      borderColor="$cardBorder"
      borderRadius="$5"
      padding="$4"
      gap="$4"
      pressStyle={{ scale: 0.98, backgroundColor: '$surfaceHover' }}
      hoverStyle={{ borderColor: color, shadowColor: color, shadowOpacity: 0.2, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } }}
      onPress={onPress}
      cursor="pointer"
      shadowColor="$shadowColor"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={1}
      shadowRadius={8}
      animation="quick"
    >
      {/* Header */}
      <XStack justifyContent="space-between" alignItems="flex-start">
        <Stack
          width={40}
          height={40}
          borderRadius="$3"
          alignItems="center"
          justifyContent="center"
          backgroundColor={`${color}20`}
        >
          {icon ? (
            <Stack color={color}>{icon}</Stack>
          ) : (
            <Text fontSize={18} fontWeight="700" color={color}>
              {name[0]}
            </Text>
          )}
        </Stack>
        <Badge variant={sc.variant} size="sm">{sc.label}</Badge>
      </XStack>

      {/* Name */}
      <YStack gap="$1">
        <Text fontSize={15} fontWeight="700" color="$color" numberOfLines={2} lineHeight={22}>
          {name}
        </Text>
        <Text fontSize={12} color="$muted">{cfu} CFU</Text>
      </YStack>

      {/* Progress */}
      <XStack alignItems="center" gap="$3">
        <YStack flex={1} gap="$1.5">
          <XStack justifyContent="space-between">
            <Text fontSize={11} color="$muted">Progresso</Text>
            <Text fontSize={11} fontWeight="600" color={color}>{progress}%</Text>
          </XStack>
          <XStack
            height={4}
            backgroundColor="$borderColor"
            borderRadius="$full"
            overflow="hidden"
          >
            <XStack
              height={4}
              width={`${progress}%`}
              backgroundColor={color}
              borderRadius="$full"
            />
          </XStack>
        </YStack>
      </XStack>
    </YStack>
  )
}
