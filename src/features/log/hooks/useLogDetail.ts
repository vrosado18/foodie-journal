import { useEffect, useState } from 'react'
import { logService } from '@/services'
import { useJournalStore } from '@/store'
import type { LogEntry } from '@/types'

export function useLogDetail(id: string) {
  const storeLog = useJournalStore((state) => state.logs.find((log) => log.id === id))
  const [fetchedLog, setFetchedLog] = useState<LogEntry | null>(null)
  const [loading, setLoading] = useState(!storeLog)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (storeLog) return
    let cancelled = false
    setLoading(true)
    logService
      .getLogById(id)
      .then((log) => {
        if (!cancelled) setFetchedLog(log)
      })
      .catch(() => {
        if (!cancelled) setError("Couldn't load this log.")
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [id, storeLog])

  return { log: storeLog ?? fetchedLog, loading: storeLog ? false : loading, error }
}
