import OnboardingCarousel from '@/features/onboarding/components/OnboardingCarousel'
import { useOnboarding } from '@/features/onboarding/hooks/useOnboarding'

export default function OnboardingPage() {
  const { finishOnboarding } = useOnboarding()
  return <OnboardingCarousel onDone={() => void finishOnboarding()} />
}
