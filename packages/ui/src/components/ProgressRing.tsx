import React from 'react'
import { Stack, Text, styled, ThemeableStack } from 'tamagui'

interface ProgressRingProps {
  progress: number;
  size?: number;
  strokeWidth?: number;
  color?: string;
  trackColor?: string;
}

export const ProgressRing = ({
  progress = 0,
  size = 120,
  strokeWidth = 10,
  color = '$primary',
  trackColor = '$surface'
}: ProgressRingProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Stack width={size} height={size} alignItems="center" justifyContent="center">
      {/* Semplificazione in SVG puro o view di React Native. 
          In un ambiente reale si usa Svg/Circle da react-native-svg */}
      <Stack
        width={size}
        height={size}
        borderRadius={size / 2}
        borderWidth={strokeWidth}
        borderColor={trackColor}
        position="absolute"
      />
      <Stack
        width={size}
        height={size}
        borderRadius={size / 2}
        borderWidth={strokeWidth}
        borderColor={color}
        borderTopColor="transparent"
        borderRightColor="transparent"
        style={{ transform: [{ rotate: '45deg' }] }}
        position="absolute"
      />
      <Text fontSize={size * 0.25} fontWeight="bold" color="$color">
        {Math.round(progress)}%
      </Text>
    </Stack>
  )
}