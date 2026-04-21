'use client'

import { useState, useMemo } from 'react'
import { FeedCard, FeedItem } from './FeedCard'
import { FeedFilter } from './FeedFilter'

const SAMPLE_FEED: FeedItem[] = [
  {
    id: 'sn1',
    type: 'note',
    title: 'Sistema nervoso autonomo — Riassunto completo',
    excerpt: 'Simpatico e parasimpatico: differenze funzionali, neurotrasmettitori, vie efferenti. Schema completo con diagrammi.',
    subject: 'Anatomia',
    subjectColor: '#FF6B6B',
    author: 'Laura M.',
    authorAvatar: 'LM',
    authorAvatarColor: '#4ECDC4',
    authorLevel: 8,
    time: '2 ore fa',
    tags: ['neuro', 'anatomia', 'ripasso'],
    likes: 47,
    saves: 23,
    comments: 8,
    views: 312,
    rating: 4.7,
    ratingCount: 19,
  },
  {
    id: 'sm1',
    type: 'material',
    title: 'Slide Biomeccanica — Cap. 5: Cinematica articolare',
    excerpt: 'Slide originali del Prof. Martini con annotazioni personali. Coprono tutta la cinematica del ginocchio.',
    subject: 'Biomeccanica',
    subjectColor: '#45B7D1',
    author: 'Giovanni R.',
    authorAvatar: 'GR',
    authorAvatarColor: '#96CEB4',
    authorLevel: 5,
    time: '5 ore fa',
    tags: ['slide', 'cinematica', 'ginocchio'],
    likes: 31,
    saves: 44,
    comments: 15,
    downloads: 67,
    fileType: 'pptx',
  },
  {
    id: 'sn2',
    type: 'note',
    title: 'Metabolismo energetico durante esercizio aerobico',
    excerpt: 'Via glicolitica, ciclo di Krebs e catena respiratoria: tutto quello che serve per l\'esame di Fisiologia.',
    subject: 'Fisiologia',
    subjectColor: '#96CEB4',
    author: 'Sofia B.',
    authorAvatar: 'SB',
    authorAvatarColor: '#F1948A',
    authorLevel: 11,
    time: '1 giorno fa',
    tags: ['metabolismo', 'fisiologia', 'aerobico'],
    likes: 89,
    saves: 56,
    comments: 32,
    views: 540,
    rating: 4.9,
    ratingCount: 41,
  },
  {
    id: 'sm2',
    type: 'material',
    title: 'Schema muscoli arto inferiore — PDF annotato',
    excerpt: 'Schema dettagliato con origine, inserzione, innervazione e funzione di ogni muscolo.',
    subject: 'Anatomia',
    subjectColor: '#FF6B6B',
    author: 'Marco T.',
    authorAvatar: 'MT',
    authorAvatarColor: '#A78BFA',
    authorLevel: 7,
    time: '2 giorni fa',
    tags: ['muscoli', 'arto-inferiore', 'schema'],
    likes: 64,
    saves: 91,
    comments: 12,
    downloads: 143,
    fileType: 'pdf',
  },
  {
    id: 'sn3',
    type: 'note',
    title: 'Psicologia dello sport — Motivazione e goal setting',
    excerpt: 'Teorie motivazionali di Deci & Ryan, goal setting SMART, flow state. Esempi pratici per l\'esame.',
    subject: 'Psicologia dello Sport',
    subjectColor: '#F1948A',
    author: 'Alessia V.',
    authorAvatar: 'AV',
    authorAvatarColor: '#FBD786',
    authorLevel: 6,
    time: '3 giorni fa',
    tags: ['psicologia', 'motivazione', 'sport'],
    likes: 38,
    saves: 27,
    comments: 9,
    views: 198,
    rating: 4.3,
    ratingCount: 14,
  },
]

export function FeedList() {
  const [filter, setFilter] = useState('all')
  const [subject, setSubject] = useState('Tutte le materie')

  const items = useMemo(() => {
    let list = [...SAMPLE_FEED]
    if (filter === 'note') list = list.filter((i) => i.type === 'note')
    if (filter === 'material') list = list.filter((i) => i.type === 'material')
    if (filter === 'popular') list = list.sort((a, b) => b.likes - a.likes)
    if (filter === 'recent') list = list.sort((_, __) => 0) // already recent
    if (subject !== 'Tutte le materie') list = list.filter((i) => i.subject === subject)
    return list
  }, [filter, subject])

  return (
    <div>
      <FeedFilter onFilterChange={setFilter} onSubjectChange={setSubject} />
      {items.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--muted)' }}>
          Nessun contenuto trovato con questi filtri.
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {items.map((item) => (
            <FeedCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  )
}
