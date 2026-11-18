'use client'
import { createSupabaseBrowser } from '@/lib/supabaseBrowser'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'

const links = [
  { href: '/',          label: '🏠 Home' },
  { href: '/inventory', label: '🧊 Inventory' },
  { href: '/recipes',   label: '📖 Recipes' },
  { href: '/shopping',  label: '🛒 Shopping' },
]

export default function Nav() {
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
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 flex items-center justify-between h-14">
        <span className="font-semibold text-gray-900">🍳 Fridge & Cookbook</span>

        {/* Desktop links */}
        <div className="hidden sm:flex gap-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                pathname === href
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {label}
            </Link>
          ))}

          <button
            onClick={handleSignOut}
            className="px-3 py-1.5 rounded-md text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors no-print"
          >
            Sign out
          </button>

        </div>

        {/* Mobile hamburger */}
        <button
          className="sm:hidden text-gray-500 hover:text-gray-900 p-1"
          onClick={() => setOpen(prev => !prev)}
          aria-label="Toggle menu"
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {/* Mobile dropdown */}
      {open && (
        <div className="sm:hidden border-t border-gray-100 bg-white px-4 py-2 flex flex-col gap-1">
          {links.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                pathname === href
                  ? 'bg-gray-100 text-gray-900'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
              }`}
            >
              {label}
            </Link>
          ))}

          <button
            onClick={handleSignOut}
            className="px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors text-left"
          >
            Sign out
          </button>
        </div>
      )}
    </nav>
  )
}