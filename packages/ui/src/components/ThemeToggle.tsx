'use client'
import { XStack, Text, Stack } from 'tamagui'
import { Moon, Sun } from 'lucide-react'

interface ThemeToggleProps {
  theme: 'light' | 'dark'
  onToggle: () => void
}

export function ThemeToggle({ theme, onToggle }: ThemeToggleProps) {
  const isDark = theme === 'dark'

  return (
    <XStack
      backgroundColor="$surface"
      borderWidth={1}
      borderColor="$borderColor"
      borderRadius="$full"
      padding="$0.5"
      width={64}
      alignItems="center"
      pressStyle={{ scale: 0.96 }}
      onPress={onToggle}
      cursor="pointer"
      animation="quick"
    >
      <XStack
        width={28}
        height={28}
        borderRadius={14}
        backgroundColor={isDark ? '$primary' : 'transparent'}
        alignItems="center"
        justifyContent="center"
        animation="quick"
        x={isDark ? 0 : 32}
      >
        {isDark ? (
          <Moon size={14} color="white" />
        ) : (
          <Sun size={14} color="$primary" />
        )}
      </XStack>
      <XStack
        width={28}
        height={28}
        borderRadius={14}
        backgroundColor={!isDark ? '$primary' : 'transparent'}
        alignItems="center"
        justifyContent="center"
        animation="quick"
      >
        {!isDark ? (
          <Sun size={14} color="white" />
        ) : (
          <Moon size={14} color="$muted" />
        )}
      </XStack>
    </XStack>
  )
}
