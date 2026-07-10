import { Navigate } from 'react-router-dom'
import { type PropsWithChildren } from 'react'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'
import { getLoginRedirectPath } from '@/routes/auth'
import { type UserRole } from '@/types/auth'

interface RoleRouteProps extends PropsWithChildren {
  allowedRoles: readonly UserRole[]
}

export function RoleRoute({ allowedRoles, children }: RoleRouteProps) {
  const { role } = useAuth()

  if (!role) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to={getLoginRedirectPath(role)} replace />
  }

  return children
}
