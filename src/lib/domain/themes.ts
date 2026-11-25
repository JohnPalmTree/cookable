export const THEMES = [
  {
    id: 'sage',
    label: 'Butter and sage',
    short: 'Sage',
    swatch: ['#FBF3D0', '#4F6B4A', '#E3A857'],
  },
  {
    id: 'walnut',
    label: 'Walnut and ember',
    short: 'Walnut',
    swatch: ['#2A1D16', '#F08A4B', '#C9A24B'],
  },
  {
    id: 'terracotta',
    label: 'Terracotta and cream',
    short: 'Terracotta',
    swatch: ['#FBF1E4', '#B4492B', '#6B6B3A'],
  },
] as const

export type ThemeId = (typeof THEMES)[number]['id']

export const DEFAULT_THEME: ThemeId = 'sage'
export const THEME_COOKIE = 'theme'

export function parseTheme(value: string | null | undefined): ThemeId {
  return THEMES.some((t) => t.id === value) ? (value as ThemeId) : DEFAULT_THEME
}

export function nextTheme(current: ThemeId): ThemeId {
  const i = THEMES.findIndex((t) => t.id === current)
  return THEMES[(i + 1) % THEMES.length].id
}
