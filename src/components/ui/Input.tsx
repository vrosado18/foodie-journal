import { useId, type InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  error?: string
}

export default function Input({ label, error, id, className = '', ...rest }: InputProps) {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={inputId} className="text-sm font-medium text-(--color-ink)">
        {label}
      </label>
      <input
        id={inputId}
        className={`h-11 rounded-(--radius-md) border px-3 text-base outline-none focus-visible:border-(--color-primary) ${
          error ? 'border-(--color-danger)' : 'border-slate-200'
        } ${className}`}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${inputId}-error` : undefined}
        {...rest}
      />
      {error && (
        <p id={`${inputId}-error`} className="text-sm text-(--color-danger)">
          {error}
        </p>
      )}
    </div>
  )
}
