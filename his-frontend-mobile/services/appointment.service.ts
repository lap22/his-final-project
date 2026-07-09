import api from './api';

export type AppointmentStatus = 'PENDING' | 'APPROVED' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';

export interface Appointment {
  id: number;
  patientProfileId?: number;
  appointmentDate: string;
  status: AppointmentStatus;
  reason?: string | null;
  doctor?: {
    id?: number;
    fullName?: string | null;
    specialization?: string | null;
    specialty?: string | null;
    user?: {
      fullName?: string | null;
      email?: string | null;
    } | null;
  } | null;
  patientProfile?: {
    id: number;
    fullName?: string | null;
  } | null;
}

export interface CreateAppointmentPayload {
  patientProfileId: number;
  doctorId: number;
  scheduleId: number;
  appointmentDate: string;
  reason: string;
}

export async function getAppointments(profileId: number): Promise<Appointment[]> {
  const response = await api.get<Appointment[]>('/appointments', {
    params: { profileId },
  });

  return Array.isArray(response.data) ? response.data : [];
}

export async function createAppointment(
  payload: CreateAppointmentPayload,
): Promise<Appointment> {
  const response = await api.post<Appointment>('/appointment', payload);
  return response.data;
}
