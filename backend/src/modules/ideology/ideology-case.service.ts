import { BadRequestException, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Connection } from 'mysql2/promise';
import { AiService } from '../ai/ai.service';
import { UploadService } from '../upload/upload.service';
import { DatabaseService } from '../../database/database.service';
import { GenerateCaseDto, CaseType, CaseLength } from './dto/generate-case.dto';
import { QueryCaseDto } from './dto/query-case.dto';
import { ResourceDto, ResourceType } from './dto/resource.dto';
import { IdeologyCase, IdeologyCaseResource } from './entities/ideology-case.entity';
import { GenerateTopicsDto, TopicType } from './dto/generate-topics.dto';

@Injectable()
export class IdeologyCaseService {
  private readonly logger = new Logger(IdeologyCaseService.name);

  constructor(
    private readonly databaseService: DatabaseService,
    private readonly aiService: AiService,
    private readonly uploadService: UploadService,
  ) {}

  /**
   * 生成思政案例
   * @param generateCaseDto - 生成案例的参数
   * @returns 生成的案例数据
   */
  async generateCase(generateCaseDto: GenerateCaseDto & { userId: number }): Promise<IdeologyCase> {
    const { theme, caseType, caseLength, chapterId, userId } = generateCaseDto;

    // 构建提示词
    const caseTypeMap = {
      [CaseType.Story]: '故事型案例',
      [CaseType.Debate]: '辩论型案例',
      [CaseType.History]: '历史事件型案例',
      [CaseType.ValueAnalysis]: '价值观分析型案例',
    };
    
    const caseLengthMap = {
      [CaseLength.Short]: '简短 (300字以内)',
      [CaseLength.Medium]: '中等 (500-800字)',
      [CaseLength.Detailed]: '详细 (1000字以上)',
    };
    
    // 构建提示词
    const prompt = `
    请生成一个${caseLengthMap[caseLength]}的${caseTypeMap[caseType]}。
    主题是：${theme}。
    请确保案例具有清晰的思政元素，体现社会主义核心价值观，弘扬中华优秀传统文化。
    案例应该有适当的长度，并且提供一个适合教学使用的案例标题。
    `;
    
    // 调用AI服务生成内容
    try {
      const aiResponse = await this.aiService.generateText(prompt);
      
      if (!aiResponse || !aiResponse.text) {
        throw new BadRequestException('AI生成内容失败');
      }
      
      // 解析AI生成的内容，提取标题
      let title = theme; // 默认使用主题作为标题
      let content = aiResponse.text;
      
      // 尝试从生成内容中提取标题（如果第一行看起来像标题）
      const lines = content.split('\n');
      if (lines[0] && lines[0].length < 50 && !lines[0].endsWith('。')) {
        title = lines[0].replace(/[《》""]/g, '');
        content = lines.slice(1).join('\n').trim();
      }
      
      // 保存到数据库
      const connection = await this.databaseService.getConnection();
      
      try {
        await connection.beginTransaction();
        
        const [result] = await connection.execute(
          `INSERT INTO ideology_cases 
           (title, content, chapter_id, user_id, case_type, case_length, is_ai_generated, theme)
           VALUES (?, ?, ?, ?, ?, ?, 1, ?)`,
          [title, content, chapterId, userId, caseType, caseLength, theme]
        );
        
        const caseId = (result as any).insertId;
        
        await connection.commit();
        
        // 返回生成的案例数据
        return {
          id: caseId,
          title,
          content,
          chapter_id: chapterId,
          user_id: userId,
          case_type: caseType,
          case_length: caseLength,
          is_ai_generated: true,
          theme,
          created_at: new Date(),
          updated_at: new Date(),
        };
      } catch (err) {
        await connection.rollback();
        this.logger.error(`保存思政案例失败: ${err.message}`, err.stack);
        throw new BadRequestException(`保存思政案例失败: ${err.message}`);
      } finally {
        connection.release();
      }
    } catch (error) {
      this.logger.error(`生成思政案例失败: ${error.message}`, error.stack);
      throw new BadRequestException(`生成思政案例失败: ${error.message}`);
    }
  }

