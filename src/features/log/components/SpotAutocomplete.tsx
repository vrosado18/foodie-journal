import { useEffect, useState } from 'react'
import { spotService } from '@/services'
import type { Spot } from '@/types'
import { useDebouncedValue } from '@/utils/useDebouncedValue'

interface SpotAutocompleteProps {
  value: string
  onChange: (name: string) => void
  onSelectSpot: (spot: Spot) => void
}

export default function SpotAutocomplete({ value, onChange, onSelectSpot }: SpotAutocompleteProps) {
  const [recentSpots, setRecentSpots] = useState<Spot[]>([])
  const [suggestions, setSuggestions] = useState<Spot[]>([])
  const [justSelected, setJustSelected] = useState(false)
  const debouncedValue = useDebouncedValue(value, 200)

  useEffect(() => {
    void spotService.listSpots().then((spots) => setRecentSpots(spots.slice(0, 4)))
  }, [])

  useEffect(() => {
    if (!debouncedValue.trim()) return
    void spotService.searchSpots(debouncedValue).then(setSuggestions)
  }, [debouncedValue])

  function handleSelect(spot: Spot) {
    setJustSelected(true)
    onSelectSpot(spot)
  }

  function handleInputChange(name: string) {
    setJustSelected(false)
    onChange(name)
  }

  const showRecents = !value.trim()
  const visibleSuggestions =
    showRecents || justSelected
      ? []
      : suggestions.filter((spot) => spot.name.toLowerCase() !== value.trim().toLowerCase())

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="spot-name" className="text-sm font-medium text-(--color-ink)">
        Where'd you eat?
      </label>
      <input
        id="spot-name"
        type="text"
        placeholder="Type a spot name…"
        value={value}
        onChange={(event) => handleInputChange(event.target.value)}
        className="h-11 rounded-(--radius-md) border border-slate-200 px-3 text-base outline-none focus-visible:border-(--color-primary)"
      />

      {showRecents && recentSpots.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {recentSpots.map((spot) => (
            <button
              key={spot.id}
              type="button"
              onClick={() => handleSelect(spot)}
              className="h-9 rounded-full border border-slate-200 px-3 text-sm font-medium text-(--color-ink-muted) hover:bg-slate-50"
            >
              {spot.name}
            </button>
          ))}
        </div>
      )}

      {visibleSuggestions.length > 0 && (
        <ul className="overflow-hidden rounded-(--radius-md) border border-slate-200">
          {visibleSuggestions.map((spot) => (
            <li key={spot.id}>
              <button
                type="button"
                onClick={() => handleSelect(spot)}
                className="flex min-h-11 w-full items-center px-3 text-left text-sm hover:bg-slate-50"
              >
                {spot.name}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
