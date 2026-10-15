import Chip from '@/components/ui/Chip'
import { SCORE_META, type LogFilters } from '@/types'
import { formatPrice } from '@/utils/formatters'

interface ActiveFilterChipsProps {
  filters: LogFilters
  onChange: (filters: LogFilters) => void
}

export default function ActiveFilterChips({ filters, onChange }: ActiveFilterChipsProps) {
  const chips: { key: string; label: string; clear: () => void }[] = []

  if (filters.score) {
    chips.push({
      key: 'score',
      label: SCORE_META[filters.score].label,
      clear: () => onChange({ ...filters, score: undefined }),
    })
  }
  if (filters.minPrice != null || filters.maxPrice != null) {
    const min = filters.minPrice != null ? formatPrice(filters.minPrice) : 'Any'
    const max = filters.maxPrice != null ? formatPrice(filters.maxPrice) : 'Any'
    chips.push({
      key: 'price',
      label: `${min} – ${max}`,
      clear: () => onChange({ ...filters, minPrice: undefined, maxPrice: undefined }),
    })
  }
  if (filters.startDate || filters.endDate) {
    chips.push({
      key: 'date',
      label: 'Date range',
      clear: () => onChange({ ...filters, startDate: undefined, endDate: undefined }),
    })
  }
  for (const tag of filters.tags ?? []) {
    chips.push({
      key: `tag-${tag}`,
      label: tag,
      clear: () => onChange({ ...filters, tags: filters.tags?.filter((t) => t !== tag) }),
    })
  }

  if (chips.length === 0) return null

  return (
    <div className="flex flex-wrap gap-2">
      {chips.map((chip) => (
        <Chip key={chip.key} selected onClick={chip.clear}>
          {chip.label} ✕
        </Chip>
      ))}
      <Chip onClick={() => onChange({})}>Clear all</Chip>
    </div>
  )
}
