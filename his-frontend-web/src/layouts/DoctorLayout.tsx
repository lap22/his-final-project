import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import DashboardIcon from '@mui/icons-material/Dashboard'
import FolderSharedIcon from '@mui/icons-material/FolderShared'
import MedicalInformationIcon from '@mui/icons-material/MedicalInformation'
import PersonIcon from '@mui/icons-material/Person'
import QueueIcon from '@mui/icons-material/Queue'
import { DashboardLayout, type DashboardNavItem } from '@/components/layout/DashboardLayout'
import { ROUTES } from '@/constants/routes'

const doctorNavItems: readonly DashboardNavItem[] = [
  {
    label: 'Dashboard',
    path: ROUTES.DOCTOR.DASHBOARD,
    icon: <DashboardIcon />,
  },
  {
    label: 'Appointments',
    path: ROUTES.DOCTOR.APPOINTMENTS,
    icon: <CalendarMonthIcon />,
  },
  {
    label: 'Queue',
    path: ROUTES.DOCTOR.QUEUE,
    icon: <QueueIcon />,
  },
  {
    label: 'Patients',
    path: ROUTES.DOCTOR.PATIENTS,
    icon: <FolderSharedIcon />,
  },
  {
    label: 'Medical Records',
    path: ROUTES.DOCTOR.MEDICAL_RECORDS,
    icon: <MedicalInformationIcon />,
  },
  {
    label: 'Profile',
    path: ROUTES.DOCTOR.PROFILE,
    icon: <PersonIcon />,
  },
]

export function DoctorLayout() {
  return <DashboardLayout title="Doctor" navItems={doctorNavItems} />
}
