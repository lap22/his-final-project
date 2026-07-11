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
import { getAdminAppointments } from '@/api/appointment.api'
import { getDepartments } from '@/api/department.api'
import { getDoctors } from '@/api/doctor.api'
import { ErrorState } from '@/components/common/ErrorState'
import { PageHeader } from '@/components/common/PageHeader'
import { EmptyState } from '@/components/empty/EmptyState'
import { LoadingState } from '@/components/loading/LoadingState'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { getNestedRecord, getStringValue, type UnknownRecord } from '@/utils/record'

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

function getAppointmentDate(appointment: UnknownRecord): Date | null {
  const rawDate = getStringValue(appointment, ['appointmentDate', 'date', 'time', 'createdAt'], '')
  const date = new Date(rawDate)

  if (Number.isNaN(date.getTime())) {
    return null
  }

  return date
}

function isToday(date: Date): boolean {
  const now = new Date()

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  )
}

function isCurrentMonth(date: Date): boolean {
  const now = new Date()

  return date.getFullYear() === now.getFullYear() && date.getMonth() === now.getMonth()
}

function getStatusCounts(
  appointments: readonly UnknownRecord[],
): Array<{ status: string; count: number }> {
  const statusMap = new Map<string, number>()

  for (const appointment of appointments) {
    const status = getStringValue(appointment, ['status'], 'UNKNOWN')
    statusMap.set(status, (statusMap.get(status) ?? 0) + 1)
  }

  return Array.from(statusMap.entries()).map(([status, count]) => ({ status, count }))
}

function getTopDepartment(departments: readonly UnknownRecord[]): string {
  const sortedDepartments = [...departments].sort((first, second) => {
    const firstCount = Number(getStringValue(first, ['doctorCount', 'count'], '0'))
    const secondCount = Number(getStringValue(second, ['doctorCount', 'count'], '0'))

    return secondCount - firstCount
  })

  return getStringValue(sortedDepartments[0] ?? {}, ['name', 'specialtyName', 'specialization'])
}

function getAppointmentDepartment(appointment: UnknownRecord): string {
  const doctor = getNestedRecord(appointment, ['doctor'])

  return getStringValue(doctor ?? appointment, [
    'specialization',
    'specialtyName',
    'departmentName',
  ])
}

function getTopDepartmentFromAppointments(appointments: readonly UnknownRecord[]): string {
  const departmentMap = new Map<string, number>()

  for (const appointment of appointments) {
    const department = getAppointmentDepartment(appointment)

    if (department !== '-') {
      departmentMap.set(department, (departmentMap.get(department) ?? 0) + 1)
    }
  }

  const topDepartment = Array.from(departmentMap.entries()).sort(
    (first, second) => second[1] - first[1],
  )[0]

  return topDepartment?.[0] ?? '-'
}

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

  const doctors = doctorsQuery.data ?? []
  const departments = departmentsQuery.data ?? []
  const appointments = appointmentsQuery.data ?? []
  const datedAppointments = appointments
    .map((appointment) => ({ appointment, date: getAppointmentDate(appointment) }))
    .filter((item): item is { appointment: UnknownRecord; date: Date } => Boolean(item.date))
  const todayAppointmentCount = datedAppointments.filter((item) => isToday(item.date)).length
  const monthAppointmentCount = datedAppointments.filter((item) => isCurrentMonth(item.date)).length
  const topDepartment =
    getTopDepartment(departments) !== '-'
      ? getTopDepartment(departments)
      : getTopDepartmentFromAppointments(appointments)
  const statusCounts = getStatusCounts(appointments)

  return (
    <>
      <PageHeader title="Admin Dashboard" description="Tong quan van hanh HIS." />
      <Box
        sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: 'repeat(4, 1fr)' }, gap: 2 }}
      >
        <DashboardCard title="Tong User" value="TODO" helperText="Chua co API list users" />
        <DashboardCard title="Tong Doctor" value={doctors.length} />
        <DashboardCard title="Tong Appointment" value={appointments.length} />
        <DashboardCard title="Tong Department" value={departments.length} />
        <DashboardCard title="Appointment hom nay" value={todayAppointmentCount} />
        <DashboardCard title="Appointment thang" value={monthAppointmentCount} />
        <DashboardCard title="Top Department" value={topDepartment} />
        <DashboardCard
          title="Appointment Status"
          value={statusCounts.length}
          helperText="So nhom trang thai"
        />
      </Box>

      <Box
        sx={{ mt: 2, display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 2 }}
      >
        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Appointment Status
            </Typography>
            {statusCounts.length === 0 ? (
              <EmptyState title="Chua co appointment status" />
            ) : (
              <List disablePadding>
                {statusCounts.map((item) => (
                  <ListItem key={item.status} divider>
                    <ListItemText primary={item.status} />
                    <Chip label={item.count} size="small" />
                  </ListItem>
                ))}
              </List>
            )}
          </CardContent>
        </Card>

        <Card variant="outlined">
          <CardContent>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
              Top Department
            </Typography>
            {topDepartment === '-' ? (
              <EmptyState title="Chua co du lieu department" />
            ) : (
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                {topDepartment}
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </>
  )
}
