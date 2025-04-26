import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';

export class UpdateChapterDto {
  @ApiPropertyOptional({ description: '章节编号', example: 1 })
  @IsNumber({}, { message: '章节编号必须是数字' })
  @IsOptional()
  chapter_number?: number;

  @ApiPropertyOptional({ description: '章节标题(中文)', example: '中国文化概述' })
  @IsString({ message: '章节标题必须是字符串' })
  @IsOptional()
  title_zh?: string;

  @ApiPropertyOptional({ description: '章节标题(英文)', example: 'Overview of Chinese Culture' })
  @IsString({ message: '章节标题必须是字符串' })
  @IsOptional()
  title_en?: string;

  @ApiPropertyOptional({ description: '章节描述(中文)' })
  @IsString({ message: '章节描述必须是字符串' })
  @IsOptional()
  description_zh?: string;

  @ApiPropertyOptional({ description: '章节描述(英文)' })
  @IsString({ message: '章节描述必须是字符串' })
  @IsOptional()
  description_en?: string;

  @ApiPropertyOptional({ description: '封面图片路径' })
  @IsString({ message: '封面图片路径必须是字符串' })
  @IsOptional()
  cover_image?: string;

  @ApiPropertyOptional({ description: 'PPT文件路径' })
  @IsString({ message: 'PPT文件路径必须是字符串' })
  @IsOptional()
  ppt_file?: string;

  @ApiPropertyOptional({ description: '是否发布' })
  @IsBoolean({ message: '发布状态必须是布尔值' })
  @IsOptional()
  is_published?: boolean;

  @ApiPropertyOptional({ description: '排序索引' })
  @IsNumber({}, { message: '排序索引必须是数字' })
  @IsOptional()
  order_index?: number;
} 