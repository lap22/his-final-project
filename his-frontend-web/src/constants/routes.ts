export const ROUTES = {
  ROOT: '/',
  LOGIN: '/login',
  FORBIDDEN: '/403',
  DOCTOR: {
    ROOT: '/doctor',
    DASHBOARD: '/doctor/dashboard',
    APPOINTMENTS: '/doctor/appointments',
    QUEUE: '/doctor/queue',
    PATIENTS: '/doctor/patients',
    MEDICAL_RECORDS: '/doctor/medical-records',
    PROFILE: '/doctor/profile',
  },
  ADMIN: {
    ROOT: '/admin',
    DASHBOARD: '/admin/dashboard',
    USERS: '/admin/users',
    DOCTORS: '/admin/doctors',
    DEPARTMENTS: '/admin/departments',
    SCHEDULES: '/admin/schedules',
    APPOINTMENTS: '/admin/appointments',
    SETTINGS: '/admin/settings',
  },
} as const
