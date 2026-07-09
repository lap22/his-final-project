import api from './api';

export interface PatientProfile {
  id: number;
  userId?: number;
  fullName: string;
  phone?: string | null;
  gender?: 'MALE' | 'FEMALE' | 'OTHER' | null;
  birthday?: string | null;
  address?: string | null;
  bloodType?: string | null;
  insuranceNumber?: string | null;
  emergencyContact?: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePatientProfilePayload {
  fullName: string;
  phone?: string;
  gender?: 'MALE' | 'FEMALE' | 'OTHER';
  birthday?: string;
  address?: string;
  bloodType?: string;
  insuranceNumber?: string;
  emergencyContact?: string;
}

export async function getMyFamilyProfiles(): Promise<PatientProfile[]> {
  const response = await api.get<PatientProfile[]>('/patient-profiles/my-family');
  return Array.isArray(response.data) ? response.data : [];
}

export async function getPatientProfile(id: number): Promise<PatientProfile> {
  const response = await api.get<PatientProfile>(`/patient-profiles/${id}`);
  return response.data;
}

export async function createPatientProfile(
  payload: CreatePatientProfilePayload,
): Promise<PatientProfile> {
  const response = await api.post<PatientProfile>('/patient-profiles', payload);
  return response.data;
}

export async function updatePatientProfile(
  id: number,
  payload: Partial<CreatePatientProfilePayload>,
): Promise<PatientProfile> {
  const response = await api.patch<PatientProfile>(`/patient-profiles/${id}`, payload);
  return response.data;
}

export async function deletePatientProfile(id: number): Promise<{ message: string }> {
  const response = await api.delete<{ message: string }>(`/patient-profiles/${id}`);
  return response.data;
}
