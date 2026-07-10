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
    key: 'name',
    label: 'Bệnh nhân',
    render: (row) => getStringValue(row, ['name', 'fullName', 'email']),
  },
  {
    key: 'phone',
    label: 'Số điện thoại',
    render: (row) => getStringValue(row, ['phone']),
  },
  {
    key: 'gender',
    label: 'Giới tính',
    render: (row) => getStringValue(row, ['gender']),
  },
  {
    key: 'dob',
    label: 'Ngày sinh',
    render: (row) => getStringValue(row, ['dateOfBirth', 'dob', 'birthDate']),
  },
]

function getUniquePatients(appointments: readonly UnknownRecord[]): UnknownRecord[] {
  const patientMap = new Map<string, UnknownRecord>()

  for (const appointment of appointments) {
    const patient = getNestedRecord(appointment, ['patient', 'patientProfile', 'profile'])

    if (patient) {
      patientMap.set(getStringValue(patient, ['id'], String(patientMap.size)), patient)
    }
  }

  return Array.from(patientMap.values())
}

export function DoctorPatientsPage() {
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

  const patients = getUniquePatients(appointmentsQuery.data ?? [])

  return (
    <>
      <PageHeader title="Patients" description="Danh sách bệnh nhân được tổng hợp từ lịch hẹn." />
      {patients.length === 0 ? (
        <EmptyState title="Chưa có bệnh nhân" />
      ) : (
        <SimpleDataTable
          columns={columns}
          rows={patients}
          getRowId={(row: UnknownRecord, index) => getStringValue(row, ['id'], String(index))}
        />
      )}
    </>
  )
}
