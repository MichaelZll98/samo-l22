import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { AppSidebar } from '@/components/AppSidebar'
import { AIChatWidget } from '@/components/AIChatWidget'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Samo L-22',
  description: 'La tua app per la laurea magistrale',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="it">
      <body className={inter.className}>
        <div className="app-shell">
          <AppSidebar />
          <main className="main-content">{children}</main>
        </div>
        <AIChatWidget />
      </body>
    </html>
  )
}
