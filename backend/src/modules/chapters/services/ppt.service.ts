import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as fs from 'fs';
import * as path from 'path';
import { Chapter } from '../entities/chapter.entity';
import { PptConverterUtil } from '../../../common/utils/ppt-converter.util';

@Injectable()
export class PptService {
  private readonly logger = new Logger(PptService.name);

  constructor(
    @InjectRepository(Chapter)
    private chapterRepository: Repository<Chapter>,
    private pptConverterUtil: PptConverterUtil
  ) {}

  // 获取章节PPT内容
  async getPPTContent(chapterId: number): Promise<any> {
    // 查找章节
    const chapter = await this.chapterRepository.findOne({ where: { id: chapterId } });
    if (!chapter) {
      throw new NotFoundException(`未找到ID为${chapterId}的章节`);
    }

    // 检查章节是否有关联的PPT文件
    if (!chapter.ppt_file) {
      throw new NotFoundException(`该章节没有关联的PPT文件`);
    }

    this.logger.log(`章节${chapterId}的PPT路径: ${chapter.ppt_file}`);

    // 获取PPT文件路径
    const pptPath = chapter.ppt_file;

    try {
      // 判断文件类型并处理
      if (pptPath.endsWith('.pptx')) {
        // 将PPTX转换为PPTist可用的JSON格式
        return await this.pptConverterUtil.convertPptxToJson(pptPath);
      } else if (pptPath.endsWith('.json')) {
        // 如果已经是JSON格式，直接读取
        if (!fs.existsSync(pptPath)) {
          throw new NotFoundException(`PPT文件不存在: ${pptPath}`);
        }
        
        const fileContent = await fs.promises.readFile(pptPath, 'utf8');
        return JSON.parse(fileContent);
      } else {
        throw new NotFoundException('不支持的PPT文件格式');
      }
    } catch (error) {
      this.logger.error(`处理PPT文件失败: ${error.message}`);
      
      // 如果文件读取或转换失败，尝试返回默认模板
      if (error instanceof NotFoundException) {
        throw error;
      }
      
      this.logger.warn('尝试返回默认PPT模板');
      return this.getDefaultPptTemplate();
    }
  }

  // 保存章节PPT内容
  async savePPTContent(chapterId: number, pptData: any): Promise<any> {
    // 查找章节
    const chapter = await this.chapterRepository.findOne({ where: { id: chapterId } });
    if (!chapter) {
      throw new NotFoundException(`未找到ID为${chapterId}的章节`);
    }

    // 确定保存路径
    let pptPath = chapter.ppt_file;
    
    // 如果章节没有PPT路径，创建一个新的
    if (!pptPath) {
      const uploadsDir = path.join(process.cwd(), 'uploads', 'ppt');
      
      // 确保目录存在
      if (!fs.existsSync(uploadsDir)) {
        fs.mkdirSync(uploadsDir, { recursive: true });
      }
      
      pptPath = path.join(uploadsDir, `chapter_${chapterId}_ppt.json`);
      
      // 更新章节的PPT路径
      chapter.ppt_file = pptPath;
      await this.chapterRepository.save(chapter);
    }

    // 将PPT数据保存为JSON文件
    await fs.promises.writeFile(pptPath, JSON.stringify(pptData, null, 2), 'utf8');
    this.logger.log(`已将PPT内容保存到: ${pptPath}`);

    return { success: true, pptPath };
  }

  // 获取默认PPT模板
  private getDefaultPptTemplate(): any {
    return {
      slides: [
        {
          id: '1',
          elements: [
            {
              id: 'text_1',
              type: 'text',
              content: '默认PPT模板 - 无法加载原始文件',
              left: 100,
              top: 100,
              width: 600,
              height: 50
            }
          ],
          background: {
            type: 'solid',
            color: '#ffffff'
          }
        }
      ],
      theme: {
        colorScheme: {
          primary: '#2b579a',
          secondary: '#4472c4',
          accent: '#70ad47'
        }
      }
    };
  }
} 