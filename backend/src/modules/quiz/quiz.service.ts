import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';

@Injectable()
export class QuizService {
  private readonly logger = new Logger(QuizService.name);

  constructor(
    @InjectRepository(Question)
    private readonly questionRepository: Repository<Question>,
  ) {}

  /**
   * 将生成的题目保存到数据库
   * @param questions 题目列表
   * @param quizId 测验ID
   * @param chapterId 章节ID
   * @returns 保存的题目列表
   */
  async saveQuizQuestions(questions: any[], quizId: number, chapterId: number): Promise<Question[]> {
    this.logger.log(`保存${questions.length}道题目到测验ID ${quizId}, 章节ID ${chapterId}`);
    
    try {
      const savedQuestions: Question[] = [];
      
      // 批量保存题目
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        
        // 创建新的题目实体
        const question = new Question();
        question.quiz_id = quizId;
        question.quizId = quizId; // 注意这里有两个quizId字段
        
        // 安全处理所有字段
        question.type = q.type || 'choice';
        question.question = q.questionText || q.question || '';
        
        // 选项处理 - 确保字符串格式
        if (q.options === undefined || q.options === null) {
          question.options = '[]';
        } else if (typeof q.options === 'string') {
          question.options = q.options;
        } else if (Array.isArray(q.options)) {
          question.options = JSON.stringify(q.options);
        } else {
          question.options = '[]';
        }
        
        // 答案处理 - 确保字符串格式
        if (q.answer === undefined || q.answer === null) {
          question.answer = q.correctAnswer || '';
        } else if (typeof q.answer === 'string') {
          question.answer = q.answer;
        } else if (Array.isArray(q.answer)) {
          question.answer = JSON.stringify(q.answer);
        } else if (q.correctAnswer) {
          if (typeof q.correctAnswer === 'string') {
            question.answer = q.correctAnswer;
          } else if (Array.isArray(q.correctAnswer)) {
            question.answer = JSON.stringify(q.correctAnswer);
          }
        } else {
          question.answer = '';
        }
        
        question.explanation = q.explanation || '';
        question.difficulty = q.difficulty || 'medium';
        question.chapterID = chapterId;
        question.order = i + 1; // 按照数组顺序设置排序
        question.isDeleted = 0; // 默认未删除
        
        try {
          // 保存到数据库，捕获每个题目的保存错误
          const savedQuestion = await this.questionRepository.save(question);
          savedQuestions.push(savedQuestion);
        } catch (saveError) {
          this.logger.error(`保存第${i+1}道题目失败: ${saveError.message}`);
          this.logger.debug(`题目数据: ${JSON.stringify(q)}`);
          this.logger.debug(`处理后的实体: ${JSON.stringify(question)}`);
          // 继续处理下一个题目，不中断整个流程
        }
      }
      
      this.logger.log(`成功保存${savedQuestions.length}道题目`);
      return savedQuestions;
    } catch (error) {
      this.logger.error(`保存题目失败: ${error.message}`);
      this.logger.debug(`错误堆栈: ${error.stack}`);
      throw new BadRequestException(`保存题目失败: ${error.message}`);
    }
  }
} 