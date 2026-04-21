import { Text, XStack, YStack, Stack, Separator } from 'tamagui'
import { Avatar } from './Avatar'

export interface SidebarNavItem {
  key: string
  label: string
  icon: React.ReactNode
  badge?: string | number
}

interface SidebarProps {
  items: SidebarNavItem[]
  activeKey: string
  onPress: (key: string) => void
  userName?: string
  userEmail?: string
  userAvatar?: string
  bottomSlot?: React.ReactNode
}

export function Sidebar({
  items,
  activeKey,
  onPress,
  userName,
  userEmail,
  userAvatar,
  bottomSlot,
}: SidebarProps) {
  return (
    <YStack
      width={240}
      height="100%"
      backgroundColor="$sidebarBg"
      borderRightWidth={1}
      borderRightColor="$sidebarBorder"
      paddingVertical="$4"
      paddingHorizontal="$3"
      justifyContent="space-between"
      // Glassmorphism
      $platform-web={{
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
      }}
    >
      {/* Logo */}
      <YStack gap="$6">
        <XStack alignItems="center" gap="$3" paddingHorizontal="$2" paddingBottom="$2">
          <Stack
            width={32}
            height={32}
            borderRadius="$3"
            backgroundColor="$primary"
            alignItems="center"
            justifyContent="center"
          >
            <Text fontSize={16} fontWeight="800" color="white">L</Text>
          </Stack>
          <YStack>
            <Text fontSize={14} fontWeight="700" color="$color">Samo L-22</Text>
            <Text fontSize={11} color="$muted">Laurea magistrale</Text>
          </YStack>
        </XStack>

        {/* Nav items */}
        <YStack gap="$1">
          {items.map((item) => {
            const isActive = item.key === activeKey
            return (
              <XStack
                key={item.key}
                alignItems="center"
                gap="$3"
                paddingHorizontal="$3"
                paddingVertical="$2.5"
                borderRadius="$3"
                backgroundColor={isActive ? '$navItemActiveBg' : 'transparent'}
                pressStyle={{ backgroundColor: '$surfaceHover' }}
                hoverStyle={{ backgroundColor: isActive ? '$navItemActiveBg' : '$surfaceHover' }}
                onPress={() => onPress(item.key)}
                cursor="pointer"
                justifyContent="space-between"
              >
                <XStack alignItems="center" gap="$3">
                  <Stack color={isActive ? '$navItemActive' : '$navItem'}>
                    {item.icon}
                  </Stack>
                  <Text
                    fontSize={14}
                    fontWeight={isActive ? '600' : '500'}
                    color={isActive ? '$navItemActive' : '$navItem'}
                  >
                    {item.label}
                  </Text>
                </XStack>
                {item.badge !== undefined && (
                  <XStack
                    backgroundColor="$primary"
                    paddingHorizontal="$1.5"
                    paddingVertical="$0.5"
                    borderRadius="$full"
                    minWidth={18}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Text fontSize={10} fontWeight="700" color="white">
                      {item.badge}
                    </Text>
                  </XStack>
                )}
              </XStack>
            )
          })}
        </YStack>
      </YStack>

      {/* Bottom: user info + extra slot */}
      <YStack gap="$3">
        {bottomSlot}
        {userName && (
          <>
            <Separator borderColor="$borderColor" />
            <XStack alignItems="center" gap="$3" paddingHorizontal="$2">
              <Avatar name={userName} src={userAvatar} size="sm" />
              <YStack flex={1}>
                <Text fontSize={13} fontWeight="600" color="$color" numberOfLines={1}>
                  {userName}
                </Text>
                {userEmail && (
                  <Text fontSize={11} color="$muted" numberOfLines={1}>
                    {userEmail}
                  </Text>
                )}
              </YStack>
            </XStack>
          </>
        )}
      </YStack>
    </YStack>
  )
}
