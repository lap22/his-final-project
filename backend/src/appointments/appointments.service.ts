import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Appointment as PrismaAppointment } from '@prisma/client';
import { Repository } from 'typeorm';
import { Appointment as AppointmentEntity } from './entities/appointment.entity';
import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentStatusDto } from './dto/update-status.dto';
import { Patient } from 'src/patients/entities/patient.entity';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { PrismaService } from '../../prisma/prisma.service';
import { PatientService } from '../patients/patients.service';

@Injectable()
export class AppointmentService {
  constructor(
    @InjectRepository(AppointmentEntity)
    private readonly appointmentRepository: Repository<AppointmentEntity>,

    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,

    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    private readonly prisma: PrismaService,
    private readonly patientService: PatientService,
  ) {}

  // 1. Bệnh nhân đặt lịch hẹn từ App
  async create(
    userId: number,
    dto: CreateAppointmentDto,
  ): Promise<any> {
    await this.patientService.assertProfileOwnership(
      userId,
      dto.patientProfileId,
    );

    const [doctor, schedule] = await Promise.all([
      this.prisma.doctor.findUnique({ where: { id: dto.doctorId } }),
      this.prisma.doctorSchedule.findUnique({ where: { id: dto.scheduleId } }),
    ]);

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    if (!schedule || schedule.doctorId !== dto.doctorId) {
      throw new NotFoundException('Doctor schedule not found');
    }

    return this.prisma.appointment.create({
      data: {
        patientProfileId: dto.patientProfileId,
        doctorId: dto.doctorId,
        scheduleId: dto.scheduleId,
        appointmentDate: new Date(dto.appointmentDate),
        reason: dto.reason,
      },
    });

    /*
    // Tìm Patient ID dựa trên User ID đang đăng nhập
    const patient = await this.patientRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!patient) {
      throw new NotFoundException('Hồ sơ bệnh nhân không tồn tại!');
    }

    // Kiểm tra xem Bác sĩ được chọn có tồn tại không
    const legacyDoctor = await this.doctorRepository.findOne({
      where: { id: dto.doctorId },
    });
    if (!legacyDoctor) {
      throw new NotFoundException('Bác sĩ được chọn không tồn tại!');
    }

    // Tạo thực thể lịch hẹn mới
    const appointment = this.appointmentRepository.create({
      appointmentDate: new Date(dto.appointmentDate),
      reason: dto.reason,
      patient,
      doctor: legacyDoctor,
    } as any);

    return await this.appointmentRepository.save(appointment);
    */
  }

  // 2. Admin lấy toàn bộ lịch hẹn hệ thống
  async findAll(): Promise<AppointmentEntity[]> {
    return await this.appointmentRepository.find({
      relations: {
        patient: true,
        doctor: true,
      },
      order: {
        appointmentDate: 'DESC',
      },
    });
  }

  // 3. Bệnh nhân xem danh sách lịch sử đặt lịch của chính mình
  async findByPatient(userId: number): Promise<AppointmentEntity[]> {
    const patient = await this.patientRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!patient) {
      throw new NotFoundException('Hồ sơ bệnh nhân không tồn tại!');
    }

    return await this.appointmentRepository.find({
      where: { patient: { id: patient.id } },
      relations: { doctor: true },
      order: { appointmentDate: 'DESC' },
    });
  }

  // 4. Bác sĩ xem danh sách lịch hẹn người ta đặt khám mình
  async findByDoctor(userId: number): Promise<AppointmentEntity[]> {
    const doctor = await this.doctorRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!doctor) {
      throw new NotFoundException('Hồ sơ bác sĩ không tồn tại!');
    }

    return await this.appointmentRepository.find({
      where: { doctor: { id: doctor.id } },
      relations: { patient: true },
      order: { appointmentDate: 'ASC' }, // Lịch khám sớm nhất xếp lên đầu
    });
  }

  // 5. Cập nhật trạng thái (Duyệt lịch hoặc Hủy lịch)
  async updateStatus(
    id: number,
    dto: UpdateAppointmentStatusDto,
  ): Promise<AppointmentEntity> {
    const appointment = await this.appointmentRepository.findOne({
      where: { id },
    });
    if (!appointment) {
      throw new NotFoundException('Không tìm thấy lịch hẹn này!');
    }

    appointment.status = dto.status;
    return await this.appointmentRepository.save(appointment);
  }

  async findByProfile(
    userId: number,
    profileId: number,
  ): Promise<PrismaAppointment[]> {
    await this.patientService.assertProfileOwnership(userId, profileId);

    return this.prisma.appointment.findMany({
      where: { patientProfileId: profileId },
      include: {
        doctor: true,
        schedule: true,
        symptoms: true,
        medicalRecord: true,
      },
      orderBy: { appointmentDate: 'desc' },
    });
  }
}
