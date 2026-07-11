import { CssBaseline, ThemeProvider } from '@mui/material'
import { QueryClientProvider } from '@tanstack/react-query'
import { type PropsWithChildren } from 'react'
import { ToastContainer } from 'react-toastify'
import { GlobalLoading } from '@/components/loading/GlobalLoading'
import { AuthProvider } from '@/providers/AuthProvider'
import { queryClient } from '@/providers/queryClient'
import { theme } from '@/theme/theme'
import 'react-toastify/dist/ReactToastify.css'

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <AuthProvider>
          <CssBaseline />
          <GlobalLoading />
          {children}
          <ToastContainer position="top-right" autoClose={3000} theme="colored" />
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
