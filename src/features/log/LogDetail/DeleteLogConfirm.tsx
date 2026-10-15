import ConfirmDialog from '@/components/ui/ConfirmDialog'

interface DeleteLogConfirmProps {
  open: boolean
  onClose: () => void
  onConfirm: () => void
}

export default function DeleteLogConfirm({ open, onClose, onConfirm }: DeleteLogConfirmProps) {
  return (
    <ConfirmDialog
      open={open}
      onClose={onClose}
      onConfirm={onConfirm}
      title="Delete this log?"
      message="This can't be undone."
      confirmLabel="Delete"
      danger
    />
  )
}
