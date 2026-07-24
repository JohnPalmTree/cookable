import { supabase } from '@/src/lib/supabase'
import { Recipe, RecipeIngredient } from '@/src/types'
import { getInventory } from '@/src/lib/getInventory'
import RecipesClient from '@/src/app/recipes/RecipeClient'

export default async function RecipesPage() {
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