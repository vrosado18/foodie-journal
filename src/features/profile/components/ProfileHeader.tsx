import { useAuthStore } from '@/store'

export default function ProfileHeader() {
  const name = useAuthStore((state) => state.user?.name) ?? 'Sam'
  const initial = name.charAt(0).toUpperCase()

  return (
    <div className="flex items-center gap-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-(--color-primary) text-2xl font-bold text-white">
        {initial}
      </div>
      <div>
        <p className="text-xl font-bold">{name}</p>
        <p className="text-sm text-(--color-ink-muted)">Food + sports fan</p>
      </div>
    </div>
  )
}
