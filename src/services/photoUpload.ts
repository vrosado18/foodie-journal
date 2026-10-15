import { generateId } from './idGenerator'
import { supabase } from './supabaseClient'

const BUCKET = 'log-photos'

function dataUrlToBlob(dataUrl: string): Blob {
  const [header, base64] = dataUrl.split(',')
  const mime = /data:(.*);base64/.exec(header)?.[1] ?? 'image/jpeg'
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return new Blob([bytes], { type: mime })
}

/** Uploads a freshly-compressed photo (a data: URL) to Storage and returns its public URL. */
export async function uploadLogPhoto(userId: string, dataUrl: string): Promise<string> {
  const blob = dataUrlToBlob(dataUrl)
  const path = `${userId}/${generateId()}.jpg`
  const { error } = await supabase.storage.from(BUCKET).upload(path, blob, { contentType: 'image/jpeg' })
  if (error) throw new Error(error.message)
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path)
  return data.publicUrl
}
