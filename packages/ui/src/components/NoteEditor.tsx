import { Text, TextArea, XStack, YStack } from 'tamagui'
import { Bold, Heading, Italic, List, Code, Pin } from '@tamagui/lucide-icons'
import { Button } from './Button'

interface NoteEditorProps {
  title: string
  content: string
  onTitleChange: (value: string) => void
  onContentChange: (value: string) => void
  onPinToggle?: () => void
  pinned?: boolean
}

const toolbarItems = [
  { key: 'h', icon: Heading },
  { key: 'b', icon: Bold },
  { key: 'i', icon: Italic },
  { key: 'l', icon: List },
  { key: 'c', icon: Code },
]

export function NoteEditor({
  title,
  content,
  onTitleChange,
  onContentChange,
  onPinToggle,
  pinned = false,
}: NoteEditorProps) {
  return (
    <YStack gap="$3" backgroundColor="$card" borderWidth={1} borderColor="$cardBorder" borderRadius="$6" padding="$4">
      <XStack justifyContent="space-between" alignItems="center">
        <Text fontSize={14} fontWeight="700" color="$color">Editor note</Text>
        <Button variant="secondary" onPress={onPinToggle}>
          <XStack alignItems="center" gap="$2">
            <Pin size={14} color="currentColor" />
            <Text>{pinned ? 'Pinned' : 'Pin'}</Text>
          </XStack>
        </Button>
      </XStack>
      <TextArea
        value={title}
        onChangeText={onTitleChange}
        placeholder="Titolo nota"
        backgroundColor="$surface"
        borderWidth={1}
        borderColor="$borderColor"
        color="$color"
        fontSize={18}
        fontWeight="700"
        minHeight={56}
      />
      <XStack gap="$2" flexWrap="wrap">
        {toolbarItems.map(({ key, icon: Icon }) => (
          <Button key={key} variant="outline" size="$2">
            <Icon size={14} color="currentColor" />
          </Button>
        ))}
      </XStack>
      <TextArea
        value={content}
        onChangeText={onContentChange}
        placeholder="Scrivi qui la tua nota (supporto markdown/rich text)"
        backgroundColor="$surface"
        borderWidth={1}
        borderColor="$borderColor"
        color="$color"
        minHeight={320}
      />
    </YStack>
  )
}