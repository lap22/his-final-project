import api from './api';

export interface MedicalRecord {
  id: number;
  patientProfileId?: number;
  appointmentId?: number;
  doctorId?: number;
  diagnosis: string;
  examinationResult?: string | null;
  note?: string | null;
  createdAt?: string;
  doctor?: {
    id?: number;
    specialization?: string | null;
    user?: {
      fullName?: string | null;
      email?: string | null;
    } | null;
  } | null;
}

export async function getMedicalRecords(profileId: number): Promise<MedicalRecord[]> {
  const response = await api.get<MedicalRecord[]>('/medical-records', {
    params: { profileId },
  });

  return Array.isArray(response.data) ? response.data : [];
}
