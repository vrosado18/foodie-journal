import type { Score } from '@/types'
import ScoreSelector from '../ScoreSelector'

interface PriceScoreStepProps {
  price?: number
  score?: Score
  onPriceChange: (price: number) => void
  onScoreSelect: (score: Score) => void
}

export default function PriceScoreStep({ price, score, onPriceChange, onScoreSelect }: PriceScoreStepProps) {
  return (
    <div className="flex flex-col gap-5 py-4">
      <h2 className="text-xl font-bold">Price &amp; score</h2>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="price" className="text-sm font-medium text-(--color-ink)">
          What'd you pay?
        </label>
        <div className="relative">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-(--color-ink-muted)">
            $
          </span>
          <input
            id="price"
            type="number"
            inputMode="decimal"
            min={0}
            step="0.01"
            placeholder="0.00"
            value={price ?? ''}
            onChange={(event) => onPriceChange(Number(event.target.value))}
            className="h-11 w-full rounded-(--radius-md) border border-slate-200 pl-7 pr-3 text-base outline-none focus-visible:border-(--color-primary)"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-(--color-ink)">Playbook score</span>
        <p className="text-xs text-(--color-ink-muted)">Tap one to continue</p>
        <ScoreSelector value={score} onChange={onScoreSelect} />
      </div>
    </div>
  )
}
