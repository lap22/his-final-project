import { Box, CircularProgress, Typography } from '@mui/material'

interface LoadingStateProps {
  label?: string
}

export function LoadingState({ label = 'Đang tải dữ liệu...' }: LoadingStateProps) {
  return (
    <Box sx={{ display: 'grid', justifyItems: 'center', gap: 2, py: 6 }}>
      <CircularProgress />
      <Typography color="text.secondary">{label}</Typography>
    </Box>
  )
}
