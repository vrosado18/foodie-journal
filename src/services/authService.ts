import type { Session as SupabaseSession, User as SupabaseUser } from '@supabase/supabase-js'
import type { Session, User } from '@/types'
import { readJSON, STORAGE_KEYS, writeJSON } from './storage'
import { supabase } from './supabaseClient'

function toUser(supabaseUser: SupabaseUser): User {
  return {
    id: supabaseUser.id,
    name: (supabaseUser.user_metadata?.name as string | undefined) || supabaseUser.email!.split('@')[0],
    email: supabaseUser.email,
    createdAt: supabaseUser.created_at,
  }
}

function toSession(supabaseSession: SupabaseSession): Session {
  return { userId: supabaseSession.user.id, signedInAt: supabaseSession.user.last_sign_in_at ?? '' }
}

export async function isOnboarded(): Promise<boolean> {
  return readJSON(STORAGE_KEYS.onboarded, false)
}

export async function completeOnboarding(): Promise<void> {
  writeJSON(STORAGE_KEYS.onboarded, true)
}

export async function getSession(): Promise<Session | null> {
  const { data, error } = await supabase.auth.getSession()
  if (error || !data.session) return null
  return toSession(data.session)
}

export async function getCurrentUser(): Promise<User | null> {
  const { data, error } = await supabase.auth.getUser()
  if (error || !data.user) return null
  return toUser(data.user)
}

export interface AuthResult {
  user: User | null
  session: Session | null
  /** True when sign-up succeeded but the project requires email confirmation before a session exists. */
  needsEmailConfirmation: boolean
}

export async function signUp(email: string, password: string, name: string): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  })
  if (error) throw new Error(error.message)

  if (!data.session) {
    return { user: data.user ? toUser(data.user) : null, session: null, needsEmailConfirmation: true }
  }
  return { user: toUser(data.user!), session: toSession(data.session), needsEmailConfirmation: false }
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error(error.message)
  return { user: toUser(data.user), session: toSession(data.session), needsEmailConfirmation: false }
}

export async function signOut(): Promise<void> {
  await supabase.auth.signOut()
}

export function onAuthStateChange(callback: (session: Session | null) => void) {
  const {
    data: { subscription },
  } = supabase.auth.onAuthStateChange((_event, session) => {
    callback(session ? toSession(session) : null)
  })
  return () => subscription.unsubscribe()
}
