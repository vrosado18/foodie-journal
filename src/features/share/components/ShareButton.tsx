import Button from '@/components/ui/Button'

interface ShareButtonProps {
  blob: Blob | null
  fileName: string
}

const supportsFileShare = typeof navigator.canShare === 'function'

export default function ShareButton({ blob, fileName }: ShareButtonProps) {
  async function handleShare() {
    if (!blob) return
    const file = new File([blob], fileName, { type: 'image/jpeg' })

    if (supportsFileShare && navigator.canShare({ files: [file] })) {
      try {
        await navigator.share({ files: [file], title: 'Foodie Journal' })
        return
      } catch {
        // User cancelled or share failed — fall through to download.
      }
    }

    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = fileName
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Button onClick={handleShare} disabled={!blob} className="w-full">
      {supportsFileShare ? 'Share to Instagram Stories' : 'Download Image'}
    </Button>
  )
}
