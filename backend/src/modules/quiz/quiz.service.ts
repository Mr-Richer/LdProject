import { Injectable, Logger } from '@nestjs/common';
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
        question.type = q.type || 'choice';
        question.question = q.questionText || q.question;
        question.options = Array.isArray(q.options) ? JSON.stringify(q.options) : q.options;
        question.answer = Array.isArray(q.correctAnswer) 
          ? JSON.stringify(q.correctAnswer) 
          : q.correctAnswer;
        question.explanation = q.explanation || '';
        question.difficulty = q.difficulty || 'medium';
        question.chapterID = chapterId;
        question.order = i + 1; // 按照数组顺序设置排序
        question.isDeleted = 0; // 默认未删除
        
        // 保存到数据库
        const savedQuestion = await this.questionRepository.save(question);
        savedQuestions.push(savedQuestion);
      }
      
      this.logger.log(`成功保存${savedQuestions.length}道题目`);
      return savedQuestions;
    } catch (error) {
      this.logger.error(`保存题目失败: ${error.message}`);
      throw new Error(`保存题目失败: ${error.message}`);
    }
  }
} 