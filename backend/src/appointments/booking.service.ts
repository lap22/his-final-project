import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

export interface BookingHospital {
  id: number;
  name: string;
  address?: string;
}

export interface BookingSpecialty {
  id: string;
  name: string;
  doctorCount: number;
}

export interface BookingDoctor {
  id: number;
  fullName: string;
  specialtyName: string;
  qualification?: string | null;
}

export interface BookingTimeSlot {
  id: number;
  scheduleId: number;
  startTime: string;
  endTime: string;
  appointmentDate: string;
  availableCount: number;
}

const DEFAULT_HOSPITAL: BookingHospital = {
  id: 1,
  name: 'Bệnh viện HIS',
  address: 'Cơ sở khám bệnh HIS',
};

@Injectable()
export class BookingService {
  constructor(private readonly prisma: PrismaService) {}

  async findHospitals(): Promise<BookingHospital[]> {
    return [DEFAULT_HOSPITAL];
  }

  async findSpecialties(_hospitalId: number): Promise<BookingSpecialty[]> {
    const doctors = await this.prisma.doctor.findMany({
      select: { specialization: true },
    });

    const counts = new Map<string, number>();

    doctors.forEach((doctor) => {
      const name = doctor.specialization?.trim();
      if (name) {
        counts.set(name, (counts.get(name) ?? 0) + 1);
      }
    });

    return Array.from(counts.entries())
      .sort(([first], [second]) => first.localeCompare(second))
      .map(([name, doctorCount]) => ({
        id: name,
        name,
        doctorCount,
      }));
  }

  async findDoctors(
    _hospitalId: number,
    specialtyId: string,
  ): Promise<BookingDoctor[]> {
    const doctors = await this.prisma.doctor.findMany({
      where: { specialization: specialtyId },
      include: { user: true },
      orderBy: { user: { fullName: 'asc' } },
    });

    return doctors.map((doctor) => ({
      id: doctor.id,
      fullName: doctor.user.fullName,
      specialtyName: doctor.specialization,
      qualification: doctor.qualification,
    }));
  }

  async findTimeSlots(
    doctorId: number,
    date: string,
  ): Promise<BookingTimeSlot[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(startOfDay);
    endOfDay.setDate(endOfDay.getDate() + 1);

    const schedules = await this.prisma.doctorSchedule.findMany({
      where: {
        doctorId,
        workingDate: {
          gte: startOfDay,
          lt: endOfDay,
        },
      },
      include: {
        appointments: {
          where: { status: { not: 'CANCELLED' } },
        },
      },
      orderBy: { startTime: 'asc' },
    });

    return schedules
      .map((schedule) => {
        const availableCount = Math.max(
          schedule.maxPatient - schedule.appointments.length,
          0,
        );

        return {
          id: schedule.id,
          scheduleId: schedule.id,
          startTime: schedule.startTime.toISOString(),
          endTime: schedule.endTime.toISOString(),
          appointmentDate: schedule.startTime.toISOString(),
          availableCount,
        };
      })
      .filter((slot) => slot.availableCount > 0);
  }
}
