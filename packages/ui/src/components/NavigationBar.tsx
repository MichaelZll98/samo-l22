import { Text, XStack, YStack, Stack } from 'tamagui'

export interface NavItem {
  key: string
  label: string
  icon: React.ReactNode
}

interface NavigationBarProps {
  items: NavItem[]
  activeKey: string
  onPress: (key: string) => void
}

export function NavigationBar({ items, activeKey, onPress }: NavigationBarProps) {
  return (
    <XStack
      position="absolute"
      bottom={0}
      left={0}
      right={0}
      backgroundColor="$card"
      borderTopWidth={1}
      borderTopColor="$cardBorder"
      paddingBottom="$6"
      paddingTop="$2"
      paddingHorizontal="$2"
      justifyContent="space-around"
      alignItems="center"
      shadowColor="$shadowColor"
      shadowOffset={{ width: 0, height: -4 }}
      shadowOpacity={1}
      shadowRadius={16}
      elevation={12}
    >
      {items.map((item) => {
        const isActive = item.key === activeKey
        return (
          <YStack
            key={item.key}
            alignItems="center"
            gap="$1"
            paddingVertical="$2"
            paddingHorizontal="$3"
            borderRadius="$4"
            backgroundColor={isActive ? '$navItemActiveBg' : 'transparent'}
            pressStyle={{ backgroundColor: '$surfaceHover' }}
            onPress={() => onPress(item.key)}
            cursor="pointer"
          >
            <Stack color={isActive ? '$primary' : '$navItem'}>
              {item.icon}
            </Stack>
            <Text
              fontSize={10}
              fontWeight={isActive ? '700' : '500'}
              color={isActive ? '$primary' : '$navItem'}
              letterSpacing={0.3}
            >
              {item.label}
            </Text>
          </YStack>
        )
      })}
    </XStack>
  )
}
