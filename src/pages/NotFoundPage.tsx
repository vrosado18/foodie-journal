import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-dvh flex-col items-center justify-center gap-4 p-6 text-center">
      <h1 className="text-2xl font-bold">Page not found</h1>
      <Link to="/" className="text-(--color-primary) underline">
        Back to Journal
      </Link>
    </div>
  )
}
