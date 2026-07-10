import { Paper, Typography } from '@mui/material'

interface MetricCardProps {
  label: string
  value: number | string
}

export function MetricCard({ label, value }: MetricCardProps) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5 }}>
      <Typography color="text.secondary" variant="body2">
        {label}
      </Typography>
      <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
        {value}
      </Typography>
    </Paper>
  )
}
