import { axiosInstance } from '@/api/axios'
import { mapLoginResponseToAuthSession } from '@/services/authMapper'
import {
  type AuthSession,
  type BackendLoginResponse,
  type LoginRequest,
  type RegisterUserRequest,
} from '@/types/auth'

export async function loginApi(payload: LoginRequest): Promise<AuthSession> {
  const { data } = await axiosInstance.post<BackendLoginResponse>('/auth/login', payload)

  return mapLoginResponseToAuthSession(data)
}

export async function registerUserApi(payload: RegisterUserRequest): Promise<BackendLoginResponse> {
  const { data } = await axiosInstance.post<BackendLoginResponse>('/auth/register', payload)

  return data
}
