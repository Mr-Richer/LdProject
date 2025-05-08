import { IsNotEmpty, IsObject, IsNumber, IsOptional, IsString } from 'class-validator';

export class SaveMindmapDto {
  @IsNotEmpty()
  @IsObject()
  data: any; // 思维导图数据

  @IsNotEmpty()
  @IsNumber()
  chapterId: number; // 关联的章节编号

  @IsString()
  @IsOptional()
  title?: string; // 可选的标题

  @IsString()
  @IsOptional()
  centralTopic?: string; // 可选的中心主题
} 