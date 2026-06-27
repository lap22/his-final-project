import { IsNotEmpty, IsString, IsOptional } from 'class-validator';

export class CreatePatientDto {
  @IsString({ message: 'Họ và tên phải là chuỗi ký tự!' })
  @IsNotEmpty({ message: 'Họ và tên bệnh nhân không được để trống!' })
  fullName!: string;

  @IsString({ message: 'Số điện thoại phải là chuỗi!' })
  @IsOptional()
  phone?: string;
}
