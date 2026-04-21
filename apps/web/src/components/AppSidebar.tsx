'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  BookOpen,
  Calendar,
  Users,
  User,
  Award,
  Moon,
  Sun,
  NotebookPen,
  Brain,
  Layers3,
  Timer,
  FolderOpen,
  BarChart2,
  Trophy,
  Sparkles,
  Search,
  Wand2,
} from 'lucide-react'
import { useState, useEffect } from 'react'
import { NotificationBell } from './community/NotificationBell'
import { useAuth } from '@/lib/auth'

const navItems = [
  { key: '/', label: 'Home', icon: Home },
  { key: '/materie', label: 'Materie', icon: BookOpen },
  { key: '/note', label: 'Note', icon: NotebookPen },
  { key: '/quiz', label: 'Quiz', icon: Brain },
  { key: '/flashcard', label: 'Flashcard', icon: Layers3 },
  { key: '/pomodoro', label: 'Pomodoro', icon: Timer },
  { key: '/materiali', label: 'Materiali', icon: FolderOpen },
  { key: '/ai-generate', label: 'AI Studio', icon: Wand2 },
  { key: '/cfu', label: 'CFU', icon: Award },
  { key: '/calendario', label: 'Calendario', icon: Calendar },
  { key: '/analytics', label: 'Analytics', icon: BarChart2 },
  { key: '/badge', label: 'Badge', icon: Trophy },
  { key: '/planner', label: 'Planner', icon: Sparkles },
  { key: '/community', label: 'Community', icon: Users },
  { key: '/cerca', label: 'Cerca', icon: Search },
  { key: '/account', label: 'Account', icon: User },
]

export function AppSidebar() {
  const pathname = usePathname()
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const { user } = useAuth()

  const initials =
    user?.user_metadata?.first_name && user?.user_metadata?.last_name
      ? user.user_metadata.first_name[0] + user.user_metadata.last_name[0]
      : user?.email?.[0]?.toUpperCase() ?? '?'

  const displayName =
    [user?.user_metadata?.first_name, user?.user_metadata?.last_name]
      .filter(Boolean)
      .join(' ') ||
    user?.email?.split('@')[0] ||
    'Utente'

  const email = user?.email ?? ''

  useEffect(() => {
    const stored = localStorage.getItem('theme') as 'light' | 'dark' | null
    if (stored) setTheme(stored)
    else if (window.matchMedia('(prefers-color-scheme: dark)').matches) setTheme('dark')
  }, [])

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    localStorage.setItem('theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }

  return (
    <aside className="sidebar">
      {/* Logo */}
      <div className="sidebar-logo">
        <div className="logo-icon">L</div>
        <div>
          <div className="logo-name">Samo L-22</div>
          <div className="logo-sub">Laurea magistrale</div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navItems.map(({ key, label, icon: Icon }) => {
          const isActive = key === '/' ? pathname === '/' : pathname.startsWith(key)
          return (
            <Link key={key} href={key} className={`nav-item ${isActive ? 'active' : ''}`}>
              <Icon size={18} />
              <span>{label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Bottom */}
      <div className="sidebar-bottom">
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '4px 12px' }}>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Toggle theme" style={{ padding: '6px 0', flex: 1 }}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            <span>{theme === 'dark' ? 'Tema chiaro' : 'Tema scuro'}</span>
          </button>
          <NotificationBell />
        </div>
        <div className="sidebar-user">
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <div className="user-name">{displayName}</div>
            <div className="user-email">{email}</div>
          </div>
        </div>
      </div>
    </aside>
  )
}
