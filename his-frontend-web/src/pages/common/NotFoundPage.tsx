import SearchOffIcon from '@mui/icons-material/SearchOff'
import { Box, Button, Paper, Typography } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { ROUTES } from '@/constants/routes'

export function NotFoundPage() {
  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 2 }}>
      <Paper variant="outlined" sx={{ maxWidth: 420, p: 4, textAlign: 'center' }}>
        <SearchOffIcon color="primary" sx={{ fontSize: 48, mb: 2 }} />
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          404
        </Typography>
        <Typography color="text.secondary" sx={{ mt: 1, mb: 3 }}>
          The page you are looking for does not exist.
        </Typography>
        <Button component={RouterLink} to={ROUTES.LOGIN} variant="contained">
          Back to login
        </Button>
      </Paper>
    </Box>
  )
}
