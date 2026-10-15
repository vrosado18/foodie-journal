import type { ButtonHTMLAttributes, ReactNode } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  children: ReactNode
}

const VARIANT_CLASSES: Record<Variant, string> = {
  primary: 'bg-(--color-primary) text-white hover:bg-(--color-primary-dark)',
  secondary: 'bg-(--color-surface) text-(--color-ink) border border-slate-200 hover:bg-slate-50',
  ghost: 'bg-transparent text-(--color-ink) hover:bg-slate-100',
  danger: 'bg-(--color-danger) text-white hover:brightness-90',
}

const SIZE_CLASSES: Record<Size, string> = {
  md: 'h-11 px-4 text-sm',
  lg: 'h-13 px-6 text-base',
}

export default function Button({
  variant = 'primary',
  size = 'md',
  className = '',
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-(--radius-md) font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  )
}
