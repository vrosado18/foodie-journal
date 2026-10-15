import type { LogDraft } from '@/types'
import { STORAGE_KEYS, readJSON, removeKey, writeJSON } from './storage'

/** No artificial delay here — draft autosave must feel instant, not API-shaped. */

export function getDraft(): LogDraft | null {
  return readJSON<LogDraft | null>(STORAGE_KEYS.draft, null)
}

export function saveDraft(draft: LogDraft): void {
  writeJSON(STORAGE_KEYS.draft, { ...draft, updatedAt: new Date().toISOString() })
}

export function clearDraft(): void {
  removeKey(STORAGE_KEYS.draft)
}
