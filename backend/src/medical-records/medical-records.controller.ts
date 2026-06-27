import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Req,
  Param,
  ParseIntPipe,
} from '@nestjs/common';

import { CreateMedicalRecordDto } from './dto/create-medical-record.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MedicalRecord } from './entities/medical-record.entity';
import { MedicalRecordService } from './medical-records.service';
import { ApiBearerAuth } from '@nestjs/swagger';

interface AuthenticatedRequest extends Request {
  user: { id: number; email: string; role: string };
}
@ApiBearerAuth('JWT-auth')
@Controller('medical-record')
export class MedicalRecordController {
  constructor(private readonly medicalRecordService: MedicalRecordService) {}

  // API 1: Bác sĩ tạo bệnh án mới
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @Body() createDto: CreateMedicalRecordDto,
  ): Promise<MedicalRecord> {
    return await this.medicalRecordService.create(createDto);
  }

  // API 2: Bệnh nhân tự xem danh sách bệnh án của mình trên điện thoại
  @UseGuards(JwtAuthGuard)
  @Get('my-history') // URL: GET /medical-record/my-history
  async getMyHistory(
    @Req() req: AuthenticatedRequest,
  ): Promise<MedicalRecord[]> {
    const userId = req.user.id;
    return await this.medicalRecordService.findHistoryByPatientUserId(userId);
  }

  // API 3: Xem chi tiết một bệnh án theo ID
  @UseGuards(JwtAuthGuard)
  @Get(':id') // URL: GET /medical-record/1
  async findOne(@Param('id', ParseIntPipe) id: number): Promise<MedicalRecord> {
    return await this.medicalRecordService.findOne(id);
  }
}
