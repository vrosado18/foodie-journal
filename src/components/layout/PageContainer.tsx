import type { ReactNode } from 'react'

export default function PageContainer({ children }: { children: ReactNode }) {
  return <div className="mx-auto w-full max-w-2xl px-4 py-4 md:px-6 md:py-8">{children}</div>
}
