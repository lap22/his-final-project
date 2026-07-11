import NavigateNextIcon from '@mui/icons-material/NavigateNext'
import { Breadcrumbs, Link, Typography } from '@mui/material'
import { Link as RouterLink, useLocation } from 'react-router-dom'

function formatSegment(segment: string): string {
  return segment
    .split('-')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

export function AppBreadcrumbs() {
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)

  if (segments.length === 0) {
    return null
  }

  return (
    <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />} sx={{ mb: 2 }}>
      <Link component={RouterLink} to="/" underline="hover" color="inherit">
        Home
      </Link>
      {segments.map((segment, index) => {
        const href = `/${segments.slice(0, index + 1).join('/')}`
        const isLast = index === segments.length - 1
        const label = formatSegment(segment)

        if (isLast) {
          return (
            <Typography key={href} color="text.primary" sx={{ fontWeight: 600 }}>
              {label}
            </Typography>
          )
        }

        return (
          <Link key={href} component={RouterLink} to={href} underline="hover" color="inherit">
            {label}
          </Link>
        )
      })}
    </Breadcrumbs>
  )
}
