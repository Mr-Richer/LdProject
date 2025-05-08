import { Controller, Get, Post, Body, Param, Query, UseGuards, Delete, ParseIntPipe } from '@nestjs/common';
import { MindmapService } from './mindmap.service';
import { CreateMindmapDto, MindmapStyle } from './dto/create-mindmap.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('api')
export class MindmapController {
  constructor(private readonly mindmapService: MindmapService) {}

  @Post('mindmap')
  @UseGuards(JwtAuthGuard)
  async create(@Body() createMindmapDto: CreateMindmapDto) {
    return this.mindmapService.createWithAI(createMindmapDto);
  }

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

  @Get('mindmap')
  async findAll(@Query('userId') userId?: number) {
    return this.mindmapService.findAll(userId);
  }

  @Get('mindmap/knowledge-points')
  async getKnowledgePoints(@Query('category') category?: string) {
    return this.mindmapService.getKnowledgePoints(category);
  }

  @Get('mindmap/knowledge-point/:id')
  async getKnowledgePointById(@Param('id', ParseIntPipe) id: number) {
    return this.mindmapService.getKnowledgePointById(id);
  }

  @Get('mindmap/:id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.mindmapService.findOne(id);
  }

  @Delete('mindmap/:id')
  @UseGuards(JwtAuthGuard)
  async remove(@Param('id', ParseIntPipe) id: number) {
    return this.mindmapService.remove(id);
  }
} 