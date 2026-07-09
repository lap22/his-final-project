import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Gender } from '@prisma/client';
import { IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';

// Định nghĩa Enum nhóm máu để tránh bệnh nhân nhập bậy
export enum BloodGroup {
  A_PLUS = 'A+',
  A_MINUS = 'A-',
  B_PLUS = 'B+',
  B_MINUS = 'B-',
  O_PLUS = 'O+',
  O_MINUS = 'O-',
  AB_PLUS = 'AB+',
  AB_MINUS = 'AB-',
}

export class UpdatePatientProfileDto {
  @ApiProperty({ example: '' })
  @IsString({ message: 'Địa chỉ phải là chuỗi ký tự!' })
  @IsOptional()
  address?: string;
  @ApiProperty({ example: '' })
  @IsDateString(
    {},
    { message: 'Ngày sinh phải đúng định dạng ngày YYYY-MM-DD!' },
  )
  @IsOptional()
  dob?: string;
  @ApiProperty({ example: '' })
  @IsString()
  @IsOptional()
  gender?: string;
  @ApiProperty({ example: '' })
  @IsEnum(BloodGroup, {
    message: 'Nhóm máu không hợp lệ! Ví dụ: A+, B+, O+...',
  })
  @IsOptional()
  bloodGroup?: BloodGroup;
  @ApiProperty({ example: '' })
  @IsString()
  @IsOptional()
  insuranceNumber?: string; // Số BHYT
  @ApiProperty({ example: '' })
  @IsString()
  @IsOptional()
  emergencyContact?: string; // Người liên hệ khẩn cấp
}
