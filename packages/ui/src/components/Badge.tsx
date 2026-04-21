import { Text, XStack, styled } from 'tamagui'

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'outline'
type BadgeSize = 'sm' | 'md' | 'lg'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  size?: BadgeSize
  dot?: boolean
}

const variantStyles: Record<BadgeVariant, { bg: string; color: string; border?: string }> = {
  default: { bg: '$primarySoft', color: '$primary' },
  success: { bg: '$successSoft', color: '$success' },
  warning: { bg: '$warningSoft', color: '$warning' },
  error: { bg: '$errorSoft', color: '$error' },
  info: { bg: '$infoSoft', color: '$info' },
  outline: { bg: 'transparent', color: '$color', border: '$borderColor' },
}

const sizeStyles: Record<BadgeSize, { px: string; py: string; fontSize: number; gap: string }> = {
  sm: { px: '$2', py: '$0.5', fontSize: 11, gap: '$1' },
  md: { px: '$2.5', py: '$1', fontSize: 12, gap: '$1.5' },
  lg: { px: '$3', py: '$1.5', fontSize: 13, gap: '$2' },
}

export function Badge({ children, variant = 'default', size = 'md', dot }: BadgeProps) {
  const vs = variantStyles[variant]
  const ss = sizeStyles[size]

  return (
    <XStack
      alignItems="center"
      gap={ss.gap}
      backgroundColor={vs.bg}
      paddingHorizontal={ss.px}
      paddingVertical={ss.py}
      borderRadius="$full"
      borderWidth={variant === 'outline' ? 1 : 0}
      borderColor={vs.border}
      alignSelf="flex-start"
    >
      {dot && (
        <XStack
          width={6}
          height={6}
          borderRadius={3}
          backgroundColor={vs.color}
        />
      )}
      <Text
        fontSize={ss.fontSize}
        fontWeight="600"
        color={vs.color}
        letterSpacing={0.3}
      >
        {children}
      </Text>
    </XStack>
  )
}
