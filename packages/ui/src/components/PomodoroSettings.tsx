import { Text, XStack, YStack, Input } from 'tamagui'

interface PomodoroSettingsProps {
  focusMinutes: number
  shortBreakMinutes: number
  longBreakMinutes: number
  onChange: (key: 'focus' | 'short' | 'long', value: number) => void
}

export function PomodoroSettings({
  focusMinutes,
  shortBreakMinutes,
  longBreakMinutes,
  onChange,
}: PomodoroSettingsProps) {
  return (
    <YStack backgroundColor="$card" borderWidth={1} borderColor="$cardBorder" borderRadius="$6" padding="$4" gap="$3">
      <Text fontSize={16} fontWeight="700" color="$color">Impostazioni timer</Text>
      <XStack gap="$2">
        <YStack flex={1} gap="$1">
          <Text fontSize={12} color="$muted">Focus</Text>
          <Input value={String(focusMinutes)} onChangeText={(v) => onChange('focus', Number(v || 0))} keyboardType="number-pad" />
        </YStack>
        <YStack flex={1} gap="$1">
          <Text fontSize={12} color="$muted">Short break</Text>
          <Input value={String(shortBreakMinutes)} onChangeText={(v) => onChange('short', Number(v || 0))} keyboardType="number-pad" />
        </YStack>
        <YStack flex={1} gap="$1">
          <Text fontSize={12} color="$muted">Long break</Text>
          <Input value={String(longBreakMinutes)} onChangeText={(v) => onChange('long', Number(v || 0))} keyboardType="number-pad" />
        </YStack>
      </XStack>
    </YStack>
  )
}