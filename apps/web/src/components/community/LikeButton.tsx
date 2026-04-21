'use client'

import { Heart } from 'lucide-react'
import { useState } from 'react'

interface Props {
  count: number
  liked?: boolean
}

export function LikeButton({ count, liked: initialLiked = false }: Props) {
  const [liked, setLiked] = useState(initialLiked)
  const [n, setN] = useState(count)

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setLiked((v) => {
      setN((c) => (v ? c - 1 : c + 1))
      return !v
    })
  }

  return (
    <button className={`like-btn ${liked ? 'liked' : ''}`} onClick={toggle} aria-label="Mi piace">
      <Heart size={15} fill={liked ? 'currentColor' : 'none'} />
      <span>{n}</span>
    </button>
  )
}
