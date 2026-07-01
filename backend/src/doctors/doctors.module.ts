import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DoctorService } from './doctors.service';
import { DoctorController } from './doctors.controller';
import { Doctor } from './entities/doctor.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Doctor]), // Tiêm DoctorRepository vào hệ thống
  ],
  controllers: [DoctorController],
  providers: [DoctorService],
  exports: [DoctorService],
})
export class DoctorsModule {}
