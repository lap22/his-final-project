import { axiosInstance } from '@/api/axios'
import { type UnknownRecord } from '@/utils/record'

export async function getCurrentUserProfile(): Promise<UnknownRecord> {
  const { data } = await axiosInstance.get<UnknownRecord>('/user/me')

  return data
}
