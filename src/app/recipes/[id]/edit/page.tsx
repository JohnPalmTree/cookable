import { createSupabaseServer } from '@/lib/supabaseServer'
import { Recipe, RecipeIngredient } from '@/types'
import RecipeForm from '@/components/recipes/RecipeForm'
import { notFound } from 'next/navigation'

export default async function EditRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createSupabaseServer()
  const [{ data: recipe, error }, { data: ingredients }] = await Promise.all([
    supabase.from('recipes').select('*').eq('id', id).single(),
    supabase.from('recipe_ingredients').select('*').eq('recipe_id', id).order('name'),
  ])

  if (error || !recipe) notFound()

  return (
    <RecipeForm
      recipe={recipe as Recipe}
      existingIngredients={(ingredients ?? []) as RecipeIngredient[]}
    />
  )
}
