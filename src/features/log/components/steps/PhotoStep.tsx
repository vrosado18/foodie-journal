import { useRef, useState, type ChangeEvent } from 'react'
import { compressImage } from '@/utils/image'

interface PhotoStepProps {
  photoUrl?: string
  onPhotoReady: (photoUrl: string) => void
}

export default function PhotoStep({ photoUrl, onPhotoReady }: PhotoStepProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setProcessing(true)
    setError(null)
    try {
      const compressed = await compressImage(file)
      onPhotoReady(compressed)
    } catch {
      setError("Couldn't process that photo — try another one.")
    } finally {
      setProcessing(false)
      event.target.value = ''
    }
  }

  return (
    <div className="flex flex-col items-center gap-4 py-6 text-center">
      <h2 className="text-xl font-bold">Snap your meal</h2>
      <p className="text-sm text-(--color-ink-muted)">First things first — what'd it look like?</p>

      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        disabled={processing}
        className="flex h-56 w-56 flex-col items-center justify-center gap-2 overflow-hidden rounded-(--radius-lg) border-2 border-dashed border-slate-300 bg-slate-50 text-(--color-ink-muted) disabled:opacity-60"
      >
        {photoUrl ? (
          <img src={photoUrl} alt="Your meal" className="h-full w-full object-cover" />
        ) : (
          <>
            <span className="text-4xl">📷</span>
            <span className="text-sm font-medium">{processing ? 'Processing…' : 'Tap to take a photo'}</span>
          </>
        )}
      </button>

      {photoUrl && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-sm font-medium text-(--color-primary) underline"
        >
          Retake photo
        </button>
      )}

      {error && <p className="text-sm text-(--color-danger)">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        capture="environment"
        onChange={handleFileChange}
        className="hidden"
      />
    </div>
  )
}
