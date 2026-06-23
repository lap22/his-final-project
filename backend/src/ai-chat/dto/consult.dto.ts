import { ApiProperty } from '@nestjs/swagger';

export class ConsultDto {
  @ApiProperty({
    description: 'Các triệu chứng bệnh lý mà bạn đang gặp phải',
    example: 'Tôi bị đau đầu, ho khan và sốt nhẹ từ tối qua',
  })
  symptoms!: string; // Sử dụng ! để tránh lỗi strictPropertyInitialization nếu có
}