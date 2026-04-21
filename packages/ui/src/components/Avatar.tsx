import { Text, XStack, YStack, Image } from 'tamagui'

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl'

interface AvatarProps {
  src?: string
  name?: string
  size?: AvatarSize
  color?: string
}

const sizes: Record<AvatarSize, { dim: number; fontSize: number }> = {
  xs: { dim: 24, fontSize: 10 },
  sm: { dim: 32, fontSize: 12 },
  md: { dim: 40, fontSize: 15 },
  lg: { dim: 56, fontSize: 20 },
  xl: { dim: 80, fontSize: 28 },
}

const defaultColors = [
  '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7',
  '#DDA0DD', '#98D8C8', '#F7DC6F', '#BB8FCE', '#82E0AA',
]

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0]?.toUpperCase() ?? '')
    .join('')
}

function getColor(name: string): string {
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return defaultColors[Math.abs(hash) % defaultColors.length]
}

export function Avatar({ src, name = '', size = 'md', color }: AvatarProps) {
  const { dim, fontSize } = sizes[size]
  const bg = color ?? getColor(name)
  const initials = getInitials(name)

  return (
    <XStack
      width={dim}
      height={dim}
      borderRadius={dim / 2}
      backgroundColor={bg}
      alignItems="center"
      justifyContent="center"
      overflow="hidden"
      borderWidth={2}
      borderColor="rgba(255,255,255,0.15)"
    >
      {src ? (
        <Image
          source={{ uri: src }}
          width={dim}
          height={dim}
          resizeMode="cover"
        />
      ) : (
        <Text
          fontSize={fontSize}
          fontWeight="700"
          color="white"
          letterSpacing={0.5}
        >
          {initials || '?'}
        </Text>
      )}
    </XStack>
  )
}
