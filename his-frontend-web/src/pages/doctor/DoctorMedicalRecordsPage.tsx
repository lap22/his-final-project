import { Box, Paper, TextField } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getMedicalRecordsByProfile } from '@/api/medicalRecord.api'
import { ErrorState } from '@/components/common/ErrorState'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/empty/EmptyState'
import { LoadingState } from '@/components/loading/LoadingState'
import { SimpleDataTable, type SimpleDataColumn } from '@/components/tables/SimpleDataTable'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { getStringValue, type UnknownRecord } from '@/utils/record'

const columns: readonly SimpleDataColumn[] = [
  {
    key: 'createdAt',
    label: 'Ngày tạo',
    render: (row) => getStringValue(row, ['createdAt', 'date']),
  },
  {
    key: 'diagnosis',
    label: 'Chẩn đoán',
    render: (row) => getStringValue(row, ['diagnosis']),
  },
  {
    key: 'treatment',
    label: 'Điều trị',
    render: (row) => getStringValue(row, ['treatment', 'treatmentPlan']),
  },
  {
    key: 'note',
    label: 'Ghi chú',
    render: (row) => getStringValue(row, ['note', 'notes', 'description']),
  },
]

export function DoctorMedicalRecordsPage() {
  const [profileId, setProfileId] = useState('')
  const medicalRecordsQuery = useQuery({
    queryKey: [...QUERY_KEYS.DOCTOR_MEDICAL_RECORDS, profileId],
    queryFn: () => getMedicalRecordsByProfile(Number(profileId)),
    enabled: Boolean(profileId),
  })

  return (
    <>
      <PageHeader title="Medical Records" description="Tra cứu hồ sơ bệnh án theo profile ID." />
      <Box sx={{ display: 'grid', gap: 2 }}>
        <Paper variant="outlined" sx={{ p: 2.5 }}>
          <TextField
            fullWidth
            label="Profile ID"
            type="number"
            value={profileId}
            onChange={(event) => setProfileId(event.target.value)}
          />
        </Paper>

        {!profileId && (
          <EmptyState title="Nhập Profile ID" description="API hồ sơ bệnh án yêu cầu profileId." />
        )}
        {medicalRecordsQuery.isLoading && <LoadingState />}
        {medicalRecordsQuery.isError && (
          <ErrorState onRetry={() => void medicalRecordsQuery.refetch()} />
        )}
        {medicalRecordsQuery.data && medicalRecordsQuery.data.length === 0 && (
          <EmptyState title="Chưa có hồ sơ bệnh án" />
        )}
        {medicalRecordsQuery.data && medicalRecordsQuery.data.length > 0 && (
          <SimpleDataTable
            columns={columns}
            rows={medicalRecordsQuery.data}
            getRowId={(row: UnknownRecord, index) => getStringValue(row, ['id'], String(index))}
          />
        )}
      </Box>
    </>
  )
}
