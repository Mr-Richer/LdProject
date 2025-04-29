import { Body, Controller, HttpStatus, Post, Logger, Res, StreamableFile } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { Response } from 'express';

interface PPTOutlineRequest {
  content: string;
  language: string;
  model: string;
}

interface PPTRequest {
  content: string;
  language: string;
  model: string;
}

@ApiTags('PPT生成')
@Controller('tools')
export class PptController {
  private readonly logger = new Logger(PptController.name);

  constructor(
    private readonly aiService: AiService,
  ) {}

  @Post('aippt_outline')
  @ApiOperation({ summary: '生成PPT大纲' })
  @ApiResponse({ status: HttpStatus.OK, description: '成功生成PPT大纲' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '请求参数无效' })
  async generateOutline(@Body() requestDto: PPTOutlineRequest, @Res() res: Response) {
    this.logger.log(`收到生成PPT大纲请求: ${JSON.stringify(requestDto)}`);
    
    try {
      // 使用AI服务生成大纲
      const response = await this.aiService.generateChatResponse([
        { role: 'system', content: '你是一名PPT大纲生成专家。根据用户输入的内容，生成一个结构清晰的PPT大纲。' },
        { role: 'user', content: `根据以下内容生成PPT大纲：\n${requestDto.content}` }
      ]);
      
      // 设置响应头，以支持流式传输
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      // 发送响应内容
      res.write(`data: ${JSON.stringify({ content: response.content })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
    } catch (error) {
      this.logger.error(`生成PPT大纲失败: ${error.message}`, error.stack);
      res.status(HttpStatus.BAD_REQUEST).json({
        error: `生成PPT大纲失败: ${error.message}`
      });
    }
  }

  @Post('aippt')
  @ApiOperation({ summary: '生成完整PPT' })
  @ApiResponse({ status: HttpStatus.OK, description: '成功生成PPT' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: '请求参数无效' })
  async generatePPT(@Body() requestDto: PPTRequest, @Res() res: Response) {
    this.logger.log(`收到生成PPT请求: ${JSON.stringify(requestDto)}`);
    
    try {
      // 使用AI服务生成PPT内容
      const response = await this.aiService.generateChatResponse([
        { role: 'system', content: '你是一名PPT内容生成专家。根据用户输入的内容，生成一个完整的PPT内容，包括多个页面和详细内容。' },
        { role: 'user', content: `根据以下内容生成一个完整的PPT：\n${requestDto.content}` }
      ]);
      
      // 设置响应头，以支持流式传输
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      
      // 发送响应内容
      res.write(`data: ${JSON.stringify({ content: response.content })}\n\n`);
      res.write('data: [DONE]\n\n');
      res.end();
    } catch (error) {
      this.logger.error(`生成PPT失败: ${error.message}`, error.stack);
      res.status(HttpStatus.BAD_REQUEST).json({
        error: `生成PPT失败: ${error.message}`
      });
    }
  }
} 