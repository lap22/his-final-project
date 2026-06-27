import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Patient } from './entities/patient.entity';
import { User } from '../auth/entities/user.entity';
// Import DTO hoàn thiện hồ sơ vào đây
import { UpdatePatientProfileDto } from './dto/update-patient-profile.dto';

@Injectable()
export class PatientService {
  constructor(
    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  async findByUserId(userId: number): Promise<Patient> {
    const patient = await this.patientRepository.findOne({
      where: { user: { id: userId } },
    });
    if (!patient) {
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
}
