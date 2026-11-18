import { createSupabaseServer } from '@/lib/supabaseServer'
import { Recipe, RecipeIngredient } from '@/types'
import { getInventory } from '@/lib/getInventory'
import RecipesClient from '@/components/recipes/RecipeClient'

export default async function RecipesPage() {
  const supabase = await createSupabaseServer()
  const [
    { data: recipes, error },
    { data: allRecipeIngredients },
    inventory,
  ] = await Promise.all([
    supabase.from('recipes').select('*').order('created_at', { ascending: false }),
    supabase.from('recipe_ingredients').select('*'),
    getInventory(),
  ])

  if (error) {
    return <p className="text-red-500">Failed to load recipes: {error.message}</p>
  }

  return (
    <RecipesClient
      initialRecipes={recipes as Recipe[]}
      allRecipeIngredients={(allRecipeIngredients ?? []) as RecipeIngredient[]}
      inventory={inventory}
    />
  )
}