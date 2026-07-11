import { Navigate, createBrowserRouter } from 'react-router-dom'
import { ROLES } from '@/constants/roles'
import { ROUTES } from '@/constants/routes'
import { AdminLayout } from '@/layouts/AdminLayout'
import { AuthLayout } from '@/layouts/AuthLayout'
import { DoctorLayout } from '@/layouts/DoctorLayout'
import { AdminAppointmentsPage } from '@/pages/admin/AdminAppointmentsPage'
import { AdminDashboardPage } from '@/pages/admin/AdminDashboardPage'
import { AdminDepartmentsPage } from '@/pages/admin/AdminDepartmentsPage'
import { AdminDoctorSchedulesPage } from '@/pages/admin/AdminDoctorSchedulesPage'
import { AdminDoctorsPage } from '@/pages/admin/AdminDoctorsPage'
import { AdminSettingsPage } from '@/pages/admin/AdminSettingsPage'
import { AdminUsersPage } from '@/pages/admin/AdminUsersPage'
import { LoginPage } from '@/pages/auth/LoginPage'
import { ForbiddenPage } from '@/pages/common/ForbiddenPage'
import { NotFoundPage } from '@/pages/common/NotFoundPage'
import { DoctorAppointmentsPage } from '@/pages/doctor/DoctorAppointmentsPage'
import { DoctorDashboardPage } from '@/pages/doctor/DoctorDashboardPage'
import { DoctorMedicalRecordsPage } from '@/pages/doctor/DoctorMedicalRecordsPage'
import { DoctorPatientsPage } from '@/pages/doctor/DoctorPatientsPage'
import { DoctorProfilePage } from '@/pages/doctor/DoctorProfilePage'
import { DoctorQueuePage } from '@/pages/doctor/DoctorQueuePage'
import { ProtectedRoute } from '@/routes/ProtectedRoute'
import { RoleRoute } from '@/routes/RoleRoute'

export const router = createBrowserRouter([
  {
    path: ROUTES.ROOT,
    element: <Navigate to={ROUTES.LOGIN} replace />,
  },
  {
    path: ROUTES.LOGIN,
    element: <AuthLayout />,
    children: [
      {
        index: true,
        element: <LoginPage />,
      },
    ],
  },
  {
    path: ROUTES.FORBIDDEN,
    element: <ForbiddenPage />,
  },
  {
    path: ROUTES.DOCTOR.ROOT,
    element: (
      <ProtectedRoute>
        <RoleRoute allowedRoles={[ROLES.DOCTOR]}>
          <DoctorLayout />
        </RoleRoute>
      </ProtectedRoute>
    ),
    children: [
      {
        path: ROUTES.DOCTOR.DASHBOARD.replace(`${ROUTES.DOCTOR.ROOT}/`, ''),
        element: <DoctorDashboardPage />,
      },
      {
        path: ROUTES.DOCTOR.APPOINTMENTS.replace(`${ROUTES.DOCTOR.ROOT}/`, ''),
        element: <DoctorAppointmentsPage />,
      },
      {
        path: ROUTES.DOCTOR.QUEUE.replace(`${ROUTES.DOCTOR.ROOT}/`, ''),
        element: <DoctorQueuePage />,
      },
      {
        path: ROUTES.DOCTOR.PATIENTS.replace(`${ROUTES.DOCTOR.ROOT}/`, ''),
        element: <DoctorPatientsPage />,
      },
      {
        path: ROUTES.DOCTOR.MEDICAL_RECORDS.replace(`${ROUTES.DOCTOR.ROOT}/`, ''),
        element: <DoctorMedicalRecordsPage />,
      },
      {
        path: ROUTES.DOCTOR.PROFILE.replace(`${ROUTES.DOCTOR.ROOT}/`, ''),
        element: <DoctorProfilePage />,
      },
    ],
  },
  {
    path: ROUTES.ADMIN.ROOT,
    element: (
      <ProtectedRoute>
        <RoleRoute allowedRoles={[ROLES.ADMIN]}>
          <AdminLayout />
        </RoleRoute>
      </ProtectedRoute>
    ),
    children: [
      {
        path: ROUTES.ADMIN.DASHBOARD.replace(`${ROUTES.ADMIN.ROOT}/`, ''),
        element: <AdminDashboardPage />,
      },
      {
        path: ROUTES.ADMIN.USERS.replace(`${ROUTES.ADMIN.ROOT}/`, ''),
        element: <AdminUsersPage />,
      },
      {
        path: ROUTES.ADMIN.DOCTORS.replace(`${ROUTES.ADMIN.ROOT}/`, ''),
        element: <AdminDoctorsPage />,
      },
      {
        path: ROUTES.ADMIN.DEPARTMENTS.replace(`${ROUTES.ADMIN.ROOT}/`, ''),
        element: <AdminDepartmentsPage />,
      },
      {
        path: ROUTES.ADMIN.SCHEDULES.replace(`${ROUTES.ADMIN.ROOT}/`, ''),
        element: <AdminDoctorSchedulesPage />,
      },
      {
        path: ROUTES.ADMIN.APPOINTMENTS.replace(`${ROUTES.ADMIN.ROOT}/`, ''),
        element: <AdminAppointmentsPage />,
      },
      {
        path: ROUTES.ADMIN.SETTINGS.replace(`${ROUTES.ADMIN.ROOT}/`, ''),
        element: <AdminSettingsPage />,
      },
    ],
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
])
