import type { LogDraft } from '@/types'

/** Returns a user-facing message for the first missing required field, or null if the draft is complete. */
export function validateDraftForSubmit(draft: LogDraft | null): string | null {
  if (!draft?.photoUrl) return 'Add a photo of your meal.'
  if (!draft.spotName?.trim()) return "Add where you ate."
  if (!draft.dishName?.trim()) return 'Add what you ate.'
  if (draft.price == null || draft.price < 0) return 'Add the price you paid.'
  if (!draft.score) return 'Pick a Playbook score.'
  return null
}
