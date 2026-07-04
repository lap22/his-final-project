import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Appointment } from './entities/appointment.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import { Doctor } from 'src/doctors/entities/doctor.entity';
import { AppointmentController } from './appointments.controller';
import { AppointmentService } from './appointments.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Appointment, Patient, Doctor]), // Khai báo đầy đủ để inject repository thành công
  ],
  controllers: [AppointmentController],
  providers: [AppointmentService],
})
export class AppointmentModule {}
