import { Body, Controller, Post, Logger, HttpStatus, BadRequestException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QuizService } from './quiz.service';

// 题目保存DTO
class SaveQuizQuestionsDto {
  questions: any[];
  quizId: number;
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
    this.logger.log(`收到保存测验题目请求: quizId=${saveDto.quizId}, chapterId=${saveDto.chapterId}, 题目数量=${saveDto.questions.length}`);
    
    try {
      // 验证基本参数
      if (!saveDto.questions || !Array.isArray(saveDto.questions) || saveDto.questions.length === 0) {
        throw new BadRequestException('题目列表不能为空');
      }
      
      if (!saveDto.quizId) {
        throw new BadRequestException('测验ID不能为空');
      }
      
      if (!saveDto.chapterId) {
        throw new BadRequestException('章节ID不能为空');
      }
      
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
      this.logger.error(`保存题目失败: ${error.message}`);
      throw new BadRequestException(`保存题目失败: ${error.message}`);
    }
  }
} 