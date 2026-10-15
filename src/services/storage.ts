export const STORAGE_KEYS = {
  onboarded: 'foodie-journal:onboarded:v1',
  draft: 'foodie-journal:draft:v1',
} as const

export function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function writeJSON<T>(key: string, value: T): void {
  localStorage.setItem(key, JSON.stringify(value))
}

export function removeKey(key: string): void {
  localStorage.removeItem(key)
}
