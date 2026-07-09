import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MedicalRecord as PrismaMedicalRecord } from '@prisma/client';
import { Repository } from 'typeorm';
import { MedicalRecord as MedicalRecordEntity } from './entities/medical-record.entity';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { Patient } from 'src/patients/entities/patient.entity';
import { PrismaService } from '../../prisma/prisma.service';
import { PatientService } from '../patients/patients.service';

@Injectable()
export class MedicalRecordService {
  constructor(
    @InjectRepository(MedicalRecordEntity)
    private readonly medicalRecordRepository: Repository<MedicalRecordEntity>,

    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    private readonly prisma: PrismaService,
    private readonly patientService: PatientService,
  ) {}

  // 1. Tạo bệnh án mới (Dành cho Bác sĩ / Admin)
  async create(createDto: CreateMedicalRecordDto): Promise<any> {
    const patientProfile = await this.prisma.patientProfile.findUnique({
      where: { id: createDto.patientProfileId },
    });
    if (!patientProfile) {
      throw new NotFoundException('Patient profile not found');
    }

    const [appointment, doctor] = await Promise.all([
      this.prisma.appointment.findUnique({
        where: { id: createDto.appointmentId },
      }),
      this.prisma.doctor.findUnique({ where: { id: createDto.doctorId } }),
    ]);

    if (!appointment || appointment.patientProfileId !== createDto.patientProfileId) {
      throw new NotFoundException('Appointment not found');
    }

    if (!doctor) {
      throw new NotFoundException('Doctor not found');
    }

    return this.prisma.medicalRecord.create({
      data: {
        appointmentId: createDto.appointmentId,
        patientProfileId: createDto.patientProfileId,
        doctorId: createDto.doctorId,
        diagnosis: createDto.diagnosis,
        examinationResult: createDto.treatmentPlan ?? createDto.symptoms,
        note: createDto.notes ?? createDto.prescription,
      },
    });

    /*
    const patient = await this.patientRepository.findOne({
      where: { id: createDto.patientProfileId },
    });
    if (!patient) {
      throw new NotFoundException('Không tìm thấy bệnh nhân để làm bệnh án!');
    }

    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const recordCode = `BA-${new Date().getFullYear()}-${randomCode}`;

    const newRecord = this.medicalRecordRepository.create({
      ...createDto,
      recordCode,
      patient,
    } as any);

    return await this.medicalRecordRepository.save(newRecord);
    */
  }

  // 2. Lấy Lịch sử bệnh án của CHÍNH bệnh nhân đang đăng nhập (Dành cho Mobile App)
  async findHistoryByPatientUserId(userId: number): Promise<MedicalRecordEntity[]> {
    return await this.medicalRecordRepository.find({
      where: { patient: { user: { id: userId } } },
      // 🚀 Nếu muốn lấy luôn thông tin cá nhân của bệnh nhân ở danh sách lịch sử:
      relations: {
        patient: true,
      },
      order: { createdAt: 'DESC' },
    });
  }

  // 3. Xem chi tiết 1 bệnh án cụ thể
  async findOne(id: number): Promise<MedicalRecordEntity> {
    const record = await this.medicalRecordRepository.findOne({
      where: { id },
      relations: {
        patient: true,
      },
    });
    if (!record) {
      throw new NotFoundException('Không tìm thấy hồ sơ bệnh án yêu cầu!');
    }
    return record;
  }

  async findByProfile(
    userId: number,
    profileId: number,
  ): Promise<PrismaMedicalRecord[]> {
    await this.patientService.assertProfileOwnership(userId, profileId);

    return this.prisma.medicalRecord.findMany({
      where: { patientProfileId: profileId },
      include: {
        appointment: true,
        doctor: true,
        prescriptions: true,
        files: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneForUser(
    userId: number,
    recordId: number,
  ): Promise<PrismaMedicalRecord> {
    const record = await this.prisma.medicalRecord.findUnique({
      where: { id: recordId },
      include: {
        appointment: true,
        patientProfile: true,
        doctor: {
          include: {
            user: true,
          },
        },
        prescriptions: true,
        files: true,
      },
    });

    if (!record) {
      throw new NotFoundException('Medical record not found');
    }

    this.patientService.ensureProfileBelongsToUser(
      record.patientProfile,
      userId,
    );

    return record;
  }
}
