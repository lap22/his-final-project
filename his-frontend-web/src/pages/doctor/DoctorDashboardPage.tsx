import {
  Box,
  Card,
  CardContent,
  Chip,
  List,
  ListItem,
  ListItemText,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { getDoctorAppointments, getTodayAppointments } from '@/api/appointment.api'
import { ErrorState } from '@/components/common/ErrorState'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/empty/EmptyState'
import { LoadingState } from '@/components/loading/LoadingState'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { getNestedRecord, getStringValue, type UnknownRecord } from '@/utils/record'

function getAppointmentStatus(appointment: UnknownRecord): string {
  return getStringValue(appointment, ['status'], '').toUpperCase()
}

function getAppointmentDate(appointment: UnknownRecord): Date | null {
  const rawDate = getStringValue(appointment, ['appointmentDate', 'date', 'time', 'startTime'], '')
  const date = new Date(rawDate)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date
}

function getPatientName(appointment: UnknownRecord): string {
  const patient = getNestedRecord(appointment, ['patient', 'patientProfile', 'profile'])

  return getStringValue(patient ?? appointment, ['name', 'fullName', 'patientName', 'email'])
}

function getNextAppointment(appointments: readonly UnknownRecord[]): UnknownRecord | null {
  const now = Date.now()
  const datedAppointments = appointments
    .map((appointment) => ({ appointment, date: getAppointmentDate(appointment) }))
    .filter((item): item is { appointment: UnknownRecord; date: Date } => Boolean(item.date))
    .filter((item) => item.date.getTime() >= now)
    .sort((first, second) => first.date.getTime() - second.date.getTime())

  return datedAppointments[0]?.appointment ?? appointments[0] ?? null
}

function DashboardCard({
  title,
  value,
  helperText,
}: {
  title: string
  value: number | string
  helperText?: string
}) {
  return (
    <Card variant="outlined">
      <CardContent>
        <Typography color="text.secondary" variant="body2">
          {title}
        </Typography>
        <Typography variant="h4" sx={{ mt: 1, fontWeight: 700 }}>
          {value}
        </Typography>
        {helperText && (
          <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
            {helperText}
          </Typography>
        )}
      </CardContent>
    </Card>
  )
}

export function DoctorDashboardPage() {
  const appointmentsQuery = useQuery({
    queryKey: QUERY_KEYS.DOCTOR_APPOINTMENTS,
    queryFn: getDoctorAppointments,
  })
  const todayQuery = useQuery({
    queryKey: QUERY_KEYS.DOCTOR_TODAY_APPOINTMENTS,
    queryFn: getTodayAppointments,
  })

  const isLoading = appointmentsQuery.isLoading || todayQuery.isLoading
  const isError = appointmentsQuery.isError || todayQuery.isError

  if (isLoading) {
    return <LoadingState />
  }

  if (isError) {
    return (
      <ErrorState
        onRetry={() => {
          void appointmentsQuery.refetch()
          void todayQuery.refetch()
        }}
      />
    )
  }

  const appointments = appointmentsQuery.data ?? []
  const todayAppointments = todayQuery.data ?? []
  const waitingCount = todayAppointments.filter((appointment) => {
    const status = getAppointmentStatus(appointment)

    return status === 'PENDING' || status === 'CONFIRMED' || status === 'WAITING'
  }).length
  const completedCount = appointments.filter((appointment) => {
    const status = getAppointmentStatus(appointment)

    return status === 'COMPLETED' || status === 'DONE'
  }).length
  const nextAppointment = getNextAppointment(todayAppointments)

  return (
    <>
      <PageHeader title="Doctor Dashboard" description="Tong quan lich kham trong ngay." />
      <Box
        sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}
      >
        <DashboardCard title="Lich hom nay" value={todayAppointments.length} />
        <DashboardCard title="Benh nhan dang cho" value={waitingCount} />
        <DashboardCard title="Da kham" value={completedCount} />
        <DashboardCard
          title="Lich tiep theo"
          value={nextAppointment ? getPatientName(nextAppointment) : '-'}
          helperText={
            nextAppointment
              ? getStringValue(nextAppointment, ['appointmentDate', 'date', 'time'])
              : 'TODO: Can API lich tiep theo rieng'
          }
        />
      </Box>

      <Box
        sx={{ mt: 2, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '2fr 1fr' }, gap: 2 }}
      >
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Lich hom nay
            </Typography>
            {todayAppointments.length === 0 ? (
              <EmptyState title="Chua co lich hom nay" />
            ) : (
              <List disablePadding>
                {todayAppointments.slice(0, 5).map((appointment, index) => (
                  <ListItem key={getStringValue(appointment, ['id'], String(index))} divider>
                    <ListItemText
                      primary={getPatientName(appointment)}
                      secondary={getStringValue(appointment, ['appointmentDate', 'date', 'time'])}
                    />
                    <Chip label={getStringValue(appointment, ['status'])} size="small" />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Thong bao
            </Typography>
            <Typography color="text.secondary">
              TODO: Chua co API notifications cho Doctor Dashboard.
            </Typography>
          </CardContent>
        </Card>
      </Box>
    </>
  )
}
