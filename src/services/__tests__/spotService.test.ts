import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { createFakeSupabase } from '@/test/fakeSupabase'

vi.mock('@/services/supabaseClient', async () => {
  const { createFakeSupabase } = await import('@/test/fakeSupabase')
  return { supabase: createFakeSupabase() }
})

const { supabase } = await import('../supabaseClient')
const fakeSupabase = supabase as unknown as ReturnType<typeof createFakeSupabase>
const spotService = await import('../spotService')

describe('spotService', () => {
  beforeEach(() => {
    fakeSupabase.reset()
  })

  it('finds spots by case-insensitive partial name', async () => {
    await spotService.createSpot("Lou Malnati's Pizzeria")
    await spotService.createSpot('Big Star')

    const results = await spotService.searchSpots('piz')
    expect(results).toHaveLength(1)
    expect(results[0].name).toBe("Lou Malnati's Pizzeria")
  })

  it('returns no results for an empty query', async () => {
    await spotService.createSpot('Big Star')
    expect(await spotService.searchSpots('')).toHaveLength(0)
  })

  it('dedupes spots by case-insensitive trimmed name', async () => {
    const first = await spotService.createSpot('Big Star')
    const second = await spotService.createSpot('  big star  ')

    expect(second.id).toBe(first.id)
    expect(await spotService.listSpots()).toHaveLength(1)
  })
})
