import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TokenUsage {
  @ApiProperty({ description: '提示令牌数' })
  prompt_tokens: number;

  @ApiProperty({ description: '完成令牌数' })
  completion_tokens: number;

  @ApiProperty({ description: '总令牌数' })
  total_tokens: number;
}

export class AiResponseDto {
  @ApiProperty({ description: '生成的内容' })
  content: string;

  @ApiPropertyOptional({ description: '令牌使用情况' })
  usage?: TokenUsage;

  @ApiPropertyOptional({ description: '使用的模型' })
  model?: string;
} 