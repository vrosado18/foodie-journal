import { SCORE_ICONS } from '@/components/icons/scoreIconMap'
import { SCORE_META, SCORE_ORDER, type Score } from '@/types'

interface ScoreSelectorProps {
  value?: Score
  onChange: (score: Score) => void
}

const SCORE_ACTIVE_CLASSES: Record<Score, string> = {
  fumble: 'border-(--color-score-fumble) bg-(--color-score-fumble)/10 text-(--color-score-fumble)',
  punt: 'border-(--color-score-punt) bg-(--color-score-punt)/10 text-(--color-score-punt)',
  'first-down':
    'border-(--color-score-first-down) bg-(--color-score-first-down)/10 text-(--color-score-first-down)',
  touchdown:
    'border-(--color-score-touchdown) bg-(--color-score-touchdown)/10 text-(--color-score-touchdown)',
  'hail-mary-touchdown':
    'border-(--color-score-hail-mary) bg-(--color-score-hail-mary)/10 text-(--color-score-hail-mary)',
}

export default function ScoreSelector({ value, onChange }: ScoreSelectorProps) {
  return (
    <div role="radiogroup" aria-label="Playbook score" className="grid grid-cols-3 gap-2 sm:grid-cols-5">
      {SCORE_ORDER.map((score) => {
        const Icon = SCORE_ICONS[score]
        const selected = value === score
        return (
          <button
            key={score}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => onChange(score)}
            className={`flex min-h-20 flex-col items-center justify-center gap-1 rounded-(--radius-md) border-2 p-2 text-center transition-colors ${
              selected ? SCORE_ACTIVE_CLASSES[score] : 'border-slate-200 text-(--color-ink-muted)'
            }`}
          >
            <Icon className="h-7 w-7" />
            <span className="text-xs font-semibold leading-tight">{SCORE_META[score].label}</span>
          </button>
        )
      })}
    </div>
  )
}
