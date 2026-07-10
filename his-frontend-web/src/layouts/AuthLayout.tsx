import { Box } from '@mui/material'
import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <Box component="main" sx={{ minHeight: '100vh' }}>
      <Outlet />
    </Box>
  )
}
