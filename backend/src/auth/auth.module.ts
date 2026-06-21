import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { APP_GUARD } from '@nestjs/core';
import { AuthGuard } from './guards/auth.guard';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      global: true, // Cho phép dùng JwtService ở các module khác mà không cần import lại
      secret: 'SECRET_KEY_CUA_BAN_O_DAY', // Thực tế nên dùng ConfigService để lấy từ file .env
      signOptions: { expiresIn: '1d' }, // Token có hạn trong 1 ngày
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AuthGuard, // Kích hoạt Global Guard
    },
  ],
})
export class AuthModule {}
