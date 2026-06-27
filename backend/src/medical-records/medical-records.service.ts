import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MedicalRecord } from './entities/medical-record.entity';
import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { Patient } from 'src/patients/entities/patient.entity';

@Injectable()
export class MedicalRecordService {
  constructor(
    @InjectRepository(MedicalRecord)
    private readonly medicalRecordRepository: Repository<MedicalRecord>,

    @InjectRepository(Patient)
    private readonly patientRepository: Repository<Patient>,
  ) {}

  // 1. Tạo bệnh án mới (Dành cho Bác sĩ / Admin)
  async create(createDto: CreateMedicalRecordDto): Promise<MedicalRecord> {
    const patient = await this.patientRepository.findOne({
      where: { id: createDto.patientId },
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
    });

    return await this.medicalRecordRepository.save(newRecord);
  }

  // 2. Lấy Lịch sử bệnh án của CHÍNH bệnh nhân đang đăng nhập (Dành cho Mobile App)
  async findHistoryByPatientUserId(userId: number): Promise<MedicalRecord[]> {
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
  async findOne(id: number): Promise<MedicalRecord> {
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
}
