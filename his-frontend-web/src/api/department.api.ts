import { axiosInstance } from '@/api/axios'
import { type UnknownRecord } from '@/utils/record'

export async function getDepartments(): Promise<UnknownRecord[]> {
  const { data } = await axiosInstance.get<UnknownRecord[]>('/specialties')

  return data
}
