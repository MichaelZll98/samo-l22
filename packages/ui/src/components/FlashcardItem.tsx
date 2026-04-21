import { useState } from 'react'
import { Text, YStack } from 'tamagui'

interface FlashcardItemProps {
  front: string
  back: string
}

export function FlashcardItem({ front, back }: FlashcardItemProps) {
  const [flipped, setFlipped] = useState(false)

  return (
    <YStack
      height={260}
      borderRadius="$6"
      backgroundColor="$card"
      borderWidth={1}
      borderColor="$cardBorder"
      alignItems="center"
      justifyContent="center"
      padding="$5"
      onPress={() => setFlipped((prev) => !prev)}
      cursor="pointer"
      animation="quick"
      pressStyle={{ scale: 0.98 }}
      style={{
        transform: [{ rotateY: `${flipped ? 180 : 0}deg` }],
      }}
    >
      <Text fontSize={18} fontWeight="700" color="$color" textAlign="center">
        {flipped ? back : front}
      </Text>
      <Text fontSize={11} color="$muted" marginTop="$3">
        Tap per girare
      </Text>
    </YStack>
  )
}