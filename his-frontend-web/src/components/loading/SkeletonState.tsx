import { Box, Skeleton } from '@mui/material'

interface SkeletonStateProps {
  rows?: number
}

export function SkeletonState({ rows = 4 }: SkeletonStateProps) {
  return (
    <Box sx={{ display: 'grid', gap: 2 }}>
      <Skeleton variant="rounded" height={72} />
      {Array.from({ length: rows }).map((_, index) => (
        <Skeleton key={index} variant="rounded" height={48} />
      ))}
    </Box>
  )
}
