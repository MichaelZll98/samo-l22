import { Card as TCard, styled } from 'tamagui'

export const Card = styled(TCard, {
  name: 'Card',
  backgroundColor: '$background',
  borderRadius: '$6',
  padding: '$4',
  shadowColor: '$color',
  shadowOpacity: 0.1,
  shadowRadius: 10,
  shadowOffset: { width: 0, height: 4 },
  elevation: 2,
  borderWidth: 1,
  borderColor: '$borderColor',
  
  variants: {
    elevated: {
      true: {
        shadowOpacity: 0.2,
        shadowRadius: 20,
        elevation: 6
      }
    }
  }
})