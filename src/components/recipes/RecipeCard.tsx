'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Recipe } from '@/types'
import { supabase } from '@/lib/supabase'

interface Props {
  recipe: Recipe
  availability: 'full' | 'partial' | 'none'
  onDeleted: (id: string) => void
}

const AVAILABILITY = {
  full:    { label: '✓ Ready to cook', color: 'bg-green-100 text-green-700' },
  partial: { label: '~ Missing some',  color: 'bg-yellow-100 text-yellow-700' },
  none:    { label: '✕ Can\'t make',   color: 'bg-red-100 text-red-700' },
}

export default function RecipeCard({ recipe, availability, onDeleted }: Props) {
  const [confirmDelete, setConfirmDelete] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const totalTime = (recipe.prep_time_mins ?? 0) + (recipe.cook_time_mins ?? 0)
  const badge = AVAILABILITY[availability]

  async function handleDelete() {
    setDeleting(true)
    const { error } = await supabase.from('recipes').delete().eq('id', recipe.id)
    if (error) { alert(error.message); setDeleting(false); return }
    onDeleted(recipe.id)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between gap-2">
        <Link href={`/recipes/${recipe.id}`} className="font-semibold text-gray-900 hover:underline leading-snug">
          {recipe.title}
        </Link>
        <div className="flex gap-1 shrink-0">
          <Link
            href={`/recipes/${recipe.id}/edit`}
            className="text-gray-400 hover:text-gray-700 p-1 rounded transition-colors"
            title="Edit"
          >✏️</Link>
          {confirmDelete ? (
            <div className="flex gap-1 items-center">
              <button onClick={handleDelete} disabled={deleting} className="text-xs text-red-600 font-medium hover:underline">
                {deleting ? '...' : 'Confirm'}
              </button>
              <button onClick={() => setConfirmDelete(false)} className="text-xs text-gray-400 hover:underline">Cancel</button>
            </div>
          ) : (
            <button onClick={() => setConfirmDelete(true)} className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors" title="Delete">
              🗑️
            </button>
          )}
        </div>
      </div>

      {recipe.description && (
        <p className="text-sm text-gray-500 line-clamp-2">{recipe.description}</p>
      )}

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-xs text-gray-400">
          <span>👤 {recipe.servings} serving{recipe.servings !== 1 ? 's' : ''}</span>
          {totalTime > 0 && <span>⏱ {totalTime} min</span>}
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${badge.color}`}>
          {badge.label}
        </span>
      </div>

      {recipe.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {recipe.tags.map(tag => (
            <span key={tag} className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{tag}</span>
          ))}
        </div>
      )}
    </div>
  )
}