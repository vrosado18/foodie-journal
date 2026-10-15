import { NavLink } from 'react-router-dom'
import { AddIcon, JournalIcon, ProfileIcon } from '../icons/NavIcons'

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-3 rounded-(--radius-md) px-3 py-2.5 text-sm font-medium transition-colors ${
    isActive
      ? 'bg-(--color-primary)/10 text-(--color-primary)'
      : 'text-(--color-ink-muted) hover:bg-slate-100'
  }`

export default function SideNav() {
  return (
    <nav
      aria-label="Primary"
      className="sticky top-0 hidden h-dvh w-56 flex-col gap-1 border-r border-slate-200 p-4 md:flex"
    >
      <p className="mb-4 px-3 text-lg font-bold text-(--color-primary)">Foodie Journal</p>

      <NavLink to="/" end className={linkClass}>
        <JournalIcon className="h-5 w-5" />
        Journal
      </NavLink>
      <NavLink to="/log/new" className={linkClass}>
        <AddIcon className="h-5 w-5" />
        Add a Log
      </NavLink>
      <NavLink to="/profile" className={linkClass}>
        <ProfileIcon className="h-5 w-5" />
        Profile
      </NavLink>
    </nav>
  )
}
