import { LinearProgress } from '@mui/material'
import { useIsFetching, useIsMutating } from '@tanstack/react-query'

export function GlobalLoading() {
  const fetchingCount = useIsFetching()
  const mutatingCount = useIsMutating()
  const isLoading = fetchingCount + mutatingCount > 0

  if (!isLoading) {
    return null
  }

  return (
    <LinearProgress
      sx={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: (theme) => theme.zIndex.tooltip + 1,
      }}
    />
  )
}
