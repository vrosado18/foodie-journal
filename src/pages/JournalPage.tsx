import { useState } from 'react'
import ActiveFilterChips from '@/features/journal/components/ActiveFilterChips'
import FilterSheet from '@/features/journal/components/FilterSheet'
import JournalFeed from '@/features/journal/components/JournalFeed'
import SearchBar from '@/features/journal/components/SearchBar'
import { useJournalLogs } from '@/features/journal/hooks/useJournalLogs'

export default function JournalPage() {
  const { logs, loading, error, filters, fetchLogs, setSearchTerm, setFilters } = useJournalLogs()
  const [filterSheetOpen, setFilterSheetOpen] = useState(false)
  const [filterSheetKey, setFilterSheetKey] = useState(0)

  const hasActiveFilters = Object.values(filters).some((value) =>
    Array.isArray(value) ? value.length > 0 : value != null,
  )

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Journal</h1>

      <div className="flex gap-2">
        <div className="flex-1">
          <SearchBar onSearch={setSearchTerm} />
        </div>
        <button
          type="button"
          onClick={() => {
            setFilterSheetKey((key) => key + 1)
            setFilterSheetOpen(true)
          }}
          className="flex h-11 items-center gap-1.5 rounded-(--radius-md) border border-slate-200 px-3 text-sm font-medium text-(--color-ink)"
        >
          Filters
          {hasActiveFilters && (
            <span className="h-2 w-2 rounded-full bg-(--color-primary)" aria-label="Active" />
          )}
        </button>
      </div>

      <ActiveFilterChips filters={filters} onChange={setFilters} />

      <JournalFeed
        logs={logs}
        loading={loading}
        error={error}
        hasActiveFilters={hasActiveFilters}
        onRetry={fetchLogs}
      />

      <FilterSheet
        key={filterSheetKey}
        open={filterSheetOpen}
        onClose={() => setFilterSheetOpen(false)}
        filters={filters}
        onApply={setFilters}
      />
    </div>
  )
}
