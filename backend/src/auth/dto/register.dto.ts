import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsPhoneNumber,
  IsString,
  MinLength,
} from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail({}, { message: 'Email không đúng định dạng!' })
  email!: string;
  @ApiProperty({ example: '0123456789' })
  @IsPhoneNumber('VN', { message: 'Số điện thoại không đúng định dạng!' })
  phone!: string;
  @ApiProperty({ example: 'password123' })
  @IsString()
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự!' })
  password!: string;

  @ApiProperty({ example: 'John Doe' })
  @IsNotEmpty({ message: 'Tên không được để trống!' })
  name!: string;
}
