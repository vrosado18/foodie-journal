import type { ReactNode } from 'react'

interface EmptyStateProps {
  icon?: ReactNode
  title: string
  message?: string
  action?: ReactNode
}

export default function EmptyState({ icon, title, message, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center gap-3 px-6 py-12 text-center">
      {icon && <div className="text-(--color-ink-muted)">{icon}</div>}
      <h2 className="text-lg font-semibold text-(--color-ink)">{title}</h2>
      {message && <p className="max-w-sm text-sm text-(--color-ink-muted)">{message}</p>}
      {action}
    </div>
  )
}
