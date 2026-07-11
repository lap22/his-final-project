import LockOutlinedIcon from '@mui/icons-material/LockOutlined'
import { Box, Button, Paper, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

export function ForbiddenPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 2 }}>
      <Paper variant="outlined" sx={{ maxWidth: 420, p: 4, textAlign: 'center' }}>
        <LockOutlinedIcon color="warning" sx={{ fontSize: 48, mb: 2 }} />
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          403
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
          You do not have permission to access this page.
        </Typography>
        <Button component={RouterLink} to={ROUTES.LOGIN} variant="contained">
          Back to login
        </Button>
      </Paper>
    </Box>
  )
}
