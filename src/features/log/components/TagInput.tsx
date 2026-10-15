import { useState, type KeyboardEvent } from 'react'
import Chip from '@/components/ui/Chip'

interface TagInputProps {
  tags: string[]
  onChange: (tags: string[]) => void
}

export default function TagInput({ tags, onChange }: TagInputProps) {
  const [draft, setDraft] = useState('')

  function addTag() {
    const trimmed = draft.trim().toLowerCase()
    if (trimmed && !tags.includes(trimmed)) {
      onChange([...tags, trimmed])
    }
    setDraft('')
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault()
      addTag()
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <label htmlFor="tag-input" className="text-sm font-medium text-(--color-ink)">
        Tags <span className="font-normal text-(--color-ink-muted)">(optional)</span>
      </label>
      <input
        id="tag-input"
        type="text"
        placeholder="Add a tag and press Enter…"
        value={draft}
        onChange={(event) => setDraft(event.target.value)}
        onKeyDown={handleKeyDown}
        onBlur={addTag}
        className="h-11 rounded-(--radius-md) border border-slate-200 px-3 text-base outline-none focus-visible:border-(--color-primary)"
      />
      {tags.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {tags.map((tag) => (
            <Chip key={tag} selected onClick={() => onChange(tags.filter((t) => t !== tag))}>
              {tag} ✕
            </Chip>
          ))}
        </div>
      )}
    </div>
  )
}
