import { axiosInstance } from '@/api/axios'
import { type UnknownRecord } from '@/utils/record'

export async function getAdminAppointments(): Promise<UnknownRecord[]> {
  const { data } = await axiosInstance.get<UnknownRecord[]>('/appointment/admin-all')

  return data
}

export async function getDoctorAppointments(): Promise<UnknownRecord[]> {
  const { data } = await axiosInstance.get<UnknownRecord[]>('/appointment/doctor-appointments')

  return data
}

export async function getTodayAppointments(): Promise<UnknownRecord[]> {
  const { data } = await axiosInstance.get<UnknownRecord[]>('/appointments/today')

  return data
}

export async function getAppointmentQueue(appointmentId: number): Promise<UnknownRecord> {
  const { data } = await axiosInstance.get<UnknownRecord>('/appointments/queue', {
    params: { appointmentId },
  })

  return data
}

export async function updateAppointmentStatus(
  appointmentId: string,
  status: string,
): Promise<UnknownRecord> {
  const { data } = await axiosInstance.patch<UnknownRecord>(
    `/appointment/${appointmentId}/status`,
    {
      status,
    },
  )

  return data
}
