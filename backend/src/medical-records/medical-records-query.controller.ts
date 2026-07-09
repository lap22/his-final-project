import { Controller, Get, Param, ParseIntPipe, Query, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { MedicalRecord } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { MedicalRecordService } from './medical-records.service';

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    email: string;
    roleId?: number;
  };
}

@ApiTags('Medical Records')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('medical-records')
export class MedicalRecordsQueryController {
  constructor(private readonly medicalRecordService: MedicalRecordService) {}

  @Get(':id')
  async findOne(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<MedicalRecord> {
    return this.medicalRecordService.findOneForUser(req.user.id, id);
  }

  @Get()
  async findByProfile(
    @Req() req: AuthenticatedRequest,
    @Query('profileId', ParseIntPipe) profileId: number,
  ): Promise<MedicalRecord[]> {
    return this.medicalRecordService.findByProfile(req.user.id, profileId);
  }
}
