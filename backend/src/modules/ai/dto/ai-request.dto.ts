import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional, IsString, IsNumber, Min, Max, IsIn } from 'class-validator';

export class AiRequestDto {
  @ApiProperty({ description: '提示文本' })
  @IsString()
  @IsNotEmpty({ message: '提示文本不能为空' })
  prompt: string;

  @ApiPropertyOptional({ description: '系统提示文本', example: '你是一个专业的教育助手' })
  @IsOptional()
  @IsString()
  systemPrompt?: string;

  @ApiPropertyOptional({ description: '模型类型', enum: ['openrouter', 'chutes'], default: 'openrouter' })
  @IsOptional()
  @IsString()
  @IsIn(['openrouter', 'chutes'], { message: '模型类型只能是 openrouter 或 chutes' })
  modelType?: string;

  @ApiPropertyOptional({ description: '温度参数，控制随机性', minimum: 0, maximum: 2, default: 0.7 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(2)
  temperature?: number;

  @ApiPropertyOptional({ description: '最大令牌数', default: 1000 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  maxTokens?: number;
} 