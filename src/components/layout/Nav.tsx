'use client'
import { createSupabaseBrowser } from '@/lib/supabaseBrowser'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { useState } from 'react'
import StylePicker from '@/components/layout/StylePicker'
import type { ThemeId } from '@/lib/domain/themes'

const links = [
  { href: '/', label: '🏠 Home' },
  { href: '/inventory', label: '🧊 Inventory' },
  { href: '/recipes', label: '📖 Recipes' },
  { href: '/shopping', label: '🛒 Shopping' },
]

function linkClass(active: boolean) {
  return `rounded-md text-sm font-medium transition-colors ${
    active ? 'bg-surface text-ink' : 'text-muted hover:bg-surface hover:text-ink'
  }`
}

export default function Nav({ theme }: { theme: ThemeId }) {
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const supabase = createSupabaseBrowser()
  const router = useRouter()

  async function handleSignOut() {
    await supabase.auth.signOut()
    router.push('/auth')
    router.refresh()
  }

  return (
    <nav className="sticky top-0 z-10 border-b border-line bg-surface-2">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between gap-3 px-4">
        <span className="font-display text-lg font-semibold text-ink">🍳 Fridge & Cookbook</span>

        {/* Desktop links */}
        <div className="hidden gap-1 sm:flex">
          {links.map(({ href, label }) => (
            <Link key={href} href={href} className={`px-3 py-1.5 ${linkClass(pathname === href)}`}>
              {label}
            </Link>
          ))}
          <button onClick={handleSignOut} className={`no-print px-3 py-1.5 ${linkClass(false)}`}>
            Sign out
          </button>
        </div>

        <div className="flex items-center gap-2">
          <StylePicker initial={theme} />

          {/* Mobile hamburger */}
          <button
            className="p-1 text-muted hover:text-ink sm:hidden"
            onClick={() => setOpen((prev) => !prev)}
            aria-label="Toggle menu"
          >
            {open ? '✕' : '☰'}
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="flex flex-col gap-1 border-t border-line bg-surface-2 px-4 py-2 sm:hidden">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`px-3 py-2 ${linkClass(pathname === href)}`}
            >
              {label}
            </Link>
          ))}
          <button onClick={handleSignOut} className={`px-3 py-2 text-left ${linkClass(false)}`}>
            Sign out
          </button>
        </div>
      )}
    </nav>
  )
}
