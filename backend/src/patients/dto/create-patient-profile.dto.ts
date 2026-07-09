import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsDateString,
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { Gender } from '@prisma/client';
import { BloodGroup } from './update-patient-profile.dto';

export class CreatePatientProfileDto {
  @ApiProperty({ example: 'Nguyen Van A' })
  @IsString()
  @IsNotEmpty()
  fullName!: string;

  @ApiPropertyOptional({ example: '0909123456' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiPropertyOptional({ enum: Gender, example: Gender.MALE })
  @IsEnum(Gender)
  @IsOptional()
  gender?: Gender;

  @ApiPropertyOptional({ example: '1990-01-01' })
  @IsDateString()
  @IsOptional()
  birthday?: string;

  @ApiPropertyOptional({ example: '123 Nguyen Trai, TP.HCM' })
  @IsString()
  @IsOptional()
  address?: string;

  @ApiPropertyOptional({ enum: BloodGroup, example: BloodGroup.O_PLUS })
  @IsEnum(BloodGroup)
  @IsOptional()
  bloodType?: BloodGroup;

  @ApiPropertyOptional({ example: 'BHYT123456789' })
  @IsString()
  @IsOptional()
  insuranceNumber?: string;

  @ApiPropertyOptional({ example: 'Nguyen Thi B - 0909000000' })
  @IsString()
  @IsOptional()
  emergencyContact?: string;

  @ApiPropertyOptional({ example: 'Con' })
  @IsString()
  @IsOptional()
  relationship?: string;

  @ApiPropertyOptional({ example: 'Dị ứng penicillin, tiền sử hen suyễn' })
  @IsString()
  @IsOptional()
  medicalHistory?: string;
}
