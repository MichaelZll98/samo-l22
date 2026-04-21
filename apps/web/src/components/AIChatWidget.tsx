'use client'

import { useAIChatStore } from '@studio-l22/core/src/ai-chat'
import { AIChatPanel } from './AIChatPanel'

export function AIChatWidget() {
  const { isOpen, toggleOpen, mood } = useAIChatStore()

  return (
    <>
      {/* FAB Button */}
      {!isOpen && (
        <button
          className="samo-fab"
          onClick={toggleOpen}
          aria-label="Apri chat con Samo"
          title="Chatta con Samo"
        >
          <SamoFABIcon mood={mood} />
          <span className="samo-fab-pulse" />
        </button>
      )}

      {/* Chat Panel */}
      {isOpen && <AIChatPanel />}
    </>
  )
}

function SamoFABIcon({ mood }: { mood: string }) {
  return (
    <svg width="36" height="36" viewBox="0 0 120 120" fill="none">
      {/* Background */}
      <circle cx="60" cy="60" r="58" fill="white" fillOpacity={0.15} />

      {/* Body fur */}
      <ellipse cx="60" cy="100" rx="30" ry="20" fill="#F5F0EB" />

      {/* Left ear */}
      <path d="M28 42 L20 14 L44 32 Z" fill="#F5F0EB" stroke="#E8E0D8" strokeWidth={0.5} />
      <path d="M29 38 L24 20 L40 33 Z" fill="#FFD6DC" opacity={0.5} />

      {/* Right ear */}
      <path d="M92 42 L100 14 L76 32 Z" fill="#F5F0EB" stroke="#E8E0D8" strokeWidth={0.5} />
      <path d="M91 38 L96 20 L80 33 Z" fill="#FFD6DC" opacity={0.5} />

      {/* Head */}
      <circle cx="60" cy="56" r="34" fill="#F5F0EB" />

      {/* Cheek tufts */}
      <ellipse cx="32" cy="60" rx="10" ry="8" fill="#FEFCFA" opacity={0.7} />
      <ellipse cx="88" cy="60" rx="10" ry="8" fill="#FEFCFA" opacity={0.7} />

      {/* Eyes */}
      <ellipse cx="46" cy="50" rx="5" ry="5.5" fill="#1A1A1A" />
      <circle cx="44.5" cy="48.5" r="1.8" fill="white" opacity={0.9} />
      <ellipse cx="74" cy="50" rx="5" ry="5.5" fill="#1A1A1A" />
      <circle cx="72.5" cy="48.5" r="1.8" fill="white" opacity={0.9} />

      {/* Muzzle */}
      <ellipse cx="60" cy="62" rx="14" ry="10" fill="#FEFCFA" />

      {/* Nose */}
      <ellipse cx="60" cy="58" rx="4.5" ry="3.5" fill="#1A1A1A" />
      <ellipse cx="59" cy="57" rx="1.5" ry="1" fill="white" opacity={0.3} />

      {/* Mouth smile */}
      <path
        d="M52 64 Q56 70 60 65 Q64 70 68 64"
        stroke="#1A1A1A"
        strokeWidth={1.5}
        fill="none"
        strokeLinecap="round"
      />

      {/* Tongue */}
      <path d="M57 66 Q57 76 60 78 Q63 76 63 66" fill="#FF8FA3" />

      {/* Collar accent */}
      <path
        d="M46 84 Q53 90 60 87 Q67 90 74 84"
        stroke="#5C8BFF"
        strokeWidth={2.5}
        fill="none"
        strokeLinecap="round"
      />
      <circle cx="60" cy="87" r="3" fill="#5C8BFF" />

      {/* Thinking dots */}
      {mood === 'thinking' && (
        <>
          <circle cx="86" cy="32" r="3" fill="#5C8BFF" className="samo-dot samo-dot-1" />
          <circle cx="94" cy="26" r="2.5" fill="#5C8BFF" className="samo-dot samo-dot-2" />
          <circle cx="100" cy="20" r="2" fill="#5C8BFF" className="samo-dot samo-dot-3" />
        </>
      )}
    </svg>
  )
}
