import { useState, type ChangeEvent, type FormEvent } from 'react'
import Button from '@/components/ui/Button'
import type { LogEntry, Spot } from '@/types'
import { compressImage } from '@/utils/image'
import ScoreSelector from './ScoreSelector'
import SpotAutocomplete from './SpotAutocomplete'
import TagInput from './TagInput'

interface LogFormProps {
  log: LogEntry
  onSave: (input: Partial<LogEntry>) => void
  saving: boolean
  error: string | null
}

export default function LogForm({ log, onSave, saving, error }: LogFormProps) {
  const [photoUrl, setPhotoUrl] = useState(log.photoUrl)
  const [spotId, setSpotId] = useState<string | undefined>(log.spotId)
  const [spotName, setSpotName] = useState(log.spotName)
  const [dishName, setDishName] = useState(log.dishName)
  const [price, setPrice] = useState(log.price)
  const [score, setScore] = useState(log.score)
  const [note, setNote] = useState(log.note ?? '')
  const [tags, setTags] = useState(log.tags)

  function handleSelectSpot(spot: Spot) {
    setSpotId(spot.id)
    setSpotName(spot.name)
  }

  async function handlePhotoChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setPhotoUrl(await compressImage(file))
    event.target.value = ''
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    onSave({ photoUrl, spotId, spotName, dishName, price, score, note: note.trim() || undefined, tags })
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <label className="flex h-40 w-40 cursor-pointer items-center justify-center self-center overflow-hidden rounded-(--radius-lg) border border-slate-200">
        <img src={photoUrl} alt="" className="h-full w-full object-cover" />
        <input type="file" accept="image/*" onChange={handlePhotoChange} className="hidden" />
      </label>

      <SpotAutocomplete value={spotName} onChange={setSpotName} onSelectSpot={handleSelectSpot} />

      <div className="flex flex-col gap-1.5">
        <label htmlFor="edit-dish-name" className="text-sm font-medium text-(--color-ink)">
          Dish name
        </label>
        <input
          id="edit-dish-name"
          type="text"
          value={dishName}
          onChange={(event) => setDishName(event.target.value)}
          className="h-11 rounded-(--radius-md) border border-slate-200 px-3 text-base outline-none focus-visible:border-(--color-primary)"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="edit-price" className="text-sm font-medium text-(--color-ink)">
          Price
        </label>
        <input
          id="edit-price"
          type="number"
          inputMode="decimal"
          min={0}
          step="0.01"
          value={price}
          onChange={(event) => setPrice(Number(event.target.value))}
          className="h-11 rounded-(--radius-md) border border-slate-200 px-3 text-base outline-none focus-visible:border-(--color-primary)"
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <span className="text-sm font-medium text-(--color-ink)">Playbook score</span>
        <ScoreSelector value={score} onChange={setScore} />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="edit-note" className="text-sm font-medium text-(--color-ink)">
          Note
        </label>
        <input
          id="edit-note"
          type="text"
          value={note}
          onChange={(event) => setNote(event.target.value)}
          className="h-11 rounded-(--radius-md) border border-slate-200 px-3 text-base outline-none focus-visible:border-(--color-primary)"
        />
      </div>

      <TagInput tags={tags} onChange={setTags} />

      {error && (
        <p role="alert" className="text-sm text-(--color-danger)">
          {error}
        </p>
      )}

      <Button type="submit" disabled={saving} className="w-full">
        {saving ? 'Saving…' : 'Save Changes'}
      </Button>
    </form>
  )
}
