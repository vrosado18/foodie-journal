import { useState, type FormEvent } from 'react'
import Button from '@/components/ui/Button'
import Input from '@/components/ui/Input'

type Mode = 'sign-in' | 'sign-up'

interface AuthFormProps {
  mode: Mode
  onToggleMode: () => void
  onSignIn: (email: string, password: string) => void
  onSignUp: (name: string, email: string, password: string) => void
  submitting: boolean
  error: string | null
  pendingConfirmation: boolean
}

export default function AuthForm({
  mode,
  onToggleMode,
  onSignIn,
  onSignUp,
  submitting,
  error,
  pendingConfirmation,
}: AuthFormProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    if (mode === 'sign-up') {
      onSignUp(name, email, password)
    } else {
      onSignIn(email, password)
    }
  }

  if (pendingConfirmation) {
    return (
      <div className="flex w-full max-w-sm flex-col items-center gap-2 text-center">
        <span className="text-4xl">📬</span>
        <p className="font-semibold text-(--color-ink)">Check your email</p>
        <p className="text-sm text-(--color-ink-muted)">
          We sent a confirmation link to {email}. Click it, then come back and sign in.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-sm flex-col gap-4">
      {mode === 'sign-up' && (
        <Input
          label="Your name"
          placeholder="Sam"
          value={name}
          onChange={(event) => setName(event.target.value)}
          autoFocus
          required
        />
      )}
      <Input
        label="Email"
        type="email"
        placeholder="sam@example.com"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        autoFocus={mode === 'sign-in'}
        required
      />
      <Input
        label="Password"
        type="password"
        placeholder="At least 6 characters"
        value={password}
        onChange={(event) => setPassword(event.target.value)}
        minLength={6}
        required
      />

      {error && (
        <p role="alert" className="text-sm text-(--color-danger)">
          {error}
        </p>
      )}

      <Button type="submit" disabled={submitting} className="w-full">
        {submitting ? 'Please wait…' : mode === 'sign-up' ? 'Create account' : 'Sign in'}
      </Button>

      <button
        type="button"
        onClick={onToggleMode}
        className="text-sm font-medium text-(--color-primary)"
      >
        {mode === 'sign-up' ? 'Already have an account? Sign in' : "New here? Create an account"}
      </button>
    </form>
  )
}
