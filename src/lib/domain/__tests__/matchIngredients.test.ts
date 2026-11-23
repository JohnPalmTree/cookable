import { describe, it, expect } from 'vitest'
import { fuzzyMatch } from '@/lib/domain/matchIngredients'

describe('fuzzyMatch', () => {
  it('matches identical names', () => {
    expect(fuzzyMatch('egg', 'egg')).toBe(true)
  })

  it('ignores case', () => {
    expect(fuzzyMatch('Egg', 'egg')).toBe(true)
  })
})

describe('fuzzyMatch known bugs (fixed in Sprint 4)', () => {
  it.fails('does not match egg with eggplant', () => {
    expect(fuzzyMatch('egg', 'eggplant')).toBe(false)
  })

  it.fails('does not match salt with unsalted butter', () => {
    expect(fuzzyMatch('salt', 'unsalted butter')).toBe(false)
  })
})