import { Body, Controller, Post, Logger, HttpStatus, BadRequestException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QuizService } from './quiz.service';
import { IsArray, IsNumber, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

// 题目DTO - 允许空对象
class QuestionDto {
  // 移除所有字段验证，允许任何属性
  // 原来的属性
  type?: string;
  question?: string;
  options?: string;
  answer?: string;
  explanation?: string;
  difficulty?: string;
  order?: number;
  // 允许任何其他属性
  [key: string]: any;
}

// 题目保存DTO
class SaveQuizQuestionsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];

  @IsNumber()
  @IsNotEmpty()
  quizId: number;

  @IsNumber()
  @IsNotEmpty()
  chapterId: number;
}

// 响应DTO
class SaveQuizQuestionsResponseDto {
  code: number;
  message: string;
  data: {
    savedCount: number;
    questions: any[];
  };
}

@ApiTags('测验题目')
@Controller('quiz')
export class QuizController {
  private readonly logger = new Logger(QuizController.name);

  constructor(private readonly quizService: QuizService) {}

  @Post('save-questions')
  @ApiOperation({ summary: '保存测验题目到数据库' })
  @ApiResponse({ status: HttpStatus.OK, description: '成功保存题目' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '请求参数无效' })
  async saveQuizQuestions(@Body() saveDto: SaveQuizQuestionsDto): Promise<SaveQuizQuestionsResponseDto> {
    // 记录请求体详情，帮助调试
    this.logger.debug(`原始请求体: ${JSON.stringify(saveDto)}`);
    
    try {
      // 安全检查 - 即使有class-validator，也做额外检查以增强安全性
      if (!saveDto) {
        throw new BadRequestException('请求体为空');
      }
      
      if (!saveDto.questions) {
        throw new BadRequestException('questions字段不存在');
      }
      
      if (!Array.isArray(saveDto.questions)) {
        throw new BadRequestException('questions必须是数组');
      }
      
      // 仅在确认questions是数组后记录长度
      this.logger.log(`收到保存测验题目请求: quizId=${saveDto.quizId}, chapterId=${saveDto.chapterId}, 题目数量=${saveDto.questions.length}`);
      
      // 验证基本参数
      if (saveDto.questions.length === 0) {
        throw new BadRequestException('题目列表不能为空');
      }
      
      if (!saveDto.quizId) {
        throw new BadRequestException('测验ID不能为空');
      }
      
      if (!saveDto.chapterId) {
        throw new BadRequestException('章节ID不能为空');
      }
      
      // 保存题目前记录每个题目的属性，帮助调试
      this.logger.debug(`题目属性示例: ${Object.keys(saveDto.questions[0] || {}).join(', ')}`);
      
      // 保存题目
      const savedQuestions = await this.quizService.saveQuizQuestions(
        saveDto.questions,
        saveDto.quizId,
        saveDto.chapterId
      );
      
      // 返回结果
      return {
        code: HttpStatus.OK,
        message: '题目保存成功',
        data: {
          savedCount: savedQuestions.length,
          questions: savedQuestions
        }
      };
    } catch (error) {
      // 详细记录错误
      this.logger.error(`保存题目失败: ${error.message}`);
      this.logger.debug(`错误堆栈: ${error.stack}`);
      
      throw new BadRequestException(`保存题目失败: ${error.message}`);
    }
  }
} 