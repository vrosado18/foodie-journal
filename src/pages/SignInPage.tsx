import { useState } from 'react'
import AuthForm from '@/features/onboarding/components/AuthForm'
import { useOnboarding } from '@/features/onboarding/hooks/useOnboarding'

export default function SignInPage() {
  const { submitSignIn, submitSignUp, submitting, error, pendingConfirmation } = useOnboarding()
  const [mode, setMode] = useState<'sign-in' | 'sign-up'>('sign-up')

  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-6 p-6">
      <div className="text-center">
        <span className="text-5xl">🏈</span>
        <h1 className="mt-2 text-2xl font-bold">Welcome to Foodie Journal</h1>
      </div>
      <AuthForm
        mode={mode}
        onToggleMode={() => setMode((m) => (m === 'sign-in' ? 'sign-up' : 'sign-in'))}
        onSignIn={(email, password) => void submitSignIn(email, password)}
        onSignUp={(name, email, password) => void submitSignUp(name, email, password)}
        submitting={submitting}
        error={error}
        pendingConfirmation={pendingConfirmation}
      />
    </div>
  )
}
