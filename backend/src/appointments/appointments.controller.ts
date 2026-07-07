import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Req,
  ParseIntPipe,
} from '@nestjs/common';

import { CreateAppointmentDto } from './dto/create-appointment.dto';
import { UpdateAppointmentStatusDto } from './dto/update-status.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { AppointmentService } from './appointments.service';
import { ApiBearerAuth } from '@nestjs/swagger';

interface AuthenticatedRequest extends Request {
  user: { id: number; email: string; role: string };
}
@ApiBearerAuth('JWT-auth')
@Controller('appointment')
@UseGuards(JwtAuthGuard, RolesGuard)
export class AppointmentController {
  // 🚀 Đã dọn dẹp Constructor: Chỉ gọi duy nhất AppointmentService
  constructor(private readonly appointmentService: AppointmentService) {}

  // API 1: [APP MOBILE] Bệnh nhân tự đặt lịch hẹn khám
  @Post()
  @Roles(3)
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() createDto: CreateAppointmentDto,
  ) {
    return await this.appointmentService.create(req.user.id, createDto);
  }

  // API 2: [ADMIN] Xem toàn bộ danh sách lịch hẹn trong bệnh viện
  @Get('admin-all')
  @Roles(1)
  async index() {
    return await this.appointmentService.findAll();
  }

  // API 3: [APP MOBILE] Bệnh nhân xem lịch sử đặt hẹn của mình
  @Get('my-appointments')
  @Roles(3)
  async getMyAppointments(@Req() req: AuthenticatedRequest) {
    return await this.appointmentService.findByPatient(req.user.id);
  }

  // API 4: [WEB BÁC SĨ] Bác sĩ xem danh sách bệnh nhân đã đặt lịch khám mình
  @Get('doctor-appointments')
  @Roles(2)
  async getDoctorAppointments(@Req() req: AuthenticatedRequest) {
    return await this.appointmentService.findByDoctor(req.user.id);
  }

  // API 5: [WEB/APP] Cập nhật trạng thái lịch hẹn (Xác nhận, Hủy lịch)
  @Patch(':id/status')
  @Roles(2, 1, 3)
  async updateStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateAppointmentStatusDto,
  ) {
    return await this.appointmentService.updateStatus(id, updateDto);
  }
}
