import React, { useEffect, useRef, useState } from 'react'
import Svg, {
  Circle,
  Ellipse,
  G,
  Path,
  Defs,
  RadialGradient,
  Stop,
  LinearGradient,
} from 'react-native-svg'

export type SamoMood = 'normal' | 'thinking' | 'happy' | 'surprised' | 'encouraging'

interface SamoiedoAvatarProps {
  size?: number
  mood?: SamoMood
  animated?: boolean
}

const COLORS = {
  fur: '#F5F0EB',
  furLight: '#FEFCFA',
  furShadow: '#E8E0D8',
  nose: '#1A1A1A',
  eyes: '#1A1A1A',
  eyeShine: '#FFFFFF',
  tongue: '#FF8FA3',
  tongueShade: '#E87A8E',
  innerEar: '#FFD6DC',
  cheek: '#FFE0E6',
  accent: '#5C8BFF',
  accentLight: '#85A8FF',
}

export function SamoiedoAvatar({
  size = 48,
  mood = 'normal',
  animated = true,
}: SamoiedoAvatarProps) {
  const [blinkState, setBlinkState] = useState(false)
  const [tailWag, setTailWag] = useState(0)
  const blinkTimer = useRef<ReturnType<typeof setInterval> | null>(null)
  const tailTimer = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!animated) return

    // Blink animation
    const startBlink = () => {
      blinkTimer.current = setInterval(() => {
        setBlinkState(true)
        setTimeout(() => setBlinkState(false), 150)
      }, 3000 + Math.random() * 2000)
    }
    startBlink()

    // Tail wag when thinking
    if (mood === 'thinking') {
      tailTimer.current = setInterval(() => {
        setTailWag((prev) => (prev === 0 ? 1 : 0))
      }, 400)
    }

    return () => {
      if (blinkTimer.current) clearInterval(blinkTimer.current)
      if (tailTimer.current) clearInterval(tailTimer.current)
    }
  }, [animated, mood])

  const showTongue = mood === 'happy' || mood === 'encouraging'
  const eyeScale = mood === 'surprised' ? 1.2 : 1
  const mouthCurve = mood === 'happy' || mood === 'encouraging' ? 'smile' : mood === 'surprised' ? 'open' : 'normal'

  return (
    <Svg width={size} height={size} viewBox="0 0 120 120">
      <Defs>
        {/* Fur gradient */}
        <RadialGradient id="furGrad" cx="50%" cy="40%" r="55%">
          <Stop offset="0%" stopColor={COLORS.furLight} />
          <Stop offset="100%" stopColor={COLORS.fur} />
        </RadialGradient>
        {/* Ear shadow */}
        <LinearGradient id="earGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <Stop offset="0%" stopColor={COLORS.furLight} />
          <Stop offset="100%" stopColor={COLORS.furShadow} />
        </LinearGradient>
        {/* Eye shine */}
        <RadialGradient id="eyeShine" cx="35%" cy="30%" r="40%">
          <Stop offset="0%" stopColor="#444" />
          <Stop offset="100%" stopColor={COLORS.eyes} />
        </RadialGradient>
        {/* Accent badge gradient */}
        <LinearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <Stop offset="0%" stopColor={COLORS.accent} />
          <Stop offset="100%" stopColor={COLORS.accentLight} />
        </LinearGradient>
      </Defs>

      {/* ── Background circle ─────────────────────────────────────────── */}
      <Circle cx="60" cy="60" r="58" fill="url(#accentGrad)" opacity={0.12} />

      {/* ── Fluffy body / neck fur ────────────────────────────────────── */}
      <Ellipse cx="60" cy="100" rx="32" ry="22" fill="url(#furGrad)" />

      {/* ── Left ear ──────────────────────────────────────────────────── */}
      <Path
        d="M28 42 L20 14 L44 32 Z"
        fill="url(#earGrad)"
        stroke={COLORS.furShadow}
        strokeWidth={0.5}
      />
      <Path d="M29 38 L24 20 L40 33 Z" fill={COLORS.innerEar} opacity={0.5} />

      {/* ── Right ear ─────────────────────────────────────────────────── */}
      <Path
        d="M92 42 L100 14 L76 32 Z"
        fill="url(#earGrad)"
        stroke={COLORS.furShadow}
        strokeWidth={0.5}
      />
      <Path d="M91 38 L96 20 L80 33 Z" fill={COLORS.innerEar} opacity={0.5} />

      {/* ── Head shape (fluffy circle) ────────────────────────────────── */}
      <Circle cx="60" cy="56" r="34" fill="url(#furGrad)" />

      {/* ── Fluffy cheek tufts ────────────────────────────────────────── */}
      <Ellipse cx="32" cy="60" rx="10" ry="8" fill={COLORS.furLight} opacity={0.7} />
      <Ellipse cx="88" cy="60" rx="10" ry="8" fill={COLORS.furLight} opacity={0.7} />

      {/* ── Forehead tuft ─────────────────────────────────────────────── */}
      <Path
        d="M50 26 Q55 20 60 25 Q65 20 70 26"
        fill="none"
        stroke={COLORS.furShadow}
        strokeWidth={1}
        opacity={0.3}
      />

      {/* ── Eyes ──────────────────────────────────────────────────────── */}
      {blinkState ? (
        <>
          {/* Blink - closed eyes */}
          <Path d="M42 50 Q46 53 50 50" stroke={COLORS.eyes} strokeWidth={2} fill="none" strokeLinecap="round" />
          <Path d="M70 50 Q74 53 78 50" stroke={COLORS.eyes} strokeWidth={2} fill="none" strokeLinecap="round" />
        </>
      ) : (
        <>
          {/* Left eye */}
          <G transform={`translate(46, 50) scale(${eyeScale})`}>
            <Ellipse cx="0" cy="0" rx="5" ry={mood === 'happy' ? 4 : 5.5} fill="url(#eyeShine)" />
            <Circle cx="-1.5" cy="-1.5" r="1.8" fill={COLORS.eyeShine} opacity={0.9} />
            <Circle cx="1" cy="1" r="0.8" fill={COLORS.eyeShine} opacity={0.5} />
          </G>
          {/* Right eye */}
          <G transform={`translate(74, 50) scale(${eyeScale})`}>
            <Ellipse cx="0" cy="0" rx="5" ry={mood === 'happy' ? 4 : 5.5} fill="url(#eyeShine)" />
            <Circle cx="-1.5" cy="-1.5" r="1.8" fill={COLORS.eyeShine} opacity={0.9} />
            <Circle cx="1" cy="1" r="0.8" fill={COLORS.eyeShine} opacity={0.5} />
          </G>
        </>
      )}

      {/* ── Cheek blush ───────────────────────────────────────────────── */}
      {(mood === 'happy' || mood === 'encouraging') && (
        <>
          <Ellipse cx="37" cy="58" rx="6" ry="3" fill={COLORS.cheek} opacity={0.5} />
          <Ellipse cx="83" cy="58" rx="6" ry="3" fill={COLORS.cheek} opacity={0.5} />
        </>
      )}

      {/* ── Muzzle ────────────────────────────────────────────────────── */}
      <Ellipse cx="60" cy="62" rx="14" ry="10" fill={COLORS.furLight} />

      {/* ── Nose ──────────────────────────────────────────────────────── */}
      <Ellipse cx="60" cy="58" rx="4.5" ry="3.5" fill={COLORS.nose} />
      <Ellipse cx="59" cy="57" rx="1.5" ry="1" fill="white" opacity={0.3} />

      {/* ── Mouth ─────────────────────────────────────────────────────── */}
      {mouthCurve === 'smile' && (
        <>
          <Path
            d="M52 64 Q56 70 60 65 Q64 70 68 64"
            stroke={COLORS.nose}
            strokeWidth={1.5}
            fill="none"
            strokeLinecap="round"
          />
        </>
      )}
      {mouthCurve === 'open' && (
        <Ellipse cx="60" cy="67" rx="5" ry="4" fill={COLORS.nose} opacity={0.8} />
      )}
      {mouthCurve === 'normal' && (
        <Path
          d="M54 63 Q57 66 60 63 Q63 66 66 63"
          stroke={COLORS.nose}
          strokeWidth={1.2}
          fill="none"
          strokeLinecap="round"
        />
      )}

      {/* ── Tongue (happy/encouraging) ────────────────────────────────── */}
      {showTongue && (
        <G>
          <Path
            d="M57 66 Q57 76 60 78 Q63 76 63 66"
            fill={COLORS.tongue}
          />
          <Path
            d="M59 68 Q60 76 60 78"
            stroke={COLORS.tongueShade}
            strokeWidth={0.8}
            fill="none"
          />
        </G>
      )}

      {/* ── Thinking dots ─────────────────────────────────────────────── */}
      {mood === 'thinking' && (
        <G>
          <Circle cx="86" cy="32" r="3" fill={COLORS.accent} opacity={tailWag === 0 ? 1 : 0.4} />
          <Circle cx="94" cy="26" r="2.5" fill={COLORS.accent} opacity={tailWag === 0 ? 0.7 : 1} />
          <Circle cx="100" cy="20" r="2" fill={COLORS.accent} opacity={tailWag === 0 ? 0.4 : 0.7} />
        </G>
      )}

      {/* ── Small accent badge (collar) ───────────────────────────────── */}
      <Path
        d="M46 84 Q53 90 60 87 Q67 90 74 84"
        stroke="url(#accentGrad)"
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
      />
      <Circle cx="60" cy="87" r="3" fill="url(#accentGrad)" />
    </Svg>
  )
}
