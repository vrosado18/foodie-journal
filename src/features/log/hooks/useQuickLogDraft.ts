import { useEffect } from 'react'
import { useDraftStore } from '@/store'

export function useQuickLogDraft() {
  const draft = useDraftStore((state) => state.draft)
  const loadDraft = useDraftStore((state) => state.loadDraft)
  const updateDraft = useDraftStore((state) => state.updateDraft)
  const clearDraft = useDraftStore((state) => state.clearDraft)

  useEffect(() => {
    loadDraft()
  }, [loadDraft])

  return { draft, updateDraft, clearDraft }
}
