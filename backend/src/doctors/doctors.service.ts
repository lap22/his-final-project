import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Doctor } from './entities/doctor.entity';
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto';
import { PrismaService } from '../../prisma/prisma.service';

export interface SpecialtySummary {
  id: string;
  name: string;
  doctorCount: number;
}

@Injectable()
export class DoctorService {
  constructor(
    @InjectRepository(Doctor)
    private readonly doctorRepository: Repository<Doctor>,
    private readonly prisma: PrismaService,
  ) {}

  // 1. ROUTE INDEX: Lấy danh sách toàn bộ bác sĩ (Lấy dữ liệu thật từ DB)
  async findAll(): Promise<Doctor[]> {
    return await this.doctorRepository.find({
      relations: {
        user: true, // Lấy kèm thông tin tài khoản (email)
      },
      select: {
        id: true,
        fullName: true,
        specialty: true,
        degree: true,
        roomNumber: true,
        user: {
          id: true,
          email: true, // Chỉ lấy email, ẩn mật khẩu
        },
      },
      order: { fullName: 'ASC' }, // Sắp xếp theo tên từ A-Z
    });
  }

  async findSpecialties(): Promise<SpecialtySummary[]> {
    const doctors = await this.prisma.doctor.findMany({
      select: {
        specialization: true,
      },
    });

    const specialtyCounts = new Map<string, number>();

    doctors.forEach((doctor) => {
      const specialty = doctor.specialization?.trim();

      if (!specialty) {
        return;
      }

      specialtyCounts.set(specialty, (specialtyCounts.get(specialty) ?? 0) + 1);
    });

    return Array.from(specialtyCounts.entries())
      .sort(([firstName], [secondName]) => firstName.localeCompare(secondName))
      .map(([name, doctorCount]) => ({
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        doctorCount,
      }));
  }

  // 2. Xem chi tiết thông tin 1 bác sĩ cụ thể theo ID
  async findOne(id: number): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({
      where: { id },
      relations: { user: true },
    });
    if (!doctor) {
      throw new NotFoundException('Không tìm thấy thông tin bác sĩ này!');
    }
    return doctor;
  }

  // 3. Tìm bác sĩ dựa trên User ID (để xử lý khi bác sĩ đăng nhập)
  async findByUserId(userId: number): Promise<Doctor> {
    const doctor = await this.doctorRepository.findOne({
      where: { user: { id: userId } },
      relations: { user: true },
    });
    if (!doctor) {
      throw new NotFoundException('Hồ sơ bác sĩ không tồn tại!');
    }
    return doctor;
  }

  // 4. Cập nhật hồ sơ bác sĩ
  async updateProfileByUserId(
    userId: number,
    dto: UpdateDoctorProfileDto,
  ): Promise<Doctor> {
    const doctor = await this.findByUserId(userId);
    Object.assign(doctor, dto);
    return await this.doctorRepository.save(doctor);
  }
}
