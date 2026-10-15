import { useEffect, useMemo, useState } from 'react'
import { logService } from '@/services'
import type { LogEntry } from '@/types'

export function useProfileStats() {
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    logService
      .listLogs()
      .then(setLogs)
      .catch(() => setError("Couldn't load your stats."))
      .finally(() => setLoading(false))
  }, [])

  return useMemo(() => {
    const spotCount = new Set(logs.map((log) => log.spotId)).size
    const hallOfFame = logs.filter((log) => log.score === 'hail-mary-touchdown')
    return { logCount: logs.length, spotCount, hallOfFame, loading, error }
  }, [logs, loading, error])
}
