import type { Score } from './score'

export interface LogEntry {
  id: string
  userId: string
  spotId: string
  spotName: string
  dishName: string
  price: number
  score: Score
  note?: string
  tags: string[]
  /** Compressed data URL for user uploads, or a static asset path for seed data. */
  photoUrl: string
  createdAt: string
  updatedAt: string
}

/** Mirrors LogEntry but every content field is optional, since a draft can be partially filled. */
export interface LogDraft {
  id: string
  step: number
  spotId?: string
  spotName?: string
  dishName?: string
  price?: number
  score?: Score
  note?: string
  tags?: string[]
  photoUrl?: string
  updatedAt: string
}

export interface LogFilters {
  score?: Score
  minPrice?: number
  maxPrice?: number
  startDate?: string
  endDate?: string
  tags?: string[]
}

export interface LogSearchParams {
  searchTerm?: string
  filters?: LogFilters
}
