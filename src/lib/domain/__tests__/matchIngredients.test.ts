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
