import api from './api';
import { Appointment, getAppointments } from './appointment.service';

export interface QueueInfo {
  doctorName: string;
  specialtyName: string;
  roomName: string;
  patientQueueNumber: number;
  currentQueueNumber: number;
  estimatedWaitingCount: number;
  status: string;
}

export interface QueueItem {
  id: number;
  queueNumber?: string;
  status?: string;
  estimatedTime?: string;
}

const ACTIVE_QUEUE_STATUSES = new Set(['PENDING', 'APPROVED', 'CONFIRMED']);

function isToday(value: string) {
  const date = new Date(value);
  const now = new Date();

  return (
    date.getFullYear() === now.getFullYear() &&
    date.getMonth() === now.getMonth() &&
    date.getDate() === now.getDate()
  );
}

export async function getTodayAppointments(): Promise<Appointment[]> {
  const response = await api.get<Appointment[]>('/appointments/today');
  return Array.isArray(response.data) ? response.data : [];
}

export function findWaitingAppointment(appointments: Appointment[]) {
  return appointments
    .filter((appointment) => {
      return (
        isToday(appointment.appointmentDate) &&
        ACTIVE_QUEUE_STATUSES.has(appointment.status)
      );
    })
    .sort(
      (first, second) =>
        new Date(first.appointmentDate).getTime() -
        new Date(second.appointmentDate).getTime(),
    )[0] ?? null;
}

export async function getQueueByAppointmentId(
  appointmentId: number,
): Promise<QueueInfo> {
  const response = await api.get<QueueInfo>('/appointments/queue', {
    params: { appointmentId },
  });

  return response.data;
}

export async function getQueueByProfile(profileId: number): Promise<QueueItem[]> {
  const waitingAppointment = findWaitingAppointment(await getAppointments(profileId));

  if (!waitingAppointment) {
    return [];
  }

  const queue = await getQueueByAppointmentId(waitingAppointment.id);

  return [
    {
      id: waitingAppointment.id,
      queueNumber: String(queue.patientQueueNumber),
      status: queue.status,
      estimatedTime: waitingAppointment.appointmentDate,
    },
  ];
}
