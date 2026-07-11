import { ConfirmDialog } from '@/components/dialogs/ConfirmDialog'

interface DeleteDialogProps {
  open: boolean
  title?: string
  description?: string
  isLoading?: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteDialog({
  open,
  title = 'Delete item',
  description = 'Are you sure you want to delete this item?',
  isLoading,
  onClose,
  onConfirm,
}: DeleteDialogProps) {
  return (
    <ConfirmDialog
      open={open}
      title={title}
      description={description}
      confirmLabel="Delete"
      isLoading={isLoading}
      onClose={onClose}
      onConfirm={onConfirm}
    />
  )
}
