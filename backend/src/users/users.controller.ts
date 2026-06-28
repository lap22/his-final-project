import {
  Controller,
  Get,
  Body,
  Patch,
  Delete,
  UseGuards,
  Req,
} from '@nestjs/common';

import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { User } from '../auth/entities/user.entity';
import { UserService } from './users.service';
import { ApiBearerAuth } from '@nestjs/swagger';

interface AuthenticatedRequest extends Request {
  user: { id: number; email: string; role: string };
}
@ApiBearerAuth('JWT-auth')
@Controller('user')
@UseGuards(JwtAuthGuard) // Bảo vệ toàn bộ các API trong class này bằng JWT
export class UserController {
  constructor(private readonly userService: UserService) {}

  // API 1: Xem tài khoản cá nhân hiện tại: GET /user/me
  @Get('me')
  async getMe(@Req() req: AuthenticatedRequest): Promise<User> {
    const userId = req.user.id;
    return await this.userService.findOne(userId);
  }

  // API 2: Cập nhật tài khoản cá nhân (Đổi mật khẩu): PATCH /user/update-me
  @Patch('update-me')
  async updateMe(
    @Req() req: AuthenticatedRequest,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<User> {
    const userId = req.user.id;
    return await this.userService.update(userId, updateUserDto);
  }

  // API 3: Tự xóa tài khoản của mình: DELETE /user/delete-me
  @Delete('delete-me')
  async deleteMe(@Req() req: AuthenticatedRequest) {
    const userId = req.user.id;
    return await this.userService.remove(userId);
  }
}
