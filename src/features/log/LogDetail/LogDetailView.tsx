import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { logService } from '@/services'
import { useJournalStore } from '@/store'
import type { LogEntry } from '@/types'
import { formatDate, formatPrice } from '@/utils/formatters'
import DeleteLogConfirm from './DeleteLogConfirm'

export default function LogDetailView({ log }: { log: LogEntry }) {
  const navigate = useNavigate()
  const removeLog = useJournalStore((state) => state.removeLog)
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [deleting, setDeleting] = useState(false)

  async function handleDelete() {
    setDeleting(true)
    try {
      await logService.deleteLog(log.id)
      removeLog(log.id)
      navigate('/', { replace: true })
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <img
        src={log.photoUrl}
        alt={log.dishName}
        className="aspect-square w-full rounded-(--radius-lg) object-cover"
      />

      <div className="flex items-start justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold">{log.dishName}</h1>
          <p className="text-(--color-ink-muted)">{log.spotName}</p>
        </div>
        <Badge score={log.score} />
      </div>

      <div className="flex items-center gap-4 text-sm text-(--color-ink-muted)">
        <span className="text-lg font-semibold text-(--color-ink)">{formatPrice(log.price)}</span>
        <span>{formatDate(log.createdAt)}</span>
      </div>

      {log.note && <p className="text-(--color-ink)">{log.note}</p>}

      {log.tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {log.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-(--color-ink-muted)"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      <div className="flex gap-2 pt-2">
        <Link
          to={`/log/${log.id}/edit`}
          className="flex h-11 flex-1 items-center justify-center rounded-(--radius-md) border border-slate-200 text-sm font-semibold text-(--color-ink)"
        >
          Edit
        </Link>
        <Link
          to={`/log/${log.id}/share`}
          className="flex h-11 flex-1 items-center justify-center rounded-(--radius-md) bg-(--color-primary) text-sm font-semibold text-white"
        >
          Share
        </Link>
        <Button variant="danger" onClick={() => setConfirmOpen(true)} disabled={deleting}>
          Delete
        </Button>
      </div>

      <DeleteLogConfirm
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={handleDelete}
      />
    </div>
  )
}
