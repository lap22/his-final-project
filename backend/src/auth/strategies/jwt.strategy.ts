import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity'; // Đường dẫn tới file entity của bạn
import { ConfigService } from '@nestjs/config';

interface JwtPayload {
  sub: number; // Đổi thành number khớp với ID tự tăng của TypeORM
  email: string;
  roleId: number; // Khớp với roleId trong file auth.service của bạn
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey:
        configService.get<string>('JWT_SECRET') || 'SUPER_SECRET_KEY',
    });
  }

  async validate(payload: JwtPayload) {
    console.log('===> Payload giải mã từ JWT:', payload);
    const user = await this.userRepository.findOne({
      where: { id: payload.sub },
    });
    console.log('===> User tìm được từ DB:', user);
    if (!user) {
      throw new UnauthorizedException(
        'Tài khoản không tồn tại hoặc đã bị khóa',
      );
    }

    // Trả về dữ liệu để ném vào req.user
    return { id: user.id, email: user.email, roleId: user.roleId };
  }
}
