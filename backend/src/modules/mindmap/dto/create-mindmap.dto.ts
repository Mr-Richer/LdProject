import { IsNotEmpty, IsString, IsArray, IsOptional, IsInt, IsEnum, Max, Min } from 'class-validator';

export enum MindmapStyle {
  STANDARD = 'standard',
  COLORFUL = 'colorful',
  SIMPLE = 'simple'
}

export class CreateMindmapDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsString()
  @IsNotEmpty()
  central_topic: string;

  @IsArray()
  @IsInt({ each: true })
  selectedKnowledgePoints: number[];

  @IsString()
  @IsOptional()
  keywords: string;

  @IsInt()
  @Min(2)
  @Max(5)
  @IsOptional()
  max_levels: number = 4;

  @IsEnum(MindmapStyle)
  @IsOptional()
  style: MindmapStyle = MindmapStyle.STANDARD;

  @IsInt()
  @IsOptional()
  user_id?: number;
} 