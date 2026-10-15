import { useParams } from 'react-router-dom'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import Spinner from '@/components/ui/Spinner'
import ShareButton from '@/features/share/components/ShareButton'
import ShareCardPreview from '@/features/share/components/ShareCardPreview'
import { useShareCard } from '@/features/share/hooks/useShareCard'
import { useLogDetail } from '@/features/log/hooks/useLogDetail'
import type { LogEntry } from '@/types'

function SharePageContent({ logId }: { logId: string }) {
  const { log, loading, error } = useLogDetail(logId)

  if (loading) return <Spinner label="Loading log…" />
  if (error) return <ErrorState message={error} />
  if (!log) return <EmptyState title="Log not found" message="It may have been deleted." />

  return <ShareCardContent log={log} />
}

function ShareCardContent({ log }: { log: LogEntry }) {
  const { status, blob, previewUrl } = useShareCard(log)

  return (
    <div className="flex flex-col items-center gap-5">
      <h1 className="self-start text-2xl font-bold">Share your meal</h1>
      <ShareCardPreview status={status} previewUrl={previewUrl} />
      <div className="w-full max-w-xs">
        <ShareButton blob={blob} fileName={`${log.dishName}.jpg`} />
      </div>
    </div>
  )
}

export default function SharePage() {
  const { id } = useParams<{ id: string }>()
  return <SharePageContent logId={id!} />
}
