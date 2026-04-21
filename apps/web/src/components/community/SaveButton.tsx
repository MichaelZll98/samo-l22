'use client'

import { Bookmark } from 'lucide-react'
import { useState } from 'react'

interface Props {
  count: number
  saved?: boolean
}

export function SaveButton({ count, saved: initialSaved = false }: Props) {
  const [saved, setSaved] = useState(initialSaved)
  const [n, setN] = useState(count)

  const toggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    setSaved((v) => {
      setN((c) => (v ? c - 1 : c + 1))
      return !v
    })
  }

  return (
    <button className={`save-btn ${saved ? 'saved' : ''}`} onClick={toggle} aria-label="Salva">
      <Bookmark size={15} fill={saved ? 'currentColor' : 'none'} />
      <span>{n}</span>
    </button>
  )
}
