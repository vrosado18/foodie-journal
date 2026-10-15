import type { LogEntry, LogFilters, Score } from '@/types'
import { uploadLogPhoto } from './photoUpload'
import { supabase } from './supabaseClient'

interface LogRow {
  id: string
  user_id: string
  spot_id: string
  spot_name: string
  dish_name: string
  price: number
  score: Score
  note: string | null
  tags: string[]
  photo_url: string
  created_at: string
  updated_at: string
}

function toLogEntry(row: LogRow): LogEntry {
  return {
    id: row.id,
    userId: row.user_id,
    spotId: row.spot_id,
    spotName: row.spot_name,
    dishName: row.dish_name,
    price: Number(row.price),
    score: row.score,
    note: row.note ?? undefined,
    tags: row.tags ?? [],
    photoUrl: row.photo_url,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

/** A freshly compressed photo from Quick Log/edit is a data: URL; anything else is already a real URL. */
async function resolvePhotoUrl(userId: string, photoUrl: string): Promise<string> {
  return photoUrl.startsWith('data:') ? uploadLogPhoto(userId, photoUrl) : photoUrl
}

export async function listLogs(): Promise<LogEntry[]> {
  const { data, error } = await supabase.from('logs').select('*').order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data as LogRow[]).map(toLogEntry)
}

export async function getLogById(id: string): Promise<LogEntry | null> {
  const { data, error } = await supabase.from('logs').select('*').eq('id', id).maybeSingle()
  if (error) throw new Error(error.message)
  return data ? toLogEntry(data as LogRow) : null
}

export type CreateLogInput = Omit<LogEntry, 'id' | 'createdAt' | 'updatedAt'>

export async function createLog(input: CreateLogInput): Promise<LogEntry> {
  const photoUrl = await resolvePhotoUrl(input.userId, input.photoUrl)

  const { data, error } = await supabase
    .from('logs')
    .insert({
      user_id: input.userId,
      spot_id: input.spotId,
      spot_name: input.spotName,
      dish_name: input.dishName,
      price: input.price,
      score: input.score,
      note: input.note ?? null,
      tags: input.tags,
      photo_url: photoUrl,
    })
    .select()
    .single()
  if (error) throw new Error(error.message)
  return toLogEntry(data as LogRow)
}

export type UpdateLogInput = Partial<Omit<LogEntry, 'id' | 'userId' | 'createdAt' | 'updatedAt'>>

export async function updateLog(id: string, input: UpdateLogInput): Promise<LogEntry> {
  const payload: Record<string, unknown> = {}
  if (input.spotId !== undefined) payload.spot_id = input.spotId
  if (input.spotName !== undefined) payload.spot_name = input.spotName
  if (input.dishName !== undefined) payload.dish_name = input.dishName
  if (input.price !== undefined) payload.price = input.price
  if (input.score !== undefined) payload.score = input.score
  if (input.note !== undefined) payload.note = input.note ?? null
  if (input.tags !== undefined) payload.tags = input.tags
  if (input.photoUrl !== undefined) {
    const { data: existing, error: fetchError } = await supabase
      .from('logs')
      .select('user_id')
      .eq('id', id)
      .single()
    if (fetchError) throw new Error(fetchError.message)
    payload.photo_url = await resolvePhotoUrl((existing as { user_id: string }).user_id, input.photoUrl)
  }

  const { data, error } = await supabase.from('logs').update(payload).eq('id', id).select().single()
  if (error) throw new Error(error.message)
  return toLogEntry(data as LogRow)
}

export async function deleteLog(id: string): Promise<void> {
  const { error } = await supabase.from('logs').delete().eq('id', id)
  if (error) throw new Error(error.message)
}

/**
 * Filters live here (not in the UI layer) so this is a direct 1:1 with the
 * query sent to Postgres — no translation layer for a future caller to learn.
 */
export async function searchLogs(searchTerm = '', filters: LogFilters = {}): Promise<LogEntry[]> {
  let query = supabase.from('logs').select('*')

  const term = searchTerm.trim()
  if (term) {
    query = query.or(`dish_name.ilike.%${term}%,spot_name.ilike.%${term}%`)
  }
  if (filters.score) query = query.eq('score', filters.score)
  if (filters.minPrice != null) query = query.gte('price', filters.minPrice)
  if (filters.maxPrice != null) query = query.lte('price', filters.maxPrice)
  if (filters.startDate) query = query.gte('created_at', filters.startDate)
  if (filters.endDate) query = query.lte('created_at', filters.endDate)
  if (filters.tags?.length) query = query.contains('tags', filters.tags)

  const { data, error } = await query.order('created_at', { ascending: false })
  if (error) throw new Error(error.message)
  return (data as LogRow[]).map(toLogEntry)
}

export async function listAllTags(): Promise<string[]> {
  const { data, error } = await supabase.from('logs').select('tags')
  if (error) throw new Error(error.message)
  const tags = new Set<string>()
  for (const row of data as { tags: string[] }[]) {
    for (const tag of row.tags ?? []) tags.add(tag)
  }
  return [...tags].sort()
}
