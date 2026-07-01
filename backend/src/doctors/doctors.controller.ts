import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';
import { DoctorService } from './doctors.service';
import { UpdateDoctorProfileDto } from './dto/update-doctor-profile.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Doctor } from './entities/doctor.entity';
import { ApiBearerAuth } from '@nestjs/swagger';

interface AuthenticatedRequest extends Request {
  user: { id: number; email: string; role: string };
}
@ApiBearerAuth('JWT-auth')
@Controller('doctor')
export class DoctorController {
  constructor(private readonly doctorService: DoctorService) {}

  // API 1: ROUTE INDEX - Lấy tất cả bác sĩ (Bệnh nhân có thể xem công khai)
  @Get() // URL: GET /doctor
  async index(): Promise<Doctor[]> {
    return await this.doctorService.findAll();
  }

  // API 2: Xem hồ sơ cá nhân của CHÍNH bác sĩ đang đăng nhập
  @UseGuards(JwtAuthGuard)
  @Get('profile') // URL: GET /doctor/profile
  async getProfile(@Req() req: AuthenticatedRequest): Promise<Doctor> {
    const userId = req.user.id;
    return await this.doctorService.findByUserId(userId);
  }

  // API 3: Bác sĩ tự cập nhật thông tin hồ sơ của mình
  @UseGuards(JwtAuthGuard)
  @Patch('update-profile') // URL: PATCH /doctor/update-profile
  async updateProfile(
    @Req() req: AuthenticatedRequest,
    @Body() updateDto: UpdateDoctorProfileDto,
  ): Promise<Doctor> {
    const userId = req.user.id;
    return await this.doctorService.updateProfileByUserId(userId, updateDto);
  }

  // API 4: Xem chi tiết 1 bác sĩ theo ID
  @Get(':id') // URL: GET /doctor/1
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<Doctor> {
    return await this.doctorService.findOne(id);
  }
}
