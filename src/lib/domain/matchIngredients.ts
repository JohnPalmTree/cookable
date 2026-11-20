import { Ingredient, RecipeIngredient } from '@/types'

export type MatchStatus = 'available' | 'low' | 'missing'

export interface IngredientMatch {
  recipeIngredient: RecipeIngredient
  fridgeIngredient: Ingredient | null
  status: MatchStatus
}

export function fuzzyMatch(a: string, b: string): boolean {
  const normalize = (s: string) => s.toLowerCase().trim()
  const na = normalize(a)
  const nb = normalize(b)
  return na.includes(nb) || nb.includes(na)
}

export function matchIngredients(
  recipeIngredients: RecipeIngredient[],
  fridgeIngredients: Ingredient[],
): IngredientMatch[] {
  return recipeIngredients.map((ri) => {
    const match = fridgeIngredients.find((fi) => fuzzyMatch(fi.name, ri.name))

    if (!match) {
      return { recipeIngredient: ri, fridgeIngredient: null, status: 'missing' }
    }

    // "low" means you have some but less than the recipe needs
    const status: MatchStatus = match.quantity >= ri.quantity ? 'available' : 'low'
    return { recipeIngredient: ri, fridgeIngredient: match, status }
  })
}

export function recipeAvailability(matches: IngredientMatch[]): 'full' | 'partial' | 'none' {
  if (matches.length === 0) return 'full'
  const missing = matches.filter((m) => m.status === 'missing').length
  const low = matches.filter((m) => m.status === 'low').length

  if (missing === 0 && low === 0) return 'full'
  if (missing === matches.length) return 'none'
  return 'partial'
}
