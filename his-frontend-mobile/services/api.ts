import axios, { AxiosError } from 'axios';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

export const ACCESS_TOKEN_KEY = 'userToken';

const extra = Constants.expoConfig?.extra as { apiBaseUrl?: string } | undefined;

function getDevApiBaseUrl() {
  const hostUri =
    Constants.expoConfig?.hostUri ??
    Constants.manifest2?.extra?.expoClient?.hostUri;

  const host = hostUri?.split(':')[0];

  if (!host) {
    return Platform.OS === 'android' ? 'http://10.0.2.2:3000' : 'http://localhost:3000';
  }

  const apiHost =
    Platform.OS === 'android' && (host === 'localhost' || host === '127.0.0.1')
      ? '10.0.2.2'
      : host;

  return `http://${apiHost}:3000`;
}

export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_BASE_URL ??
  extra?.apiBaseUrl ??
  getDevApiBaseUrl();

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
