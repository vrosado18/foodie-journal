import { useEffect, useState } from 'react'
import Button from '@/components/ui/Button'
import Chip from '@/components/ui/Chip'
import Modal from '@/components/ui/Modal'
import { logService } from '@/services'
import { SCORE_META, SCORE_ORDER, type LogFilters } from '@/types'

interface FilterSheetProps {
  open: boolean
  onClose: () => void
  filters: LogFilters
  onApply: (filters: LogFilters) => void
}

export default function FilterSheet({ open, onClose, filters, onApply }: FilterSheetProps) {
  // Initialized once per mount; the parent remounts this component (via `key`)
  // each time the sheet opens, so this always starts from the current filters.
  const [draft, setDraft] = useState<LogFilters>(filters)
  const [allTags, setAllTags] = useState<string[]>([])

  useEffect(() => {
    if (open) void logService.listAllTags().then(setAllTags)
  }, [open])

  function toggleTag(tag: string) {
    const current = draft.tags ?? []
    const next = current.includes(tag) ? current.filter((t) => t !== tag) : [...current, tag]
    setDraft({ ...draft, tags: next.length ? next : undefined })
  }

  return (
    <Modal open={open} onClose={onClose} title="Filter logs">
      <div className="flex flex-col gap-5">
        <fieldset>
          <legend className="mb-2 text-sm font-medium text-(--color-ink)">Score</legend>
          <div className="flex flex-wrap gap-2">
            <Chip
              selected={!draft.score}
              onClick={() => setDraft({ ...draft, score: undefined })}
            >
              All
            </Chip>
            {SCORE_ORDER.map((score) => (
              <Chip
                key={score}
                selected={draft.score === score}
                onClick={() => setDraft({ ...draft, score })}
              >
                {SCORE_META[score].label}
              </Chip>
            ))}
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-medium text-(--color-ink)">Price range</legend>
          <div className="flex items-center gap-2">
            <input
              type="number"
              inputMode="decimal"
              placeholder="Min"
              min={0}
              value={draft.minPrice ?? ''}
              onChange={(e) =>
                setDraft({ ...draft, minPrice: e.target.value ? Number(e.target.value) : undefined })
              }
              className="h-11 w-full rounded-(--radius-md) border border-slate-200 px-3"
            />
            <span className="text-(--color-ink-muted)">–</span>
            <input
              type="number"
              inputMode="decimal"
              placeholder="Max"
              min={0}
              value={draft.maxPrice ?? ''}
              onChange={(e) =>
                setDraft({ ...draft, maxPrice: e.target.value ? Number(e.target.value) : undefined })
              }
              className="h-11 w-full rounded-(--radius-md) border border-slate-200 px-3"
            />
          </div>
        </fieldset>

        <fieldset>
          <legend className="mb-2 text-sm font-medium text-(--color-ink)">Date range</legend>
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={draft.startDate?.slice(0, 10) ?? ''}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  startDate: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                })
              }
              className="h-11 w-full rounded-(--radius-md) border border-slate-200 px-3"
            />
            <span className="text-(--color-ink-muted)">–</span>
            <input
              type="date"
              value={draft.endDate?.slice(0, 10) ?? ''}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  endDate: e.target.value ? new Date(e.target.value).toISOString() : undefined,
                })
              }
              className="h-11 w-full rounded-(--radius-md) border border-slate-200 px-3"
            />
          </div>
        </fieldset>

        {allTags.length > 0 && (
          <fieldset>
            <legend className="mb-2 text-sm font-medium text-(--color-ink)">Tags</legend>
            <div className="flex flex-wrap gap-2">
              {allTags.map((tag) => (
                <Chip key={tag} selected={draft.tags?.includes(tag)} onClick={() => toggleTag(tag)}>
                  {tag}
                </Chip>
              ))}
            </div>
          </fieldset>
        )}

        <div className="flex gap-2 pt-2">
          <Button variant="secondary" className="flex-1" onClick={() => setDraft({})}>
            Clear all
          </Button>
          <Button
            className="flex-1"
            onClick={() => {
              onApply(draft)
              onClose()
            }}
          >
            Apply
          </Button>
        </div>
      </div>
    </Modal>
  )
}
