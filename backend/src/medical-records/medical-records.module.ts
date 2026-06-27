import { Module } from '@nestjs/common';
import { MedicalRecordController } from './medical-records.controller';
import { MedicalRecordService } from './medical-records.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MedicalRecord } from './entities/medical-record.entity';
import { Patient } from 'src/patients/entities/patient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MedicalRecord, Patient])],
  controllers: [MedicalRecordController],
  providers: [MedicalRecordService],
  exports: [MedicalRecordService],
})
export class MedicalRecordsModule {}
