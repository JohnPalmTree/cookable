import { supabase } from './supabase'
import { Ingredient } from '@/src/types'

export async function getInventory(): Promise<Ingredient[]> {
  const { data, error } = await supabase
    .from('ingredients')
    .select('*')
    .order('name')

  if (error) return []
  return data as Ingredient[]
}