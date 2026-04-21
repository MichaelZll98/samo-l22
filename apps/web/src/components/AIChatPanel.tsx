'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useAIChatStore, SAMO_QUICK_ACTIONS } from '@studio-l22/core/src/ai-chat'
import { ChatMessageBubble } from './ChatMessage'
import { VoiceRecorder } from './VoiceRecorder'
import { FileAttachment } from './FileAttachment'
import {
  X,
  Send,
  Paperclip,
  Mic,
  Plus,
  MessageSquare,
  Trash2,
  Brain,
  Layers3,
  FileText,
  MessageCircle,
  ChevronLeft,
} from 'lucide-react'

const quickActionIcons: Record<string, React.ElementType> = {
  Brain,
  Layers3,
  FileText,
  MessageCircle,
}

export function AIChatPanel() {
  const {
    messages,
    isLoading,
    mood,
    error,
    conversations,
    activeConversationId,
    toggleOpen,
    sendMessage,
    createConversation,
    setActiveConversation,
    loadConversations,
    clearError,
  } = useAIChatStore()

  const [input, setInput] = useState('')
  const [showHistory, setShowHistory] = useState(false)
  const [showVoice, setShowVoice] = useState(false)
  const [attachedFile, setAttachedFile] = useState<{ url: string; name: string; mime: string } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadConversations()
  }, [loadConversations])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!isLoading) inputRef.current?.focus()
  }, [isLoading])

  const handleSend = useCallback(async () => {
    const text = input.trim()
    if (!text && !attachedFile) return

    setInput('')
    await sendMessage(
      text || `[File: ${attachedFile?.name}]`,
      attachedFile ? 'file' : 'text',
      attachedFile?.url,
      attachedFile?.name,
      attachedFile?.mime
    )
    setAttachedFile(null)
  }, [input, attachedFile, sendMessage])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleQuickAction = (prompt: string) => {
    sendMessage(prompt)
  }

  const handleVoiceResult = (transcript: string) => {
    setShowVoice(false)
    if (transcript) {
      sendMessage(transcript, 'voice')
    }
  }

  const handleFileDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }, [])

  const handleFileSelect = (file: File) => {
    const url = URL.createObjectURL(file)
    setAttachedFile({ url, name: file.name, mime: file.type })
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
    e.target.value = ''
  }

  return (
    <div className="samo-panel">
      {/* Header */}
      <div className="samo-panel-header">
        <div className="samo-panel-header-left">
          {showHistory && (
            <button className="samo-icon-btn" onClick={() => setShowHistory(false)}>
              <ChevronLeft size={18} />
            </button>
          )}
          <div className="samo-header-avatar">
            <SamoHeaderIcon mood={mood} />
          </div>
          <div className="samo-header-info">
            <div className="samo-header-name">Samo</div>
            <div className="samo-header-status">
              {isLoading ? 'Sta pensando...' : 'Il tuo compagno di studio'}
            </div>
          </div>
        </div>
        <div className="samo-panel-header-right">
          <button
            className="samo-icon-btn"
            onClick={() => setShowHistory(!showHistory)}
            title="Conversazioni"
          >
            <MessageSquare size={16} />
          </button>
          <button
            className="samo-icon-btn"
            onClick={() => createConversation()}
            title="Nuova conversazione"
          >
            <Plus size={16} />
          </button>
          <button className="samo-icon-btn" onClick={toggleOpen} title="Chiudi">
            <X size={16} />
          </button>
        </div>
      </div>

      {showHistory ? (
        /* ── Conversation History ─────────────────────────────────────── */
        <div className="samo-history">
          <div className="samo-history-title">Conversazioni</div>
          {conversations.length === 0 ? (
            <div className="samo-history-empty">
              Nessuna conversazione ancora. Inizia a chattare!
            </div>
          ) : (
            conversations.map((conv) => (
              <button
                key={conv.id}
                className={`samo-history-item ${conv.id === activeConversationId ? 'active' : ''}`}
                onClick={() => {
                  setActiveConversation(conv.id)
                  setShowHistory(false)
                }}
              >
                <MessageSquare size={14} />
                <div className="samo-history-item-info">
                  <div className="samo-history-item-title">{conv.title}</div>
                  <div className="samo-history-item-date">
                    {new Date(conv.updated_at).toLocaleDateString('it-IT', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      ) : (
        <>
          {/* ── Messages Area ─────────────────────────────────────────── */}
          <div
            className={`samo-messages ${isDragging ? 'samo-dragging' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
          >
            {messages.length === 0 ? (
              <div className="samo-welcome">
                <div className="samo-welcome-avatar">
                  <SamoWelcomeIcon />
                </div>
                <div className="samo-welcome-title">Ciao! Sono Samo</div>
                <div className="samo-welcome-text">
                  Il tuo compagno di studio! Posso aiutarti con le materie di
                  Scienze Motorie, creare quiz, flashcard e molto altro.
                </div>
                <div className="samo-quick-actions">
                  {SAMO_QUICK_ACTIONS.map((action) => {
                    const Icon = quickActionIcons[action.icon] || MessageCircle
                    return (
                      <button
                        key={action.id}
                        className="samo-quick-action"
                        onClick={() => handleQuickAction(action.prompt)}
                      >
                        <Icon size={14} />
                        <span>{action.label}</span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ) : (
              messages.map((msg) => (
                <ChatMessageBubble key={msg.id} message={msg} />
              ))
            )}

            {isLoading && (
              <div className="samo-typing">
                <div className="samo-typing-avatar">
                  <SamoHeaderIcon mood="thinking" />
                </div>
                <div className="samo-typing-dots">
                  <span /><span /><span />
                </div>
              </div>
            )}

            {error && (
              <div className="samo-error">
                <span>{error}</span>
                <button onClick={clearError}>
                  <X size={12} />
                </button>
              </div>
            )}

            {isDragging && (
              <div className="samo-drop-overlay">
                <Paperclip size={32} />
                <span>Rilascia il file qui</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ── Voice Recorder Overlay ────────────────────────────────── */}
          {showVoice && (
            <VoiceRecorder
              onResult={handleVoiceResult}
              onCancel={() => setShowVoice(false)}
            />
          )}

          {/* ── File Preview ──────────────────────────────────────────── */}
          {attachedFile && (
            <FileAttachment
              fileName={attachedFile.name}
              fileUrl={attachedFile.url}
              fileMime={attachedFile.mime}
              onRemove={() => setAttachedFile(null)}
            />
          )}

          {/* ── Input Area ────────────────────────────────────────────── */}
          <div className="samo-input-area">
            <div className="samo-input-row">
              <button
                className="samo-input-btn"
                onClick={() => fileInputRef.current?.click()}
                title="Allega file"
              >
                <Paperclip size={18} />
              </button>
              <textarea
                ref={inputRef}
                className="samo-input"
                placeholder="Chatta con Samo..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                rows={1}
                disabled={isLoading}
              />
              <button
                className="samo-input-btn"
                onClick={() => setShowVoice(true)}
                title="Messaggio vocale"
              >
                <Mic size={18} />
              </button>
              <button
                className={`samo-send-btn ${(input.trim() || attachedFile) ? 'active' : ''}`}
                onClick={handleSend}
                disabled={isLoading || (!input.trim() && !attachedFile)}
                title="Invia"
              >
                <Send size={16} />
              </button>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*,application/pdf"
              onChange={handleFileInput}
              style={{ display: 'none' }}
            />
          </div>
        </>
      )}
    </div>
  )
}

function SamoHeaderIcon({ mood }: { mood: string }) {
  return (
    <svg width="32" height="32" viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="56" r="34" fill="#F5F0EB" />
      <path d="M28 42 L20 14 L44 32 Z" fill="#F5F0EB" />
      <path d="M92 42 L100 14 L76 32 Z" fill="#F5F0EB" />
      <ellipse cx="46" cy="50" rx="4" ry="4.5" fill="#1A1A1A" />
      <circle cx="44.8" cy="48.8" r="1.5" fill="white" opacity={0.9} />
      <ellipse cx="74" cy="50" rx="4" ry="4.5" fill="#1A1A1A" />
      <circle cx="72.8" cy="48.8" r="1.5" fill="white" opacity={0.9} />
      <ellipse cx="60" cy="62" rx="12" ry="9" fill="#FEFCFA" />
      <ellipse cx="60" cy="58" rx="3.5" ry="2.8" fill="#1A1A1A" />
      <path d="M54 63 Q57 66 60 63 Q63 66 66 63" stroke="#1A1A1A" strokeWidth={1.2} fill="none" strokeLinecap="round" />
      {mood === 'thinking' && (
        <>
          <circle cx="90" cy="30" r="3" fill="#5C8BFF" className="samo-dot samo-dot-1" />
          <circle cx="97" cy="24" r="2.5" fill="#5C8BFF" className="samo-dot samo-dot-2" />
          <circle cx="103" cy="18" r="2" fill="#5C8BFF" className="samo-dot samo-dot-3" />
        </>
      )}
    </svg>
  )
}

function SamoWelcomeIcon() {
  return (
    <svg width="80" height="80" viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="60" r="58" fill="#5C8BFF" fillOpacity={0.08} />
      <ellipse cx="60" cy="100" rx="30" ry="20" fill="#F5F0EB" />
      <path d="M28 42 L20 14 L44 32 Z" fill="#F5F0EB" stroke="#E8E0D8" strokeWidth={0.5} />
      <path d="M29 38 L24 20 L40 33 Z" fill="#FFD6DC" opacity={0.5} />
      <path d="M92 42 L100 14 L76 32 Z" fill="#F5F0EB" stroke="#E8E0D8" strokeWidth={0.5} />
      <path d="M91 38 L96 20 L80 33 Z" fill="#FFD6DC" opacity={0.5} />
      <circle cx="60" cy="56" r="34" fill="#F5F0EB" />
      <ellipse cx="32" cy="60" rx="10" ry="8" fill="#FEFCFA" opacity={0.7} />
      <ellipse cx="88" cy="60" rx="10" ry="8" fill="#FEFCFA" opacity={0.7} />
      <ellipse cx="46" cy="50" rx="5" ry="5.5" fill="#1A1A1A" />
      <circle cx="44.5" cy="48.5" r="1.8" fill="white" opacity={0.9} />
      <ellipse cx="74" cy="50" rx="5" ry="5.5" fill="#1A1A1A" />
      <circle cx="72.5" cy="48.5" r="1.8" fill="white" opacity={0.9} />
      <ellipse cx="37" cy="58" rx="6" ry="3" fill="#FFE0E6" opacity={0.5} />
      <ellipse cx="83" cy="58" rx="6" ry="3" fill="#FFE0E6" opacity={0.5} />
      <ellipse cx="60" cy="62" rx="14" ry="10" fill="#FEFCFA" />
      <ellipse cx="60" cy="58" rx="4.5" ry="3.5" fill="#1A1A1A" />
      <ellipse cx="59" cy="57" rx="1.5" ry="1" fill="white" opacity={0.3} />
      <path d="M52 64 Q56 70 60 65 Q64 70 68 64" stroke="#1A1A1A" strokeWidth={1.5} fill="none" strokeLinecap="round" />
      <path d="M57 66 Q57 76 60 78 Q63 76 63 66" fill="#FF8FA3" />
      <path d="M46 84 Q53 90 60 87 Q67 90 74 84" stroke="#5C8BFF" strokeWidth={2.5} fill="none" strokeLinecap="round" />
      <circle cx="60" cy="87" r="3" fill="#5C8BFF" />
    </svg>
  )
}