  /**
   * 获取思政案例列表
   * @param queryDto - 查询参数
   * @returns 案例列表及分页信息
   */
  async getCases(queryDto: QueryCaseDto): Promise<{ cases: IdeologyCase[], pagination: any }> {
    const { chapterId, userId, page = 1, limit = 10 } = queryDto;
    
    // 构建查询条件
    let conditions = [];
    let params = [];
    
    if (chapterId) {
      conditions.push('chapter_id = ?');
      params.push(chapterId);
    }
    
    if (userId) {
      conditions.push('user_id = ?');
      params.push(userId);
    }
    
    const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
    
    // 计算分页参数
    const offset = (page - 1) * limit;
    
    try {
      const connection = await this.databaseService.getConnection();
      
      try {
        // 查询数据库
        const [casesResult] = await connection.execute(
          `SELECT id, title, SUBSTRING(content, 1, 200) as content_preview, 
           chapter_id, user_id, case_type, case_length, theme, 
           created_at, updated_at
           FROM ideology_cases
           ${whereClause}
           ORDER BY created_at DESC
           LIMIT ? OFFSET ?`,
          [...params, Number(limit), Number(offset)]
        );
        
        // 查询总数
        const [countResult] = await connection.execute(
          `SELECT COUNT(*) as total FROM ideology_cases ${whereClause}`,
          params
        );
        
        // 查询各案例的资源数量
        const cases = casesResult as any[];
        const caseIds = cases.map(c => c.id);
        let resourceCounts = [];
        
        if (caseIds.length > 0) {
          const placeholders = caseIds.map(() => '?').join(',');
          const [counts] = await connection.execute(
            `SELECT case_id, COUNT(*) as count, 
             SUM(CASE WHEN resource_type = 1 THEN 1 ELSE 0 END) as image_count,
             SUM(CASE WHEN resource_type = 2 THEN 1 ELSE 0 END) as video_count,
             SUM(CASE WHEN resource_type = 3 THEN 1 ELSE 0 END) as link_count
             FROM ideology_resources
             WHERE case_id IN (${placeholders})
             GROUP BY case_id`,
            caseIds
          );
          
          resourceCounts = counts as any[];
        }
        
        // 合并资源计数数据
        const casesWithResources = cases.map(c => {
          const resourceData = resourceCounts.find(r => r.case_id === c.id) || { 
            count: 0, 
            image_count: 0,
            video_count: 0,
            link_count: 0 
          };
          
          return {
            ...c,
            resource_count: resourceData.count,
            image_count: resourceData.image_count,
            video_count: resourceData.video_count,
            link_count: resourceData.link_count
          };
        });
        
        return {
          cases: casesWithResources,
          pagination: {
            total: countResult[0].total,
            page: Number(page),
            limit: Number(limit),
            pages: Math.ceil(countResult[0].total / limit)
          }
        };
      } finally {
        connection.release();
      }
    } catch (error) {
      this.logger.error(`获取思政案例列表失败: ${error.message}`, error.stack);
      throw new BadRequestException(`获取思政案例列表失败: ${error.message}`);
    }
  }

  /**
   * 获取思政案例详情
   * @param id - 案例ID
   * @returns 案例详情（包含关联资源）
   */
  async getCaseDetail(id: number): Promise<IdeologyCase> {
    try {
      const connection = await this.databaseService.getConnection();
      
      try {
        // 查询案例详情
        const [cases] = await connection.execute(
          `SELECT * FROM ideology_cases WHERE id = ?`,
          [id]
        );
        
        if (!cases || (cases as any[]).length === 0) {
          throw new NotFoundException(`未找到ID为${id}的思政案例`);
        }
        
        const caseDetail = (cases as any[])[0];
        
        // 查询案例资源
        const [resources] = await connection.execute(
          `SELECT id, resource_type, resource_url, resource_name, 
           file_size, file_extension, created_at
           FROM ideology_resources
           WHERE case_id = ?
           ORDER BY created_at ASC`,
          [id]
        );
        
        return {
          ...caseDetail,
          resources: resources as IdeologyCaseResource[]
        };
      } finally {
        connection.release();
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`获取思政案例详情失败: ${error.message}`, error.stack);
      throw new BadRequestException(`获取思政案例详情失败: ${error.message}`);
    }
  }

