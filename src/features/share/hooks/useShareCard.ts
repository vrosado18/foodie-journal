import { useEffect, useState } from 'react'
import type { LogEntry } from '@/types'
import { generateShareCardBlob } from '@/utils/shareImage'

type Status = 'generating' | 'ready' | 'error'

export function useShareCard(log: LogEntry) {
  const [status, setStatus] = useState<Status>('generating')
  const [blob, setBlob] = useState<Blob | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false
    let objectUrl: string | null = null

    setStatus('generating')
    generateShareCardBlob({
      photoUrl: log.photoUrl,
      spotName: log.spotName,
      dishName: log.dishName,
      score: log.score,
      price: log.price,
    })
      .then((result) => {
        if (cancelled) return
        objectUrl = URL.createObjectURL(result)
        setBlob(result)
        setPreviewUrl(objectUrl)
        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('error')
      })

    return () => {
      cancelled = true
      if (objectUrl) URL.revokeObjectURL(objectUrl)
    }
  }, [log])

  return { status, blob, previewUrl }
}
