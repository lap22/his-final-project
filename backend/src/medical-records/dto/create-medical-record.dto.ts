import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateMedicalRecordDto {
  @ApiProperty()
  @IsNumber({}, { message: 'ID bệnh nhân phải là số!' })
  @IsNotEmpty({ message: 'ID bệnh nhân không được để trống!' })
  patientProfileId!: number;

  @ApiProperty()
  @IsNumber({}, { message: 'ID lich hen phai la so!' })
  @IsNotEmpty({ message: 'ID lich hen khong duoc de trong!' })
  appointmentId!: number;

  @ApiProperty()
  @IsNumber({}, { message: 'ID bac si phai la so!' })
  @IsNotEmpty({ message: 'ID bac si khong duoc de trong!' })
  doctorId!: number;
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Chẩn đoán không được để trống!' })
  diagnosis!: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  symptoms?: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  treatmentPlan?: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  prescription?: string;
  @ApiProperty()
  @IsString()
  @IsOptional()
  notes?: string;
}
