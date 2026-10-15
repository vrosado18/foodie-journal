import { useState } from 'react'
import Button from '@/components/ui/Button'

const SLIDES = [
  {
    emoji: '📸',
    title: 'Never forget a great meal',
    body: "Snap a photo, log it in under 30 seconds, and find it again whenever you need it.",
  },
  {
    emoji: '🏈',
    title: 'Rate it like a pro',
    body: 'From Fumble to Hail Mary Touchdown — our Playbook score makes rating meals quick and fun.',
  },
  {
    emoji: '🔥',
    title: 'Build your highlight reel',
    body: 'Search your journal, share your best bites, and build your own Hall of Fame.',
  },
]

export default function OnboardingCarousel({ onDone }: { onDone: () => void }) {
  const [index, setIndex] = useState(0)
  const slide = SLIDES[index]
  const isLast = index === SLIDES.length - 1

  return (
    <div className="flex min-h-dvh flex-col items-center justify-between p-6 text-center">
      <button
        type="button"
        onClick={onDone}
        className="self-end text-sm font-medium text-(--color-ink-muted)"
      >
        Skip
      </button>

      <div className="flex flex-col items-center gap-4">
        <span className="text-6xl">{slide.emoji}</span>
        <h1 className="text-2xl font-bold">{slide.title}</h1>
        <p className="max-w-sm text-(--color-ink-muted)">{slide.body}</p>
      </div>

      <div className="flex w-full max-w-sm flex-col items-center gap-4">
        <div className="flex gap-1.5">
          {SLIDES.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-6 rounded-full ${i === index ? 'bg-(--color-primary)' : 'bg-slate-200'}`}
            />
          ))}
        </div>
        <Button
          className="w-full"
          onClick={() => (isLast ? onDone() : setIndex((i) => i + 1))}
        >
          {isLast ? 'Get Started' : 'Next'}
        </Button>
      </div>
    </div>
  )
}
