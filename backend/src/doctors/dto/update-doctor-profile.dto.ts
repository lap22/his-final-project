import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, Matches } from 'class-validator';

export class UpdateDoctorProfileDto {
  @ApiProperty()
  @IsString()
  @IsOptional()
  fullName?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  specialty?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  degree?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  roomNumber?: string;

  @ApiProperty()
  @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, {
    message: 'Số điện thoại không đúng định dạng Việt Nam!',
  })
  @IsOptional()
  phone?: string;

  @ApiProperty()
  @IsString()
  @IsOptional()
  bio?: string;
}
