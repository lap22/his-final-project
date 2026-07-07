import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { APP_GUARD } from '@nestjs/core';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './strategies/jwt.strategy';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PatientsModule } from '../patients/patients.module';

@Module({
  imports: [
    PassportModule.register({ defaultStrategy: 'jwt' }),
    TypeOrmModule.forFeature([User]),
    PatientsModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET') || 'SUPER_SECRET_KEY',
        signOptions: { expiresIn: '7d' }, // 💡 Khuyên bạn đổi từ 15m thành '1d' (1 ngày) để lúc code không bị hết hạn token liên tục nhé!
      }),
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    JwtAuthGuard,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard, // ✅ PHẢI SỬA THÀNH: JwtAuthGuard (Bảo vệ global chuẩn do bạn viết)
    },
  ],
  exports: [JwtAuthGuard, PassportModule], // ✅ Sửa lại exports cho gọn và đúng bài bản
})
export class AuthModule {}
