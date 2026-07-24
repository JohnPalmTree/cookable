import { supabase } from '@/src/lib/supabase'
import { Recipe, RecipeIngredient, Ingredient } from '@/src/types'
import { getInventory } from '@/src/lib/getInventory'
import ShoppingClient from '@/src/components/shopping/ShoppingClient'

export default async function ShoppingPage() {
  const [
    { data: recipes },
    { data: allRecipeIngredients },
    inventory,
  ] = await Promise.all([
    supabase.from('recipes').select('*').order('title'),
    supabase.from('recipe_ingredients').select('*'),
    getInventory(),
  ])

  return (
    <ShoppingClient
      recipes={(recipes ?? []) as Recipe[]}
      allRecipeIngredients={(allRecipeIngredients ?? []) as RecipeIngredient[]}
      inventory={inventory}
    />
  )
}