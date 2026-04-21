'use client'

import { Trophy, TrendingUp, Flame, Star, EyeOff, Eye } from 'lucide-react'

interface LeaderboardEntry {
  rank: number
  displayName: string
  university: string
  weeklyXP: number
  streak: number
  badges: number
  isMe?: boolean
  anonymous?: boolean
}

const mockLeaderboard: LeaderboardEntry[] = [
  { rank: 1, displayName: 'Chiara R.',  university: 'Univ. Roma Foro', weeklyXP: 840, streak: 22, badges: 9,  isMe: false },
  { rank: 2, displayName: 'Luca M.',    university: 'Univ. Roma Foro', weeklyXP: 720, streak: 18, badges: 7,  isMe: false },
  { rank: 3, displayName: 'Marco S.',   university: 'Univ. Roma Foro', weeklyXP: 650, streak: 12, badges: 6,  isMe: true  },
  { rank: 4, displayName: 'Sofia P.',   university: 'Univ. Roma Foro', weeklyXP: 510, streak: 9,  badges: 5,  isMe: false },
  { rank: 5, displayName: '***',        university: 'Univ. Roma Foro', weeklyXP: 480, streak: 7,  badges: 4,  anonymous: true },
  { rank: 6, displayName: 'Elena T.',   university: 'Univ. Roma Foro', weeklyXP: 390, streak: 5,  badges: 3,  isMe: false },
]

const RANK_MEDALS: Record<number, string> = { 1: '🥇', 2: '🥈', 3: '🥉' }

// ── Leaderboard Card ──────────────────────────────────────────────────────────
export function LeaderboardCard({ entry }: { entry: LeaderboardEntry }) {
  const isTop3 = entry.rank <= 3

  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 12,
      padding: '12px 16px',
      borderRadius: 12,
      background: entry.isMe
        ? 'linear-gradient(135deg, var(--primary-soft), var(--surface))'
        : isTop3
          ? 'var(--warning-soft)'
          : 'var(--surface)',
      border: `1px solid ${entry.isMe ? 'var(--primary)' : 'var(--border)'}30`,
      transition: 'all 0.2s',
    }}>
      {/* Rank */}
      <div style={{
        width: 32, height: 32, borderRadius: 8,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: isTop3 ? 18 : 14,
        fontWeight: 800,
        color: isTop3 ? 'var(--warning)' : 'var(--muted)',
        flexShrink: 0,
      }}>
        {RANK_MEDALS[entry.rank] ?? `#${entry.rank}`}
      </div>

      {/* Avatar */}
      <div style={{
        width: 36, height: 36, borderRadius: '50%',
        background: entry.isMe
          ? 'var(--primary)'
          : `hsl(${entry.rank * 47}deg 60% 55%)`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        color: 'white', fontSize: 13, fontWeight: 700,
        flexShrink: 0,
      }}>
        {entry.anonymous ? '?' : entry.displayName.slice(0, 2).toUpperCase()}
      </div>

      {/* Info */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 13, fontWeight: 700, color: entry.isMe ? 'var(--primary)' : 'var(--color)' }}>
            {entry.anonymous ? 'Anonimo' : entry.displayName}
          </span>
          {entry.isMe && (
            <span style={{
              fontSize: 10, fontWeight: 700, padding: '1px 6px',
              borderRadius: 20, background: 'var(--primary)',
              color: 'white',
            }}>TU</span>
          )}
        </div>
        <div style={{ fontSize: 11, color: 'var(--muted)' }}>{entry.university}</div>
      </div>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 14, flexShrink: 0 }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: 'var(--primary)' }}>{entry.weeklyXP}</div>
          <div style={{ fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase' }}>XP</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#F43F5E' }}>{entry.streak}</div>
          <div style={{ fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase' }}>🔥</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 14, fontWeight: 800, color: '#F59E0B' }}>{entry.badges}</div>
          <div style={{ fontSize: 9, color: 'var(--muted)', textTransform: 'uppercase' }}>Badge</div>
        </div>
      </div>
    </div>
  )
}

// ── Ranking List ──────────────────────────────────────────────────────────────
interface RankingListProps {
  compact?: boolean
}

export function RankingList({ compact = false }: RankingListProps) {
  const myRank = mockLeaderboard.find(e => e.isMe)

  if (compact) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--color)' }}>Classifica</div>
          {myRank && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: 'var(--primary)' }}>
              <Trophy size={12} /> #{myRank.rank}
            </div>
          )}
        </div>
        {mockLeaderboard.slice(0, 3).map(e => <LeaderboardCard key={e.rank} entry={e} />)}
        {myRank && myRank.rank > 3 && <LeaderboardCard entry={myRank} />}
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {mockLeaderboard.map(e => <LeaderboardCard key={e.rank} entry={e} />)}
    </div>
  )
}
