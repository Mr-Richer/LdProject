import { Body, Controller, HttpStatus, Post, Get, Logger, BadRequestException, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { QuizRequestDto, QuestionType } from './dto/quiz-request.dto';
import { ChaptersService } from '../chapters/chapters.service';
import { QuizPromptRequestDto, QuizType } from './dto/quiz-prompt-request.dto';
import { QuizResponseDto } from './dto/quiz-response.dto';
import { QuizService } from '../quiz/quiz.service';

@ApiTags('AI测验')
@Controller('ai/quiz')
export class QuizController {
  private readonly logger = new Logger(QuizController.name);

  constructor(
    private readonly aiService: AiService,
    private readonly chaptersService: ChaptersService,
    private readonly quizService: QuizService,
  ) {}

  // 简单的测试端点，用于确认路由系统是否正常
  @Get('test')
  testRoute() {
    return { message: '路由系统正常工作', timestamp: new Date().toISOString() };
  }

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

  @Post('generate-by-prompt')
  @ApiOperation({ summary: '根据提示词生成测验题目' })
  @ApiResponse({ 
    status: HttpStatus.OK, 
    description: '成功生成测验题目', 
    type: QuizResponseDto 
  })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '请求参数无效' })
  async generateQuizByPrompt(@Body() requestDto: QuizPromptRequestDto): Promise<QuizResponseDto> {
    this.logger.log(`收到根据提示词生成题目请求: ${JSON.stringify(requestDto)}`);
    
    try {
      // 使用AI服务生成题目
      this.logger.log(`调用AI服务生成题目，参数: 
        提示词: ${requestDto.prompt}
        题型: ${requestDto.quizType}
        生成方式: ${requestDto.generationMethod}
        数量: ${requestDto.count}
        难度: ${requestDto.difficulty}
      `);
      
      const response = await this.aiService.generateQuizByPrompt(
        requestDto.prompt,
        requestDto.quizType,
        requestDto.generationMethod,
        requestDto.count,
        requestDto.difficulty
      );
      
      this.logger.log(`AI服务返回结果: ${response.content.substring(0, 200)}...`);
      
      // 从AI响应中解析JSON格式的题目
      let questions = [];
      try {
        // 尝试在响应内容中查找JSON数组
        const jsonMatch = response.content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          const parsedQuestions = JSON.parse(jsonMatch[0]);
          this.logger.log(`原始解析题目: ${JSON.stringify(parsedQuestions)}`);
          
          // 转换题目格式，确保与前端期望的格式一致
          questions = parsedQuestions.map(q => {
            // 基本字段转换
            const formattedQuestion: any = {
              id: q.id || `q${Math.random().toString(36).substring(2, 9)}`,
              type: q.type || requestDto.quizType,
              questionText: q.questionText || q.question || '未提供题目内容',
              explanation: q.explanation || '',
              options: [],
              correctAnswer: null
            };
            
            // 处理选项
            if (Array.isArray(q.options)) {
              // 已经是数组格式，检查元素是否符合{id, text}结构
              formattedQuestion.options = q.options.map(opt => {
                if (typeof opt === 'string') {
                  // 尝试从字符串中解析选项ID和文本
                  const match = opt.match(/^([A-Z0-9])[\.、\s]*\s*(.+)$/);
                  if (match) {
                    return { id: match[1], text: match[2] };
                  }
                  return { id: '?', text: opt };
                } else if (typeof opt === 'object' && opt !== null) {
                  // 已经是对象格式，确保有id和text字段
                  return { 
                    id: opt.id || opt.label || '?', 
                    text: opt.text || opt.content || opt.value || '' 
                  };
                }
                return { id: '?', text: String(opt) };
              });
            } else if (q.type === 'short_answer' || requestDto.quizType === QuizType.SHORT_ANSWER) {
              // 简答题不需要选项
              formattedQuestion.options = [];
            } else if (q.type === 'discussion' || requestDto.quizType === QuizType.DISCUSSION) {
              // 讨论题不需要选项
              formattedQuestion.options = [];
            } else {
              // 默认为空选项数组
              formattedQuestion.options = [];
            }
            
            // 处理答案
            if (q.correctAnswer !== undefined) {
              formattedQuestion.correctAnswer = q.correctAnswer;
            } else if (q.answer !== undefined) {
              formattedQuestion.correctAnswer = q.answer;
            } else {
              // 默认答案
              if (q.type === 'short_answer' || requestDto.quizType === QuizType.SHORT_ANSWER) {
                formattedQuestion.correctAnswer = '参考答案未提供';
              } else if (q.type === 'discussion' || requestDto.quizType === QuizType.DISCUSSION) {
                // 讨论题没有标准答案，但可以有讨论方向
                formattedQuestion.discussionPoints = q.discussionPoints || '讨论方向未提供';
                formattedQuestion.correctAnswer = null;
              } else if (q.type === 'multiple' || requestDto.quizType === QuizType.MULTIPLE) {
                formattedQuestion.correctAnswer = [];
              } else {
                formattedQuestion.correctAnswer = 'A';
              }
            }
            
            return formattedQuestion;
          });
          
          this.logger.log(`成功转换题目格式，共${questions.length}道题`);
          this.logger.log(`转换后第一题示例: ${JSON.stringify(questions[0])}`);
        } else {
          this.logger.warn(`未能在AI响应中找到JSON数组，响应内容: ${response.content}`);
          throw new Error('无法从AI响应中解析JSON数据');
        }
      } catch (error) {
        this.logger.error(`解析AI响应JSON失败: ${error.message}`);
        throw new BadRequestException('解析生成的题目时出错');
      }
      
      this.logger.log(`生成题目成功，返回${questions.length}道题目`);
      return {
        code: HttpStatus.OK,
        data: {
          questions: questions
        },
        message: '题目生成成功'
      };
    } catch (error) {
      this.logger.error(`根据提示词生成题目失败: ${error.message}`, error.stack);
      this.logger.error(`错误详情: ${JSON.stringify(error)}`);
      
      if (error instanceof BadRequestException) {
        throw error;
      }
      
      throw new BadRequestException(`生成题目失败: ${error.message}`);
    }
  }

  @Post('generate-and-save')
  @ApiOperation({ summary: '生成测验题目并保存到数据库' })
  @ApiResponse({ status: HttpStatus.OK, description: '成功生成并保存测验题目' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '请求参数无效' })
  async generateAndSaveQuiz(
    @Body() requestDto: QuizPromptRequestDto & { quizId: number, chapterId: number }
  ): Promise<QuizResponseDto> {
    this.logger.log(`收到生成并保存题目请求: ${JSON.stringify(requestDto)}`);
    
    // 首先生成题目
    const generateResponse = await this.generateQuizByPrompt(requestDto);
    
    if (generateResponse.code !== HttpStatus.OK || !generateResponse.data.questions) {
      throw new BadRequestException('生成题目失败');
    }
    
    // 然后保存到数据库
    try {
      const savedQuestions = await this.quizService.saveQuizQuestions(
        generateResponse.data.questions,
        requestDto.quizId,
        requestDto.chapterId
      );
      
      this.logger.log(`成功保存${savedQuestions.length}道题目到数据库`);
      
      // 在返回结果中包含保存状态
      return {
        code: HttpStatus.OK,
        data: {
          questions: generateResponse.data.questions,
          savedToDatabase: true,
          savedCount: savedQuestions.length
        },
        message: '题目生成并保存成功'
      };
    } catch (error) {
      this.logger.error(`保存题目失败: ${error.message}`);
      
      // 返回生成成功但保存失败的结果
      return {
        code: HttpStatus.OK,
        data: {
          questions: generateResponse.data.questions,
          savedToDatabase: false,
          savedCount: 0,
          error: error.message
        },
        message: '题目生成成功，但保存失败'
      };
    }
  }
} 