import { SCORE_META, type Score } from '@/types'

const SCORE_COLOR_VAR: Record<Score, string> = {
  fumble: '--color-score-fumble',
  punt: '--color-score-punt',
  'first-down': '--color-score-first-down',
  touchdown: '--color-score-touchdown',
  'hail-mary-touchdown': '--color-score-hail-mary',
}

export default function Badge({ score }: { score: Score }) {
  const meta = SCORE_META[score]
  return (
    <span
      className="inline-flex h-7 items-center rounded-full px-2.5 text-xs font-semibold text-white"
      style={{ backgroundColor: `var(${SCORE_COLOR_VAR[score]})` }}
    >
      {meta.shortLabel}
    </span>
  )
}
