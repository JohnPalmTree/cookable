'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { IngredientMatch } from '@/lib/domain/matchIngredients'

interface Props {
  recipeId: string
  matches: IngredientMatch[]
  servings: number
}

export default function CookButton({ recipeId, matches, servings }: Props) {
  const [cooking, setCooking] = useState(false)
  const router = useRouter()

  async function handleCook() {
    if (!confirm(`Mark as cooked? This will deduct ingredients from your inventory.`)) return
    setCooking(true)

    const updates = matches
      .filter((m) => m.fridgeIngredient && m.status !== 'missing')
      .map((m) => ({
        id: m.fridgeIngredient!.id,
        quantity: Math.max(0, m.fridgeIngredient!.quantity - m.recipeIngredient.quantity),
      }))

    for (const update of updates) {
      await supabase.from('ingredients').update({ quantity: update.quantity }).eq('id', update.id)
    }

    setCooking(false)
    router.refresh()
  }

  return (
    <button
      onClick={handleCook}
      disabled={cooking}
      className="shrink-0 bg-green-600 text-white text-xs font-medium px-3 py-1.5 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
    >
      {cooking ? 'Updating...' : '🍳 I cooked this'}
    </button>
  )
}
