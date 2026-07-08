import axios, { AxiosError } from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

export const ACCESS_TOKEN_KEY = 'userToken';

const extra = Constants.expoConfig?.extra as { apiBaseUrl?: string } | undefined;

export const API_BASE_URL =
  extra?.apiBaseUrl ?? process.env.EXPO_PUBLIC_API_BASE_URL ?? '';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export function getApiErrorMessage(error: unknown, fallback: string) {
  if (!axios.isAxiosError(error)) {
    return fallback;
  }

  const axiosError = error as AxiosError<{ message?: string | string[]; error?: string }>;
  const serverMessage = axiosError.response?.data?.message;

  if (Array.isArray(serverMessage)) {
    return serverMessage.join('\n');
  }

  if (typeof serverMessage === 'string') {
    return serverMessage;
  }

  return axiosError.response?.data?.error ?? fallback;
}

export default api;
