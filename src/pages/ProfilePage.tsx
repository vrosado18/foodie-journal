import ErrorState from '@/components/ui/ErrorState'
import Spinner from '@/components/ui/Spinner'
import HallOfFameGrid from '@/features/profile/components/HallOfFameGrid'
import ProfileHeader from '@/features/profile/components/ProfileHeader'
import ProfileStats from '@/features/profile/components/ProfileStats'
import { useProfileStats } from '@/features/profile/hooks/useProfileStats'

export default function ProfilePage() {
  const { logCount, spotCount, hallOfFame, loading, error } = useProfileStats()

  return (
    <div className="flex flex-col gap-6">
      <ProfileHeader />

      {loading ? (
        <Spinner label="Loading your stats…" />
      ) : error ? (
        <ErrorState message={error} />
      ) : (
        <>
          <ProfileStats logCount={logCount} spotCount={spotCount} />
          <div>
            <h2 className="mb-3 text-lg font-bold">Hall of Fame</h2>
            <HallOfFameGrid logs={hallOfFame} />
          </div>
        </>
      )}
    </div>
  )
}
