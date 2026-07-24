export type IngredientCategory =
  | 'produce' | 'dairy' | 'meat' | 'seafood'
  | 'grains' | 'canned' | 'frozen' | 'condiments'
  | 'spices' | 'other'

export interface Ingredient {
  id: string
  name: string
  quantity: number
  unit: string
  category: IngredientCategory
  expiry_date: string | null
  notes: string | null
  created_at: string
  updated_at: string
}

export interface Recipe {
  id: string
  title: string
  description: string | null
  servings: number
  prep_time_mins: number | null
  cook_time_mins: number | null
  tags: string[]
  steps: string[]
  image_url: string | null
  created_at: string
  updated_at: string
}

export interface RecipeIngredient {
  id: string
  recipe_id: string
  name: string
  quantity: number
  unit: string
}
