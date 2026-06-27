import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  // Kết nối vào Database khi Module được khởi tạo
  async onModuleInit() {
    await this.$connect();
  }

  // Ngắt kết nối khi Module bị đóng (tránh rò rỉ kết nối)
  async onModuleDestroy() {
    await this.$disconnect();
  }
}
