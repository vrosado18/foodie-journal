import { useEffect } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import AppShell from './components/layout/AppShell'
import AuthGate from './components/layout/AuthGate'
import JournalPage from './pages/JournalPage'
import LogDetailPage from './pages/LogDetailPage'
import LogEditPage from './pages/LogEditPage'
import NotFoundPage from './pages/NotFoundPage'
import OnboardingPage from './pages/OnboardingPage'
import ProfilePage from './pages/ProfilePage'
import QuickLogPage from './pages/QuickLogPage'
import SharePage from './pages/SharePage'
import SignInPage from './pages/SignInPage'
import { useAuthStore } from './store'

export default function App() {
  const hydrate = useAuthStore((state) => state.hydrate)

  useEffect(() => {
    void hydrate()
  }, [hydrate])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/sign-in" element={<SignInPage />} />

        <Route element={<AuthGate />}>
          <Route element={<AppShell />}>
            <Route path="/" element={<JournalPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/log/:id" element={<LogDetailPage />} />
            <Route path="/log/:id/edit" element={<LogEditPage />} />
            <Route path="/log/:id/share" element={<SharePage />} />
          </Route>
          {/* Full-screen, outside AppShell so nav doesn't eat thumb-zone space */}
          <Route path="/log/new" element={<QuickLogPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  )
}
