import api from './api';

export interface Specialty {
  id: string;
  name: string;
  doctorCount?: number;
}

export async function getSpecialties(): Promise<Specialty[]> {
  const response = await api.get<Specialty[]>('/specialties');
  return Array.isArray(response.data) ? response.data : [];
}
