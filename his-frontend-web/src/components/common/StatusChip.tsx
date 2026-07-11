import { Chip, type ChipProps } from '@mui/material'

type StatusTone = 'default' | 'success' | 'warning' | 'error' | 'info'

const STATUS_COLOR_MAP: Record<string, StatusTone> = {
  ACTIVE: 'success',
  COMPLETED: 'success',
  CONFIRMED: 'success',
  DONE: 'success',
  INACTIVE: 'default',
  PENDING: 'warning',
  WAITING: 'warning',
  CANCELLED: 'error',
  CANCELED: 'error',
  ERROR: 'error',
  DRAFT: 'info',
}

interface StatusChipProps extends Omit<ChipProps, 'color' | 'label'> {
  status: string
}

export function StatusChip({
  status,
  size = 'small',
  variant = 'outlined',
  ...props
}: StatusChipProps) {
  const normalizedStatus = status.toUpperCase()
  const color = STATUS_COLOR_MAP[normalizedStatus] ?? 'default'

  return <Chip {...props} label={status || '-'} color={color} size={size} variant={variant} />
}
