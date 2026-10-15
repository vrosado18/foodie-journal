import { useEffect } from 'react'
import { useJournalStore } from '@/store'

export function useJournalLogs() {
  const logs = useJournalStore((state) => state.logs)
  const loading = useJournalStore((state) => state.loading)
  const error = useJournalStore((state) => state.error)
  const searchTerm = useJournalStore((state) => state.searchTerm)
  const filters = useJournalStore((state) => state.filters)
  const fetchLogs = useJournalStore((state) => state.fetchLogs)
  const setSearchTerm = useJournalStore((state) => state.setSearchTerm)
  const setFilters = useJournalStore((state) => state.setFilters)

  // Only fetch once on mount — searchTerm/filters changes trigger their own re-fetch via the setters.
  // fetchLogs is a stable store action reference, so including it here never re-triggers this effect.
  useEffect(() => {
    void fetchLogs()
  }, [fetchLogs])

  return { logs, loading, error, searchTerm, filters, fetchLogs, setSearchTerm, setFilters }
}
