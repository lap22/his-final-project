import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PatientProfile } from '@prisma/client';
import { DataSource, Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { User } from '../auth/entities/user.entity';
// Import DTO hoàn thiện hồ sơ vào đây
import { UpdatePatientProfileDto } from './dto/update-patient-profile.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePatientProfileDto } from './dto/create-patient-profile.dto';
import { UpdateFamilyPatientProfileDto } from './dto/update-family-patient-profile.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
    private readonly dataSource: DataSource,
    private readonly prisma: PrismaService,
  ) {}

  async findByUserId(userId: number): Promise<Patient> {
    const patient = await this.patientRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!patient) {
      const user = await this.dataSource.getRepository(User).findOne({
        where: { id: userId },
      });

      if (user?.roleId === 3) {
        return await this.createPatient(user.name ?? user.email, user);
      }

      throw new NotFoundException(
        'Không tìm thấy thông tin hồ sơ bệnh nhân cho tài khoản này!',
      );
    }
    return patient;
  }

  async createPatient(fullName: string, user: User): Promise<Patient> {
    const randomCode = Math.floor(1000 + Math.random() * 9000);
    const patientCode = `BN-${new Date().getFullYear()}-${randomCode}`;
    const newPatient = this.patientRepository.create({
      fullName,
      patientCode,
      user,
    });
    return this.patientRepository.save(newPatient);
  }

  // ✨ CHÈN CHÍNH XÁC ĐOẠN NÀY VÀO TRONG CLASS PATIENTSERVICE
  async updateProfileByUserId(
    userId: number,
    updateDto: UpdatePatientProfileDto,
  ): Promise<Patient> {
    // 1. Tìm xem bệnh nhân ứng với userId này có tồn tại không
    const patient = await this.patientRepository.findOne({
      where: { user: { id: userId } },
    });

    if (!patient) {
      throw new NotFoundException(
        'Không tìm thấy thông tin hồ sơ bệnh nhân để cập nhật!',
      );
    }

    // 2. Gộp các thuộc tính mới từ DTO vào thực thể cũ
    Object.assign(patient, updateDto);

    // 3. Lưu lại thực thể đã cập nhật vào Database
    return this.patientRepository.save(patient);
  }

  async createFamilyProfile(
    userId: number,
    dto: CreatePatientProfileDto,
  ): Promise<PatientProfile> {
    return this.prisma.patientProfile.create({
      data: {
        userId,
        fullName: dto.fullName,
        phone: dto.phone,
        gender: dto.gender,
        birthday: dto.birthday ? new Date(dto.birthday) : undefined,
        address: dto.address,
        bloodType: dto.bloodType,
        insuranceNumber: dto.insuranceNumber,
        emergencyContact: dto.emergencyContact,
      },
    });
  }

  async findMyFamily(userId: number): Promise<PatientProfile[]> {
    return this.prisma.patientProfile.findMany({
      where: { userId },
      orderBy: { createdAt: 'asc' },
    });
  }

  async findFamilyProfileById(
    userId: number,
    id: number,
  ): Promise<PatientProfile> {
    const profile = await this.prisma.patientProfile.findUnique({
      where: { id },
    });
    this.ensureProfileBelongsToUser(profile, userId);
    return profile;
  }

  async updateFamilyProfile(
    userId: number,
    id: number,
    dto: UpdateFamilyPatientProfileDto,
  ): Promise<PatientProfile> {
    const profile = await this.prisma.patientProfile.findUnique({
      where: { id },
    });
    this.ensureProfileBelongsToUser(profile, userId);

    return this.prisma.patientProfile.update({
      where: { id },
      data: {
        fullName: dto.fullName,
        phone: dto.phone,
        gender: dto.gender,
        birthday: dto.birthday ? new Date(dto.birthday) : undefined,
        address: dto.address,
        bloodType: dto.bloodType,
        insuranceNumber: dto.insuranceNumber,
        emergencyContact: dto.emergencyContact,
      },
    });
  }

  async removeFamilyProfile(
    userId: number,
    id: number,
  ): Promise<{ message: string }> {
    const profile = await this.prisma.patientProfile.findUnique({
      where: { id },
    });
    this.ensureProfileBelongsToUser(profile, userId);

    await this.prisma.patientProfile.delete({ where: { id } });
    return { message: 'Patient profile deleted successfully' };
  }

  async assertProfileOwnership(
    userId: number,
    profileId: number,
  ): Promise<PatientProfile> {
    const profile = await this.prisma.patientProfile.findUnique({
      where: { id: profileId },
    });
    this.ensureProfileBelongsToUser(profile, userId);
    return profile;
  }

  private ensureProfileBelongsToUser(
    profile: PatientProfile | null,
    userId: number,
  ): asserts profile is PatientProfile {
    if (!profile) {
      throw new NotFoundException('Patient profile not found');
    }

    if (profile.userId !== userId) {
      throw new ForbiddenException('You cannot access this patient profile');
    }
  }
}
