import { Controller, Get, UseGuards, Req, Patch, Body } from '@nestjs/common';
import { PatientService } from './patients.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UpdatePatientProfileDto } from './dto/update-patient-profile.dto';
import { Patient } from './entities/patient.entity';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    email: string;
    fullName: string;
  };
}
ApiTags('Profile');
@ApiBearerAuth('JWT-auth')
@Controller('patient') // Tất cả API trong này sẽ bắt đầu bằng /patient
export class PatientController {
  constructor(private readonly patientService: PatientService) {}

  // 1. API LẤY THÔNG TIN PROFILE (Tách biệt hoàn toàn)
  @UseGuards(JwtAuthGuard)
  @Get('profile') // URL: GET /patient/profile
  async getProfile(@Req() req: AuthenticatedRequest): Promise<Patient> {
    const userId = req.user.id;
    return await this.patientService.findByUserId(userId);
  }

  // 2. API CẬP NHẬT/HOÀN THIỆN HỒ SƠ (Tách biệt hoàn toàn)
  @UseGuards(JwtAuthGuard)
  @Patch('complete-profile') // URL: PATCH /patient/complete-profile
  async completeProfile(
    @Req() req: AuthenticatedRequest,
    @Body() updateDto: UpdatePatientProfileDto,
  ): Promise<Patient> {
    const userId = req.user.id;
    return await this.patientService.updateProfileByUserId(userId, updateDto);
  }
}
