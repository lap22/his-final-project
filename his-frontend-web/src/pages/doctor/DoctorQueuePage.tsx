import { Box, MenuItem, Paper, TextField, Typography } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { useState } from 'react'
import { getAppointmentQueue, getDoctorAppointments } from '@/api/appointment.api'
import { DetailsCard } from '@/components/cards/DetailsCard'
import { ErrorState } from '@/components/common/ErrorState'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/empty/EmptyState'
import { LoadingState } from '@/components/loading/LoadingState'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { getNestedRecord, getStringValue, isRecord } from '@/utils/record'

function getAppointmentLabel(appointment: Record<string, unknown>): string {
  const patient = getNestedRecord(appointment, ['patient', 'patientProfile', 'profile'])
  const patientName = patient ? getStringValue(patient, ['name', 'fullName', 'email']) : 'Bệnh nhân'
  const date = getStringValue(appointment, ['appointmentDate', 'date', 'time', 'createdAt'])

  return `${patientName} - ${date}`
}

export function DoctorQueuePage() {
  const [appointmentId, setAppointmentId] = useState('')
  const appointmentsQuery = useQuery({
    queryKey: QUERY_KEYS.DOCTOR_APPOINTMENTS,
    queryFn: getDoctorAppointments,
  })
  const queueQuery = useQuery({
    queryKey: [...QUERY_KEYS.DOCTOR_QUEUE, appointmentId],
    queryFn: () => getAppointmentQueue(Number(appointmentId)),
    enabled: Boolean(appointmentId),
  })

  if (appointmentsQuery.isLoading) {
    return <LoadingState />
  }

  if (appointmentsQuery.isError) {
    return <ErrorState onRetry={() => void appointmentsQuery.refetch()} />
  }

  const appointments = appointmentsQuery.data ?? []

  return (
    <>
      <PageHeader title="Queue" description="Theo dõi hàng đợi khám theo từng lịch hẹn." />
      {appointments.length === 0 ? (
        <EmptyState title="Chưa có lịch hẹn để xem hàng đợi" />
      ) : (
        <Box sx={{ display: 'grid', gap: 2 }}>
          <Paper variant="outlined" sx={{ p: 2.5 }}>
            <TextField
              select
              fullWidth
              label="Chọn lịch hẹn"
              value={appointmentId}
              onChange={(event) => setAppointmentId(event.target.value)}
            >
              {appointments.map((appointment, index) => {
                const id = getStringValue(appointment, ['id'], String(index))

                return (
                  <MenuItem key={id} value={id}>
                    {getAppointmentLabel(appointment)}
                  </MenuItem>
                )
              })}
            </TextField>
          </Paper>

          {!appointmentId && (
            <EmptyState
              title="Chọn lịch hẹn"
              description="Hàng đợi sẽ hiển thị sau khi chọn lịch hẹn."
            />
          )}
          {queueQuery.isLoading && <LoadingState />}
          {queueQuery.isError && <ErrorState onRetry={() => void queueQuery.refetch()} />}
          {queueQuery.data && isRecord(queueQuery.data) && (
            <DetailsCard
              title="Thông tin hàng đợi"
              items={[
                {
                  label: 'Vị trí hiện tại',
                  value: getStringValue(queueQuery.data, ['currentPosition', 'position']),
                },
                {
                  label: 'Tổng số chờ',
                  value: getStringValue(queueQuery.data, ['totalWaiting', 'total']),
                },
                { label: 'Trạng thái', value: getStringValue(queueQuery.data, ['status']) },
              ]}
            />
          )}
          {queueQuery.data && !isRecord(queueQuery.data) && (
            <Typography color="text.secondary">
              Endpoint hàng đợi đã trả dữ liệu không đúng định dạng hiển thị.
            </Typography>
          )}
        </Box>
      )}
    </>
  )
}
