'use client'

import { useState, useRef, useEffect } from 'react'
import { Mic, Square, X } from 'lucide-react'

interface VoiceRecorderProps {
  onResult: (transcript: string) => void
  onCancel: () => void
}

export function VoiceRecorder({ onResult, onCancel }: VoiceRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [duration, setDuration] = useState(0)
  const [error, setError] = useState<string | null>(null)
  const recognitionRef = useRef<any>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const transcriptRef = useRef('')

  useEffect(() => {
    return () => {
      stopRecording()
    }
  }, [])

  const startRecording = async () => {
    try {
      // Check for Web Speech API support
      const SpeechRecognition =
        (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition

      if (!SpeechRecognition) {
        setError('Il tuo browser non supporta il riconoscimento vocale')
        return
      }

      const recognition = new SpeechRecognition()
      recognition.lang = 'it-IT'
      recognition.continuous = true
      recognition.interimResults = true

      recognition.onresult = (event: any) => {
        let transcript = ''
        for (let i = 0; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript
        }
        transcriptRef.current = transcript
      }

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error)
        setError('Errore nel riconoscimento vocale')
        stopRecording()
      }

      recognition.onend = () => {
        if (isRecording) {
          // Auto-restart if still recording
          try { recognition.start() } catch {}
        }
      }

      recognition.start()
      recognitionRef.current = recognition
      setIsRecording(true)
      setDuration(0)

      timerRef.current = setInterval(() => {
        setDuration((d) => d + 1)
      }, 1000)
    } catch (err) {
      setError('Impossibile accedere al microfono')
    }
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
      recognitionRef.current = null
    }
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    setIsRecording(false)
  }

  const handleStop = () => {
    stopRecording()
    onResult(transcriptRef.current)
  }

  const handleCancel = () => {
    stopRecording()
    onCancel()
  }

  const formatDuration = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, '0')}:${(s % 60).toString().padStart(2, '0')}`

  return (
    <div className="samo-voice-overlay">
      {error ? (
        <div className="samo-voice-error">
          <span>{error}</span>
          <button onClick={handleCancel} className="samo-icon-btn">
            <X size={16} />
          </button>
        </div>
      ) : isRecording ? (
        <div className="samo-voice-recording">
          <div className="samo-voice-indicator">
            <div className="samo-voice-pulse" />
            <Mic size={20} className="samo-voice-mic" />
          </div>
          <div className="samo-voice-info">
            <span className="samo-voice-label">Registrazione in corso...</span>
            <span className="samo-voice-duration">{formatDuration(duration)}</span>
          </div>
          <div className="samo-voice-actions">
            <button className="samo-voice-cancel" onClick={handleCancel}>
              <X size={16} />
            </button>
            <button className="samo-voice-stop" onClick={handleStop}>
              <Square size={14} />
              <span>Invia</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="samo-voice-start">
          <button className="samo-voice-start-btn" onClick={startRecording}>
            <Mic size={24} />
            <span>Tocca per registrare</span>
          </button>
          <button className="samo-icon-btn" onClick={handleCancel}>
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
