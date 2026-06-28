import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: '' })
  @IsEmail({}, { message: 'Email không đúng định dạng!' })
  @IsOptional()
  email?: string;
  @ApiProperty({ example: '' })
  @Matches(/(84|0[3|5|7|8|9])+([0-9]{8})\b/, {
    message: 'Số điện thoại không đúng định dạng Việt Nam (ví dụ: 0792113333)!',
  })
  phone?: number;
  @ApiProperty()
  @IsString()
  @MinLength(6, { message: 'Mật khẩu mới phải có ít nhất 6 ký tự!' })
  @IsOptional()
  password?: string;
}
