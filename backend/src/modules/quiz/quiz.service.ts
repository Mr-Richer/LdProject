import { Injectable, Logger, BadRequestException, NotFoundException } from '@nestjs/common';
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
   * 查找所有未删除的题目
   */
  async findAll(): Promise<Question[]> {
    try {
      return await this.questionRepository.find({
        where: { isDeleted: 0 },
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      this.logger.error(`查询所有题目失败: ${error.message}`);
      throw new BadRequestException('查询题目失败');
    }
  }

  /**
   * 查找所有题目，包括已软删除的
   */
  async findAllIncludeDeleted(): Promise<Question[]> {
    try {
      return await this.questionRepository.find({
        order: { createdAt: 'DESC' }
      });
    } catch (error) {
      this.logger.error(`查询所有题目(包括已软删除)失败: ${error.message}`);
      throw new BadRequestException('查询所有题目(包括已软删除)失败');
    }
  }

  /**
   * 根据章节ID查找题目
   */
  async findByChapter(chapterId: number): Promise<Question[]> {
    try {
      return await this.questionRepository.find({
        where: { 
          chapterID: chapterId,
          isDeleted: 0
        },
        order: { order: 'ASC', createdAt: 'DESC' }
      });
    } catch (error) {
      this.logger.error(`查询章节题目失败: ${error.message}`);
      throw new BadRequestException('查询章节题目失败');
    }
  }

  /**
   * 根据章节ID查找所有题目，包括已软删除的
   */
  async findByChapterIncludeDeleted(chapterId: number): Promise<Question[]> {
    try {
      return await this.questionRepository.find({
        where: { 
          chapterID: chapterId
        },
        order: { order: 'ASC', createdAt: 'DESC' }
      });
    } catch (error) {
      this.logger.error(`查询章节所有题目(包括已软删除)失败: ${error.message}`);
      throw new BadRequestException('查询章节所有题目(包括已软删除)失败');
    }
  }

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
      
      for (const questionData of questions) {
        // 创建新的题目实体
        const question = this.questionRepository.create({
          quiz_id: quizId,
          chapterID: chapterId,
          type: questionData.type || 'choice',
          question: questionData.questionText || questionData.question,
          options: JSON.stringify(questionData.options || []),
          answer: JSON.stringify(questionData.correctAnswer || ''),
          explanation: questionData.explanation || '',
          difficulty: questionData.difficulty || 'medium',
          order: questionData.order || 0,
          isDeleted: 0
        });
        
        // 保存题目
        const savedQuestion = await this.questionRepository.save(question);
        savedQuestions.push(savedQuestion);
      }
      
      this.logger.log(`成功保存${savedQuestions.length}道题目`);
      return savedQuestions;
    } catch (error) {
      this.logger.error(`保存题目失败: ${error.message}`);
      throw new BadRequestException('保存题目失败');
    }
  }
  
  /**
   * 硬删除题目（从数据库中彻底删除）
   * @param id 题目ID
   * @returns 删除结果
   */
  async deleteQuestion(id: number): Promise<any> {
    this.logger.log(`硬删除题目ID: ${id}`);
    
    try {
      // 先检查题目是否存在
      const question = await this.questionRepository.findOne({ where: { id } });
      
      if (!question) {
        this.logger.warn(`题目不存在，ID: ${id}`);
        throw new NotFoundException(`题目ID ${id} 不存在`);
      }
      
      // 执行删除
      const deleteResult = await this.questionRepository.delete(id);
      
      if (deleteResult.affected === 0) {
        throw new BadRequestException('删除操作未影响任何记录');
      }
      
      this.logger.log(`题目删除成功，ID: ${id}`);
      return { id, affected: deleteResult.affected };
    } catch (error) {
      this.logger.error(`删除题目失败: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * 软删除题目（更新isDeleted字段）
   * @param id 题目ID
   * @param isDeleted 删除标记(0表示未删除, 1表示已删除)
   * @returns 更新结果
   */
  async softDeleteQuestion(id: number, isDeleted: number = 1): Promise<any> {
    this.logger.log(`软删除题目ID: ${id}, isDeleted: ${isDeleted}`);
    
    try {
      // 先检查题目是否存在
      const question = await this.questionRepository.findOne({ where: { id } });
      
      if (!question) {
        this.logger.warn(`题目不存在，ID: ${id}`);
        throw new NotFoundException(`题目ID ${id} 不存在`);
      }
      
      // 执行更新
      const updateResult = await this.questionRepository.update(id, { isDeleted });
      
      if (updateResult.affected === 0) {
        throw new BadRequestException('更新操作未影响任何记录');
      }
      
      this.logger.log(`题目软删除成功，ID: ${id}, isDeleted: ${isDeleted}`);
      
      // 返回更新后的题目
      const updatedQuestion = await this.questionRepository.findOne({ where: { id } });
      return updatedQuestion;
    } catch (error) {
      this.logger.error(`软删除题目失败: ${error.message}`);
      throw error;
    }
  }
} 