import {
  Controller,
  Get,
  ParseIntPipe,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Appointment } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { AppointmentService } from './appointments.service';

interface AuthenticatedRequest extends Request {
  user: {
    id: number;
    email: string;
    roleId?: number;
  };
}

@ApiTags('Appointments')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('appointments')
export class AppointmentsQueryController {
  constructor(private readonly appointmentService: AppointmentService) {}

  @Get()
  async findByProfile(
    @Req() req: AuthenticatedRequest,
    @Query('profileId', ParseIntPipe) profileId: number,
  ): Promise<Appointment[]> {
    return this.appointmentService.findByProfile(req.user.id, profileId);
  }
}
