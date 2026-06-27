import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Lấy danh sách roleId (number) được phép truy cập API
    const requiredRoles = this.reflector.getAllAndOverride<number[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    if (!requiredRoles) {
      return true;
    }

    // Ép kiểu request rõ ràng để tránh lỗi 'Unsafe assignment of an any value'
    const request = context
      .switchToHttp()
      .getRequest<{ user?: { id: number; email: string; roleId: number } }>();
    const user = request.user;

    // Kiểm tra xem roleId của user có khớp không
    const hasRole = requiredRoles.some((role) => user?.roleId === role);

    if (!hasRole) {
      throw new ForbiddenException('Bạn không có quyền truy cập tính năng này');
    }

    return true;
  }
}
