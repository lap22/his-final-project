import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import DashboardIcon from '@mui/icons-material/Dashboard'
import GroupsIcon from '@mui/icons-material/Groups'
import LocalHospitalIcon from '@mui/icons-material/LocalHospital'
import EventAvailableIcon from '@mui/icons-material/EventAvailable'
import SettingsIcon from '@mui/icons-material/Settings'
import { DashboardLayout, type DashboardNavItem } from '@/components/layout/DashboardLayout'
import { ROUTES } from '@/constants/routes'

const adminNavItems: readonly DashboardNavItem[] = [
  {
    label: 'Dashboard',
    path: ROUTES.ADMIN.DASHBOARD,
    icon: <DashboardIcon />,
  },
  {
    label: 'Users',
    path: ROUTES.ADMIN.USERS,
    icon: <GroupsIcon />,
  },
  {
    label: 'Doctors',
    path: ROUTES.ADMIN.DOCTORS,
    icon: <LocalHospitalIcon />,
  },
  {
    label: 'Departments',
    path: ROUTES.ADMIN.DEPARTMENTS,
    icon: <AdminPanelSettingsIcon />,
  },
  {
    label: 'Schedules',
    path: ROUTES.ADMIN.SCHEDULES,
    icon: <EventAvailableIcon />,
  },
  {
    label: 'Appointments',
    path: ROUTES.ADMIN.APPOINTMENTS,
    icon: <CalendarMonthIcon />,
  },
  {
    label: 'Settings',
    path: ROUTES.ADMIN.SETTINGS,
    icon: <SettingsIcon />,
  },
]

export function AdminLayout() {
  return <DashboardLayout title="Admin" navItems={adminNavItems} />
}
