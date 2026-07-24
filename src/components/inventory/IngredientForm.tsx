'use client'
import { useState } from 'react'
import { supabase } from '@/src/lib/supabase'
import { Ingredient, IngredientCategory } from '@/src/types'

const CATEGORIES: IngredientCategory[] = [
  'produce','dairy','meat','seafood','grains','canned','frozen','condiments','spices','other'
]

const COMMON_UNITS = ['g', 'kg', 'ml', 'L', 'oz', 'lb', 'cup', 'tbsp', 'tsp', 'piece', 'bunch', 'can', 'bag', 'box']

interface Props {
  ingredient: Ingredient | null
  onSaved: (i: Ingredient) => void
  onClose: () => void
}

export default function IngredientForm({ ingredient, onSaved, onClose }: Props) {
  const [form, setForm] = useState({
    name:        ingredient?.name        ?? '',
    quantity:    ingredient?.quantity    ?? 1,
    unit:        ingredient?.unit        ?? '',
    category:    ingredient?.category    ?? 'other' as IngredientCategory,
    expiry_date: ingredient?.expiry_date ?? '',
    notes:       ingredient?.notes       ?? '',
  })
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function set(field: string, value: string | number) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.name.trim()) { setError('Name is required'); return }
    setSaving(true)
    setError('')

    const payload = {
      ...form,
      expiry_date: form.expiry_date || null,
      notes: form.notes || null,
    }

    let data, err
    if (ingredient) {
      ;({ data, error: err } = await supabase
        .from('ingredients')
        .update(payload)
        .eq('id', ingredient.id)
        .select()
        .single())
    } else {
      ;({ data, error: err } = await supabase
        .from('ingredients')
        .insert(payload)
        .select()
        .single())
    }

    setSaving(false)
    if (err) { setError(err.message); return }
    onSaved(data as Ingredient)
  }

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/30 z-20"
        onClick={onClose}
      />
      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-30 shadow-xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="font-semibold text-gray-900">
            {ingredient ? 'Edit ingredient' : 'Add ingredient'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xl leading-none">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-4">
          {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
            <input
              value={form.name}
              onChange={e => set('name', e.target.value)}
              placeholder="e.g. Chicken breast"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
              <input
                type="number"
                min="0"
                step="any"
                value={form.quantity}
                onChange={e => set('quantity', parseFloat(e.target.value) || 0)}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-1">Unit</label>
              <input
                list="units"
                value={form.unit}
                onChange={e => set('unit', e.target.value)}
                placeholder="e.g. kg"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <datalist id="units">
                {COMMON_UNITS.map(u => <option key={u} value={u} />)}
              </datalist>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={form.category}
              onChange={e => set('category', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 capitalize"
            >
              {CATEGORIES.map(c => (
                <option key={c} value={c} className="capitalize">{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expiry date</label>
            <input
              type="date"
              value={form.expiry_date ?? ''}
              onChange={e => set('expiry_date', e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea
              value={form.notes ?? ''}
              onChange={e => set('notes', e.target.value)}
              placeholder="Optional notes..."
              rows={3}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 resize-none"
            />
          </div>

          <div className="flex gap-3 pt-2 mt-auto">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-1 bg-gray-900 text-white text-sm font-medium py-2 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : ingredient ? 'Save changes' : 'Add ingredient'}
            </button>
          </div>
        </form>
      </div>
    </>
  )
}