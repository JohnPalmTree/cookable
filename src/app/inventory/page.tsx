import { createSupabaseServer } from '@/lib/supabaseServer'
import { Ingredient } from '@/types'
import InventoryClient from '@/components/inventory/InventoryClient'

export default async function InventoryPage() {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase
    .from('ingredients')
    .select('*')
    .order('category')
    .order('name')

  if (error) {
    return <p className="text-red-500">Failed to load inventory: {error.message}</p>
  }

  return <InventoryClient initialIngredients={data as Ingredient[]} />
}