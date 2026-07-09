import api from './api';

export interface Prescription {
  id: number;
  medicineName: string;
  dosage: string;
  instruction: string;
  quantity?: number | null;
  durationDays?: number | null;
  days?: number | null;
}

export interface MedicalFile {
  id: number;
  fileName: string;
  fileUrl: string;
  fileType: string;
}

export interface MedicalRecord {
  id: number;
  patientProfileId?: number;
  appointmentId?: number;
  doctorId?: number;
  diagnosis: string;
  examinationResult?: string | null;
  note?: string | null;
  createdAt?: string;
  updatedAt?: string;
  hospitalName?: string | null;
  status?: string | null;
  appointment?: {
    id?: number;
    appointmentDate?: string;
    status?: string;
  } | null;
  doctor?: {
    id?: number;
    specialization?: string | null;
    fullName?: string | null;
    user?: {
      fullName?: string | null;
      email?: string | null;
    } | null;
  } | null;
  patientProfile?: {
    id: number;
    fullName?: string | null;
  } | null;
  prescriptions?: Prescription[];
  files?: MedicalFile[];
}

export async function getMedicalRecords(profileId: number): Promise<MedicalRecord[]> {
  const response = await api.get<MedicalRecord[]>('/medical-records', {
    params: { profileId },
  });

  return Array.isArray(response.data) ? response.data : [];
}

export async function getMedicalRecordsByPatient(
  patientId: number,
): Promise<MedicalRecord[]> {
  return getMedicalRecords(patientId);
}

export async function getMedicalRecordsForPatients(
  patientIds: number[],
): Promise<MedicalRecord[]> {
  if (patientIds.length === 0) {
    return [];
  }

  const recordGroups = await Promise.all(
    patientIds.map((patientId) => getMedicalRecordsByPatient(patientId)),
  );

  return recordGroups
    .flat()
    .sort((first, second) => {
      const firstTime = new Date(first.createdAt ?? first.appointment?.appointmentDate ?? 0).getTime();
      const secondTime = new Date(second.createdAt ?? second.appointment?.appointmentDate ?? 0).getTime();
      return secondTime - firstTime;
    });
}

export async function getMedicalRecordById(recordId: number): Promise<MedicalRecord> {
  const response = await api.get<MedicalRecord>(`/medical-records/${recordId}`);
  return response.data;
}
