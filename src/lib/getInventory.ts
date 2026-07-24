import { createSupabaseServer } from './supabaseServer'
import { Ingredient } from '@/src/types'

export async function getInventory(): Promise<Ingredient[]> {
  const supabase = await createSupabaseServer()
  const { data, error } = await supabase
    .from('ingredients')
    .select('*')
    .order('name')

  if (error) return []
  return data as Ingredient[]
}