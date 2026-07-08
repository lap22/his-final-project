import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PatientService } from './patients.service';
import { PatientController } from './patients.controller';
import { Patient } from './entities/patient.entity';
import { PatientProfilesController } from './patient-profiles.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([Patient]), // Đăng ký Entity với TypeORM
  ],
  controllers: [PatientController, PatientProfilesController],
  providers: [PatientService],
  exports: [PatientService], // Export Service để module Auth có thể gọi khi đăng ký tài khoản
})
export class PatientsModule {}
