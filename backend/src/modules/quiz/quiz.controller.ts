import { Body, Controller, Post, Logger, HttpStatus, BadRequestException, Get, Param, Query, Delete, Patch } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { QuizService } from './quiz.service';
import { IsArray, IsNumber, IsNotEmpty, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { Question } from './entities/question.entity';

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

@ApiTags('题目管理')
@Controller('ai/quiz')
export class QuizController {
  private readonly logger = new Logger(QuizController.name);

  constructor(private readonly quizService: QuizService) {}

  @Get('questions')
  @ApiOperation({ summary: '获取所有题目' })
  @ApiResponse({ status: HttpStatus.OK, description: '成功获取题目列表' })
  async getAllQuestions() {
    try {
      const questions = await this.quizService.findAll();
      return {
        code: 200,
        data: questions,
        message: '获取题目列表成功'
      };
    } catch (error) {
      this.logger.error(`获取题目列表失败: ${error.message}`);
      throw new BadRequestException('获取题目列表失败');
    }
  }

  @Get('questions/chapter/:chapterId')
  @ApiOperation({ summary: '获取指定章节的题目' })
  @ApiResponse({ status: HttpStatus.OK, description: '成功获取章节题目' })
  async getQuestionsByChapter(@Param('chapterId') chapterId: string) {
    try {
      const questions = await this.quizService.findByChapter(parseInt(chapterId));
      return {
        code: 200,
        data: questions,
        message: '获取章节题目成功'
      };
    } catch (error) {
      this.logger.error(`获取章节题目失败: ${error.message}`);
      throw new BadRequestException('获取章节题目失败');
    }
  }

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

  @Delete('questions/:id')
  @ApiOperation({ summary: '硬删除题目' })
  @ApiResponse({ status: HttpStatus.OK, description: '成功删除题目' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '题目不存在' })
  async deleteQuestion(@Param('id') id: string) {
    try {
      this.logger.log(`接收到硬删除题目请求: ID=${id}`);
      const deleteResult = await this.quizService.deleteQuestion(parseInt(id));
      
      return {
        code: HttpStatus.OK,
        message: '题目删除成功',
        data: deleteResult
      };
    } catch (error) {
      this.logger.error(`删除题目失败: ${error.message}`);
      throw new BadRequestException(`删除题目失败: ${error.message}`);
    }
  }

  @Patch('questions/:id')
  @ApiOperation({ summary: '软删除题目(标记删除)' })
  @ApiResponse({ status: HttpStatus.OK, description: '成功标记删除题目' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '题目不存在' })
  async softDeleteQuestion(@Param('id') id: string, @Body() updateData: any) {
    try {
      this.logger.log(`接收到软删除题目请求: ID=${id}, isDeleted=${updateData.isDeleted}`);
      const updateResult = await this.quizService.softDeleteQuestion(parseInt(id), updateData.isDeleted);
      
      return {
        code: HttpStatus.OK,
        message: '题目标记删除成功',
        data: updateResult
      };
    } catch (error) {
      this.logger.error(`标记删除题目失败: ${error.message}`);
      throw new BadRequestException(`标记删除题目失败: ${error.message}`);
    }
  }

  @Patch('questions/:id/soft-delete')
  @ApiOperation({ summary: '软删除题目(专用端点)' })
  @ApiResponse({ status: HttpStatus.OK, description: '成功标记删除题目' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: '题目不存在' })
  async softDeleteQuestionEndpoint(@Param('id') id: string) {
    try {
      this.logger.log(`接收到软删除题目请求(专用端点): ID=${id}`);
      const updateResult = await this.quizService.softDeleteQuestion(parseInt(id), 1);
      
      return {
        code: HttpStatus.OK,
        message: '题目标记删除成功',
        data: updateResult
      };
    } catch (error) {
      this.logger.error(`标记删除题目失败: ${error.message}`);
      throw new BadRequestException(`标记删除题目失败: ${error.message}`);
    }
  }

  @Get('questions/all-with-deleted')
  @ApiOperation({ summary: '获取所有题目(包括已软删除)' })
  @ApiResponse({ status: HttpStatus.OK, description: '成功获取所有题目(包括已软删除)' })
  async getAllQuestionsIncludeDeleted() {
    try {
      this.logger.log('获取所有题目(包括已软删除)');
      const questions = await this.quizService.findAllIncludeDeleted();
      return {
        code: 200,
        data: questions,
        message: '获取所有题目(包括已软删除)成功'
      };
    } catch (error) {
      this.logger.error(`获取所有题目(包括已软删除)失败: ${error.message}`);
      throw new BadRequestException('获取所有题目(包括已软删除)失败');
    }
  }

  @Get('questions/chapter/:chapterId/all-with-deleted')
  @ApiOperation({ summary: '获取指定章节的所有题目(包括已软删除)' })
  @ApiResponse({ status: HttpStatus.OK, description: '成功获取章节所有题目(包括已软删除)' })
  async getChapterQuestionsIncludeDeleted(@Param('chapterId') chapterId: string) {
    try {
      this.logger.log(`获取章节${chapterId}的所有题目(包括已软删除)`);
      const questions = await this.quizService.findByChapterIncludeDeleted(parseInt(chapterId));
      return {
        code: 200,
        data: questions,
        message: `获取章节${chapterId}的所有题目(包括已软删除)成功`
      };
    } catch (error) {
      this.logger.error(`获取章节所有题目(包括已软删除)失败: ${error.message}`);
      throw new BadRequestException('获取章节所有题目(包括已软删除)失败');
    }
  }
} 