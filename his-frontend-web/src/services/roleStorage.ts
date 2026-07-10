import { ROLES } from '@/constants/roles'
import { type UserRole } from '@/types/auth'

const ROLE_STORAGE_KEY = 'userRole'

function isUserRole(value: string | null): value is UserRole {
  return value === ROLES.ADMIN || value === ROLES.DOCTOR || value === ROLES.PATIENT
}

export const roleStorage = {
  getRole(): UserRole | null {
    const role = window.localStorage.getItem(ROLE_STORAGE_KEY)

    if (!isUserRole(role)) {
      return null
    }

    return role
  },

  setRole(role: UserRole): void {
    window.localStorage.setItem(ROLE_STORAGE_KEY, role)
  },

  clearRole(): void {
    window.localStorage.removeItem(ROLE_STORAGE_KEY)
  },
}
