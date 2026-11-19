import { createSupabaseServer } from '@/lib/supabaseServer'
import { Recipe, RecipeIngredient } from '@/types'
import { getInventory } from '@/lib/getInventory'
import ShoppingClient from '@/components/shopping/ShoppingClient'

export default async function ShoppingPage() {
  const supabase = await createSupabaseServer()
  const [{ data: recipes }, { data: allRecipeIngredients }, inventory] = await Promise.all([
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
