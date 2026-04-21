import { Text, YStack } from 'tamagui'
import { Button } from './Button'

interface FileUploadProps {
  subject?: string
  onPick: () => void
}

export function FileUpload({ subject, onPick }: FileUploadProps) {
  return (
    <YStack backgroundColor="$card" borderWidth={1} borderColor="$cardBorder" borderRadius="$6" padding="$4" gap="$2">
      <Text fontSize={16} fontWeight="700" color="$color">Upload materiali</Text>
      <Text fontSize={12} color="$muted">
        PDF, slide (PPT), immagini · {subject ?? 'Materia non selezionata'}
      </Text>
      <Button onPress={onPick}>Seleziona file</Button>
    </YStack>
  )
}