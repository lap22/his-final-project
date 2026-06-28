import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { User } from '../auth/entities/user.entity'; // Đảm bảo import trúng Entity User của hệ thống
import { UserController } from './users.controller';
import { UserService } from './users.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), // Khai báo UserRepository ở đây
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [UserService], // Export để các module khác (như AuthModule) có thể dùng chung hàm tìm kiếm
})
export class UsersModule {}
