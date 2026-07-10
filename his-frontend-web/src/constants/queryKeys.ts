export const QUERY_KEYS = {
  DOCTOR_PROFILE: ['doctor', 'profile'],
  DOCTOR_APPOINTMENTS: ['doctor', 'appointments'],
  DOCTOR_TODAY_APPOINTMENTS: ['doctor', 'appointments', 'today'],
  DOCTOR_QUEUE: ['doctor', 'queue'],
  DOCTOR_USER_PROFILE: ['doctor', 'user-profile'],
  DOCTOR_MEDICAL_RECORDS: ['doctor', 'medical-records'],
  ADMIN_USERS: ['admin', 'users'],
  ADMIN_DOCTORS: ['admin', 'doctors'],
  ADMIN_DEPARTMENTS: ['admin', 'departments'],
  ADMIN_SCHEDULES: ['admin', 'schedules'],
  ADMIN_APPOINTMENTS: ['admin', 'appointments'],
} as const
