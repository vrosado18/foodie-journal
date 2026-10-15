import { Link } from 'react-router-dom'
import EmptyState from '@/components/ui/EmptyState'

export default function JournalEmptyState({ hasActiveFilters }: { hasActiveFilters: boolean }) {
  if (hasActiveFilters) {
    return (
      <EmptyState
        title="Nothing matches"
        message="Try clearing a filter or searching something else."
      />
    )
  }

  return (
    <EmptyState
      title="Log your first bite!"
      message="Snap a photo of your next meal and rate it before you forget."
      action={
        <Link
          to="/log/new"
          className="inline-flex min-h-11 items-center justify-center rounded-(--radius-md) bg-(--color-primary) px-4 text-sm font-semibold text-white hover:bg-(--color-primary-dark)"
        >
          Add a Log
        </Link>
      }
    />
  )
}
