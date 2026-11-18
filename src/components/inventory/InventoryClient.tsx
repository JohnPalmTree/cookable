'use client'
import { useState } from 'react'
import { Ingredient } from '@/types'
import IngredientCard from './IngredientCard'
import IngredientForm from './IngredientForm'

const CATEGORIES = ['all','produce','dairy','meat','seafood','grains','canned','frozen','condiments','spices','other']

interface Props {
  initialIngredients: Ingredient[]
}

export default function InventoryClient({ initialIngredients }: Props) {
  const [ingredients, setIngredients] = useState<Ingredient[]>(initialIngredients)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('all')
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<Ingredient | null>(null)

  const filtered = ingredients.filter(i => {
    const matchesSearch = i.name.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = category === 'all' || i.category === category
    return matchesSearch && matchesCategory
  })

  function handleSaved(ingredient: Ingredient) {
    setIngredients(prev =>
      editing
        ? prev.map(i => i.id === ingredient.id ? ingredient : i)
        : [ingredient, ...prev]
    )
    setShowForm(false)
    setEditing(null)
  }

  function handleEdit(ingredient: Ingredient) {
    setEditing(ingredient)
    setShowForm(true)
  }

  function handleDeleted(id: string) {
    setIngredients(prev => prev.filter(i => i.id !== id))
  }

  function handleClose() {
    setShowForm(false)
    setEditing(null)
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Fridge Inventory</h1>
        <button
          onClick={() => setShowForm(true)}
          className="bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
        >
          + Add ingredient
        </button>
      </div>

      {/* Search + filter */}
      <div className="flex gap-3 mb-6 flex-wrap">
        <input
          type="text"
          placeholder="Search ingredients..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-gray-900"
        />
        <div className="flex gap-1 flex-wrap">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3 py-1.5 rounded-full text-xs font-medium capitalize transition-colors ${
                category === cat
                  ? 'bg-gray-900 text-white'
                  : 'bg-white border border-gray-200 text-gray-500 hover:border-gray-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Ingredient grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-4">🧊</p>
          <p className="font-medium text-gray-600">
            {search || category !== 'all' ? 'No ingredients match your search' : 'Your fridge is empty'}
          </p>
          <p className="text-sm mt-1">
            {search || category !== 'all'
              ? 'Try a different search or category'
              : 'Add your first ingredient to get started'}
          </p>
          {!search && category === 'all' && (
            <button
              onClick={() => setShowForm(true)}
              className="mt-4 bg-gray-900 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              + Add ingredient
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {filtered.map(ingredient => (
            <IngredientCard
              key={ingredient.id}
              ingredient={ingredient}
              onEdit={handleEdit}
              onDeleted={handleDeleted}
            />
          ))}
        </div>
      )}

      {/* Slide-over form */}
      {showForm && (
        <IngredientForm
          ingredient={editing}
          onSaved={handleSaved}
          onClose={handleClose}
        />
      )}
    </div>
  )
}