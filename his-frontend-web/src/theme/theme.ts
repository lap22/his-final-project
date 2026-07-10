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
})
