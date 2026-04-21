'use client'

import type { ChatMessage } from '@studio-l22/types'
import { FileText, Image as ImageIcon } from 'lucide-react'

interface ChatMessageBubbleProps {
  message: ChatMessage
}

export function ChatMessageBubble({ message }: ChatMessageBubbleProps) {
  const isUser = message.role === 'user'

  return (
    <div className={`samo-message ${isUser ? 'samo-message-user' : 'samo-message-ai'}`}>
      {!isUser && (
        <div className="samo-message-avatar">
          <SamoMiniIcon />
        </div>
      )}
      <div className={`samo-message-bubble ${isUser ? 'user' : 'ai'}`}>
        {/* File attachment preview */}
        {message.file_url && (
          <div className="samo-message-file">
            {message.file_mime?.startsWith('image/') ? (
              <img
                src={message.file_url}
                alt={message.file_name || 'Immagine'}
                className="samo-message-image"
              />
            ) : (
              <div className="samo-message-file-info">
                <FileText size={16} />
                <span>{message.file_name || 'File'}</span>
              </div>
            )}
          </div>
        )}

        {/* Voice indicator */}
        {message.message_type === 'voice' && (
          <div className="samo-message-voice-badge">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z" />
              <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
              <line x1="12" x2="12" y1="19" y2="22" />
            </svg>
            <span>Messaggio vocale</span>
          </div>
        )}

        {/* Message content with basic markdown */}
        <div
          className="samo-message-content"
          dangerouslySetInnerHTML={{ __html: renderMarkdown(message.content) }}
        />

        {/* Timestamp */}
        <div className="samo-message-time">
          {new Date(message.created_at).toLocaleTimeString('it-IT', {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </div>
      </div>
    </div>
  )
}

function SamoMiniIcon() {
  return (
    <svg width="28" height="28" viewBox="0 0 120 120" fill="none">
      <circle cx="60" cy="56" r="34" fill="#F5F0EB" />
      <path d="M28 42 L22 18 L42 34 Z" fill="#F5F0EB" />
      <path d="M92 42 L98 18 L78 34 Z" fill="#F5F0EB" />
      <ellipse cx="46" cy="50" rx="4" ry="4.5" fill="#1A1A1A" />
      <circle cx="44.8" cy="48.8" r="1.3" fill="white" opacity={0.9} />
      <ellipse cx="74" cy="50" rx="4" ry="4.5" fill="#1A1A1A" />
      <circle cx="72.8" cy="48.8" r="1.3" fill="white" opacity={0.9} />
      <ellipse cx="60" cy="62" rx="12" ry="9" fill="#FEFCFA" />
      <ellipse cx="60" cy="58" rx="3.5" ry="2.8" fill="#1A1A1A" />
      <path d="M54 63 Q57 66 60 63 Q63 66 66 63" stroke="#1A1A1A" strokeWidth={1.2} fill="none" strokeLinecap="round" />
    </svg>
  )
}

// Simple markdown renderer
function renderMarkdown(text: string): string {
  return text
    // Code blocks
    .replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    // Inline code
    .replace(/`([^`]+)`/g, '<code class="samo-inline-code">$1</code>')
    // Bold
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // Unordered lists
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>')
    // Ordered lists
    .replace(/^\d+\. (.+)$/gm, '<li>$1</li>')
    // Headers
    .replace(/^### (.+)$/gm, '<h4>$1</h4>')
    .replace(/^## (.+)$/gm, '<h3>$1</h3>')
    .replace(/^# (.+)$/gm, '<h2>$1</h2>')
    // Line breaks
    .replace(/\n/g, '<br/>')
}
