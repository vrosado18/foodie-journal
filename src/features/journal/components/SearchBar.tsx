import { useEffect, useState } from 'react'
import { useDebouncedValue } from '@/utils/useDebouncedValue'

interface SearchBarProps {
  onSearch: (term: string) => void
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [value, setValue] = useState('')
  const debounced = useDebouncedValue(value, 250)

  useEffect(() => {
    onSearch(debounced)
  }, [debounced, onSearch])

  return (
    <div className="relative">
      <label htmlFor="journal-search" className="sr-only">
        Search by dish or spot
      </label>
      <input
        id="journal-search"
        type="search"
        inputMode="search"
        placeholder="Search dish or spot…"
        value={value}
        onChange={(event) => setValue(event.target.value)}
        className="h-11 w-full rounded-(--radius-md) border border-slate-200 px-4 text-base outline-none focus-visible:border-(--color-primary)"
      />
    </div>
  )
}
