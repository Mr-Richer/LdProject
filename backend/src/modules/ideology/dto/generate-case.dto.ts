import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum CaseType {
  Story = 1,      // 故事型案例
  Debate = 2,     // 辩论型案例
  History = 3,    // 历史事件型案例
  ValueAnalysis = 4, // 价值观分析型案例
}

export enum CaseLength {
  Short = 1,     // 简短
  Medium = 2,    // 中等
  Detailed = 3,  // 详细
}

export class GenerateCaseDto {
  @ApiProperty({
    description: '案例主题',
    example: '爱国主义教育'
  })
  @IsNotEmpty({ message: '主题不能为空' })
  @IsString({ message: '主题必须是字符串' })
  theme: string;

  @ApiProperty({
    description: '案例类型: 1=故事型案例, 2=辩论型案例, 3=历史事件型案例, 4=价值观分析型案例',
    enum: CaseType,
    example: 1
  })
  @IsNotEmpty({ message: '案例类型不能为空' })
  @IsEnum(CaseType, { message: '无效的案例类型' })
  caseType: CaseType;

  @ApiProperty({
    description: '案例长度: 1=简短, 2=中等, 3=详细',
    enum: CaseLength,
    example: 2
  })
  @IsNotEmpty({ message: '案例长度不能为空' })
  @IsEnum(CaseLength, { message: '无效的案例长度' })
  caseLength: CaseLength;

  @ApiProperty({
    description: '章节ID',
    example: 1
  })
  @IsNotEmpty({ message: '章节ID不能为空' })
  @IsInt({ message: '章节ID必须是整数' })
  chapterId: number;

  @ApiProperty({
    description: '用户ID',
    example: 1,
    required: false
  })
  @IsOptional()
  @IsInt({ message: '用户ID必须是整数' })
  userId?: number;
} 