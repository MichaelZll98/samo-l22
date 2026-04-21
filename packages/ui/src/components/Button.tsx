import { Button as TButton, styled } from 'tamagui'

export const Button = styled(TButton, {
  name: 'Button',
  backgroundColor: '$primary',
  color: 'white',
  borderRadius: '$4',
  paddingHorizontal: '$4',
  paddingVertical: '$2',
  pressStyle: {
    opacity: 0.8,
    scale: 0.98
  },
  variants: {
    variant: {
      secondary: {
        backgroundColor: '$surface',
        color: '$color',
      },
      outline: {
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: '$primary',
        color: '$primary'
      }
    }
  }
})