import { IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, Max, Min } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum TopicType {
  Basic = 'basic',      // 基础讨论题
  Critical = 'critical', // 批判性思维讨论题
  Creative = 'creative', // 创造性思维讨论题
  Applied = 'applied',   // 应用型讨论题
}

export class GenerateTopicsDto {
  @ApiProperty({
    description: '讨论主题',
    example: '爱国主义教育'
  })
  @IsNotEmpty({ message: '主题不能为空' })
  @IsString({ message: '主题必须是字符串' })
  theme: string;

  @ApiProperty({
    description: '讨论题数量',
    example: 3,
    default: 3
  })
  @IsOptional()
  @IsInt({ message: '数量必须是整数' })
  @Min(1, { message: '数量最小为1' })
  @Max(10, { message: '数量最大为10' })
  count?: number = 3;

  @ApiProperty({
    description: '讨论题类型',
    enum: TopicType,
    example: TopicType.Basic,
    default: TopicType.Basic
  })
  @IsOptional()
  @IsEnum(TopicType, { message: '无效的讨论题类型' })
  type?: TopicType = TopicType.Basic;

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