import type { ReactElement, SVGProps } from 'react'
import type { Score } from '@/types'
import { FirstDownIcon, FumbleIcon, HailMaryIcon, PuntIcon, TouchdownIcon } from './ScoreIcons'

export const SCORE_ICONS: Record<Score, (props: SVGProps<SVGSVGElement>) => ReactElement> = {
  fumble: FumbleIcon,
  punt: PuntIcon,
  'first-down': FirstDownIcon,
  touchdown: TouchdownIcon,
  'hail-mary-touchdown': HailMaryIcon,
}
