import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Reflector } from '@nestjs/core';
import { Request } from 'express';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 1. Kiểm tra xem API đang gọi có được gắn nhãn @Public() hay không
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Nếu là API công khai (như Login, Register), cho qua luôn không cần check Token
    if (isPublic) {
      return true;
    }

    const request = context.switchToHttp().getRequest<Request>();

    // 2. Trích xuất token từ Header "Authorization: Bearer <token>"
    const token = this.extractTokenFromHeader(request);

    // Nếu không tìm thấy token, chặn lại ngay lập tức
    if (!token) {
      throw new UnauthorizedException(
        'Bạn cần đăng nhập để thực hiện thao tác này!',
      );
    }

    try {
      // 3. Tiến hành giải mã và kiểm tra tính hợp lệ của Access Token
      const payload = await this.jwtService.verifyAsync<{
        sub: number;
        email: string;
      }>(token);

      // 4. Đính kèm thông tin user đã giải mã vào object request để các Controller sử dụng (ví dụ: req.user.sub)
      request['user'] = payload;
    } catch {
      // Bắt lỗi nếu token hết hạn (quá 15 phút) hoặc chữ ký token sai (giả mạo)
      throw new UnauthorizedException(
        'Phiên đăng nhập đã hết hạn hoặc token không hợp lệ!',
      );
    }

    return true; // Token hợp lệ, cho phép đi tiếp vào Controller
  }

  // Hàm Helper dùng để tách chữ "Bearer " ra khỏi chuỗi Token ở Header
  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}
