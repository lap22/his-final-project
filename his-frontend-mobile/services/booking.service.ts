import api from './api';
import { Appointment, CreateAppointmentPayload } from './appointment.service';

export interface Hospital {
  id: number;
  name: string;
  address?: string | null;
}

export interface BookingSpecialty {
  id: string;
  name: string;
  doctorCount?: number;
}

export interface BookingDoctor {
  id: number;
  fullName: string;
  specialtyName: string;
  qualification?: string | null;
}

export interface TimeSlot {
  id: number;
  scheduleId: number;
  startTime: string;
  endTime: string;
  appointmentDate: string;
  availableCount: number;
}

export async function getHospitals(): Promise<Hospital[]> {
  const response = await api.get<Hospital[]>('/booking/hospitals');
  return Array.isArray(response.data) ? response.data : [];
}

export async function getBookingSpecialties(
  hospitalId: number,
): Promise<BookingSpecialty[]> {
  const response = await api.get<BookingSpecialty[]>('/booking/specialties', {
    params: { hospitalId },
  });

  return Array.isArray(response.data) ? response.data : [];
}

export async function getBookingDoctors(
  hospitalId: number,
  specialtyId: string,
): Promise<BookingDoctor[]> {
  const response = await api.get<BookingDoctor[]>('/booking/doctors', {
    params: { hospitalId, specialtyId },
  });

  return Array.isArray(response.data) ? response.data : [];
}

export async function getDoctorTimeSlots(
  doctorId: number,
  date: string,
): Promise<TimeSlot[]> {
  const response = await api.get<TimeSlot[]>('/booking/time-slots', {
    params: { doctorId, date },
  });

  return Array.isArray(response.data) ? response.data : [];
}

export async function createBookingAppointment(
  payload: CreateAppointmentPayload,
): Promise<Appointment> {
  const response = await api.post<Appointment>('/appointment', payload);
  return response.data;
}
