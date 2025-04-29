import { Injectable, Logger } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

@Injectable()
export class PptConverterUtil {
  private readonly logger = new Logger(PptConverterUtil.name);
  private execPromise = promisify(exec);

  // 将PPTX文件转换为PPTist可用的JSON格式
  async convertPptxToJson(pptxPath: string): Promise<any> {
    try {
      // 检查文件是否存在
      if (!fs.existsSync(pptxPath)) {
        throw new Error(`文件不存在: ${pptxPath}`);
      }

      // 定义输出文件路径
      const outputPath = pptxPath.replace('.pptx', '.json');
      
      // 尝试使用外部命令行工具转换 (如已安装pptx2json工具)
      try {
        this.logger.log(`尝试使用命令行工具转换PPTX: ${pptxPath}`);
        
        // 注意：这里假设系统中已安装了pptx2json工具，如果没有，需要先安装
        // 或使用其他适合的工具/库，例如 pptxtojson
        await this.execPromise(`pptx2json "${pptxPath}" -o "${outputPath}"`);
        
        if (fs.existsSync(outputPath)) {
          const jsonContent = await fs.promises.readFile(outputPath, 'utf8');
          return JSON.parse(jsonContent);
        } else {
          throw new Error('转换失败：输出文件不存在');
        }
      } catch (cmdError) {
        this.logger.error(`命令行转换失败: ${cmdError.message}`);
        
        // 如果命令行转换失败，尝试使用内置的简易转换
        this.logger.warn('尝试使用内置简易转换');
        return await this.simpleConvertPptx(pptxPath);
      }
    } catch (error) {
      this.logger.error(`转换PPTX到JSON失败: ${error.message}`);
      throw error;
    }
  }

  // 简易PPTX转换方法 (当无法使用命令行工具时的后备方案)
  private async simpleConvertPptx(pptxPath: string): Promise<any> {
    // 在这里可以实现一个简易的PPTX解析逻辑
    // 这只是一个示例，实际上解析PPTX需要更复杂的库支持
    
    this.logger.warn('使用简易转换，仅生成基本PPT结构');
    
    // 使用文件名作为标题
    const fileName = path.basename(pptxPath, '.pptx');
    
    // 返回一个基本的PPT模板
    return {
      slides: [
        {
          id: '1',
          elements: [
            {
              id: 'text_1',
              type: 'text',
              content: `${fileName} - 已转换PPT`,
              left: 100,
              top: 100,
              width: 600,
              height: 50
            },
            {
              id: 'text_2',
              type: 'text',
              content: '注意：这是通过简易转换生成的内容，可能无法包含原PPT的全部内容',
              left: 100,
              top: 200,
              width: 600,
              height: 100
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