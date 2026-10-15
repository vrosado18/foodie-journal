import { Link } from 'react-router-dom'
import EmptyState from '@/components/ui/EmptyState'
import type { LogEntry } from '@/types'

export default function HallOfFameGrid({ logs }: { logs: LogEntry[] }) {
  if (logs.length === 0) {
    return <EmptyState title="No hail marys yet" message="Go log a meal worth bragging about!" />
  }

  return (
    <div className="grid grid-cols-3 gap-2">
      {logs.map((log) => (
        <Link
          key={log.id}
          to={`/log/${log.id}`}
          className="aspect-square overflow-hidden rounded-(--radius-md)"
        >
          <img src={log.photoUrl} alt={log.dishName} className="h-full w-full object-cover" />
        </Link>
      ))}
    </div>
  )
}
