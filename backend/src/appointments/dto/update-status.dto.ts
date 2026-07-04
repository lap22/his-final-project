import { IsEnum, IsNotEmpty } from 'class-validator';
import { AppointmentStatus } from '../entities/appointment.entity';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateAppointmentStatusDto {
  @ApiProperty({ example: 'CONFIRMED', enum: AppointmentStatus })
  @IsEnum(AppointmentStatus, { message: 'Trạng thái lịch hẹn không hợp lệ!' })
  @IsNotEmpty({ message: 'Trạng thái không được để trống!' })
  status!: AppointmentStatus;
}
