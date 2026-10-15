import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { createFakeSupabase } from '@/test/fakeSupabase'

vi.mock('@/services/supabaseClient', async () => {
  const { createFakeSupabase } = await import('@/test/fakeSupabase')
  return { supabase: createFakeSupabase() }
})

const { supabase } = await import('../supabaseClient')
const fakeSupabase = supabase as unknown as ReturnType<typeof createFakeSupabase>
const logService = await import('../logService')

const BASE_INPUT = {
  userId: 'user-1',
  spotId: 'spot-1',
  spotName: 'Test Spot',
  dishName: 'Test Dish',
  price: 10,
  score: 'touchdown' as const,
  tags: [],
  photoUrl: '/seed-photos/burger.svg',
}

describe('logService', () => {
  beforeEach(() => {
    fakeSupabase.reset()
  })

  it('creates a log retrievable via listLogs and getLogById', async () => {
    const created = await logService.createLog(BASE_INPUT)

    const all = await logService.listLogs()
    expect(all).toHaveLength(1)

    const fetched = await logService.getLogById(created.id)
    expect(fetched?.dishName).toBe('Test Dish')
  })

  it('updates only the targeted log', async () => {
    const first = await logService.createLog(BASE_INPUT)
    const second = await logService.createLog({ ...BASE_INPUT, dishName: 'Other Dish' })

    const updated = await logService.updateLog(first.id, { dishName: 'Updated Dish' })
    expect(updated.dishName).toBe('Updated Dish')

    const untouched = await logService.getLogById(second.id)
    expect(untouched?.dishName).toBe('Other Dish')
  })

  it('removes a log on delete', async () => {
    const log = await logService.createLog(BASE_INPUT)
    await logService.deleteLog(log.id)

    expect(await logService.getLogById(log.id)).toBeNull()
    expect(await logService.listLogs()).toHaveLength(0)
  })

  it('searches by partial, case-insensitive dish and spot name', async () => {
    await logService.createLog({ ...BASE_INPUT, dishName: 'Deep Dish Pizza', spotName: "Lou's" })
    await logService.createLog({ ...BASE_INPUT, dishName: 'Tacos', spotName: 'Big Star' })

    const byDish = await logService.searchLogs('pizza')
    expect(byDish).toHaveLength(1)
    expect(byDish[0].dishName).toBe('Deep Dish Pizza')

    const bySpot = await logService.searchLogs('big star')
    expect(bySpot).toHaveLength(1)
    expect(bySpot[0].spotName).toBe('Big Star')

    expect(await logService.searchLogs('nonexistent')).toHaveLength(0)
  })

  it('combines score and price filters', async () => {
    await logService.createLog({ ...BASE_INPUT, score: 'touchdown', price: 10 })
    await logService.createLog({ ...BASE_INPUT, score: 'touchdown', price: 50 })
    await logService.createLog({ ...BASE_INPUT, score: 'fumble', price: 10 })

    const results = await logService.searchLogs('', { score: 'touchdown', maxPrice: 20 })
    expect(results).toHaveLength(1)
    expect(results[0].price).toBe(10)
    expect(results[0].score).toBe('touchdown')
  })

  it('uploads a freshly compressed photo (data URL) and stores the resulting Storage URL', async () => {
    const log = await logService.createLog({
      ...BASE_INPUT,
      photoUrl: 'data:image/jpeg;base64,abc123',
    })

    expect(log.photoUrl).toMatch(/^https:\/\/fake\.supabase\.co\/storage/)
    expect(fakeSupabase._uploads).toHaveLength(1)
  })
})
