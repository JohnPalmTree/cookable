import { describe, it, expect } from 'vitest'
import { fuzzyMatch } from '@/lib/domain/matchIngredients'
import { matchIngredients } from '@/lib/domain/matchIngredients'
import type { Ingredient, RecipeIngredient } from '@/types'

describe('fuzzyMatch', () => {
  it('matches identical names', () => {
    expect(fuzzyMatch('egg', 'egg')).toBe(true)
  })

  it('ignores case', () => {
    expect(fuzzyMatch('Egg', 'egg')).toBe(true)
  })
})

describe('fuzzyMatch known bugs (fixed in Sprint 4)', () => {
  it.fails('does not match egg with eggplant (#6)', () => {
    expect(fuzzyMatch('egg', 'eggplant')).toBe(false)
  })

  it.fails('does not match salt with unsalted butter (#6)', () => {
    expect(fuzzyMatch('salt', 'unsalted butter')).toBe(false)
  })
})

function fridgeItem(name: string, quantity: number, unit: string): Ingredient {
  return {
    id: 'f1',
    name,
    quantity,
    unit,
    category: 'meat',
    expiry_date: null,
    notes: null,
    created_at: '',
    updated_at: '',
  }
}

function needs(name: string, quantity: number, unit: string): RecipeIngredient {
  return { id: 'r1', recipe_id: 'rec1', name, quantity, unit }
}

describe('matchIngredients', () => {
  it('marks enough of the same unit as available', () => {
    const [m] = matchIngredients([needs('chicken', 2, 'lb')], [fridgeItem('chicken', 3, 'lb')])
    expect(m.status).toBe('available')
  })

  it.fails('treats 2 lb in the fridge as enough for 500 g (#8)', () => {
    const [m] = matchIngredients([needs('chicken', 500, 'g')], [fridgeItem('chicken', 2, 'lb')])
    expect(m.status).toBe('available')
  })
})
