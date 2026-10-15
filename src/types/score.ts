export const SCORE_LEVELS = [
  'fumble',
  'punt',
  'first-down',
  'touchdown',
  'hail-mary-touchdown',
] as const

export type Score = (typeof SCORE_LEVELS)[number]

export interface ScoreMeta {
  value: Score
  rank: 1 | 2 | 3 | 4 | 5
  label: string
  shortLabel: string
}

export const SCORE_META: Record<Score, ScoreMeta> = {
  fumble: { value: 'fumble', rank: 1, label: 'Fumble', shortLabel: 'Fumble' },
  punt: { value: 'punt', rank: 2, label: 'Punt', shortLabel: 'Punt' },
  'first-down': { value: 'first-down', rank: 3, label: 'First Down', shortLabel: '1st Down' },
  touchdown: { value: 'touchdown', rank: 4, label: 'Touchdown', shortLabel: 'TD' },
  'hail-mary-touchdown': {
    value: 'hail-mary-touchdown',
    rank: 5,
    label: 'Hail Mary Touchdown',
    shortLabel: 'Hail Mary',
  },
}

export const SCORE_ORDER: Score[] = SCORE_LEVELS.slice() as Score[]
