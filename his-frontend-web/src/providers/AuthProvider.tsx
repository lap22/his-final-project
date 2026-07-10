import { type PropsWithChildren, useMemo, useState } from 'react'
import { AuthContext } from '@/providers/authContext'
import { roleStorage } from '@/services/roleStorage'
import { tokenStorage } from '@/services/tokenStorage'
import { type AuthContextValue, type AuthSession } from '@/types/auth'

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<AuthSession | null>(null)
  const [storedRole, setStoredRole] = useState(() => {
    if (tokenStorage.isAccessTokenExpired()) {
      tokenStorage.clearTokens()
      roleStorage.clearRole()
      return null
    }

    return roleStorage.getRole()
  })
  const [storedAccessToken, setStoredAccessToken] = useState(() => {
    if (tokenStorage.isAccessTokenExpired()) {
      tokenStorage.clearTokens()
      roleStorage.clearRole()
      return null
    }

    return tokenStorage.getAccessToken()
  })

  const value = useMemo<AuthContextValue>(
    () => ({
      session,
      user: session?.user ?? null,
      role: session?.role ?? storedRole,
      isAuthenticated: Boolean(session?.accessToken ?? storedAccessToken),
      login(nextSession) {
        tokenStorage.setTokens({
          accessToken: nextSession.accessToken,
          refreshToken: nextSession.refreshToken,
        })
        roleStorage.setRole(nextSession.role)
        setStoredAccessToken(nextSession.accessToken)
        setStoredRole(nextSession.role)
        setSession(nextSession)
      },
      logout() {
        tokenStorage.clearTokens()
        roleStorage.clearRole()
        setStoredAccessToken(null)
        setStoredRole(null)
        setSession(null)
      },
      setAuthSession(nextSession) {
        tokenStorage.setTokens({
          accessToken: nextSession.accessToken,
          refreshToken: nextSession.refreshToken,
        })
        roleStorage.setRole(nextSession.role)
        setStoredAccessToken(nextSession.accessToken)
        setStoredRole(nextSession.role)
        setSession(nextSession)
      },
      clearAuthSession() {
        tokenStorage.clearTokens()
        roleStorage.clearRole()
        setStoredAccessToken(null)
        setStoredRole(null)
        setSession(null)
      },
    }),
    [session, storedAccessToken, storedRole],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
