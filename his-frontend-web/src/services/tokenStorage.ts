const ACCESS_TOKEN_STORAGE_KEY = 'accessToken'
const REFRESH_TOKEN_STORAGE_KEY = 'refreshToken'

export interface StoredTokens {
  accessToken: string
  refreshToken: string
}

interface JwtPayload {
  exp?: number
}

function isJwtPayload(value: unknown): value is JwtPayload {
  return typeof value === 'object' && value !== null
}

function decodeJwtPayload(token: string): JwtPayload | null {
  const [, payload] = token.split('.')

  if (!payload) {
    return null
  }

  try {
    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/')
    const decodedPayload = window.atob(normalizedPayload)
    const parsedPayload: unknown = JSON.parse(decodedPayload)

    if (!isJwtPayload(parsedPayload)) {
      return null
    }

    return parsedPayload
  } catch {
    return null
  }
}

export const tokenStorage = {
  getAccessToken(): string | null {
    return window.localStorage.getItem(ACCESS_TOKEN_STORAGE_KEY)
  },

  getRefreshToken(): string | null {
    return window.localStorage.getItem(REFRESH_TOKEN_STORAGE_KEY)
  },

  setTokens(tokens: StoredTokens): void {
    window.localStorage.setItem(ACCESS_TOKEN_STORAGE_KEY, tokens.accessToken)
    window.localStorage.setItem(REFRESH_TOKEN_STORAGE_KEY, tokens.refreshToken)
  },

  clearTokens(): void {
    window.localStorage.removeItem(ACCESS_TOKEN_STORAGE_KEY)
    window.localStorage.removeItem(REFRESH_TOKEN_STORAGE_KEY)
  },

  isAccessTokenExpired(): boolean {
    const accessToken = this.getAccessToken()

    if (!accessToken) {
      return true
    }

    const payload = decodeJwtPayload(accessToken)

    if (!payload?.exp) {
      return false
    }

    return payload.exp * 1000 <= Date.now()
  },
}
