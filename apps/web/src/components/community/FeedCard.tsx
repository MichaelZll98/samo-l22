import Link from 'next/link'
import { FileText, FolderOpen, Eye } from 'lucide-react'
import { LikeButton } from './LikeButton'
import { SaveButton } from './SaveButton'
import { StarRating } from './StarRating'
import { CommentSection } from './CommentSection'
import { ReportButton } from './ReportButton'

export interface FeedItem {
  id: string
  type: 'note' | 'material'
  title: string
  excerpt?: string
  subject: string
  subjectColor: string
  author: string
  authorAvatar: string
  authorAvatarColor: string
  authorLevel: number
  time: string
  tags: string[]
  likes: number
  saves: number
  comments: number
  views?: number
  rating?: number
  ratingCount?: number
  fileType?: string
  downloads?: number
}

export function FeedCard({ item }: { item: FeedItem }) {
  const href = item.type === 'note'
    ? `/community/note/${item.id}`
    : `/community/materiali`

  return (
    <Link href={href} style={{ textDecoration: 'none', display: 'block' }}>
      <div className="feed-card">
        {/* Header: author + subject */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
          <div
            className="author-avatar"
            style={{ background: item.authorAvatarColor }}
          >
            {item.authorAvatar}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--color)' }}>{item.author}</span>
              <span className="author-level-badge">Lv {item.authorLevel}</span>
            </div>
            <div style={{ fontSize: 11, color: 'var(--muted)' }}>{item.time}</div>
          </div>

          {/* Content type chip */}
          <div className="content-tag" style={{
            background: item.type === 'note' ? 'var(--info-soft)' : 'var(--success-soft)',
            color: item.type === 'note' ? 'var(--info)' : 'var(--success)',
          }}>
            {item.type === 'note' ? <FileText size={11} /> : <FolderOpen size={11} />}
            {item.type === 'note' ? 'Appunti' : 'Materiale'}
          </div>
        </div>

        {/* Subject */}
        <div style={{ marginBottom: 8 }}>
          <span className="badge badge-primary" style={{ background: `${item.subjectColor}20`, color: item.subjectColor }}>
            {item.subject}
          </span>
        </div>

        {/* Title + excerpt */}
        <div style={{ fontWeight: 700, fontSize: 15, color: 'var(--color)', marginBottom: 4, lineHeight: 1.3 }}>
          {item.title}
        </div>
        {item.excerpt && (
          <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6, marginBottom: 10, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
            {item.excerpt}
          </div>
        )}

        {/* Tags */}
        {item.tags.length > 0 && (
          <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
            {item.tags.slice(0, 4).map((tag) => (
              <span key={tag} style={{ fontSize: 11, color: 'var(--muted)', background: 'var(--surface)', borderRadius: 6, padding: '2px 8px', border: '1px solid var(--border)' }}>
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Rating + views row */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 4 }}>
          {item.rating !== undefined && (
            <StarRating rating={item.rating} count={item.ratingCount} size={13} />
          )}
          {item.type === 'material' && item.fileType && (
            <span className="badge badge-info">{item.fileType.toUpperCase()}</span>
          )}
          {item.views !== undefined && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--muted)', marginLeft: 'auto' }}>
              <Eye size={12} />{item.views}
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="feed-actions">
          <LikeButton count={item.likes} />
          <SaveButton count={item.saves} />
          <CommentSection contentType={item.type} contentId={item.id} initialCount={item.comments} />
          <ReportButton contentType={item.type} contentId={item.id} />
        </div>
      </div>
    </Link>
  )
}
