'use client'

import { useState } from 'react'
import { MessageCircle, Send } from 'lucide-react'
import { LikeButton } from './LikeButton'

interface Comment {
  id: string
  author: string
  avatar: string
  avatarColor: string
  text: string
  time: string
  likes: number
}

const SAMPLE_COMMENTS: Comment[] = [
  { id: 'c1', author: 'Laura M.', avatar: 'LM', avatarColor: '#4ECDC4', text: 'Ottimi appunti! La sezione sulla sinapsi è particolarmente chiara.', time: '2 ore fa', likes: 4 },
  { id: 'c2', author: 'Giovanni R.', avatar: 'GR', avatarColor: '#96CEB4', text: 'Grazie per aver condiviso! Hai anche materiale sulla mielinizzazione?', time: '5 ore fa', likes: 1 },
]

interface Props {
  contentType: string
  contentId: string
  initialCount?: number
}

export function CommentSection({ contentType, contentId, initialCount = 0 }: Props) {
  const [expanded, setExpanded] = useState(false)
  const [comments, setComments] = useState<Comment[]>(SAMPLE_COMMENTS)
  const [newText, setNewText] = useState('')

  const addComment = () => {
    if (!newText.trim()) return
    const c: Comment = {
      id: Date.now().toString(),
      author: 'Tu',
      avatar: 'TU',
      avatarColor: '#0055FF',
      text: newText.trim(),
      time: 'Adesso',
      likes: 0,
    }
    setComments((prev) => [...prev, c])
    setNewText('')
  }

  return (
    <div>
      <button
        className="like-btn"
        onClick={(e) => { e.stopPropagation(); e.preventDefault(); setExpanded((v) => !v) }}
        style={{ color: expanded ? 'var(--primary)' : undefined }}
      >
        <MessageCircle size={15} />
        <span>{comments.length || initialCount}</span>
      </button>

      {expanded && (
        <div style={{ marginTop: 16, borderTop: '1px solid var(--border)', paddingTop: 16 }} onClick={(e) => { e.stopPropagation(); e.preventDefault() }}>
          {comments.map((c) => (
            <div key={c.id} className="comment-item">
              <div className="author-avatar" style={{ background: c.avatarColor, width: 30, height: 30, fontSize: 10 }}>
                {c.avatar}
              </div>
              <div className="comment-bubble" style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{c.author}</span>
                  <span style={{ fontSize: 11, color: 'var(--muted)' }}>{c.time}</span>
                </div>
                <div style={{ fontSize: 14, color: 'var(--color)', lineHeight: 1.5 }}>{c.text}</div>
                <div style={{ marginTop: 6 }}>
                  <LikeButton count={c.likes} />
                </div>
              </div>
            </div>
          ))}

          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <input
              className="form-input"
              placeholder="Scrivi un commento..."
              value={newText}
              onChange={(e) => setNewText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && addComment()}
              style={{ fontSize: 14, padding: '9px 14px' }}
            />
            <button className="btn btn-primary" style={{ padding: '9px 14px', flexShrink: 0 }} onClick={addComment} disabled={!newText.trim()}>
              <Send size={15} />
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
