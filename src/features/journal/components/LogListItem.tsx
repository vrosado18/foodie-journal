import { Link } from 'react-router-dom'
import Badge from '@/components/ui/Badge'
import type { LogEntry } from '@/types'
import { formatDate } from '@/utils/formatters'

export default function LogListItem({ log }: { log: LogEntry }) {
  return (
    <Link
      to={`/log/${log.id}`}
      className="flex items-center gap-3 rounded-(--radius-md) p-2 transition-colors hover:bg-slate-100"
    >
      <div className="min-w-0 flex-1">
        <p className="truncate font-semibold text-(--color-ink)">{log.dishName}</p>
        <p className="truncate text-sm text-(--color-ink-muted)">{log.spotName}</p>
        <p className="text-xs text-(--color-ink-muted)">{formatDate(log.createdAt)}</p>
      </div>
      <Badge score={log.score} />
    </Link>
  )
}
