import Button from '@/components/ui/Button'
import TagInput from '../TagInput'

interface DetailsStepProps {
  note?: string
  tags: string[]
  onNoteChange: (note: string) => void
  onTagsChange: (tags: string[]) => void
  onSave: () => void
  saving: boolean
  error: string | null
}

export default function DetailsStep({
  note,
  tags,
  onNoteChange,
  onTagsChange,
  onSave,
  saving,
  error,
}: DetailsStepProps) {
  return (
    <div className="flex flex-col gap-5 py-4">
      <h2 className="text-xl font-bold">Any last words?</h2>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="note" className="text-sm font-medium text-(--color-ink)">
          Note <span className="font-normal text-(--color-ink-muted)">(optional)</span>
        </label>
        <input
          id="note"
          type="text"
          placeholder="This meal is a hail mary touchdown…"
          value={note ?? ''}
          onChange={(event) => onNoteChange(event.target.value)}
          className="h-11 rounded-(--radius-md) border border-slate-200 px-3 text-base outline-none focus-visible:border-(--color-primary)"
        />
      </div>

      <TagInput tags={tags} onChange={onTagsChange} />

      {error && (
        <p role="alert" className="text-sm text-(--color-danger)">
          {error}
        </p>
      )}

      <Button onClick={onSave} disabled={saving} className="w-full">
        {saving ? 'Saving…' : 'Save Log'}
      </Button>
    </div>
  )
}
