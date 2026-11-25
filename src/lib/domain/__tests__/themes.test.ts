import { describe, it, expect } from 'vitest'
import { parseTheme, nextTheme, DEFAULT_THEME } from '@/lib/domain/themes'

describe('parseTheme', () => {
  it('accepts each real theme', () => {
    expect(parseTheme('sage')).toBe('sage')
    expect(parseTheme('walnut')).toBe('walnut')
    expect(parseTheme('terracotta')).toBe('terracotta')
  })

  it('falls back to the default (sage) for missing or unknown values', () => {
    expect(DEFAULT_THEME).toBe('sage')
    expect(parseTheme(undefined)).toBe('sage')
    expect(parseTheme('')).toBe('sage')
    expect(parseTheme('neon')).toBe('sage')
  })
})

describe('nextTheme', () => {
  it('cycles sage → walnut → terracotta → sage', () => {
    expect(nextTheme('sage')).toBe('walnut')
    expect(nextTheme('walnut')).toBe('terracotta')
    expect(nextTheme('terracotta')).toBe('sage')
  })
})
