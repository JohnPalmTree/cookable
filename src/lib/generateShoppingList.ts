import { Ingredient, RecipeIngredient } from '@/types'

export interface ShoppingItem {
  name: string
  needed: number
  unit: string
  haveQuantity: number
  toBuy: number
  recipeNames: string[]
}

function fuzzyMatch(a: string, b: string): boolean {
  const n = (s: string) => s.toLowerCase().trim()
  return n(a).includes(n(b)) || n(b).includes(n(a))
}

export function generateShoppingList(
  selectedRecipeIds: string[],
  allRecipeIngredients: RecipeIngredient[],
  inventory: Ingredient[],
  recipeNames: Record<string, string>
): ShoppingItem[] {
  // Gather all ingredients needed across selected recipes
  const needed = allRecipeIngredients.filter(ri =>
    selectedRecipeIds.includes(ri.recipe_id)
  )

  // Merge duplicates by fuzzy name match
  const merged: Map<string, ShoppingItem> = new Map()

  for (const ri of needed) {
    const key = [...merged.keys()].find(k => fuzzyMatch(k, ri.name))
    const recipeName = recipeNames[ri.recipe_id] ?? 'Unknown'

    if (key) {
      const existing = merged.get(key)!
      existing.needed += ri.quantity
      existing.toBuy = Math.max(0, existing.needed - existing.haveQuantity)
      if (!existing.recipeNames.includes(recipeName)) {
        existing.recipeNames.push(recipeName)
      }
    } else {
      const fridgeMatch = inventory.find(fi => fuzzyMatch(fi.name, ri.name))
      const haveQuantity = fridgeMatch?.quantity ?? 0
      merged.set(ri.name, {
        name: ri.name,
        needed: ri.quantity,
        unit: ri.unit,
        haveQuantity,
        toBuy: Math.max(0, ri.quantity - haveQuantity),
        recipeNames: [recipeName],
      })
    }
  }

  // Sort: items to buy first, then already-have items
  return [...merged.values()].sort((a, b) => {
    if (a.toBuy > 0 && b.toBuy === 0) return -1
    if (a.toBuy === 0 && b.toBuy > 0) return 1
    return a.name.localeCompare(b.name)
  })
}