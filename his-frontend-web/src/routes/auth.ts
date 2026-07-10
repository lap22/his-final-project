import { ROLES } from '@/constants/roles'
import { ROUTES } from '@/constants/routes'
import { type UserRole } from '@/types/auth'

export function getLoginRedirectPath(role: UserRole): string {
  switch (role) {
    case ROLES.ADMIN:
      return ROUTES.ADMIN.DASHBOARD
    case ROLES.DOCTOR:
      return ROUTES.DOCTOR.DASHBOARD
    case ROLES.PATIENT:
      return ROUTES.ROOT
  }
}
