import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsNumber, Min, Max, IsEnum, IsNotEmpty } from 'class-validator';

/**
 * 题目类型枚举
 */
export enum QuizType {
  SINGLE = 'single',     // 单选题
  MULTIPLE = 'multiple', // 多选题
  SHORT_ANSWER = 'short_answer', // 简答题
  DISCUSSION = 'discussion', // 讨论题
}

/**
 * 生成方式枚举
 */
export enum GenerationMethod {
  AI = 'ai',             // 智能生成
  RANDOM = 'random'      // 随机生成
}

/**
 * 难度级别枚举
 */
export enum DifficultyLevel {
  EASY = 'easy',
  MEDIUM = 'medium',
  HARD = 'hard'
}

/**
 * 根据提示词生成课堂小测题目的请求DTO
 */
export class QuizPromptRequestDto {
  @ApiProperty({ 
    description: '提示词', 
    example: '关于中国传统文化中的礼仪部分，生成5道单选题' 
  })
  @IsNotEmpty({ message: '提示词不能为空' })
  @IsString()
  prompt: string;

  @ApiPropertyOptional({ 
    description: '题目类型', 
    enum: QuizType, 
    default: QuizType.SINGLE 
  })
  @IsOptional()
  @IsEnum(QuizType, { message: '题目类型必须是single、multiple、short_answer或discussion中的一个' })
  quizType?: QuizType = QuizType.SINGLE;

  @ApiPropertyOptional({ 
    description: '生成方式', 
    enum: GenerationMethod, 
    default: GenerationMethod.AI 
  })
  @IsOptional()
  @IsEnum(GenerationMethod, { message: '生成方式必须是ai或random中的一个' })
  generationMethod?: GenerationMethod = GenerationMethod.AI;

  @ApiPropertyOptional({ 
    description: '题目数量', 
    default: 5, 
    minimum: 1, 
    maximum: 20 
  })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(20)
  count?: number = 5;

  @ApiPropertyOptional({ 
    description: '难度级别', 
    enum: DifficultyLevel, 
    default: DifficultyLevel.MEDIUM 
  })
  @IsOptional()
  @IsEnum(DifficultyLevel, { message: '难度级别必须是easy、medium或hard中的一个' })
  difficulty?: DifficultyLevel = DifficultyLevel.MEDIUM;
} 