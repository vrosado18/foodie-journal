import type { Spot } from '@/types'
import { supabase } from './supabaseClient'

interface SpotRow {
  id: string
  name: string
  neighborhood: string | null
  created_at: string
}

function toSpot(row: SpotRow): Spot {
  return {
    id: row.id,
    name: row.name,
    neighborhood: row.neighborhood ?? undefined,
    createdAt: row.created_at,
  }
}

export async function listSpots(): Promise<Spot[]> {
  const { data, error } = await supabase.from('spots').select('*').order('name')
  if (error) throw new Error(error.message)
  return (data as SpotRow[]).map(toSpot)
}

export async function searchSpots(query: string): Promise<Spot[]> {
  const term = query.trim()
  if (!term) return []
  const { data, error } = await supabase.from('spots').select('*').ilike('name', `%${term}%`).order('name')
  if (error) throw new Error(error.message)
  return (data as SpotRow[]).map(toSpot)
}

export async function getSpotById(id: string): Promise<Spot | null> {
  const { data, error } = await supabase.from('spots').select('*').eq('id', id).maybeSingle()
  if (error) throw new Error(error.message)
  return data ? toSpot(data as SpotRow) : null
}

/** Dedupes by case-insensitive trimmed name so the autocomplete list doesn't fill with near-duplicates. */
export async function createSpot(name: string): Promise<Spot> {
  const trimmed = name.trim()

  const { data: existing, error: lookupError } = await supabase
    .from('spots')
    .select('*')
    .ilike('name', trimmed)
    .maybeSingle()
  if (lookupError) throw new Error(lookupError.message)
  if (existing) return toSpot(existing as SpotRow)

  const { data: created, error: insertError } = await supabase
    .from('spots')
    .insert({ name: trimmed })
    .select()
    .single()
  if (insertError) throw new Error(insertError.message)
  return toSpot(created as SpotRow)
}
