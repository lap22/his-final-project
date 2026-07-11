import { Box, Card, CardContent, Typography, type CardProps } from '@mui/material'
import { type ReactNode } from 'react'

interface StatisticCardProps extends Omit<CardProps, 'title'> {
  title: string
  value: number | string
  helperText?: string
  icon?: ReactNode
}

export function StatisticCard({ title, value, helperText, icon, ...props }: StatisticCardProps) {
  return (
    <Card variant="outlined" {...props}>
      <CardContent>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: 2,
          }}
        >
          <Box>
            <Typography color="text.secondary" variant="body2">
              {title}
            </Typography>
            <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
              {value}
            </Typography>
          </Box>
          {icon}
        </Box>
        {helperText && (
          <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
            {helperText}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}
