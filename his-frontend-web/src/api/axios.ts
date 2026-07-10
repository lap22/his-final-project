import axios, { AxiosError, HttpStatusCode, type InternalAxiosRequestConfig } from 'axios'
import { env } from '@/constants/env'
import { ROUTES } from '@/constants/routes'
import { getLoginRedirectPath } from '@/routes/auth'
import { roleStorage } from '@/services/roleStorage'
import { tokenStorage } from '@/services/tokenStorage'

export const axiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
})

axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  if (tokenStorage.isAccessTokenExpired()) {
    tokenStorage.clearTokens()
    roleStorage.clearRole()
    window.location.assign(ROUTES.LOGIN)

    return config
  }

  const token = tokenStorage.getAccessToken()

  if (token) {
    config.headers.set('Authorization', `Bearer ${token}`)
  }

  return config
})

axiosInstance.interceptors.response.use(undefined, (error: AxiosError) => {
  const statusCode = error.response?.status

  switch (statusCode) {
    case HttpStatusCode.Unauthorized:
      tokenStorage.clearTokens()
      roleStorage.clearRole()
      window.location.assign(ROUTES.LOGIN)
      break
    case HttpStatusCode.Forbidden:
      {
        const role = roleStorage.getRole()

        if (role) {
          window.location.assign(getLoginRedirectPath(role))
        }
      }
      break
    case HttpStatusCode.InternalServerError:
      // TODO: Handle server error notification when global error UX is implemented.
      break
    default:
      break
  }

  return Promise.reject(error)
})
