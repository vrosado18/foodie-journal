import ErrorState from '@/components/ui/ErrorState'
import Spinner from '@/components/ui/Spinner'

interface ShareCardPreviewProps {
  status: 'generating' | 'ready' | 'error'
  previewUrl: string | null
}

export default function ShareCardPreview({ status, previewUrl }: ShareCardPreviewProps) {
  if (status === 'generating') return <Spinner label="Generating your share card…" />
  if (status === 'error' || !previewUrl) {
    return <ErrorState message="Couldn't generate a share card for this log." />
  }

  return (
    <img
      src={previewUrl}
      alt="Share card preview"
      className="mx-auto aspect-[9/16] w-full max-w-xs rounded-(--radius-lg) object-cover shadow-lg"
    />
  )
}
