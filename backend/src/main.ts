import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  // 1. Khởi tạo app phải luôn luôn nằm ĐẦU TIÊN
  const app = await NestFactory.create(AppModule);

  // 2. Cấu hình các Middleware toàn cục (ValidationPipe)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );
  app.enableCors();

  // 3. Cấu hình Swagger tài liệu API
  const config = new DocumentBuilder()
    .setTitle('HIS API')
    .setDescription('The HIS API description')
    .setVersion('1.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Nhập Token của bạn vào đây',
        in: 'header',
      },
      'JWT-auth',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // 4. Hàm listen kích hoạt server phải luôn luôn nằm CUỐI CÙNG
  const port = process.env.PORT ?? 3000;
  await app.listen(3000, '0.0.0.0');
  console.log(`🚀 Server đang chạy tại: http://localhost:${port}`);
  console.log(`📝 Tài liệu Swagger API tại: http://localhost:${port}/api`);
}
bootstrap();
