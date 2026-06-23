import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AiChatService } from './ai-chat.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ConsultDto } from './dto/consult.dto';

@ApiTags('ai')
@ApiBearerAuth('JWT-auth')
@Controller('ai-chat')
export class AiChatController {
  constructor(private readonly aiService: AiChatService) {}

  @UseGuards(JwtAuthGuard)
  @Post('consult')
  @ApiOperation({ summary: 'HI' })
  async consult(@Body() dto: ConsultDto) {
    return await this.aiService.analyzeSymptoms(dto.symptoms);
  }
}
