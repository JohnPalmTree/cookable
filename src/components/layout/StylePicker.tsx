'use client'
import { useState } from 'react'
import { THEMES, THEME_COOKIE, nextTheme, type ThemeId } from '@/lib/domain/themes'

const focusRing =
  'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent'

function applyTheme(id: ThemeId) {
  document.documentElement.dataset.theme = id
  document.cookie = `${THEME_COOKIE}=${id}; path=/; max-age=31536000; samesite=lax`
}

export default function StylePicker({ initial }: { initial: ThemeId }) {
  const [theme, setTheme] = useState<ThemeId>(initial)
  const [open, setOpen] = useState(false)

  const current = THEMES.find((t) => t.id === theme)!
  const next = THEMES.find((t) => t.id === nextTheme(theme))!

  function choose(id: ThemeId) {
    applyTheme(id)
    setTheme(id)
    setOpen(false)
  }

  return (
    <div className="relative flex items-center gap-1">
      <button
        type="button"
        onClick={() => choose(next.id)}
        aria-label={`Style: ${current.short}. Switch to ${next.label}`}
        className={`min-h-11 rounded-button border border-line bg-surface px-4 text-sm font-medium text-ink ${focusRing}`}
      >
        Style: {current.short}
      </button>
      <button
        type="button"
        aria-label="Choose a style"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className={`min-h-11 min-w-11 rounded-button border border-line bg-surface text-ink ${focusRing}`}
      >
        ▾
      </button>
      {open && (
        <ul className="absolute right-0 top-full z-20 mt-2 w-60 rounded-xl border border-line bg-surface p-2 shadow-lg">
          {THEMES.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                aria-pressed={t.id === theme}
                onClick={() => choose(t.id)}
                className={`flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm text-ink hover:bg-surface-2 ${focusRing}`}
              >
                <span aria-hidden="true" className="flex gap-1">
                  {t.swatch.map((c) => (
                    <span
                      key={c}
                      className="h-4 w-4 rounded-full border border-line"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </span>
                {t.label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
