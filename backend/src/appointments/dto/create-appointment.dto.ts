import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, IsInt, IsDateString } from 'class-validator';

export class CreateAppointmentDto {
  @ApiProperty({ example: '2023-08-15T10:30:00Z' })
  @IsDateString({}, { message: 'Ngày giờ hẹn không đúng định dạng ISO!' })
  @IsNotEmpty({ message: 'Vui lòng chọn ngày giờ hẹn khám!' })
  appointmentDate!: string;

  @ApiProperty({ example: 1 })
  @IsInt({ message: 'Mã bác sĩ phải là số nguyên!' })
  @IsNotEmpty({ message: 'Vui lòng chọn bác sĩ khám!' })
  doctorId!: number;

  @ApiProperty({ example: 'Cảm cúm' })
  @IsString()
  @IsNotEmpty({ message: 'Vui lòng nhập lý do hoặc triệu chứng khám!' })
  reason!: string;
}
