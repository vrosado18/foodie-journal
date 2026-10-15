export interface AsyncState<T> {
  data: T | null
  loading: boolean
  error: string | null
}

export interface Session {
  userId: string
  signedInAt: string
}
