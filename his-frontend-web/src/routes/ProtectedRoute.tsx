import { Navigate, useLocation } from 'react-router-dom'
import { type PropsWithChildren } from 'react'
import { ROUTES } from '@/constants/routes'
import { useAuth } from '@/hooks/useAuth'

export function ProtectedRoute({ children }: PropsWithChildren) {
  const location = useLocation()
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace state={{ from: location }} />
  }

  return children
}
