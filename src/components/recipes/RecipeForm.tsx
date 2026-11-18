'use client'
import { createSupabaseBrowser } from '@/lib/supabaseBrowser'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Recipe, RecipeIngredient } from '@/types'

interface IngredientRow {
  id?: string
  name: string
  quantity: number
  unit: string
}

interface Props {
  recipe?: Recipe
  existingIngredients?: RecipeIngredient[]
}

const COMMON_UNITS = [
  'g',
  'kg',
  'ml',
  'L',
  'oz',
  'lb',
  'cup',
  'tbsp',
  'tsp',
  'piece',
  'bunch',
  'can',
  'bag',
  'box',
]

export default function RecipeForm({ recipe, existingIngredients = [] }: Props) {
  const router = useRouter()
  const isEditing = !!recipe

  const [title, setTitle] = useState(recipe?.title ?? '')
  const [description, setDescription] = useState(recipe?.description ?? '')
  const [servings, setServings] = useState(recipe?.servings ?? 2)
  const [prepTime, setPrepTime] = useState(recipe?.prep_time_mins ?? '')
  const [cookTime, setCookTime] = useState(recipe?.cook_time_mins ?? '')
  const [tagInput, setTagInput] = useState('')
  const [tags, setTags] = useState<string[]>(recipe?.tags ?? [])
  const [steps, setSteps] = useState<string[]>(recipe?.steps.length ? recipe.steps : [''])
  const [ingredients, setIngredients] = useState<IngredientRow[]>(
    existingIngredients.length
      ? existingIngredients.map((i) => ({
          id: i.id,
          name: i.name,
          quantity: i.quantity,
          unit: i.unit,
        }))
      : [{ name: '', quantity: 1, unit: '' }],
  )
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  // Tags
  function addTag() {
    const t = tagInput.trim().toLowerCase()
    if (t && !tags.includes(t)) setTags((prev) => [...prev, t])
    setTagInput('')
  }
  function removeTag(t: string) {
    setTags((prev) => prev.filter((x) => x !== t))
  }

  // Steps
  function setStep(idx: number, val: string) {
    setSteps((prev) => prev.map((s, i) => (i === idx ? val : s)))
  }
  function addStep() {
    setSteps((prev) => [...prev, ''])
  }
  function removeStep(idx: number) {
    setSteps((prev) => prev.filter((_, i) => i !== idx))
  }

  // Ingredients
  function setIngredient(idx: number, field: keyof IngredientRow, val: string | number) {
    setIngredients((prev) => prev.map((r, i) => (i === idx ? { ...r, [field]: val } : r)))
  }
  function addIngredient() {
    setIngredients((prev) => [...prev, { name: '', quantity: 1, unit: '' }])
  }
  function removeIngredient(idx: number) {
    setIngredients((prev) => prev.filter((_, i) => i !== idx))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim()) {
      setError('Title is required')
      return
    }
    setSaving(true)
    setError('')

    const supabase = createSupabaseBrowser()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setError('Not logged in — please sign in again')
      setSaving(false)
      return
    }

    const recipePayload = {
      title: title.trim(),
      description: description.trim() || null,
      servings,
      prep_time_mins: prepTime === '' ? null : Number(prepTime),
      cook_time_mins: cookTime === '' ? null : Number(cookTime),
      tags,
      steps: steps.filter((s) => s.trim()),
      user_id: user.id,
    }

    let recipeId = recipe?.id

    if (isEditing) {
      const { error: err } = await supabase
        .from('recipes')
        .update(recipePayload)
        .eq('id', recipeId!)
      if (err) {
        setError(err.message)
        setSaving(false)
        return
      }
    } else {
      const { data, error: err } = await supabase
        .from('recipes')
        .insert(recipePayload)
        .select()
        .single()
      if (err) {
        setError(err.message)
        setSaving(false)
        return
      }
      recipeId = data.id
    }

    // Replace recipe_ingredients: delete old, insert new
    const { error: delErr } = await supabase
      .from('recipe_ingredients')
      .delete()
      .eq('recipe_id', recipeId!)

    if (delErr) {
      setError(delErr.message)
      setSaving(false)
      return
    }

    const validIngredients = ingredients.filter((i) => i.name.trim())
    if (validIngredients.length > 0) {
      const { error: ingErr } = await supabase.from('recipe_ingredients').insert(
        validIngredients.map((i) => ({
          recipe_id: recipeId,
          name: i.name.trim(),
          quantity: Number(i.quantity),
          unit: i.unit,
        })),
      )
      if (ingErr) {
        setError(ingErr.message)
        setSaving(false)
        return
      }
    }

    router.push(`/recipes/${recipeId}`)
  }

  const inputClass =
    'w-full bg-gray-50 border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-500 focus:outline-none focus:ring-2 focus:ring-gray-900'
  const labelClass = 'block text-sm font-medium text-gray-500 mb-1'

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">
        {isEditing ? 'Edit recipe' : 'New recipe'}
      </h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6">
        {error && <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-lg">{error}</p>}

        {/* Basics */}
        <section className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-4">
          <h2 className="font-medium text-gray-900">Basics</h2>

          <div>
            <label className={labelClass}>Title*</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Spaghetti Carbonara"
              className={inputClass}
            />
          </div>

          <div>
            <label className={labelClass}>Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="A short description..."
              rows={2}
              className={`${inputClass} resize-none`}
            />
          </div>

          <div className="flex gap-3">
            <div className="flex-1">
              <label className={labelClass}>Servings</label>
              <input
                type="number"
                min="1"
                value={servings}
                onChange={(e) => setServings(Number(e.target.value))}
                className={inputClass}
              />
            </div>
            <div className="flex-1">
              <label className={labelClass}>Prep time (min)</label>
              <input
                type="number"
                min="0"
                value={prepTime}
                onChange={(e) => setPrepTime(e.target.value)}
                placeholder="—"
                className={inputClass}
              />
            </div>
            <div className="flex-1">
              <label className={labelClass}>Cook time (min)</label>
              <input
                type="number"
                min="0"
                value={cookTime}
                onChange={(e) => setCookTime(e.target.value)}
                placeholder="—"
                className={inputClass}
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className={labelClass}>Tags</label>
            <div className="flex gap-2">
              <input
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addTag()
                  }
                }}
                placeholder="e.g. vegetarian"
                className={`${inputClass} flex-1`}
              />
              <button
                type="button"
                onClick={addTag}
                className="border border-gray-200 text-sm px-3 py-2 rounded-lg hover:bg-gray-50"
              >
                Add
              </button>
            </div>
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="flex items-center gap-1 text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full"
                  >
                    {t}
                    <button
                      type="button"
                      onClick={() => removeTag(t)}
                      className="text-gray-400 hover:text-gray-700 leading-none"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* Ingredients */}
        <section className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3">
          <h2 className="font-medium text-gray-900">Ingredients</h2>
          {ingredients.map((ing, idx) => (
            <div key={idx} className="flex gap-2 items-center">
              <input
                type="number"
                min="0"
                step="any"
                value={ing.quantity}
                onChange={(e) => setIngredient(idx, 'quantity', e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 w-20 focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="Qty"
              />
              <input
                list="units-list"
                value={ing.unit}
                onChange={(e) => setIngredient(idx, 'unit', e.target.value)}
                placeholder="Unit"
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm text-gray-500 w-24 focus:outline-none focus:ring-2 focus:ring-gray-900"
              />
              <datalist id="units-list">
                {COMMON_UNITS.map((u) => (
                  <option key={u} value={u} />
                ))}
              </datalist>
              <input
                value={ing.name}
                onChange={(e) => setIngredient(idx, 'name', e.target.value)}
                placeholder="Ingredient name"
                className={`${inputClass} flex-1`}
              />
              <button
                type="button"
                onClick={() => removeIngredient(idx)}
                className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addIngredient}
            className="text-sm text-gray-500 hover:text-gray-900 border border-dashed border-gray-300 rounded-lg py-2 hover:border-gray-400 transition-colors"
          >
            + Add ingredient
          </button>
        </section>

        {/* Steps */}
        <section className="bg-white border border-gray-200 rounded-xl p-5 flex flex-col gap-3">
          <h2 className="font-medium text-gray-900">Steps</h2>
          {steps.map((step, idx) => (
            <div key={idx} className="flex gap-3 items-start">
              <span className="shrink-0 w-6 h-6 rounded-full bg-gray-900 text-white text-xs flex items-center justify-center font-medium mt-2">
                {idx + 1}
              </span>
              <textarea
                value={step}
                onChange={(e) => setStep(idx, e.target.value)}
                placeholder={`Step ${idx + 1}...`}
                rows={2}
                className={`${inputClass} flex-1 resize-none`}
              />
              <button
                type="button"
                onClick={() => removeStep(idx)}
                className="text-gray-300 hover:text-red-400 transition-colors text-lg leading-none mt-2"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={addStep}
            className="text-sm text-gray-500 hover:text-gray-900 border border-dashed border-gray-300 rounded-lg py-2 hover:border-gray-400 transition-colors"
          >
            + Add step
          </button>
        </section>

        {/* Actions */}
        <div className="flex gap-3 pb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 border border-gray-200 text-gray-600 text-sm font-medium py-2.5 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={saving}
            className="flex-1 bg-gray-900 text-white text-sm font-medium py-2.5 rounded-lg hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : isEditing ? 'Save changes' : 'Create recipe'}
          </button>
        </div>
      </form>
    </div>
  )
}
