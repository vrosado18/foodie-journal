import { create } from 'zustand'
import { authService } from '@/services'
import type { User } from '@/types'

interface AuthState {
  user: User | null
  isOnboarded: boolean
  hasSession: boolean
  hydrated: boolean
  hydrate: () => Promise<void>
  completeOnboarding: () => Promise<void>
  signUp: (email: string, password: string, name: string) => Promise<{ needsEmailConfirmation: boolean }>
  signIn: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => {
  // Keeps hasSession/user in sync with external auth changes (token refresh, sign-out in another tab).
  authService.onAuthStateChange((session) => {
    set({ hasSession: session != null })
    if (session == null) set({ user: null })
  })

  return {
    user: null,
    isOnboarded: false,
    hasSession: false,
    hydrated: false,

    hydrate: async () => {
      const [onboarded, session, user] = await Promise.all([
        authService.isOnboarded(),
        authService.getSession(),
        authService.getCurrentUser(),
      ])
      set({ isOnboarded: onboarded, hasSession: session != null, user, hydrated: true })
    },

    completeOnboarding: async () => {
      await authService.completeOnboarding()
      set({ isOnboarded: true })
    },

    signUp: async (email, password, name) => {
      const result = await authService.signUp(email, password, name)
      if (!result.needsEmailConfirmation) {
        set({ user: result.user, hasSession: true })
      }
      return { needsEmailConfirmation: result.needsEmailConfirmation }
    },

    signIn: async (email, password) => {
      const result = await authService.signIn(email, password)
      set({ user: result.user, hasSession: true })
    },

    signOut: async () => {
      await authService.signOut()
      set({ hasSession: false, user: null })
    },
  }
})
