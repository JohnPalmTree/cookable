'use client'
import { daysUntil, startOfToday } from '@/lib/domain/dates'
import { useState } from 'react'
import { Ingredient } from '@/types'
import { supabase } from '@/lib/supabase'

interface Props {
  ingredient: Ingredient
  onEdit: (i: Ingredient) => void
  onDeleted: (id: string) => void
}

function expiryStatus(dateStr: string | null): { label: string; color: string } | null {
  if (!dateStr) return null
  const today = startOfToday()
  const diffDays = daysUntil(dateStr, today)


  if (diffDays < 0) return { label: 'Expired', color: 'bg-red-100 text-red-700' }
  if (diffDays === 0) return { label: 'Expires today', color: 'bg-orange-100 text-orange-700' }
  if (diffDays <= 3) return { label: `${diffDays}d left`, color: 'bg-yellow-100 text-yellow-700' }
  return { label: `${diffDays}d left`, color: 'bg-green-100 text-green-700' }
}

const CATEGORY_EMOJI: Record<string, string> = {
  produce: '🥦',
  dairy: '🧀',
  meat: '🥩',
  seafood: '🐟',
  grains: '🌾',
  canned: '🥫',
  frozen: '🧊',
  condiments: '🫙',
  spices: '🌶️',
  other: '📦',
}

export default function IngredientCard({ ingredient, onEdit, onDeleted }: Props) {
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)
  const expiry = expiryStatus(ingredient.expiry_date)

  async function handleDelete() {
    setDeleting(true)
    const { error } = await supabase.from('ingredients').delete().eq('id', ingredient.id)
    if (error) {
      alert(error.message)
      setDeleting(false)
      return
    }
    onDeleted(ingredient.id)
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col gap-2 hover:shadow-sm transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <span className="text-xl">{CATEGORY_EMOJI[ingredient.category] ?? '📦'}</span>
          <div>
            <p className="font-medium text-gray-900 leading-tight">{ingredient.name}</p>
            <p className="text-sm text-gray-400 capitalize">{ingredient.category}</p>
          </div>
        </div>
        <div className="flex gap-1">
          <button
            onClick={() => onEdit(ingredient)}
            className="text-gray-400 hover:text-gray-700 p-1 rounded transition-colors"
            title="Edit"
          >
            ✏️
          </button>
          {confirmDelete ? (
            <div className="flex gap-1 items-center">
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="text-xs text-red-600 font-medium hover:underline"
              >
                {deleting ? '...' : 'Confirm'}
              </button>
              <button
                onClick={() => setConfirmDelete(false)}
                className="text-xs text-gray-400 hover:underline"
              >
                Cancel
              </button>
            </div>
          ) : (
            <button
              onClick={() => setConfirmDelete(true)}
              className="text-gray-400 hover:text-red-500 p-1 rounded transition-colors"
              title="Delete"
            >
              🗑️
            </button>
          )}
        </div>
      </div>

      <div className="flex items-center justify-between mt-1">
        <span className="text-lg font-semibold text-gray-800">
          {ingredient.quantity}{' '}
          <span className="text-sm font-normal text-gray-400">{ingredient.unit}</span>
        </span>
        {expiry && (
          <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${expiry.color}`}>
            {expiry.label}
          </span>
        )}
      </div>

      {ingredient.notes && (
        <p className="text-xs text-gray-400 border-t border-gray-100 pt-2 mt-1">
          {ingredient.notes}
        </p>
      )}
    </div>
  )
}
