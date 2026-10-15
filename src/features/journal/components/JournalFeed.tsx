import ErrorState from '@/components/ui/ErrorState'
import type { LogEntry } from '@/types'
import JournalEmptyState from './JournalEmptyState'
import LogListItem from './LogListItem'

interface JournalFeedProps {
  logs: LogEntry[]
  loading: boolean
  error: string | null
  hasActiveFilters: boolean
  onRetry: () => void
}

function SkeletonItem() {
  return (
    <div className="flex items-center gap-3 p-2">
      <div className="h-16 w-16 flex-shrink-0 animate-pulse rounded-(--radius-md) bg-slate-200" />
      <div className="flex-1 space-y-2">
        <div className="h-4 w-2/3 animate-pulse rounded bg-slate-200" />
        <div className="h-3 w-1/2 animate-pulse rounded bg-slate-200" />
      </div>
    </div>
  )
}

export default function JournalFeed({ logs, loading, error, hasActiveFilters, onRetry }: JournalFeedProps) {
  if (loading && logs.length === 0) {
    return (
      <div className="flex flex-col gap-1" aria-busy="true" aria-label="Loading your journal">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonItem key={i} />
        ))}
      </div>
    )
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />
  }

  if (logs.length === 0) {
    return <JournalEmptyState hasActiveFilters={hasActiveFilters} />
  }

  return (
    <ul className="flex flex-col gap-1">
      {logs.map((log) => (
        <li key={log.id}>
          <LogListItem log={log} />
        </li>
      ))}
    </ul>
  )
}
