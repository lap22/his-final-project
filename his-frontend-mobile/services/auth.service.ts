import * as SecureStore from 'expo-secure-store';
import api, { ACCESS_TOKEN_KEY } from './api';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  phone?: string;
  password: string;
  roleId?: number;
}

export interface AuthResponse {
  accessToken?: string;
  refreshToken?: string;
  user?: {
    id: number;
    email: string;
    name?: string;
    role?: number;
  };
}

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/login', payload);

  if (response.data.accessToken) {
    await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, response.data.accessToken);
  }

  return response.data;
}

export async function register(payload: RegisterPayload): Promise<AuthResponse> {
  const response = await api.post<AuthResponse>('/auth/register', {
    ...payload,
    roleId: payload.roleId ?? 3,
  });

  return response.data;
}

export async function logout() {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
}

export async function getAccessToken() {
  return SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
}
