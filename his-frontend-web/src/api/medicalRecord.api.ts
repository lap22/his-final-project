import { axiosInstance } from '@/api/axios'
import { type UnknownRecord } from '@/utils/record'

export async function getMedicalRecordsByProfile(profileId: number): Promise<UnknownRecord[]> {
  const { data } = await axiosInstance.get<UnknownRecord[]>('/medical-records', {
    params: { profileId },
  })

  return data
}
