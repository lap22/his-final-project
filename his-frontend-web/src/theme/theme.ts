import { createTheme } from '@mui/material/styles'
import { palette } from '@/theme/palette'
import { shadows } from '@/theme/shadows'
import { spacing } from '@/theme/spacing'
import { typography } from '@/theme/typography'

export const theme = createTheme({
  palette,
  shadows,
  spacing,
  typography,
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          transition: 'background-color 160ms ease, color 160ms ease',
        },
        '@media (prefers-color-scheme: dark)': {
          ':root': {
            colorScheme: 'dark',
          },
        },
      },
    },
  },
})
