import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logService, spotService } from '@/services'
import { useAuthStore, useJournalStore } from '@/store'
import type { LogDraft, LogEntry } from '@/types'
import { validateDraftForSubmit } from '@/utils/validation'

export function useLogForm() {
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const addLog = useJournalStore((state) => state.addLog)
  const updateLogInStore = useJournalStore((state) => state.updateLogInStore)
  const userId = useAuthStore((state) => state.user?.id)

  /** Returns true on success so the caller knows it's safe to clear the draft. */
  async function createFromDraft(draft: LogDraft): Promise<boolean> {
    const validationError = validateDraftForSubmit(draft)
    if (validationError) {
      setError(validationError)
      return false
    }
    if (!userId) {
      setError('You need to be signed in to save a log.')
      return false
    }

    setSubmitting(true)
    setError(null)
    try {
      const spot = draft.spotId
        ? { id: draft.spotId, name: draft.spotName! }
        : await spotService.createSpot(draft.spotName!)

      const log = await logService.createLog({
        userId,
        spotId: spot.id,
        spotName: spot.name,
        dishName: draft.dishName!,
        price: draft.price!,
        score: draft.score!,
        note: draft.note?.trim() || undefined,
        tags: draft.tags ?? [],
        photoUrl: draft.photoUrl!,
      })
      addLog(log)
      navigate(`/log/${log.id}`, { replace: true })
      return true
    } catch {
      setError("Couldn't save your log. Please try again.")
      return false
    } finally {
      setSubmitting(false)
    }
  }

  async function updateExisting(id: string, input: Partial<LogEntry>) {
    setSubmitting(true)
    setError(null)
    try {
      let spotId = input.spotId
      let spotName = input.spotName
      if (spotName && !spotId) {
        const spot = await spotService.createSpot(spotName)
        spotId = spot.id
        spotName = spot.name
      }
      const log = await logService.updateLog(id, { ...input, spotId, spotName })
      updateLogInStore(log)
      navigate(`/log/${id}`, { replace: true })
    } catch {
      setError("Couldn't save your changes. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return { createFromDraft, updateExisting, submitting, error }
}
