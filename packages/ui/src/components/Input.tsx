import { Input as TInput, Label, XStack, YStack, styled, Text } from 'tamagui'
import { forwardRef } from 'react'

const StyledInput = styled(TInput, {
  backgroundColor: '$surface',
  borderColor: '$borderColor',
  borderWidth: 1,
  borderRadius: '$3',
  color: '$color',
  paddingHorizontal: '$4',
  paddingVertical: '$3',
  fontSize: 15,
  fontFamily: '$body',
  placeholderTextColor: '$placeholderColor',
  outlineStyle: 'none',

  hoverStyle: {
    borderColor: '$borderColorHover',
    backgroundColor: '$backgroundHover',
  },
  focusStyle: {
    borderColor: '$primary',
    backgroundColor: '$background',
    shadowColor: '$primary',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
})

interface InputProps {
  label?: string
  placeholder?: string
  value?: string
  onChangeText?: (text: string) => void
  onBlur?: () => void
  onFocus?: () => void
  error?: string
  hint?: string
  type?: 'text' | 'email' | 'password' | 'number'
  disabled?: boolean
  id?: string
}

export function Input({
  label,
  placeholder,
  value,
  onChangeText,
  onBlur,
  onFocus,
  error,
  hint,
  type = 'text',
  disabled,
  id,
}: InputProps) {
  return (
    <YStack gap="$1.5" width="100%">
      {label && (
        <Label
          htmlFor={id}
          fontSize={13}
          fontWeight="600"
          color="$color"
          letterSpacing={0.2}
        >
          {label}
        </Label>
      )}
      <StyledInput
        id={id}
        placeholder={placeholder}
        value={value}
        onChangeText={onChangeText}
        onBlur={onBlur}
        onFocus={onFocus}
        secureTextEntry={type === 'password'}
        keyboardType={type === 'email' ? 'email-address' : type === 'number' ? 'numeric' : 'default'}
        editable={!disabled}
        opacity={disabled ? 0.5 : 1}
        borderColor={error ? '$error' : undefined}
      />
      {error && (
        <Text fontSize={12} color="$error" marginTop="$0.5">
          {error}
        </Text>
      )}
      {hint && !error && (
        <Text fontSize={12} color="$muted" marginTop="$0.5">
          {hint}
        </Text>
      )}
    </YStack>
  )
}
