'use client'
import { useState } from 'react'
import { Ingredient, Recipe, RecipeIngredient } from '@/types'
import { matchIngredients, recipeAvailability } from '@/lib/domain/matchIngredients'
import RecipeCard from './RecipeCard'
import Link from 'next/link'

interface Props {
  initialRecipes: Recipe[]
  allRecipeIngredients: RecipeIngredient[]
  inventory: Ingredient[]
}

export default function RecipesClient({ initialRecipes, allRecipeIngredients, inventory }: Props) {
  const [recipes, setRecipes] = useState<Recipe[]>(initialRecipes)
  const [search, setSearch] = useState('')
  const [cookableOnly, setCookableOnly] = useState(false)

  function getAvailability(recipeId: string) {
    const ri = allRecipeIngredients.filter((i) => i.recipe_id === recipeId)
    const matches = matchIngredients(ri, inventory)
    return recipeAvailability(matches)
  }

  const filtered = recipes.filter((r) => {
    const matchesSearch =
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
    const matchesCookable = !cookableOnly || getAvailability(r.id) === 'full'
    return matchesSearch && matchesCookable
  })

  function handleDeleted(id: string) {
    setRecipes((prev) => prev.filter((r) => r.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Recipes</h1>
        <Link
          href="/recipes/new"
          className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          + Add recipe
        </Link>
      </div>

      {/* Search + filter bar */}
      <div className="flex flex-wrap gap-3 mb-6 items-center">
        <input
          type="text"
          placeholder="Search recipes or tags..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-72 focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
        <button
          onClick={() => setCookableOnly((prev) => !prev)}
          className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium border transition-colors ${
            cookableOnly
              ? 'bg-green-600 text-white border-green-600'
              : 'bg-white text-gray-500 border-gray-200 hover:border-gray-400'
          }`}
        >
          🍳 {cookableOnly ? 'Showing cookable' : 'What can I cook?'}
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">📖</p>
          <p className="font-medium text-gray-600">
            {cookableOnly
              ? 'Nothing cookable with your current inventory'
              : search
                ? 'No recipes match your search'
                : 'No recipes yet'}
          </p>
          <p className="text-sm mt-1">
            {cookableOnly
              ? 'Try restocking or adding more recipes'
              : search
                ? 'Try a different search term or tag'
                : 'Add your first recipe to get started'}
          </p>
          {!search && !cookableOnly && (
            <Link
              href="/recipes/new"
              className="inline-block mt-4 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              + Add recipe
            </Link>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              recipe={recipe}
              availability={getAvailability(recipe.id)}
              onDeleted={handleDeleted}
            />
          ))}
        </div>
      )}
    </div>
  )
}
