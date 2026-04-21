import { Text, YStack } from 'tamagui'

interface MaterialPreviewProps {
  fileName: string
  fileType: 'pdf' | 'ppt' | 'image'
}

export function MaterialPreview({ fileName, fileType }: MaterialPreviewProps) {
  return (
    <YStack
      backgroundColor="$surface"
      borderWidth={1}
      borderColor="$borderColor"
      borderRadius="$5"
      minHeight={160}
      alignItems="center"
      justifyContent="center"
      padding="$4"
    >
      <Text fontSize={13} fontWeight="700" color="$color">{fileName}</Text>
      <Text fontSize={12} color="$muted" marginTop="$2">
        Preview {fileType.toUpperCase()} disponibile in app web
      </Text>
    </YStack>
  )
}