import api from '@/constants/Api';
import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

export type AppointmentStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'CANCELLED'
  | 'COMPLETED';

export interface Appointment {
  id: number;
  appointmentDate: string;
  status: AppointmentStatus;
  reason?: string | null;
  doctor?: {
    fullName?: string | null;
    specialty?: string | null;
  } | null;
  patient?: {
    fullName?: string | null;
    patientCode?: string | null;
  } | null;
}

export async function getAppointments(): Promise<Appointment[]> {
  const token = await SecureStore.getItemAsync('userToken');
  const headers = token ? { Authorization: `Bearer ${token}` } : undefined;

  try {
    const response = await api.get<Appointment[]>('/appointments', { headers });
    return Array.isArray(response.data) ? response.data : [];
  } catch (error) {
    if (!axios.isAxiosError(error) || error.response?.status !== 404) {
      throw error;
    }

    const response = await api.get<Appointment[]>('/appointment/my-appointments', {
      headers,
    });
    return Array.isArray(response.data) ? response.data : [];
  }
}
