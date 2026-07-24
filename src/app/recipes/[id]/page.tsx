import PrintButton from '@/src/app/recipes/PrintButton'
import { supabase } from '@/src/lib/supabase'
import { Recipe, RecipeIngredient } from '@/src/types'
import { getInventory } from '@/src/lib/getInventory'
import { matchIngredients, recipeAvailability } from '@/src/lib/matchIngredients'
import CookButton from '@/src/app/recipes/CookButton'
import Link from 'next/link'
import { notFound } from 'next/navigation'

export default async function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

  const [{ data: recipe, error }, { data: ingredients }, inventory] = await Promise.all([
    supabase.from('recipes').select('*').eq('id', id).single(),
    supabase.from('recipe_ingredients').select('*').eq('recipe_id', id).order('name'),
    getInventory(),
  ])

  if (error || !recipe) notFound()

  const r = recipe as Recipe
  const ri = (ingredients ?? []) as RecipeIngredient[]
  const matches = matchIngredients(ri, inventory)
  const availability = recipeAvailability(matches)
  const totalTime = (r.prep_time_mins ?? 0) + (r.cook_time_mins ?? 0)

  const availabilityBanner = {
    full:    { text: 'You have everything to make this',       color: 'bg-green-50 text-green-700 border-green-200' },
    partial: { text: 'You\'re missing some ingredients',      color: 'bg-yellow-50 text-yellow-700 border-yellow-200' },
    none:    { text: 'You\'re missing most ingredients',      color: 'bg-red-50 text-red-700 border-red-200' },
  }[availability]

  return (
    <div className="max-w-2xl mx-auto">
      <Link href="/recipes" className="no-print text-sm text-gray-400 hover:text-gray-700 mb-6 inline-block">
        ← Back to recipes
      </Link>

      <div className="flex items-start justify-between gap-4 mb-4">
        <h1 className="text-3xl font-semibold text-gray-900">{r.title}</h1>
        <div className="flex gap-2 no-print">
        <Link
          href={`/recipes/${r.id}/edit`}
          className="shrink-0 border border-gray-200 text-sm text-gray-600 font-medium px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors"
        >
          ✏️ Edit
        </Link>
        <PrintButton />
      </div>
      </div>

      {r.description && <p className="text-gray-500 mb-4">{r.description}</p>}

      <div className="flex flex-wrap gap-4 text-sm text-gray-500 mb-4">
        <span>👤 {r.servings} serving{r.servings !== 1 ? 's' : ''}</span>
        {r.prep_time_mins && <span>🔪 Prep: {r.prep_time_mins} min</span>}
        {r.cook_time_mins && <span>🍳 Cook: {r.cook_time_mins} min</span>}
        {totalTime > 0 && <span className="font-medium text-gray-700">⏱ Total: {totalTime} min</span>}
      </div>

      {r.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-4">
          {r.tags.map(tag => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>
      )}

      {/* Availability banner */}
      <div className={`no-print text-sm px-4 py-2.5 rounded-lg border mb-6 flex items-center justify-between gap-4 ${availabilityBanner.color}`}>
        <span>{availabilityBanner.text}</span>
        {availability !== 'none' && <CookButton recipeId={r.id} matches={matches} servings={r.servings} />}
      </div>

      <hr className="border-gray-200 mb-6" />

      {/* Ingredients with match status */}
      {ri.length > 0 && (
        <section className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Ingredients</h2>
          <ul className="space-y-2">
            {matches.map(({ recipeIngredient: i, fridgeIngredient: fridge, status }) => (
              <li key={i.id} className="flex items-center gap-3 text-sm">
                <span className={`w-2 h-2 rounded-full shrink-0 ${
                  status === 'available' ? 'bg-green-400' :
                  status === 'low'       ? 'bg-yellow-400' :
                                           'bg-red-400'
                }`} />
                <span className="font-medium text-gray-800">{i.quantity} {i.unit}</span>
                <span className={status === 'missing' ? 'text-red-500 line-through' : 'text-gray-700'}>
                  {i.name}
                </span>
                {fridge && status === 'low' && (
                  <span className="text-xs text-yellow-600 ml-auto">have {fridge.quantity} {fridge.unit}</span>
                )}
                {status === 'missing' && (
                  <span className="text-xs text-red-400 ml-auto">not in fridge</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Steps */}
      {r.steps.length > 0 && (
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Steps</h2>
          <ol className="space-y-4">
            {r.steps.map((step, idx) => (
              <li key={idx} className="flex gap-4 text-sm text-gray-700">
                <span className="shrink-0 w-6 h-6 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center font-medium">
                  {idx + 1}
                </span>
                <p className="pt-0.5 leading-relaxed">{step}</p>
              </li>
            ))}
          </ol>
        </section>
      )}
    </div>
  )
}