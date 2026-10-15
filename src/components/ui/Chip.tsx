import type { ButtonHTMLAttributes } from 'react'

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean
}

export default function Chip({ selected = false, className = '', children, ...rest }: ChipProps) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      className={`inline-flex h-9 min-h-9 items-center gap-1 rounded-full border px-3 text-sm font-medium transition-colors ${
        selected
          ? 'border-(--color-primary) bg-(--color-primary)/10 text-(--color-primary)'
          : 'border-slate-200 bg-(--color-surface) text-(--color-ink-muted) hover:bg-slate-50'
      } ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
