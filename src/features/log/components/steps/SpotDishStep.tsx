import Button from '@/components/ui/Button'
import type { Spot } from '@/types'
import SpotAutocomplete from '../SpotAutocomplete'

interface SpotDishStepProps {
  spotName?: string
  dishName?: string
  onSpotNameChange: (name: string) => void
  onSelectSpot: (spot: Spot) => void
  onDishNameChange: (name: string) => void
  onNext: () => void
}

export default function SpotDishStep({
  spotName,
  dishName,
  onSpotNameChange,
  onSelectSpot,
  onDishNameChange,
  onNext,
}: SpotDishStepProps) {
  return (
    <div className="flex flex-col gap-5 py-4">
      <h2 className="text-xl font-bold">Where &amp; what?</h2>

      <SpotAutocomplete value={spotName ?? ''} onChange={onSpotNameChange} onSelectSpot={onSelectSpot} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="dish-name" className="text-sm font-medium text-(--color-ink)">
          What'd you eat?
        </label>
        <input
          id="dish-name"
          type="text"
          placeholder="Dish name…"
          value={dishName ?? ''}
          onChange={(event) => onDishNameChange(event.target.value)}
          className="h-11 rounded-(--radius-md) border border-slate-200 px-3 text-base outline-none focus-visible:border-(--color-primary)"
        />
      </div>

      <Button onClick={onNext} className="w-full">
        Next
      </Button>
    </div>
  )
}
