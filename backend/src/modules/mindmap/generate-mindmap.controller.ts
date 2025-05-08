import { Controller, Post, Body, HttpException, HttpStatus } from '@nestjs/common';
import { MindmapService } from './mindmap.service';
import { CreateMindmapDto, MindmapStyle } from './dto/create-mindmap.dto';
import { SaveMindmapDto } from './dto/save-mindmap.dto';

@Controller('api')
export class GenerateMindmapController {
  constructor(private readonly mindmapService: MindmapService) {}

  @Post('generate-mindmap')
  async generateMindmap(@Body() request: any) {
    const { topic, depth, language } = request;
    
    const createMindmapDto: CreateMindmapDto = {
      title: `${topic}思维导图`,
      central_topic: topic,
      selectedKnowledgePoints: [],
      keywords: topic,
      max_levels: depth || 3,
      style: MindmapStyle.STANDARD
    };
    
    const result = await this.mindmapService.createWithAI(createMindmapDto);
    
    const detailData = await this.mindmapService.findOne(result.id);
    
    if (detailData && detailData.tree) {
      return {
        code: 200,
        message: '思维导图生成成功',
        data: this.convertToFrontendFormat(detailData.tree, language)
      };
    }
    
    throw new Error('未获取到有效的思维导图节点数据');
  }

  @Post('save-mindmap')
  async saveMindmap(@Body() saveMindmapDto: SaveMindmapDto) {
    try {
      // 提取保存所需的数据
      const { data, chapterId, title, centralTopic } = saveMindmapDto;
      
      // 调用服务方法保存思维导图
      const result = await this.mindmapService.saveMindmapWithChapter(
        data,
        chapterId,
        title || (centralTopic ? `${centralTopic}思维导图` : '思维导图'),
        centralTopic || '中心主题'
      );
      
      return {
        code: 200,
        message: '思维导图保存成功',
        data: result
      };
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: `保存思维导图失败: ${error.message}`,
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  private convertToFrontendFormat(node: any, language = 'zh') {
    if (!node) return null;
    
    const result: any = {
      name: node.name || node.value || '未命名节点',
      value: node.value || node.name || '',
    };
    
    if (node.children && Array.isArray(node.children) && node.children.length > 0) {
      result.children = node.children.map((child: any) => 
        this.convertToFrontendFormat(child, language)
      );
    }
    
    return result;
  }
} 