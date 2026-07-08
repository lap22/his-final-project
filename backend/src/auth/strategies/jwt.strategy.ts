import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity'; // Đường dẫn tới file entity của bạn
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/prisma.service';

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
    private prisma: PrismaService,
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
    const legacyUser = await this.userRepository.findOne({
      where: { id: payload.sub },
    });
    const prismaUser = await this.prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, email: true, roleId: true },
    });
    const user = legacyUser ?? prismaUser;
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
