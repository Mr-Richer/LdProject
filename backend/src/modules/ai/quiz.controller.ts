import { Body, Controller, HttpStatus, Post, Logger, BadRequestException } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { QuizRequestDto, QuestionType } from './dto/quiz-request.dto';
import { ChaptersService } from '../chapters/chapters.service';

@ApiTags('AI测验')
@Controller('ai/quiz')
export class QuizController {
  private readonly logger = new Logger(QuizController.name);

  constructor(
    private readonly aiService: AiService,
    private readonly chaptersService: ChaptersService,
  ) {}

  @Post('generate')
  @ApiOperation({ summary: '生成测验题目' })
  @ApiResponse({ status: HttpStatus.OK, description: '成功生成测验题目' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '请求参数无效' })
  async generateQuiz(@Body() requestDto: QuizRequestDto): Promise<any> {
    this.logger.log(`收到生成测验题目请求: ${JSON.stringify(requestDto)}`);
    
    try {
      // 获取章节内容
      const chapterId = parseInt(requestDto.chapterId, 10);
      if (isNaN(chapterId)) {
        throw new BadRequestException('无效的章节ID');
      }
      
      const chapterContents = await this.chaptersService.findChapterContents(chapterId);
      if (!chapterContents || chapterContents.length === 0) {
        throw new BadRequestException(`未找到章节ID ${chapterId} 的内容`);
      }
      
      // 合并章节内容
      const fullContent = chapterContents
        .map(content => content.content)
        .join('\n\n');
      
      // 使用默认方法生成题目
      const response = await this.aiService.generateQuizQuestions(
        fullContent,
        requestDto.count,
        requestDto.difficulty
      );
      
      // 从AI响应中解析JSON格式的题目
      let questions = [];
      try {
        // 尝试在响应内容中查找JSON数组
        const jsonMatch = response.content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          questions = JSON.parse(jsonMatch[0]);
        } else {
          throw new Error('无法从AI响应中解析JSON数据');
        }
      } catch (error) {
        this.logger.error(`解析AI响应JSON失败: ${error.message}`);
        throw new BadRequestException('解析生成的题目时出错');
      }
      
      // 过滤题目，根据请求的类型
      let filteredQuestions = questions;
      if (requestDto.questionType === QuestionType.SINGLE) {
        filteredQuestions = questions.filter(q => q.type === 'choice');
      }
      
      return {
        code: HttpStatus.OK,
        data: {
          questions: filteredQuestions
        }
      };
    } catch (error) {
      this.logger.error(`生成测验题目失败: ${error.message}`, error.stack);
      
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      throw new BadRequestException(`生成测验题目失败: ${error.message}`);
    }
  }
} 