  /**
   * 更新思政案例
   * @param id - 案例ID
   * @param updateData - 更新数据
   * @returns 更新结果
   */
  async updateCase(id: number, updateData: Partial<GenerateCaseDto>): Promise<any> {
    // 构建更新字段
    const updateFields = [];
    const params = [];
    
    if (updateData.theme !== undefined) {
      updateFields.push('theme = ?');
      params.push(updateData.theme);
    }
    
    if (updateData.caseType !== undefined) {
      updateFields.push('case_type = ?');
      params.push(updateData.caseType);
    }
    
    if (updateData.caseLength !== undefined) {
      updateFields.push('case_length = ?');
      params.push(updateData.caseLength);
    }
    
    if ('title' in updateData) {
      updateFields.push('title = ?');
      params.push(updateData.title);
    }
    
    if ('content' in updateData) {
      updateFields.push('content = ?');
      params.push(updateData.content);
    }
    
    if (updateFields.length === 0) {
      throw new BadRequestException('未提供任何更新字段');
    }
    
    try {
      const connection = await this.databaseService.getConnection();
      
      try {
        // 先检查案例是否存在
        const [check] = await connection.execute(
          `SELECT id FROM ideology_cases WHERE id = ?`,
          [id]
        );
        
        if (!check || (check as any[]).length === 0) {
          throw new NotFoundException(`未找到ID为${id}的思政案例`);
        }
        
        // 执行更新
        params.push(id); // 添加WHERE条件的参数
        const [result] = await connection.execute(
          `UPDATE ideology_cases
           SET ${updateFields.join(', ')}
           WHERE id = ?`,
          params
        );
        
        return {
          id: Number(id),
          updated: true,
          affected_rows: (result as any).affectedRows
        };
      } finally {
        connection.release();
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`更新思政案例失败: ${error.message}`, error.stack);
      throw new BadRequestException(`更新思政案例失败: ${error.message}`);
    }
  }

  /**
   * 删除思政案例
   * @param id - 案例ID
   * @returns 删除结果
   */
  async deleteCase(id: number): Promise<any> {
    try {
      const connection = await this.databaseService.getConnection();
      
      try {
        // 先查询案例是否存在及其关联资源
        const [caseResult] = await connection.execute(
          `SELECT id FROM ideology_cases WHERE id = ?`,
          [id]
        );
        
        if (!caseResult || (caseResult as any[]).length === 0) {
          throw new NotFoundException(`未找到ID为${id}的思政案例`);
        }
        
        // 查询关联的资源文件
        const [resources] = await connection.execute(
          `SELECT id, resource_type, resource_url 
           FROM ideology_resources 
           WHERE case_id = ? AND resource_type IN (1, 2)`,  // 只查询图片和视频
          [id]
        );
        
        // 开始事务
        await connection.beginTransaction();
        
        try {
          // 删除案例 (由于外键约束设置为CASCADE，会自动删除关联的资源记录)
          const [result] = await connection.execute(
            `DELETE FROM ideology_cases WHERE id = ?`,
            [id]
          );
          
          await connection.commit();
          
          // 异步删除文件存储中的资源文件
          const resourcesArray = resources as any[];
          if (resourcesArray.length > 0) {
            const fileUrls = resourcesArray
              .filter(r => r.resource_type === 1 || r.resource_type === 2)
              .map(r => r.resource_url);
              
            // 异步删除文件，不等待结果
            if (fileUrls.length > 0) {
              this.uploadService.deleteFiles(fileUrls).catch(err => {
                this.logger.error(`删除思政案例资源文件失败: ${err.message}`, err.stack);
              });
            }
          }
          
          return {
            id: Number(id),
            deleted: true,
            affected_rows: (result as any).affectedRows,
            resources_deleted: resourcesArray.length
          };
        } catch (err) {
          await connection.rollback();
          throw err;
        }
      } finally {
        connection.release();
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`删除思政案例失败: ${error.message}`, error.stack);
      throw new BadRequestException(`删除思政案例失败: ${error.message}`);
    }
  }

