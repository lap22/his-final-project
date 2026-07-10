import { ROLE_IDS, ROLES } from '@/constants/roles'
import { type AuthSession, type BackendLoginResponse, type UserRole } from '@/types/auth'

function mapRole(role: BackendLoginResponse['user']['role']): UserRole {
  if (role === ROLE_IDS.ADMIN || role === ROLES.ADMIN) {
    return ROLES.ADMIN
  }

  if (role === ROLE_IDS.DOCTOR || role === ROLES.DOCTOR) {
    return ROLES.DOCTOR
  }

  return ROLES.PATIENT
}

export function mapLoginResponseToAuthSession(response: BackendLoginResponse): AuthSession {
  const role = mapRole(response.user.role)

  return {
    accessToken: response.accessToken,
    refreshToken: response.refreshToken,
    role,
    user: {
      id: String(response.user.id),
      email: response.user.email,
      fullName: response.user.name,
      phone: response.user.phone,
      role,
    },
  }
}
