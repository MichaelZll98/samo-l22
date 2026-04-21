import { Text, XStack, YStack, Stack } from 'tamagui'

interface StatCardProps {
  label: string
  value: string | number
  subtitle?: string
  icon?: React.ReactNode
  color?: string
  trend?: { value: number; label?: string }
  onPress?: () => void
}

export function StatCard({
  label,
  value,
  subtitle,
  icon,
  color = '#0055FF',
  trend,
  onPress,
}: StatCardProps) {
  const trendPositive = trend && trend.value > 0

  return (
    <YStack
      backgroundColor="$card"
      borderWidth={1}
      borderColor="$cardBorder"
      borderRadius="$5"
      padding="$4"
      gap="$3"
      flex={1}
      pressStyle={{ scale: 0.98 }}
      hoverStyle={{ borderColor: color, shadowColor: color, shadowOpacity: 0.15, shadowRadius: 12, shadowOffset: { width: 0, height: 4 } }}
      onPress={onPress}
      cursor={onPress ? 'pointer' : 'default'}
      shadowColor="$shadowColor"
      shadowOffset={{ width: 0, height: 2 }}
      shadowOpacity={1}
      shadowRadius={8}
      animation="quick"
    >
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize={12} fontWeight="600" color="$muted" letterSpacing={0.3} textTransform="uppercase">
          {label}
        </Text>
        {icon && (
          <Stack
            width={32}
            height={32}
            borderRadius="$2"
            backgroundColor={`${color}18`}
            alignItems="center"
            justifyContent="center"
          >
            <Stack color={color}>{icon}</Stack>
          </Stack>
        )}
      </XStack>

      <YStack gap="$1">
        <Text fontSize={28} fontWeight="800" color="$color" letterSpacing={-0.5}>
          {value}
        </Text>
        {subtitle && (
          <Text fontSize={12} color="$muted">{subtitle}</Text>
        )}
      </YStack>

      {trend && (
        <XStack alignItems="center" gap="$1">
          <Text fontSize={12} fontWeight="600" color={trendPositive ? '$success' : '$error'}>
            {trendPositive ? '+' : ''}{trend.value}%
          </Text>
          {trend.label && (
            <Text fontSize={12} color="$muted">{trend.label}</Text>
          )}
        </XStack>
      )}
    </YStack>
  )
}
