import { useParams } from 'react-router-dom'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import Spinner from '@/components/ui/Spinner'
import LogDetailView from '@/features/log/LogDetail/LogDetailView'
import { useLogDetail } from '@/features/log/hooks/useLogDetail'

export default function LogDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { log, loading, error } = useLogDetail(id!)

  if (loading) return <Spinner label="Loading log…" />
  if (error) return <ErrorState message={error} />
  if (!log) return <EmptyState title="Log not found" message="It may have been deleted." />

  return <LogDetailView log={log} />
}
