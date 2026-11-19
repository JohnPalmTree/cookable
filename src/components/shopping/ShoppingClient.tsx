'use client'
import { showToast } from '@/components/ui/Toast'
import { useState } from 'react'
import { Ingredient, Recipe, RecipeIngredient } from '@/types'
import { generateShoppingList } from '@/lib/domain/generateShoppingList'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'

interface Props {
  recipes: Recipe[]
  allRecipeIngredients: RecipeIngredient[]
  inventory: Ingredient[]
}

type Stage = 'select' | 'list'

export default function ShoppingClient({ recipes, allRecipeIngredients, inventory }: Props) {
  const [stage, setStage] = useState<Stage>('select')
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())
  const [adding, setAdding] = useState(false)
  const router = useRouter()

  const recipeNames = Object.fromEntries(recipes.map((r) => [r.id, r.title]))
  const shoppingList = generateShoppingList(
    selectedIds.size > 0 ? [...selectedIds] : [],
    allRecipeIngredients,
    inventory,
    recipeNames,
  )
  const itemsToBuy = shoppingList.filter((i) => i.toBuy > 0)
  const alreadyHave = shoppingList.filter((i) => i.toBuy === 0)

  function toggleRecipe(id: string) {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  function toggleChecked(name: string) {
    setCheckedItems((prev) => {
      const next = new Set(prev)
      if (next.has(name)) next.delete(name)
      else next.add(name)
      return next
    })
  }

  async function handleAddToInventory() {
    if (checkedItems.size === 0) return
    setAdding(true)

    const itemsToAdd = shoppingList.filter((i) => checkedItems.has(i.name) && i.toBuy > 0)

    for (const item of itemsToAdd) {
      // Check if ingredient already exists in inventory
      const existing = inventory.find(
        (fi) => fi.name.toLowerCase().trim() === item.name.toLowerCase().trim(),
      )

      if (existing) {
        await supabase
          .from('ingredients')
          .update({ quantity: existing.quantity + item.toBuy })
          .eq('id', existing.id)
      } else {
        await supabase.from('ingredients').insert({
          name: item.name,
          quantity: item.toBuy,
          unit: item.unit,
          category: 'other',
        })
      }
    }

    setAdding(false)
    router.refresh()
    showToast(
      `Added ${itemsToAdd.length} item${itemsToAdd.length !== 1 ? 's' : ''} to your inventory`,
    )
  }

  // ── Stage: Select recipes ──────────────────────────────────────────
  if (stage === 'select') {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold text-gray-900">Shopping List</h1>
          <button
            onClick={() => setStage('list')}
            disabled={selectedIds.size === 0}
            className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-40"
          >
            Generate list →
          </button>
        </div>

        <p className="text-sm text-gray-500 mb-4">
          Select the recipes you want to cook and we’ll build your shopping list.
        </p>

        {recipes.length === 0 ? (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">📖</p>
            <p className="font-medium">No recipes yet</p>
            <p className="text-sm mt-1">Add some recipes first</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recipes.map((recipe) => {
              const selected = selectedIds.has(recipe.id)
              return (
                <button
                  key={recipe.id}
                  onClick={() => toggleRecipe(recipe.id)}
                  className={`text-left border rounded-xl p-4 transition-all ${
                    selected
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-200 bg-white text-gray-900 hover:border-gray-400'
                  }`}
                >
                  <p className="font-medium leading-snug">{recipe.title}</p>
                  {recipe.description && (
                    <p
                      className={`text-xs mt-1 line-clamp-1 ${selected ? 'text-gray-300' : 'text-gray-400'}`}
                    >
                      {recipe.description}
                    </p>
                  )}
                  <p className={`text-xs mt-2 ${selected ? 'text-gray-300' : 'text-gray-400'}`}>
                    👤 {recipe.servings} serving{recipe.servings !== 1 ? 's' : ''}
                  </p>
                </button>
              )
            })}
          </div>
        )}
      </div>
    )
  }

  // ── Stage: Shopping list ───────────────────────────────────────────
  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Your list</h1>
        <button
          onClick={() => {
            setStage('select')
            setCheckedItems(new Set())
          }}
          className="text-sm text-gray-400 hover:text-gray-700 transition-colors"
        >
          ← Change recipes
        </button>
      </div>

      {/* Selected recipes summary */}
      <div className="flex flex-wrap gap-1 mb-6">
        {[...selectedIds].map((id) => (
          <span key={id} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
            {recipeNames[id]}
          </span>
        ))}
      </div>

      {/* Items to buy */}
      {itemsToBuy.length > 0 ? (
        <section className="mb-6">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            To buy ({itemsToBuy.length})
          </h2>
          <ul className="space-y-2">
            {itemsToBuy.map((item) => {
              const checked = checkedItems.has(item.name)
              return (
                <li
                  key={item.name}
                  onClick={() => toggleChecked(item.name)}
                  className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                    checked
                      ? 'border-green-200 bg-green-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${
                      checked ? 'border-green-500 bg-green-500' : 'border-gray-300'
                    }`}
                  >
                    {checked && <span className="text-white text-xs">✓</span>}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-medium ${checked ? 'line-through text-gray-400' : 'text-gray-900'}`}
                    >
                      {item.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      Need {item.toBuy} {item.unit}
                      {item.haveQuantity > 0 && ` · have ${item.haveQuantity} ${item.unit}`}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs text-gray-400">{item.recipeNames.join(', ')}</p>
                  </div>
                </li>
              )
            })}
          </ul>
        </section>
      ) : (
        <div className="text-center py-10 text-gray-400 mb-6">
          <p className="text-3xl mb-2">🎉</p>
          <p className="font-medium">You have everything!</p>
          <p className="text-sm mt-1">Your fridge is stocked for all selected recipes</p>
        </div>
      )}

      {/* Already have */}
      {alreadyHave.length > 0 && (
        <section className="mb-6">
          <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide mb-3">
            Already in fridge ({alreadyHave.length})
          </h2>
          <ul className="space-y-1">
            {alreadyHave.map((item) => (
              <li
                key={item.name}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400"
              >
                <span className="w-5 h-5 rounded-full border-2 border-green-300 bg-green-100 flex items-center justify-center shrink-0">
                  <span className="text-green-500 text-xs">✓</span>
                </span>
                <span>{item.name}</span>
                <span className="ml-auto text-xs">
                  {item.haveQuantity} {item.unit}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Add to inventory button */}
      {checkedItems.size > 0 && (
        <div className="sticky bottom-4">
          <button
            onClick={handleAddToInventory}
            disabled={adding}
            className="w-full bg-green-600 text-white font-medium py-3 rounded-xl hover:bg-green-700 transition-colors disabled:opacity-50 shadow-lg"
          >
            {adding
              ? 'Adding...'
              : `Add ${checkedItems.size} checked item${checkedItems.size !== 1 ? 's' : ''} to inventory`}
          </button>
        </div>
      )}
    </div>
  )
}
