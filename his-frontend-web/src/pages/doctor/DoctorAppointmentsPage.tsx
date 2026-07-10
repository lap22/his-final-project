import { useQuery } from '@tanstack/react-query'
import { getDoctorAppointments } from '@/api/appointment.api'
import { ErrorState } from '@/components/common/ErrorState'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/empty/EmptyState'
import { LoadingState } from '@/components/loading/LoadingState'
import { SimpleDataTable, type SimpleDataColumn } from '@/components/tables/SimpleDataTable'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { getNestedRecord, getStringValue, type UnknownRecord } from '@/utils/record'

const columns: readonly SimpleDataColumn[] = [
  {
    key: 'patient',
    label: 'Bệnh nhân',
    render: (row) =>
      getStringValue(getNestedRecord(row, ['patient']) ?? row, ['name', 'fullName', 'email']),
  },
  {
    key: 'date',
    label: 'Thời gian',
    render: (row) => getStringValue(row, ['appointmentDate', 'date', 'time', 'createdAt']),
  },
  {
    key: 'status',
    label: 'Trạng thái',
    render: (row) => getStringValue(row, ['status']),
  },
  {
    key: 'reason',
    label: 'Lý do khám',
    render: (row) => getStringValue(row, ['reason', 'note', 'description']),
  },
]

export function DoctorAppointmentsPage() {
  const appointmentsQuery = useQuery({
    queryKey: QUERY_KEYS.DOCTOR_APPOINTMENTS,
    queryFn: getDoctorAppointments,
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
      <PageHeader
        title="Appointments"
        description="Danh sách bệnh nhân đã đặt lịch khám với bác sĩ."
      />
      {appointments.length === 0 ? (
        <EmptyState title="Chưa có lịch hẹn" />
      ) : (
        <SimpleDataTable
          columns={columns}
          rows={appointments}
          getRowId={(row: UnknownRecord, index) => getStringValue(row, ['id'], String(index))}
        />
      )}
    </>
  )
}
