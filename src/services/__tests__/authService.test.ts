import { beforeEach, describe, expect, it, vi } from 'vitest'
import type { createFakeSupabase } from '@/test/fakeSupabase'

vi.mock('@/services/supabaseClient', async () => {
  const { createFakeSupabase } = await import('@/test/fakeSupabase')
  return { supabase: createFakeSupabase() }
})

const { supabase } = await import('../supabaseClient')
const fakeSupabase = supabase as unknown as ReturnType<typeof createFakeSupabase>
const authService = await import('../authService')

const SUPABASE_USER = {
  id: 'user-1',
  email: 'sam@example.com',
  created_at: '2026-01-01T00:00:00.000Z',
  user_metadata: { name: 'Sam' },
}

const SUPABASE_SESSION = { user: SUPABASE_USER }

describe('authService', () => {
  beforeEach(() => {
    localStorage.clear()
    fakeSupabase.reset()
  })

  it('reports not onboarded and no session on fresh storage', async () => {
    expect(await authService.isOnboarded()).toBe(false)
    expect(await authService.getSession()).toBeNull()
  })

  it('persists onboarding completion', async () => {
    await authService.completeOnboarding()
    expect(await authService.isOnboarded()).toBe(true)
  })

  it('signs up a new user and maps the Supabase response', async () => {
    fakeSupabase.auth.signUp.mockResolvedValue({
      data: { user: SUPABASE_USER, session: SUPABASE_SESSION },
      error: null,
    })

    const result = await authService.signUp('sam@example.com', 'password123', 'Sam')

    expect(result.needsEmailConfirmation).toBe(false)
    expect(result.user?.name).toBe('Sam')
    expect(result.session?.userId).toBe('user-1')
  })

  it('flags when sign-up requires email confirmation', async () => {
    fakeSupabase.auth.signUp.mockResolvedValue({
      data: { user: SUPABASE_USER, session: null },
      error: null,
    })

    const result = await authService.signUp('sam@example.com', 'password123', 'Sam')
    expect(result.needsEmailConfirmation).toBe(true)
    expect(result.session).toBeNull()
  })

  it('throws a readable error when sign-in fails', async () => {
    fakeSupabase.auth.signInWithPassword.mockResolvedValue({
      data: { user: null, session: null },
      error: { message: 'Invalid login credentials' },
    })

    await expect(authService.signIn('sam@example.com', 'wrong')).rejects.toThrow(
      'Invalid login credentials',
    )
  })

  it('signs out', async () => {
    fakeSupabase.auth.signOut.mockResolvedValue({ error: null })
    await authService.signOut()
    expect(fakeSupabase.auth.signOut).toHaveBeenCalled()
  })
})
