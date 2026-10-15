import { create } from 'zustand'
import { logService } from '@/services'
import type { LogEntry, LogFilters } from '@/types'

interface JournalState {
  logs: LogEntry[]
  loading: boolean
  error: string | null
  searchTerm: string
  filters: LogFilters
  fetchLogs: () => Promise<void>
  addLog: (log: LogEntry) => void
  updateLogInStore: (log: LogEntry) => void
  removeLog: (id: string) => void
  setSearchTerm: (term: string) => void
  setFilters: (filters: LogFilters) => void
}

export const useJournalStore = create<JournalState>((set, get) => ({
  logs: [],
  loading: false,
  error: null,
  searchTerm: '',
  filters: {},

  fetchLogs: async () => {
    set({ loading: true, error: null })
    try {
      const { searchTerm, filters } = get()
      const logs = await logService.searchLogs(searchTerm, filters)
      set({ logs, loading: false })
    } catch {
      set({ error: "Couldn't load your journal. Please try again.", loading: false })
    }
  },

  addLog: (log) => set((state) => ({ logs: [log, ...state.logs] })),

  updateLogInStore: (log) =>
    set((state) => ({ logs: state.logs.map((entry) => (entry.id === log.id ? log : entry)) })),

  removeLog: (id) => set((state) => ({ logs: state.logs.filter((entry) => entry.id !== id) })),

  setSearchTerm: (searchTerm) => {
    set({ searchTerm })
    void get().fetchLogs()
  },

  setFilters: (filters) => {
    set({ filters })
    void get().fetchLogs()
  },
}))
