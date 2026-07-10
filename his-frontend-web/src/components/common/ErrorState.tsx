import ErrorOutlineIcon from '@mui/icons-material/ErrorOutlineOutlined'
import { Alert, Box, Button } from '@mui/material'

interface ErrorStateProps {
  message?: string
  onRetry?: () => void
}

export function ErrorState({
  message = 'Không thể tải dữ liệu. Vui lòng thử lại.',
  onRetry,
}: ErrorStateProps) {
  return (
    <Box sx={{ display: 'grid', gap: 2, py: 3 }}>
      <Alert severity="error" icon={<ErrorOutlineIcon />}>
        {message}
      </Alert>
      {onRetry && (
        <Button variant="outlined" onClick={onRetry} sx={{ justifySelf: 'start' }}>
          Thử lại
        </Button>
      )}
    </Box>
  )
}
