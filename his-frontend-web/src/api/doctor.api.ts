import { axiosInstance } from '@/api/axios'
import { type UnknownRecord } from '@/utils/record'

export async function getDoctors(): Promise<UnknownRecord[]> {
  const { data } = await axiosInstance.get<UnknownRecord[]>('/doctor')

  return data
}

export async function getDoctorProfile(): Promise<UnknownRecord> {
  const { data } = await axiosInstance.get<UnknownRecord>('/doctor/profile')

  return data
}
