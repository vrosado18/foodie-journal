import { create } from 'zustand'
import { draftService } from '@/services'
import { generateId } from '@/services/idGenerator'
import type { LogDraft } from '@/types'

const AUTOSAVE_DELAY_MS = 450
let autosaveTimer: ReturnType<typeof setTimeout> | undefined

interface DraftState {
  draft: LogDraft | null
  loadDraft: () => void
  updateDraft: (partial: Partial<LogDraft>) => void
  clearDraft: () => void
}

function emptyDraft(): LogDraft {
  return { id: generateId(), step: 0, tags: [], updatedAt: new Date().toISOString() }
}

export const useDraftStore = create<DraftState>((set, get) => ({
  draft: null,

  loadDraft: () => {
    set({ draft: draftService.getDraft() ?? emptyDraft() })
  },

  updateDraft: (partial) => {
    const current = get().draft ?? emptyDraft()
    const next: LogDraft = { ...current, ...partial }
    set({ draft: next })

    clearTimeout(autosaveTimer)
    autosaveTimer = setTimeout(() => draftService.saveDraft(next), AUTOSAVE_DELAY_MS)
  },

  clearDraft: () => {
    clearTimeout(autosaveTimer)
    draftService.clearDraft()
    set({ draft: null })
  },
}))
