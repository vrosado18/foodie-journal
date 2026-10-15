import { beforeEach, describe, expect, it } from 'vitest'
import type { LogDraft } from '@/types'
import * as draftService from '../draftService'

const DRAFT: LogDraft = {
  id: 'draft-1',
  step: 1,
  spotName: 'Big Star',
  dishName: 'Tacos',
  photoUrl: 'data:image/jpeg;base64,abc',
  updatedAt: new Date().toISOString(),
}

describe('draftService', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('returns null when no draft exists', () => {
    expect(draftService.getDraft()).toBeNull()
  })

  it('round-trips a draft, including partial fields and photo data', () => {
    draftService.saveDraft(DRAFT)

    const loaded = draftService.getDraft()
    expect(loaded?.spotName).toBe('Big Star')
    expect(loaded?.dishName).toBe('Tacos')
    expect(loaded?.photoUrl).toBe(DRAFT.photoUrl)
    expect(loaded?.score).toBeUndefined()
  })

  it('clears the draft', () => {
    draftService.saveDraft(DRAFT)
    draftService.clearDraft()
    expect(draftService.getDraft()).toBeNull()
  })
})
