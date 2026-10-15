import { NavLink } from 'react-router-dom'
import { AddIcon, JournalIcon, ProfileIcon } from '../icons/NavIcons'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex min-h-11 flex-1 flex-col items-center justify-center gap-0.5 text-xs font-medium ${
    isActive ? 'text-(--color-primary)' : 'text-(--color-ink-muted)'
  }`

export default function BottomTabNav() {
  return (
    <nav
      aria-label="Primary"
      className="fixed inset-x-0 bottom-0 z-20 flex h-20 items-center border-t border-slate-200 bg-(--color-surface) px-4 pb-[env(safe-area-inset-bottom)] md:hidden"
    >
      <NavLink to="/" end className={linkClass}>
        <JournalIcon className="h-6 w-6" />
        Journal
      </NavLink>

      <div className="flex flex-1 justify-center">
        <NavLink
          to="/log/new"
          aria-label="Add a log"
          className="-mt-8 flex h-14 w-14 items-center justify-center rounded-full bg-(--color-primary) text-white shadow-lg transition-transform active:scale-95"
        >
          <AddIcon className="h-7 w-7" />
        </NavLink>
      </div>

      <NavLink to="/profile" className={linkClass}>
        <ProfileIcon className="h-6 w-6" />
        Profile
      </NavLink>
    </nav>
  )
}