  /**
   * 上传思政案例资源
   * @param caseId - 案例ID
   * @param resourceDto - 资源数据
   * @param file - 上传的文件（可选）
   * @returns 上传结果
   */
  async uploadResource(caseId: number, resourceDto: ResourceDto, file?: Express.Multer.File): Promise<any> {
    try {
      const connection = await this.databaseService.getConnection();
      
      try {
        // 先检查案例是否存在
        const [check] = await connection.execute(
          `SELECT id FROM ideology_cases WHERE id = ?`,
          [caseId]
        );
        
        if (!check || (check as any[]).length === 0) {
          throw new NotFoundException(`未找到ID为${caseId}的思政案例`);
        }
        
        // 处理文件上传
        let url = '';
        let fileName = '';
        let fileSize = null;
        let fileExt = null;
        
        // 如果是通过文件上传
        if (file) {
          if (resourceDto.resourceType === ResourceType.Link) {
            throw new BadRequestException('链接类型资源不需要上传文件');
          }
          
          // 根据资源类型确定保存路径
          const uploadDir = resourceDto.resourceType === ResourceType.Image 
            ? 'ideology/images' 
            : 'ideology/videos';
            
          const uploadResult = await this.uploadService.uploadFile(file, uploadDir);
          url = uploadResult.url;
          fileName = file.originalname || resourceDto.resourceName || '未命名资源';
          fileSize = file.size;
          fileExt = file.originalname ? file.originalname.split('.').pop() : null;
        } 
        // 如果是通过URL添加
        else if (resourceDto.resourceUrl) {
          if (resourceDto.resourceType !== ResourceType.Link) {
            throw new BadRequestException('图片和视频类型资源需要上传文件');
          }
          url = resourceDto.resourceUrl;
          fileName = resourceDto.resourceName || '外部资源';
        } else {
          throw new BadRequestException('未提供文件或资源URL');
        }
        
        // 保存资源记录
        const [result] = await connection.execute(
          `INSERT INTO ideology_resources
           (case_id, resource_type, resource_url, resource_name, file_size, file_extension)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [caseId, resourceDto.resourceType, url, fileName, fileSize, fileExt]
        );
        
        return {
          id: (result as any).insertId,
          case_id: Number(caseId),
          resource_type: Number(resourceDto.resourceType),
          resource_url: url,
          resource_name: fileName,
          file_size: fileSize,
          file_extension: fileExt
        };
      } finally {
        connection.release();
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`上传思政案例资源失败: ${error.message}`, error.stack);
      throw new BadRequestException(`上传思政案例资源失败: ${error.message}`);
    }
  }

  /**
   * 删除思政案例资源
   * @param caseId - 案例ID
   * @param resourceId - 资源ID
   * @returns 删除结果
   */
  async deleteResource(caseId: number, resourceId: number): Promise<any> {
    try {
      const connection = await this.databaseService.getConnection();
      
      try {
        // 查询资源信息
        const [resources] = await connection.execute(
          `SELECT resource_type, resource_url FROM ideology_resources 
           WHERE id = ? AND case_id = ?`,
          [resourceId, caseId]
        );
        
        if (!resources || (resources as any[]).length === 0) {
          throw new NotFoundException(`未找到ID为${resourceId}的资源或资源不属于该案例`);
        }
        
        const resource = (resources as any[])[0];
        
        // 删除资源记录
        const [result] = await connection.execute(
          `DELETE FROM ideology_resources WHERE id = ? AND case_id = ?`,
          [resourceId, caseId]
        );
        
        // 如果是图片或视频，异步删除文件
        if ((resource.resource_type === 1 || resource.resource_type === 2) && 
            resource.resource_url && 
            !resource.resource_url.startsWith('http')) {
          this.uploadService.deleteFile(resource.resource_url).catch(err => {
            this.logger.error(`删除资源文件失败: ${err.message}`, err.stack);
          });
        }
        
        return {
          id: Number(resourceId),
          case_id: Number(caseId),
          deleted: true,
          affected_rows: (result as any).affectedRows
        };
      } finally {
        connection.release();
      }
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      this.logger.error(`删除思政案例资源失败: ${error.message}`, error.stack);
      throw new BadRequestException(`删除思政案例资源失败: ${error.message}`);
    }
  }

  /**
   * 生成讨论题（使用现有的discussions表）
   * @param generateTopicsDto - 生成讨论题的参数
   * @returns 生成的讨论题列表
   */
  async generateDiscussions(generateTopicsDto: GenerateTopicsDto): Promise<any> {
    const { theme, count = 3, type = TopicType.Basic, chapterId, userId = 1 } = generateTopicsDto;

    // 讨论题类型转换
    const discussionTypeMap = {
      [TopicType.Basic]: 1,      // 文化基因
      [TopicType.Critical]: 2,   // 文化传承
      [TopicType.Creative]: 3,   // 文化创新
      [TopicType.Applied]: 4     // 当代中国
    };

    // 讨论题类型描述
    const discussionTypeDescMap = {
      [TopicType.Basic]: '文化基因讨论题',
      [TopicType.Critical]: '文化传承讨论题',
      [TopicType.Creative]: '文化创新讨论题',
      [TopicType.Applied]: '当代中国讨论题',
    };

    // 构建提示词
    const prompt = `
    请生成${count}个关于"${theme}"的${discussionTypeDescMap[type]}。
    这些讨论题将用于课堂教学，要求：
    1. 每个讨论题都应当简洁明了，长度控制在50-100个字之间
    2. 讨论题应该具有思想深度，能够引发学生思考
    3. 避免简单的是非题，倾向于开放性问题
    4. 讨论题应与主题高度相关，符合该类型讨论题的特点
    5. 面向大学生群体设计，注意语言的准确性和专业性
    6. 各讨论题之间应有差异性，避免重复相似的内容
    
    仅输出讨论题列表，每个讨论题单独一行，不要编号，不要其他任何内容。
    `;

    try {
      // 调用AI服务生成内容
      const aiResponse = await this.aiService.generateText(prompt);
      
      if (!aiResponse || !aiResponse.text) {
        throw new BadRequestException('AI生成内容失败');
      }

      // 解析AI生成的内容，提取讨论题列表
      const lines = aiResponse.text.split('\n').filter(line => line.trim().length > 0);
      
      // 确保得到足够数量的讨论题
      const topics = lines.slice(0, count);
      
      // 如果数量不足，补充一些基础讨论题
      if (topics.length < count) {
        const defaultTopics = [
          `请讨论${theme}在当代中国的重要意义和实践价值。`,
          `如何将${theme}融入个人生活和学习中？请分享你的观点和经验。`,
          `从${theme}的角度出发，探讨如何增强文化自信和民族自豪感。`,
          `${theme}在未来发展中可能面临哪些挑战和机遇？`,
          `如何理解${theme}对于个人成长和社会发展的价值？`
        ];
        
        while (topics.length < count && defaultTopics.length > 0) {
          topics.push(defaultTopics.shift());
        }
      }
      
      // 将讨论题存储到数据库
      const discussions = [];
      try {
        const connection = await this.databaseService.getConnection();
        
        // 使用ideology_discussions表
        for (const topic of topics) {
          const [result] = await connection.execute(
            `INSERT INTO ideology_discussions 
             (discussion_theme, content, chapter_id, user_id, discussion_type, is_ai_generated)
             VALUES (?, ?, ?, ?, ?, 1)`,
            [theme, topic, chapterId, userId, discussionTypeMap[type]]
          );
          
          discussions.push({
            id: (result as any).insertId,
            discussion_theme: theme,
            content: topic,
            chapter_id: chapterId,
            user_id: userId,
            discussion_type: discussionTypeMap[type],
            is_ai_generated: 1
          });
        }
        
        connection.release();
      } catch (dbError) {
        // 数据库操作失败不影响返回结果
        this.logger.error(`保存讨论题到数据库失败: ${dbError.message}`, dbError.stack);
      }

      // 返回生成的讨论题
      return {
        code: 200,
        message: '讨论题生成成功',
        data: {
          discussions: discussions.length > 0 ? discussions : topics.map(topic => ({ content: topic })),
          theme,
          type,
          count: topics.length
        }
      };
    } catch (error) {
      this.logger.error(`生成讨论题失败: ${error.message}`, error.stack);
      throw new BadRequestException(`生成讨论题失败: ${error.message}`);
    }
  }

  /**
   * 生成讨论题（兼容现有API）
   * @param generateTopicsDto - 生成讨论题的参数
   * @returns 生成的讨论题列表
   */
  async generateTopics(generateTopicsDto: GenerateTopicsDto): Promise<any> {
    // 调用新的generateDiscussions方法
    const result = await this.generateDiscussions(generateTopicsDto);
    
    // 转换返回格式以兼容旧的API
    if (result && result.data && result.data.discussions) {
      // 从讨论题对象中提取内容字段
      const topics = result.data.discussions.map(discussion => 
        typeof discussion === 'object' ? discussion.content : discussion);
        
      // 保持与旧API相同的返回格式
      return {
        ...result,
        data: {
          ...result.data,
          topics: topics
        }
      };
    }
    
    return result;
  }

  /**
   * 创建思政案例
   * @param caseData 案例数据
   * @returns 创建的案例
   */
  async createCase(caseData: any): Promise<any> {
    try {
      this.logger.log('创建思政案例: ' + JSON.stringify(caseData));
      
      // 获取数据库连接
      const connection = await this.databaseService.getConnection();
      
      try {
        // 开始事务
        await connection.beginTransaction();
        
        // 准备基本参数
        const {
          title,
          content,
          chapter_id,
          user_id = 1,
          case_type = 1,
          case_length = 2,
          is_ai_generated = 1,
          theme
        } = caseData;
        
        // 检查必要参数
        if (!title || !content) {
          throw new BadRequestException('标题和内容不能为空');
        }
        
        // 保存案例基本信息到数据库
        const [result] = await connection.execute(
          `INSERT INTO ideology_cases 
           (title, content, chapter_id, user_id, case_type, case_length, is_ai_generated, theme, created_at, updated_at)
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            title,
            content,
            chapter_id || 1,
            user_id,
            case_type,
            case_length,
            is_ai_generated,
            theme || title
          ]
        );
        
        // 获取插入的ID
        const caseId = result['insertId'];
        
        // 提交事务
        await connection.commit();
        
        // 返回创建的案例ID和数据
        return {
          success: true,
          message: '思政案例创建成功',
          data: {
            id: caseId,
            ...caseData
          }
        };
      } catch (error) {
        // 回滚事务
        await connection.rollback();
        this.logger.error('创建思政案例失败: ' + error.message);
        throw error;
      } finally {
        // 释放连接
        connection.release();
      }
    } catch (error) {
      this.logger.error('创建思政案例服务错误: ' + error.message);
      throw error;
    }
  }

  async saveDiscussionBatch(topics: any[]): Promise<any> {
    if (!Array.isArray(topics) || topics.length === 0) {
      throw new BadRequestException('没有可保存的讨论题');
    }
    const connection = await this.databaseService.getConnection();
    try {
      await connection.beginTransaction();
      for (const topic of topics) {
        await connection.execute(
          `INSERT INTO ideology_discussions 
           (discussion_theme, content, chapter_id, user_id, discussion_type, is_ai_generated)
           VALUES (?, ?, ?, ?, ?, ?)`,
          [
            topic.discussion_theme,
            topic.content,
            topic.chapter_id,
            topic.user_id,
            topic.discussion_type,
            topic.is_ai_generated || 0
          ]
        );
      }
      await connection.commit();
      return { success: true, message: '讨论题批量保存成功', count: topics.length };
    } catch (e) {
      await connection.rollback();
      throw new BadRequestException('保存失败: ' + e.message);
    } finally {
      connection.release();
    }
  }
}