import { Module } from '@nestjs/common';
import { MedicalRecordController } from './medical-records.controller';
import { MedicalRecordService } from './medical-records.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalRecord } from './entities/medical-record.entity';
import { Patient } from 'src/patients/entities/patient.entity';
import { MedicalRecordsQueryController } from './medical-records-query.controller';
import { PatientsModule } from '../patients/patients.module';

@Module({
  imports: [TypeOrmModule.forFeature([MedicalRecord, Patient]), PatientsModule],
  controllers: [MedicalRecordController, MedicalRecordsQueryController],
  providers: [MedicalRecordService],
  exports: [MedicalRecordService],
})
export class MedicalRecordsModule {}
