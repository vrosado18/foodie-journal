import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ensureSeeded } from '@/services'
import { useAuthStore } from '@/store'

export function useOnboarding() {
  const navigate = useNavigate()
  const completeOnboarding = useAuthStore((state) => state.completeOnboarding)
  const signUp = useAuthStore((state) => state.signUp)
  const signIn = useAuthStore((state) => state.signIn)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [pendingConfirmation, setPendingConfirmation] = useState(false)

  async function finishOnboarding() {
    await completeOnboarding()
    navigate('/sign-in', { replace: true })
  }

  async function submitSignUp(name: string, email: string, password: string) {
    setSubmitting(true)
    setError(null)
    try {
      const { needsEmailConfirmation } = await signUp(email, password, name)
      if (needsEmailConfirmation) {
        setPendingConfirmation(true)
        return
      }
      const user = useAuthStore.getState().user
      if (user) {
        // Seeding demo data is a nice-to-have, not a condition of signing up successfully —
        // don't block navigation if it fails (e.g. the database schema isn't set up yet).
        try {
          await ensureSeeded(user.id)
        } catch (seedErr) {
          console.error('Could not seed demo data:', seedErr)
        }
      }
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not create your account.')
    } finally {
      setSubmitting(false)
    }
  }

  async function submitSignIn(email: string, password: string) {
    setSubmitting(true)
    setError(null)
    try {
      await signIn(email, password)
      navigate('/', { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in.')
    } finally {
      setSubmitting(false)
    }
  }

  return { finishOnboarding, submitSignUp, submitSignIn, submitting, error, pendingConfirmation }
}
