import { useParams } from 'react-router-dom'
import EmptyState from '@/components/ui/EmptyState'
import ErrorState from '@/components/ui/ErrorState'
import Spinner from '@/components/ui/Spinner'
import LogForm from '@/features/log/components/LogForm'
import { useLogDetail } from '@/features/log/hooks/useLogDetail'
import { useLogForm } from '@/features/log/hooks/useLogForm'

export default function LogEditPage() {
  const { id } = useParams<{ id: string }>()
  const { log, loading, error: loadError } = useLogDetail(id!)
  const { updateExisting, submitting, error: saveError } = useLogForm()

  if (loading) return <Spinner label="Loading log…" />
  if (loadError) return <ErrorState message={loadError} />
  if (!log) return <EmptyState title="Log not found" message="It may have been deleted." />

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold">Edit Log</h1>
      <LogForm
        log={log}
        onSave={(input) => updateExisting(log.id, input)}
        saving={submitting}
        error={saveError}
      />
    </div>
  )
}
