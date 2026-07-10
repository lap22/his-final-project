import { Box, Paper, Typography } from '@mui/material'

export interface DetailItem {
  label: string
  value: string
}

interface DetailsCardProps {
  title: string
  items: readonly DetailItem[]
}

export function DetailsCard({ title, items }: DetailsCardProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5 }}>
      <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
        {title}
      </Typography>
      <Box sx={{ display: 'grid', gap: 1.5 }}>
        {items.map((item) => (
          <Box key={item.label} sx={{ display: 'grid', gap: 0.25 }}>
            <Typography color="text.secondary" variant="body2">
              {item.label}
            </Typography>
            <Typography sx={{ fontWeight: 600 }}>{item.value}</Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  )
}
