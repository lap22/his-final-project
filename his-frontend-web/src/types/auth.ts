import { type ROLES } from '@/constants/roles'

export type UserRole = (typeof ROLES)[keyof typeof ROLES]

export interface AuthUser {
  id: string
  role: UserRole
  email?: string
  fullName?: string
  phone?: string
  metadata?: Record<string, unknown>
}

export interface AuthSession {
  accessToken: string
  refreshToken: string
  user: AuthUser
  role: UserRole
}

export interface AuthContextValue {
  session: AuthSession | null
  user: AuthUser | null
  role: UserRole | null
  isAuthenticated: boolean
  login: (session: AuthSession) => void
  logout: () => void
  setAuthSession: (session: AuthSession) => void
  clearAuthSession: () => void
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterUserRequest {
  email: string
  phone: string
  password: string
  name: string
  roleId: number
}

export interface BackendAuthUser {
  id: number | string
  email?: string
  name?: string
  phone?: string
  role: number | UserRole
}

export interface BackendLoginResponse {
  accessToken: string
  refreshToken: string
  user: BackendAuthUser
  message?: string
}
