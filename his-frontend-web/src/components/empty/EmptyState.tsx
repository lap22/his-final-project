import InboxOutlinedIcon from '@mui/icons-material/InboxOutlined'
import { Box, Typography } from '@mui/material'

interface EmptyStateProps {
  title?: string
  description?: string
}

export function EmptyState({
  title = 'Chưa có dữ liệu',
  description = 'Dữ liệu sẽ hiển thị tại đây khi hệ thống có thông tin.',
}: EmptyStateProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        justifyItems: 'center',
        gap: 1,
        py: 6,
        color: 'text.secondary',
      }}
    >
      <InboxOutlinedIcon fontSize="large" />
      <Typography sx={{ fontWeight: 700 }}>{title}</Typography>
      <Typography variant="body2">{description}</Typography>
    </Box>
  )
}
