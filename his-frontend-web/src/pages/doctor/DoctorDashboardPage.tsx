import { Box } from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { getDoctorAppointments, getTodayAppointments } from '@/api/appointment.api'
import { getDoctorProfile } from '@/api/doctor.api'
import { MetricCard } from '@/components/cards/MetricCard'
import { ErrorState } from '@/components/common/ErrorState'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/empty/EmptyState'
import { LoadingState } from '@/components/loading/LoadingState'
import { QUERY_KEYS } from '@/constants/queryKeys'

export function DoctorDashboardPage() {
  const profileQuery = useQuery({
    queryKey: QUERY_KEYS.DOCTOR_PROFILE,
    queryFn: getDoctorProfile,
  })
  const appointmentsQuery = useQuery({
    queryKey: QUERY_KEYS.DOCTOR_APPOINTMENTS,
    queryFn: getDoctorAppointments,
  })
  const todayQuery = useQuery({
    queryKey: QUERY_KEYS.DOCTOR_TODAY_APPOINTMENTS,
    queryFn: getTodayAppointments,
  })

  const isLoading = profileQuery.isLoading || appointmentsQuery.isLoading || todayQuery.isLoading
  const isError = profileQuery.isError || appointmentsQuery.isError || todayQuery.isError

  if (isLoading) {
    return <LoadingState />
  }

  if (isError) {
    return (
      <ErrorState
        onRetry={() => {
          void profileQuery.refetch()
          void appointmentsQuery.refetch()
          void todayQuery.refetch()
        }}
      />
    )
  }

  const appointmentCount = appointmentsQuery.data?.length ?? 0
  const todayCount = todayQuery.data?.length ?? 0

  return (
    <>
      <PageHeader title="Doctor Dashboard" description="Tổng quan lịch khám và hồ sơ bác sĩ." />
      <Box
        sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' }, gap: 2 }}
      >
        <MetricCard label="Lịch hẹn của tôi" value={appointmentCount} />
        <MetricCard label="Lịch hôm nay" value={todayCount} />
        <MetricCard label="Hồ sơ bác sĩ" value={profileQuery.data ? 'Đã có' : 'Chưa có'} />
      </Box>
      {!profileQuery.data && appointmentCount === 0 && todayCount === 0 && <EmptyState />}
    </>
  )
}
