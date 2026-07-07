import { SetMetadata } from '@nestjs/common';

export const ROLES_KEY = 'roles';
// Nhận vào mảng số nguyên đại diện cho Role (Ví dụ: @Roles(1, 2))
export const Roles = (...roles: number[]) => SetMetadata(ROLES_KEY, roles);
