import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min, Max, IsEnum, IsNotEmpty } from 'class-validator';

export enum QuestionType {
  SINGLE = 'single',     // 单选题
  MULTIPLE = 'multiple', // 多选题
  SHORT = 'short',       // 简答题
  DISCUSSION = 'discussion' // 讨论题
}

export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

export class QuizRequestDto {
  @ApiProperty({ description: '章节ID' })
  @IsNotEmpty({ message: '章节ID不能为空' })
  chapterId: string;

  @ApiPropertyOptional({ description: '题目类型', enum: QuestionType, default: QuestionType.SINGLE })
  @IsOptional()
  @IsEnum(QuestionType, { message: '题目类型必须是single、multiple、short或discussion中的一个' })
  questionType?: QuestionType = QuestionType.SINGLE;

  @ApiPropertyOptional({ description: '题目数量', default: 5, minimum: 1, maximum: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(10)
  count?: number = 5;

  @ApiPropertyOptional({ description: '难度级别', enum: DifficultyLevel, default: DifficultyLevel.MEDIUM })
  @IsOptional()
  @IsEnum(DifficultyLevel, { message: '难度级别必须是easy、medium或hard中的一个' })
  difficulty?: DifficultyLevel = DifficultyLevel.MEDIUM;
} 