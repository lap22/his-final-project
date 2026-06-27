import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsOptional, IsNumber } from 'class-validator';

export class CreateMedicalRecordDto {
  @ApiProperty()
  @IsNumber({}, { message: 'ID bệnh nhân phải là số!' })
  @IsNotEmpty({ message: 'ID bệnh nhân không được để trống!' })
  patientId!: number;
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
