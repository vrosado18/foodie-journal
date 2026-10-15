import { vi } from 'vitest'

type Row = Record<string, unknown>
type Filter = { col: string; op: string; value: unknown }

function matchesFilter(row: Row, { col, op, value }: Filter): boolean {
  const cell = row[col]
  switch (op) {
    case 'eq':
      return cell === value
    case 'ilike': {
      const pattern = String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/%/g, '.*')
      return new RegExp(`^${pattern}$`, 'i').test(String(cell ?? ''))
    }
    case 'gte':
      return (cell as string | number) >= (value as string | number)
    case 'lte':
      return (cell as string | number) <= (value as string | number)
    case 'contains':
      return Array.isArray(cell) && (value as unknown[]).every((v) => (cell as unknown[]).includes(v))
    default:
      return true
  }
}

let idCounter = 0

/** A minimal in-memory stand-in for the Supabase JS client, covering only the query shapes this app's services use. */
export function createFakeSupabase() {
  const tables: Record<string, Row[]> = {}
  const uploads: { bucket: string; path: string }[] = []

  function from(tableName: string) {
    tables[tableName] ??= []
    let op: 'select' | 'insert' | 'update' | 'delete' = 'select'
    let payload: Row | Row[] | null = null
    const filters: Filter[] = []
    let orFilters: Filter[] | null = null
    let orderCol: string | null = null
    let orderAsc = true
    let single = false
    let maybeSingle = false
    let countMode = false

    function execute() {
      const table = tables[tableName]

      if (op === 'insert') {
        const rows = (Array.isArray(payload) ? payload : [payload!]).map((r) => ({
          id: `id-${++idCounter}`,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          ...r,
        }))
        table.push(...rows)
        return { data: single ? rows[0] : rows, error: null }
      }

      if (op === 'update') {
        const matched = table.filter((row) => filters.every((f) => matchesFilter(row, f)))
        for (const row of matched) Object.assign(row, payload, { updated_at: new Date().toISOString() })
        return { data: single ? (matched[0] ?? null) : matched, error: null }
      }

      if (op === 'delete') {
        const keep = table.filter((row) => !filters.every((f) => matchesFilter(row, f)))
        tables[tableName] = keep
        return { data: null, error: null }
      }

      let rows = table.filter((row) => filters.every((f) => matchesFilter(row, f)))
      if (orFilters) {
        const of = orFilters
        rows = rows.filter((row) => of.some((f) => matchesFilter(row, f)))
      }
      if (orderCol) {
        const col = orderCol
        rows = [...rows].sort((a, b) => {
          const av = a[col] as string | number
          const bv = b[col] as string | number
          const cmp = av < bv ? -1 : av > bv ? 1 : 0
          return orderAsc ? cmp : -cmp
        })
      }
      if (countMode) return { data: null, error: null, count: rows.length }
      if (maybeSingle) return { data: rows[0] ?? null, error: null }
      if (single) return { data: rows[0] ?? null, error: null }
      return { data: rows, error: null }
    }

    const builder = {
      select(_cols?: string, opts?: { count?: string }) {
        // Chained after insert/update (e.g. `.insert(row).select()`) just requests the row back —
        // it doesn't change the operation itself, unlike a bare `.from(x).select()`.
        if (op !== 'insert' && op !== 'update' && op !== 'delete') op = 'select'
        if (opts?.count) countMode = true
        return builder
      },
      insert(rowOrRows: Row | Row[]) {
        op = 'insert'
        payload = rowOrRows
        return builder
      },
      update(partial: Row) {
        op = 'update'
        payload = partial
        return builder
      },
      delete() {
        op = 'delete'
        return builder
      },
      eq(col: string, value: unknown) {
        filters.push({ col, op: 'eq', value })
        return builder
      },
      ilike(col: string, value: unknown) {
        filters.push({ col, op: 'ilike', value })
        return builder
      },
      gte(col: string, value: unknown) {
        filters.push({ col, op: 'gte', value })
        return builder
      },
      lte(col: string, value: unknown) {
        filters.push({ col, op: 'lte', value })
        return builder
      },
      contains(col: string, value: unknown) {
        filters.push({ col, op: 'contains', value })
        return builder
      },
      or(expr: string) {
        orFilters = expr.split(',').map((part) => {
          const [col, opName, value] = part.split('.')
          return { col, op: opName, value }
        })
        return builder
      },
      order(col: string, opts?: { ascending?: boolean }) {
        orderCol = col
        orderAsc = opts?.ascending ?? true
        return builder
      },
      single() {
        single = true
        return builder
      },
      maybeSingle() {
        maybeSingle = true
        return builder
      },
      then(resolve: (value: unknown) => void, reject: (reason: unknown) => void) {
        try {
          resolve(execute())
        } catch (err) {
          reject(err)
        }
      },
    }

    return builder
  }

  const auth = {
    signUp: vi.fn(),
    signInWithPassword: vi.fn(),
    signOut: vi.fn(),
    getSession: vi.fn(async () => ({ data: { session: null }, error: null })),
    getUser: vi.fn(async () => ({ data: { user: null }, error: null })),
    onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } })),
  }

  const storage = {
    from: (bucket: string) => ({
      upload: vi.fn(async (path: string) => {
        uploads.push({ bucket, path })
        return { data: { path }, error: null }
      }),
      getPublicUrl: (path: string) => ({
        data: { publicUrl: `https://fake.supabase.co/storage/v1/object/public/${bucket}/${path}` },
      }),
    }),
  }

  function reset() {
    for (const key of Object.keys(tables)) delete tables[key]
    uploads.length = 0
    auth.signUp.mockReset()
    auth.signInWithPassword.mockReset()
    auth.signOut.mockReset()
  }

  return { from, auth, storage, reset, _tables: tables, _uploads: uploads }
}
