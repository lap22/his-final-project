import { Box } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { getAdminAppointments } from '@/api/appointment.api'
import { getDepartments } from '@/api/department.api'
import { getDoctors } from '@/api/doctor.api'
import { MetricCard } from '@/components/cards/MetricCard'
import { ErrorState } from '@/components/common/ErrorState'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/empty/EmptyState'
import { LoadingState } from '@/components/loading/LoadingState'
import { QUERY_KEYS } from '@/constants/queryKeys'

export function AdminDashboardPage() {
  const doctorsQuery = useQuery({ queryKey: QUERY_KEYS.ADMIN_DOCTORS, queryFn: getDoctors })
  const departmentsQuery = useQuery({
    queryKey: QUERY_KEYS.ADMIN_DEPARTMENTS,
    queryFn: getDepartments,
  })
  const appointmentsQuery = useQuery({
    queryKey: QUERY_KEYS.ADMIN_APPOINTMENTS,
    queryFn: getAdminAppointments,
  })

  const isLoading =
    doctorsQuery.isLoading || departmentsQuery.isLoading || appointmentsQuery.isLoading
  const isError = doctorsQuery.isError || departmentsQuery.isError || appointmentsQuery.isError

  if (isLoading) {
    return <LoadingState />
  }

  if (isError) {
    return (
      <ErrorState
        onRetry={() => {
          void doctorsQuery.refetch()
          void departmentsQuery.refetch()
          void appointmentsQuery.refetch()
        }}
      />
    )
  }

  const doctorsCount = doctorsQuery.data?.length ?? 0
  const departmentsCount = departmentsQuery.data?.length ?? 0
  const appointmentsCount = appointmentsQuery.data?.length ?? 0

  return (
    <>
      <PageHeader title="Admin Dashboard" description="Tổng quan dữ liệu vận hành hệ thống HIS." />
      <Box
        sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}
      >
        <MetricCard label="Doctors" value={doctorsCount} />
        <MetricCard label="Departments" value={departmentsCount} />
        <MetricCard label="Appointments" value={appointmentsCount} />
      </Box>
      {doctorsCount === 0 && departmentsCount === 0 && appointmentsCount === 0 && <EmptyState />}
    </>
  )
}
