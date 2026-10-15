import { Link } from 'react-router-dom'
import Spinner from '@/components/ui/Spinner'
import type { Spot } from '@/types'
import { useLogForm } from '../hooks/useLogForm'
import { useQuickLogDraft } from '../hooks/useQuickLogDraft'
import DetailsStep from './steps/DetailsStep'
import PhotoStep from './steps/PhotoStep'
import PriceScoreStep from './steps/PriceScoreStep'
import SpotDishStep from './steps/SpotDishStep'

const STEP_COUNT = 4

export default function QuickLogFlow() {
  const { draft, updateDraft, clearDraft } = useQuickLogDraft()
  const { createFromDraft, submitting, error } = useLogForm()

  if (!draft) {
    return <Spinner label="Loading your draft…" />
  }

  const step = Math.min(draft.step ?? 0, STEP_COUNT - 1)

  function goToStep(next: number) {
    updateDraft({ step: next })
  }

  function handleSpotSelected(spot: Spot) {
    updateDraft({ spotId: spot.id, spotName: spot.name })
  }

  async function handleSave() {
    const success = await createFromDraft(draft!)
    if (success) clearDraft()
  }

  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-md flex-col px-4">
      <div className="flex items-center justify-between py-4">
        {step > 0 ? (
          <button
            type="button"
            onClick={() => goToStep(step - 1)}
            className="flex h-10 w-10 items-center justify-center rounded-full text-(--color-ink-muted) hover:bg-slate-100"
            aria-label="Back"
          >
            ←
          </button>
        ) : (
          <span className="h-10 w-10" />
        )}

        <div className="flex gap-1.5" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={STEP_COUNT}>
          {Array.from({ length: STEP_COUNT }).map((_, i) => (
            <span
              key={i}
              className={`h-1.5 w-6 rounded-full ${i <= step ? 'bg-(--color-primary)' : 'bg-slate-200'}`}
            />
          ))}
        </div>

        <Link
          to="/"
          className="flex h-10 w-10 items-center justify-center rounded-full text-(--color-ink-muted) hover:bg-slate-100"
          aria-label="Close"
        >
          ✕
        </Link>
      </div>

      <div className="flex-1">
        {step === 0 && (
          <PhotoStep
            photoUrl={draft.photoUrl}
            onPhotoReady={(photoUrl) => updateDraft({ photoUrl, step: 1 })}
          />
        )}

        {step === 1 && (
          <SpotDishStep
            spotName={draft.spotName}
            dishName={draft.dishName}
            onSpotNameChange={(spotName) => updateDraft({ spotName, spotId: undefined })}
            onSelectSpot={handleSpotSelected}
            onDishNameChange={(dishName) => updateDraft({ dishName })}
            onNext={() => goToStep(2)}
          />
        )}

        {step === 2 && (
          <PriceScoreStep
            price={draft.price}
            score={draft.score}
            onPriceChange={(price) => updateDraft({ price })}
            onScoreSelect={(score) => updateDraft({ score, step: 3 })}
          />
        )}

        {step === 3 && (
          <DetailsStep
            note={draft.note}
            tags={draft.tags ?? []}
            onNoteChange={(note) => updateDraft({ note })}
            onTagsChange={(tags) => updateDraft({ tags })}
            onSave={handleSave}
            saving={submitting}
            error={error}
          />
        )}
      </div>
    </div>
  )
}
