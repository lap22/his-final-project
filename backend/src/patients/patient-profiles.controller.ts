import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { PatientProfile } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { PatientService } from './patients.service';
import { CreatePatientProfileDto } from './dto/create-patient-profile.dto';
import { UpdateFamilyPatientProfileDto } from './dto/update-family-patient-profile.dto';

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    email: string;
    roleId?: number;
  };
}

@ApiTags('Patient Profiles')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('patient-profiles')
export class PatientProfilesController {
  constructor(private readonly patientService: PatientService) {}

  @Post()
  async create(
    @Req() req: AuthenticatedRequest,
    @Body() dto: CreatePatientProfileDto,
  ): Promise<PatientProfile> {
    return this.patientService.createFamilyProfile(req.user.id, dto);
  }

  @Get('my-family')
  async getMyFamily(
    @Req() req: AuthenticatedRequest,
  ): Promise<PatientProfile[]> {
    return this.patientService.findMyFamily(req.user.id);
  }

  @Get(':id')
  async findOne(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<PatientProfile> {
    return this.patientService.findFamilyProfileById(req.user.id, id);
  }

  @Patch(':id')
  async update(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateFamilyPatientProfileDto,
  ): Promise<PatientProfile> {
    return this.patientService.updateFamilyProfile(req.user.id, id, dto);
  }

  @Delete(':id')
  async remove(
    @Req() req: AuthenticatedRequest,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<{ message: string }> {
    return this.patientService.removeFamilyProfile(req.user.id, id);
  }
}
