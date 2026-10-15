import { Navigate, Outlet } from 'react-router-dom'
import Spinner from '@/components/ui/Spinner'
import { useAuthStore } from '@/store'

/** Gates the main app behind onboarding + mock sign-in, both persisted in localStorage. */
export default function AuthGate() {
  const hydrated = useAuthStore((state) => state.hydrated)
  const isOnboarded = useAuthStore((state) => state.isOnboarded)
  const hasSession = useAuthStore((state) => state.hasSession)

  if (!hydrated) {
    return <Spinner label="Loading Foodie Journal…" />
  }
  if (!isOnboarded) {
    return <Navigate to="/onboarding" replace />
  }
  if (!hasSession) {
    return <Navigate to="/sign-in" replace />
  }
  return <Outlet />
}
