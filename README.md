# Foodie Journal

A mobile-first web app for logging meals fast, rating them on a football-themed Playbook scale (Fumble → Hail Mary Touchdown), and finding them again later.

## Tech stack

- React 18 + TypeScript (strict) + Vite
- React Router
- Tailwind CSS v4
- Zustand for state
- Vitest + React Testing Library for tests

There is no backend yet. All data lives in `localStorage` behind a typed service layer — see [Connecting Supabase later](#connecting-supabase-later).

## Setup

```bash
npm install
npm run dev
```

The app opens at `http://localhost:5173`. On first load it seeds 12 demo Chicago-area logs into `localStorage`.

## Scripts

| Script              | What it does                                  |
| ------------------- | ---------------------------------------------- |
| `npm run dev`       | Start the Vite dev server                      |
| `npm run build`     | Type-check and build for production            |
| `npm run preview`   | Preview the production build locally           |
| `npm run typecheck` | Run `tsc` with no emit                         |
| `npm run lint`      | Run oxlint                                     |
| `npm run test`      | Run the Vitest suite                           |

## Folder structure

```
src/
  types/        Shared TypeScript types (User, Spot, LogEntry, LogDraft, Score, ...)
  services/     The mock data layer — localStorage-backed, async, API-shaped
  store/        Zustand stores (auth session, journal cache, in-progress draft)
  utils/        Pure helpers: image compression, formatters, share-card canvas drawing, validation
  components/
    layout/     AppShell, nav, page container
    ui/         Generic UI primitives (Button, Input, Modal, EmptyState, ...)
    icons/      Inline SVG icon sets
  features/     Feature-specific UI + hooks, grouped by domain
    onboarding/
    journal/
    log/        Quick Log wizard, log detail/edit
    share/      Share-card generation
    profile/
  pages/        Thin route components that compose features + layout
public/
  manifest.webmanifest, icons/   PWA manifest and icons
  seed-photos/                    Bundled placeholder photos for the 12 demo logs
```

`components/` stays feature-agnostic; feature-specific UI lives under `features/*/components`. `pages/` only wire hooks and components together — no business logic.

## Architecture notes

- **Service layer**: every data operation goes through `src/services/*Service.ts` (`logService`, `spotService`, `authService`, `draftService`). Each function is `async`, takes/returns typed values, and simulates network latency — so loading and error states are exercised the same way they will be against a real backend.
- **Photos**: a photo taken in Quick Log is resized to ~800px and compressed to a JPEG data URL client-side before being stored directly on the `LogEntry` record in `localStorage`. This keeps things simple but means a very large number of photos could approach the browser's storage quota (a few MB per origin) — worth watching if real usage grows.
- **State**: Zustand holds cross-cutting state (`useAuthStore`, `useJournalStore`, `useDraftStore`). Everything else (form fields, dialog open/closed) is local component state. Filtered/derived data (Journal search results, Profile stats) is computed, never duplicated into its own store.
- **Search/filter**: lives in `logService.searchLogs()`, not in the UI, so swapping in a real backend later means this function starts making a server query — no call-site changes needed.

## Testing

```bash
npm run test
```

Covers the service layer (`logService`, `spotService`, `authService`, `draftService`) and the Quick Log form (photo gating, score selection, required-field validation, successful save, draft persistence across remounts).

## Connecting Supabase later

Nothing in this codebase calls Supabase yet. When you're ready, swap the implementations below — the UI, stores, and types should need no changes:

- `authService.mockSignIn` / `getSession` / `getCurrentUser` / `signOut` → Supabase Auth (email/OAuth sign-in + session).
- `authService.completeOnboarding` / `isOnboarded` → a flag on the user's profile row instead of a localStorage key.
- `logService.listLogs` / `getLogById` / `createLog` / `updateLog` / `deleteLog` / `searchLogs` → queries against a `logs` table. `searchLogs` becomes a real filtered/sorted query instead of an in-memory filter.
- `logService` / Quick Log's photo handling → upload the compressed photo to Supabase Storage and store the resulting URL in `photoUrl` instead of an embedded data URL.
- `spotService.listSpots` / `searchSpots` / `createSpot` → queries against a `spots` table, ideally with a real text-search index.

`draftService` (the Quick Log autosave draft) should probably stay local-only even after Supabase is added — it's ephemeral, device-local state, not something worth syncing.
