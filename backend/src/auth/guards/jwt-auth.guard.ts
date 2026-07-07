import {
  Injectable,
  ExecutionContext,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private readonly reflector: Reflector) {
    super();
  }

  // Hàm này quyết định request có được đi tiếp hay không
  override canActivate(context: ExecutionContext) {
    // Gọi logic xác thực mặc định của Passport-JWT
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) {
      return true;
    }

    return super.canActivate(context);
  }

  // Hàm này xử lý kết quả sau khi Passport-JWT giải mã token xong
  // Hàm này xử lý kết quả sau khi Passport-JWT giải mã token xong
  override handleRequest<TUser = any>(err: any, user: any, info: any): TUser {
    // Nếu có lỗi hoặc không tìm thấy user (token sai, hết hạn, không có token)
    if (err || !user) {
      if (info) {
        // Sử dụng biến info để xóa lỗi 'info' is defined but never used
        console.error('JWT Auth Error Info:', info);
      }
      throw new UnauthorizedException(
        'Phiên làm việc không hợp lệ hoặc đã hết hạn. Vui lòng đăng nhập lại!',
      );
    }

    // Ép kiểu ép buộc (Type Assertion) để đánh lừa ESLint tránh lỗi 'Unsafe return of a value of type any'
    return user as TUser;
  }
}
