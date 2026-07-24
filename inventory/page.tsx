import { supabase } from '@/src/lib/supabase'
import { Ingredient } from '@/src/types'
import InventoryClient from '@/src/components/inventory/InventoryClient'

export default async function InventoryPage() {
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