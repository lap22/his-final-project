import api from './api';

export interface CurrentUserProfile {
  id: number;
  email: string;
  name?: string | null;
  fullName?: string | null;
  phone?: string | number | null;
  avatar?: string | null;
  roleId?: number;
  createdAt?: string;
}

export async function getCurrentUserProfile(): Promise<CurrentUserProfile> {
  const response = await api.get<CurrentUserProfile>('/user/me');
  return response.data;
}
