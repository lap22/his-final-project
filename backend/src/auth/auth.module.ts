import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    JwtModule.register({
      global: true, // Cho phép dùng JwtService ở các module khác mà không cần import lại
      secret: 'SECRET_KEY_CUA_BAN_O_DAY', // Thực tế nên dùng ConfigService để lấy từ file .env
      signOptions: { expiresIn: '1d' }, // Token có hạn trong 1 ngày
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
})
export class AuthModule {}
